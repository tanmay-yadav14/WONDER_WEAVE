"use client";

import React, { useMemo, useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ItemCard } from "../Components/ItemCard";
import { ItineraryCard } from "../Components/ItineraryCard";
import { Star, Plane, Hotel, UtensilsCrossed, MapPin, Clock, X, Heart, Save, Calendar, Users, CheckCircle, Coffee, Plus, Download } from "lucide-react";
import { saveItinerary, getErrorMessage, type ItineraryDoc } from "../api";

// Dummy replacements for shadcn/ui components
const Button = (props: any) => <button {...props} />;
const Card = (props: any) => <div {...props} className={`rounded-lg border bg-white shadow ${props.className || ''}`}>{props.children}</div>;
const CardHeader = (props: any) => <div {...props} className={`p-4 border-b bg-gray-50 ${props.className || ''}`}>{props.children}</div>;
const CardTitle = (props: any) => <div {...props} className={`font-bold text-lg ${props.className || ''}`}>{props.children}</div>;
const CardContent = (props: any) => <div {...props} className={`p-4 ${props.className || ''}`}>{props.children}</div>;
const Badge = (props: any) => <span {...props} className={`inline-block rounded px-2 py-1 text-xs font-semibold ${props.className || ''}`}>{props.children}</span>;
const Input = (props: any) => <input {...props} className={`border rounded px-2 py-1 ${props.className || ''}`} />;
const Select = (props: any) => <select {...props} className={`border rounded px-2 py-1 ${props.className || ''}`}>{props.children}</select>;
const SelectItem = (props: any) => <option {...props}>{props.children}</option>;
const Dialog = (props: any) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />
    <div className="relative z-10 w-full max-w-2xl mx-4">
      {props.children}
    </div>
  </div>
);
const DialogContent = (props: any) => (
  <div {...props} className={`bg-white rounded-lg shadow-xl ${props.className || ''}`}>{props.children}</div>
);
const DialogHeader = (props: any) => <div {...props}>{props.children}</div>;
const DialogTitle = (props: any) => <div {...props}>{props.children}</div>;
const DialogDescription = (props: any) => <div {...props}>{props.children}</div>;



// --- All logic and UI from test.tsx below ---

// ...existing ItineraryItem interface and mock data from test.tsx...

interface ItineraryItem {
  id: string;
  type: "flight" | "hotel" | "restaurant" | "attraction" | "rest";
  title: string;
  description: string;
  time?: string;
  price?: string;
  rating?: number;
  image: string;
  day?: number;
  duration?: string;
  category?: string;
  cuisine?: string;
  isCompleted?: boolean;
  attractionCategory?: string;
}

// const flightResults: ItineraryItem[] = [
//   {
//     id: "flight-1",
//     type: "flight",
//     title: "JAL Direct Flight",
//     description: "Japan Airlines • 13h 45m • Premium Economy",
//     price: "$1,450",
//     rating: 4.7,
//     image: "/airplane-sky-clouds.jpg",
//     category: "International",
//   },
//   {
//     id: "flight-2",
//     type: "flight",
//     title: "ANA Connecting Flight",
//     description: "All Nippon Airways • 16h 20m • 1 stop",
//     price: "$980",
//     rating: 4.5,
//     image: "/airplane-sky-clouds.jpg",
//     category: "Budget",
//   },
// ];

const hotelResults: ItineraryItem[] = [
  {
    id: "hotel-1",
    type: "hotel",
    title: "The Ritz-Carlton Tokyo",
    description: "Ultra-luxury hotel in Roppongi with Tokyo Tower views",
    price: "$650/night",
    rating: 4.9,
    image: "/luxury-hotel-tokyo-night.jpg",
    category: "Luxury",
  },
  {
    id: "hotel-2",
    type: "hotel",
    title: "Shibuya Sky Hotel",
    description: "Modern boutique hotel in the heart of Shibuya",
    price: "$280/night",
    rating: 4.4,
    image: "/luxury-hotel-tokyo-night.jpg",
    category: "Boutique",
  },
];

