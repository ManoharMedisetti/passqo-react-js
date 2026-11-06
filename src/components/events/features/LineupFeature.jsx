import { Sparkles, Music2 } from "lucide-react";

export function LineupFeature({ event, details }) {
  const lineup = details?.lineup || event?.lineup;
  const headliner = lineup?.headliner;
  const supporting = lineup?.supporting || (Array.isArray(lineup) ? lineup : []);

  if (!headliner && supporting.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-5 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Artist Lineup & Performers
          </h3>
          <span className="text-xs font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-1 rounded-full">
            Live Performance
          </span>
        </div>
        <p className="text-xs text-[#8C8C9E] mt-0.5">
          Featuring international headliners and premier live acts.
        </p>
      </div>

      {/* Headliner Spotlight - Clean light aesthetic without black background */}
      {headliner && (
        <div className="relative rounded-2xl overflow-hidden border border-[#FF4E7A]/20 bg-gradient-to-br from-pink-50/60 via-white to-amber-50/40 p-5 sm:p-6 shadow-2xs">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-300/60 px-2.5 py-1 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-3 h-3 text-amber-600" /> Headliner
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 border-2 border-white shadow-sm ring-1 ring-black/5">
              <img
                src={headliner.image || "/images/figma-sample/goa/headliner.png"}
                alt={headliner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-center sm:text-left flex-1 min-w-0">
              <h4 className="font-extrabold text-xl sm:text-2xl text-[#1B1B23] tracking-tight">
                {headliner.name}
              </h4>
              <p className="text-xs text-[#FF4E7A] font-bold">
                {headliner.role || "Lead Performing Artist"}
              </p>
              {headliner.bio && (
                <p className="text-xs text-[#6E6969] leading-relaxed max-w-xl pt-0.5">
                  {headliner.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Supporting Acts Grid */}
      {supporting.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8C9E]">
            Supporting Artists
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {supporting.map((artist, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black/15 transition-all flex items-center gap-3.5 group cursor-pointer"
              >
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-neutral-200 flex-shrink-0 shadow-2xs">
                  <img
                    src={artist.image || "/images/figma-sample/goa/support-1.png"}
                    alt={artist.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-xs sm:text-sm text-[#1B1B23] truncate">
                    {artist.name}
                  </p>
                  <p className="text-[11px] text-[#8C8C9E] font-medium truncate mt-0.5">
                    {artist.role || artist.tag || "Supporting Act"}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default LineupFeature;
