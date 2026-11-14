import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { Plus, Tag, Check, Copy, CheckCircle2, X } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerCouponsPage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [copiedCode, setCopiedCode] = useState(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  // New Coupon form
  const [codeName, setCodeName] = useState("");
  const [discountVal, setDiscountVal] = useState("20");
  const [discountType, setDiscountType] = useState("%");
  const [appliesTo, setAppliesTo] = useState("All Active Events");
  const [maxUsage, setMaxUsage] = useState("100");

  const [coupons, setCoupons] = useState([
    {
      id: "cp-1",
      code: "SUMMER20",
      value: "20% OFF",
      appliesTo: "All Active Events",
      used: 14,
      limit: 50,
      status: "Active",
      tagColor: "bg-[#FFF0F4] text-[#FF4E7A] border-[#FFD5E0]",
    },
    {
      id: "cp-2",
      code: "VIPGUEST50",
      value: "50% OFF",
      appliesTo: "VIP Fan Pit",
      used: 2,
      limit: 10,
      status: "Active",
      tagColor: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
    {
      id: "cp-3",
      code: "EARLYBIRD10",
      value: "€10.00 FLAT",
      appliesTo: "guopi (Copy)",
      used: 25,
      limit: 25,
      status: "Expired",
      tagColor: "bg-neutral-100 text-neutral-600 border-neutral-300",
    },
  ]);

  const handleCopy = (code) => {
    navigator.clipboard?.writeText?.(window.location.origin + `?promo=${code}`);
    setCopiedCode(code);
    setToastMsg(`Promo link for "${code}" copied to clipboard!`);
    setTimeout(() => {
      setCopiedCode(null);
      setToastMsg("");
    }, 2500);
  };

  const handleArchive = (id) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Archived" } : c))
    );
    setToastMsg("Coupon archived.");
    setTimeout(() => setToastMsg(""), 2000);
  };

  const handleCreateCoupon = (e) => {
    e.preventDefault();
    if (!codeName.trim()) return;

    const newCp = {
      id: "cp-" + Date.now(),
      code: codeName.trim().toUpperCase(),
      value: discountType === "%" ? `${discountVal}% OFF` : `€${discountVal} FLAT`,
      appliesTo,
      used: 0,
      limit: parseInt(maxUsage, 10) || 50,
      status: "Active",
      tagColor: "bg-[#FFF0F4] text-[#FF4E7A] border-[#FFD5E0]",
    };

    setCoupons((prev) => [newCp, ...prev]);
    setIsCreateOpen(false);
    setCodeName("");
    setToastMsg(`Coupon "${newCp.code}" created successfully!`);
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="coupons"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Coupons"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
              Coupons & Discounts
            </h1>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Create promotional discount vouchers, early bird offers, and partner codes
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsCreateOpen(true)}
            className="h-10 px-5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Create Coupon</span>
          </button>
        </section>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Coupons Table matching coupons.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#F1EFEA] text-[11px] font-extrabold uppercase text-[#94A3B8] tracking-wider bg-[#FAFAFA]">
                  <th className="py-3 px-4">Promo Code</th>
                  <th className="py-3 px-4">Discount Value</th>
                  <th className="py-3 px-4">Applies To</th>
                  <th className="py-3 px-4">Redemptions</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#F1EFEA] text-xs">
                {coupons.map((cp) => (
                  <tr key={cp.id} className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3 px-4">
                      <span
                        className={`font-mono font-bold px-2.5 py-1 rounded-xl border text-xs tracking-wider inline-flex items-center gap-1.5 ${cp.tagColor}`}
                      >
                        <Tag className="w-3 h-3" />
                        {cp.code}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-[#0F172A]">
                      {cp.value}
                    </td>
                    <td className="py-3 px-4 text-[#475569]">
                      {cp.appliesTo}
                    </td>
                    <td className="py-3 px-4 text-[#64748B]">
                      <span className="font-semibold text-[#0F172A]">{cp.used}</span> / {cp.limit} used
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                          cp.status === "Active"
                            ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                            : "bg-neutral-100 text-neutral-600"
                        }`}
                      >
                        {cp.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(cp.code)}
                          className="px-3 py-1.5 rounded-full bg-white border border-[#EDE8E1] hover:border-[#0F172A] text-xs font-bold text-[#0F172A] flex items-center gap-1 transition-colors cursor-pointer shadow-2xs"
                        >
                          {copiedCode === cp.code ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-600">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-[#64748B]" />
                              <span>Copy Link</span>
                            </>
                          )}
                        </button>
                        {cp.status === "Active" && (
                          <button
                            type="button"
                            onClick={() => handleArchive(cp.id)}
                            className="px-3 py-1.5 rounded-full hover:bg-neutral-100 text-xs font-medium text-[#64748B] transition-colors"
                          >
                            Archive
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Create Coupon Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-xs" onClick={() => setIsCreateOpen(false)} />
          <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl z-10 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#F1EFEA]">
              <h3 className="font-display font-extrabold text-base text-[#0F172A]">
                Create New Coupon Code
              </h3>
              <button
                type="button"
                onClick={() => setIsCreateOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#64748B]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateCoupon} className="space-y-3.5 pt-1">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Coupon Code Name
                </label>
                <input
                  type="text"
                  required
                  value={codeName}
                  onChange={(e) => setCodeName(e.target.value)}
                  placeholder="e.g. VIPFEST25"
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] text-xs font-mono font-bold uppercase tracking-wider text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Discount Amount
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={discountVal}
                    onChange={(e) => setDiscountVal(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0F172A] mb-1">
                    Discount Type
                  </label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] bg-white focus:outline-none focus:border-[#FF4E7A]"
                  >
                    <option value="%">Percentage (%)</option>
                    <option value="flat">Flat Amount (€)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Applies To
                </label>
                <input
                  type="text"
                  value={appliesTo}
                  onChange={(e) => setAppliesTo(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Total Redemption Limit
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxUsage}
                  onChange={(e) => setMaxUsage(e.target.value)}
                  className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#F1EFEA]">
                <button
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-[#64748B]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#FF4E7A] hover:bg-[#E03A64] text-white text-xs font-bold shadow-xs transition-all"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizerCouponsPage;

