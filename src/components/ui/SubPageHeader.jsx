import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "./Navbar";
import { NavUser } from "./NavUser";

export function SubPageHeader({ backTo, onBack, title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = () => {
    // 1. Explicit onBack handler (e.g. Settings mobile sub-section -> main settings menu)
    if (onBack) {
      onBack();
      return;
    }

    // 2. If inside a settings sub-section, go back to /settings
    if (location.pathname.startsWith("/settings/") && location.pathname !== "/settings") {
      navigate("/settings", { state: location.state });
      return;
    }

    // 3. If opened from the profile sidebar menu, take them back to Home and open the sidebar menu
    if (location.state?.openedFromSidebar) {
      navigate("/");
      window.dispatchEvent(new CustomEvent("passqo-open-profile-menu"));
      return;
    }

    // 4. Explicit backTo route
    if (backTo) {
      navigate(backTo);
      return;
    }

    // 5. Top-level subpages should ALWAYS go back to Home ("/")
    // Never blindly pop browser history which can take the user to unrelated pages like /notifications
    const TOP_LEVEL_SUBPAGES = [
      "/settings",
      "/tickets",
      "/notifications",
      "/rewards",
      "/referrals",
      "/organizer",
      "/terms",
    ];
    if (TOP_LEVEL_SUBPAGES.includes(location.pathname)) {
      navigate("/");
      return;
    }

    // 6. Default fallback
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate("/");
    }
  };

  return (
    <>
      {/* Desktop: Minimized Compact Navbar for Sidebar / Subpages */}
      <div className="hidden md:block">
        <Navbar compact miniSearch />
      </div>

      {/* Mobile: Clean Fixed Bar (No search, no logo clutter - Back on Left, Profile & Notifications on Right) */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 h-14 bg-[#F5F0EB]/95 backdrop-blur-md border-b border-black/6 px-3.5 sm:px-4 flex items-center justify-between">
        {/* Left: Clean Fixed Back Button */}
        <button
          type="button"
          onClick={handleBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4E7A] hover:text-[#E03A64] py-1.5 px-3 rounded-full bg-white border border-black/8 shadow-2xs active:scale-95 transition-all select-none cursor-pointer"
          aria-label="Back"
        >
          <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
          <span>Back</span>
        </button>

        {/* Center: Optional Title */}
        {title && (
          <span className="font-display font-extrabold text-xs text-[#1B1B23] truncate max-w-[140px]">
            {title}
          </span>
        )}

        {/* Right: Notifications Bell & Profile Button */}
        <div className="flex items-center">
          <NavUser compact />
        </div>
      </header>
    </>
  );
}

export default SubPageHeader;

