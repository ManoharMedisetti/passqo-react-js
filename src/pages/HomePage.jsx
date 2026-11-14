import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "@/components/ui/Navbar";
import { BottomNav } from "@/components/ui/BottomNav";
import { Footer } from "@/components/ui/Footer";
import { Carousel } from "@/components/ui/Carousel";
import { HeroCarousel } from "@/components/home/HeroCarousel";
import { AllEventsSection } from "@/components/home/AllEventsSection";
import { FollowedEventsSection } from "@/components/home/FollowedEventsSection";
import { RecommendedSection } from "@/components/home/RecommendedSection";
import { TrendingSection } from "@/components/home/TrendingSection";
import { BROWSE_CATEGORIES, categoryImage } from "@/lib/eventCategories";
import { api } from "@/lib/api";
import { MOCK_EVENTS, MOCK_TRENDING } from "@/lib/mockData";
import { Zap, X } from "lucide-react";
import { getUser } from "@/lib/auth/storage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

const CATEGORY_STYLES = {
  MUSIC_ENTERTAINMENT: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FFE4EC] hover:via-white hover:to-white hover:border-[#FF4E7A]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(255,78,122,0.18)]",
    textColor: "group-hover:text-[#E11D48]",
  },
  BUSINESS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#DBEAFE] hover:via-white hover:to-white hover:border-[#3B82F6]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(59,130,246,0.18)]",
    textColor: "group-hover:text-[#1D4ED8]",
  },
  EDUCATION: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#D1FAE5] hover:via-white hover:to-white hover:border-[#10B981]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(16,185,129,0.18)]",
    textColor: "group-hover:text-[#047857]",
  },
  HEALTH_WELLNESS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#EDE9FE] hover:via-white hover:to-white hover:border-[#8B5CF6]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(139,92,246,0.18)]",
    textColor: "group-hover:text-[#6D28D9]",
  },
  FOOD_DRINK: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FEF3C7] hover:via-white hover:to-white hover:border-[#F59E0B]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(245,158,11,0.18)]",
    textColor: "group-hover:text-[#B45309]",
  },
  SPORTS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FFE4E6] hover:via-white hover:to-white hover:border-[#F43F5E]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(244,63,94,0.18)]",
    textColor: "group-hover:text-[#BE123C]",
  },
  VIRTUAL: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#CFFAFE] hover:via-white hover:to-white hover:border-[#06B6D4]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(6,182,212,0.18)]",
    textColor: "group-hover:text-[#0E7490]",
  },
  EXHIBITIONS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FCE7F3] hover:via-white hover:to-white hover:border-[#EC4899]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(236,72,153,0.18)]",
    textColor: "group-hover:text-[#BE185D]",
  },
  COMMUNITY: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#E0E7FF] hover:via-white hover:to-white hover:border-[#6366F1]/50",
    glow: "group-hover:shadow-[0_4px_14px_rgba(99,102,241,0.18)]",
    textColor: "group-hover:text-[#4338CA]",
  },
};

const DEFAULT_CATEGORY_STYLE = {
  hoverBg: "hover:bg-gradient-to-r hover:from-gray-100 hover:to-white hover:border-black/20",
  glow: "group-hover:shadow-sm",
  textColor: "group-hover:text-[#FF4E7A]",
};

