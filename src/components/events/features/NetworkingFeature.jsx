import { Users, Building2, Briefcase } from "lucide-react";

export function NetworkingFeature({ event, details }) {
  const stats = [
    { label: "Registered Attendees", value: "850+" },
    { label: "Companies Represented", value: "140+" },
    { label: "Senior Execs & VPs", value: "65%" },
    { label: "Countries", value: "24" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Attendee Directory & Corporate Networking
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            Connect with founders, investors, and senior executives.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1 w-fit flex-shrink-0">
          <Users className="w-3.5 h-3.5" />
          <span>Active Hub</span>
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        {stats.map((s, idx) => (
          <div key={idx} className="p-3 bg-neutral-50/70 rounded-xl border border-black/5 text-center">
            <p className="text-xl font-black text-[#1B1B23]">{s.value}</p>
            <p className="text-[11px] text-[#8C8C9E] font-medium mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Group & Corporate Booking Card - Clean light styling */}
      <div className="p-4 sm:p-5 rounded-2xl border border-[#FF4E7A]/20 bg-gradient-to-br from-pink-50/40 via-white to-neutral-50 text-[#1B1B23] space-y-1.5 shadow-2xs">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-[#FF4E7A]" />
          <h4 className="font-extrabold text-sm text-[#1B1B23]">Group & Corporate Invoicing</h4>
        </div>
        <p className="text-xs text-[#6E6969] leading-relaxed">
          Bringing a team of 5 or more? Enjoy 20% group discounts, consolidated VAT tax invoices, and dedicated company table reservations in the executive dining lounge.
        </p>
      </div>
    </div>
  );
}

export default NetworkingFeature;
