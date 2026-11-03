// One place that turns an event's location fields into the line we show.
export function eventLocationLine(event = {}) {
  if (event.format === "ONLINE") return "Online";
  const parts = [event.venue, event.city].filter(Boolean);
  return parts.length ? parts.join(", ") : "Location to be announced";
}

// Short form for tight spots (cards, map popups) — venue if we have it,
// otherwise the city on its own.
export function eventVenueLabel(event = {}) {
  if (event.format === "ONLINE") return "Online";
  return event.venue || event.city || "Location TBC";
}

