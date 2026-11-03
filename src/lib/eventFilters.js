// Shared browse filters for Home "All Events" and the Search page.

/** Local-calendar range for a date chip, as ISO strings for the events API. */
export function dateFilterRange(filter) {
  if (filter === "any") return {};
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };

  if (filter === "today") return { dateFrom: startOfToday.toISOString(), dateTo: addDays(startOfToday, 1).toISOString() };
  if (filter === "tomorrow") return { dateFrom: addDays(startOfToday, 1).toISOString(), dateTo: addDays(startOfToday, 2).toISOString() };
  if (filter === "week") return { dateFrom: startOfToday.toISOString(), dateTo: addDays(startOfToday, 7).toISOString() };
  const endOfMonth = new Date(startOfToday);
  endOfMonth.setMonth(endOfMonth.getMonth() + 1);
  return { dateFrom: startOfToday.toISOString(), dateTo: endOfMonth.toISOString() };
}

/** Same date rule applied client-side. */
export function inDateRange(event, filter) {
  const { dateFrom, dateTo } = dateFilterRange(filter);
  if (!dateFrom || !dateTo) return true;
  const start = new Date(event.date).getTime();
  const end = event.endDate ? new Date(event.endDate).getTime() : start;
  return start < new Date(dateTo).getTime() && end >= new Date(dateFrom).getTime();
}

export function matchesPrice(event, price) {
  if (price === "free") return event.minPrice === 0;
  if (price === "paid") return event.minPrice > 0;
  return true;
}

// Figma v1 "Filter Chip": pill, Inter medium 14, white → pink when selected.
export const filterChipCls = (active, disabled = false) =>
  `flex-shrink-0 flex items-center gap-1.5 font-label text-sm font-medium leading-[21px] px-3 py-2 rounded-[30px] transition-colors whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A]/50 ${
    disabled ? "bg-white/60 text-[#4B4B4B]/50 cursor-not-allowed" : active ? "bg-[#FF4E7A] text-white" : "bg-white text-[#4B4B4B] hover:text-[#FF4E7A]"
  }`;

// Figma v1 "Dropdown" trigger: white, 12px radius, Inter medium; pink once a value is chosen.
export const filterSelectCls = (active) =>
  `appearance-none pl-9 pr-8 py-2 rounded-xl font-label text-sm font-medium cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A]/50 ${
    active ? "bg-[#FF4E7A] text-white" : "bg-white text-[#4B4B4B]"
  }`;

/** Great-circle distance in km. */
export function distanceKm(a, b) {
  const toRad = (d) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(h));
}

