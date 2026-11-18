import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Calendar as CalendarIcon,
  ArrowRight,
  ChevronRight,
  Plus,
} from "lucide-react";

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

const DEFAULT_UPCOMING_EVENTS = [
  {
    id: "evt-cultural-fusion",
    slug: "cultural-fusion-fest-2025",
    title: "Cultural Fusion Fest 2025",
    image: "/images/figma-sample/goa/goa-hero.png",
    badge: "On Sale",
    badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
    date: "Dec 28, 2024 • 6:00 PM",
    venue: "Dublin Docklands, Ireland",
    price: "€35.00",
    sold: 789,
    total: 1200,
  },
  {
    id: "evt-visionary-vibes",
    slug: "visionary-vibes-2025",
    title: "Visionary Vibes 2025",
    image: "/images/figma-sample/goa/performance.png",
    badge: "Selling Fast",
    badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
    date: "Dec 30, 2024 • 7:30 PM",
    venue: "3Arena, Dublin",
    price: "€45.00",
    sold: 456,
    total: 800,
  },
  {
    id: "evt-creative-convergence",
    slug: "creative-convergence-2025",
    title: "Creative Convergence 2025",
    image: "/images/figma-sample/goa/gallery-1.png",
    badge: "New",
    badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
    date: "Jan 5, 2025 • 10:00 AM",
    venue: "The Helix, DCU Dublin",
    price: "€25.00",
    sold: 234,
    total: 500,
  },
  {
    id: "evt-food-carnival",
    slug: "food-carnival-2025",
    title: "Food Carnival 2025",
    image: "/images/figma-sample/f9-karting.webp",
    badge: "Draft",
    badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
    date: "Jan 12, 2025 • 12:00 PM",
    venue: "RDS Main Hall, Dublin",
    price: "€15.00",
    sold: 0,
    total: 1500,
  },
];

export function EventsCombinedCard({
  recentEvents: propRecentEvents,
  upcomingEvents: propUpcomingEvents,
  onViewAllEvents,
}) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("recent"); // "recent" | "upcoming"

  const recentEvents =
    propRecentEvents !== undefined ? propRecentEvents : DEFAULT_RECENT_EVENTS;
  const upcomingEvents =
    propUpcomingEvents !== undefined ? propUpcomingEvents : DEFAULT_UPCOMING_EVENTS;

  const handleActionClick = () => {
    if (onViewAllEvents) {
      onViewAllEvents();
    } else {
      navigate("/organizer/events");
    }
  };

  return (
    <div className="bg-white rounded-xl border border-[#e2e8f0] p-5 sm:p-6 shadow-xs flex flex-col justify-between h-[400px]">
      {/* ── CARD HEADER: Title + Segmented Separator Tabs (Recent vs Upcoming) + View Action ── */}
      <div className="flex items-center justify-between pb-3.5 border-b border-[#e2e8f0] gap-2.5 flex-shrink-0">
        <div>
          <h3 className="text-[#0f172a] text-lg font-semibold">
            Events
          </h3>
          <p className="text-xs text-[#64748b] mt-0.5">
            Recent activity & upcoming schedule
          </p>
        </div>

        {/* Segmented Tabs: Recent vs Upcoming */}
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center p-0.5 bg-[#f1f5f9] rounded-lg border border-[#e2e8f0]/80">
            <button
              type="button"
              onClick={() => setActiveTab("recent")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === "recent"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              <span>Recent</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === "recent"
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "bg-slate-200/80 text-[#64748b]"
                }`}
              >
                {recentEvents.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("upcoming")}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                activeTab === "upcoming"
                  ? "bg-white text-blue-600 shadow-xs"
                  : "text-[#64748b] hover:text-[#0f172a]"
              }`}
            >
              <span>Upcoming</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  activeTab === "upcoming"
                    ? "bg-blue-50 text-blue-700 font-bold"
                    : "bg-slate-200/80 text-[#64748b]"
                }`}
              >
                {upcomingEvents.length}
              </span>
            </button>
          </div>

          <button
            type="button"
            onClick={handleActionClick}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors flex-shrink-0"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ── CARD BODY: TAB 1 (RECENT EVENTS) ── */}
      {activeTab === "recent" && (
        <div className="pt-2 space-y-1.5 flex-1 overflow-y-auto scrollbar-minimal pr-1">
          {recentEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-2xs">
                <CalendarIcon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#0f172a]">
                No recent events found
              </h4>
              <p className="text-xs text-[#64748b] max-w-xs mt-1 leading-relaxed">
                Create an event to start publishing schedules, selling tickets, and managing attendees.
              </p>
            </div>
          ) : (
            recentEvents.map((evt) => (
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
                <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
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
            ))
          )}
        </div>
      )}

      {/* ── CARD BODY: TAB 2 (UPCOMING EVENTS - SAME COMPACT ROW CARD DESIGN) ── */}
      {activeTab === "upcoming" && (
        <div className="pt-2 space-y-1.5 flex-1 overflow-y-auto scrollbar-minimal pr-1">
          {upcomingEvents.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-auto">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-3 shadow-2xs">
                <CalendarIcon className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h4 className="text-sm font-bold text-[#0f172a]">
                No upcoming events scheduled
              </h4>
              <p className="text-xs text-[#64748b] max-w-xs mt-1 leading-relaxed">
                Publish a new schedule to start selling tickets and tracking performance.
              </p>
            </div>
          ) : (
            upcomingEvents.map((evt) => {
              const soldCount = evt.sold ?? 0;

              return (
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

                    {/* Title & Date / Venue / Price */}
                    <div className="min-w-0">
                      <h4 className="text-xs sm:text-sm font-bold text-[#0f172a] group-hover:text-blue-600 transition-colors truncate">
                        {evt.title || "Untitled Event"}
                      </h4>
                      <p className="text-[11px] text-[#64748b] font-medium truncate mt-0.5">
                        {evt.date} • {evt.venue} • {evt.price || "Free"}
                      </p>
                    </div>
                  </div>

                  {/* Tickets Sold, Status Badge & Arrow */}
                  <div className="flex items-center gap-2 sm:gap-2.5 flex-shrink-0">
                    <span className="text-xs font-semibold text-[#0f172a] hidden sm:inline whitespace-nowrap">
                      {soldCount.toLocaleString()} sold
                    </span>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shadow-2xs ${
                        evt.badgeColor || "bg-emerald-50 text-emerald-700 border-emerald-200"
                      }`}
                    >
                      {evt.badge || "Live"}
                    </span>

                    <ChevronRight className="w-4 h-4 text-[#94a3b8] group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}

export default EventsCombinedCard;
