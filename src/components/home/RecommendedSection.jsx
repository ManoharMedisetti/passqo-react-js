import { useEffect, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { Carousel } from "@/components/ui/Carousel";
import { isAuthenticated } from "@/lib/auth/storage";
import { api } from "@/lib/api";

export function RecommendedSection() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    if (!isAuthenticated()) return;
    api.events
      .recommended()
      .then((res) => setEvents(res.events || []))
      .catch(() => setEvents([]));
  }, []);

  if (events.length === 0) return null;

  return (
    <Carousel
      title={
        <span className="flex flex-col gap-1">
          Recommended for You
          <span className="font-sans text-sm font-medium text-[#1B1B23]/60">
            Based on your tickets, follows and city
          </span>
        </span>
      }
    >
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          slug={event.slug}
          name={event.name}
          date={event.date}
          venue={event.venue}
          city={event.city}
          minPrice={event.minPrice}
          image={event.image}
          isBlockchain={event.isBlockchain}
          isSellingFast={event.isSellingFast}
          isSoldOut={event.isSoldOut}
          waitlistCount={event.waitlistCount}
          totalSold={event.totalSold}
          timezone={event.timezone}
        />
      ))}
    </Carousel>
  );
}

export default RecommendedSection;

