import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getItinerary, listItineraries, type ItineraryDoc } from "../api";
import { Calendar, Users, MapPin } from "lucide-react";

export default function SavedItineraries() {
  const [items, setItems] = useState<ItineraryDoc[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const data = await listItineraries();
        if (mounted) setItems(data);
      } catch (e: any) {
        if (mounted) {
          const token = localStorage.getItem("token");
          const status = e?.response?.status;
          if (!token || status === 401) {
            setError("You need to be logged in to view saved itineraries.");
          } else {
            setError("Failed to load itineraries. Please try again.");
          }
        }
      }
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <div className="relative h-40 bg-gradient-to-br from-pink-500 via-rose-400 to-fuchsia-500 overflow-hidden">
        <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
          <div className="text-white">
            <h1 className="text-3xl font-bold">Saved Itineraries</h1>
            <p className="text-pink-50">View itineraries saved to your account</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="p-4 rounded-lg border border-pink-200 bg-white text-pink-700">
            <div className="mb-3">{error}</div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/AuthPage')}
                className="px-3 py-2 rounded bg-pink-500 text-white hover:bg-pink-600"
              >
                Go to Login
              </button>
              <button
                onClick={() => { setError(null); setItems(null); /* retry */ (async () => { try { const data = await listItineraries(); setItems(data);} catch (e) { setError("Failed to load itineraries. Please try again."); } })(); }}
                className="px-3 py-2 rounded border border-pink-300 text-pink-700 hover:bg-pink-50"
              >
                Retry
              </button>
            </div>
          </div>
        )}
        {items === null && !error && (
          <div className="p-4 rounded-lg border border-pink-200 bg-white text-pink-700">Loading…</div>
        )}
        {items && items.length === 0 && (
          <div className="p-4 rounded-lg border border-pink-200 bg-white text-pink-700">No saved itineraries found.</div>
        )}
        {items && items.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((it) => (
              <div key={it._id} className="p-4 rounded-lg border border-pink-200 bg-white shadow-sm">
                <div className="flex items-center gap-2 text-pink-900 font-semibold mb-1">
                  <MapPin className="h-4 w-4" /> {it.place || "Itinerary"}
                </div>
                <div className="text-sm text-pink-700 flex items-center gap-4">
                  <span className="flex items-center gap-1"><Calendar className="h-4 w-4" />{it.startDate || "?"} – {it.endDate || "?"}</span>
                  <span className="flex items-center gap-1"><Users className="h-4 w-4" />{it.guests} traveler{it.guests > 1 ? "s" : ""}</span>
                </div>
                <div className="text-xs text-pink-700 mt-2">{it.items?.length || 0} items • {it.totalDays} days</div>
                <div className="mt-4 flex justify-end">
                  <button
                    disabled={openingId === it._id}
                    onClick={async () => {
                      try {
                        setOpeningId(it._id);
                        const full = await getItinerary(it._id);
                        navigate("/TravelItineraryPage", { state: { savedItinerary: full } });
                      } catch (_e) {
                        setError("Failed to open itinerary. Please try again.");
                      } finally {
                        setOpeningId(null);
                      }
                    }}
                    className="px-3 py-2 rounded bg-pink-500 text-white hover:bg-pink-600 disabled:opacity-60"
                  >
                    {openingId === it._id ? "Opening…" : "Open"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


