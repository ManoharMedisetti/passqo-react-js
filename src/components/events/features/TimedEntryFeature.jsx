import { Clock, Users, ShieldAlert, Sparkles } from "lucide-react";

export function TimedEntryFeature({ event, details }) {
  const slots = details?.timedEntrySlots || [
    { slot: "10:00 AM – 11:30 AM", availability: "Available", status: "open", capacity: "85% remaining" },
    { slot: "11:30 AM – 01:00 PM", availability: "Filling Fast", status: "fast", capacity: "20% remaining" },
    { slot: "01:00 PM – 02:30 PM", availability: "Sold Out", status: "full", capacity: "0% remaining" },
    { slot: "02:30 PM – 04:00 PM", availability: "Available", status: "open", capacity: "65% remaining" },
    { slot: "04:00 PM – 05:30 PM", availability: "Filling Fast", status: "fast", capacity: "15% remaining" },
    { slot: "05:30 PM – 07:00 PM (Twilight)", availability: "Available", status: "open", capacity: "50% remaining" },
  ];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-black/6 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Timed Entry Arrival Windows
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            Timed access ensures an intimate, uncrowded viewing experience for every visitor.
          </p>
        </div>
        <span className="text-xs font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          <span>Crowd Control Managed</span>
        </span>
      </div>

      <div className="bg-amber-50/70 border border-amber-200/60 rounded-xl p-3 flex items-start gap-2.5 text-xs text-amber-900">
        <ShieldAlert className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
        <p>
          Please arrive within your designated 30-minute arrival window. Once inside the gallery, you may stay as long as you wish until closing.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
        {slots.map((item, idx) => (
          <div
            key={idx}
            className={`p-3.5 rounded-xl border transition-all flex items-center justify-between gap-2 ${
              item.status === "full"
                ? "bg-neutral-100/60 border-black/5 opacity-60"
                : "bg-neutral-50/60 hover:bg-neutral-50 border-black/8 hover:border-black/20"
            }`}
          >
            <div>
              <p className="font-bold text-xs sm:text-sm text-[#1B1B23]">
                {item.slot}
              </p>
              <p className="text-[11px] text-[#8C8C9E] mt-0.5">
                {item.capacity}
              </p>
            </div>

            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                item.status === "open"
                  ? "text-emerald-700 bg-emerald-50"
                  : item.status === "fast"
                  ? "text-[#FF4E7A] bg-pink-50 animate-pulse"
                  : "text-neutral-500 bg-neutral-200"
              }`}
            >
              {item.availability}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default TimedEntryFeature;

