import { Utensils, HeartHandshake, CheckCircle2, ShieldCheck } from "lucide-react";

export function DietaryAccessibilityFeature({ event, details }) {
  const dietaryOptions = details?.dietaryAndAccessibility?.dietaryOptions || [
    "Vegetarian",
    "Vegan",
    "Halal Certified",
    "Gluten-Free",
    "Dairy-Free",
    "Nut Allergy Safe",
  ];

  const accessibility = details?.dietaryAndAccessibility?.accessibilityAccommodations ||
    "The venue is fully wheelchair accessible with flat step-free entrances, spacious passenger elevators to all floors, dedicated accessible restrooms, and hearing induction loops installed in all main auditoriums.";

  return (
    <div className="bg-white rounded-2xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4 animate-in fade-in duration-200">
      <div className="flex items-center justify-between border-b border-black/6 pb-3">
        <div>
          <h3 className="text-lg sm:text-xl font-bold text-[#1B1B23] tracking-tight">
            Dietary Preferences & Accessibility
          </h3>
          <p className="text-xs text-[#8C8C9E] mt-0.5">
            We are dedicated to providing a fully inclusive and comfortable experience for all guests.
          </p>
        </div>
        <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full flex items-center gap-1">
          <HeartHandshake className="w-3.5 h-3.5" />
          <span>Inclusive Event</span>
        </span>
      </div>

      {/* Dietary Grid */}
      <div className="space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8C9E] flex items-center gap-1.5">
          <Utensils className="w-3.5 h-3.5 text-[#FF4E7A]" />
          <span>Dietary Options Catered</span>
        </h4>
        <div className="flex flex-wrap gap-2">
          {dietaryOptions.map((opt, idx) => (
            <span
              key={idx}
              className="px-3 py-1.5 rounded-xl border border-black/6 bg-neutral-50 text-xs font-bold text-[#1B1B23] flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{opt}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Accessibility Details */}
      <div className="pt-2 border-t border-black/6 space-y-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C8C9E] flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Venue Accessibility</span>
        </h4>
        <p className="text-xs text-[#4A4A58] leading-relaxed bg-neutral-50/70 p-3.5 rounded-xl border border-black/6">
          {accessibility}
        </p>
      </div>
    </div>
  );
}

export default DietaryAccessibilityFeature;

