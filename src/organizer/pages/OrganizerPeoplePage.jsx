import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { Search, Mail, CheckCircle2 } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerPeoplePage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [toastMsg, setToastMsg] = useState("");

  const attendees = [
    {
      id: "att-1",
      initials: "AJ",
      name: "Alex Turner",
      email: "alex.t@gmail.com",
      event: "guopi (Copy)",
      tier: "VIP Access",
      passId: "#PQ-88941",
      checkedIn: true,
      avatarColor: "bg-gradient-to-tr from-[#3B82F6] to-[#60A5FA]",
    },
    {
      id: "att-2",
      initials: "SJ",
      name: "Sarah Jenkins",
      email: "sarah.j@outlook.com",
      event: "y7tku",
      tier: "General Admission",
      passId: "#PQ-77120",
      checkedIn: true,
      avatarColor: "bg-gradient-to-tr from-[#10B981] to-[#4ADE80]",
    },
    {
      id: "att-3",
      initials: "RK",
      name: "Rahul Kumar",
      email: "rahul.k@yahoo.in",
      event: "y7tku",
      tier: "General Admission",
      passId: "#PQ-77121",
      checkedIn: true,
      avatarColor: "bg-gradient-to-tr from-[#F59E0B] to-[#FBBF24]",
    },
    {
      id: "att-4",
      initials: "PP",
      name: "Priya Patel",
      email: "priya.patel@gmail.com",
      event: "Suncoast Electronic Beat 2026",
      tier: "VIP Lounge",
      passId: "#PQ-99302",
      checkedIn: false,
      avatarColor: "bg-gradient-to-tr from-[#8B5CF6] to-[#A78BFA]",
    },
  ];

  const handleResend = (name) => {
    setToastMsg(`Pass sent to ${name}'s email!`);
    setTimeout(() => setToastMsg(""), 2500);
  };

  const filteredAttendees = attendees.filter((a) => {
    const q = searchQuery.toLowerCase();
    const match =
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.passId.toLowerCase().includes(q) ||
      a.event.toLowerCase().includes(q);
    if (!match) return false;
    if (filter === "checked-in") return a.checkedIn;
    if (filter === "pending") return !a.checkedIn;
    return true;
  });

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="people"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="People"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
            People & Attendees
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Manage your attendee roster, guest passes, and admission credentials
          </p>
        </section>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Toolbar & Filters */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-3.5 sm:p-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94A3B8]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, email, or pass ID..."
              className="w-full h-9 pl-9 pr-3.5 rounded-full bg-[#F8FAFC] border border-[#EDE8E1] text-xs text-[#0F172A] placeholder:text-[#94A3B8] focus:outline-none focus:border-[#FF4E7A] transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-hide">
            {[
              { id: "all", label: `All (${attendees.length})` },
              { id: "checked-in", label: `Checked In (${attendees.filter(a => a.checkedIn).length})` },
              { id: "pending", label: `Pending (${attendees.filter(a => !a.checkedIn).length})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  filter === tab.id
                    ? "bg-[#0F172A] text-white shadow-2xs"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Attendees Table matching people.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1EFEA] text-[11px] font-extrabold uppercase text-[#94A3B8] tracking-wider bg-[#FAFAFA]">
                  <th className="py-3 px-4">Attendee</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Ticket Tier</th>
                  <th className="py-3 px-4">Pass ID</th>
                  <th className="py-3 px-4">Gate Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] text-xs">
                {filteredAttendees.map((att) => (
                  <tr key={att.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-full ${att.avatarColor} text-white font-bold text-xs flex items-center justify-center flex-shrink-0 shadow-2xs`}
                        >
                          {att.initials}
                        </div>
                        <div>
                          <strong className="text-[#0F172A] block">{att.name}</strong>
                          <span className="text-[11px] text-[#64748B]">{att.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 font-semibold text-[#0F172A]">
                      {att.event}
                    </td>
                    <td className="py-3 px-4 font-medium text-[#475569]">
                      {att.tier}
                    </td>
                    <td className="py-3 px-4 font-mono text-xs text-[#64748B]">
                      {att.passId}
                    </td>
                    <td className="py-3 px-4">
                      {att.checkedIn ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                          ✓ Checked In
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => handleResend(att.name)}
                        className="px-3 py-1.5 rounded-full bg-white border border-[#EDE8E1] hover:border-[#0F172A] text-xs font-bold text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
                      >
                        Resend Pass
                      </button>
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

export default OrganizerPeoplePage;

