import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { TicketModal } from "@/components/tickets/TicketModal";
import {
  Radio,
  CheckCircle2,
  ThumbsUp,
  ThumbsDown,
  ChevronRight,
  ArrowLeft,
  Ticket as TicketIcon,
  QrCode,
  MoreVertical,
} from "lucide-react";

// Real mock data from PassQO codebase with rich ticket details
const TICKETS_DATA = [
  {
    id: "evt-tech-summit",
    ticketCode: "PSQ-TECH-901",
    status: "live",
    tab: "upcoming",
    isLive: true,
    ticketsCount: 1,
    meta: "1 ticket • Streaming right now",
    title: "Universal Tech & AI Developer Summit 2026",
    venue: "Convention Centre Dublin (CCD) • Online Interactive Stream",
    date: "Fri, 13 Nov 2026 • 10:00 AM",
    tier: "Full Access Pass • VIP",
    gate: "Main Entrance CCD",
    holder: "John Doe",
    image: "/images/figma-sample/goa/performance.png",
    fallbackImage: "/virtual.webp",
    bottomLeft: {
      type: "live",
      text: "Live now • Ends in 1h 20m",
      color: "text-[#00A86B]",
    },
    bottomRight: {
      type: "view",
      text: "Show ticket",
      color: "text-[#FF4E7A]",
    },
  },
  {
    id: "evt-dublin-bay-electronic",
    ticketCode: "PSQ-524401",
    status: "upcoming",
    tab: "upcoming",
    isLive: false,
    ticketsCount: 2,
    meta: "2 tickets • Fri, 20 Nov, 6:00 PM",
    title: "Dublin Bay Electronic Music Festival",
    venue: "3Arena & Docklands, Dublin",
    date: "Fri, 20 Nov 2026 • 6:00 PM",
    tier: "General Admission • Tier 1",
    gate: "Gate 3 • Docklands",
    holder: "John Doe",
    image: "/images/figma-sample/goa/goa-hero.png",
    fallbackImage: "/music-entertainment.webp",
    bottomLeft: {
      type: "text",
      text: "Your tickets are confirmed • E-Ticket ready",
      color: "text-neutral-600",
    },
    bottomRight: {
      type: "view",
      text: "Show ticket",
      color: "text-[#FF4E7A]",
    },
  },
  {
    id: "evt-acoustic-sunset",
    ticketCode: "PSQ-ACS-308",
    status: "past",
    tab: "past",
    isLive: false,
    ticketsCount: 2,
    meta: "2 tickets • Sun, 29 Nov, 6:30 PM",
    title: "Acoustic Sunset & Indie Melodies Showcase",
    venue: "The Grand Social, Dublin",
    date: "Sun, 29 Nov 2026 • 6:30 PM",
    tier: "Stalls General Seating",
    gate: "East Gate",
    holder: "John Doe",
    image: "/images/figma-sample/goa/artist-poster.png",
    fallbackImage: "/community.webp",
    bottomLeft: {
      type: "watched",
      text: "Watched",
      color: "text-neutral-700",
    },
    bottomRight: {
      type: "rate",
      text: "How was it",
      route: "/tickets/evt-acoustic-sunset/rate",
      color: "text-[#FF4E7A]",
    },
  },
  {
    id: "evt-pottery-workshop",
    ticketCode: "PSQ-POT-112",
    status: "past",
    tab: "past",
    isLive: false,
    ticketsCount: 2,
    meta: "2 tickets • Sat, 05 Dec, 3:00 PM",
    title: "Clay & Cocktails: Ceramic Studio Workshop",
    venue: "Kilkenny Design & Ceramic Studio, Kilkenny",
    date: "Sat, 05 Dec 2026 • 3:00 PM",
    tier: "Workshop & Cocktail Pass",
    gate: "Studio 4",
    holder: "John Doe",
    image: "/images/figma-sample/goa/headliner.png",
    fallbackImage: "/food-drink.webp",
    bottomLeft: {
      type: "text",
      text: "You liked this event",
      color: "text-neutral-600",
    },
    bottomRight: {
      type: "liked",
      text: "Liked it!",
      route: "/tickets/evt-pottery-workshop/rate",
      color: "text-[#20A05A]",
    },
  },
  {
    id: "evt-wellness-retreat",
    ticketCode: "PSQ-YOG-441",
    status: "past",
    tab: "past",
    isLive: false,
    ticketsCount: 1,
    meta: "1 ticket • Sun, 22 Nov, 6:30 AM",
    title: "Galway Bay Sunrise Yoga & Sound Bath Retreat",
    venue: "Salthill Promenade Shala, Galway",
    date: "Sun, 22 Nov 2026 • 6:30 AM",
    tier: "Sunrise Shala Access",
    gate: "Salthill Promenade",
    holder: "John Doe",
    image: "/images/figma-sample/goa/gallery-3.png",
    fallbackImage: "/health-wellness.webp",
    bottomLeft: {
      type: "text",
      text: "You disliked this event",
      color: "text-neutral-600",
    },
    bottomRight: {
      type: "disliked",
      text: "Disliked it!",
      route: "/tickets/evt-wellness-retreat/rate",
      color: "text-[#C8552D]",
    },
  },
];

