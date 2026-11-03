// v2 universal event taxonomy — mirrors the EventCategory enum in backend.
export const EVENT_CATEGORIES = [
  { value: "MUSIC_ENTERTAINMENT", label: "Music and Entertainment", icon: "🎵" },
  { value: "BUSINESS", label: "Business", icon: "💼" },
  { value: "EDUCATION", label: "Education", icon: "🎓" },
  { value: "HEALTH_WELLNESS", label: "Health and Wellness", icon: "🧘" },
  { value: "FOOD_DRINK", label: "Food and Drink", icon: "🍽️" },
  { value: "SPORTS", label: "Sport", icon: "⚽" },
  { value: "VIRTUAL", label: "Virtual", icon: "🌐" },
  { value: "EXHIBITIONS", label: "Exhibitions", icon: "🖼️" },
  { value: "COMMUNITY", label: "Community", icon: "🤝" },
  { value: "OTHER", label: "Other", icon: "✨" },
];

// Categories shown as browse shortcuts (Home row).
export const BROWSE_CATEGORIES = EVENT_CATEGORIES.filter(c => c.value !== "OTHER");

export function categoryLabel(value) {
  if (!value) return "—";
  return EVENT_CATEGORIES.find(c => c.value === value)?.label ?? value.replace(/_/g, " & ");
}

export function categoryImage(value) {
  if (value === "OTHER") return null;
  return `/images/categories/icons/${value.toLowerCase().replace(/_/g, "-")}.webp`;
}

