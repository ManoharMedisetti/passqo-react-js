import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Plus,
  Calendar,
  Ticket,
  TrendingUp,
  Users,
  QrCode,
  Sparkles,
  Search,
  CheckCircle2,
  Clock,
  ChevronRight,
  MoreVertical,
  X,
  Share2,
  DollarSign,
  ArrowUpRight,
  ShieldCheck,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { getUser } from "@/lib/auth/storage";
import { api } from "@/lib/api";

const INITIAL_EVENTS = [
  {
    id: "evt-dublin-indie-2026",
    name: "Dublin Bay Electronic Music Festival 2026",
    category: "MUSIC_ENTERTAINMENT",
    status: "LIVE",
    date: "Fri, 20 Nov - Sun, 22 Nov 2026",
    time: "18:00 - 23:30",
    venue: "3Arena & Docklands, Dublin",
    ticketsSold: 1240,
    totalCapacity: 1500,
    price: 45,
    grossRevenue: 55800,
    image: "/images/figma-sample/goa/goa-hero.png",
  },
  {
    id: "evt-acoustic-sunset",
    name: "Acoustic Sunset & Indie Melodies Showcase",
    category: "MUSIC_ENTERTAINMENT",
    status: "SELLING_FAST",
    date: "Sun, 29 Nov 2026",
    time: "18:30 - 22:00",
    venue: "The Grand Social, Dublin",
    ticketsSold: 180,
    totalCapacity: 200,
    price: 18,
    grossRevenue: 3240,
    image: null,
  },
  {
    id: "evt-tech-summit-2027",
    name: "European Web3 & AI Builders Summit 2027",
    category: "TECH_CONFERENCE",
    status: "DRAFT",
    date: "Thu, 15 Jan 2027",
    time: "09:00 - 18:00",
    venue: "Convention Centre Dublin (CCD)",
    ticketsSold: 0,
    totalCapacity: 800,
    price: 120,
    grossRevenue: 0,
    image: null,
  },
];

