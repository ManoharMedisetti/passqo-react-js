import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { CheckCircle2, XCircle } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerApprovalsPage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [requests, setRequests] = useState([
    {
      id: "req-1",
      initials: "DM",
      name: "David Miller",
      organization: "PitchBook Media",
      passType: "Press & Backstage Pass",
      event: "Suncoast Electronic Beat 2026",
      note: "Covering upcoming electronic producers on India's coastal scene for PitchBook Music Weekly.",
      status: "pending",
      avatarColor: "bg-[#2563EB]",
    },
    {
      id: "req-2",
      initials: "ER",
      name: "Elena Rostova",
      organization: "Guest Artist",
      passType: "VIP Artist Lounge + 1 Guest",
      event: "dsp Live in Dublin",
      note: "Direct invite from dsp headline team.",
      status: "pending",
      avatarColor: "bg-[#10B981]",
    },
    {
      id: "req-3",
      initials: "KL",
      name: "Kenji Liu",
      organization: "Tokyo Sound Records",
      passType: "Industry Scout Access",
      event: "guopi (Copy)",
      note: "Looking for collaborative electronic remix tracks.",
      status: "pending",
      avatarColor: "bg-[#8B5CF6]",
    },
  ]);

  const handleAction = (id, approved) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: approved ? "approved" : "declined" } : r))
    );
    setToastMsg(approved ? "Request Approved! Pass dispatched." : "Request Declined.");
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="approvals"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Approvals"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
            Guest & VIP Approvals
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Review and dispatch backstage passes, press credentials, and VIP guestlist applications
          </p>
        </section>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Requests List matching approvals.html */}
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className={`bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] transition-all ${
                req.status !== "pending" ? "opacity-60 bg-[#FAFAFA]" : ""
              }`}
            >
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl ${req.avatarColor} text-white font-bold text-base flex items-center justify-center flex-shrink-0 shadow-2xs`}
                  >
                    {req.initials}
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-display font-extrabold text-base text-[#0F172A]">
                      {req.name} · <span className="text-[#64748B] font-semibold">{req.organization}</span>
                    </h3>
                    <p className="text-xs text-[#64748B]">
                      Requesting: <strong className="text-[#FF4E7A]">{req.passType}</strong> for{" "}
                      <em>{req.event}</em>
                    </p>
                    <p className="text-xs text-[#64748B] bg-[#F8FAFC] p-3 rounded-xl border border-[#EDE8E1] mt-2 italic">
                      "{req.note}"
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-end md:self-start flex-shrink-0">
                  {req.status === "pending" ? (
                    <>
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, false)}
                        className="px-4 py-2 rounded-full bg-white border border-[#EDE8E1] hover:border-rose-300 hover:text-rose-600 text-xs font-bold text-[#64748B] transition-colors cursor-pointer"
                      >
                        Decline
                      </button>
                      <button
                        type="button"
                        onClick={() => handleAction(req.id, true)}
                        className="px-5 py-2 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white text-xs font-bold shadow-xs transition-all cursor-pointer"
                      >
                        Approve Access
                      </button>
                    </>
                  ) : req.status === "approved" ? (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                      ✓ Approved
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                      ✕ Declined
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default OrganizerApprovalsPage;

