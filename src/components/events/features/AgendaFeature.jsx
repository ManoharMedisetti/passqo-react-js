import { useState } from "react";
import { Clock, MapPin, Sparkles, User } from "lucide-react";

export function AgendaFeature({ event, details }) {
  const scheduleData = details?.schedule;
  const days = scheduleData?.days || [];

  const [activeDayIdx, setActiveDayIdx] = useState(0);

  const fallbackRows = [
    {
      time: "08:30 AM",
      endTime: "09:30 AM",
      title: "Registration, Coffee & Networking Expo",
      stage: "Grand Foyer",
      duration: "60 min",
      description: "Pick up your physical conference badge, grab fresh barista coffee, and meet fellow attendees before the opening keynote.",
      speaker: "Welcome Committee",
    },
    {
      time: "09:30 AM",
      endTime: "11:00 AM",
      title: "Opening Keynote: Autonomous Agents in 2027",
      stage: "Main Auditorium (Hall 1)",
      duration: "90 min",
      highlight: true,
      description: "A deep dive into next-generation reinforcement learning swarms, edge inference, and multi-modal autonomous systems.",
      speaker: "Keynote Lead",
    },
    {
      time: "11:30 AM",
      endTime: "12:45 PM",
      title: "Panel: Scaling Distributed Infrastructure Without Downtime",
      stage: "Stage B (Innovation Hall)",
      duration: "75 min",
      description: "Engineering leaders discuss zero-trust security, resilient database architectures, and global edge computing.",
      speaker: "Panel of VPs & CTOs",
    },
    {
      time: "01:00 PM",
      endTime: "02:15 PM",
      title: "Curated Executive Lunch & Partner Expo",
      stage: "Liffey Suite & Garden Courtyard",
      duration: "75 min",
      description: "Gourmet buffet lunch with live tech demonstrations from headline sponsors and dedicated 1:1 investor tables.",
      speaker: "Networking Session",
    },
    {
      time: "02:30 PM",
      endTime: "04:30 PM",
      title: "Interactive Masterclass Lab: Building Production Agent Workflows",
      stage: "Workshop Studio 2",
      duration: "120 min",
      highlight: true,
      description: "Hands-on coding lab. Bring your laptop. Walk away with working open-source agent pipeline templates.",
      speaker: "Lead Research Engineers",
    },
    {
      time: "05:00 PM",
      endTime: "06:00 PM",
      title: "Closing Remarks, Q&A & Evening Reception Drinks",
      stage: "Main Auditorium & Sunset Terrace",
      duration: "60 min",
      description: "Wrap-up summary of day insights followed by craft beers, wine, and evening canapés.",
      speaker: "All Hosts & Speakers",
    },
  ];

  const currentRows = days[activeDayIdx]?.rows || (Array.isArray(scheduleData) ? scheduleData : fallbackRows);

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-7 border border-black/6 shadow-2xs space-y-6 animate-in fade-in duration-200">
      {/* Header & Day Selector */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4 border-b border-black/6 pb-4">
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-bold text-[#1B1B23] tracking-tight">
              Agenda & Session Schedule
            </h3>
            <span className="text-[10px] font-bold text-[#FF4E7A] bg-pink-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider flex-shrink-0">
              Live Flow
            </span>
          </div>
          <p className="text-xs text-[#8C8C9E] mt-1">
            Complete track breakdown, speaker stages, and hands-on workshops.
          </p>
        </div>

        {/* Day Switcher Pills if multi-day */}
        {days.length > 1 && (
          <div className="inline-flex items-center gap-1.5 p-1 bg-neutral-100/80 rounded-2xl border border-black/5 flex-shrink-0 self-start md:self-auto overflow-x-auto max-w-full scrollbar-none flex-nowrap">
            {days.map((day, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveDayIdx(idx)}
                className={`whitespace-nowrap flex-nowrap flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer inline-flex items-center gap-1.5 min-w-max ${
                  activeDayIdx === idx
                    ? "bg-[#FF4E7A] text-white shadow-xs shadow-[#FF4E7A]/25"
                    : "text-[#6E6969] hover:text-[#1B1B23] hover:bg-white/60"
                }`}
              >
                <span className="whitespace-nowrap font-bold">Day {idx + 1}</span>
                <span className="text-[10px] opacity-90 whitespace-nowrap font-normal">
                  ({day.rows?.length || 0} sessions)
                </span>
              </button>
            ))}
          </div>
        )}
      </div>

      {days[activeDayIdx]?.label && (
        <div className="flex items-center gap-2 text-xs font-bold text-[#1B1B23] bg-neutral-50 px-3.5 py-2 rounded-xl border border-black/5 w-fit">
          <span className="text-[#FF4E7A]">📅</span>
          <span>{days[activeDayIdx].label}</span>
        </div>
      )}

      {/* Clean Straight-Line Timeline with Small Dots */}
      <div className="pt-2 sm:pt-3">
        {currentRows.map((row, idx) => {
          const isKeynote = row.highlight;
          const isLast = idx === currentRows.length - 1;

          return (
            <div
              key={idx}
              className="grid grid-cols-[68px_20px_1fr] sm:grid-cols-[88px_28px_1fr] items-start gap-1.5 sm:gap-3 group"
            >
              {/* Left Column: Time (Right-Aligned) */}
              <div className="pt-0.5 text-right font-mono pr-1 sm:pr-2">
                <span className="text-xs sm:text-sm font-bold block text-[#1B1B23] transition-colors group-hover:text-[#FF4E7A]">
                  {row.time}
                </span>
                {row.endTime && (
                  <span className="text-[10px] sm:text-[11px] font-medium text-[#8C8C9E] block mt-0.5">
                    {row.endTime}
                  </span>
                )}
              </div>

              {/* Center Column: Continuous Straight Line with Centered Small Dot */}
              <div className="relative flex flex-col items-center h-full min-h-[58px] sm:min-h-[64px]">
                {/* Continuous straight line */}
                <div
                  className={`absolute top-0 w-0.5 bg-neutral-200 transition-colors ${
                    isLast ? "h-2.5" : "bottom-0"
                  }`}
                />
                {/* Small dot centered on the line, aligned with the time row - highlights only on row hover */}
                <div className="relative z-10 mt-1.5 w-2.5 h-2.5 rounded-full transition-all duration-200 flex-shrink-0 bg-white border-2 border-neutral-300 group-hover:border-[#FF4E7A] group-hover:bg-[#FF4E7A] group-hover:scale-125" />
              </div>

              {/* Right Column: Session Details */}
              <div className={`pb-6 sm:pb-7 space-y-1.5 ${isLast ? "pb-2" : ""}`}>
                {/* Badges: Stage, Duration, Keynote */}
                <div className="flex items-center gap-2 flex-wrap">
                  {row.stage && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#6E6969] bg-neutral-100 px-2 py-0.5 rounded-md border border-black/5">
                      <MapPin className="w-3 h-3 text-[#FF4E7A]" />
                      <span>{row.stage}</span>
                    </span>
                  )}
                  {row.duration && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#8C8C9E]">
                      <Clock className="w-3 h-3" />
                      <span>{row.duration}</span>
                    </span>
                  )}
                  {isKeynote && (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full shadow-2xs">
                      <Sparkles className="w-3 h-3 text-amber-600" /> Keynote
                    </span>
                  )}
                </div>

                {/* Session Title (Clean steady text color, no hover flash) */}
                <h4 className="font-extrabold text-sm sm:text-base text-[#1B1B23] tracking-tight leading-snug">
                  {row.title}
                </h4>

                {/* Speaker Info if available */}
                {row.speaker && (
                  <p className="text-xs font-semibold text-[#8C8C9E] flex items-center gap-1.5">
                    <User className="w-3 h-3 text-[#FF4E7A]" />
                    <span>{row.speaker}</span>
                  </p>
                )}

                {/* Direct Clean Description (No dropdown required) */}
                {row.description && (
                  <p className="text-xs text-[#666] leading-relaxed max-w-2xl pt-0.5">
                    {row.description}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AgendaFeature;