const restaurantResults: ItineraryItem[] = [
  {
    id: "restaurant-1",
    type: "restaurant",
    title: "Narisawa",
    description: "Michelin 2-star innovative Japanese cuisine",
    price: "$400",
    rating: 4.8,
    image: "/sushi-restaurant-japan.jpg",
    category: "Fine Dining",
    cuisine: "Japanese",
  },
  {
    id: "restaurant-2",
    type: "restaurant",
    title: "Tsuta Ramen",
    description: "World's first Michelin-starred ramen shop",
    price: "$12",
    rating: 4.6,
    image: "/ramen-bowl-japanese-restaurant.jpg",
    category: "Local",
    cuisine: "Japanese",
  },
  {
    id: "restaurant-3",
    type: "restaurant",
    title: "L'Atelier de Joël Robuchon",
    description: "French fine dining with Tokyo flair",
    price: "$350",
    rating: 4.7,
    image: "/sushi-restaurant-japan.jpg",
    category: "Fine Dining",
    cuisine: "French",
  },
  {
    id: "restaurant-4",
    type: "restaurant",
    title: "Pizzeria Bianco Tokyo",
    description: "Authentic Neapolitan pizza in Shibuya",
    price: "$25",
    rating: 4.3,
    image: "/ramen-bowl-japanese-restaurant.jpg",
    category: "Casual",
    cuisine: "Italian",
  },
  {
    id: "restaurant-5",
    type: "restaurant",
    title: "Din Tai Fung",
    description: "Famous xiaolongbao and Taiwanese cuisine",
    price: "$30",
    rating: 4.5,
    image: "/sushi-restaurant-japan.jpg",
    category: "Casual",
    cuisine: "Chinese",
  },
  {
    id: "restaurant-6",
    type: "restaurant",
    title: "Gaggan Tokyo",
    description: "Progressive Indian cuisine with molecular gastronomy",
    price: "$280",
    rating: 4.6,
    image: "/ramen-bowl-japanese-restaurant.jpg",
    category: "Fine Dining",
    cuisine: "Indian",
  },
];

const attractionResults: ItineraryItem[] = [
  {
    id: "attraction-1",
    type: "attraction",
    title: "TeamLab Borderless",
    description: "Digital art museum with immersive installations",
    price: "$35",
    rating: 4.8,
    duration: "3-4 hours",
    image: "/senso-ji-temple-tokyo.jpg",
    category: "Museum",
    attractionCategory: "museum",
  },
  {
    id: "attraction-2",
    type: "attraction",
    title: "Meiji Shrine",
    description: "Peaceful Shinto shrine surrounded by forest",
    price: "Free",
    rating: 4.5,
    duration: "1-2 hours",
    image: "/senso-ji-temple-tokyo.jpg",
    category: "Temple",
    attractionCategory: "temple",
  },
  {
    id: "attraction-3",
    type: "attraction",
    title: "Ueno Zoo",
    description: "Japan's oldest zoo featuring giant pandas",
    price: "$6",
    rating: 4.2,
    duration: "2-3 hours",
    image: "/senso-ji-temple-tokyo.jpg",
    category: "Zoo",
    attractionCategory: "zoo",
  },
  {
    id: "attraction-4",
    type: "attraction",
    title: "Tokyo National Museum",
    description: "Largest collection of Japanese cultural artifacts",
    price: "$10",
    rating: 4.4,
    duration: "2-3 hours",
    image: "/senso-ji-temple-tokyo.jpg",
    category: "Museum",
    attractionCategory: "museum",
  },
  {
    id: "attraction-5",
    type: "attraction",
    title: "Senso-ji Temple",
    description: "Ancient Buddhist temple in Asakusa district",
    price: "Free",
    rating: 4.7,
    duration: "1-2 hours",
    image: "/senso-ji-temple-tokyo.jpg",
    category: "Temple",
    attractionCategory: "temple",
  },
  {
    id: "attraction-6",
    type: "attraction",
    title: "Tokyo Skytree",
    description: "World's second tallest structure with panoramic views",
    price: "$25",
    rating: 4.6,
    duration: "2 hours",
    image: "/tokyo-skytree-sunset.jpg",
    category: "Landmark",
    attractionCategory: "landmark",
  },
];

const initialItinerary: ItineraryItem[] = [];


