import { Award, ExternalLink, ShieldCheck, Crown } from "lucide-react";

export function SponsorsFeature({ event, details }) {
  const sponsors = details?.sponsors || [
    { name: "Google Cloud", tier: "Headline", category: "Official Cloud & AI Partner", symbol: "👑", link: "https://cloud.google.com" },
    { name: "Stripe", tier: "Gold", category: "Global Payments Infrastructure", symbol: "🥇", link: "https://stripe.com" },
    { name: "AWS Ireland", tier: "Gold", category: "Edge Computing & Data Backbone", symbol: "🥇", link: "https://aws.amazon.com" },
    { name: "Red Bull", tier: "Silver", category: "Official Energy & Beverage Partner", symbol: "🥈", link: "https://redbull.com" },
    { name: "Dogpatch Labs", tier: "Silver", category: "Startup Incubator & Hub", symbol: "🥈", link: "https://dogpatchlabs.com" },
    { name: "Enterprise Ireland", tier: "Bronze", category: "Innovation & Trade Supporter", symbol: "🥉", link: "https://enterprise-ireland.com" },
  ];

  const getTierBadge = (tierName) => {
    const t = (tierName || "").toLowerCase();
    if (t.includes("headline") || t.includes("title") || t.includes("crown")) {
      return {
        symbol: "👑",
        label: "Headline Partner",
        style: "bg-gradient-to-r from-amber-100 to-amber-50 border-amber-300/80 text-amber-900 shadow-2xs",
      };
    }
    if (t.includes("gold")) {
      return {
        symbol: "🥇",
        label: "Gold Partner",
        style: "bg-gradient-to-r from-yellow-100/90 to-amber-50 border-yellow-300/80 text-yellow-900 shadow-2xs",
      };
    }
    if (t.includes("silver") || t.includes("platinum")) {
      return {
        symbol: "🥈",
        label: "Silver Partner",
        style: "bg-gradient-to-r from-slate-100 to-neutral-50 border-slate-300/80 text-slate-800 shadow-2xs",
      };
    }
    return {
      symbol: "🥉",
      label: "Bronze / Community",
      style: "bg-gradient-to-r from-orange-50 to-neutral-50 border-orange-200 text-orange-900 shadow-2xs",
    };
  };

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-black/6 shadow-2xs space-y-5 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1B1B23] tracking-tight">
              Partners & Official Sponsors
            </h3>
            <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full flex items-center gap-1">
              <Crown className="w-3 h-3 text-amber-600" /> Tiered Sponsors
            </span>
          </div>
          <p className="text-xs text-[#8C8C9E] mt-1">
            Proudly supported by leading industry innovators and global partners.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Verified Sponsors</span>
        </span>
      </div>

      {/* Grid of Partners with Gold, Silver, Bronze Tags & Symbols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {sponsors.map((sp, idx) => {
          const badge = getTierBadge(sp.tier);
          const initials = (sp.name || "P").slice(0, 2).toUpperCase();

          return (
            <div
              key={idx}
              className="p-4 rounded-2xl border border-black/6 bg-neutral-50/50 hover:bg-white hover:border-black/15 hover:shadow-xs transition-all duration-200 flex flex-col justify-between space-y-3 group"
            >
              {/* Top Tag with Symbol */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${badge.style}`}
                >
                  <span className="text-xs">{badge.symbol}</span>
                  <span>{badge.label}</span>
                </span>
                {sp.link && (
                  <a
                    href={sp.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neutral-400 hover:text-black transition-colors p-1"
                    title="Visit Partner Site"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Logo / Brand Display */}
              <div className="flex items-center gap-3 pt-1">
                <div className="w-11 h-11 rounded-xl bg-white border border-black/8 shadow-2xs flex items-center justify-center flex-shrink-0 text-sm font-black text-[#1B1B23]">
                  {initials}
                </div>
                <div className="min-w-0">
                  <p className="font-extrabold text-sm text-[#1B1B23] truncate">
                    {sp.name}
                  </p>
                  <p className="text-[11px] text-[#8C8C9E] font-medium truncate mt-0.5">
                    {sp.category || "Official Partner"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SponsorsFeature;
