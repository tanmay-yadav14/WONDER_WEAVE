import type { Request, Response } from 'express';
import { z } from 'zod';
import { LRUCache } from 'lru-cache';
import qs from 'qs';
import { geocode, fetchPlaces, categories } from '../services/geoapify.service';
import { isVegetarianFriendly, normalizeCuisines, distanceSort } from '../utils/geoapify';

const responseCache = new LRUCache<string, any>({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutes
});

function cacheKey(prefix: string, payload: Record<string, any>) {
  // Stable stringify for consistent keys across requests.
  return `${prefix}:${qs.stringify(payload, { arrayFormat: 'brackets', sort: (a, b) => a.localeCompare(b) })}`;
}

const placeOrCoords = z.object({
  place: z.string().trim().min(1).optional(),
  lat: z.coerce.number().optional(),
  lon: z.coerce.number().optional(),
  radiusMeters: z.coerce.number().min(100).max(20000).default(5000),
  limit: z.coerce.number().min(1).max(100).default(parseInt(process.env.DEFAULT_LIMIT || '20', 10))
}).refine(d => !!d.place || (typeof d.lat === 'number' && typeof d.lon === 'number'), {
  message: 'Provide either place or lat & lon'
});

export async function geocodeHandler(req: Request, res: Response) {
  const q = z.object({ place: z.string().min(1) }).parse(req.query);
  const ck = cacheKey('geocodeHandler', { place: q.place.trim().toLowerCase() });
  const cached = responseCache.get(ck);
  if (cached) return res.json(cached);
  const ll = await geocode(q.place);
  if (!ll) return res.status(404).json({ error: { message: 'Place not found' } });
  responseCache.set(ck, ll);
  res.json(ll);
}

async function ensureCoords(q: z.infer<typeof placeOrCoords>) {
  if (typeof q.lat === 'number' && typeof q.lon === 'number') {
    return { lat: q.lat, lon: q.lon };
  }
  if (!q.place) throw { status: 400, message: 'place is required if lat/lon not provided' };
  const ll = await geocode(q.place);
  if (!ll) throw { status: 404, message: 'Place not found' };
  return ll;
}

// -------- Hotels --------
export async function hotelsHandler(req: Request, res: Response) {
  const q = placeOrCoords.parse(req.query as any);
  const center = await ensureCoords(q);
  const ck = cacheKey('hotelsHandler', { ...q, center });
  const cached = responseCache.get(ck);
  if (cached) return res.json(cached);

  const features = await fetchPlaces(
    categories.hotels,
    center,
    q.radiusMeters!,
    q.limit!
  );

  const cleaned = features
    .sort(distanceSort)
    .map(toClientPlace);

  const out = { center, count: cleaned.length, results: cleaned };
  responseCache.set(ck, out);
  res.json(out);
}

// -------- Restaurants --------
export async function restaurantsHandler(req: Request, res: Response) {
  const q = placeOrCoords.safeExtend({
    diet: z.enum(['veg', 'non-veg']).optional(),
    cuisines: z.string().optional() // comma-separated
  }).parse(req.query as any);

  const center = await ensureCoords(q);
  const ck = cacheKey('restaurantsHandler', { ...q, center });
  const cached = responseCache.get(ck);
  if (cached) return res.json(cached);

  const cuisineHints = normalizeCuisines(q.cuisines?.split(','));
  const features = await fetchPlaces(
    categories.restaurants,
    center,
    q.radiusMeters!,
    q.limit!,
    { cuisineHints }
  );

  let filtered = features;

  if (q.diet === 'veg') {
    filtered = filtered.filter(isVegetarianFriendly);
  }

  // Optional: if q.diet === 'non-veg' and you want to *exclude* pure veg-only:
  // filtered = filtered.filter(f => !isVegOnly(f));

  const cleaned = filtered
    .sort(distanceSort)
    .map(toClientPlace);

  const out = { center, count: cleaned.length, results: cleaned };
  responseCache.set(ck, out);
  res.json(out);
}

