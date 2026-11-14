import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { clearAuth } from "@/lib/auth/storage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import {
  User,
  Ticket,
  ChevronRight,
  HelpCircle,
  ShieldCheck,
  LogOut,
  SquarePen,
  X,
  Settings,
  Award,
  Users,
} from "lucide-react";

export function ProfileSidebarMenu({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape key and prevent background scroll when open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);

      // Lock both documentElement and body so the background can NEVER scroll
      const origBodyOverflow = document.body.style.overflow;
      const origHtmlOverflow = document.documentElement.style.overflow;
      const origBodyTouch = document.body.style.touchAction;

      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
      document.body.style.touchAction = "none";

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = origBodyOverflow;
        document.documentElement.style.overflow = origHtmlOverflow;
        document.body.style.touchAction = origBodyTouch;
      };
    }
  }, [isOpen, onClose]);

  const handleLogout = () => {
    clearAuth();
    window.dispatchEvent(new CustomEvent("passqo-auth-changed", { detail: { user: null } }));
    onClose();
    navigate("/");
  };

  const handleItemClick = (path) => {
    onClose();
    if (path) navigate(path, { state: { openedFromSidebar: true } });
  };

  if (!mounted) return null;

  {/* Card 1: User Profile Header Card */}
  const userCard = (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-4.5 border border-black/6 shadow-2xs flex items-center justify-between gap-3">
      <div className="flex items-center gap-3 min-w-0">
        {/* Outline User Circle Avatar */}
        <div className="w-12 h-12 rounded-full border border-neutral-300 bg-neutral-50 flex items-center justify-center flex-shrink-0 text-neutral-800 shadow-2xs">
          <User className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-extrabold text-sm sm:text-base text-[#1B1B23] truncate leading-tight">
            {user?.name || "John Doe"}
          </h3>
          <p className="text-xs text-[#8C8C9E] font-medium truncate mt-0.5">
            {user?.email || "johndoe@gmail.com"}
          </p>
        </div>
      </div>

      {/* Edit Button */}
      <button
        type="button"
        onClick={() => setIsEditProfileOpen(true)}
        className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-800 hover:text-[#FF4E7A] transition-colors cursor-pointer flex-shrink-0"
        title="Edit Profile"
        aria-label="Edit Profile"
      >
        <SquarePen className="w-5 h-5 stroke-[1.8]" />
      </button>
    </div>
  );

  const isOrganizerUser = user?.role === "ORGANIZER" || localStorage.getItem("passqo_is_organizer") === "true";

  {/* Card 2: Main Navigation Actions Card (Matching Reference Frame 118) */}
  const mainActionsCard = (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs divide-y divide-black/5 overflow-hidden">
      {/* 1. Become an organizer / Organiser Dashboard */}
      <button
        type="button"
        onClick={() => handleItemClick("/organizer")}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0">
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
              <rect x="7" y="4" width="10" height="7" rx="2" fill={isOrganizerUser ? "#0284C7" : "#FF4E7A"} />
              <path d="M4 11h16v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4z" stroke="#2C2738" strokeWidth="1.8" />
              <path d="M6 17v4M18 17v4" stroke="#2C2738" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-xs sm:text-sm text-[#2C2738] truncate group-hover:text-[#FF4E7A] transition-colors">
              {isOrganizerUser ? "Organiser Dashboard" : "Become an organizer"}
            </p>
            <p className="text-[11px] text-[#756C84] font-medium truncate mt-0.5">
              {isOrganizerUser ? "Manage your events & sales" : "Host your events"}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#2C2738] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>

      {/* 2. My Tickets */}
      <button
        type="button"
        onClick={() => handleItemClick("/tickets")}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-neutral-800">
            <Ticket className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] truncate group-hover:text-[#FF4E7A] transition-colors">
              My Tickets
            </p>
            <p className="text-[11px] text-[#8C8C9E] font-medium truncate mt-0.5">
              View and manage your tickets
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>

      {/* 3. Reward & Levels */}
      <button
        type="button"
        onClick={() => handleItemClick("/rewards")}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-neutral-800">
            <Award className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] truncate group-hover:text-[#FF4E7A] transition-colors">
              Reward & Levels
            </p>
            <p className="text-[11px] text-[#8C8C9E] font-medium truncate mt-0.5">
              Earn rewards by attending more events
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>

      {/* 4. Referrals */}
      <button
        type="button"
        onClick={() => handleItemClick("/referrals")}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-neutral-800">
            <Users className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] truncate group-hover:text-[#FF4E7A] transition-colors">
              Referrals
            </p>
            <p className="text-[11px] text-[#8C8C9E] font-medium truncate mt-0.5">
              Refer a friend and enjoy together
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>

      {/* 5. Settings */}
      <button
        type="button"
        onClick={() => handleItemClick("/settings")}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-neutral-800">
            <Settings className="w-6 h-6 stroke-[1.8]" />
          </div>
          <div className="min-w-0">
            <p className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] truncate group-hover:text-[#FF4E7A] transition-colors">
              Settings
            </p>
            <p className="text-[11px] text-[#8C8C9E] font-medium truncate mt-0.5">
              Manage your account here
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>
    </div>
  );

  {/* Card 3: Secondary Support & Legal Card */}
  const supportCard = (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs divide-y divide-black/5 overflow-hidden">
      {/* Help */}
      <button
        type="button"
        onClick={() => {
          onClose();
          window.location.href = "mailto:support@passqo.com";
        }}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <HelpCircle className="w-5 h-5 text-neutral-800 stroke-[1.8] flex-shrink-0" />
          <span className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors">
            Help
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>

      {/* Terms & Conditions */}
      <button
        type="button"
        onClick={() => handleItemClick("/terms")}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-neutral-50/80 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <ShieldCheck className="w-5 h-5 text-neutral-800 stroke-[1.8] flex-shrink-0" />
          <span className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors">
            Terms & Conditions
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-[#1B1B23] group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>

      {/* Log Out */}
      <button
        type="button"
        onClick={handleLogout}
        className="w-full p-3.5 sm:p-4 flex items-center justify-between text-left hover:bg-red-50/50 transition-colors group cursor-pointer"
      >
        <div className="flex items-center gap-3.5 min-w-0">
          <LogOut className="w-5 h-5 text-neutral-800 group-hover:text-red-500 stroke-[1.8] flex-shrink-0 transition-colors" />
          <span className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] group-hover:text-red-500 transition-colors">
            Log Out
          </span>
        </div>
        <ChevronRight className="w-4 h-4 text-neutral-400 group-hover:text-red-500 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
      </button>
    </div>
  );

  return (
    <>
      {createPortal(
        <>
          {isOpen && (
            <div className="fixed inset-0 z-[99999] pointer-events-auto flex justify-end">
              {/* Backdrop Overlay (Desktop/Tablet only: dims the background on the left) */}
              <div
                onClick={onClose}
                onWheel={(e) => {
                  if (scrollContainerRef.current) {
                    scrollContainerRef.current.scrollTop += e.deltaY;
                  }
                }}
                onTouchMove={(e) => e.preventDefault()}
                className="hidden sm:block fixed inset-0 bg-black/50 backdrop-blur-xs z-[99998]"
                aria-hidden="true"
              />

              {/* Sidebar: 100% FULLSCREEN on mobile (no black gap/strip on the side), right-docked drawer on sm and up */}
              <aside
                ref={scrollContainerRef}
                className="fixed inset-0 sm:left-auto sm:right-0 sm:top-0 sm:bottom-0 w-full sm:w-auto sm:max-w-[420px] h-full min-h-screen z-[99999] bg-[#F5F0EB] shadow-none sm:shadow-[-8px_0_40px_rgba(0,0,0,0.25)] flex flex-col justify-start overflow-y-auto p-4 sm:p-5 space-y-4"
                aria-label="User Account Sidebar"
              >
                {/* Top Bar: Left Back Button and Right Close Button */}
                <div className="flex items-center justify-between pt-1 pb-1 w-full flex-shrink-0">
                  <button
                    type="button"
                    onClick={onClose}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors cursor-pointer select-none py-1"
                  >
                    <span className="text-sm font-black">←</span>
                    <span>Back</span>
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-8 h-8 rounded-full flex items-center justify-center text-neutral-400 hover:text-[#1B1B23] hover:bg-black/5 transition-colors cursor-pointer select-none"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Content Cards (Frame 118 Vertical Stack) */}
                <div className="w-full space-y-4 pb-6">
                  {userCard}
                  {mainActionsCard}
                  {supportCard}
                </div>
              </aside>
            </div>
          )}
        </>,
        document.body
      )}

      {/* Edit Profile Modal (Triggered by pencil button on profile card) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />
    </>
  );
}

export default ProfileSidebarMenu;
