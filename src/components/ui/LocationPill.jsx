import { useState, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { detectLocation, getCachedLocation } from "@/lib/location";
import { useSearchModal } from "@/context/SearchContext";

export function LocationPill({ glass = false, compact = false }) {
  const [city, setCity] = useState("Dublin");
  const { openSearch } = useSearchModal();

  useEffect(() => {
    const cached = getCachedLocation();
    if (cached?.city) {
      setCity(cached.city);
    } else {
      detectLocation().then((loc) => {
        if (loc?.city) setCity(loc.city);
      });
    }

    const handleLocationUpdate = (e) => {
      if (e.detail?.city) {
        setCity(e.detail.city);
      }
    };
    window.addEventListener("passqo-location-changed", handleLocationUpdate);
    return () => window.removeEventListener("passqo-location-changed", handleLocationUpdate);
  }, []);

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => openSearch("", "location")}
        aria-haspopup="dialog"
        aria-label="Select location in search popup"
        className={`
          flex items-center rounded-full transition-all duration-300 group active:scale-95 select-none focus:outline-none
          ${
            compact
              ? "h-7.5 sm:h-8 md:h-9 lg:h-9.5 px-2.5 sm:px-3 lg:px-3.5 gap-1 sm:gap-1.5"
              : "h-9 sm:h-9.5 md:h-11 lg:h-12 px-3.5 sm:px-4 lg:px-4.5 gap-1.5 sm:gap-2"
          }
          ${
            glass
              ? "bg-white/20 hover:bg-white/30 active:bg-white/35 backdrop-blur-md border border-white/30 text-white shadow-[0_2px_10px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.4)]"
              : compact
              ? "bg-transparent border border-transparent shadow-none hover:bg-black/5 text-[#1B1B23]"
              : "border border-black/8 bg-white/95 hover:bg-white text-[#1B1B23] shadow-[0_2px_8px_rgba(0,0,0,0.04)] focus-visible:ring-2 focus-visible:ring-[#FF4E7A]"
          }
        `}
      >
        <MapPin
          className={`
            ${compact ? "w-3 h-3 sm:w-3.5 sm:h-3.5" : "w-3.5 h-3.5 sm:w-4 sm:h-4"}
            text-[#FF4E7A] flex-shrink-0 transition-transform group-hover:scale-110
          `}
        />
        <span
          className={`
            font-bold truncate
            ${compact ? "text-[11px] sm:text-xs max-w-[85px] sm:max-w-[120px]" : "text-xs sm:text-sm max-w-[120px] sm:max-w-[140px]"}
            ${glass ? "text-white" : "text-[#1B1B23]"}
          `}
        >
          {city ?? "Select location"}
        </span>
        <ChevronDown
          className={`
            ${compact ? "w-2.5 h-2.5 sm:w-3 sm:h-3" : "w-3 h-3 sm:w-3.5 sm:h-3.5"}
            transition-transform duration-200 group-hover:translate-y-0.5
            ${glass ? "text-white/80" : "text-neutral-500"}
          `}
        />
      </button>
    </div>
  );
}

export default LocationPill;
