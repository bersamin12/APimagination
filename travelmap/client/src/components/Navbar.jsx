import { Link, useLocation } from "react-router-dom";

function Navbar({ toggleTheme, theme }) {
  const location = useLocation();

  const linkStyle = (path) => ({
    textDecoration: "none",
    color: location.pathname === path ? "#0f766e" : "#64748b",
    fontSize: "14px",
    fontWeight: location.pathname === path ? "700" : "500",
    paddingBottom: "4px",
    borderBottom:
      location.pathname === path ? "2px solid #0f766e" : "2px solid transparent",
  });

  return (
    <div className="topbar">
      <div className="brand">Voyaguer</div>

      <div className="nav-links">
        <Link to="/" style={linkStyle("/")}>Home</Link>
        <Link to="/map" style={linkStyle("/map")}>Map</Link>
        <Link to="/saved" style={linkStyle("/saved")}>Saved Places</Link>

        <button className="icon-btn" title="Notifications" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Z" fill="currentColor"/>
            <path d="M18 16V11a6 6 0 1 0-12 0v5l-2 2v1h16v-1l-2-2Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round"/>
          </svg>
        </button>

        <button className="icon-btn" title="Settings" type="button">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 15.5A3.5 3.5 0 1 0 12 8.5a3.5 3.5 0 0 0 0 7Z" stroke="currentColor" strokeWidth="1.7"/>
            <path d="M19.4 15a1 1 0 0 0 .2 1.1l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1 1 0 0 0-1.1-.2 1 1 0 0 0-.6.9V20a2 2 0 1 1-4 0v-.1a1 1 0 0 0-.6-.9 1 1 0 0 0-1.1.2l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1 1 0 0 0 .2-1.1 1 1 0 0 0-.9-.6H4a2 2 0 1 1 0-4h.1a1 1 0 0 0 .9-.6 1 1 0 0 0-.2-1.1l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1 1 0 0 0 1.1.2 1 1 0 0 0 .6-.9V4a2 2 0 1 1 4 0v.1a1 1 0 0 0 .6.9 1 1 0 0 0 1.1-.2l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1 1 0 0 0-.2 1.1 1 1 0 0 0 .9.6H20a2 2 0 1 1 0 4h-.1a1 1 0 0 0-.9.6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/>
          </svg>
        </button>

        <button className="theme-btn" onClick={toggleTheme} type="button">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>
    </div>
  );
}

export default Navbar;