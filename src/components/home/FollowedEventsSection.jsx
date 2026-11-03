import { useEffect, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { Carousel } from "@/components/ui/Carousel";
import { isAuthenticated } from "@/lib/auth/storage";
import { api } from "@/lib/api";

export function FollowedEventsSection() {
  const [events, setEvents] = useState([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      setReady(true);
      return;
    }

    Promise.all([
      api.artists.myFollowing().catch(() => []),
      api.organisers.myFollowing().catch(() => []),
    ])
      .then(([artists, organisers]) => {
        if (!artists.length && !organisers.length) return;
        const followedEvents = [
          ...artists.flatMap((a) => (a.events || []).map((e) => ({ ...e, _artist: a }))),
          ...organisers.flatMap((o) => (o.events || []).map((e) => ({ ...e, _organiser: o }))),
        ]
          .filter((e) => new Date(e.date) >= new Date())
          .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
          .filter((e, idx, arr) => arr.findIndex((x) => x.id === e.id) === idx)
          .slice(0, 12);
        setEvents(followedEvents);
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  if (!ready || events.length === 0) return null;

  return (
    <Carousel title="Followed Organisers Events">
      {events.map((event) => (
        <EventCard
          key={event.id}
          id={event.id}
          slug={event.slug}
          name={event.name}
          date={event.date}
          venue={event.venue}
          city={event.city}
          minPrice={event.ticketTiers?.[0]?.price ?? 0}
          image={event.image}
          isBlockchain={event.isBlockchain}
          isSoldOut={event.isSoldOut}
          isSellingFast={event.isSellingFast}
          timezone={event.timezone}
        />
      ))}
    </Carousel>
  );
}

export default FollowedEventsSection;

