import { useNavigate } from "react-router-dom";
import { ArrowRight, ChevronRight, Calendar, Plus } from "lucide-react";

const DEFAULT_RECENT_EVENTS = [
  {
    id: "evt-dublin-bay-electronic",
    slug: "dublin-bay-electronic-festival",
    title: "Dublin Bay Electronic Music Festival",
    image: "/images/figma-sample/goa/goa-hero.png",
    date: "20 Nov 2026",
    venue: "3Arena & Docklands, Dublin",
    sold: 1240,
    total: 1850,
    status: "active",
    statusLabel: "On Sale",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "evt-tech-summit",
    slug: "universal-tech-ai-summit-2026",
    title: "Universal Tech & AI Developer Summit 2026",
    image: "/images/figma-sample/goa/performance.png",
    date: "5 Dec 2026",
    venue: "CCD, Dublin Docklands",
    sold: 850,
    total: 1200,
    status: "active",
    statusLabel: "Selling Fast",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "evt-f9-karting",
    slug: "f9-go-karting-championship-2026",
    title: "F9 Go-Karting Championship 2026",
    image: "/images/figma-sample/f9-karting.webp",
    date: "28 Nov 2026",
    venue: "F9 Speed Circuit, London",
    sold: 620,
    total: 800,
    status: "active",
    statusLabel: "On Sale",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
  {
    id: "evt-pottery-workshop",
    slug: "clay-cocktails-ceramic-studio-workshop",
    title: "Clay & Cocktails: Ceramic Studio Workshop",
    image: "/images/figma-sample/goa/headliner.png",
    date: "5 Dec 2026",
    venue: "Kilkenny Design Studio",
    sold: 24,
    total: 50,
    status: "draft",
    statusLabel: "Draft",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
  },
  {
    id: "evt-modern-art",
    slug: "neon-horizons-art-expo",
    title: "Neon Horizons: Contemporary Art Expo",
    image: "/images/figma-sample/goa/gallery-2.png",
    date: "12 Oct 2026",
    venue: "Brick Lane Galleries, London",
    sold: 460,
    total: 500,
    status: "ended",
    statusLabel: "Ended",
    badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-300",
  },
  {
    id: "evt-galway-yoga",
    slug: "galway-bay-sunrise-yoga",
    title: "Galway Bay Sunrise Yoga & Meditation",
    image: "/images/figma-sample/goa/stage-a.png",
    date: "18 Nov 2026",
    venue: "Salthill Promenade, Galway",
    sold: 140,
    total: 150,
    status: "active",
    statusLabel: "Selling Fast",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
  },
  {
    id: "evt-film-festival",
    slug: "dublin-indie-film-festival",
    title: "Dublin Indie Film Screening & Director Q&A",
    image: "/images/figma-sample/goa/highlight.png",
    date: "10 Dec 2026",
    venue: "Irish Film Institute (IFI), Dublin",
    sold: 310,
    total: 400,
    status: "active",
    statusLabel: "On Sale",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
  },
];

export function RecentEventsCard({ events: propEvents, onViewAll, maxItems = null }) {
  const navigate = useNavigate();
  const allEvents = propEvents !== undefined ? propEvents : DEFAULT_RECENT_EVENTS;
  const events = maxItems ? allEvents.slice(0, maxItems) : allEvents;

  const handleViewAllClick = () => {
    if (onViewAll) {
      onViewAll();
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
            Recent Events
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Recently published and updated events
          </p>
        </div>
        <button
          type="button"
          onClick={handleViewAllClick}
          className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer px-2.5 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Events List or Empty State */}
      {events.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-2xs">
            <Calendar className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h4 className="text-sm font-bold text-[#0f172a]">
            No recent events found
          </h4>
          <p className="text-xs text-[#64748b] max-w-xs mt-1 leading-relaxed">
            Create an event to start publishing schedules, selling tickets, and managing attendees.
          </p>
          <button
            type="button"
            onClick={() => navigate("/organizer/create-event")}
            className="mt-4 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Event</span>
          </button>
        </div>
      ) : (
        <div className="pt-2 space-y-1.5 flex-1 overflow-y-auto scrollbar-minimal pr-1">
          {events.map((evt) => (
            <div
              key={evt.id}
              onClick={() => navigate(evt.slug ? `/events/${evt.slug}` : "/organizer/events")}
              className="group flex items-center justify-between gap-3 p-2 sm:p-2.5 rounded-xl hover:bg-slate-50/90 transition-all border border-transparent hover:border-[#e2e8f0]/80 cursor-pointer"
            >
              {/* Event Cover Photo Thumbnail */}
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-11 h-11 rounded-xl overflow-hidden bg-slate-100 border border-[#e2e8f0] shadow-2xs flex-shrink-0">
                  <img
                    src={evt.image || "/images/figma-sample/goa/goa-hero.png"}
                    alt={evt.title || "Event Cover"}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.src = "/images/figma-sample/goa/goa-hero.png";
                    }}
                  />
                </div>

                {/* Title & Date / Venue */}
                <div className="min-w-0">
                  <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors truncate">
                    {evt.title || "Untitled Event"}
                  </h4>
                  <p className="text-[11px] text-[#64748b] font-medium truncate mt-0.5">
                    {evt.date} • {evt.venue}
                  </p>
                </div>
              </div>

              {/* Tickets Sold, Status Badge & Arrow */}
              <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
                <span className="text-xs font-semibold text-[#0f172a] hidden sm:inline whitespace-nowrap">
                  {evt.sold.toLocaleString()} sold
                </span>

                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
                    evt.badgeColor || "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }`}
                >
                  {evt.statusLabel || "Active"}
                </span>

                <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentEventsCard;

