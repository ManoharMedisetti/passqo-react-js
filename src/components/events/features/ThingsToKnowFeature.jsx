import { useState } from "react";
import { ChevronRight, ShieldCheck, AlertCircle } from "lucide-react";

const AGE_RESTRICTION_LABELS = {
  EIGHTEEN_PLUS: "🔞 18+",
  TWENTY_ONE_PLUS: "🔞 21+",
};

export function ThingsToKnowFeature({ event }) {
  const [showAll, setShowAll] = useState(false);

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-3.5 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-black/6 pb-3">
        <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
          Things to know & Venue Policies
        </h3>
        <span className="text-xs font-bold text-[#8C8C9E]">
          Entry Guidelines
        </span>
      </div>

      <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A4A58]">
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>
            {event.ageRestriction && event.ageRestriction !== "NONE"
              ? `Entry restricted: ${AGE_RESTRICTION_LABELS[event.ageRestriction] || event.ageRestriction}`
              : "Entry allowed for all ages"}
          </span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>Tickets required for ages 4 and above</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>Pets are not allowed inside the venue (Guide dogs permitted)</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>Physical government ID (Aadhaar / Passport / Driving License) is required for entry</span>
        </li>

        {showAll && (
          <>
            <li className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>Outside food, alcoholic beverages, and glassware are strictly prohibited</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>Security frisking and contactless ticket QR scanning at all turnstiles</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>Professional cameras with detachable zoom lenses require press accreditation</span>
            </li>
          </>
        )}
      </ul>

      <button
        type="button"
        onClick={() => setShowAll((prev) => !prev)}
        className="text-xs sm:text-sm font-bold text-[#1B1B23] hover:text-black inline-flex items-center gap-1 cursor-pointer transition-colors pt-1"
      >
        <span>{showAll ? "View less guidelines" : "View all venue guidelines"}</span>
        <ChevronRight className={`w-3.5 h-3.5 transition-transform ${showAll ? "-rotate-90" : "rotate-90"}`} />
      </button>
    </div>
  );
}

export default ThingsToKnowFeature;

