import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Bell,
  Check,
  Clock,
  Ticket,
  Zap,
  X,
  ChevronRight,
  Sparkles,
} from "lucide-react";

const INITIAL_NOTIFICATIONS = [
  {
    id: "n-quest-1",
    type: "reward",
    title: "Complete profile to earn badge!",
    timeAgo: "Just now",
    detail: "Finish your profile details to unlock the 'Profile Prodigy' badge and claim +50 XP.",
    link: "/rewards",
    badgeReward: "+50 XP",
    unread: true,
  },
  {
    id: "n-quest-2",
    type: "reward",
    title: "Level 4 Regular Unlocked! 🏆",
    timeAgo: "1 hour ago",
    detail: "You reached 600 XP! Free ticket transfers and extended event history are now unlocked.",
    link: "/rewards",
    badgeReward: "Level Up",
    unread: true,
  },
  {
    id: "n-1",
    type: "waitlist",
    title: "You're on the waitlist!",
    timeAgo: "2 min ago",
    detail: "We'll notify you as soon as a spot becomes available.",
    unread: true,
  },
  {
    id: "n-2",
    type: "confirmed",
    title: "Booking confirmed!",
    timeAgo: "5 min ago",
    detail: "Your booking is confirmed. 1 ticket is now available in your wallet.",
    link: "/tickets",
    unread: true,
  },
  {
    id: "n-3",
    type: "failed",
    title: "Booking Failed!",
    timeAgo: "35 min ago",
    detail: "Payment authorization timed out. Please try again or use another payment method.",
    unread: true,
  },
  {
    id: "n-4",
    type: "waitlist",
    title: "Seat allocation in progress",
    timeAgo: "2 hours ago",
    detail: "Your spot in line has advanced. Hold tight as seats are assigned!",
    unread: true,
  },
  {
    id: "n-5",
    type: "confirmed",
    title: "Booking confirmed!",
    timeAgo: "1 day ago",
    detail: "Your booking for Tech for a Better Tomorrow is confirmed.",
    link: "/tickets",
    unread: false,
  },
  {
    id: "n-6",
    type: "confirmed",
    title: "Ticket transfer received",
    timeAgo: "3 days ago",
    detail: "Rakesh transferred 1 General Admission pass to you.",
    link: "/tickets",
    unread: false,
  },
];

