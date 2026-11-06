import { Sparkles, Music2 } from "lucide-react";

export function LineupFeature({ event, details }) {
  const lineup = details?.lineup || event?.lineup;
  const headliner = lineup?.headliner;
  const supporting = lineup?.supporting || (Array.isArray(lineup) ? lineup : []);

  if (!headliner && supporting.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div>
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-[#1B1B23] tracking-tight">
            Artist Lineup & Performers
          </h3>
          <span className="text-[10px] font-bold text-[#FF4E7A] bg-pink-50 px-2 py-0.5 rounded-full">
            Live Performance
          </span>
        </div>
        <p className="text-xs text-[#8C8C9E] mt-0.5">
          Featuring international headliners and premier live acts.
        </p>
      </div>

      {/* Headliner Spotlight - Clean light aesthetic without black background */}
      {headliner && (
        <div className="relative rounded-xl overflow-hidden border border-[#FF4E7A]/20 bg-gradient-to-br from-pink-50/60 via-white to-amber-50/40 p-3.5 sm:p-4 shadow-2xs">
          <div className="absolute top-2.5 right-2.5">
            <span className="text-[9px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100/80 border border-amber-300/60 px-2 py-0.5 rounded-full flex items-center gap-1 shadow-2xs">
              <Sparkles className="w-2.5 h-2.5 text-amber-600" /> Headliner
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-3 sm:gap-3.5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 border-2 border-white shadow-sm ring-1 ring-black/5">
              <img
                src={headliner.image || "/images/figma-sample/goa/headliner.png"}
                alt={headliner.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-0.5 text-center sm:text-left flex-1 min-w-0">
              <h4 className="font-extrabold text-base sm:text-lg text-[#1B1B23] tracking-tight">
                {headliner.name}
              </h4>
              <p className="text-xs text-[#FF4E7A] font-bold">
                {headliner.role || "Lead Performing Artist"}
              </p>
              {headliner.bio && (
                <p className="text-xs text-[#6E6969] leading-relaxed max-w-xl pt-0.5 line-clamp-2">
                  {headliner.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Supporting Acts Grid */}
      {supporting.length > 0 && (
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-[#8C8C9E]">
            Supporting Artists
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {supporting.map((artist, idx) => (
              <div
                key={idx}
                className="p-2.5 sm:p-3 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black/15 transition-all flex items-center gap-3 group cursor-pointer"
              >
                <div className="w-11 h-11 rounded-lg overflow-hidden bg-neutral-200 flex-shrink-0 shadow-2xs">
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
