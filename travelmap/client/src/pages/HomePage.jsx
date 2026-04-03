import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import AnimatedCounter from "../components/AnimatedCounter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
// import Lottie from "lottie-react";
// import globeAnimation from "../assets/animations/globe.json";

const PLACE_CARDS = [
  {
    image: "https://images.unsplash.com/photo-1551634979-2b11f8c946fe?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "Paris, France",
    date: "Visited June 2024",
    rotate: "rotate-2",
    position: "top-4 right-30",
  },
  {
    image: "https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?w=400&q=80",
    name: "Venice, Italy",
    date: "Visited August 2024",
    rotate: "-rotate-4",
    position: "top-32 right-1",
  },
  {
    image: "https://images.unsplash.com/photo-1719858403455-9a2582eca805?q=80&w=798&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    name: "San Francisco, United States",
    date: "Visited May 2025",
    rotate: "rotate-6",
    position: "top-54 right-40",
  }
];

function HomePage({ theme, toggleTheme }) {
  return (
    <div className="min-h-screen px-8 py-8 pb-20">
      <div className="max-w-[1320px] mx-auto space-y-12">
        <Navbar theme={theme} toggleTheme={toggleTheme} />

        {/* HERO */}
        <div className="relative min-h-[520px] flex items-center rounded-3xl overflow-hidden bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-700/50 px-20 py-16">

          {/* LEFT */}
          <div className=" z-10">
            <p className="text-xs font-semibold tracking-widest uppercase text-teal-600 dark:text-teal-400 mb-5">
              Digital Cartographer
            </p>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight leading-[0.9] text-slate-900 dark:text-slate-50 mb-6">
              Track Where<br />You've Been
            </h1>

            <p className="text-lg text-slate-500 dark:text-slate-400 leading-relaxed mb-10 max-w-sm">
              Your personal digital cartographer's journal for countries and cities you've visited.
            </p>

            <Link to="/map">
              <Button
                size="lg"
                className="rounded-full px-8 uppercase text-sm font-semibold hover:translate-x-3"
              >
                Start Exploring →
              </Button>
            </Link>
          </div>

          {/* FLOATING PLACE CARDS */}
          <div className="absolute right-35 top-10 inset-y-0 hidden md:block">
            {PLACE_CARDS.map((card) => (
              <div
                key={card.name}
                className={`absolute ${card.position} ${card.rotate} w-52 bg-white dark:bg-slate-800 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-700 overflow-hidden hover:scale-120 hover:z-10 transition duration-300`}
              >
                <div className="h-36 overflow-hidden">
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="px-3 py-2.5">
                  <div className="font-bold text-sm text-slate-800 dark:text-slate-100">{card.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5">{card.date}</div>
                </div>
              </div>
            ))}
          </div>

        </div>

        <Separator className="dark:bg-slate-800" />

        {/* FEATURES */}
        <div>
          <p className="text-xs uppercase tracking-widest text-slate-400 mb-6 font-medium">What you can do</p>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: "🔍",
                title: "Search & Save",
                desc: "Find any city or country instantly and save it to your archive with a single click.",
              },
              {
                icon: "🗺",
                title: "Interactive Map",
                desc: "All your saved places pinned on a live map — zoom in, explore, and see your journey.",
              },
              {
                icon: "📁",
                title: "Travel Archive",
                desc: "Browse your saved places, add photos, log memories, and track visit dates.",
              },
            ].map(({ icon, title, desc }) => (
              <Card
                key={title}
                className="p-6 rounded-2xl border-slate-200 dark:border-slate-700 hover:-translate-y-1 hover:shadow-md transition-all duration-200 group"
              >
                <CardContent className="p-0">
                  <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-base mb-4 group-hover:bg-teal-50 dark:group-hover:bg-teal-900/30 transition-colors">
                    {icon}
                  </div>
                  <div className="font-bold text-slate-800 dark:text-slate-100 mb-1.5">{title}</div>
                  <div className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{desc}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* CTA BANNER */}
        <Card className="rounded-3xl border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="font-extrabold text-2xl text-slate-900 dark:text-slate-50 mb-2">
              Ready to start mapping?
            </div>
            <div className="text-slate-500 dark:text-slate-400 text-sm max-w-sm">
              Add your first city in seconds. Your personal travel story starts here.
            </div>
          </div>
          <Link to="/map">
            <Button size="lg" className="rounded-full px-8 shrink-0">
              Open Map →
            </Button>
          </Link>
        </Card>

      </div>
    </div>
  );
}

export default HomePage;