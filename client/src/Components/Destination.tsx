import { HeaderBlock } from "./HeaderBlock";
import { DestinationCard } from "./DestinationCard";
import { destinations } from "../data/destinations";
import { useNavigate } from "react-router-dom";
import { discoverPlaces, searchFlights, getErrorMessage } from "../api";
import { useState } from "react";

export function Destination () {

  const navigate = useNavigate();
  const [, setIsLoading] = useState(false);

  const handleCardClick = async (queryPlace: string) => {
    if(!queryPlace.trim()) return
    try {
      setIsLoading(true)

      let discovery
      try {
        discovery = await discoverPlaces({
          place: queryPlace.trim(),
          radiusMeters: 5000,
          limit: 20,
          wantHotels: true,
          wantRestaurants: true,
          wantCategories: ["attraction", "museum", "temple", "park", "monument", "zoo"],
        })
      } catch (err) {
        console.error('Discovery Failed', err)
        alert(`search failed: ${getErrorMessage(err)}`)
        return
      }

      let flights: any = undefined
      try {
        flights = await searchFlights({
          fromCity: "Delhi", // ⚡️ replace with state/input if needed
          toCity: queryPlace.trim(),
        })
      } catch (err) {
        console.warn("Flight search failed", err)
        flights = undefined
      }

      navigate("/TravelItineraryPage", {
        state: {
          discovery,
          flights,
          query: queryPlace.trim(),
        },
      })
    } catch (err) {
      console.error("Search failed", err)
      alert(`Could not fetch results. ${getErrorMessage(err)}`)
    } finally {
      setIsLoading(false)
    }
  }


    return (
        <section id="destinations" className="py-20 bg-slate-50 dark:bg-white">
                  <div className="mx-auto w-full max-w-7xl px-4">
                    <HeaderBlock
                      eyebrow="Top Picks"
                      title="Popular Destinations"
                      subtitle="Discover the most enchanting places across India, from serene backwaters to majestic mountains."
                    />
        
                    <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
                      {destinations.map((destination, i) => (
                        <DestinationCard 
                        key={i}
                        destination={destination}
                        onClick={() => handleCardClick(destination.queryPlace)} />
                      ))}
                    </div>
                  </div>
                </section>
    )
}