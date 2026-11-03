// Shape of `Event.details` (Prisma Json) — the rich sections of the
// "Event Detail · Complete" page. Every block is optional; the page
// only renders the sections it has data for, and falls back to the event's own
// core fields (lineup, tiers, venue, policies) where it can.

export function eventDetailsOf(event) {
  const d = event?.details;
  return d && typeof d === "object" ? d : {};
}

