import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, MapPin, Calendar, Flame, ShieldCheck, Sparkles, ArrowUpRight } from "lucide-react";
import { FEATURES } from "@/lib/features";
import { eventLocationLine } from "@/lib/eventLocation";

const WISHLIST_KEY = "passqo-wishlist";

// Authentic event photo pool looped across all events (no 3D category clipart/icons)
const EVENT_IMAGES_LOOP = [
  "/images/figma-sample/goa/goa-hero.png",
  "/images/figma-sample/f9-karting.webp",
  "/images/figma-sample/goa/performance.png",
  "/images/figma-sample/goa/gallery-1.png",
  "/images/figma-sample/goa/highlight.png",
  "/images/figma-sample/goa/stage-a.png",
  "/images/figma-sample/goa/gallery-2.png",
  "/images/figma-sample/goa/gallery-3.png",
  "/images/figma-sample/goa/stage-b.png",
  "/images/figma-sample/goa/artist-poster.png",
  "/images/figma-sample/goa/headliner.png",
  "/images/figma-sample/goa/support-1.png",
  "/images/figma-sample/goa/support-2.png",
];

function getEventLoopImage(key) {
  if (!key) return EVENT_IMAGES_LOOP[0];
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash << 5) - hash + key.charCodeAt(i);
    hash |= 0;
  }
  return EVENT_IMAGES_LOOP[Math.abs(hash) % EVENT_IMAGES_LOOP.length];
}

export function getWishlist() {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY) || "[]");
  } catch {
    return [];
  }
}

export function toggleWishlist(id) {
  const list = getWishlist();
  const idx = list.indexOf(id);
  if (idx === -1) {
    list.push(id);
  } else {
    list.splice(idx, 1);
  }
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return idx === -1;
}

function formatDate(d, timezone) {
  const date = new Date(d);
  const tz = timezone || undefined;
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short", timeZone: tz });
  const day = date.toLocaleDateString("en-GB", { day: "numeric", timeZone: tz });
  const month = date.toLocaleDateString("en-GB", { month: "short", timeZone: tz });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: tz });
  return { weekday, day, month, time, full: `${weekday}, ${day} ${month} · ${time}` };
}

function formatPrice(price, timezone) {
  if (price === 0) return "Free";
  const sym = timezone?.startsWith("Asia/") ? "₹" : "€";
  return `${sym}${price}`;
}

