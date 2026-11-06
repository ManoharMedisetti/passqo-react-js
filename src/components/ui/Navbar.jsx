import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";
import { LocationPill } from "./LocationPill";
import { NavUser } from "./NavUser";
import { useSearchModal } from "@/context/SearchContext";

const SEARCH_PROMPTS = [
  "Search events, artists, venues…",
  "Search gigs & concerts in Dublin…",
  "Search comedy, festivals, nightlife…",
  "Search exhibitions & workshops…",
  "Search weekend plans near you…",
];

export function AnimatedSearchPlaceholder({ className = "", textColor = "text-neutral-400" }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % SEARCH_PROMPTS.length);
    }, 3200);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className={`relative h-5 overflow-hidden flex items-center select-none ${className}`}>
      <AnimatePresence mode="wait">
        <motion.span
          key={index}
          initial={{ opacity: 0, y: 7 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -7 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className={`text-xs sm:text-sm font-normal ${textColor} tracking-normal truncate block whitespace-nowrap`}
        >
          {SEARCH_PROMPTS[index]}
        </motion.span>
      </AnimatePresence>
    </div>
  );
}

export function Navbar({ wide = false, compact = false, miniSearch = false }) {
  const location = useLocation();
  const isHome = location.pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const { openSearch } = useSearchModal();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    const updateHeight = () => {
      const el = document.getElementById("main-navbar");
      if (el) {
        document.documentElement.style.setProperty("--navbar-height", `${el.offsetHeight}px`);
      }
    };

    const el = document.getElementById("main-navbar");
    let ro = null;
    if (el && typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => updateHeight());
      ro.observe(el);
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", updateHeight);
    handleScroll();
    updateHeight();

    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", updateHeight);
    };
  }, []);

  const container = wide ? "max-w-[1216px]" : "max-w-[1120px]";
  const isHeroTransparent = isHome && !scrolled;

  return (
    <div
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-[100] px-3.5 sm:px-4 lg:px-8 transition-all duration-300 ${
        isHeroTransparent
          ? "bg-transparent md:bg-white/75 md:backdrop-blur-2xl md:backdrop-saturate-180 border-b border-transparent md:border-white/60 md:shadow-[0_4px_20px_rgba(0,0,0,0.04)] py-2.5 sm:py-3 lg:py-3.5"
          : compact
          ? "bg-white/80 backdrop-blur-2xl backdrop-saturate-180 border-b border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04),inset_0_-1px_1px_rgba(255,255,255,0.6)] py-1.5 lg:py-2"
          : "bg-white/65 backdrop-blur-xl backdrop-saturate-180 border-b border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.04)] md:bg-white/80 md:backdrop-blur-2xl md:border-white/60 md:shadow-[0_4px_24px_rgba(0,0,0,0.06),inset_0_-1px_1px_rgba(255,255,255,0.6)] py-1.5 sm:py-2 lg:py-2"
      }`}
    >
      {/* ── 1. DESKTOP & TABLET NAVBAR (>= md): Translucent BG, Lower Height When Scrolled ── */}
      <div className={`hidden md:flex items-center justify-between gap-3 lg:gap-6 ${container} mx-auto transition-all duration-300`}>
        {/* Logo */}
        <Link
          to="/"
          className="flex-shrink-0 flex items-center px-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A] rounded-xl"
        >
          <img
            src="/images/Logos/navbar%20logo.png"
            alt="Passqo"
            className={`${
              compact ? "h-6 sm:h-6.5 lg:h-7" : scrolled ? "h-6.5 sm:h-7 lg:h-8" : "h-8 lg:h-9 xl:h-10"
            } w-auto object-contain transition-all duration-300 hover:scale-105 active:scale-95`}
          />
        </Link>

        {/* Center: Location + Search pill / Small icon */}
        <div className="flex items-center gap-2 lg:gap-2.5 flex-1 max-w-[480px] justify-center min-w-0">
          <div className="flex-shrink-0">
            <LocationPill compact={scrolled || compact} />
          </div>

          {miniSearch || compact ? (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => openSearch()}
              aria-label="Search"
              title="Search events, artists, venues…"
              className="w-9 h-9 rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.04)] border border-black/[0.08] hover:border-black/25 flex items-center justify-center text-[#1B1B23] transition-all cursor-pointer group flex-shrink-0"
            >
              <Search className="w-4 h-4 text-neutral-500 group-hover:text-[#1B1B23] transition-colors" />
            </motion.button>
          ) : (
            <motion.button
              type="button"
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
              onClick={() => openSearch()}
              aria-label="Open search popup"
              className="w-full max-w-[280px] lg:max-w-[360px] min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A] rounded-full group"
            >
              <div className={`flex items-center justify-between gap-2.5 rounded-full ${
                scrolled ? "h-9 lg:h-10" : "h-11 lg:h-12"
              } pl-3.5 sm:pl-4 pr-3.5 bg-white shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-black/[0.08] group-hover:border-black/20 text-[#1B1B23] transition-all duration-300`}>
                <div className="flex items-center gap-2.5 flex-1 min-w-0">
                  <Search className="w-4 h-4 flex-shrink-0 text-neutral-400 group-hover:text-neutral-600 transition-colors" />
                  <AnimatedSearchPlaceholder
                    className="flex-1 min-w-0"
                    textColor="text-neutral-500 font-normal"
                  />
                </div>
              </div>
            </motion.button>
          )}
        </div>

        {/* Right side — NavUser */}
        <div className="flex items-center flex-shrink-0 relative z-20">
          <NavUser scrolled={scrolled || compact} compact={compact} />
        </div>
      </div>

      {/* ── 2. MOBILE NAVBAR (< md) — Lower Height When Scrolled ── */}
      <div className={`flex flex-col md:hidden w-full max-w-full ${scrolled ? "gap-1.5" : "gap-2"} transition-all duration-300`}>
        {/* Row 1: Logo (left), Location (center), Sign In (right) */}
        <div className="flex items-center justify-between gap-2 w-full">
          <Link to="/" className="flex-shrink-0 flex items-center px-0.5">
            <img
              src="/images/Logos/navbar%20logo.png"
              alt="Passqo"
              className={`${
                scrolled ? "h-6" : "h-7"
              } w-auto object-contain transition-all duration-300 ${
                isHeroTransparent ? "brightness-0 invert drop-shadow-sm" : ""
              }`}
            />
          </Link>

          <div className="flex-1 flex justify-center min-w-0">
            <LocationPill glass={isHeroTransparent} compact={scrolled} />
          </div>

          <div className="flex-shrink-0 relative z-20">
            <NavUser compact glass={isHeroTransparent} scrolled={scrolled} />
          </div>
        </div>

        {/* Row 2: Search bar — Lower height h-9 / h-9.5 when scrolled */}
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={() => openSearch()}
          aria-label="Open search popup"
          className={`
            w-full ${scrolled ? "h-9 sm:h-9.5 px-3.5" : "h-11 px-4"} rounded-full
            flex items-center gap-2.5 text-left
            transition-all duration-300
            ${
              isHeroTransparent
                ? "bg-white/20 hover:bg-white/30 active:bg-white/35 backdrop-blur-xl border border-white/35 shadow-[0_4px_20px_rgba(0,0,0,0.15),inset_0_1px_1px_rgba(255,255,255,0.45)] text-white"
                : "bg-white/95 hover:bg-white active:bg-neutral-100 border border-black/8 shadow-2xs text-[#1B1B23]"
            }
          `}
        >
          <Search
            className={`w-4 h-4 flex-shrink-0 transition-colors ${
              isHeroTransparent ? "text-white/85" : "text-neutral-400"
            }`}
          />
          <AnimatedSearchPlaceholder
            className="flex-1 min-w-0"
            textColor={
              isHeroTransparent
                ? "text-white/95 placeholder:text-white/80 font-medium"
                : "text-neutral-500 font-normal"
            }
          />
        </motion.button>
      </div>
    </div>
  );
}

export default Navbar;
