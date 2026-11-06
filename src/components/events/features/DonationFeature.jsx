import { Heart, Sparkles, Users } from "lucide-react";

export function DonationFeature({ event, details }) {
  const donationTiers = [
    { amount: "€10", label: "Community Supporter", impact: "Helps cover essential materials & tea/refreshments for attendees." },
    { amount: "€25", label: "Neighbor Sponsor", impact: "Sponsors free tickets for community members with financial constraints." },
    { amount: "€50", label: "Patron of the Arts", impact: "Directly funds venue rental, local artist stipends, and future public programs." },
  ];

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/6 shadow-2xs space-y-3.5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-2.5">
        <div>
          <h3 className="text-base sm:text-lg font-bold text-[#1B1B23] tracking-tight">
            Donation & Community Support
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            100% of voluntary contributions directly fund grassroots venue costs and community access.
          </p>
        </div>
        <span className="text-[10px] sm:text-xs font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-0.5 rounded-full flex items-center gap-1 w-fit flex-shrink-0">
          <Heart className="w-3 h-3 fill-[#FF4E7A]" />
          <span>Pay What You Can</span>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {donationTiers.map((tier, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black/15 transition-all space-y-1.5 text-center flex flex-col justify-between"
          >
            <div>
              <p className="text-xl font-black text-[#1B1B23]">{tier.amount}</p>
              <p className="text-xs font-bold text-[#FF4E7A] mt-0.5">{tier.label}</p>
            </div>
            <p className="text-[10px] sm:text-[11px] text-[#6E6969] leading-relaxed pt-0.5">
              {tier.impact}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default DonationFeature;

