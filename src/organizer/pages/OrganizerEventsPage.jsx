import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "@/lib/auth/storage";
import { MOCK_EVENTS } from "@/lib/mockData";
import {
  Plus,
  Search,
  Calendar,
  MapPin,
  Share2,
  Check,
  ExternalLink,
  Ticket,
  TrendingUp,
  Layers,
  Sparkles,
} from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";
import { CreateEventModal } from "../components/CreateEventModal";

// ── Transform authentic PassQo MOCK_EVENTS for Organizer view ──
function getInitialOrganizerEvents() {
  return MOCK_EVENTS.map((m, idx) => {
    const total =
      m.ticketTiers?.reduce((sum, t) => sum + (t.quantity || 0), 0) ||
      (m.totalSold ? m.totalSold + 250 : 600);
    const sold = m.totalSold || 0;

    let status = "active";
    let statusLabel = "On Sale";
    let badgeClass = "bg-emerald-500/90 text-white backdrop-blur-md";
    let progressColor = "bg-emerald-500";

    if (idx === 1 || idx === 4) {
      status = "active";
      statusLabel = "Selling Fast";
      badgeClass = "bg-[#0284C7]/90 text-white backdrop-blur-md";
      progressColor = "bg-[#0284C7]";
    } else if (idx === 3 || idx === 6) {
      status = "draft";
      statusLabel = "Draft";
      badgeClass = "bg-amber-500/90 text-white backdrop-blur-md";
      progressColor = "bg-neutral-300";
    } else if (idx === 7) {
      status = "ended";
      statusLabel = "Ended";
      badgeClass = "bg-slate-600/90 text-white backdrop-blur-md";
      progressColor = "bg-slate-400";
    }

    const dateObj = new Date(m.date);
    const formattedDate =
      dateObj.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      }) +
      " • " +
      dateObj.toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
      });

    return {
      id: m.id,
      slug: m.slug,
      title: m.name,
      status,
      statusLabel,
      badgeClass,
      date: formattedDate,
      venue: `${m.venue}, ${m.city}`,
      sold,
      total,
      price: m.minPrice === 0 ? "Free" : `€${m.minPrice.toFixed(2)}`,
      image: m.image,
      progressColor,
      category: m.category,
    };
  });
}