export function HomePage() {
  const [events, setEvents] = useState(MOCK_EVENTS);
  const [trending, setTrending] = useState(MOCK_TRENDING);
  const [loading, setLoading] = useState(false);
  const [showQuestBanner, setShowQuestBanner] = useState(() => {
    return typeof window !== "undefined"
      ? sessionStorage.getItem("passqo_dismiss_quest") !== "true"
      : true;
  });
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const user = getUser();

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      api.events.list().catch(() => []),
      api.events.trending().catch(() => []),
    ])
      .then(([eventsData, trendingData]) => {
        if (!cancelled) {
          setEvents(Array.isArray(eventsData) ? eventsData : []);
          setTrending(Array.isArray(trendingData) ? trendingData : []);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const featuredEvents = events.filter((e) => e.isFeatured);
  // Ensure we show top featured events + an explicit no-image event in the hero so the user can inspect the fluid gradient styling
  const noImageEvent = events.find((e) => !e.image) || {
    id: "evt-acoustic-sunset",
    slug: "indie-acoustic-dublin-session",
    name: "Acoustic Sunset & Indie Melodies Showcase",
    category: "MUSIC_ENTERTAINMENT",
    format: "IN_PERSON",
    date: "2026-11-29T18:30:00.000Z",
    timezone: "Europe/Dublin",
    venue: "The Grand Social, Dublin",
    city: "Dublin",
    minPrice: 18,
    image: null,
    isFeatured: true,
    isBlockchain: true,
  };

  const hero = [
    ...featuredEvents.slice(0, 2),
    noImageEvent,
    ...featuredEvents.slice(2),
  ].slice(0, 4);

  return (
    <div className="min-h-screen bg-[#F5F0EB] pb-24 lg:pb-0 w-full max-w-full">
      <Navbar />

      {/* ── GAMIFIED FLOATING QUEST PILL (Centered full-width with same px-6 margins as bottom nav bar on mobile, right-aligned on desktop) ── */}
      {showQuestBanner && (
        <div className="fixed z-[150] inset-x-0 pointer-events-none px-6 lg:px-8 md:top-20 lg:top-22 bottom-[76px] sm:bottom-22 md:bottom-auto">
          <div className="max-w-[1120px] mx-auto flex justify-center md:justify-end w-full">
            <aside
              aria-label="Active Quest"
              className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-full py-2 px-4 shadow-[0_12px_36px_rgba(255,78,122,0.18)] border border-[#FFD5E0] flex items-center justify-between gap-2.5 sm:gap-3.5 w-full max-w-[480px] md:w-auto md:max-w-none animate-in fade-in slide-in-from-bottom-3 md:slide-in-from-top-3 duration-300 select-none"
            >
              {/* Left: Title + XP Badge in single line */}
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs sm:text-sm font-bold text-[#2C2738] truncate whitespace-nowrap">
                  Complete your profile
                </span>
                <span className="text-[10px] sm:text-[11px] font-extrabold text-[#FF4E7A] bg-[#FFF0F4] border border-[#FFD5E0] px-2 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                  +50 XP
                </span>
              </div>

              {/* Right: Start Action & Dismiss Button */}
              <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setIsEditProfileOpen(true)}
                  className="bg-[#FF4E7A] hover:bg-[#E03A64] text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-xs transition-all cursor-pointer active:scale-95 whitespace-nowrap"
                >
                  Start
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuestBanner(false);
                    sessionStorage.setItem("passqo_dismiss_quest", "true");
                  }}
                  className="w-6 h-6 rounded-full hover:bg-[#F5EFF2] text-[#8C8599] hover:text-[#2C2738] flex items-center justify-center transition-colors cursor-pointer flex-shrink-0"
                  aria-label="Dismiss quest notification"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* ── Hero carousel — sits seamlessly beneath fixed navbar ── */}
      {hero.length > 0 && (
        <div className="w-full">
          <HeroCarousel events={hero} />
        </div>
      )}

      <div className="max-w-[1280px] mx-auto px-5 sm:px-8 lg:px-10 space-y-6 lg:space-y-8 pt-4 lg:pt-6 pb-12 lg:pb-20">

        {/* 1. Quick Explore Filter Pills (Immediate intent filter directly beneath Hero) */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#6B6B80] font-label">
              Explore by Category
            </h2>
          </div>

          {/* ── MOBILE & TABLET: 2 Rows Draggable (< lg) ── */}
          <div className="lg:hidden w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] overflow-x-auto scrollbar-hide py-1 px-5 space-y-2.5 overscroll-x-auto">
            {/* Row 1 */}
            <div className="flex items-center gap-2.5 w-max pr-6">
              {BROWSE_CATEGORIES.filter((_, i) => i % 2 === 0).map((cat) => {
                const styles = CATEGORY_STYLES[cat.value] || DEFAULT_CATEGORY_STYLE;
                return (
                  <Link
                    key={cat.value}
                    to={`/events?category=${cat.value}`}
                    className={`
                      group h-[42px] w-auto inline-flex items-center gap-1.5
                      bg-white rounded-xl pl-3.5 pr-2 py-1 flex-shrink-0
                      overflow-hidden border border-black/8 shadow-2xs
                      transition-all duration-200 active:scale-95
                      ${styles.hoverBg} ${styles.glow}
                    `}
                  >
                    <span className={`text-xs font-bold text-[#1B1B23] whitespace-nowrap ${styles.textColor}`}>
                      {cat.label}
                    </span>
                    <div className="w-6 h-6 flex-shrink-0 pointer-events-none flex items-center justify-center">
                      <img
                        src={categoryImage(cat.value)}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Row 2 */}
            <div className="flex items-center gap-2.5 w-max pr-6">
              {BROWSE_CATEGORIES.filter((_, i) => i % 2 !== 0).map((cat) => {
                const styles = CATEGORY_STYLES[cat.value] || DEFAULT_CATEGORY_STYLE;
                return (
                  <Link
                    key={cat.value}
                    to={`/events?category=${cat.value}`}
                    className={`
                      group h-[42px] w-auto inline-flex items-center gap-1.5
                      bg-white rounded-xl pl-3.5 pr-2 py-1 flex-shrink-0
                      overflow-hidden border border-black/8 shadow-2xs
                      transition-all duration-200 active:scale-95
                      ${styles.hoverBg} ${styles.glow}
                    `}
                  >
                    <span className={`text-xs font-bold text-[#1B1B23] whitespace-nowrap ${styles.textColor}`}>
                      {cat.label}
                    </span>
                    <div className="w-6 h-6 flex-shrink-0 pointer-events-none flex items-center justify-center">
                      <img
                        src={categoryImage(cat.value)}
                        alt=""
                        aria-hidden="true"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* ── DESKTOP: Wrap Row (>= lg) ── */}
          <div className="hidden lg:flex flex-wrap items-center gap-2 sm:gap-2.5">
            {BROWSE_CATEGORIES.map((cat) => {
              const styles = CATEGORY_STYLES[cat.value] || DEFAULT_CATEGORY_STYLE;

              return (
                <Link
                  key={cat.value}
                  to={`/events?category=${cat.value}`}
                  className={`
                    group h-[42px] sm:h-[48px] lg:h-[52px]
                    w-auto inline-flex items-center gap-1.5 sm:gap-2
                    bg-white rounded-xl sm:rounded-2xl
                    pl-3 sm:pl-3.5 pr-1.5 sm:pr-2 py-1
                    overflow-hidden
                    border border-black/8 shadow-xs
                    transition-all duration-300 ease-out
                    hover:-translate-y-0.5 hover:shadow-md active:scale-[0.97]
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A]/40
                    ${styles.hoverBg} ${styles.glow}
                  `}
                >
                  <span className={`text-[11px] sm:text-[12px] lg:text-[13px] font-bold text-[#1B1B23] transition-all duration-200 group-hover:translate-x-0.5 whitespace-nowrap ${styles.textColor}`}>
                    {cat.label}
                  </span>

                  <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 flex-shrink-0 pointer-events-none flex items-center justify-center">
                    <img
                      src={categoryImage(cat.value)}
                      alt=""
                      aria-hidden="true"
                      className="w-full h-full object-contain transition-transform duration-300 ease-out animate-hover-live"
                    />
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* 2. Primary Location Relevance: Happening near you */}
        <TrendingSection initialTrending={trending} />

        {/* 3. Personalised Relevance (if logged in): Recommended For You */}
        <RecommendedSection />

        {/* 4. Social / Community Relevance: Followed Organisers */}
        <FollowedEventsSection />

        {/* 5. Comprehensive Discovery: All Events with dynamic toolbar & filters */}
        <AllEventsSection initialEvents={events} />

        {/* ── Empty state ─────────────────────────────────────── */}
        {!loading && events.length === 0 && (
          <div className="text-center py-24">
            <img
              src="/images/empty-states/nothing-here-yet.webp"
              alt=""
              aria-hidden="true"
              className="mx-auto w-full max-w-md mb-6"
            />
            <p className="text-[#1B1B23] font-bold text-lg mb-1">No events yet.</p>
            <p className="text-gray-500 font-medium">Be the first — host any kind of event on Passqo.</p>
          </div>
        )}
      </div>

      <Footer />
      <BottomNav />
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
      />
    </div>
  );
}

export default HomePage;

