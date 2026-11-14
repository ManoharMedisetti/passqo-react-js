import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { Clock, Ticket, Check, ChevronRight, Bell, Zap } from "lucide-react";

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
  {
    id: "n-7",
    type: "confirmed",
    title: "Early Bird access unlocked",
    timeAgo: "5 days ago",
    detail: "Exclusive 24-hour presale for Dublin Bay Electronic Music Festival.",
    link: "/events",
    unread: false,
  },
];

export function NotificationsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [activeTab, setActiveTab] = useState("unread"); // "unread" | "all"
  const [showAllRows, setShowAllRows] = useState(false);

  const unreadCount = notifications.filter((n) => n.unread).length;
  const totalCount = notifications.length;

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => n.unread)
      : notifications;

  const displayList = showAllRows
    ? filteredNotifications
    : filteredNotifications.slice(0, 4);

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const toggleItemRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, unread: !n.unread } : n))
    );
  };

  const renderIcon = (type) => {
    switch (type) {
      case "reward":
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-[#FF4E7A]/30 bg-[#FFF0F4] flex items-center justify-center text-[#FF4E7A] flex-shrink-0 shadow-2xs">
            <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-[#FF4E7A]" />
          </div>
        );
      case "waitlist":
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-800 flex-shrink-0 shadow-2xs">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </div>
        );
      case "confirmed":
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-800 flex-shrink-0 shadow-2xs">
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </div>
        );
      case "failed":
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-red-500 flex-shrink-0 shadow-2xs">
            <Ticket className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </div>
        );
      default:
        return (
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full border border-neutral-200 bg-white flex items-center justify-center text-neutral-800 flex-shrink-0 shadow-2xs">
            <Bell className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#2C2738] overflow-x-hidden">
      <SubPageHeader title="Notifications" backTo="/" />

      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-20 sm:pt-24 md:pt-20 pb-16">
        {/* Page Heading (Clean minimal whitespace below navbar) */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <h1 className="font-display font-extrabold text-xl sm:text-3xl text-[#2C2738] tracking-tight">
              Notifications
            </h1>
            {unreadCount > 0 && (
              <span className="bg-[#FF4E7A] text-white text-[11px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full inline-flex items-center shadow-2xs">
                {unreadCount} unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-[#756C84] font-medium mt-0.5 sm:mt-1">
            Stay up to date with your reminders, team activity and invitations.
          </p>
        </div>

        {/* Notifications White Card */}
        <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#EDE8E1] shadow-2xs overflow-hidden">
          {/* Card Top Action Bar (Clean single line row beside All, zero wrapping) */}
          <div className="p-3 sm:p-4 md:p-5 flex items-center justify-between gap-2 border-b border-[#EDE8E1] bg-white">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <button
                type="button"
                onClick={() => setActiveTab("unread")}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none active:scale-95 whitespace-nowrap ${
                  activeTab === "unread"
                    ? "bg-[#FF4E7A] text-white shadow-2xs"
                    : "text-neutral-600 hover:bg-neutral-100 bg-neutral-50 sm:bg-transparent"
                }`}
              >
                Unread ({unreadCount})
              </button>

              <button
                type="button"
                onClick={() => setActiveTab("all")}
                className={`px-2.5 sm:px-4 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer select-none active:scale-95 whitespace-nowrap ${
                  activeTab === "all"
                    ? "bg-[#FF4E7A] text-white shadow-2xs"
                    : "text-neutral-600 hover:bg-neutral-100 bg-neutral-50 sm:bg-transparent"
                }`}
              >
                All ({totalCount})
              </button>
            </div>

            {/* Mark All As Read (Directly on the same row beside All) */}
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className="inline-flex items-center gap-1 sm:gap-1.5 text-xs sm:text-sm font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors cursor-pointer select-none whitespace-nowrap active:scale-95 flex-shrink-0"
              >
                <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.5]" />
                <span>Mark all as read</span>
              </button>
            )}
          </div>

          {/* Notification Items List */}
          <div className="divide-y divide-black/5">
            {displayList.length === 0 ? (
              <div className="p-8 sm:p-10 text-center text-neutral-400">
                <Bell className="w-9 h-9 sm:w-10 sm:h-10 mx-auto mb-2 text-neutral-300 stroke-[1.5]" />
                <p className="text-xs sm:text-sm font-bold text-neutral-600">
                  No notifications to show
                </p>
                <p className="text-[11px] sm:text-xs text-neutral-400 mt-0.5">
                  You are all caught up!
                </p>
              </div>
            ) : (
              displayList.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    toggleItemRead(item.id);
                    if (item.link) navigate(item.link);
                  }}
                  className="p-3.5 sm:p-5 flex items-start sm:items-center justify-between gap-3 hover:bg-neutral-50/70 active:bg-neutral-100/50 transition-colors cursor-pointer group"
                >
                  <div className="flex items-start sm:items-center gap-3 sm:gap-3.5 min-w-0 flex-1">
                    {renderIcon(item.type)}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors leading-snug">
                          {item.title}
                        </h4>
                        {item.badgeReward && (
                          <span className="px-2 py-0.5 rounded-full bg-[#FF4E7A]/10 text-[#FF4E7A] text-[10px] font-extrabold border border-[#FF4E7A]/20 shadow-2xs">
                            {item.badgeReward}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5 leading-relaxed line-clamp-2 sm:line-clamp-none">
                        <span className="font-semibold text-neutral-700">
                          {item.timeAgo}
                        </span>
                        {" • "}
                        <span>{item.detail}</span>
                      </p>
                    </div>
                  </div>

                  {/* Hot Pink Unread Dot */}
                  <div className="flex items-center gap-2 flex-shrink-0 mt-1 sm:mt-0">
                    {item.unread && (
                      <span
                        className="w-2.5 h-2.5 rounded-full bg-[#FF4E7A] shadow-xs"
                        title="Unread"
                      />
                    )}
                    {item.link && (
                      <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-neutral-600 transition-colors hidden sm:block" />
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Card Footer */}
          <div className="p-3.5 sm:p-5 border-t border-black/5 flex items-center justify-between text-xs sm:text-sm bg-neutral-50/50">
            <span className="text-neutral-500 font-medium text-[11px] sm:text-xs">
              Showing latest ({displayList.length})
            </span>

            {filteredNotifications.length > 4 && (
              <button
                type="button"
                onClick={() => setShowAllRows(!showAllRows)}
                className="font-bold text-xs sm:text-sm text-[#FF4E7A] hover:text-[#E03A64] transition-colors cursor-pointer inline-flex items-center gap-1"
              >
                <span>{showAllRows ? "Show Less ↑" : "View More →"}</span>
              </button>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default NotificationsPage;