export function OrganizerEventsPage() {
  const navigate = useNavigate();
  const [user] = useState(
    () => getUser() || { name: "man events", email: "manohar@passqo.com" }
  );
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [copiedId, setCopiedId] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Real PassQo Event state initialized with our authentic events
  const [events, setEvents] = useState(getInitialOrganizerEvents);

  const handleShare = (evt) => {
    const url = window.location.origin + `/events/${evt.slug || evt.id}`;
    navigator.clipboard?.writeText?.(url);
    setCopiedId(evt.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleEventCreated = (newEvt) => {
    const createdItem = {
      id: newEvt.id,
      slug: newEvt.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
      title: newEvt.name,
      status: "active",
      statusLabel: "On Sale",
      badgeClass: "bg-emerald-500/90 text-white backdrop-blur-md",
      date: newEvt.date,
      venue: newEvt.venue,
      sold: 0,
      total: newEvt.totalCapacity || 200,
      price: newEvt.price === 0 ? "Free" : `€${newEvt.price.toFixed(2)}`,
      image: "/images/figma-sample/goa/goa-hero.png",
      progressColor: "bg-emerald-500",
      category: newEvt.category,
    };
    setEvents((prev) => [createdItem, ...prev]);
  };

  // Filtered Events
  const filteredEvents = useMemo(() => {
    return events.filter((ev) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        ev.title.toLowerCase().includes(q) ||
        ev.venue.toLowerCase().includes(q) ||
        (ev.category && ev.category.toLowerCase().includes(q));

      if (!matchesSearch) return false;
      if (activeFilter === "active") return ev.status === "active";
      if (activeFilter === "draft") return ev.status === "draft";
      if (activeFilter === "ended") return ev.status === "ended";
      return true;
    });
  }, [events, searchQuery, activeFilter]);

  // Aggregate Metrics
  const metrics = useMemo(() => {
    const totalEvents = events.length;
    const activeEvents = events.filter((e) => e.status === "active").length;
    const totalTicketsSold = events.reduce((sum, e) => sum + e.sold, 0);
    const totalCapacity = events.reduce((sum, e) => sum + e.total, 0);
    const overallSoldPercent =
      totalCapacity > 0
        ? Math.round((totalTicketsSold / totalCapacity) * 100)
        : 0;

    return {
      totalEvents,
      activeEvents,
      totalTicketsSold,
      overallSoldPercent,
    };
  }, [events]);

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="events"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        onCreateEventClick={() => setIsCreateModalOpen(true)}
      />

      <OrganizerHeader
        title="My Events"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-14 space-y-6 max-w-7xl mx-auto">
        {/* ── 1. Page Header with Title & CTA ── */}
        <section className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
                My Events
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {events.length} Events
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
              Manage your active, scheduled, and draft events on PassQo
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateModalOpen(true)}
            className="h-10 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Create Event</span>
          </button>
        </section>

        {/* ── 2. Real Performance KPI Bar ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-xs">
            <span className="text-xs font-medium text-[#64748b] block">
              Total Events
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
              {metrics.totalEvents}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">
              Published on platform
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-xs">
            <span className="text-xs font-medium text-[#64748b] block">
              Active & Scheduled
            </span>
            <div className="text-xl sm:text-2xl font-bold text-blue-600 mt-1">
              {metrics.activeEvents}
            </div>
            <span className="text-[11px] font-semibold text-[#64748b]">
              Available for purchase
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-xs">
            <span className="text-xs font-medium text-[#64748b] block">
              Tickets Sold
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
              {metrics.totalTicketsSold.toLocaleString()}
            </div>
            <span className="text-[11px] font-semibold text-emerald-600">
              Across all events
            </span>
          </div>

          <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-xs">
            <span className="text-xs font-medium text-[#64748b] block">
              Overall Capacity Fill
            </span>
            <div className="text-xl sm:text-2xl font-bold text-[#0f172a] mt-1">
              {metrics.overallSoldPercent}%
            </div>
            <span className="text-[11px] font-semibold text-blue-600">
              Average sales rate
            </span>
          </div>
        </div>

        {/* ── 3. Filter Tabs & Search Field ── */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { id: "all", label: `All (${events.length})` },
              {
                id: "active",
                label: `Active (${events.filter((e) => e.status === "active").length})`,
              },
              {
                id: "draft",
                label: `Drafts (${events.filter((e) => e.status === "draft").length})`,
              },
              {
                id: "ended",
                label: `Ended (${events.filter((e) => e.status === "ended").length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeFilter === tab.id
                    ? "bg-[#0F172A] text-white shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Field */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by title, venue, city..."
              className="w-full h-9 pl-9 pr-3.5 rounded-full bg-[#F8FAFC] border border-[#e2e8f0] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-blue-500 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* ── 4. Authentic PassQo Event Cards Grid ── */}
        {filteredEvents.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e2e8f0] p-12 text-center space-y-3">
            <Layers className="w-10 h-10 text-[#94a3b8] mx-auto" />
            <h3 className="text-base font-bold text-[#0f172a]">
              No events found
            </h3>
            <p className="text-xs text-[#64748b] max-w-sm mx-auto">
              There are no events matching your search or active filter. Try
              adjusting your search query or reset filters.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("all");
              }}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-[#0f172a] transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredEvents.map((evt) => {
              const totalCap = evt.total ?? 0;
              const soldCap = evt.sold ?? 0;
              const percent =
                totalCap > 0 ? Math.round((soldCap / totalCap) * 100) : 0;

              return (
                <article
                  key={evt.id}
                  className="group rounded-2xl border border-[#e2e8f0] bg-white overflow-hidden shadow-xs hover:border-blue-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                >
                  {/* Event Cover Photo with Status Badge and Price Overlay */}
                  <div className="relative h-44 w-full overflow-hidden bg-slate-900">
                    <img
                      src={evt.image || "/images/figma-sample/goa/goa-hero.png"}
                      alt={evt.title || "Event Cover"}
                      className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src =
                          "/images/figma-sample/goa/goa-hero.png";
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-black/25 pointer-events-none" />

                    {/* Top Left: Status Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs tracking-wide uppercase ${
                          evt.badgeClass ||
                          "bg-emerald-500/90 text-white backdrop-blur-md"
                        }`}
                      >
                        {evt.statusLabel || "Live"}
                      </span>
                    </div>

                    {/* Top Right: Ticket Price */}
                    <div className="absolute top-3 right-3 z-10">
                      <span className="px-2.5 py-0.5 rounded-md bg-black/65 backdrop-blur-md text-white text-xs font-bold border border-white/20 shadow-xs">
                        {evt.price || "Free"}
                      </span>
                    </div>
                  </div>

                  {/* Event Details Body */}
                  <div className="p-4 sm:p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-base text-[#0f172a] group-hover:text-blue-600 transition-colors line-clamp-1 tracking-tight">
                        {evt.title || "Untitled Event"}
                      </h3>

                      <div className="space-y-1.5 mt-2.5 text-xs text-[#64748b]">
                        <p className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
                          <span className="truncate">{evt.date || "Date TBA"}</span>
                        </p>
                        <p className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5 text-[#94a3b8] flex-shrink-0" />
                          <span className="truncate">{evt.venue || "Location TBA"}</span>
                        </p>
                      </div>
                    </div>

                    {/* Sales Capacity Progress Bar */}
                    <div className="pt-3 border-t border-[#f1f5f9] space-y-1.5">
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-[#64748b] font-medium">
                          {soldCap.toLocaleString()} /{" "}
                          {totalCap.toLocaleString()} sold
                        </span>
                        <span className="font-bold text-[#0f172a]">
                          {percent}%
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-slate-100 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            evt.progressColor || "bg-emerald-500"
                          }`}
                          style={{
                            width: `${Math.min(100, Math.max(0, percent))}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card Actions Footer */}
                  <div className="px-4 sm:px-5 py-3 border-t border-[#f1f5f9] bg-[#fbfcfd] flex items-center justify-between gap-2">
                    <Link
                      to={`/events/${evt.slug || evt.id}`}
                      className="text-xs font-semibold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1.5 py-1 px-2 rounded-lg hover:bg-blue-50 transition-colors"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>View Live</span>
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleShare(evt)}
                      className="h-8 px-3 rounded-lg bg-white border border-[#e2e8f0] hover:border-slate-300 hover:bg-slate-50 text-xs font-semibold text-[#0f172a] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                    >
                      {copiedId === evt.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                          <span className="text-emerald-700">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3.5 h-3.5 text-[#64748b]" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      {/* Modal to Create New Event */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleEventCreated}
      />
    </div>
  );
}

export default OrganizerEventsPage;
