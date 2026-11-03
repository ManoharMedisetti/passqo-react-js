import { useLocation, Link } from "react-router-dom";
import { Home, Search, Ticket, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { useSearchModal } from "@/context/SearchContext";
import { useAuthModal } from "@/context/AuthContext";
import { getUser } from "@/lib/auth/storage";

export function BottomNav() {
  const location = useLocation();
  const pathname = location.pathname;
  const { openSearch, isOpen } = useSearchModal();
  const { isOpen: isAuthOpen, openAuth } = useAuthModal();

  // Hide bottom navbar completely when auth or search modal is open
  if (isAuthOpen || isOpen) return null;

  const isHomeActive = pathname === "/" && !isOpen;
  const isSearchActive = isOpen;
  const isTicketsActive = pathname === "/tickets";

  const handleCreateEventClick = (e) => {
    const user = getUser();
    if (!user) {
      e.preventDefault();
      openAuth("signin");
    }
  };

  return (
    <motion.div
      id="bottom-nav-bar"
      initial={{ y: 70, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="fixed bottom-4 inset-x-0 z-[90] flex items-center justify-center gap-3 px-6 pointer-events-none lg:hidden select-none"
    >
      {/* ── PILL 1: Navigation Glass Capsule (Same liquid glass as search & location) ── */}
      <nav
        aria-label="Bottom Navigation"
        className="
          pointer-events-auto flex items-center justify-between
          h-[54px] min-w-[220px] xs:min-w-[240px] md:min-w-[340px] md:max-w-[420px] p-1.5
          bg-white/25 md:bg-white/70 hover:bg-white/35 md:hover:bg-white/80 active:bg-white/30
          backdrop-blur-xl backdrop-saturate-180
          border border-white/40 md:border-white/60 rounded-full
          shadow-[0_8px_32px_rgba(0,0,0,0.14),inset_0_1px_1.5px_rgba(255,255,255,0.55)]
        "
      >
        {/* Home */}
        <Link
          to="/"
          className={`
            relative h-full flex-1 flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 active:scale-95
            ${
              isHomeActive
                ? "bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] text-white font-bold shadow-[0_4px_14px_rgba(225,29,72,0.4)] px-5"
                : "text-[#2D2D3A] hover:text-black font-semibold px-2.5"
            }
          `}
        >
          <Home className="w-4 h-4 flex-shrink-0" fill={isHomeActive ? "currentColor" : "none"} />
          <span className="text-[10px] leading-none">Home</span>
        </Link>

        {/* Search */}
        <button
          type="button"
          onClick={() => openSearch()}
          className={`
            relative h-full flex-1 flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 active:scale-95 focus:outline-none
            ${
              isSearchActive
                ? "bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] text-white font-bold shadow-[0_4px_14px_rgba(225,29,72,0.4)] px-5"
                : "text-[#2D2D3A] hover:text-black font-semibold px-2.5"
            }
          `}
        >
          <Search className="w-4 h-4 flex-shrink-0" />
          <span className="text-[10px] leading-none">Search</span>
        </button>

        {/* My Tickets */}
        <Link
          to="/tickets"
          className={`
            relative h-full flex-1 flex flex-col items-center justify-center gap-0.5 rounded-full transition-all duration-200 active:scale-95
            ${
              isTicketsActive
                ? "bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] text-white font-bold shadow-[0_4px_14px_rgba(225,29,72,0.4)] px-5"
                : "text-[#2D2D3A] hover:text-black font-semibold px-2.5"
            }
          `}
        >
          <Ticket className="w-4 h-4 flex-shrink-0" fill={isTicketsActive ? "currentColor" : "none"} />
          <span className="text-[10px] leading-none whitespace-nowrap">My Tickets</span>
        </Link>
      </nav>

      {/* ── PILL 2: Just Full Pink Action Button (No outer glass behind it), Animated on tap ── */}
      <motion.div
        whileTap={{ scale: 0.94 }}
        whileHover={{ scale: 1.02 }}
        className="pointer-events-auto flex-shrink-0"
      >
        <Link
          to="/auth/register?as=organizer"
          onClick={handleCreateEventClick}
          className="
            h-[54px] pl-5 pr-6 flex items-center gap-1.5
            bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] hover:brightness-105 active:scale-95
            text-white font-label font-bold text-xs sm:text-[13px]
            rounded-full shadow-[0_8px_24px_rgba(255,78,122,0.45),inset_0_1px_1px_rgba(255,255,255,0.4)]
            border border-white/25
            transition-all duration-200 whitespace-nowrap
          "
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Create Event</span>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default BottomNav;