export function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getUser() || null);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "live" | "draft" | "past"
  const [events, setEvents] = useState(INITIAL_EVENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Event Form State
  const [eventName, setEventName] = useState("");
  const [eventCategory, setEventCategory] = useState("Music and Entertainment");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventPrice, setEventPrice] = useState("25");
  const [eventCapacity, setEventCapacity] = useState("150");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Attempt to load from api.organizer if online
    api.organizer
      ?.myEvents?.()
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(() => {
        // Fallback to initial mock events
      });
  }, []);

  const totalTicketsSold = events.reduce((acc, ev) => acc + (ev.ticketsSold || 0), 0);
  const totalRevenue = events.reduce((acc, ev) => acc + (ev.grossRevenue || 0), 0);
  const liveEventsCount = events.filter((ev) => ev.status === "LIVE" || ev.status === "SELLING_FAST").length;

  const filteredEvents = events.filter((ev) => {
    const matchesQuery = ev.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (ev.venue && ev.venue.toLowerCase().includes(searchQuery.toLowerCase()));
    if (!matchesQuery) return false;
    if (activeTab === "live") return ev.status === "LIVE" || ev.status === "SELLING_FAST";
    if (activeTab === "draft") return ev.status === "DRAFT";
    if (activeTab === "past") return ev.status === "PAST";
    return true;
  });

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    setIsSubmitting(true);
    const newEvt = {
      id: "evt-custom-" + Date.now(),
      name: eventName.trim(),
      category: eventCategory,
      status: "LIVE",
      date: eventDate || "Sat, 12 Dec 2026",
      time: "19:00 - 23:00",
      venue: eventVenue.trim() || "Dublin City Center, Ireland",
      ticketsSold: 0,
      totalCapacity: parseInt(eventCapacity, 10) || 100,
      price: parseFloat(eventPrice) || 0,
      grossRevenue: 0,
      image: null,
    };

    setTimeout(() => {
      setEvents((prev) => [newEvt, ...prev]);
      setIsSubmitting(false);
      setIsCreateModalOpen(false);
      setEventName("");
      setEventVenue("");
      setEventDate("");
    }, 400);
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#2C2738] pb-24 md:pb-16">
      {/* ── SubPage Header ── */}
      <SubPageHeader title="Organiser Dashboard" />

      <main className="max-w-[1120px] mx-auto px-4 sm:px-6 lg:px-8 pt-20 sm:pt-24 space-y-6 sm:space-y-8">
        {/* ── HERO BANNER: Welcome & Quick Action ── */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-xs border border-[#EDE8E1] flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
          <div className="space-y-1.5 relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF4E7A] bg-[#FFF0F4] border border-[#FFD5E0] px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified Host
              </span>
              <span className="text-xs text-[#756C84] font-medium">Passqo Pro</span>
            </div>
            <h1 className="font-display font-black text-2xl sm:text-3xl text-[#2C2738] tracking-tight">
              Welcome back, {user?.name || "Organiser"}
            </h1>
            <p className="text-xs sm:text-sm text-[#756C84] max-w-xl">
              Host experiences, monitor real-time ticket sales, scan admissions at the door, and manage event attendees seamlessly.
            </p>
          </div>

          <div className="flex items-center gap-3 relative z-10 flex-shrink-0">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(true)}
              className="h-11 sm:h-12 px-5 sm:px-6 rounded-full bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] hover:brightness-105 active:scale-95 text-white font-label font-bold text-xs sm:text-sm shadow-[0_4px_18px_rgba(255,78,122,0.35)] flex items-center gap-2 transition-all cursor-pointer whitespace-nowrap"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Create New Event</span>
            </button>
          </div>

          {/* Background subtle decoration */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-[#FFF0F4]/60 to-transparent pointer-events-none rounded-r-3xl" />
        </section>

        {/* ── METRIC CARDS ── */}
        <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Total Revenue */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#756C84]">
              <span className="text-xs font-semibold uppercase tracking-wider">Gross Sales</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF0F4] flex items-center justify-center text-[#FF4E7A]">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#2C2738] tracking-tight">
                €{totalRevenue.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#00C896] font-bold flex items-center gap-0.5 mt-0.5">
                <TrendingUp className="w-3 h-3" />
                <span>+14.8% this month</span>
              </p>
            </div>
          </div>

          {/* Card 2: Tickets Sold */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#756C84]">
              <span className="text-xs font-semibold uppercase tracking-wider">Tickets Sold</span>
              <div className="w-8 h-8 rounded-full bg-[#FFF0F4] flex items-center justify-center text-[#FF4E7A]">
                <Ticket className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#2C2738] tracking-tight">
                {totalTicketsSold.toLocaleString()}
              </p>
              <p className="text-[11px] text-[#756C84] font-medium mt-0.5">
                Across {events.length} listed events
              </p>
            </div>
          </div>

          {/* Card 3: Active Live Events */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#756C84]">
              <span className="text-xs font-semibold uppercase tracking-wider">Active Events</span>
              <div className="w-8 h-8 rounded-full bg-[#F0FAF7] flex items-center justify-center text-[#00C896]">
                <Calendar className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-black text-[#2C2738] tracking-tight">
                {liveEventsCount}
              </p>
              <p className="text-[11px] text-[#00C896] font-bold mt-0.5">
                Selling live right now
              </p>
            </div>
          </div>

          {/* Card 4: Ticket Scanner Quick Tool */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-[#EDE8E1] shadow-2xs space-y-2">
            <div className="flex items-center justify-between text-[#756C84]">
              <span className="text-xs font-semibold uppercase tracking-wider">Door Scanner</span>
              <div className="w-8 h-8 rounded-full bg-[#EDE8E1] flex items-center justify-center text-[#2C2738]">
                <QrCode className="w-4 h-4" />
              </div>
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-[#2C2738] leading-tight">
                Quick Admission
              </p>
              <button
                type="button"
                onClick={() => alert("Scanner ready. Point camera at guest QR code to admit ticket.")}
                className="mt-1 text-[11px] text-[#FF4E7A] font-bold hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Launch Scanner</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </section>

        {/* ── EVENTS MANAGEMENT SECTION ── */}
        <section className="bg-white rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-[#EDE8E1] shadow-xs space-y-5">
          {/* Controls Bar: Tabs & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pb-3 border-b border-[#EDE8E1]">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 bg-[#F5F0EB] p-1 rounded-full overflow-x-auto scrollbar-hide">
              {[
                { id: "all", label: "All Events" },
                { id: "live", label: "Live & Selling" },
                { id: "draft", label: "Drafts" },
                { id: "past", label: "Past" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 sm:px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                    activeTab === tab.id
                      ? "bg-white text-[#2C2738] shadow-2xs"
                      : "text-[#756C84] hover:text-[#2C2738]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search filter input */}
            <div className="relative min-w-[200px] sm:w-64">
              <Search className="w-4 h-4 text-[#756C84] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title or venue..."
                className="w-full h-9 pl-9 pr-3 text-xs bg-[#F5F0EB] border border-transparent focus:border-[#FF4E7A] rounded-full focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Events List */}
          {filteredEvents.length === 0 ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#FF4E7A] flex items-center justify-center mx-auto">
                <Calendar className="w-6 h-6" />
              </div>
              <p className="text-sm font-bold text-[#2C2738]">No events found</p>
              <p className="text-xs text-[#756C84]">Create a new event or adjust your search filter above.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredEvents.map((ev) => {
                const fillPercent = Math.min(100, Math.round(((ev.ticketsSold || 0) / (ev.totalCapacity || 1)) * 100));

                return (
                  <div
                    key={ev.id}
                    className="p-4 sm:p-5 rounded-2xl border border-[#EDE8E1] hover:border-[#FF4E7A]/40 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    {/* Left: Thumbnail + Event Info */}
                    <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                      {ev.image ? (
                        <img
                          src={ev.image}
                          alt={ev.name}
                          className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl object-cover flex-shrink-0 border border-[#EDE8E1]"
                        />
                      ) : (
                        <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-gradient-to-br from-[#FFF0F4] to-[#EDE8E1] flex items-center justify-center text-[#FF4E7A] flex-shrink-0 border border-[#FFD5E0]">
                          <Sparkles className="w-6 h-6" />
                        </div>
                      )}

                      <div className="min-w-0 space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span
                            className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full ${
                              ev.status === "LIVE"
                                ? "bg-[#F0FAF7] text-[#00C896] border border-[#00C896]/30"
                                : ev.status === "SELLING_FAST"
                                ? "bg-[#FFF0F4] text-[#FF4E7A] border border-[#FFD5E0]"
                                : "bg-[#EDE8E1] text-[#756C84]"
                            }`}
                          >
                            {ev.status.replace("_", " ")}
                          </span>
                          <span className="text-[11px] text-[#756C84] font-medium">{ev.category}</span>
                        </div>

                        <h3 className="font-display font-bold text-sm sm:text-base text-[#2C2738] group-hover:text-[#FF4E7A] transition-colors line-clamp-1">
                          {ev.name}
                        </h3>

                        <p className="text-xs text-[#756C84] flex items-center gap-1.5 flex-wrap">
                          <span>{ev.date}</span>
                          <span>•</span>
                          <span>{ev.venue}</span>
                        </p>
                      </div>
                    </div>

                    {/* Middle: Progress / Capacity */}
                    <div className="w-full md:w-48 space-y-1.5 flex-shrink-0">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#756C84]">Sales Progress</span>
                        <span className="text-[#2C2738]">{ev.ticketsSold} / {ev.totalCapacity} ({fillPercent}%)</span>
                      </div>
                      <div className="w-full h-2 bg-[#F5F0EB] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] rounded-full"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                      <p className="text-[11px] text-[#756C84]">Ticket: €{ev.price} • Rev: €{(ev.grossRevenue || 0).toLocaleString()}</p>
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-[#EDE8E1]">
                      <button
                        type="button"
                        onClick={() => navigate(`/events/${ev.id}`)}
                        className="px-3.5 py-1.5 rounded-full border border-[#EDE8E1] hover:border-[#FF4E7A] text-xs font-bold text-[#2C2738] hover:text-[#FF4E7A] transition-colors cursor-pointer"
                      >
                        Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => alert(`Opening analytics for ${ev.name}`)}
                        className="px-3.5 py-1.5 rounded-full bg-[#FFF0F4] hover:bg-[#FFE0EB] text-xs font-bold text-[#FF4E7A] transition-colors cursor-pointer"
                      >
                        Analytics
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* ── CREATE EVENT MODAL ── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-lg p-6 sm:p-7 shadow-2xl border border-[#EDE8E1] space-y-5 relative">
            <button
              type="button"
              onClick={() => setIsCreateModalOpen(false)}
              className="w-8 h-8 rounded-full bg-[#F5F0EB] hover:bg-[#EDE8E1] flex items-center justify-center text-[#756C84] hover:text-[#2C2738] absolute top-5 right-5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF4E7A] bg-[#FFF0F4] border border-[#FFD5E0] px-2.5 py-0.5 rounded-full">
                Host An Event
              </span>
              <h2 className="font-display font-black text-xl sm:text-2xl text-[#2C2738] mt-1.5">
                Create New Event
              </h2>
              <p className="text-xs text-[#756C84] mt-0.5">
                Publish your event on Passqo to accept instant ticket reservations.
              </p>
            </div>

            <form onSubmit={handleCreateEvent} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-[#2C2738] mb-1">Event Name</label>
                <input
                  type="text"
                  required
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="e.g. Dublin Acoustic Nights"
                  className="w-full h-10 px-3.5 text-xs sm:text-sm bg-[#F5F0EB] border border-[#EDE8E1] rounded-xl focus:border-[#FF4E7A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2C2738] mb-1">Category</label>
                  <select
                    value={eventCategory}
                    onChange={(e) => setEventCategory(e.target.value)}
                    className="w-full h-10 px-3 text-xs bg-[#F5F0EB] border border-[#EDE8E1] rounded-xl focus:border-[#FF4E7A] focus:outline-none"
                  >
                    <option value="Music and Entertainment">Music & Entertainment</option>
                    <option value="Technology and AI">Tech & AI</option>
                    <option value="Food and Drink">Food & Drink</option>
                    <option value="Arts and Culture">Arts & Culture</option>
                    <option value="Sports and Fitness">Sports & Fitness</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C2738] mb-1">Date & Time</label>
                  <input
                    type="text"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    placeholder="e.g. Sat, 12 Dec 2026"
                    className="w-full h-10 px-3.5 text-xs bg-[#F5F0EB] border border-[#EDE8E1] rounded-xl focus:border-[#FF4E7A] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#2C2738] mb-1">Venue & Location</label>
                <input
                  type="text"
                  value={eventVenue}
                  onChange={(e) => setEventVenue(e.target.value)}
                  placeholder="e.g. The Grand Social, Dublin"
                  className="w-full h-10 px-3.5 text-xs bg-[#F5F0EB] border border-[#EDE8E1] rounded-xl focus:border-[#FF4E7A] focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#2C2738] mb-1">Ticket Price (€)</label>
                  <input
                    type="number"
                    min="0"
                    step="0.5"
                    value={eventPrice}
                    onChange={(e) => setEventPrice(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-[#F5F0EB] border border-[#EDE8E1] rounded-xl focus:border-[#FF4E7A] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2C2738] mb-1">Total Capacity</label>
                  <input
                    type="number"
                    min="1"
                    value={eventCapacity}
                    onChange={(e) => setEventCapacity(e.target.value)}
                    className="w-full h-10 px-3.5 text-xs bg-[#F5F0EB] border border-[#EDE8E1] rounded-xl focus:border-[#FF4E7A] focus:outline-none"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-11 rounded-full bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] text-white font-bold text-xs sm:text-sm hover:brightness-105 active:scale-98 transition-all cursor-pointer shadow-[0_4px_16px_rgba(255,78,122,0.35)] disabled:opacity-70 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span>Publishing Event...</span>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 stroke-[3]" />
                      <span>Publish Event Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerDashboardPage;