// -------- Attractions / categories --------
export async function placesByCategoriesHandler(req: Request, res: Response) {
  const q = placeOrCoords.safeExtend({
    categories: z.string().min(1) // comma: attraction,museum,zoo,temple,park,monument
  }).parse(req.query as any);

  const center = await ensureCoords(q);
  const ck = cacheKey('placesByCategoriesHandler', { ...q, center });
  const cached = responseCache.get(ck);
  if (cached) return res.json(cached);

  const keys = q.categories.split(',').map(s => s.trim().toLowerCase());
  const cats = categories.fromKeys(keys);
  if (cats.length === 0) {
    return res.status(400).json({ error: { message: 'No valid categories provided' } });
  }

  const features = await fetchPlaces(
    cats,
    center,
    q.radiusMeters!,
    q.limit!
  );

  const cleaned = features
    .sort(distanceSort)
    .map(toClientPlace);

  const out = { center, count: cleaned.length, results: cleaned };
  responseCache.set(ck, out);
  res.json(out);
}

// -------- One-shot Discover (hotels + restaurants + categories) --------
export async function discoverHandler(req: Request, res: Response) {
  const body = z.object({
    place: z.string().optional(),
    lat: z.number().optional(),
    lon: z.number().optional(),
    radiusMeters: z.number().min(100).max(20000).default(5000),
    limit: z.number().min(1).max(100).default(parseInt(process.env.DEFAULT_LIMIT || '20', 10)),

    wantHotels: z.boolean().default(true),
    wantRestaurants: z.boolean().default(true),
    restaurantFilter: z.object({
      diet: z.enum(['veg', 'non-veg']).optional(),
      cuisines: z.array(z.string()).optional()
    }).optional(),

    wantCategories: z.array(z.enum(['attraction','museum','zoo','temple','park','monument'])).default(['attraction','museum'])
  }).parse(req.body);

  const center = await ensureCoords(body as any);
  const ck = cacheKey('discoverHandler', {
    ...body,
    // normalize place to avoid cache misses due to case/whitespace
    place: body.place?.trim().toLowerCase(),
    center,
    restaurantFilter: body.restaurantFilter
      ? {
          ...body.restaurantFilter,
          cuisines: normalizeCuisines(body.restaurantFilter.cuisines),
        }
      : undefined,
  });
  const cached = responseCache.get(ck);
  if (cached) return res.json(cached);

  let hotels: any[] = [];
  let restaurants: any[] = [];
  let places: any[] = [];

  if (body.wantHotels) {
    const hotelFeatures = await fetchPlaces(
      categories.hotels, center, body.radiusMeters, body.limit
    );
    hotels = hotelFeatures.sort(distanceSort).map(toClientPlace);
  }

  if (body.wantRestaurants) {
    const cuisineHints = normalizeCuisines(body.restaurantFilter?.cuisines);
    let restFeatures = await fetchPlaces(
      categories.restaurants, center, body.radiusMeters, body.limit, { cuisineHints }
    );
    if (body.restaurantFilter?.diet === 'veg') {
      restFeatures = restFeatures.filter(isVegetarianFriendly);
    }
    restaurants = restFeatures.sort(distanceSort).map(toClientPlace);
  }

  if (body.wantCategories?.length) {
    const cats = categories.fromKeys(body.wantCategories);
    if (cats.length) {
      const catFeatures = await fetchPlaces(
        cats, center, body.radiusMeters, body.limit
      );
      places = catFeatures.sort(distanceSort).map(toClientPlace);
    }
  }

  const out = {
    center,
    hotels,
    restaurants,
    places
  };
  responseCache.set(ck, out);
  res.json(out);
}

// ---------- Helpers ----------
function toClientPlace(f: any) {
  const p = f?.properties || {};
  return {
    id: p.place_id || p.osm_id || p.datasource?.raw?.id || p.name || `${p.lat},${p.lon}`,
    name: p.name,
    categories: p.categories,
    street: p.street,
    city: p.city || p.address_line2 || p.county,
    state: p.state,
    country: p.country,
    postcode: p.postcode,
    website: p.website,
    phone: p.datasource?.raw?.phone || p.tel,
    lat: p.lat,
    lon: p.lon,
    distance: p.distance,
    datasource: p.datasource,
    raw: f
  };
}
