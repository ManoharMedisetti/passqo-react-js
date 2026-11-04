import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getUser, getAccessToken } from "@/lib/auth/storage";
import { api } from "@/lib/api";
import { NotificationBell } from "./NotificationBell";
import { useAuthModal } from "@/context/AuthContext";

const NAV_LINK = "text-sm font-bold text-[#1B1B23] hover:text-[#FF4E7A] transition-colors whitespace-nowrap";

export function NavUser({ compact = false, glass = false, scrolled = false }) {
  const [user, setUser] = useState(() => getUser() || null);
  const [checked, setChecked] = useState(true);
  const { openAuth } = useAuthModal();

  useEffect(() => {
    const token = getAccessToken();
    const cached = getUser();
    if (token && cached) {
      setUser(cached);
    } else if (token) {
      api.auth
        .me()
        .then((data) => setUser(data?.user ?? null))
        .catch(() => setUser(null));
    } else {
      setUser(null);
    }

    const handleAuthChange = (e) => {
      const u = e?.detail?.user ?? getUser();
      setUser(u || null);
    };

    window.addEventListener("passqo-auth-changed", handleAuthChange);
    return () => window.removeEventListener("passqo-auth-changed", handleAuthChange);
  }, []);

  if (!checked) return null;

  if (!user) {
    return (
      <div className={`flex items-center ${compact ? "gap-1.5" : "gap-4 lg:gap-6"}`}>
        {!compact && (
          <nav className="hidden lg:flex items-center gap-4 lg:gap-6 px-1">
            <Link to="/auth/register?as=organizer" className={NAV_LINK}>
              For Organisers
            </Link>
            <a href="mailto:support@passqo.com" className={NAV_LINK}>
              Help
            </a>
          </nav>
        )}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            openAuth("signin");
          }}
          className={`relative z-20 flex items-center justify-center ${
            compact
              ? "h-9 sm:h-9.5 px-3.5 sm:px-4 text-xs font-bold min-w-[72px] sm:min-w-[76px]"
              : scrolled
              ? "h-10 lg:h-10.5 min-w-[88px] lg:w-26 px-4 text-xs sm:text-sm font-bold"
              : "h-11 lg:h-12 min-w-[96px] lg:w-28 px-4 text-sm font-semibold"
          } rounded-full font-label transition-all duration-200 cursor-pointer pointer-events-auto flex-shrink-0 active:scale-95 select-none ${
            glass
              ? "bg-white/20 hover:bg-white/30 active:bg-white/35 backdrop-blur-md border border-white/35 text-white shadow-[0_2px_10px_rgba(0,0,0,0.1),inset_0_1px_1px_rgba(255,255,255,0.4)]"
              : "border border-[#FF4E7A]/20 bg-[#FF4E7A] text-white hover:bg-[#FF3567] active:bg-[#D4537E] shadow-sm hover:shadow"
          }`}
        >
          Sign In
        </button>
      </div>
    );
  }

  const isOrganiser = user.role === "ORGANISER" || user.role === "SUPER_ADMIN";

  return (
    <div className="flex items-center gap-6">
      {!compact ? (
        <nav className="flex items-center gap-6 px-2">
          <Link to="/organizer" className={NAV_LINK}>
            {isOrganiser ? "Dashboard" : "For Organisers"}
          </Link>
          <Link to="/tickets" className={NAV_LINK}>
            My Tickets
          </Link>
        </nav>
      ) : (
        isOrganiser && (
          <Link to="/organizer" className="hidden sm:inline text-xs font-bold text-[#1B1B23] hover:text-[#FF4E7A]">
            Dashboard
          </Link>
        )
      )}
      <div className="flex items-center gap-4 lg:gap-6">
        <NotificationBell />
        <Link to="/profile" aria-label="Profile">
          <div className="w-9 h-9 lg:w-10 lg:h-10 rounded-full bg-[#FF4E7A] flex items-center justify-center ring-2 ring-white">
            <span className="text-white text-sm font-bold">
              {(user.name || user.email || "?").charAt(0).toUpperCase()}
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
}

export default NavUser;

