import { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, LayoutGroup } from "framer-motion";
import {
  Music2,
  Layers,
  ShoppingBag,
  Info,
  User,
  Calendar,
  Award,
  Users,
  Utensils,
  BookOpen,
  HeartHandshake,
  Heart,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

import { LineupFeature } from "./LineupFeature";
import { ProfilesFeature } from "./ProfilesFeature";
import { StagesFeature } from "./StagesFeature";
import { AgendaFeature } from "./AgendaFeature";
import { CurriculumFeature } from "./CurriculumFeature";
import { TastingMenuFeature } from "./TastingMenuFeature";
import { TimedEntryFeature } from "./TimedEntryFeature";
import { SponsorsFeature } from "./SponsorsFeature";
import { MerchandiseFeature } from "./MerchandiseFeature";
import { NetworkingFeature } from "./NetworkingFeature";
import { DietaryAccessibilityFeature } from "./DietaryAccessibilityFeature";
import { DonationFeature } from "./DonationFeature";

export function EventFeatureTabs({ event, details }) {
  const category = event?.category || "MUSIC_ENTERTAINMENT";
  const scrollContainerRef = useRef(null);
  const rootContainerRef = useRef(null);
  const stickyBarRef = useRef(null);

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Build list of tabs strictly for features that the organiser has actually filled in!
  const availableTabs = useMemo(() => {
    const list = [];

    // 1. Lineup
    const hasLineup = Boolean(
      details?.lineup?.headliner ||
      (Array.isArray(details?.lineup?.supporting) && details.lineup.supporting.length > 0) ||
      (Array.isArray(event?.lineup) && event.lineup.length > 0)
    );
    if (hasLineup) {
      list.push({
        id: "lineup",
        label: "Artist Lineup",
        icon: Music2,
        component: <LineupFeature event={event} details={details} />,
      });
    }

    // 2. Profiles (Speakers / Instructors / Chefs / Curators)
    const profiles = details?.speakers || details?.instructors || details?.chefs || details?.curators;
    const hasProfiles = Array.isArray(profiles) && profiles.length > 0;
    if (hasProfiles) {
      let label = "Keynote Speakers";
      if (category === "MUSIC_ENTERTAINMENT") label = "Performers";
      else if (category === "HEALTH_WELLNESS") label = "Instructors";
      else if (category === "FOOD_DRINK") label = "Featured Chefs";
      else if (category === "EXHIBITIONS") label = "Curators & Artists";

      list.push({
        id: "profiles",
        label,
        icon: User,
        component: <ProfilesFeature event={event} details={details} />,
      });
    }

    // 3. Agenda / Schedule (Core Event Timeline)
    const hasSchedule = Boolean(
      (Array.isArray(details?.schedule?.days) && details.schedule.days.length > 0) ||
      (Array.isArray(details?.schedule) && details.schedule.length > 0) ||
      (Array.isArray(event?.schedule) && event.schedule.length > 0)
    );
    if (hasSchedule) {
      let label = "Schedule & Agenda";
      if (category === "SPORTS") label = "Match Schedule";
      else if (category === "COMMUNITY") label = "Meetup Flow";
      else if (category === "EDUCATION") label = "Class Timings";

      list.push({
        id: "agenda",
        label,
        icon: Calendar,
        component: <AgendaFeature event={event} details={details} />,
      });
    }

    // 4. Stages & Acoustic Zones (Venue Spatial Layout)
    const hasStages = Array.isArray(details?.stages) && details.stages.length > 0;
    if (hasStages) {
      list.push({
        id: "stages",
        label: "Stages & Zones",
        icon: Layers,
        component: <StagesFeature event={event} details={details} />,
      });
    }

    // 5. Curriculum & Syllabus (Workshops, Tech Bootcamps, Masterclasses)
    const hasCurriculum = Boolean(
      details?.curriculum ||
      details?.features?.curriculumSyllabus ||
      category === "EDUCATION"
    );
    if (hasCurriculum) {
      list.push({
        id: "curriculum",
        label: "Curriculum",
        icon: BookOpen,
        component: <CurriculumFeature event={event} details={details} />,
      });
    }

    // 6. Tasting Menu (Food & Drink, Wine Tastings, Supper Clubs)
    const hasTasting = Boolean(
      details?.tastingMenu ||
      details?.features?.tastingMenu ||
      category === "FOOD_DRINK"
    );
    if (hasTasting) {
      list.push({
        id: "tasting",
        label: "Tasting Menu",
        icon: Utensils,
        component: <TastingMenuFeature event={event} details={details} />,
      });
    }

    // 7. Timed Entry Slots (Exhibitions, Galleries, Immersive Arts)
    const hasTimedEntry = Boolean(
      details?.timedEntry ||
      details?.features?.timedEntrySlots ||
      category === "EXHIBITIONS"
    );
    if (hasTimedEntry) {
      list.push({
        id: "timedEntry",
        label: "Timed Slots",
        icon: Clock,
        component: <TimedEntryFeature event={event} details={details} />,
      });
    }

    // 8. Networking & B2B Matchmaking (Attendee Collaboration)
    const hasNetworking = Boolean(
      details?.networking ||
      details?.features?.b2bNetworking ||
      category === "BUSINESS_TECH"
    );
    if (hasNetworking) {
      list.push({
        id: "networking",
        label: "Networking & Corp",
        icon: Users,
        component: <NetworkingFeature event={event} details={details} />,
      });
    }

    // 9. Official Merchandise (Merch & Apparel)
    const hasMerch = Boolean(
      (Array.isArray(details?.merchandise) && details.merchandise.length > 0) ||
      details?.features?.merchandisePreorder
    );
    if (hasMerch) {
      list.push({
        id: "merchandise",
        label: "Official Merch",
        icon: ShoppingBag,
        component: <MerchandiseFeature event={event} details={details} />,
      });
    }

    // 10. Sponsors & Institutional Partners
    const hasSponsors = Boolean(
      (Array.isArray(details?.sponsors) && details.sponsors.length > 0) ||
      details?.features?.partnerSponsors ||
      event?.category === "BUSINESS_TECH"
    );
    if (hasSponsors) {
      list.push({
        id: "sponsors",
        label: "Partners & Sponsors",
        icon: Award,
        component: <SponsorsFeature event={event} details={details} />,
      });
    }

    // 11. Dietary & Venue Accessibility
    const hasDietaryAccess = Boolean(
      (Array.isArray(details?.dietaryOptions) && details.dietaryOptions.length > 0) ||
      (Array.isArray(details?.accessibility) && details.accessibility.length > 0) ||
      details?.features?.dietaryAndAccessibility
    );
    if (hasDietaryAccess) {
      list.push({
        id: "dietary",
        label: "Dietary & Access",
        icon: HeartHandshake,
        component: <DietaryAccessibilityFeature event={event} details={details} />,
      });
    }

    // 12. Community Support & Donations
    const hasDonations = Boolean(
      details?.features?.donationBasedTickets ||
      details?.donationTiers?.length > 0
    );
    if (hasDonations) {
      list.push({
        id: "donations",
        label: "Community Support",
        icon: Heart,
        component: <DonationFeature event={event} details={details} />,
      });
    }

    return list;
  }, [category, event, details]);

  const [activeTab, setActiveTab] = useState(availableTabs[0]?.id || "");

  const updateScrollState = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const maxScroll = el.scrollWidth - el.clientWidth;
    setCanScrollLeft(el.scrollLeft > 6);
    setCanScrollRight(maxScroll - el.scrollLeft > 6);
  };

  useEffect(() => {
    updateScrollState();
    window.addEventListener("resize", updateScrollState);
    return () => window.removeEventListener("resize", updateScrollState);
  }, [availableTabs]);

  const scrollByAmount = (amt) => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: amt, behavior: "smooth" });
    }
  };

  const handleTabSelect = (tabId, targetEl) => {
    setActiveTab(tabId);

    // Smoothly center the tab in the scroll container without any page shift or cutoff
    if (targetEl && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const targetRect = targetEl.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const scrollOffset =
        targetRect.left - containerRect.left - containerRect.width / 2 + targetRect.width / 2;
      container.scrollBy({ left: scrollOffset, behavior: "smooth" });
    }

    // Smoothly scroll the page so the section starts right below the main navbar
    if (rootContainerRef.current) {
      const rootDocTop = rootContainerRef.current.getBoundingClientRect().top + window.scrollY;
      const mainNavEl = document.getElementById("main-navbar");
      const navHeight = mainNavEl ? mainNavEl.offsetHeight : 56;

      const targetY = rootDocTop - navHeight;

      window.scrollTo({
        top: Math.max(0, targetY),
        behavior: "smooth",
      });
    }
  };

  const currentTab = availableTabs.find((t) => t.id === activeTab) || availableTabs[0];
  const activeIdx = availableTabs.findIndex((t) => t.id === currentTab?.id);

  // Chevron rules:
  // 1. If 3 or fewer tabs, NEVER show arrows (standard compact layout, everything fits)
  // 2. If first 2 tabs are selected (activeIdx <= 1), NEVER show left arrow
  // 3. If last 2 tabs are selected (activeIdx >= length - 2), NEVER show right arrow
  const hasMultiplePages = availableTabs.length > 3;
  const showLeftArrow = hasMultiplePages && canScrollLeft && activeIdx > 1;
  const showRightArrow = hasMultiplePages && canScrollRight && activeIdx < availableTabs.length - 2;

  if (availableTabs.length === 0) {
    return null;
  }

  return (
    <div ref={rootContainerRef} className="space-y-4 scroll-mt-28">
      {/* ── STICKY DOCK (100% PURE GLASS ONLY) ── */}
      <div
        ref={stickyBarRef}
        style={{ top: "var(--navbar-height, 56px)" }}
        className="sticky z-30 px-3 sm:px-6 py-2 flex justify-center transition-all duration-200"
      >
        {/* ── ULTRA-PREMIUM APPLE LIQUID GLASS CAPSULE ── */}
        <div className="relative max-w-full inline-flex items-center rounded-full bg-white/80 backdrop-blur-2xl backdrop-saturate-200 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.06),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] p-1">
          {/* Apple Left Chevron Button - Transparent Backside, hidden for first 2 tabs and <=3 tabs */}
          {showLeftArrow && (
            <button
              type="button"
              onClick={() => scrollByAmount(-220)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent hover:bg-black/5 active:bg-black/10 flex items-center justify-center text-[#1C1C26] active:scale-90 transition-all flex-shrink-0 cursor-pointer mr-0.5 z-20 group"
              aria-label="Scroll left"
            >
              <ChevronLeft className="w-4 h-4 stroke-[2.4] text-[#1C1C26] group-hover:-translate-x-0.5 transition-transform" />
            </button>
          )}

          {/* Inner Horizontal Track */}
          <LayoutGroup id="event-feature-tabs-pill">
            <div
              ref={scrollContainerRef}
              onScroll={updateScrollState}
              className="flex items-center overflow-x-auto scroll-smooth scrollbar-none no-scrollbar [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden max-w-full py-0 px-1 sm:px-1.5"
            >
              {availableTabs.map((tab, idx) => {
                const Icon = tab.icon;
                const isActive = currentTab?.id === tab.id;
                const nextIsActive = availableTabs[idx + 1]?.id === currentTab?.id;
                const showDivider = idx < availableTabs.length - 1 && !isActive && !nextIsActive;

                return (
                  <div key={tab.id} className="relative flex items-center flex-shrink-0">
                    <button
                      type="button"
                      onClick={(e) => handleTabSelect(tab.id, e.currentTarget)}
                      className={`group relative flex items-center gap-2 px-4 py-2 sm:px-4.5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors duration-200 cursor-pointer select-none active:scale-97 ${
                        isActive ? "text-white font-bold z-10" : "text-[#23232C] hover:text-black"
                      }`}
                    >
                      {/* Classic Liquid Pink Active Pill matching reference image - only animates when activeTab changes */}
                      {isActive && (
                        <motion.div
                          layoutId="activeFeaturePill"
                          layoutDependency={activeTab}
                          className="absolute inset-0 rounded-full bg-gradient-to-r from-[#FF2B60] via-[#FF4877] to-[#FF5E85] shadow-[0_4px_14px_rgba(255,46,99,0.32),inset_0_1.5px_2px_rgba(255,255,255,0.6),inset_0_-1px_1.5px_rgba(0,0,0,0.12)] overflow-hidden"
                          transition={{ type: "spring", stiffness: 420, damping: 32 }}
                        >
                          {/* Upper Curvature Glass Sheen Overlay */}
                          <div className="absolute inset-x-2 top-0.5 h-[48%] rounded-t-full bg-gradient-to-b from-white/45 via-white/10 to-transparent pointer-events-none" />
                        </motion.div>
                      )}

                      <Icon
                        className={`w-4 h-4 relative z-10 transition-transform duration-200 group-hover:scale-105 ${
                          isActive ? "text-white" : "text-[#23232C] group-hover:text-black"
                        }`}
                      />
                      <span className="relative z-10">{tab.label}</span>
                    </button>

                    {/* Clean Hairline Divider matching reference image */}
                    {showDivider && (
                      <div className="h-4 w-[1px] bg-black/10 mx-1 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </LayoutGroup>

          {/* Apple Right Chevron Button - Transparent Backside, hidden for last 2 tabs and <=3 tabs */}
          {showRightArrow && (
            <button
              type="button"
              onClick={() => scrollByAmount(220)}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-transparent hover:bg-black/5 active:bg-black/10 flex items-center justify-center text-[#1C1C26] active:scale-90 transition-all flex-shrink-0 cursor-pointer ml-0.5 z-20 group"
              aria-label="Scroll right"
            >
              <ChevronRight className="w-4 h-4 stroke-[2.4] text-[#1C1C26] group-hover:translate-x-0.5 transition-transform" />
            </button>
          )}
        </div>
      </div>

      {/* ── SMOOTH TAB SWITCHING ANIMATED CONTAINER ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentTab?.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          {currentTab?.component}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default EventFeatureTabs;
