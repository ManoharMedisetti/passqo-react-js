import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Search, Calendar, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { categoryLabel } from "@/lib/eventCategories";
import { eventLocationLine } from "@/lib/eventLocation";
import { useSearchModal } from "@/context/SearchContext";
import { AnimatedSearchPlaceholder } from "@/components/ui/Navbar";
import { LocationPill } from "@/components/ui/LocationPill";
import { NavUser } from "@/components/ui/NavUser";

/* ─────────────────────────────────────────────────────────────────
   4 SOFT GRADIENT PRESETS — used ONLY when no image exists
──────────────────────────────────────────────────────────────────── */
const NO_IMAGE_PRESETS = [
  {
    // Blush Rose
    bg: "linear-gradient(135deg, #FFE4EC 0%, #FFC2D4 40%, #FFD6E0 70%, #FFF0F5 100%)",
    blob1: "rgba(255,78,122,0.18)",
    blob2: "rgba(255,182,193,0.25)",
    blob3: "rgba(255,220,230,0.20)",
  },
  {
    // Dusk Purple
    bg: "linear-gradient(135deg, #EDE0FF 0%, #D4B8FF 40%, #C9A8F5 70%, #F5EEFF 100%)",
    blob1: "rgba(123,47,190,0.15)",
    blob2: "rgba(200,160,255,0.22)",
    blob3: "rgba(230,210,255,0.18)",
  },
  {
    // Warm Amber
    bg: "linear-gradient(135deg, #FFF3E0 0%, #FFD59E 40%, #FFBC6A 70%, #FFF8F0 100%)",
    blob1: "rgba(255,107,44,0.18)",
    blob2: "rgba(255,176,32,0.22)",
    blob3: "rgba(255,220,160,0.20)",
  },
  {
    // Seafoam Teal
    bg: "linear-gradient(135deg, #E0FAF4 0%, #A8EDD8 40%, #80DFC0 70%, #F0FBF8 100%)",
    blob1: "rgba(0,200,150,0.18)",
    blob2: "rgba(100,220,190,0.22)",
    blob3: "rgba(180,245,230,0.18)",
  },
];

function pickNoImagePreset(eventId) {
  let h = 0;
  for (let i = 0; i < (eventId || "x").length; i++) {
    h = (h * 31 + (eventId || "x").charCodeAt(i)) >>> 0;
  }
  return NO_IMAGE_PRESETS[h % NO_IMAGE_PRESETS.length];
}

/* ─── helpers ─────────────────────────────────────────────────── */
function heroDate(d, tz) {
  const date = new Date(d);
  const zone = tz || undefined;
  const weekday = date.toLocaleDateString("en-GB", { weekday: "short", timeZone: zone });
  const day = date.toLocaleDateString("en-GB", { day: "numeric", month: "short", timeZone: zone });
  const time = date.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true, timeZone: zone });
  return `${weekday}, ${day}, ${time}`;
}

function priceLabel(event) {
  if (event.minPrice === 0) return "Free entry";
  const sym = event.timezone?.startsWith("Asia/") ? "₹" : "€";
  return `${sym}${event.minPrice} onwards`;
}

function posterSrc(event) {
  return event.details?.heroImages?.[0] || event.image || event.artist?.image || null;
}

