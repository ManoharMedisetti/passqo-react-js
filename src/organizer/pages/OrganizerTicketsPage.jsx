import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { Download, Search, ChevronDown, CheckCircle2 } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerTicketsPage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState("");

  const tickets = [
    {
      ref: "PQ-8F8A887ED20D46A3",
      event: "guopi (Copy)",
      eventDate: "1 Oct 2026",
      tier: "General Admission",
      attendeeName: "manohar",
      attendeeEmail: "manoharprasadmedisetti@gmail.com",
      meta: "name: man · veg: true",
      price: "€0.00",
      status: "Active",
      date: "18 Sept 2026",
      time: "21:51",
    },
    {
      ref: "PQ-F614D83EBEF915CB",
      event: "y7tku",
      eventDate: "26 Aug 2026",
      tier: "General Admission",
      attendeeName: "Salapu Rakesh",
      attendeeEmail: "salapurakesh22@gmail.com",
      meta: "tier: Phase 1",
      price: "€0.00",
      status: "Active",
      date: "25 Aug 2026",
      time: "14:10",
    },
    {
      ref: "PQ-291AA010BB7C4148",
      event: "Suncoast Electronic Beat 2026",
      eventDate: "20 Nov 2026",
      tier: "VIP Lounge",
      attendeeName: "Alex Turner",
      attendeeEmail: "alex.t@gmail.com",
      meta: "fast-track: true",
      price: "€75.00",
      status: "Active",
      date: "12 Nov 2026",
      time: "19:44",
    },
    {
      ref: "PQ-710CC18917AA8821",
      event: "dsp Live in Dublin",
      eventDate: "15 Dec 2026",
      tier: "General Admission",
      attendeeName: "Sarah Jenkins",
      attendeeEmail: "sarah.j@outlook.com",
      meta: "gate: 1",
      price: "€35.00",
      status: "Checked In",
      date: "14 Nov 2026",
      time: "11:20",
    },
  ];

  const handleExport = () => {
    setToastMsg("CSV exported successfully!");
    setTimeout(() => setToastMsg(""), 2500);
  };

  const filteredTickets = tickets.filter((t) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      t.attendeeName.toLowerCase().includes(q) ||
      t.ref.toLowerCase().includes(q) ||
      t.event.toLowerCase().includes(q);
    if (!matchesSearch) return false;
    if (statusFilter !== "all" && t.status.toLowerCase() !== statusFilter.toLowerCase()) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="tickets"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Tickets"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
              Tickets
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Live attendee ticketing registry, check-in statuses and passes
            </p>
          </div>

          <button
            type="button"
            onClick={handleExport}
            className="h-10 px-4 rounded-full bg-white border border-[#EDE8E1] hover:border-[#0F172A] text-xs font-bold text-[#0F172A] flex items-center gap-2 transition-colors cursor-pointer shadow-2xs self-start sm:self-auto"
          >
            <Download className="w-4 h-4 text-[#64748B]" />
            <span>Export CSV</span>
          </button>
        </section>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* 3 KPI Stat Cards matching tickets.html */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
          <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-center">
            <span className="font-display font-extrabold text-3xl text-[#0F172A] block">
              {tickets.length}
            </span>
            <span className="text-xs font-semibold text-[#64748B] mt-1 block">
              Total Sold
            </span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-center">
            <span className="font-display font-extrabold text-3xl text-emerald-600 block">
              {tickets.filter(t => t.status === "Active").length}
            </span>
            <span className="text-xs font-semibold text-[#64748B] mt-1 block">
              Active
            </span>
          </div>
          <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.02)] text-center">
            <span className="font-display font-extrabold text-3xl text-[#0F172A] block">
              {tickets.filter(t => t.status === "Checked In").length}
            </span>
            <span className="text-xs font-semibold text-[#64748B] mt-1 block">
              Checked In
            </span>
          </div>
        </section>

        {/* Coral Total Ticket Revenue Banner matching tickets.html */}
        <div className="bg-gradient-to-r from-[#FF4E7A] to-[#E11D48] rounded-3xl p-5 sm:p-6 text-white shadow-[0_8px_24px_rgba(255,78,122,0.25)] flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider font-extrabold text-white/80">
              Total ticket revenue
            </p>
            <p className="font-display font-black text-2xl sm:text-3xl tracking-tight mt-0.5">
              €110.00
            </p>
          </div>
          <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full backdrop-blur-xs">
            Live Settlement
          </span>
        </div>

        {/* Search & Dropdown Filters matching tickets.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search attendee, ticket ref, event..."
              className="w-full h-9 pl-9 pr-3.5 rounded-full bg-[#F8FAFC] border border-[#EDE8E1] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF4E7A] transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-9 px-3 rounded-full bg-[#F8FAFC] border border-[#EDE8E1] text-xs font-semibold text-[#0F172A] focus:outline-none cursor-pointer"
            >
              <option value="all">All statuses</option>
              <option value="active">Active</option>
              <option value="checked in">Checked In</option>
            </select>
          </div>
        </div>

        {/* Tickets Table matching tickets.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="p-4 border-b border-[#F1EFEA] text-xs font-bold text-[#64748B]">
            {filteredTickets.length} tickets
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1EFEA] text-[11px] font-extrabold uppercase text-[#94A3B8] tracking-wider bg-[#FAFAFA]">
                  <th className="py-3 px-4">REF</th>
                  <th className="py-3 px-4">EVENT</th>
                  <th className="py-3 px-4">TIER</th>
                  <th className="py-3 px-4">ATTENDEE</th>
                  <th className="py-3 px-4">PRICE</th>
                  <th className="py-3 px-4">STATUS</th>
                  <th className="py-3 px-4">DATE</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] text-xs">
                {filteredTickets.map((t) => (
                  <tr key={t.ref} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono text-[11px] text-[#64748B]">
                      {t.ref}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-[#0F172A] block">{t.event}</strong>
                      <span className="text-[11px] text-[#94A3B8]">{t.eventDate}</span>
                    </td>
                    <td className="py-3 px-4 font-medium text-[#475569]">
                      {t.tier}
                    </td>
                    <td className="py-3 px-4">
                      <strong className="text-[#0F172A] block">{t.attendeeName}</strong>
                      <span className="text-[11px] text-[#64748B] block truncate max-w-[200px]">
                        {t.attendeeEmail}
                      </span>
                      <span className="text-[10px] text-[#94A3B8]">{t.meta}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      {t.price}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          t.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-sky-50 text-[#0284C7] border border-sky-200"
                        }`}
                      >
                        {t.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      <div className="font-semibold text-[#0F172A]">{t.date}</div>
                      <div className="text-[11px] text-[#94A3B8]">{t.time}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerTicketsPage;