export function NotificationBell({ className = "" }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("unread"); // "unread" | "all"
  const popoverRef = useRef(null);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  // Close on Click Outside or Escape
  useEffect(() => {
    if (!isOpen) return;

    const handlePointerDown = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const handleItemClick = (item) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === item.id ? { ...n, unread: false } : n))
    );
    if (item.link) {
      setIsOpen(false);
      navigate(item.link);
    }
  };

  const renderIcon = (type) => {
    switch (type) {
      case "reward":
        return (
          <div className="w-8 h-8 rounded-full bg-[#FFF0F4] border border-[#FFD5E0] text-[#FF4E7A] flex items-center justify-center flex-shrink-0">
            <Zap className="w-3.5 h-3.5 fill-[#FF4E7A]" />
          </div>
        );
      case "confirmed":
        return (
          <div className="w-8 h-8 rounded-full bg-[#E6F9F4] border border-[#A7EAD7] text-[#00C896] flex items-center justify-center flex-shrink-0">
            <Ticket className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        );
      case "waitlist":
        return (
          <div className="w-8 h-8 rounded-full bg-[#FFF3E8] border border-[#FFD9B3] text-[#FF8A38] flex items-center justify-center flex-shrink-0">
            <Clock className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        );
      case "failed":
        return (
          <div className="w-8 h-8 rounded-full bg-[#FFEBEF] border border-[#FFCCD5] text-[#E11D48] flex items-center justify-center flex-shrink-0">
            <Ticket className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-[#F5EFF2] text-[#2C2738] flex items-center justify-center flex-shrink-0">
            <Bell className="w-3.5 h-3.5 stroke-[2]" />
          </div>
        );
    }
  };

  const handleBellClick = () => {
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      // Mobile: No popup, open full screen notifications view directly
      navigate("/notifications");
    } else {
      // Desktop: Toggle dropdown popup right below the button
      setIsOpen((prev) => !prev);
    }
  };

  return (
    <div ref={popoverRef} className="relative inline-block">
      {/* ── 1. BELL BUTTON TRIGGER (Full Screen on Mobile, Dropdown on Desktop) ── */}
      <button
        type="button"
        onClick={handleBellClick}
        className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border transition-all select-none cursor-pointer active:scale-95 shadow-2xs ${
          isOpen
            ? "border-[#FF4E7A] ring-2 ring-[#FF4E7A]/20 bg-[#FFF0F4]"
            : "border-[#EDE8E1] hover:border-[#FF4E7A]/40 hover:bg-[#FBF9F6]"
        } ${className}`}
        aria-label="Open notifications"
        aria-expanded={isOpen}
        title="Notifications"
      >
        {/* Authentic Bell Icon with Green Clapper */}
        <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" viewBox="0 0 24 24" fill="none">
          <ellipse cx="12" cy="19.5" rx="2.5" ry="2" fill="#00A86B" />
          <path
            d="M12 4.5C8.96 4.5 6.5 6.96 6.5 10V14.5L5 17.5H19L17.5 14.5V10C17.5 6.96 15.04 4.5 12 4.5Z"
            stroke="#2C2738"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>

        {/* Unread Pink Notification Beacon */}
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF4E7A] rounded-full ring-2 ring-white animate-pulse" />
        )}
      </button>

      {/* ── 2. DESKTOP-ONLY DROPDOWN POPUP (Hidden on Mobile — Mobile uses Full Screen) ── */}
      {isOpen && (
        <div
          className="hidden md:flex absolute right-0 top-full mt-2 w-[380px] lg:w-[400px] bg-white rounded-3xl border border-[#EDE8E1] shadow-[0_16px_48px_rgba(44,39,56,0.16)] z-[200] flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
          role="dialog"
          aria-label="Notifications Dropdown"
        >
          {/* Solid Header */}
          <div className="px-4 py-3 border-b border-[#F2EDE6] bg-white flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="font-display font-bold text-sm text-[#2C2738]">
                Notifications
              </span>
              {unreadCount > 0 && (
                <span className="bg-[#FF4E7A] text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full shadow-2xs">
                  {unreadCount} new
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  className="text-[11px] font-bold text-[#8C8599] hover:text-[#FF4E7A] transition-colors cursor-pointer"
                >
                  Mark all read
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-6 h-6 rounded-full hover:bg-[#F5EFF2] text-[#8C8599] hover:text-[#2C2738] flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close notifications"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="px-4 py-2 border-b border-[#F2EDE6] bg-[#FBF9F6] flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "unread"
                    ? "bg-[#FF4E7A] text-white shadow-2xs"
                    : "text-[#756C84] hover:text-[#2C2738]"
                }`}
              >
                Unread ({unreadCount})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  activeTab === "all"
                    ? "bg-[#FF4E7A] text-white shadow-2xs"
                    : "text-[#756C84] hover:text-[#2C2738]"
                }`}
              >
                All ({notifications.length})
              </button>
            </div>

            <Link
              to="/rewards"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-[#FF4E7A] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3 text-[#FF4E7A]" />
              <span>Quests</span>
            </Link>
          </div>

          {/* Notification Items List: Clean Solid Background & Solid Hover States */}
          <div className="max-h-[360px] sm:max-h-[380px] overflow-y-auto divide-y divide-[#F2EDE6] overscroll-contain bg-white">
            {filteredNotifications.length === 0 ? (
              <div className="py-10 text-center px-4 bg-white">
                <div className="w-10 h-10 rounded-full bg-[#F5EFF2] text-[#8C8599] flex items-center justify-center mx-auto mb-2">
                  <Check className="w-5 h-5 text-[#00C896]" />
                </div>
                <p className="font-bold text-xs text-[#2C2738]">All caught up!</p>
                <p className="text-[11px] text-[#8C8599] mt-0.5">
                  No unread notifications at the moment.
                </p>
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item.id}
                  onClick={() => handleItemClick(item)}
                  className={`p-3.5 flex items-start gap-3 transition-colors cursor-pointer group select-none ${
                    item.unread ? "bg-[#FFF5F8] hover:bg-[#FFEBF1]" : "bg-white hover:bg-[#F7F4F0]"
                  }`}
                >
                  {renderIcon(item.type)}

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <h4
                        className={`text-xs truncate ${
                          item.unread
                            ? "font-bold text-[#2C2738]"
                            : "font-semibold text-[#5A5268]"
                        }`}
                      >
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-[#8C8599] flex-shrink-0">
                        {item.timeAgo}
                      </span>
                    </div>

                    <p className="text-[11px] text-[#756C84] leading-relaxed line-clamp-2">
                      {item.detail}
                    </p>

                    <div className="flex items-center gap-2 mt-1.5">
                      {item.badgeReward && (
                        <span className="text-[10px] font-extrabold text-[#FF4E7A] bg-[#FFF0F4] border border-[#FFD5E0] px-2 py-0.2 rounded-full">
                          {item.badgeReward}
                        </span>
                      )}
                      {item.link && (
                        <span className="text-[10px] font-bold text-[#756C84] group-hover:text-[#FF4E7A] flex items-center gap-0.5 transition-colors">
                          View details <ChevronRight className="w-2.5 h-2.5" />
                        </span>
                      )}
                    </div>
                  </div>

                  {item.unread && (
                    <span className="w-2 h-2 rounded-full bg-[#FF4E7A] mt-1.5 flex-shrink-0" />
                  )}
                </div>
              ))
            )}
          </div>

          {/* Solid Footer Bar (No Full Page Link) */}
          <div className="py-2.5 px-4 bg-[#FBF9F6] border-t border-[#EDE8E1] flex items-center justify-between text-xs font-semibold">
            <span className="text-[11px] font-medium text-[#8C8599]">
              {unreadCount > 0 ? `${unreadCount} unread alert${unreadCount > 1 ? "s" : ""}` : "All alerts caught up"}
            </span>

            <Link
              to="/tickets"
              onClick={() => setIsOpen(false)}
              className="text-[11px] font-bold text-[#FF4E7A] hover:text-[#E03A64] hover:underline transition-colors"
            >
              My Tickets →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationBell;