export function MyTicketsPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const handleDesktopBack = () => {
    if (location.state?.openedFromSidebar) {
      navigate("/");
      window.dispatchEvent(new CustomEvent("passqo-open-profile-menu"));
    } else {
      navigate("/");
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, []);

  const [activeTab, setActiveTab] = useState("all"); // "all" | "upcoming" | "live" | "past" | "waitlist" | "resale"
  const [tickets, setTickets] = useState(TICKETS_DATA);
  const [selectedTicket, setSelectedTicket] = useState(null);

  const counts = {
    upcoming: 3,
    live: 1,
    past: 8,
    waitlist: 2,
    resale: 1,
  };

  const filteredTickets =
    activeTab === "all"
      ? tickets
      : activeTab === "upcoming"
      ? tickets.filter((t) => t.tab === "upcoming")
      : activeTab === "live"
      ? tickets.filter((t) => t.isLive)
      : activeTab === "past"
      ? tickets.filter((t) => t.status === "past")
      : tickets.filter((t) => t.status === activeTab);

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1B1B23]">
      <SubPageHeader title="My Tickets" />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 pb-16">
        {/* Desktop Back Link */}
        <button
          type="button"
          onClick={handleDesktopBack}
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors mb-4 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* Page Header matching I.html */}
        <div className="mb-6">
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1B1B23] tracking-tight">
            My Tickets
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
            All your events, in one place
          </p>
        </div>

        {/* Tab Filters (Frame 96 Pill Layout) */}
        <nav
          className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none"
          aria-label="Ticket filters"
        >
          {/* All */}
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "all"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/5"
            }`}
          >
            All
          </button>

          {/* Upcoming */}
          <button
            type="button"
            onClick={() => setActiveTab("upcoming")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "upcoming"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/5"
            }`}
          >
            <span>Upcoming</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                activeTab === "upcoming"
                  ? "bg-white/25 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {counts.upcoming}
            </span>
          </button>

          {/* Live */}
          <button
            type="button"
            onClick={() => setActiveTab("live")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "live"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/5"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-[#E53E3E] animate-pulse" />
            <span>Live</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                activeTab === "live"
                  ? "bg-white/25 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {counts.live}
            </span>
          </button>

          {/* Past */}
          <button
            type="button"
            onClick={() => setActiveTab("past")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "past"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/5"
            }`}
          >
            <span>Past</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                activeTab === "past"
                  ? "bg-white/25 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {counts.past}
            </span>
          </button>

          {/* Waitlist */}
          <button
            type="button"
            onClick={() => setActiveTab("waitlist")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "waitlist"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/5"
            }`}
          >
            <span>Waitlist</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                activeTab === "waitlist"
                  ? "bg-white/25 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {counts.waitlist}
            </span>
          </button>

          {/* Resale */}
          <button
            type="button"
            onClick={() => setActiveTab("resale")}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs sm:text-sm font-bold transition-all cursor-pointer whitespace-nowrap active:scale-95 ${
              activeTab === "resale"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-neutral-700 hover:bg-neutral-100 border border-black/5"
            }`}
          >
            <span>Resale</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[11px] font-semibold ${
                activeTab === "resale"
                  ? "bg-white/25 text-white"
                  : "bg-neutral-100 text-neutral-600"
              }`}
            >
              {counts.resale}
            </span>
          </button>
        </nav>

        {/* Event List Stream (Full-Width Row Cards Matching I.html) */}
        <div className="space-y-4 sm:space-y-4.5">
          {filteredTickets.map((ticket) => (
            <article
              key={ticket.id}
              className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs overflow-hidden transition-all hover:shadow-md group"
            >
              {/* Main Card Surface - Click to show ticket */}
              <div
                onClick={() => setSelectedTicket(ticket)}
                className="p-4 sm:p-5 flex items-start justify-between gap-4 cursor-pointer"
                title="Click to view ticket and QR code"
              >
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  {/* Poster Thumbnail */}
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0">
                    <img
                      src={ticket.image}
                      alt={ticket.title}
                      onError={(e) => {
                        if (ticket.fallbackImage) e.currentTarget.src = ticket.fallbackImage;
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {ticket.isLive && (
                      <span className="absolute top-1.5 left-1.5 bg-[#E53E3E] text-white text-[9px] sm:text-[10px] font-black px-1.5 py-0.5 rounded-full flex items-center gap-1 shadow-xs uppercase tracking-wide">
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                        LIVE
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] sm:text-xs text-neutral-500 font-medium truncate">
                      {ticket.meta}
                    </div>

                    <h2 className="font-display font-extrabold text-sm sm:text-base text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors leading-snug mt-1 truncate">
                      {ticket.title}
                    </h2>

                    <div className="text-xs text-neutral-500 font-medium line-clamp-1 mt-1">
                      {ticket.venue}
                    </div>
                  </div>
                </div>

                {/* Show QR / View Ticket Action Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedTicket(ticket);
                  }}
                  className="w-9 h-9 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-[#FF4E7A]/10 hover:border-[#FF4E7A]/30 hover:text-[#FF4E7A] text-neutral-600 flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Show ticket QR code"
                  title="Show ticket QR code"
                >
                  <QrCode className="w-4.5 h-4.5 stroke-[1.8]" />
                </button>
              </div>

              {/* Card Bottom Bar (Status on Left, Actions on Right) */}
              <div className="bg-[#FAF7F4] border-t border-black/5 px-4 sm:px-5 py-2.5 sm:py-3 flex items-center justify-between text-xs sm:text-sm">
                {/* Left Status */}
                <div className="flex items-center gap-1.5 min-w-0">
                  {ticket.bottomLeft.type === "live" && (
                    <Radio className="w-4 h-4 text-[#00A86B] stroke-[2.5] animate-pulse flex-shrink-0" />
                  )}
                  {ticket.bottomLeft.type === "watched" && (
                    <CheckCircle2 className="w-4 h-4 text-neutral-700 stroke-[2] flex-shrink-0" />
                  )}
                  <span
                    className={`font-semibold truncate text-[11px] sm:text-xs ${ticket.bottomLeft.color}`}
                  >
                    {ticket.bottomLeft.text}
                  </span>
                </div>

                {/* Right Action Buttons */}
                <div className="flex items-center gap-3 flex-shrink-0">
                  {/* Always provide Show ticket action */}
                  <button
                    type="button"
                    onClick={() => setSelectedTicket(ticket)}
                    className="inline-flex items-center gap-1 text-xs font-bold text-neutral-700 hover:text-[#FF4E7A] transition-colors cursor-pointer"
                  >
                    <QrCode className="w-3.5 h-3.5 text-[#FF4E7A]" />
                    <span>Show ticket</span>
                  </button>

                  {/* Secondary Rating / Feedback Action if past */}
                  {ticket.bottomRight.type === "rate" && (
                    <button
                      type="button"
                      onClick={() => navigate(ticket.bottomRight.route)}
                      className="inline-flex items-center gap-1 font-bold text-xs sm:text-sm text-[#FF4E7A] hover:text-[#E03A64] hover:underline cursor-pointer"
                    >
                      <span>{ticket.bottomRight.text}</span>
                      <ChevronRight className="w-3.5 h-3.5 stroke-[2.5]" />
                    </button>
                  )}
                  {ticket.bottomRight.type === "liked" && (
                    <button
                      type="button"
                      onClick={() => navigate(ticket.bottomRight.route)}
                      className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#20A05A] hover:underline cursor-pointer"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 fill-[#20A05A]" />
                      <span>Liked it!</span>
                    </button>
                  )}
                  {ticket.bottomRight.type === "disliked" && (
                    <button
                      type="button"
                      onClick={() => navigate(ticket.bottomRight.route)}
                      className="inline-flex items-center gap-1.5 font-bold text-xs sm:text-sm text-[#C8552D] hover:underline cursor-pointer"
                    >
                      <ThumbsDown className="w-3.5 h-3.5 fill-[#C8552D]" />
                      <span>Disliked it!</span>
                    </button>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Promotional Bottom Banner (Matching I.html) */}
        <aside className="mt-8 bg-[#FFF0F4] border border-[#FFD9E4] rounded-2xl sm:rounded-3xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 sm:gap-4 text-left w-full sm:w-auto">
            {/* CSS Ticket Art Icon */}
            <div className="w-12 h-12 rounded-2xl bg-white border border-[#FFCCD9] shadow-xs flex items-center justify-center text-[#FF4E7A] flex-shrink-0">
              <TicketIcon className="w-6 h-6 stroke-[1.8]" />
            </div>

            <div>
              <h3 className="font-display font-extrabold text-sm sm:text-base text-[#1B1B23]">
                Tickets, memories, and new adventures.
              </h3>
              <p className="text-xs text-neutral-600 font-medium mt-0.5">
                Your next experience is waiting in Dublin.
              </p>
            </div>
          </div>

          <Link
            to="/events"
            className="px-5 py-2.5 rounded-full bg-[#1B1B23] hover:bg-black text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer whitespace-nowrap self-stretch sm:self-auto text-center"
          >
            Explore Events
          </Link>
        </aside>
      </main>

      {/* Ticket Details & QR Code Modal */}
      <TicketModal
        isOpen={!!selectedTicket}
        onClose={() => setSelectedTicket(null)}
        ticket={selectedTicket}
      />
    </div>
  );
}

export default MyTicketsPage;