export default function TravelItineraryPage() {
  const location = useLocation() as any;
  const navigate = useNavigate();
  const discovery = location?.state?.discovery as
    | { center: { lat: number; lon: number }; hotels: any[]; restaurants: any[]; places: any[] }
    | undefined;
  const savedItinerary = location?.state?.savedItinerary as ItineraryDoc | undefined;
  const queryPlace = (location?.state?.query as string | undefined) ?? (savedItinerary?.place ?? undefined);
  const flights = location?.state?.flights as any | undefined;
  const fromCity = location?.state?.fromCity as string | undefined;
  const startDate = (location?.state?.startDate as string | undefined) ?? (savedItinerary?.startDate ?? undefined);
  const endDate = (location?.state?.endDate as string | undefined) ?? (savedItinerary?.endDate ?? undefined);
  const guests = (location?.state?.guests as number | undefined) ?? (savedItinerary?.guests ?? 1);
  const totalDaysFromCard = location?.state?.totalDays as number | undefined;

  const totalDays = useMemo(() => {
    if (typeof totalDaysFromCard === "number" && Number.isFinite(totalDaysFromCard)) {
      const clamped = Math.max(1, Math.min(30, Math.floor(totalDaysFromCard)));
      return clamped || 1;
    }
    if (!startDate || !endDate) return 7;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffMs = end.getTime() - start.getTime();
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(30, days || 1));
  }, [startDate, endDate, totalDaysFromCard]);
  // --- All state and logic from test.tsx ---
  // Copied from test.tsx TravelItinerary function
  const [selectedDay, setSelectedDay] = useState(1);
  const [itineraryItems, setItineraryItems] = useState<ItineraryItem[]>(
    () => ((savedItinerary?.items as any[]) as ItineraryItem[] | undefined) ?? initialItinerary
  );
  const [favorites, setFavorites] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  // Removed unused selectedCategory state
  const [selectedCuisine, setSelectedCuisine] = useState("all");
  const [selectedAttractionCategory, setSelectedAttractionCategory] = useState("all");
  const [draggedItem, setDraggedItem] = useState<ItineraryItem | null>(null);
  const [selectedFlight, setSelectedFlight] = useState<ItineraryItem | null>(null);
  const [selectedHotel, setSelectedHotel] = useState<ItineraryItem | null>(null);
  const dragCounter = useRef(0);
  const [showMoreRestaurants, setShowMoreRestaurants] = useState(false);
  const [showMoreHotels, setShowMoreHotels] = useState(false);
  const [showMoreAttractions, setShowMoreAttractions] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showItemSelector, setShowItemSelector] = useState(false);
  const [selectorSearchQuery, setSelectorSearchQuery] = useState("");
  const [selectorCuisine, setSelectorCuisine] = useState("all");
  const [selectorAttractionCategory, setSelectorAttractionCategory] = useState("all");

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => (prev.includes(id) ? prev.filter((fav) => fav !== id) : [...prev, id]));
  };

  const removeFromItinerary = (id: string) => {
    setItineraryItems((prev) => prev.filter((item) => item.id !== id));
  };

  const toggleCompleted = (id: string) => {
    setItineraryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isCompleted: !item.isCompleted } : item)),
    );
  };

  const handleDragStart = (e: React.DragEvent, item: ItineraryItem) => {
    if (item.type === "restaurant" || item.type === "attraction") {
      setDraggedItem(item);
      e.dataTransfer.effectAllowed = "copy";
      e.dataTransfer.setData("text/plain", item.id);
    } else {
      e.preventDefault();
    }
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    dragCounter.current++;
  };

  const handleDragLeave = () => {
    dragCounter.current--;
  };

  const handleDrop = (e: React.DragEvent, day: number) => {
    e.preventDefault();
    dragCounter.current = 0;

    if (draggedItem && (draggedItem.type === "restaurant" || draggedItem.type === "attraction")) {
      const newItem: ItineraryItem = {
        ...draggedItem,
        id: `${draggedItem.id}-${Date.now()}`,
        day: day,
        time: "12:00 PM",
      };
      setItineraryItems((prev) => [...prev, newItem]);
      setDraggedItem(null);
      setShowMoreRestaurants(false);
      setShowMoreAttractions(false);
    }
  };

  // Map discovery data to UI cards (define before using in sources)
  const discoveredRestaurants = useMemo<ItineraryItem[]>(() => {
    if (!discovery?.restaurants) return [];
    return discovery.restaurants.slice(0, 12).map((r, idx) => ({
      id: `restaurant-${r.id ?? idx}`,
      type: "restaurant",
      title: r.name || r.city || "Restaurant",
      description: [r.street, r.city, r.country].filter(Boolean).join(", ") || "",
      price: undefined,
      rating: undefined,
      image: "/sushi-restaurant-japan.jpg",
      category: "Local",
      cuisine: undefined,
    }));
  }, [discovery]);

  const discoveredAttractions = useMemo<ItineraryItem[]>(() => {
    if (!discovery?.places) return [];
    return discovery.places.slice(0, 12).map((p, idx) => ({
      id: `attraction-${p.id ?? idx}`,
      type: "attraction",
      title: p.name || p.city || "Attraction",
      description: [p.street, p.city, p.country].filter(Boolean).join(", ") || "",
      price: undefined,
      rating: undefined,
      duration: undefined,
      image: "/senso-ji-temple-tokyo.jpg",
      category: (p.categories && p.categories[0]) || "Attraction",
      attractionCategory: (p.categories && p.categories[0]) || "attraction",
    }));
  }, [discovery]);

  const discoveredHotels = useMemo<ItineraryItem[]>(() => {
    if (!discovery?.hotels) return [];
    return discovery.hotels.slice(0, 12).map((h, idx) => ({
      id: `hotel-${h.id ?? idx}`,
      type: "hotel",
      title: h.name || h.city || "Hotel",
      description: [h.street, h.city, h.country].filter(Boolean).join(", ") || "",
      price: undefined,
      rating: undefined,
      image: "/luxury-hotel-tokyo-night.jpg",
      category: "Hotel",
    }));
  }, [discovery]);

  const restaurantsSource = discoveredRestaurants.length ? discoveredRestaurants : restaurantResults;
  const attractionsSource = discoveredAttractions.length ? discoveredAttractions : attractionResults;
  const hotelsSource = discoveredHotels.length ? discoveredHotels : hotelResults;

  const filteredRestaurants = restaurantsSource.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCuisine = selectedCuisine === "all" || item.cuisine?.toLowerCase() === selectedCuisine;
    return matchesSearch && matchesCuisine;
  });

  const filteredAttractions = attractionsSource.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      selectedAttractionCategory === "all" || item.category?.toLowerCase() === selectedAttractionCategory;
    return matchesSearch && matchesCategory;
  });

  const dayItems = itineraryItems.filter((item) => item.day === selectedDay);
  const completedCount = dayItems.filter((item) => item.isCompleted).length;
  const totalCount = dayItems.length;

  const addRestDay = (day: number) => {
    const restItem: ItineraryItem = {
      id: `rest-${Date.now()}`,
      type: "rest",
      title: "Rest Day",
      description: "Take a break and relax",
      day: day,
      time: "All Day",
      image: "/diverse-travel-destinations.png",
    };
    setItineraryItems((prev) => [...prev, restItem]);
  };

  const addItemToItinerary = (item: ItineraryItem) => {
    const newItem: ItineraryItem = {
      ...item,
      id: `${item.id}-${Date.now()}`,
      day: selectedDay,
      time: "12:00 PM",
    };
    setItineraryItems((prev) => [...prev, newItem]);
    setShowItemSelector(false);
  };

  const mockRestaurants = restaurantResults;
  const mockAttractions = attractionResults;

  // Map discovery data to UI cards
  

  

  const selectorFilteredItems = [...mockRestaurants, ...mockAttractions].filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(selectorSearchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(selectorSearchQuery.toLowerCase());
    const matchesCuisine = selectorCuisine === "all" || item.cuisine === selectorCuisine;
    const matchesAttractionCategory =
      selectorAttractionCategory === "all" || item.attractionCategory === selectorAttractionCategory;

    return matchesSearch && matchesCuisine && matchesAttractionCategory;
  });

  // ---------- Auto-generate itinerary from discovered places and restaurants ----------
  React.useEffect(() => {
    if (itineraryItems.length > 0) return;
    const maxPerDay = 5;
    const generated: ItineraryItem[] = [];

    const attractions = attractionsSource;
    const restaurants = restaurantsSource;
    if (attractions.length === 0 && restaurants.length === 0) return;

    let attractionIdx = 0;
    let restaurantIdx = 0;

    for (let day = 1; day <= totalDays; day++) {
      const dayItems: ItineraryItem[] = [];
      // Pattern: 2 attractions, 1 restaurant, then optionally 1 attraction, 1 restaurant (max 5)
      const addAttraction = (time: string) => {
        if (attractionIdx < attractions.length && dayItems.length < maxPerDay) {
          const a = attractions[attractionIdx++];
          dayItems.push({ ...a, id: `${a.id}-d${day}-${dayItems.length}`, day, time });
        }
      };
      const addRestaurant = (time: string) => {
        if (restaurantIdx < restaurants.length && dayItems.length < maxPerDay) {
          const r = restaurants[restaurantIdx++];
          dayItems.push({ ...r, id: `${r.id}-d${day}-${dayItems.length}`, day, time });
        }
      };

      addAttraction("10:00 AM");
      addAttraction("12:00 PM");
      addRestaurant("1:30 PM");
      addAttraction("3:30 PM");
      addAttraction("5:00 PM");
      addRestaurant("7:00 PM");

      generated.push(...dayItems);
      if (attractionIdx >= attractions.length && restaurantIdx >= restaurants.length) break;
    }

    if (generated.length) {
      setItineraryItems(generated);
    }
  }, [attractionsSource, restaurantsSource, totalDays]);

  // ---------- Save / Export itinerary ----------
  // const handleDownloadJson = () => {
  //   const payload = {
  //     place: queryPlace || null,
  //     startDate: startDate || null,
  //     endDate: endDate || null,
  //     totalDays,
  //     guests,
  //     items: itineraryItems,
  //   };
  //   const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
  //   const url = URL.createObjectURL(blob);
  //   const a = document.createElement("a");
  //   const fileNameBase = `${(queryPlace || "itinerary").toString().replace(/\s+/g, "-")}`;
  //   a.href = url;
  //   a.download = `${fileNameBase}-${startDate || ""}-${endDate || ""}.json`;
  //   document.body.appendChild(a);
  //   a.click();
  //   a.remove();
  //   URL.revokeObjectURL(url);
  // };

  // const handleSaveToLocal = () => {
  //   try {
  //     const key = `itinerary:${queryPlace || "default"}`;
  //     const payload = {
  //       place: queryPlace || null,
  //       startDate: startDate || null,
  //       endDate: endDate || null,
  //       totalDays,
  //       guests,
  //       items: itineraryItems,
  //       savedAt: new Date().toISOString(),
  //     };
  //     localStorage.setItem(key, JSON.stringify(payload));
  //     alert("Itinerary saved locally on this device.");
  //   } catch (e) {
  //     alert("Failed to save itinerary");
  //   }
  // };

  const handleSaveToAccount = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please log in to save itineraries to your account.");
      navigate('/AuthPage');
      return;
    }
    try {
      const payload = {
        place: queryPlace || null,
        startDate: startDate || null,
        endDate: endDate || null,
        totalDays,
        guests,
        items: itineraryItems,
      };
      await saveItinerary(payload);
      alert("Itinerary saved to your account.");
    } catch (e: any) {
      alert(`Failed to save to account: ${getErrorMessage(e)}`);
    }
  };

  const handlePrintPdf = () => {
    const title = queryPlace ? `${queryPlace} Itinerary` : "Travel Itinerary";
    // Avoid popup blockers by printing via a hidden iframe.

    const dateLine = startDate && endDate
      ? `${new Date(startDate).toLocaleDateString()} – ${new Date(endDate).toLocaleDateString()} (${totalDays} days)`
      : `${totalDays} days`;

    const guestLine = `${guests} Traveler${guests > 1 ? 's' : ''}`;

    const byDay = new Map<number, typeof itineraryItems>();
    itineraryItems.forEach((it) => {
      if (!it.day) return;
      const arr = byDay.get(it.day) || [] as typeof itineraryItems;
      (arr as any).push(it);
      byDay.set(it.day, arr);
    });

    const daySections = Array.from({ length: totalDays }, (_, i) => i + 1)
      .map((day) => {
        const items = (byDay.get(day) || []).map((it) => `
          <div class="card">
            <div class="card-left ${it.type}"></div>
            <div class="card-body">
              <div class="card-title-row">
                <div class="badge ${it.type}">${it.type}</div>
                <h4 class="card-title">${it.title || "Untitled"}</h4>
                ${it.time ? `<span class="chip">${it.time}</span>` : ""}
                ${it.duration ? `<span class="chip subtle">${it.duration}</span>` : ""}
              </div>
              <div class="card-desc">${it.description || ""}</div>
            </div>
          </div>
        `).join("");
        return `
          <section class="day">
            <h3 class="day-title">Day ${day}</h3>
            ${items || `<div class="empty">No items planned.</div>`}
          </section>
        `;
      }).join("");

    const html = `
<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${title}</title>
  <style>
    :root {
      --bg: #ffffff;
      --fg: #111827;
      --muted: #6b7280;
      --primary: #ec4899; /* pink-500 */
      --primary-600: #db2777;
      --accent: #f97316; /* orange-500 */
      --ring: rgba(236,72,153,0.15);
      --border: #fbcfe8; /* pink-200 */
    }
    * { box-sizing: border-box; }
    body { margin: 0; font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial; color: var(--fg); background: linear-gradient(135deg, #fff7ed 0%, #fff1f2 100%); }
    .container { max-width: 960px; margin: 0 auto; padding: 32px 20px; }
    .hero {
      position: relative; border-radius: 16px; overflow: hidden; padding: 28px; margin-bottom: 20px;
      background: linear-gradient(135deg, rgba(249,168,212,0.25), rgba(253,186,116,0.25));
      border: 1px solid var(--border);
    }
    .title { margin: 0 0 6px; font-size: 28px; font-weight: 800; background: linear-gradient(90deg, var(--accent), var(--primary)); -webkit-background-clip: text; background-clip: text; color: transparent; }
    .subtitle { margin: 6px 0 12px; color: var(--muted); font-size: 14px; }
    .meta { display: flex; gap: 16px; color: var(--fg); font-size: 13px; }
    .badge { display: inline-block; padding: 2px 8px; border-radius: 999px; font-weight: 600; font-size: 11px; color: #fff; background: var(--primary); }
    .badge.hotel { background: #f43f5e; }
    .badge.restaurant { background: #a21caf; }
    .badge.attraction { background: #db2777; }
    .chip { display: inline-block; margin-left: 8px; padding: 2px 8px; border-radius: 999px; border: 1px solid var(--border); font-size: 11px; color: var(--fg); }
    .chip.subtle { color: var(--muted); }
    .day { margin-top: 18px; }
    .day-title { margin: 0 0 10px; font-size: 18px; color: var(--fg); }
    .card { display: flex; border: 1px solid var(--border); border-radius: 12px; background: #fff; box-shadow: 0 6px 18px rgba(236,72,153,0.08); margin-bottom: 10px; }
    .card-left { width: 6px; border-top-left-radius: 12px; border-bottom-left-radius: 12px; background: var(--primary); }
    .card-left.hotel { background: #f43f5e; }
    .card-left.restaurant { background: #a21caf; }
    .card-left.attraction { background: #db2777; }
    .card-body { padding: 12px 16px; flex: 1; }
    .card-title-row { display: flex; align-items: center; gap: 8px; margin-bottom: 4px; }
    .card-title { margin: 0; font-size: 14px; font-weight: 700; color: var(--fg); }
    .card-desc { font-size: 12px; color: var(--muted); }
    .empty { padding: 10px; border: 1px dashed var(--border); color: var(--muted); border-radius: 10px; background: #fff; }
    @media print { body { background: #fff; } .hero { box-shadow: none; } }
  </style>
  <script>window.onload = () => { setTimeout(() => window.print(), 100); };</script>
</head>
<body>
  <div class="container">
    <div class="hero">
      <h1 class="title">${title}</h1>
      <div class="subtitle">${dateLine} • ${guestLine}</div>
      <div class="meta">Center: ${discovery?.center ? `${discovery.center.lat.toFixed(3)}, ${discovery.center.lon.toFixed(3)}` : "N/A"}</div>
    </div>
    ${daySections}
  </div>
</body>
</html>`;

    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.setAttribute("aria-hidden", "true");

    const cleanup = () => {
      try { iframe.remove(); } catch (_) {}
    };

    iframe.onload = () => {
      try {
        const w = iframe.contentWindow;
        if (!w) throw new Error("No iframe window");
        // Give layout a tick before printing.
        setTimeout(() => {
          try {
            w.focus();
            w.print();
          } finally {
            // Cleanup after print dialog is opened.
            setTimeout(cleanup, 1000);
          }
        }, 50);
      } catch (_e) {
        cleanup();
        alert("Unable to start PDF download. Please try again.");
      }
    };

    document.body.appendChild(iframe);
    const doc = iframe.contentDocument;
    if (!doc) {
      cleanup();
      return alert("Unable to start PDF download. Please try again.");
    }
    doc.open();
    doc.write(html);
    doc.close();
  };

  // --- Full JSX from test.tsx ---
  return (
    <>
      {/* --- Begin full JSX from test.tsx TravelItinerary return --- */}
      <div className="min-h-screen bg-background">
        <div className="relative h-96 bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-500 overflow-hidden">
          <div
            className="absolute inset-0 bg-cover bg-center opacity-20"
            style={{
              backgroundImage: "url('/tokyo-skyline-cherry-blossoms-sunset.jpg')",
            }}
          />
          <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
            <div className="text-white max-w-2xl">
              <h1 className="text-5xl font-bold mb-4 text-balance">{queryPlace?.toUpperCase() ? `${queryPlace?.toUpperCase()} Discoveries` : "Tokyo Cherry Blossom Journey"}</h1>
              <p className="text-xl mb-6 text-pink-50 text-pretty">
                {startDate && endDate ? (
                  <span>
                    {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()} • {guests} Traveler{guests > 1 ? 's' : ''}
                  </span>
                ) : (
                  <span>Your personalized {totalDays}-day adventure</span>
                )}
              </p>
              <div className="flex items-center gap-4 text-sm">
                {startDate && endDate && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(startDate).toLocaleDateString()} – {new Date(endDate).toLocaleDateString()} ({totalDays} days)
                    </span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span>{guests} Traveler{guests > 1 ? 's' : ''}</span>
                </div>
                {/* <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  
                </div> */}
              </div>
            </div>
          </div>
        </div>

        {/* --- The rest of the JSX is identical to the TravelItinerary return in test.tsx --- */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Flight Selection */}
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-6 w-6 text-pink-500" />
                  <span className="text-xl text-pink-900">Select Your Flight</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {(flights?.fligths?.length
                    ? flights.fligths
                    : []).map((flight: any, idx: number) => (
                    <div
                      key={flight.id ?? idx}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedFlight?.id === flight.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-pink-200 hover:border-pink-300 bg-white"
                      }`}
                      onClick={() => setSelectedFlight(flight)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-pink-900">{flight.title ?? `${flight.airline ?? "Flight"} ${flight.flightNumber ?? ""}`}</h4>
                          <p className="text-sm text-pink-700">
                            {flight.description ?? `${flight.departure?.airport ?? fromCity ?? "Departure"} → ${flight.arrival?.airport ?? queryPlace ?? "Arrival"}`}
                          </p>
                          <div className="flex items-center gap-4 mt-2">
                            {flight.price ? (
                              <span className="font-bold text-pink-600">{flight.price}</span>
                            ) : (
                              <span className="text-pink-700">{flight.flightDate ?? flight.departure?.scheduled ?? ""}</span>
                            )}
                            <div className="flex items-center gap-1">
                              {flight.rating ? (
                                <>
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span className="text-sm text-pink-800 font-medium">{flight.rating}</span>
                                </>
                              ) : (
                                <span className="text-sm text-pink-800 font-medium">{flight.status ?? ""}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        {selectedFlight?.id === flight.id && <CheckCircle className="h-6 w-6 text-pink-500" />}
                      </div>
                    </div>
                  ))}
                  {(!flights || !flights.fligths || flights.fligths.length === 0) && (
                    <div className="p-4 rounded-lg border-2 border-pink-200 bg-white text-pink-700">
                      No direct flights available.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Hotel Selection */}
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50">
                <CardTitle className="flex items-center gap-2">
                  <Hotel className="h-6 w-6 text-pink-500" />
                  <span className="text-xl text-pink-900">Select Your Hotel</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <div />
                  <Button
                    className="text-pink-600 hover:underline text-sm"
                    onClick={() => setShowMoreHotels((v) => !v)}
                  >
                    {showMoreHotels ? "Show Less" : "Show More"}
                  </Button>
                </div>
                <div className="space-y-3">
                  {(showMoreHotels ? hotelsSource : hotelsSource.slice(0, 3)).map((hotel) => (
                    <div
                      key={hotel.id}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                        selectedHotel?.id === hotel.id
                          ? "border-pink-500 bg-pink-50"
                          : "border-pink-200 hover:border-pink-300 bg-white"
                      }`}
                      onClick={() => setSelectedHotel(hotel)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="font-semibold text-pink-900">{hotel.title}</h4>
                          <p className="text-sm text-pink-700">{hotel.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="font-bold text-pink-600">{hotel.price}</span>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              <span className="text-sm text-pink-800 font-medium">{hotel.rating}</span>
                            </div>
                          </div>
                        </div>
                        {selectedHotel?.id === hotel.id && <CheckCircle className="h-6 w-6 text-pink-500" />}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          {/* Restaurants & Attractions Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Restaurants */}
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UtensilsCrossed className="h-6 w-6 text-pink-500" />
                  <span className="text-xl text-pink-900">Top Restaurants</span>
                </CardTitle>
                <Button
                  className="text-pink-600 hover:underline text-sm"
                  onClick={() => setShowMoreRestaurants((v) => !v)}
                >
                  {showMoreRestaurants ? "Show Less" : "Show More"}
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Input
                    placeholder="Search restaurants..."
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="w-40"
                  />
                  <Select
                    value={selectedCuisine}
                    onChange={(e: any) => setSelectedCuisine(e.target.value)}
                  >
                    <SelectItem value="all">All Cuisines</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {(showMoreRestaurants ? filteredRestaurants : filteredRestaurants.slice(0, 3)).map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <button
                        className={`ml-2 text-pink-400 hover:text-pink-600 transition-colors`}
                        onClick={() => toggleFavorite(item.id)}
                      >
                        {favorites.includes(item.id) ? <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : <Heart className="h-4 w-4" />}
                      </button>
                    </ItemCard>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Attractions */}
            <Card className="border-pink-200 shadow-lg">
              <CardHeader className="bg-gradient-to-r from-pink-50 to-rose-50 flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-6 w-6 text-pink-500" />
                  <span className="text-xl text-pink-900">Top Attractions</span>
                </CardTitle>
                <Button
                  className="text-pink-600 hover:underline text-sm"
                  onClick={() => setShowMoreAttractions((v) => !v)}
                >
                  {showMoreAttractions ? "Show Less" : "Show More"}
                </Button>
              </CardHeader>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-2 mb-4">
                  <Input
                    placeholder="Search attractions..."
                    value={searchQuery}
                    onChange={(e: any) => setSearchQuery(e.target.value)}
                    className="w-40"
                  />
                  <Select
                    value={selectedAttractionCategory}
                    onChange={(e: any) => setSelectedAttractionCategory(e.target.value)}
                  >
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="temple">Temple</SelectItem>
                    <SelectItem value="zoo">Zoo</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                  </Select>
                </div>
                <div className="grid grid-cols-1 gap-3">
                  {(showMoreAttractions ? filteredAttractions : filteredAttractions.slice(0, 3)).map((item) => (
                    <ItemCard
                      key={item.id}
                      item={item}
                      onDragStart={handleDragStart}
                      onDragEnd={handleDragEnd}
                    >
                      <button
                        className={`ml-2 text-pink-400 hover:text-pink-600 transition-colors`}
                        onClick={() => toggleFavorite(item.id)}
                      >
                        {favorites.includes(item.id) ? <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : <Heart className="h-4 w-4" />}
                      </button>
                    </ItemCard>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Timeline & Itinerary */}
          <div className="bg-white rounded-lg shadow-lg border border-pink-200 p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Clock className="h-6 w-6 text-pink-500" />
                <span className="text-xl font-bold text-pink-900">Day {selectedDay} Itinerary</span>
                <Badge className="bg-pink-100 text-pink-700 ml-2">
                  {completedCount}/{totalCount} Completed
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  className="bg-pink-500 text-white px-3 py-1 rounded hover:bg-pink-600"
                  onClick={() => addRestDay(selectedDay)}
                >
                  <Coffee className="h-4 w-4 mr-1 inline" /> Add Rest Day
                </Button>
                <Button
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded hover:bg-pink-200"
                  onClick={() => setShowItemSelector(true)}
                >
                  <Plus className="h-4 w-4 mr-1 inline" /> Add Item
                </Button>
                <Button
                  className="bg-pink-100 text-pink-700 px-3 py-1 rounded hover:bg-pink-200"
                  onClick={() => setShowSaveDialog(true)}
                >
                  <Save className="h-4 w-4 mr-1 inline" /> Save
                </Button>
              </div>
            </div>
            <div
              className="min-h-[120px]"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, selectedDay)}
              onDragEnter={handleDragEnter}
              onDragLeave={handleDragLeave}
            >
              {dayItems.length === 0 ? (
                <div className="text-pink-400 text-center py-8">Drag items here to build your day!</div>
              ) : (
                <div className="space-y-3">
                  {dayItems.map((item, idx) => (
                    <ItineraryCard
                      key={item.id}
                      item={item}
                      index={idx}
                      favorites={favorites}
                      onToggleCompleted={toggleCompleted}
                      onToggleFavorite={toggleFavorite}
                      onRemove={removeFromItinerary}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Day Selector */}
          <div className="flex justify-center gap-2 mb-8">
            {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => (
              <Button
                key={day}
                className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-lg border-2 transition-all duration-200 ${
                  selectedDay === day
                    ? "bg-pink-500 text-white border-pink-500"
                    : "bg-white text-pink-700 border-pink-200 hover:bg-pink-50"
                }`}
                onClick={() => setSelectedDay(day)}
              >
                {day}
              </Button>
            ))}
          </div>

          {/* Save Dialog */}
          {showSaveDialog && (
            <Dialog>
              <DialogContent className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Save className="h-5 w-5 text-pink-500" /> Save Itinerary
                  </DialogTitle>
                </DialogHeader>
                <DialogDescription className="mb-4 text-pink-800">
                  Download or share your personalized{" "}
                  <span className="font-semibold">{(queryPlace || "travel").toUpperCase()}</span>{" "}
                  itinerary.
                </DialogDescription>
                <div className="flex gap-4">
                  <Button onClick={handlePrintPdf} className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download PDF
                  </Button>
                  {/* <Button onClick={handleDownloadJson} className="bg-pink-100 text-pink-700 px-4 py-2 rounded hover:bg-pink-200 flex items-center gap-2">
                    <Download className="h-4 w-4" /> Download JSON
                  </Button> */}
                  {/* <Button onClick={handleSaveToLocal} className="bg-pink-100 text-pink-700 px-4 py-2 rounded hover:bg-pink-200 flex items-center gap-2">
                    <Share2 className="h-4 w-4" /> Save Locally
                  </Button> */}
                  <Button onClick={handleSaveToAccount} className="bg-rose-500 text-white px-4 py-2 rounded hover:bg-rose-600 flex items-center gap-2">
                    <Save className="h-4 w-4" /> Save to Account
                  </Button>
                  <Button className="ml-auto" onClick={() => setShowSaveDialog(false)}>
                    <X className="h-5 w-5 text-pink-400" />
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}

          {/* Item Selector Dialog */}
          {showItemSelector && (
            <Dialog>
              <DialogContent className="max-w-lg mx-auto bg-white rounded-lg shadow-lg p-6">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Plus className="h-5 w-5 text-pink-500" /> Add Item to Day {selectedDay}
                  </DialogTitle>
                </DialogHeader>
                <div className="flex flex-wrap gap-2 mb-4">
                  <Input
                    placeholder="Search..."
                    value={selectorSearchQuery}
                    onChange={(e: any) => setSelectorSearchQuery(e.target.value)}
                    className="w-40"
                  />
                  <Select
                    value={selectorCuisine}
                    onChange={(e: any) => setSelectorCuisine(e.target.value)}
                  >
                    <SelectItem value="all">All Cuisines</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="italian">Italian</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="indian">Indian</SelectItem>
                  </Select>
                  <Select
                    value={selectorAttractionCategory}
                    onChange={(e: any) => setSelectorAttractionCategory(e.target.value)}
                  >
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="museum">Museum</SelectItem>
                    <SelectItem value="temple">Temple</SelectItem>
                    <SelectItem value="zoo">Zoo</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                  </Select>
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {selectorFilteredItems.length === 0 ? (
                    <div className="text-pink-400 text-center py-8">No items found.</div>
                  ) : (
                    selectorFilteredItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                      >
                        <button
                          className={`ml-2 text-pink-400 hover:text-pink-600 transition-colors`}
                          onClick={() => toggleFavorite(item.id)}
                        >
                          {favorites.includes(item.id) ? <Heart className="h-4 w-4 fill-red-500 text-red-500" /> : <Heart className="h-4 w-4" />}
                        </button>
                        <Button
                          className="ml-2 bg-pink-500 text-white px-2 py-1 rounded hover:bg-pink-600"
                          onClick={() => addItemToItinerary(item)}
                        >
                          <Plus className="h-4 w-4 inline" /> Add
                        </Button>
                      </ItemCard>
                    ))
                  )}
                </div>
                <div className="flex justify-end mt-4">
                  <Button className="" onClick={() => setShowItemSelector(false)}>
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        </div>
      {/* --- End full JSX from test.tsx TravelItinerary return --- */}
  </>
  );
}
