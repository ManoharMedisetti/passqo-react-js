import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { CheckCircle2 } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerRefundsPage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [refunds, setRefunds] = useState([
    {
      id: "ref-1",
      orderId: "#PQ-88941",
      customer: "Sarah Jenkins",
      event: "guopi (Copy)",
      amount: "€25.00",
      reason: "Flight cancelation due to weather",
      status: "pending",
    },
    {
      id: "ref-2",
      orderId: "#PQ-76100",
      customer: "Marcus Vance",
      event: "dsp Live in Dublin",
      amount: "€45.00",
      reason: "Duplicate purchase",
      status: "refunded",
    },
    {
      id: "ref-3",
      orderId: "#PQ-99120",
      customer: "Liam O'Connor",
      event: "Suncoast Electronic Beat 2026",
      amount: "€75.00",
      reason: "Scheduling conflict with work trip",
      status: "pending",
    },
  ]);

  const handleRefund = (id, approved) => {
    setRefunds((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: approved ? "refunded" : "declined" } : r
      )
    );
    setToastMsg(
      approved
        ? "Refund processed successfully to customer card!"
        : "Refund request declined."
    );
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="refunds"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Refunds"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
            Refunds & Cancellations
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Review customer cancellation requests, chargebacks, and automated refunds
          </p>
        </section>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Refunds Table matching refunds.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1EFEA] text-[11px] font-extrabold uppercase text-[#94A3B8] tracking-wider bg-[#FAFAFA]">
                  <th className="py-3 px-4">Order ID</th>
                  <th className="py-3 px-4">Customer</th>
                  <th className="py-3 px-4">Event</th>
                  <th className="py-3 px-4">Refund Amount</th>
                  <th className="py-3 px-4">Reason</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] text-xs">
                {refunds.map((ref) => (
                  <tr key={ref.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4 font-mono text-xs text-[#64748B]">
                      {ref.orderId}
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      {ref.customer}
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      {ref.event}
                    </td>
                    <td className="py-3 px-4 font-extrabold text-[#FF4E7A]">
                      {ref.amount}
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      {ref.reason}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {ref.status === "pending" ? (
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => handleRefund(ref.id, true)}
                            className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-200 font-bold text-xs transition-colors cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRefund(ref.id, false)}
                            className="px-3 py-1 rounded-full bg-white text-[#64748B] hover:text-rose-600 hover:border-rose-200 border border-[#EDE8E1] font-bold text-xs transition-colors cursor-pointer"
                          >
                            Decline
                          </button>
                        </div>
                      ) : ref.status === "refunded" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-neutral-100 text-neutral-600">
                          Refunded
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600">
                          Declined
                        </span>
                      )}
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

export default OrganizerRefundsPage;

