import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedCounter from "../components/AnimatedCounter";

// Optional local images:
// Put files inside: client/src/assets/
// Then uncomment these lines:
// import baliCard from "../assets/bali-card.jpg";
// import kyotoCard from "../assets/kyoto-card.jpg";

function HomePage({ theme, toggleTheme }) {
  const leftCardStyle = {
    // backgroundImage: `url(${baliCard})`,
    backgroundImage:
      "linear-gradient(135deg, rgba(190,242,100,0.95), rgba(77,124,15,0.95))",
  };

  const rightCardStyle = {
    // backgroundImage: `url(${kyotoCard})`,
    backgroundImage:
      "linear-gradient(135deg, rgba(125,211,252,0.95), rgba(37,99,235,0.95))",
  };

  return (
    <div className="page-shell">
      <div className="page-container">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        <div className="hero-grid">
          <div>
            <div className="hero-badge">Your personal travel journal</div>

            <h1 className="hero-title">
              Voyaguer
              <br />
              tracks where
              <br />
              you’ve been
            </h1>

            <p className="hero-subtitle muted">
              Save cities and countries you have visited, visualize them on an
              interactive map, and build your own clean travel archive inspired
              by Wanderlog.
            </p>

            <div className="button-row">
              <Link to="/map">
                <button className="btn-primary">Start Exploring</button>
              </Link>

              <Link to="/saved">
                <button className="btn-secondary">View Saved Places</button>
              </Link>
            </div>
          </div>

          <div className="card preview-card">
            <div className="card preview-top-card">
              <div style={{ fontWeight: 800, marginBottom: 8 }}>Quick Preview</div>
              <div className="muted">
                Search a city or country, click to save, and watch your travel map
                grow beautifully over time.
              </div>
            </div>

            <div className="preview-map">
              <div className="preview-chip preview-chip-top">
                Cities Visited: <AnimatedCounter value={12} />
              </div>

              <div className="preview-chip preview-chip-bottom">
                Countries Visited: <AnimatedCounter value={5} />
              </div>

              <div className="preview-orb">Voyaguer</div>

              <div className="floating-photo-card photo-card-left">
                <div
                  className="mini-photo real-photo"
                  style={leftCardStyle}
                />
                <div>
                  <div className="floating-photo-title">Bali Escape</div>
                  <div className="floating-photo-sub muted">A saved memory</div>
                </div>
              </div>

              <div className="floating-photo-card photo-card-right">
                <div
                  className="mini-photo real-photo"
                  style={rightCardStyle}
                />
                <div>
                  <div className="floating-photo-title">Kyoto Walk</div>
                  <div className="floating-photo-sub muted">City journal</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="feature-grid">
          <div className="card feature-card">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Search & Save</div>
            <div className="muted">
              Find cities and countries instantly with autocomplete search.
            </div>
          </div>

          <div className="card feature-card">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Interactive Map</div>
            <div className="muted">
              Visualize saved cities cleanly on a world map without clutter.
            </div>
          </div>

          <div className="card feature-card">
            <div style={{ fontWeight: 800, marginBottom: 8 }}>Travel Archive</div>
            <div className="muted">
              Organize your saved places and review them anytime from one page.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;