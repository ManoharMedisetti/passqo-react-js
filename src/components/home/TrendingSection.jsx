import { useEffect, useState } from "react";
import { EventCard } from "@/components/events/EventCard";
import { Carousel } from "@/components/ui/Carousel";
import { detectLocation } from "@/lib/location";
import { api } from "@/lib/api";
import { MOCK_TRENDING } from "@/lib/mockData";

export function TrendingSection({ initialTrending = MOCK_TRENDING }) {
  const [trending, setTrending] = useState(initialTrending && initialTrending.length > 0 ? initialTrending : MOCK_TRENDING);

  useEffect(() => {
    if (initialTrending && initialTrending.length > 0) {
      setTrending(initialTrending);
    }
  }, [initialTrending]);

  useEffect(() => {
    detectLocation().then((loc) => {
      if (!loc) return;
      const params = { near: loc.city };
      if (loc.country) params.nearCountry = loc.country;
      api.events.trending(params).then(setTrending).catch(() => {});
    });
  }, []);

  if (!trending || trending.length === 0) return null;

  return (
    <Carousel title="Happening near you">
      {trending.slice(0, 8).map((event) => (
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

export default TrendingSection;

