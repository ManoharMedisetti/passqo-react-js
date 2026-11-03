import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth/storage";
import { api } from "@/lib/api";

export function NotificationBell() {
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    if (!isAuthenticated()) return;
    api.notifications
      .unreadCount()
      .then((d) => setUnread(d?.count || 0))
      .catch(() => {});
  }, []);

  return (
    <Link to="/notifications" className="relative block" aria-label="Notifications">
      <img
        src="/icons/notifications.svg"
        alt=""
        aria-hidden="true"
        className="w-9 h-9 lg:w-10 lg:h-10"
      />
      {unread > 0 && (
        <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-[#FF4E7A] rounded-full ring-2 ring-[#F5F0EB]" />
      )}
    </Link>
  );
}

export default NotificationBell;

