import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth/storage";
import { api } from "@/lib/api";

export function NotificationBell({ className = "" }) {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) return;
    api.notifications
      .unreadCount()
      .then((d) => setUnread(d?.count || 0))
      .catch(() => {});
  }, []);

  return (
    <Link
      to="/notifications"
      className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white flex items-center justify-center border border-black/8 shadow-2xs hover:border-black/20 hover:bg-neutral-50 active:scale-95 transition-all select-none ${className}`}
      aria-label="Notifications"
      title="Notifications"
    >
      {/* Authentic Bell Icon with Green Clapper (Matching Reference) */}
      <svg className="w-5 h-5 sm:w-5.5 sm:h-5.5" viewBox="0 0 24 24" fill="none">
        <ellipse cx="12" cy="19.5" rx="2.5" ry="2" fill="#00A86B" />
        <path
          d="M12 4.5C8.96 4.5 6.5 6.96 6.5 10V14.5L5 17.5H19L17.5 14.5V10C17.5 6.96 15.04 4.5 12 4.5Z"
          stroke="#1B1B23"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {unread > 0 && (
        <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#FF4E7A] rounded-full ring-2 ring-white" />
      )}
    </Link>
  );
}

export default NotificationBell;

