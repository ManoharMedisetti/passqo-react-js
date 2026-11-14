import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUser } from "@/lib/auth/storage";
import {
  Calendar,
  Ticket,
  TrendingUp,
  Scan,
  Plus,
  ShieldCheck,
  Edit,
  ArrowRight,
  MapPin,
  Share2,
  Check,
} from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerOverviewPage() {
  const navigate = useNavigate();
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [eventFilter, setEventFilter] = useState("all");
  const [copiedId, setCopiedId] = useState(null);

  const metrics = [
    {
      id: "total-events",
      title: "Total Events",
      value: "5",
      trend: null,
      icon: Calendar,
      iconBg: "bg-[#FF4E7A]",
    },
    {
      id: "tickets-sold",
      title: "Tickets Sold",
      value: "4",
      trend: "↑ 100%",
      icon: Ticket,
      iconBg: "bg-[#00BA88]",
    },
    {
      id: "revenue",
      title: "Revenue",
      value: "€0",
      trend: null,
      icon: TrendingUp,
      iconBg: "bg-[#F59E0B]",
    },
    {
      id: "upcoming",
      title: "Upcoming",
      value: "0",
      trend: null,
      icon: Calendar,
      iconBg: "bg-[#1C1D22]",
    },
  ];

  const recentEvents = [
    {
      id: "evt-guopi-copy",
      title: "guopi (Copy)",
      status: "ended",
      statusLabel: "Ended",
      badgeColor: "bg-neutral-100 text-neutral-600 border-neutral-300",
      gradient: "from-[#FFDEE9] to-[#B5FFFC]",
      date: "1 Oct 2026",
      venue: "Quillayute Airport",
      sold: 1,
      total: 50,
      price: "€25.00",
    },
    {
      id: "evt-guopi-draft",
      title: "guopi",
      status: "draft",
      statusLabel: "Draft",
      badgeColor: "bg-amber-50 text-amber-600 border-amber-200",
      gradient: "from-[#FBC2EB] to-[#A6C1EE]",
      date: "20 Nov 2026",
      venue: "Quillayute Airport",
      sold: 0,
      total: 100,
      price: "€20.00",
    },
    {
      id: "evt-y7tku",
      title: "y7tku",
      status: "active",
      statusLabel: "Active",
      badgeColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
      gradient: "from-[#A18CD1] to-[#FBC2EB]",
      date: "26 Aug 2026",
      venue: "Dublin Docklands",
      sold: 4,
      total: 80,
      price: "€35.00",
    },
  ];

  const handleShare = (id) => {
    navigator.clipboard?.writeText?.(window.location.origin + `/events/${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredEvents = recentEvents.filter((e) => {
    if (eventFilter === "active") return e.status === "active";
    if (eventFilter === "draft") return e.status === "draft";
    if (eventFilter === "ended") return e.status === "ended";
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="dashboard"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Overview"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">
        {/* 1. ORGANIZER HEADER CARD matching overview.html */}
        <section className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-[#0f172a] text-white font-black text-2xl flex items-center justify-center flex-shrink-0 shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg sm:text-xl text-[#0f172a] tracking-tight">
                  man events
                </span>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                PassQO Creator • Visakhapatnam, India • 5 Events Listed
              </p>
            </div>
          </div>

          <Link
            to="/organizer/profile"
            className="h-9 px-4 rounded-full bg-white border border-[#EDE8E1] hover:border-[#0F172A] text-xs font-bold text-[#0F172A] flex items-center gap-1.5 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            <Edit className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </Link>
        </section>

        {/* 2. OVERVIEW ACTION CONTROLS matching overview.html */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-2xl text-[#0F172A] tracking-tight">
              Overview
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Your event dashboard and live performance metrics
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              to="/organizer/scanner"
              className="h-10 px-4 rounded-full bg-[#0F172A] hover:bg-black text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-colors"
            >
              <Scan className="w-4 h-4" />
              <span>Scanner</span>
            </Link>

            <Link
              to="/organizer/create-event"
              className="h-10 px-5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>New Event</span>
            </Link>
          </div>
        </section>

        {/* 3. METRIC STATS GRID (4 CARDS) matching overview.html */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {metrics.map((m) => {
            const Icon = m.icon;
            return (
              <div
                key={m.id}
                className="bg-white rounded-3xl border border-[#EDE8E1] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center gap-4"
              >
                <div
                  className={`w-12 h-12 rounded-2xl ${m.iconBg} text-white flex items-center justify-center flex-shrink-0 shadow-2xs`}
                >
                  <Icon className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-display font-black text-2xl text-[#0F172A]">
                      {m.value}
                    </span>
                    {m.trend && (
                      <span className="text-xs font-bold text-emerald-600">{m.trend}</span>
                    )}
                  </div>
                  <span className="text-xs font-semibold text-[#64748B] block mt-0.5">
                    {m.title}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* 4. RECENT EVENTS SECTION matching overview.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#F1EFEA]">
            <div className="flex items-center gap-3">
              <h2 className="font-display font-extrabold text-base text-[#0F172A]">
                Recent Events
              </h2>
              {/* Filter Pills */}
              <div className="flex items-center gap-1">
                {["all", "active", "draft", "ended"].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setEventFilter(tab)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold capitalize transition-colors cursor-pointer ${
                      eventFilter === tab
                        ? "bg-[#0F172A] text-white"
                        : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <Link
              to="/organizer/events"
              className="text-xs font-bold text-[#FF4E7A] hover:underline inline-flex items-center gap-1"
            >
              <span>View all</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-1">
            {filteredEvents.map((evt) => {
              const percent = Math.round((evt.sold / evt.total) * 100);
              return (
                <article
                  key={evt.id}
                  className="rounded-2xl border border-[#EDE8E1] overflow-hidden bg-white shadow-2xs flex flex-col justify-between hover:border-[#0284C7]/40 transition-all"
                >
                  <div className={`h-28 w-full bg-gradient-to-r ${evt.gradient} p-3 flex items-start justify-end`}>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${evt.badgeColor}`}>
                      {evt.statusLabel}
                    </span>
                  </div>

                  <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-display font-bold text-sm text-[#0F172A] truncate">
                        {evt.title}
                      </h3>
                      <div className="text-[11px] text-[#64748B] space-y-0.5 mt-1">
                        <p className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-[#94A3B8]" />
                          <span>{evt.date}</span>
                        </p>
                        <p className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#94A3B8]" />
                          <span className="truncate">{evt.venue}</span>
                        </p>
                      </div>
                    </div>

                    <div className="space-y-1 pt-1">
                      <div className="flex items-center justify-between text-[10px] font-bold text-[#64748B]">
                        <span>{evt.sold} / {evt.total} sold</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-[#E2E8F0] overflow-hidden">
                        <div
                          className="h-full rounded-full bg-[#FF4E7A]"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="px-4 py-2.5 border-t border-[#F1EFEA] bg-[#FAFAFA] flex items-center justify-between">
                    <span className="font-display font-black text-xs text-[#0F172A]">
                      {evt.price}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleShare(evt.id)}
                      className="px-2.5 py-1 rounded-full bg-white border border-[#EDE8E1] text-[11px] font-bold text-[#0F172A] flex items-center gap-1 transition-colors"
                    >
                      {copiedId === evt.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Share2 className="w-3 h-3" />
                          <span>Share</span>
                        </>
                      )}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerOverviewPage;