export function EventCard({
  id,
  slug,
  name,
  date,
  venue,
  city,
  minPrice = 0,
  image,
  isBlockchain,
  isSponsored,
  isSoldOut,
  isSellingFast,
  waitlistCount,
  totalSold,
  timezone,
}) {
  const [wishlisted, setWishlisted] = useState(false);
  const dateInfo = formatDate(date, timezone);
  const priceDisplay = formatPrice(minPrice, timezone);

  const going = totalSold ?? 0;
  const waiting = waitlistCount ?? 0;

  useEffect(() => {
    setWishlisted(getWishlist().includes(id));
  }, [id]);

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setWishlisted(toggleWishlist(id));
  };

  return (
    <Link
      to={`/events/${slug || id}`}
      className="group block h-full select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A] rounded-2xl sm:rounded-3xl"
    >
      <div className="
        relative h-full flex flex-col
        bg-white/75 hover:bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl
        overflow-hidden
        border border-white/80 hover:border-black/10
        shadow-[0_2px_10px_rgba(0,0,0,0.03)]
        hover:shadow-[0_8px_18px_-6px_rgba(0,0,0,0.08)]
        transition-all duration-300 ease-out
        hover:-translate-y-1
      ">
        {/* ── Seamless Full-Width Media Container (Zero Line Artifact) ── */}
        <div className="relative aspect-[16/10] sm:aspect-[4/3] w-full overflow-hidden">
          <img
            src={(!image || image.includes("/categories/") || image.includes("/imagery-")) ? getEventLoopImage(id || slug || name) : image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-106"
            style={{
              WebkitMaskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
              maskImage: "linear-gradient(to bottom, rgba(0,0,0,1) 55%, rgba(0,0,0,0) 100%)",
            }}
          />

          {/* Top Badges */}
          <div className="absolute top-2.5 sm:top-3 left-2.5 sm:left-3 flex flex-wrap gap-1 sm:gap-1.5 z-10 pointer-events-none">
            {isSellingFast && !isSoldOut && (
              <span className="inline-flex items-center gap-1.5 bg-black/45 backdrop-blur-md border border-white/20 text-white text-[9px] sm:text-[10px] font-medium px-2.5 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm tracking-wide select-none">
                <Flame className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FF4E7A] fill-[#FF4E7A] animate-pulse" />
                <span>Selling Fast</span>
              </span>
            )}
            {FEATURES.blockchain && isBlockchain && (
              <span className="inline-flex items-center gap-1 bg-[#1B1B23]/80 text-[#00C896] text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full backdrop-blur-md border border-[#00C896]/30 font-label">
                <ShieldCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#00C896]" /> On-Chain
              </span>
            )}
            {isSponsored && (
              <span className="inline-flex items-center gap-1 bg-white/90 text-[#B86B0A] text-[9px] sm:text-[10px] font-bold px-2 sm:px-2.5 py-0.5 rounded-full backdrop-blur-md shadow-xs font-label">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#FFB020]" /> Featured
              </span>
            )}
          </div>

          {/* Top Right Wishlist Heart Button */}
          <button
            type="button"
            onClick={handleWishlistClick}
            aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
            className="
              absolute top-2.5 sm:top-3 right-2.5 sm:right-3 z-20
              w-7 h-7 sm:w-8 sm:h-8 rounded-full
              bg-black/25 hover:bg-black/50 backdrop-blur-md
              flex items-center justify-center
              border border-white/30 hover:border-white/60
              transition-all duration-200 active:scale-90
            "
          >
            <Heart
              className={`w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors ${
                wishlisted
                  ? "fill-[#FF4E7A] text-[#FF4E7A]"
                  : "text-white"
              }`}
            />
          </button>

          {/* Sold out badge overlay */}
          {isSoldOut && (
            <div className="absolute inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-15">
              <span className="bg-[#1B1B23] text-white font-bold text-xs px-4 py-1.5 rounded-full border border-white/20 uppercase tracking-wider">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* ── Content Body (Proportionate, clean responsive spacing) ── */}
        <div className="flex flex-col flex-1 px-3 sm:px-4 lg:px-4.5 xl:px-5 pt-2.5 sm:pt-3.5 lg:pt-4 pb-3 sm:pb-4 lg:pb-5 z-10 gap-1.5 sm:gap-2.5">
          {/* Date & Time Row (Responsive font size) */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-xs lg:text-[13px] font-bold text-[#FF4E7A] tracking-tight">
            <Calendar className="w-3 h-3 sm:w-3.5 sm:h-3.5 flex-shrink-0 text-[#FF4E7A]" />
            <span className="truncate">
              {dateInfo.weekday}, {dateInfo.day} {dateInfo.month} · {dateInfo.time}
            </span>
          </div>

          {/* Title (Clean fluid scaling according to screen size) */}
          <h3 className="
            font-display font-bold text-[13px] sm:text-[15px] lg:text-[16px] xl:text-[17px] leading-snug text-[#1B1B23]
            group-hover:text-black line-clamp-2 transition-colors duration-200
          ">
            {name}
          </h3>

          {/* Location & Attendance */}
          <div className="flex items-center justify-between text-[10px] sm:text-xs text-[#6B6B80] font-medium gap-1.5 sm:gap-2">
            <div className="flex items-center gap-1 truncate">
              <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#8C8C9E] flex-shrink-0" />
              <span className="truncate">{eventLocationLine({ venue, city })}</span>
            </div>
            {going > 0 && (
              <span className="flex-shrink-0 text-[9px] sm:text-[11px] font-semibold text-[#8C8C9E]">
                {going > 999 ? `${(going / 1000).toFixed(1)}k` : going} going
              </span>
            )}
          </div>

          {/* Bottom Bar: Price & Translucent Glass CTA */}
          <div className="mt-auto pt-2 sm:pt-2.5 flex items-center justify-between gap-1.5 sm:gap-2">
            <div className="flex flex-col min-w-0 flex-shrink-0">
              <span className="text-[9px] sm:text-[10px] uppercase font-bold tracking-wider text-[#8C8C9E] font-label">
                {minPrice === 0 ? "Admission" : "From"}
              </span>
              <span className={`text-sm sm:text-[15px] lg:text-base xl:text-[17px] font-black tracking-tight ${isSoldOut ? "text-gray-400 line-through" : "text-[#1B1B23]"}`}>
                {priceDisplay}
                {minPrice > 0 && <span className="text-[10px] sm:text-xs font-normal text-gray-500"> onwards</span>}
              </span>
            </div>

            {/* Minimal Translucent Frosted Glass Call to Action */}
            {isSoldOut ? (
              <span className="
                whitespace-nowrap flex-shrink-0
                inline-flex items-center text-[10px] sm:text-xs font-semibold
                bg-black/5 text-[#8C8C9E] px-2 sm:px-2.5 lg:px-3 py-0.5 sm:py-1 rounded-full
                border border-black/5
              ">
                {waiting > 0 ? `${waiting} on waitlist` : "Sold Out"}
              </span>
            ) : (
              <div className="
                whitespace-nowrap flex-shrink-0
                inline-flex items-center gap-1 sm:gap-1.5
                bg-white/80 hover:bg-white
                text-[#1B1B23] text-[10px] sm:text-[11px] lg:text-xs font-bold
                px-2 sm:px-2.5 lg:px-3 py-1 sm:py-1.5 rounded-full
                backdrop-blur-md border border-black/10 hover:border-black/20
                shadow-[0_1px_4px_rgba(0,0,0,0.04)] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]
                transition-all duration-200
              ">
                <span>Book Now</span>
                <ArrowUpRight className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#1B1B23]/70 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[#1B1B23]" />
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

export default EventCard;
