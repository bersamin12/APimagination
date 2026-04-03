import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import TravelMapView from "../components/TravelMapView";
import Navbar from "../components/Navbar";
import AnimatedCounter from "../components/AnimatedCounter";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

function MapPage({ theme, toggleTheme }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async () => {
    try {
      const res = await api.get("/places");
      setPlaces(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { fetchPlaces(); }, []);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (query.trim().length < 2) { setResults([]); return; }
      setLoading(true);
      try {
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSavePlace = async (place) => {
    try {
      await api.post("/places", place);
      setMessage(`Saved ${place.name}`);
      setQuery("");
      setResults([]);
      fetchPlaces();
    } catch (err) {
      setMessage(err.response?.status === 409 ? "Already saved" : "Failed to save place");
    }
  };

  const cityCount = places.filter((p) => p.type === "city").length;
  const countryCount = places.filter((p) => p.type === "country").length;
  const latestPlace = places[0]?.name || "No saved places yet";

  return (
    <div className="min-h-screen px-8 py-8 pb-16">
      <div className="max-w-[1320px] mx-auto space-y-6">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* MAP SHELL */}
        <div className="relative h-[660px] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-900">

          {/* MAP LAYER */}
          <div className="absolute inset-0 z-0">
            <TravelMapView places={places} />
          </div>

          {/* OVERLAY */}
          <div className="absolute inset-0 z-50 pointer-events-none">

            {/* SEARCH — top center */}
            <div className="pointer-events-auto absolute top-4 left-1/2 -translate-x-1/2 w-[44%] min-w-[300px]">
              <Input
                placeholder="Add a city or country"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="rounded-full shadow-md bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-600 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 h-11 px-5"
              />

              {loading && (
                <Card className="mt-2 px-4 py-3 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md">
                  Searching...
                </Card>
              )}

              {!loading && query.length >= 2 && results.length === 0 && (
                <Card className="mt-2 px-4 py-3 text-sm text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md">
                  No results found
                </Card>
              )}

              {results.length > 0 && (
                <Card className="mt-2 p-2 bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 shadow-md">
                  {results.map((place, i) => (
                    <div
                      key={place.externalId}
                      onClick={() => handleSavePlace(place)}
                      className="px-3 py-2.5 rounded-lg cursor-pointer hover:bg-sky-50 dark:hover:bg-slate-700 transition-colors"
                    >
                      <div className="font-semibold text-slate-800 dark:text-slate-100">
                        {place.name}{" "}
                        <span className="text-sm font-normal text-slate-400">({place.type})</span>
                      </div>
                      <div className="text-xs text-slate-400 mt-0.5">{place.countryName}</div>
                      {i !== results.length - 1 && <div className="border-t border-slate-100 dark:border-slate-700 mt-2" />}
                    </div>
                  ))}
                </Card>
              )}

              {message && (
                <Badge className="mt-2 shadow-sm">{message}</Badge>
              )}
            </div>

            {/* STATUS — top left */}
            <Card className="pointer-events-auto absolute top-4 left-4 w-44 p-4 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
              <div className="uppercase text-[12px] text-slate-400 dark:text-slate-500 font-medium">
                Status
              </div>
              <Badge variant="secondary" className="text-l m-0">Explorer</Badge>
              <div className="space-y-1 pt-1">
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                  <AnimatedCounter value={countryCount} />
                </div>
                <div className="text-xs text-slate-400 mt-1">Countries</div>
                <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 leading-none">
                  <AnimatedCounter value={cityCount} />
                </div>
                <div className="text-xs text-slate-400 mt-1">Cities</div>
              </div>
            </Card>

            {/* LAST DESTINATION */}
            <Card className="pointer-events-auto absolute top-[40%] left-4 w-44 p-4 dark:bg-slate-800/95 border-slate-200 dark:border-slate-700">
              <div className="text-[10px] uppercase text-slate-400 dark:text-slate-500 font-medium">
                Last Destination
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-snug">
                {latestPlace}
              </div>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
}

export default MapPage;