import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";

function Navbar({ toggleTheme, theme }) {
  const location = useLocation();

  const linkClass = (path) =>
    `text-sm font-medium pb-1 border-b-2 transition-colors duration-150 ${
      location.pathname === path
        ? "text-teal-700 dark:text-sky-300 border-teal-700 dark:border-sky-300"
        : "text-slate-500 dark:text-slate-400 border-transparent hover:text-slate-800 dark:hover:text-slate-200"
    }`;

  return (
    <div className="h-16 flex items-center justify-between px-6 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm shadow-sm">
      <div className="text-xl font-extrabold text-teal-800 dark:text-sky-200 tracking-tight">
        Voyaguer
      </div>
      <div className="flex items-center gap-6">
        <Link to="/" className={linkClass("/")}>Home</Link>
        <Link to="/map" className={linkClass("/map")}>Map</Link>
        <Link to="/saved" className={linkClass("/saved")}>Saved Places</Link>
        <Button variant="ghost" size="s" onClick={toggleTheme} className="text-base p-2">
          {theme === "light" ? "🌙" : "☀️"}
        </Button>
      </div>
    </div>
  );
}

export default Navbar;