import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  Calendar,
  PlusCircle,
  BarChart2,
  Ticket,
  Users,
  ClipboardCheck,
  RotateCcw,
  Tag,
  Scan,
  User,
  Settings,
  ArrowLeft,
  X,
} from "lucide-react";

export const ORGANIZER_NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutGrid, path: "/organizer" },
  { id: "events", label: "My Events", icon: Calendar, path: "/organizer/events" },
  { id: "create-event", label: "Create Event", icon: PlusCircle, path: "/organizer/create-event", isAction: true },
  { id: "analytics", label: "Analytics", icon: BarChart2, path: "/organizer/analytics" },
  { id: "tickets", label: "Tickets", icon: Ticket, path: "/organizer/tickets" },
  { id: "people", label: "People", icon: Users, path: "/organizer/people" },
  { id: "approvals", label: "Approvals", icon: ClipboardCheck, path: "/organizer/approvals" },
  { id: "refunds", label: "Refunds", icon: RotateCcw, path: "/organizer/refunds" },
  { id: "coupons", label: "Coupons", icon: Tag, path: "/organizer/coupons" },
  { id: "scanner", label: "Scanner", icon: Scan, path: "/organizer/scanner" },
  { id: "profile", label: "Profile", icon: User, path: "/organizer/profile" },
  { id: "settings", label: "Settings", icon: Settings, path: "/organizer/settings" },
];

export function OrganizerSidebar({
  activeId = "dashboard",
  onCreateEventClick,
  isMobileOpen = false,
  onCloseMobile,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavClick = (item) => {
    if (item.id === "create-event" && onCreateEventClick) {
      onCreateEventClick();
      if (onCloseMobile) onCloseMobile();
      return;
    }

    navigate(item.path);
    if (onCloseMobile) onCloseMobile();
  };

  const navContent = (
    <div className="flex flex-col h-full bg-white border-r border-[#e2e8f0] select-none justify-between">
      {/* 1. Sidebar Brand Header */}
      <div>
        <div className="border-b border-[#e2e8f0] px-5 py-3 flex items-center justify-between bg-white h-14">
          <Link to="/organizer" className="flex items-center group">
            <img
              src="/images/Logos/navbar%20logo.png"
              alt="Passqo"
              className="h-7 sm:h-8 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {isMobileOpen && (
            <button
              type="button"
              onClick={onCloseMobile}
              className="xl:hidden p-1.5 rounded-lg hover:bg-gray-100 text-[#64748b]"
              aria-label="Close Sidebar"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* 2. Navigation Items List - Compact fit with zero scroll */}
        <nav className="p-2.5 sm:p-3">
          <h5 className="text-[#94A3B8] mb-1.5 px-3 text-[10px] font-bold tracking-wider uppercase">
            Menu
          </h5>
          <ul className="space-y-0.5">
            {ORGANIZER_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeId === item.id;

              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleNavClick(item)}
                    className={`
                      w-full flex items-center gap-2.5 px-3 py-1.5 sm:py-2 rounded-lg text-[13px] font-medium
                      transition-all duration-150 cursor-pointer text-left
                      ${
                        isActive
                          ? "bg-blue-50 text-blue-600 font-semibold"
                          : "text-[#475569] hover:bg-slate-50 hover:text-[#0f172a]"
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 flex-shrink-0 ${
                        isActive
                          ? "text-blue-600 stroke-[2.2]"
                          : "text-[#64748B] stroke-[1.8]"
                      }`}
                    />
                    <span className="truncate">{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

      {/* 3. Bottom Exit Link */}
      <div className="p-3 border-t border-[#e2e8f0] bg-white">
        <Link
          to="/"
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] font-medium text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Passqo</span>
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Fixed Left Sidebar */}
      <aside className="hidden xl:flex fixed top-0 left-0 z-50 h-screen w-64 flex-col border-r border-[#e2e8f0] bg-white">
        {navContent}
      </aside>

      {/* Mobile Drawer */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 xl:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
          />
          <div className="fixed inset-y-0 left-0 w-64 max-w-[85vw] z-50">
            {navContent}
          </div>
        </div>
      )}
    </>
  );
}

export default OrganizerSidebar;