/* ─────────────────────────────────────────────────────────────────
   BACKGROUND LAYER
   • Mobile: Full-bleed image + black 50 fade overlay
   • Desktop: blurred ambient image + white-left fade
──────────────────────────────────────────────────────────────────── */
function HeroBg({ event, fading }) {
  const src = posterSrc(event) || event.image;
  const preset = pickNoImagePreset(event.id);

  return (
    <>
      {/* ── MOBILE BACKGROUND: Crisp image with black 50 fade overlay ── */}
      <div className="sm:hidden absolute inset-0 overflow-hidden">
        {src ? (
          <img
            key={`mobile-bg-${event.id}`}
            src={src}
            alt=""
            aria-hidden="true"
            className={`
              absolute inset-0 w-full h-full object-cover object-center
              transition-opacity duration-300
              ${fading ? "opacity-0" : "opacity-100"}
            `}
          />
        ) : (
          <div
            className="absolute inset-0 transition-opacity duration-300"
            style={{ background: "linear-gradient(135deg, #1A1A24 0%, #2D1B2D 50%, #15151E 100%)" }}
          />
        )}
        {/* Black 50 fade on top */}
        <div className="absolute inset-0 bg-black/50" />
        {/* Soft bottom vignette blending into body background */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F5F0EB] via-[#F5F0EB]/60 to-transparent pointer-events-none" />
      </div>

      {/* ── DESKTOP BACKGROUND (>= sm): Elegant blurred bloom + white fade ── */}
      <div className="hidden sm:block absolute inset-0 overflow-hidden">
        {src ? (
          <>
            <img
              key={`desktop-bg-${event.id}`}
              src={src}
              alt=""
              aria-hidden="true"
              className={`
                absolute inset-0 w-full h-full object-cover object-center
                scale-[1.12] blur-[72px]
                transition-opacity duration-500
                ${fading ? "opacity-0" : "opacity-75"}
              `}
              style={{ filter: "blur(72px) saturate(1.4)" }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/55 to-white/10" />
            <div className="absolute inset-0 bg-gradient-to-t from-white/40 via-transparent to-transparent" />
          </>
        ) : (
          <>
            <div
              className="absolute inset-0 transition-opacity duration-500"
              style={{ background: preset.bg }}
            />
            <div
              className="absolute rounded-full blur-[100px] pointer-events-none"
              style={{
                background: preset.blob1,
                width: "55%",
                height: "140%",
                top: "-30%",
                left: "-10%",
              }}
            />
            <div
              className="absolute rounded-full blur-[80px] pointer-events-none"
              style={{
                background: preset.blob2,
                width: "45%",
                height: "130%",
                bottom: "-20%",
                right: "-5%",
              }}
            />
            <div
              className="absolute rounded-full blur-[60px] pointer-events-none"
              style={{
                background: preset.blob3,
                width: "30%",
                height: "80%",
                top: "10%",
                left: "38%",
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-white/70 via-white/30 to-transparent" />
          </>
        )}
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────────
   POSTER CARD (right side — ONLY displayed when posterSrc exists)
──────────────────────────────────────────────────────────────────── */
function PosterCard({ event, fading }) {
  const src = posterSrc(event);
  if (!src) return null;

  return (
    <div
      className={`
        relative flex-shrink-0
        w-[130px] xs:w-[150px] sm:w-[190px] md:w-[220px] lg:w-[250px] xl:w-[270px]
        transition-all duration-300
        ${fading ? "opacity-0 scale-95 translate-y-2" : "opacity-100 scale-100 translate-y-0"}
      `}
      style={{ aspectRatio: "2/3" }}
    >
      <img
        src={src}
        alt={`${event.name} poster`}
        className="absolute inset-0 w-full h-full object-cover rounded-2xl"
        draggable={false}
      />
      <div className="absolute inset-0 rounded-2xl ring-1 ring-black/5 pointer-events-none" />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────────
   ARROW BUTTON
──────────────────────────────────────────────────────────────────── */
function ArrowBtn({ dir, onClick }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous event" : "Next event"}
      className={`
        pointer-events-auto absolute top-1/2 -translate-y-1/2
        w-10 h-10 rounded-full items-center justify-center flex
        bg-white/85 hover:bg-white backdrop-blur-md
        text-[#1B1B23] shadow-md border border-black/8
        transition-all duration-150 active:scale-95
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1B23]/40
        ${dir === "prev" ? "-left-2 xl:left-2" : "-right-2 xl:right-2"}
      `}
    >
      <Icon className="w-5 h-5" strokeWidth={2} />
    </button>
  );
}

/* ─────────────────────────────────────────────────────────────────
   MAIN HERO CAROUSEL
──────────────────────────────────────────────────────────────────── */
export function HeroCarousel({ events = [] }) {
  const [index, setIndex] = useState(0);
  const [fading, setFading] = useState(false);
  const { openSearch } = useSearchModal();

  const featured = events.filter((e) => e.isFeatured !== false);
  const list = featured.length > 0 ? featured : events.slice(0, 5);

  const goDir = useCallback(
    (dir) => {
      if (fading || list.length <= 1) return;
      setFading(true);
      setTimeout(() => {
        setIndex((i) => (i + dir + list.length) % list.length);
        setFading(false);
      }, 250);
    },
    [fading, list.length]
  );

  /* Touch / Drag Gesture handling */
  const touchStartX = useRef(null);
  const touchEndX = useRef(null);
  const isDragging = useRef(false);

  const onTouchStart = (e) => {
    touchStartX.current = e.touches ? e.touches[0].clientX : e.clientX;
    touchEndX.current = touchStartX.current;
    isDragging.current = true;
  };

  const onTouchMove = (e) => {
    if (!isDragging.current || touchStartX.current === null) return;
    touchEndX.current = e.touches ? e.touches[0].clientX : e.clientX;
  };

  const onTouchEnd = () => {
    if (!isDragging.current || touchStartX.current === null || touchEndX.current === null) {
      isDragging.current = false;
      return;
    }
    const diffX = touchStartX.current - touchEndX.current;
    const minSwipeDistance = 45;

    if (Math.abs(diffX) > minSwipeDistance) {
      if (diffX > 0) goDir(1);
      else goDir(-1);
    }
    touchStartX.current = null;
    touchEndX.current = null;
    isDragging.current = false;
  };

  /* auto-advance every 6 s */
  useEffect(() => {
    if (list.length <= 1) return;
    const id = setInterval(() => goDir(1), 6000);
    return () => clearInterval(id);
  }, [goDir, list.length]);

  if (!list || list.length === 0) return null;

  const event = list[index];
  const many = list.length > 1;
  const hasPoster = Boolean(posterSrc(event));

  return (
    <>
      {/* ── MOBILE HERO (< sm) — Full-bleed Gradient Image with Event Details ── */}
      <section
        aria-label="Featured event"
        className="sm:hidden relative w-full h-[470px] xs:h-[500px] overflow-hidden select-none cursor-grab active:cursor-grabbing touch-pan-y flex flex-col justify-end"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
      >
        {/* Full-bleed Gradient Image Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {posterSrc(event) ? (
            <img
              key={`mobile-hero-bg-${event.id}`}
              src={posterSrc(event)}
              alt=""
              aria-hidden="true"
              className={`
                absolute inset-0 w-full h-full object-cover object-center
                transition-opacity duration-300
                ${fading ? "opacity-0" : "opacity-100"}
              `}
            />
          ) : (
            <div
              className="absolute inset-0 transition-opacity duration-300"
              style={{ background: pickNoImagePreset(event.id).bg }}
            />
          )}

          {/* Top Vignette (for contrast under fixed transparent navbar), Center shade, and Bottom Fade */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/25 to-black/80" />
          <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#F5F0EB] via-[#F5F0EB]/60 to-transparent" />
        </div>

        {/* ── EVENT DETAILS ON TOP OF THE GRADIENT IMAGE (Positioned cleanly beneath fixed top navbar) ── */}
        <div
          className={`
            relative z-20 px-5 pb-8 pt-32 xs:pt-36 flex flex-col gap-2
            transition-opacity duration-250
            ${fading ? "opacity-0" : "opacity-100"}
          `}
        >
          {/* Badges */}
          {(event.isBlockchain || event.isSponsored) && (
            <div className="flex gap-1.5 flex-wrap">
              {event.isBlockchain && (
                <span className="bg-black/60 text-white border border-white/25 text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-md">
                  ⛓ On-Chain
                </span>
              )}
              {event.isSponsored && (
                <span className="bg-[#FFB020] text-black text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs">
                  ✦ Featured
                </span>
              )}
            </div>
          )}

          {/* Date */}
          <p className="text-xs font-bold text-pink-300 font-label tracking-wide">
            {heroDate(event.date, event.timezone)}
          </p>

          {/* Title */}
          <h2 className="text-2xl xs:text-[26px] font-display font-extrabold text-white leading-tight drop-shadow-md line-clamp-2">
            {event.name}
          </h2>

          {/* Venue & Price */}
          <div className="flex flex-col gap-0.5 text-xs text-white/90 font-medium">
            <p className="truncate">{eventLocationLine(event)}</p>
            <p className="font-bold text-white text-[13px]">{priceLabel(event)}</p>
          </div>

          {/* CTA Button */}
          <Link
            to={`/events/${event.slug || event.id}`}
            className="
              self-start mt-1.5 inline-flex items-center
              bg-[#FF4E7A] hover:bg-[#e03d67] active:scale-95
              text-white font-label font-bold text-xs xs:text-sm
              px-6 py-2.5 rounded-full shadow-[0_4px_16px_rgba(255,78,122,0.4)]
              transition-all duration-150
            "
          >
            {event.minPrice === 0 ? "Register Free" : "Book tickets"}
          </Link>
        </div>

        {/* Carousel Dots */}
        {many && (
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
            {list.map((e, i) => (
              <button
                key={e.id}
                type="button"
                onClick={() => {
                  if (!fading && i !== index) {
                    setFading(true);
                    setTimeout(() => {
                      setIndex(i);
                      setFading(false);
                    }, 250);
                  }
                }}
                aria-label={`Slide ${i + 1}`}
                aria-current={i === index}
                className={`rounded-full transition-all duration-250 ${
                  i === index
                    ? "w-5 h-[6px] bg-white"
                    : "w-[6px] h-[6px] bg-white/40 hover:opacity-80"
                }`}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── DESKTOP HERO (>= sm) — Original balanced Figma layout ── */}
      <section
        aria-roledescription="carousel"
        aria-label="Featured events"
        className="hidden sm:block relative w-full select-none cursor-grab active:cursor-grabbing touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onMouseDown={onTouchStart}
        onMouseMove={onTouchMove}
        onMouseUp={onTouchEnd}
        onMouseLeave={onTouchEnd}
      >
        <div className="relative w-full overflow-hidden h-[480px] md:h-[530px] lg:h-[570px] bg-transparent flex flex-col justify-center">
          {/* Background (image-blur OR soft gradient) */}
          <HeroBg event={event} fading={fading} />

          {/* Smooth bottom fade into body bg (#F5F0EB) */}
          <div className="absolute inset-x-0 bottom-0 h-28 lg:h-40 bg-gradient-to-t from-[#F5F0EB] via-[#F5F0EB]/70 to-transparent pointer-events-none z-10" />

          {/* Content */}
          <div
            className={`
              relative z-10 mx-auto w-full max-w-[1280px]
              px-4 sm:px-10 lg:px-20 xl:px-28
              pt-28 md:pt-32 lg:pt-36 pb-6 sm:pb-10 lg:pb-12
              flex items-center justify-between gap-4 sm:gap-8 lg:gap-16
              transition-opacity duration-250
              ${fading ? "opacity-0" : "opacity-100"}
            `}
          >
            {/* LEFT: event details */}
            <div className={`flex flex-col gap-3 lg:gap-4 flex-1 ${hasPoster ? "max-w-xl" : "max-w-3xl"}`}>
              {/* badges */}
              {(event.isBlockchain || event.isSponsored) && (
                <div className="flex gap-2 flex-wrap">
                  {event.isBlockchain && (
                    <span className="bg-[#1B1B23]/85 text-white text-[10px] font-bold px-3 py-1 rounded-full font-label backdrop-blur-sm">
                      ⛓ On-Chain
                    </span>
                  )}
                  {event.isSponsored && (
                    <span className="bg-[#FFB020]/20 text-[#8C6000] text-[10px] font-bold px-3 py-1 rounded-full border border-[#FFB020]/40 font-label">
                      ✦ Sponsored
                    </span>
                  )}
                </div>
              )}

              {/* date */}
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#5A5A72] font-label tracking-wide">
                {heroDate(event.date, event.timezone)}
              </p>

              {/* title */}
              <h2 className="text-[20px] sm:text-2xl md:text-3xl lg:text-[36px] xl:text-5xl font-display font-bold text-[#1B1B23] leading-[1.1]">
                {event.name}
              </h2>

              {/* venue */}
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#4B4B5A] font-medium">
                {eventLocationLine(event)}
              </p>

              {/* price */}
              <p className="text-xs sm:text-sm lg:text-[15px] text-[#4B4B5A]">
                {priceLabel(event)}
              </p>

              {/* CTA */}
              <Link
                to={`/events/${event.slug || event.id}`}
                className="
                  self-start mt-2 inline-flex items-center
                  bg-[#1B1B23] hover:bg-[#2d2d3a] active:bg-black
                  text-white font-label font-bold text-sm
                  px-6 py-3 rounded-full shadow-md
                  transition-all duration-150 active:scale-95
                  focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1B1B23]/50 focus-visible:ring-offset-2
                "
              >
                {event.minPrice === 0 ? "Register Free" : "Book tickets"}
              </Link>
            </div>

            {/* RIGHT: poster card (hidden if no image) */}
            {hasPoster && (
              <div className="flex-shrink-0">
                <PosterCard event={event} fading={fading} />
              </div>
            )}
          </div>

          {/* ── Dots ─────────────────────────────────────────────── */}
          {many && (
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
              {list.map((e, i) => (
                <button
                  key={e.id}
                  type="button"
                  onClick={() => {
                    if (!fading && i !== index) {
                      setFading(true);
                      setTimeout(() => {
                        setIndex(i);
                        setFading(false);
                      }, 250);
                    }
                  }}
                  aria-label={`Slide ${i + 1}`}
                  aria-current={i === index}
                  className={`rounded-full transition-all duration-250 ${
                    i === index
                      ? "w-5 h-[7px] bg-[#1B1B23]"
                      : "w-[7px] h-[7px] bg-[#1B1B23]/25 hover:opacity-80"
                  }`}
                />
              ))}
            </div>
          )}

          {/* ── Arrows (anchored to inner layout) ───────────────── */}
          {many && (
            <div className="hidden lg:block absolute inset-y-0 inset-x-0 pointer-events-none z-30">
              <div className="relative mx-auto max-w-[1280px] h-full px-4 sm:px-6 lg:px-8">
                <ArrowBtn dir="prev" onClick={() => goDir(-1)} />
                <ArrowBtn dir="next" onClick={() => goDir(1)} />
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

export default HeroCarousel;
