import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, Bell, Moon, Sun, Menu, ChevronDown, User as UserIcon, Settings, LogOut } from "lucide-react";

export function OrganizerHeader({
  title = "Dashboard-1",
  onOpenMobileSidebar,
  searchQuery,
  onSearchChange,
  user,
}) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  return (
    <header className="fixed top-0 right-0 z-40 flex items-center justify-between border-b border-[#e2e8f0] bg-white/90 backdrop-blur-md px-4 sm:px-6 py-3.5 xl:w-[calc(100%-256px)] w-full select-none transition-all">
      {/* Left: Mobile Toggle / Collapse + Page Title matching Venue X */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="xl:hidden p-2 rounded-lg bg-gray-50 border border-[#e2e8f0] text-[#475569] hover:bg-gray-100 cursor-pointer"
          aria-label="Open sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Mobile Top-Left Logo */}
        <Link to="/organizer" className="xl:hidden flex items-center">
          <img
            src="/images/Logos/navbar%20logo.png"
            alt="Passqo"
            className="h-7 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="hidden xl:flex items-center justify-center w-8 h-8 rounded-lg bg-gray-100/70 hover:bg-gray-200 text-[#475569] text-xs transition-colors"
            title="Toggle Sidebar"
          >
            &lt;
          </button>
          <h2 className="text-[#0f172a] text-base sm:text-xl font-bold tracking-tight">
            {title}
          </h2>
        </div>
      </div>

      {/* Right: Search, Notifications, Theme, User Avatar matching Venue X */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search input with magnifying glass */}
        <div className="relative hidden md:block w-48 lg:w-64">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
          <input
            type="text"
            value={searchQuery || ""}
            onChange={(e) => onSearchChange && onSearchChange(e.target.value)}
            placeholder="Search..."
            className="w-full h-9 pl-9 pr-3.5 rounded-md border border-[#e2e8f0] bg-[#f8fafc] text-xs sm:text-sm text-[#0f172a] placeholder:text-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
          />
        </div>

        {/* Notification with Dropdown */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen(!isNotifOpen)}
            className="relative w-9 h-9 rounded-xl flex items-center justify-center text-[#64748b] hover:bg-gray-100 hover:text-[#0f172a] transition-colors cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 top-12 w-72 bg-white rounded-xl border border-[#e2e8f0] shadow-xl p-3 z-50 space-y-2 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-2 border-b border-[#e2e8f0]">
                <span className="font-bold text-xs text-[#0f172a]">Notifications</span>
                <span className="text-[11px] font-semibold text-blue-600 cursor-pointer">Mark read</span>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
                <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-[#0f172a]">🎟️ 2 VIP tickets booked</p>
                  <p className="text-[10px] text-[#94a3b8]">Suncoast Electronic Beat • 2m ago</p>
                </div>
                <div className="p-2 rounded-lg bg-gray-50 border border-gray-100">
                  <p className="font-semibold text-[#0f172a]">✅ Payout batch completed</p>
                  <p className="text-[10px] text-[#94a3b8]">€2,150 transferred • 1h ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Theme Toggle matching Venue X */}
        <button
          type="button"
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-[#64748b] hover:bg-gray-100 hover:text-[#0f172a] transition-colors cursor-pointer"
          title="Toggle Theme"
        >
          {isDarkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* User Profile Avatar with Caret & Dropdown matching Venue X */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
            className="flex items-center gap-2 p-1 sm:px-2 sm:py-1 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 rounded-full overflow-hidden bg-blue-100 border border-blue-200 flex items-center justify-center flex-shrink-0">
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80"
                alt="Emma"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            </div>
            <ChevronDown className="w-4 h-4 text-[#64748b]" />
          </button>

          {isUserMenuOpen && (
            <div className="absolute right-0 top-12 w-44 bg-white rounded-xl border border-[#e2e8f0] shadow-xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95">
              <Link
                to="/organizer/profile"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#0f172a] hover:bg-gray-100 transition-colors"
              >
                <UserIcon className="w-4 h-4 text-[#64748b]" />
                <span>Profile</span>
              </Link>
              <Link
                to="/organizer/settings"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-[#0f172a] hover:bg-gray-100 transition-colors"
              >
                <Settings className="w-4 h-4 text-[#64748b]" />
                <span>Settings</span>
              </Link>
              <div className="border-t border-[#e2e8f0] my-1" />
              <Link
                to="/"
                onClick={() => setIsUserMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut className="w-4 h-4 text-red-500" />
                <span>Exit Portal</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default OrganizerHeader;
