import { useState } from "react";
import { ChevronRight, ShieldCheck, AlertCircle } from "lucide-react";

const AGE_RESTRICTION_LABELS = {
  EIGHTEEN_PLUS: "🔞 18+",
  TWENTY_ONE_PLUS: "🔞 21+",
};

export function ThingsToKnowFeature({ event, details }) {
  const [showAll, setShowAll] = useState(false);
  const category = event?.category || "MUSIC_ENTERTAINMENT";

  let headerTitle = "Things to know & Venue Policies";
  if (category === "HEALTH_WELLNESS") headerTitle = "Things to know & What to bring";
  else if (category === "FOOD_DRINK") headerTitle = "Things to know & Dining Policies";
  else if (category === "EXHIBITIONS") headerTitle = "Things to know & Gallery Guidelines";
  else if (category === "SPORTS") headerTitle = "Things to know & Stadium Guidelines";

  const customItems = details?.thingsToKnow || details?.policies || [];

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-3.5">
      <div className="flex items-center justify-between border-b border-black/6 pb-3">
        <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
          {headerTitle}
        </h3>
        <span className="text-xs font-bold text-[#8C8C9E]">
          Entry Guidelines
        </span>
      </div>

      <ul className="space-y-2.5 text-xs sm:text-sm text-[#4A4A58]">
        {/* Age Restriction */}
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>
            {event?.ageRestriction && event.ageRestriction !== "NONE"
              ? `Entry restricted: ${AGE_RESTRICTION_LABELS[event.ageRestriction] || event.ageRestriction}`
              : "Entry allowed for all age groups"}
          </span>
        </li>

        {/* Custom items from event details if any */}
        {Array.isArray(customItems) &&
          customItems.slice(0, showAll ? customItems.length : 3).map((item, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>{typeof item === "string" ? item : item.title || item.text}</span>
            </li>
          ))}

        {/* Standard venue guidelines */}
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>Valid ticket QR code and government photo ID are required at turnstiles</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>Tickets required for attendees aged 4 and above</span>
        </li>
        <li className="flex items-start gap-2.5">
          <span className="text-[#FF4E7A] text-base leading-none">•</span>
          <span>Pets are not permitted inside performance areas (Certified guide dogs welcome)</span>
        </li>

        {showAll && (
          <>
            <li className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>Outside food, alcoholic beverages, cans, and glassware are strictly prohibited</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>Security screening and bag inspection are mandatory for all attendees</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>Professional cameras with detachable zoom lenses require accredited media pass</span>
            </li>
            <li className="flex items-start gap-2.5">
              <span className="text-[#FF4E7A] text-base leading-none">•</span>
              <span>Re-entry is subject to venue management discretion and wristband verification</span>
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

