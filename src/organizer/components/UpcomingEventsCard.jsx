import { useNavigate } from "react-router-dom";
import { Calendar as CalendarIcon, MapPin, Plus } from "lucide-react";

const DEFAULT_EVENTS = [
  {
    id: "evt-cultural-fusion",
    title: "Cultural Fusion Fest 2025",
    image: "/images/figma-sample/goa/goa-hero.png",
    badge: "On Sale",
    badgeClass: "bg-emerald-500/90 text-white backdrop-blur-md",
    date: "Dec 28, 2024 • 6:00 PM",
    venue: "Dublin Docklands, Ireland",
    price: "€35.00",
    sold: 789,
    total: 1200,
    progressColor: "bg-emerald-500",
  },
  {
    id: "evt-visionary-vibes",
    title: "Visionary Vibes 2025",
    image: "/images/figma-sample/goa/performance.png",
    badge: "Selling Fast",
    badgeClass: "bg-[#0284C7]/90 text-white backdrop-blur-md",
    date: "Dec 30, 2024 • 7:30 PM",
    venue: "3Arena, Dublin",
    price: "€45.00",
    sold: 456,
    total: 800,
    progressColor: "bg-[#0284C7]",
  },
  {
    id: "evt-creative-convergence",
    title: "Creative Convergence 2025",
    image: "/images/figma-sample/goa/gallery-1.png",
    badge: "New",
    badgeClass: "bg-purple-600/90 text-white backdrop-blur-md",
    date: "Jan 5, 2025 • 10:00 AM",
    venue: "The Helix, DCU Dublin",
    price: "€25.00",
    sold: 234,
    total: 500,
    progressColor: "bg-purple-500",
  },
  {
    id: "evt-food-carnival",
    title: "Food Carnival 2025",
    image: "/images/figma-sample/f9-karting.webp",
    badge: "Draft",
    badgeClass: "bg-amber-500/90 text-white backdrop-blur-md",
    date: "Jan 12, 2025 • 12:00 PM",
    venue: "RDS Main Hall, Dublin",
    price: "€15.00",
    sold: 0,
    total: 1500,
    progressColor: "bg-neutral-300",
  },
];

export function UpcomingEventsCard({ events: propEvents, onViewCalendar, maxItems = null }) {
  const navigate = useNavigate();
  const allEvents = propEvents !== undefined ? propEvents : DEFAULT_EVENTS;
  const events = maxItems ? allEvents.slice(0, maxItems) : allEvents;

  const handleCalendarClick = () => {
    if (onViewCalendar) {
      onViewCalendar();
    } else {
      navigate("/organizer/events");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs flex flex-col justify-between h-[400px]">
      {/* Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#e2e8f0] flex-shrink-0">
        <div>
          <h3 className="text-[#0f172a] text-lg font-semibold">
            Upcoming Events
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Active and scheduled events on PassQo
          </p>
        </div>
        <button
          type="button"
          onClick={handleCalendarClick}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <span>View Calendar</span>
          <CalendarIcon className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Events List or Graceful Empty State if no data available */}
      {events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center my-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3.5 shadow-2xs">
            <CalendarIcon className="w-7 h-7 stroke-[1.8]" />
          </div>
          <h4 className="text-base font-bold text-[#0f172a]">
            No upcoming events scheduled
          </h4>
          <p className="text-xs sm:text-sm text-[#64748b] max-w-md mt-1 leading-relaxed">
            You don't have any scheduled events right now. Create and publish an event to start selling tickets and tracking performance.
          </p>
          <button
            type="button"
            onClick={() => navigate("/organizer/create-event")}
            className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Create Your First Event</span>
          </button>
        </div>
      ) : (
        <div className="pt-2 space-y-3 flex-1 overflow-y-auto scrollbar-minimal pr-1">
          {events.map((evt) => {
            const soldCount = evt.sold ?? 0;
            const totalCount = evt.total ?? 1;
            const percent =
              totalCount > 0 ? Math.round((soldCount / totalCount) * 100) : 0;

            return (
              <div
                key={evt.id}
                className="group rounded-xl border border-[#e2e8f0] bg-[#fbfcfd] hover:border-blue-400 hover:shadow-xs transition-all duration-200 overflow-hidden flex flex-col justify-between"
              >
                {/* PassQo Cover Photo Banner with Badge Overlay & Price */}
                <div className="relative h-22 sm:h-24 w-full overflow-hidden bg-slate-900">
                  <img
                    src={evt.image || "/images/figma-sample/goa/goa-hero.png"}
                    alt={evt.title || "Event Cover"}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/images/figma-sample/goa/goa-hero.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                  {/* Top Left: Status Badge */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs tracking-wide uppercase ${
                        evt.badgeClass ||
                        "bg-emerald-500/90 text-white backdrop-blur-md"
                      }`}
                    >
                      {evt.badge || "Live"}
                    </span>
                  </div>

                  {/* Top Right: Ticket Price */}
                  <div className="absolute top-2.5 right-2.5 z-10">
                    <span className="px-2.5 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-xs font-bold border border-white/20">
                      {evt.price || "Free"}
                    </span>
                  </div>
                </div>

                {/* PassQo Event Details Body */}
                <div className="p-3.5 space-y-2.5 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors line-clamp-1">
                      {evt.title || "Untitled Event"}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] mt-1">
                      <CalendarIcon className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
                      <span className="truncate">{evt.date || "Date TBA"}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-[#64748b] mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
                      <span className="truncate">
                        {evt.venue || "Location TBA"}
                      </span>
                    </div>
                  </div>

                  {/* Organizer Sales Progress Bar */}
                  <div className="pt-2 border-t border-[#f1f5f9]">
                    <div className="flex items-center justify-between text-xs text-[#64748b] mb-1 font-medium">
                      <span>
                        {soldCount} / {totalCount} sold
                      </span>
                      <span className="font-semibold text-[#0f172a]">
                        {percent}%
                      </span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-slate-200 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          evt.progressColor || "bg-emerald-500"
                        }`}
                        style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default UpcomingEventsCard;
