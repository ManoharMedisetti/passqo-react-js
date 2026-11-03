import { useState, useEffect } from "react";
import { ChevronDown, MapPin } from "lucide-react";
import { detectLocation, getCachedLocation } from "@/lib/location";
import { useSearchModal } from "@/context/SearchContext";

export function LocationPill({ glass = false }) {
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
        className={
          glass
            ? "flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 hover:bg-white/30 active:bg-white/35 backdrop-blur-md border border-white/30 text-white shadow-[0_2px_10px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.4)] focus:outline-none transition-all duration-200 group active:scale-95 select-none"
            : "h-11 lg:h-12 flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-4 lg:px-4.5 rounded-full border border-black/8 bg-white hover:bg-neutral-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A] transition-all duration-200 group active:scale-95 select-none shadow-[0_2px_10px_rgba(0,0,0,0.04)]"
        }
      >
        <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4E7A] flex-shrink-0 transition-transform group-hover:scale-110" />
        <span className={`text-xs sm:text-sm font-bold max-w-[130px] truncate ${glass ? "text-white" : "text-[#1B1B23]"}`}>
          {city ?? "Select location"}
        </span>
        <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-200 group-hover:translate-y-0.5 ${glass ? "text-white/80" : "text-neutral-500"}`} />
      </button>
    </div>
  );
}

export default LocationPill;
