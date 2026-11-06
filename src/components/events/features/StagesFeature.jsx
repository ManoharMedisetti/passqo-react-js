import { Layers, Sparkles, Volume2 } from "lucide-react";

export function StagesFeature({ event, details }) {
  const stages = details?.stages || [
    {
      name: "Main Arena (The Colosseum)",
      type: "Live Acoustic & Headline Set",
      capacity: "12,000 Capacity",
      description: "State-of-the-art D&B audiotechnik sound system, 4K LED backdrops, and immersive laser arrays.",
      headliner: "Sharry Mann & Full Live Band",
    },
    {
      name: "The Canopy Stage",
      type: "Electronic & Acoustic Fusion",
      capacity: "3,500 Capacity",
      description: "Intimate covered stage with 360-degree surround spatial audio and ambient visual art installations.",
      headliner: "DJ Shadow & Guests",
    },
    {
      name: "Sundown Lawn",
      type: "Sunset Acoustic & Chillout Zone",
      capacity: "2,000 Capacity",
      description: "Open-air grass amphitheater with bean bags, craft food stalls, and sunset acoustic sessions.",
      headliner: "Acoustic Collective",
    },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-black/6 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Stages & Performance Zones
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            Multiple custom-engineered acoustic arenas for seamless live entertainment.
          </p>
        </div>
        <span className="text-xs font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          <span>{stages.length} Stages</span>
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {stages.map((stg, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl border border-black/6 bg-neutral-50/50 hover:bg-neutral-50 hover:border-black/15 transition-all space-y-2 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4 text-[#FF4E7A]" />
                <h4 className="font-extrabold text-sm sm:text-base text-[#1B1B23]">
                  {stg.name}
                </h4>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                  {stg.capacity}
                </span>
                <span className="text-[#8C8C9E] font-medium">
                  {stg.type}
                </span>
              </div>
            </div>

            <p className="text-xs text-[#6E6969] leading-relaxed">
              {stg.description}
            </p>

            {stg.headliner && (
              <div className="pt-1 flex items-center gap-2 text-xs font-semibold text-[#1B1B23]">
                <span className="text-[#FF4E7A] font-bold">Featured Act:</span>
                <span>{stg.headliner}</span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default StagesFeature;

