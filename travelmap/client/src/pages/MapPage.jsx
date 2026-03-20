import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api";
import TravelMapView from "../components/TravelMapView";
import Navbar from "../components/Navbar";
import AnimatedCounter from "../components/AnimatedCounter";

function MapPage({ theme, toggleTheme }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [places, setPlaces] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPlaces = async () => {
    try {
      const response = await api.get("/places");
      setPlaces(response.data);
    } catch (error) {
      console.error("Failed to fetch places:", error);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query.trim().length < 2) {
        setResults([]);
        return;
      }

      setLoading(true);

      try {
        const response = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(response.data);
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    };

    const timeout = setTimeout(fetchSearchResults, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSavePlace = async (place) => {
    try {
      await api.post("/places", place);
      setMessage(`Saved ${place.name}`);
      setQuery("");
      setResults([]);
      fetchPlaces();
    } catch (error) {
      if (error.response?.status === 409) {
        setMessage("This place is already saved.");
      } else {
        setMessage("Failed to save place.");
      }
    }
  };

  const cityCount = places.filter((place) => place.type === "city").length;
  const countryCount = places.filter((place) => place.type === "country").length;
  const latestPlace = places.length > 0 ? places[0].name : "No saved places yet";

  return (
    <div className="page-shell">
      <div className="page-container">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <div className="map-shell card">
          <div className="map-search">
            <input
              className="search-input"
              type="text"
              placeholder="Add a city or country"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />

            {loading && (
              <p className="muted" style={{ marginTop: 10, fontSize: 14 }}>
                Searching...
              </p>
            )}

            {!loading && query.trim().length >= 2 && results.length === 0 && (
              <div className="results-box muted">No matching cities or countries found.</div>
            )}

            {results.length > 0 && (
              <div className="results-box">
                {results.map((place, index) => (
                  <div
                    key={place.externalId}
                    className="result-row"
                    onClick={() => handleSavePlace(place)}
                    style={{
                      borderBottom:
                        index !== results.length - 1 ? "1px solid #edf2f7" : "none",
                    }}
                  >
                    <div style={{ fontWeight: 800 }}>
                      {place.name}{" "}
                      <span className="muted" style={{ fontWeight: 400 }}>
                        ({place.type})
                      </span>
                    </div>
                    <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
                      {place.countryName}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {message && <div className="info-pill">{message}</div>}
          </div>

          <div className="floating-card status-card">
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                color: "#94a3b8",
                marginBottom: 8,
                textTransform: "uppercase",
              }}
            >
              Status
            </div>

            <div
              style={{
                display: "inline-block",
                background: "#fde68a",
                color: "#92400e",
                fontSize: 12,
                padding: "5px 10px",
                borderRadius: 999,
                marginBottom: 18,
              }}
            >
              Explorer
            </div>

            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                <AnimatedCounter value={countryCount} />
              </div>
              <div className="muted" style={{ fontSize: 13 }}>
                Countries Visited
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 18, fontWeight: 800 }}>
                <AnimatedCounter value={cityCount} />
              </div>
              <div className="muted" style={{ fontSize: 13 }}>
                Cities Explored
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: "100%", padding: "10px 14px", fontSize: 13 }}
            >
              Share Journal
            </button>
          </div>

          <div className="floating-card latest-card">
            <div
              style={{
                fontSize: 10,
                letterSpacing: "0.08em",
                color: "#94a3b8",
                marginBottom: 10,
                textTransform: "uppercase",
              }}
            >
              Last Destination
            </div>
            <div style={{ fontWeight: 800 }}>{latestPlace}</div>
            <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
              Recently added
            </div>
          </div>

          <div className="right-actions">
            <button className="round-action" type="button">＋</button>
            <button className="round-action" type="button">⌖</button>
            <button className="round-action" type="button">◫</button>
          </div>

          <div className="floating-card bottom-stats-card">
            <div>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase" }}>
                Total Places
              </div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>
                <AnimatedCounter value={places.length} />
              </div>
            </div>

            <div>
              <div className="muted" style={{ fontSize: 11, textTransform: "uppercase" }}>
                Planned
              </div>
              <div style={{ fontWeight: 800, fontSize: 22 }}>
                <AnimatedCounter value={3} />
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "#99f6e4",
                }}
              />
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "#cbd5e1",
                }}
              />
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: "#94a3b8",
                  color: "white",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 12,
                }}
              >
                +5
              </div>
            </div>
          </div>

          <TravelMapView places={places} />
        </div>

        <div className="saved-preview-header" style={{ marginTop: 18 }}>
          <h2 style={{ margin: 0 }}>Saved Places</h2>
          <Link className="nav-link" to="/saved">
            View all
          </Link>
        </div>

        {places.length === 0 ? (
          <div className="card saved-card muted">No places saved yet.</div>
        ) : (
          <div className="saved-grid">
            {places.slice(0, 4).map((place) => (
              <div className="card saved-card" key={place.id}>
                <div className="saved-card-image-wrap">
                  {place.image_url ? (
                    <img
                      src={place.image_url}
                      alt={place.image_alt || place.name}
                      className="saved-card-real-image"
                    />
                  ) : (
                    <div className="fallback-image">No image</div>
                  )}
                </div>

                <div style={{ fontWeight: 800, marginBottom: 6 }}>{place.name}</div>
                <div className="muted" style={{ fontSize: 13, textTransform: "capitalize" }}>
                  {place.type}
                </div>
                <div className="muted" style={{ fontSize: 12, marginTop: 6 }}>
                  {place.country_name || "—"}
                </div>

                {place.comment && (
                  <div className="map-card-comment">
                    {place.comment}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MapPage;