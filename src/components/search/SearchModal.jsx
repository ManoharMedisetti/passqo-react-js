import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  LocateFixed,
  MapPin,
  Monitor,
  Search,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";
import { useSearchModal } from "@/context/SearchContext";
import { AnimatedSearchPlaceholder } from "@/components/ui/Navbar";
import { MOCK_EVENTS } from "@/lib/mockData";
import { EVENT_CATEGORIES, BROWSE_CATEGORIES, categoryImage } from "@/lib/eventCategories";
import { detectLocation, detectCoords, setCachedLocation, getCachedLocation, clearCachedLocation } from "@/lib/location";
import { inDateRange, matchesPrice } from "@/lib/eventFilters";

// Category color styling dictionary mirroring HomePage.jsx
const CATEGORY_STYLES = {
  MUSIC_ENTERTAINMENT: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FFE4EC] hover:via-white hover:to-white hover:border-[#FF4E7A]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(255,78,122,0.22)]",
    textColor: "group-hover:text-[#E11D48]",
    selectedBg: "bg-gradient-to-r from-[#FFE4EC] via-white to-white border-[#FF4E7A] shadow-[0_4px_16px_rgba(255,78,122,0.22)] ring-2 ring-[#FF4E7A]/30",
    selectedText: "text-[#E11D48]",
  },
  BUSINESS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#DBEAFE] hover:via-white hover:to-white hover:border-[#3B82F6]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(59,130,246,0.22)]",
    textColor: "group-hover:text-[#1D4ED8]",
    selectedBg: "bg-gradient-to-r from-[#DBEAFE] via-white to-white border-[#3B82F6] shadow-[0_4px_16px_rgba(59,130,246,0.22)] ring-2 ring-[#3B82F6]/30",
    selectedText: "text-[#1D4ED8]",
  },
  EDUCATION: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#D1FAE5] hover:via-white hover:to-white hover:border-[#10B981]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(16,185,129,0.22)]",
    textColor: "group-hover:text-[#047857]",
    selectedBg: "bg-gradient-to-r from-[#D1FAE5] via-white to-white border-[#10B981] shadow-[0_4px_16px_rgba(16,185,129,0.22)] ring-2 ring-[#10B981]/30",
    selectedText: "text-[#047857]",
  },
  HEALTH_WELLNESS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#EDE9FE] hover:via-white hover:to-white hover:border-[#8B5CF6]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(139,92,246,0.22)]",
    textColor: "group-hover:text-[#6D28D9]",
    selectedBg: "bg-gradient-to-r from-[#EDE9FE] via-white to-white border-[#8B5CF6] shadow-[0_4px_16px_rgba(139,92,246,0.22)] ring-2 ring-[#8B5CF6]/30",
    selectedText: "text-[#6D28D9]",
  },
  FOOD_DRINK: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FEF3C7] hover:via-white hover:to-white hover:border-[#F59E0B]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(245,158,11,0.22)]",
    textColor: "group-hover:text-[#B45309]",
    selectedBg: "bg-gradient-to-r from-[#FEF3C7] via-white to-white border-[#F59E0B] shadow-[0_4px_16px_rgba(245,158,11,0.22)] ring-2 ring-[#F59E0B]/30",
    selectedText: "text-[#B45309]",
  },
  SPORTS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FFE4E6] hover:via-white hover:to-white hover:border-[#F43F5E]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(244,63,94,0.22)]",
    textColor: "group-hover:text-[#BE123C]",
    selectedBg: "bg-gradient-to-r from-[#FFE4E6] via-white to-white border-[#F43F5E] shadow-[0_4px_16px_rgba(244,63,94,0.22)] ring-2 ring-[#F43F5E]/30",
    selectedText: "text-[#BE123C]",
  },
  VIRTUAL: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#CFFAFE] hover:via-white hover:to-white hover:border-[#06B6D4]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(6,182,212,0.22)]",
    textColor: "group-hover:text-[#0E7490]",
    selectedBg: "bg-gradient-to-r from-[#CFFAFE] via-white to-white border-[#06B6D4] shadow-[0_4px_16px_rgba(6,182,212,0.22)] ring-2 ring-[#06B6D4]/30",
    selectedText: "text-[#0E7490]",
  },
  EXHIBITIONS: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#FCE7F3] hover:via-white hover:to-white hover:border-[#EC4899]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(236,72,153,0.22)]",
    textColor: "group-hover:text-[#BE185D]",
    selectedBg: "bg-gradient-to-r from-[#FCE7F3] via-white to-white border-[#EC4899] shadow-[0_4px_16px_rgba(236,72,153,0.22)] ring-2 ring-[#EC4899]/30",
    selectedText: "text-[#BE185D]",
  },
  COMMUNITY: {
    hoverBg: "hover:bg-gradient-to-r hover:from-[#E0E7FF] hover:via-white hover:to-white hover:border-[#6366F1]/50",
    glow: "group-hover:shadow-[0_8px_20px_rgba(99,102,241,0.22)]",
    textColor: "group-hover:text-[#4338CA]",
    selectedBg: "bg-gradient-to-r from-[#E0E7FF] via-white to-white border-[#6366F1] shadow-[0_4px_16px_rgba(99,102,241,0.22)] ring-2 ring-[#6366F1]/30",
    selectedText: "text-[#4338CA]",
  },
};

// 4 Primary featured categories shown on top
const TOP_4_CATEGORIES = [
  { value: "MUSIC_ENTERTAINMENT", label: "Music and Entertainment" },
  { value: "BUSINESS", label: "Business" },
  { value: "EDUCATION", label: "Education" },
  { value: "HEALTH_WELLNESS", label: "Health and Wellness" },
];

// 10 Popular Cities matching user's exact assets in public/images/locations
const POPULAR_CITIES = [
  { name: "Dublin", image: "/images/locations/dublin.png" },
  { name: "Cork", image: "/images/locations/cork.png" },
  { name: "Galway", image: "/images/locations/galway.png" },
  { name: "Limerick", image: "/images/locations/limerick.png" },
  { name: "Waterford", image: "/images/locations/waterford.png" },
  { name: "Drogheda", image: "/images/locations/drogheda.png" },
  { name: "Dundalk", image: "/images/locations/Dundalk.png" },
  { name: "Swords", image: "/images/locations/Swords.png" },
  { name: "Kilkenny", image: "/images/locations/Kilkenny.png" },
  { name: "Bray", image: "/images/locations/Bray.png" },
];

const ALPHABET_CITIES_MAP = {
  A: ["Amsterdam", "Athlone", "Arklow", "Antrim", "Athenry", "Ashbourne", "Ardee", "Athens", "Antwerp", "Avignon"],
  B: ["Belfast", "Bray", "Ballina", "Bandon", "Birr", "Buncrana", "Ballybofey", "Berlin", "Barcelona", "Brussels", "Budapest"],
  C: ["Cork", "Carlow", "Castlebar", "Cavan", "Clonmel", "Cobh", "Copenhagen", "Cologne", "Cambridge"],
  D: ["Dublin", "Drogheda", "Dundalk", "Dún Laoghaire", "Donegal", "Dingle", "Derry", "Dubrovnik"],
  E: ["Ennis", "Enniscorthy", "Edenderry", "Edinburgh", "Eindhoven"],
  F: ["Fermoy", "Foxford", "Florence", "Frankfurt"],
  G: ["Galway", "Gorey", "Greystones", "Geneva", "Ghent", "Glasgow"],
  H: ["Howth", "Headford", "Hamburg", "Helsinki"],
  I: ["Inishowen", "Inverin", "Innsbruck", "Interlaken"],
  J: ["Johnstown", "Jerez"],
  K: ["Kilkenny", "Killarney", "Kinsale", "Kildare", "Krakow"],
  L: ["Limerick", "Letterkenny", "Longford", "Listowel", "London", "Lisbon", "Lyon", "Leuven"],
  M: ["Mullingar", "Mallow", "Monaghan", "Maynooth", "Madrid", "Milan", "Munich", "Marseille"],
  N: ["Navan", "Naas", "Newbridge", "Nenagh", "Nice", "Naples"],
  O: ["Omagh", "Oranmore", "Oslo", "Oxford"],
  P: ["Portlaoise", "Portrush", "Paris", "Prague", "Porto"],
  Q: ["Queenstown", "Quimper"],
  R: ["Roscommon", "Rathmines", "Rome", "Rotterdam", "Reykjavik"],
  S: ["Sligo", "Swords", "Shannon", "Skibbereen", "Seville", "Stockholm", "Salzburg"],
  T: ["Tralee", "Tullamore", "Tipperary", "Thurles", "Toulouse", "Turin"],
  U: ["Unionhall", "Utrecht"],
  V: ["Valentia", "Vienna", "Venice", "Valencia"],
  W: ["Waterford", "Westport", "Wexford", "Wicklow", "Warsaw"],
  X: ["Xanthi"],
  Y: ["Youghal"],
  Z: ["Zurich", "Zagreb", "Zillertal"],
};

const ALPHABET_LIST = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

const MAP_PIN_POSITIONS = [
  { x: 142, y: 115 },
  { x: 178, y: 155 },
  { x: 105, y: 145 },
  { x: 195, y: 100 },
];

// Master candidate events pool for Ireland & Europe with dynamic calendar dates
const _NOW = Date.now();
const _DAY = 86400000;

const ALL_CANDIDATE_EVENTS = [
  {
    id: "marieta-comic-con",
    slug: "marieta-comic-con",
    name: "Marièta Live Music & Showcase",
    venue: "Unit no. T2 102, Two Rock",
    city: "Dublin",
    format: "IN_PERSON",
    minPrice: 12,
    priceLabel: "From € 12",
    timeLabel: "4:00 PM onwards",
    image: "/images/figma-sample/goa/performance.png",
    date: new Date(_NOW).toISOString(),
    isToday: true,
    isTomorrow: false,
    category: "MUSIC_ENTERTAINMENT",
    isAccessible: true,
    isAccredited: false,
    isBlockchain: true,
    distanceKm: 4.2,
  },
  {
    id: "cheers-and-tears",
    slug: "social-mixer-dublin",
    name: "Cheers & Tears Dublin Mixer",
    venue: "Grafton Street Social Club",
    city: "Dublin",
    format: "IN_PERSON",
    minPrice: 0,
    priceLabel: "Free entry",
    timeLabel: "5:00 PM onwards",
    image: "/images/figma-sample/goa/gallery-3.png",
    date: new Date(_NOW).toISOString(),
    isToday: true,
    isTomorrow: false,
    category: "COMMUNITY",
    isAccessible: true,
    isAccredited: true,
    isBlockchain: false,
    distanceKm: 2.1,
  },
  {
    id: "dublin-tomorrow-tech",
    slug: "dublin-ai-founders-breakfast",
    name: "Dublin AI & Web3 Founders Breakfast",
    venue: "The Digital Hub, Thomas Street",
    city: "Dublin",
    format: "IN_PERSON",
    minPrice: 15,
    priceLabel: "From € 15",
    timeLabel: "Tomorrow, 9:30 AM",
    image: "/images/figma-sample/goa/goa-hero.png",
    date: new Date(_NOW + _DAY).toISOString(),
    isToday: false,
    isTomorrow: true,
    category: "BUSINESS",
    isAccessible: true,
    isAccredited: true,
    isBlockchain: true,
    distanceKm: 3.8,
  },
  {
    id: "cork-tomorrow-comedy",
    slug: "cork-standup-night",
    name: "Cork Comedy Club: Standup Showcase",
    venue: "Everyman Theatre, Cork",
    city: "Cork",
    format: "IN_PERSON",
    minPrice: 0,
    priceLabel: "Free entry",
    timeLabel: "Tomorrow, 8:00 PM",
    image: "/images/figma-sample/goa/performance.png",
    date: new Date(_NOW + _DAY).toISOString(),
    isToday: false,
    isTomorrow: true,
    category: "MUSIC_ENTERTAINMENT",
    isAccessible: true,
    isAccredited: false,
    isBlockchain: false,
    distanceKm: 6.5,
  },
  {
    id: "dublin-bay-electronic",
    slug: "dublin-bay-electronic-festival",
    name: "Dublin Bay Electronic Music Festival",
    venue: "3Arena & Docklands, Dublin",
    city: "Dublin",
    format: "IN_PERSON",
    minPrice: 49,
    priceLabel: "From € 49",
    timeLabel: "This weekend, 7:00 PM",
    image: "/images/figma-sample/goa/goa-hero.png",
    date: new Date(_NOW + _DAY * 2).toISOString(),
    isToday: false,
    isTomorrow: false,
    category: "MUSIC_ENTERTAINMENT",
    isAccessible: true,
    isAccredited: true,
    isBlockchain: true,
    distanceKm: 3.5,
  },
  {
    id: "leinster-karting",
    slug: "leinster-karting-championship",
    name: "Leinster Karting Championship 2026",
    venue: "Mondello Park Circuit, Kildare",
    city: "Dublin",
    format: "IN_PERSON",
    minPrice: 35,
    priceLabel: "From € 35",
    timeLabel: "This weekend, 2:00 PM",
    image: "/images/figma-sample/goa/performance.png",
    date: new Date(_NOW + _DAY * 3).toISOString(),
    isToday: false,
    isTomorrow: false,
    category: "SPORTS",
    isAccessible: true,
    isAccredited: false,
    isBlockchain: false,
    distanceKm: 14.0,
  },
  {
    id: "galway-arts-fest",
    slug: "galway-indie-film-gala",
    name: "Galway Indie Arts & Film Gala",
    venue: "Town Hall Theatre, Galway",
    city: "Galway",
    format: "IN_PERSON",
    minPrice: 20,
    priceLabel: "From € 20",
    timeLabel: "This weekend, 6:30 PM",
    image: "/images/figma-sample/goa/gallery-3.png",
    date: new Date(_NOW + _DAY * 2).toISOString(),
    isToday: false,
    isTomorrow: false,
    category: "EXHIBITIONS",
    isAccessible: true,
    isAccredited: true,
    isBlockchain: true,
    distanceKm: 5.0,
  },
  {
    id: "limerick-online-summit",
    slug: "limerick-remote-dev-summit",
    name: "European Remote Dev & Cloud Summit",
    venue: "Virtual Live Stream",
    city: "Limerick",
    format: "ONLINE",
    minPrice: 0,
    priceLabel: "Free online ticket",
    timeLabel: "Tomorrow, 10:00 AM",
    image: "/images/figma-sample/goa/performance.png",
    date: new Date(_NOW + _DAY).toISOString(),
    isToday: false,
    isTomorrow: true,
    category: "EDUCATION",
    isAccessible: true,
    isAccredited: true,
    isBlockchain: true,
    distanceKm: 1.0,
  },
  {
    id: "belfast-food-trail",
    slug: "belfast-street-food-market",
    name: "Belfast Artisan Food & Craft Trail",
    venue: "St George's Market, Belfast",
    city: "Belfast",
    format: "HYBRID",
    minPrice: 10,
    priceLabel: "From £ 10",
    timeLabel: "This Saturday, 11:00 AM",
    image: "/images/figma-sample/goa/gallery-3.png",
    date: new Date(_NOW + _DAY * 4).toISOString(),
    isToday: false,
    isTomorrow: false,
    category: "FOOD_DRINK",
    isAccessible: true,
    isAccredited: false,
    isBlockchain: true,
    distanceKm: 8.0,
  },
  {
    id: "galway-sunset-sessions",
    slug: "galway-sunset-sessions",
    name: "Galway Bay Sunset Acoustic Sessions",
    venue: "Salthill Promenade, Galway",
    city: "Galway",
    format: "IN_PERSON",
    minPrice: 0,
    priceLabel: "Free entry",
    timeLabel: "Today, 6:00 PM",
    image: "/images/figma-sample/goa/goa-hero.png",
    date: new Date(_NOW).toISOString(),
    isToday: true,
    isTomorrow: false,
    category: "MUSIC_ENTERTAINMENT",
    isAccessible: true,
    isAccredited: false,
    isBlockchain: true,
    distanceKm: 2.4,
  },
  {
    id: "limerick-yoga-mindfulness",
    slug: "limerick-yoga-mindfulness",
    name: "River Shannon Morning Yoga & Wellness",
    venue: "Arthur's Quay Park, Limerick",
    city: "Limerick",
    format: "IN_PERSON",
    minPrice: 12,
    priceLabel: "From € 12",
    timeLabel: "Today, 8:30 AM",
    image: "/images/figma-sample/goa/performance.png",
    date: new Date(_NOW).toISOString(),
    isToday: true,
    isTomorrow: false,
    category: "HEALTH_WELLNESS",
    isAccessible: true,
    isAccredited: true,
    isBlockchain: false,
    distanceKm: 3.1,
  },
  {
    id: "waterford-tech-meetup",
    slug: "waterford-tech-meetup",
    name: "South-East Tech & Innovation Meetup",
    venue: "Waterford Crystal Hub, Waterford",
    city: "Waterford",
    format: "HYBRID",
    minPrice: 0,
    priceLabel: "Free entry",
    timeLabel: "Tomorrow, 6:30 PM",
    image: "/images/figma-sample/goa/gallery-3.png",
    date: new Date(_NOW + _DAY).toISOString(),
    isToday: false,
    isTomorrow: true,
    category: "BUSINESS",
    isAccessible: true,
    isAccredited: true,
    isBlockchain: true,
    distanceKm: 4.8,
  },
];

export function SearchModal() {
  const { isOpen, closeSearch, searchQuery, setSearchQuery, viewMode, setViewMode } = useSearchModal();
  const navigate = useNavigate();

  const [city, setCity] = useState("Dublin");
  const [locationSearchQuery, setLocationSearchQuery] = useState("");
  const [selectedLetter, setSelectedLetter] = useState("A");

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [dateFilter, setDateFilter] = useState(null); // 'today' | 'tomorrow' | 'week' | 'month' | null (No date auto-selected by default)
  const [under10Km, setUnder10Km] = useState(false);
  const [formatFilter, setFormatFilter] = useState("all"); // 'all' | 'offline' | 'online' | 'hybrid'
  const [priceFilter, setPriceFilter] = useState("all"); // 'all' | 'free' | 'paid'
  const [locationQuery, setLocationQuery] = useState("");
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [accreditedOnly, setAccreditedOnly] = useState(false);
  const [blockchainOnly, setBlockchainOnly] = useState(false);

  // UI States
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null); // 'format' | 'price' | null
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [locatingCurrent, setLocatingCurrent] = useState(false);
  const [hoveredEventId, setHoveredEventId] = useState(null);

  // Track visual viewport height to adapt immediately when tablet on-screen keyboard opens
  const [visualHeight, setVisualHeight] = useState(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const updateHeight = () => {
      if (window.visualViewport) {
        setVisualHeight(window.visualViewport.height);
      } else {
        setVisualHeight(window.innerHeight);
      }
    };

    updateHeight();
    window.visualViewport?.addEventListener("resize", updateHeight);
    window.visualViewport?.addEventListener("scroll", updateHeight);
    window.addEventListener("resize", updateHeight);

    return () => {
      window.visualViewport?.removeEventListener("resize", updateHeight);
      window.visualViewport?.removeEventListener("scroll", updateHeight);
      window.removeEventListener("resize", updateHeight);
    };
  }, [isOpen]);

  const inputRef = useRef(null);
  const locationInputRef = useRef(null);
  const modalRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const mobileCitiesScrollRef = useRef(null);

  // Auto-detect user city or fallback to Dublin (Irish & European cities only)
  useEffect(() => {
    const cached = getCachedLocation();
    const isIrishOrEuropean = cached?.city && Object.values(ALPHABET_CITIES_MAP).flat().some(
      (c) => c.toLowerCase() === cached.city.toLowerCase()
    );
    if (isIrishOrEuropean) {
      setCity(cached.city);
    } else {
      clearCachedLocation();
      setCity("Dublin");
    }
  }, []);

  // Auto-focus search input in search view, or auto-focus & select location input in location view across all screens
  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollLeft = 0;
    }
    if (isOpen && !isMoreFiltersOpen) {
      if (viewMode === "location") {
        setTimeout(() => {
          locationInputRef.current?.focus();
          locationInputRef.current?.setSelectionRange(0, 0);
        }, 120);
      } else if (viewMode === "search") {
        setTimeout(() => {
          inputRef.current?.focus();
          if (!searchQuery) {
            inputRef.current?.setSelectionRange(0, 0);
          }
        }, 120);
      }
    }
  }, [isOpen, viewMode, isMoreFiltersOpen]);

  // Dynamic Scrollspy: animates active alphabet letter (A to Z) as user scrolls through city sections
  useEffect(() => {
    if (viewMode !== "location") return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const letters = ALPHABET_LIST.filter((l) => (ALPHABET_CITIES_MAP[l] || []).length > 0);
      const containerRect = container.getBoundingClientRect();
      const triggerY = containerRect.top + 95;

      let found = null;
      for (let i = letters.length - 1; i >= 0; i--) {
        const el = document.getElementById(`mobile-city-letter-${letters[i]}`);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= triggerY) {
            found = letters[i];
            break;
          }
        }
      }
      setSelectedLetter(found || "A");
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [viewMode]);

  // Lock background body scroll completely when the modal is open
  useEffect(() => {
    if (isOpen) {
      const scrollY = window.scrollY;
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      const originalTop = document.body.style.top;
      const originalWidth = document.body.style.width;

      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";

      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
        document.body.style.top = originalTop;
        document.body.style.width = originalWidth;
        window.scrollTo(0, scrollY);
      };
    }
  }, [isOpen]);

  // Handle smooth closing animation via Framer Motion AnimatePresence
  const handleCloseModal = () => {
    closeSearch();
    setIsMoreFiltersOpen(false);
    setActiveDropdown(null);
  };

  // Close dropdowns on outside click using data-dropdown
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (activeDropdown && !e.target.closest("[data-dropdown]")) {
        setActiveDropdown(null);
      }
      if (isMoreFiltersOpen && window.innerWidth >= 1024 && !e.target.closest('[data-dropdown="more"]')) {
        setIsMoreFiltersOpen(false);
      }
    };
    if (activeDropdown || isMoreFiltersOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      document.addEventListener("touchstart", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("touchstart", handleOutsideClick);
    };
  }, [activeDropdown, isMoreFiltersOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (isMoreFiltersOpen) {
          setIsMoreFiltersOpen(false);
        } else if (activeDropdown) {
          setActiveDropdown(null);
        } else if (viewMode === "location") {
          setViewMode("search");
        } else {
          handleCloseModal();
        }
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, activeDropdown, viewMode, isMoreFiltersOpen]);

  // Rendering is managed reactively by AnimatePresence based on isOpen

  // Check if user has active filters
  const hasUserFiltered =
    searchQuery.trim().length > 0 ||
    selectedCategory !== null ||
    formatFilter !== "all" ||
    priceFilter !== "all" ||
    (dateFilter !== null && dateFilter !== "any") ||
    under10Km ||
    locationQuery.trim().length > 0 ||
    accessibleOnly ||
    accreditedOnly ||
    blockchainOnly;

  // Active advanced filters count for the "More filters" button badge
  const advancedFilterCount =
    (accessibleOnly ? 1 : 0) +
    (accreditedOnly ? 1 : 0) +
    (blockchainOnly ? 1 : 0);

  // Total active search filters for the mobile "More filters" button badge
  const totalSearchFiltersCount =
    (dateFilter ? 1 : 0) +
    (under10Km ? 1 : 0) +
    (formatFilter !== "all" ? 1 : 0) +
    (priceFilter !== "all" ? 1 : 0) +
    (selectedCategory ? 1 : 0) +
    (accessibleOnly ? 1 : 0) +
    (accreditedOnly ? 1 : 0) +
    (blockchainOnly ? 1 : 0);

  // Dynamic Event Filtering based on every active criteria operating on the exact same dataset
  const filteredEvents = ALL_CANDIDATE_EVENTS.filter((event) => {
    // 1. Text Search Query (matches event title, venue, city, artist, or category)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchName = event.name?.toLowerCase().includes(q);
      const matchVenue = event.venue?.toLowerCase().includes(q);
      const matchCity = event.city?.toLowerCase().includes(q);
      const matchCategory =
        event.category?.toLowerCase().includes(q) ||
        EVENT_CATEGORIES.find((c) => c.value === event.category)?.label?.toLowerCase().includes(q);
      const matchArtist = event.artist?.name?.toLowerCase().includes(q);
      if (!matchName && !matchVenue && !matchCity && !matchCategory && !matchArtist) return false;
    }

    // 2. Category Filter (operates on the same dataset)
    if (selectedCategory && event.category !== selectedCategory) {
      return false;
    }

    // 3. Format Filter
    if (formatFilter === "offline" || formatFilter === "IN_PERSON") {
      if (event.format !== "IN_PERSON" && event.format !== "offline") return false;
    } else if (formatFilter === "online" || formatFilter === "ONLINE") {
      if (event.format !== "ONLINE" && event.format !== "online") return false;
    } else if (formatFilter === "hybrid" || formatFilter === "HYBRID") {
      if (event.format !== "HYBRID" && event.format !== "hybrid") return false;
    }

    // 4. Price Filter
    if (priceFilter === "free" && event.minPrice > 0) return false;
    if (priceFilter === "paid" && event.minPrice === 0) return false;

    // 5. Date Filter
    if (dateFilter === "today") {
      if (!event.isToday && !inDateRange(event, "today")) return false;
    } else if (dateFilter === "tomorrow") {
      if (!event.isTomorrow && !inDateRange(event, "tomorrow")) return false;
    } else if (dateFilter === "week") {
      if (!inDateRange(event, "week")) return false;
    } else if (dateFilter === "month") {
      if (!inDateRange(event, "month")) return false;
    }

    // 6. Under 10 Km Filter
    if (under10Km) {
      if (event.distanceKm && event.distanceKm > 10) return false;
    }

    // 7. Locality / Location Query
    if (locationQuery.trim() && !searchQuery.trim()) {
      const lq = locationQuery.toLowerCase().trim();
      const matchCity = event.city?.toLowerCase().includes(lq);
      const matchVenue = event.venue?.toLowerCase().includes(lq);
      if (!matchCity && !matchVenue) return false;
    }

    // 8. Advanced Special Feature Toggles
    if (accessibleOnly && !event.isAccessible) return false;
    if (accreditedOnly && !event.isAccredited) return false;
    if (blockchainOnly && !event.isBlockchain) return false;

    return true;
  });

  const handleEventClick = (event) => {
    handleCloseModal();
    navigate(`/events/${event.slug || event.id}`);
  };

  const handleCitySelect = (selectedCity) => {
    setCity(selectedCity);
    setCachedLocation(selectedCity);
    setLocationQuery(selectedCity);
    setViewMode("search");
  };

  const handleUseCurrentLocation = async () => {
    setLocatingCurrent(true);
    try {
      const coords = await detectCoords();
      if (coords) {
        const loc = await detectLocation();
        const isIrishOrEuropean = loc?.city && Object.values(ALPHABET_CITIES_MAP).flat().some(
          (c) => c.toLowerCase() === loc.city.toLowerCase()
        );
        if (isIrishOrEuropean) {
          handleCitySelect(loc.city);
        } else {
          handleCitySelect("Dublin");
        }
      } else {
        handleCitySelect("Dublin");
      }
    } catch {
      handleCitySelect("Dublin");
    } finally {
      setLocatingCurrent(false);
    }
  };

  // Reset all filters back to default
  const handleResetFilters = () => {
    setSelectedCategory(null);
    setDateFilter(null);
    setUnder10Km(false);
    setFormatFilter("all");
    setPriceFilter("all");
    setLocationQuery("");
    setAccessibleOnly(false);
    setAccreditedOnly(false);
    setBlockchainOnly(false);
    setSearchQuery("");
    setActiveDropdown(null);
    setIsMoreFiltersOpen(false);
  };

  // Category click toggles category filter independently from the search text input
  const handleCategoryClick = (categoryValue) => {
    setSelectedCategory((prev) => (prev === categoryValue ? null : categoryValue));
  };

  // Navigates to dedicated EventsPage maintaining ALL active filters with smooth fade/expand close
  const handleViewMore = () => {
    const params = new URLSearchParams();
    if (selectedCategory) params.set("category", selectedCategory);
    if (priceFilter !== "all") params.set("price", priceFilter);
    if (formatFilter !== "all") {
      const mappedFormat =
        formatFilter === "offline" ? "IN_PERSON" :
        formatFilter === "online" ? "ONLINE" :
        formatFilter === "hybrid" ? "HYBRID" : formatFilter;
      params.set("format", mappedFormat);
    }
    if (dateFilter && dateFilter !== "any") params.set("date", dateFilter);
    if (under10Km) params.set("nearMe", "true");
    if (locationQuery.trim()) params.set("location", locationQuery.trim());
    else if (city && city !== "Dublin") params.set("location", city);

    if (searchQuery.trim()) {
      let q = searchQuery.trim();
      if (q.includes(":")) {
        const afterColon = q.split(":").slice(1).join(":").trim();
        if (afterColon) {
          params.set("q", afterColon);
        }
      } else {
        params.set("q", q);
      }
    }

    if (accessibleOnly) params.set("accessible", "true");
    if (accreditedOnly) params.set("accredited", "true");
    if (blockchainOnly) params.set("blockchain", "true");

    const qs = params.toString();
    const targetUrl = qs ? `/events?${qs}` : "/events";

    // Smoothly fade/expand close the modal and navigate to display results
    closeSearch();
    setIsMoreFiltersOpen(false);
    setActiveDropdown(null);
    navigate(targetUrl);
  };

  // Filter cities in location view based on query
  const filteredPopularCities = POPULAR_CITIES.filter((c) =>
    c.name.toLowerCase().includes(locationSearchQuery.toLowerCase().trim())
  );

  // Desktop All Cities: if searching, show matches; else if letter selected, show that letter's cities; else all
  const desktopCitiesList = locationSearchQuery.trim()
    ? Object.values(ALPHABET_CITIES_MAP)
        .flat()
        .filter((c) => c.toLowerCase().includes(locationSearchQuery.toLowerCase().trim()))
    : selectedLetter
    ? (ALPHABET_CITIES_MAP[selectedLetter] || [])
    : Object.values(ALPHABET_CITIES_MAP).flat();

  // Mobile search matches when locationSearchQuery is active
  const mobileFilteredSearchCities = locationSearchQuery.trim()
    ? Object.values(ALPHABET_CITIES_MAP)
        .flat()
        .filter((c) => c.toLowerCase().includes(locationSearchQuery.toLowerCase().trim()))
    : [];

  // Mobile alphabet scrubber click handler: smooth scroll to letter section in main scroll container
  const handleMobileLetterClick = (letter) => {
    setSelectedLetter(letter);
    const target = document.getElementById(`mobile-city-letter-${letter}`);
    const container = scrollContainerRef.current;
    if (target && container) {
      const containerTop = container.getBoundingClientRect().top;
      const targetTop = target.getBoundingClientRect().top;
      const offset = targetTop - containerTop + container.scrollTop - 40;
      container.scrollTo({ top: Math.max(0, offset), behavior: "smooth" });
    }
  };

  // Labels for dropdown buttons
  const formatFilterLabel =
    formatFilter === "all" ? "Format" :
    formatFilter === "offline" || formatFilter === "IN_PERSON" ? "Offline" :
    formatFilter === "online" || formatFilter === "ONLINE" ? "Online" :
    formatFilter === "hybrid" || formatFilter === "HYBRID" ? "Hybrid" : "Format";

  const priceFilterLabel =
    priceFilter === "all" ? "Price" :
    priceFilter === "free" ? "Free" :
    priceFilter === "paid" ? "Paid" : "Price";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed inset-0 z-[200] flex items-center justify-center lg:p-6 xl:p-8 overflow-y-auto overscroll-contain bg-[#F8F5F0] lg:bg-transparent"
          style={
            typeof window !== "undefined" && window.innerWidth < 1024 && visualHeight
              ? { height: `${visualHeight}px`, overscrollBehavior: "contain" }
              : { overscrollBehavior: "contain" }
          }
        >
          {/* Frosted Glass Backdrop (Desktop >= lg) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 bg-black/60 backdrop-blur-md cursor-pointer hidden lg:block"
            onClick={handleCloseModal}
            aria-hidden="true"
          />

          {/* Main Search Modal Card (Full-screen on mobile < lg, Centered Floating Popup on desktop >= lg) */}
          <motion.div
            ref={modalRef}
            initial={{
              opacity: 0,
              scale: 0.96,
              y: -16,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              transition: {
                type: "spring",
                stiffness: 420,
                damping: 30,
                mass: 0.7,
              },
            }}
            exit={{
              opacity: 0,
              scale: 0.96,
              y: -16,
              transition: {
                duration: 0.18,
                ease: [0.16, 1, 0.3, 1],
              },
            }}
            style={
              typeof window !== "undefined" && window.innerWidth < 1024 && visualHeight
                ? { height: `${visualHeight}px` }
                : undefined
            }
            className="
              relative w-full lg:max-w-2xl bg-[#F8F5F0] rounded-none lg:rounded-[32px]
              border-0 lg:border lg:border-white/80 shadow-none lg:shadow-[0_24px_64px_rgba(0,0,0,0.22),0_8px_24px_rgba(0,0,0,0.08)]
              h-[100dvh] lg:h-[88vh] lg:max-h-[720px] min-h-0
              flex flex-col overflow-hidden z-10 transition-all my-auto
            "
          >
            {/* ── TOP BAR (Fixed at top - Never scrolls away) ── */}
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.2, ease: "easeOut" }}
              className={`flex-shrink-0 px-3.5 sm:px-5 lg:px-6 ${viewMode === "location" ? "pt-2 pb-1.5 sm:pt-2.5 sm:pb-2" : "py-2.5 sm:py-3"} border-b border-black/[0.06] bg-[#F8F5F0]/98 backdrop-blur-md z-30`}
            >
              {/* UNIFIED ROW 1: SAME ACROSS BOTH SEARCH AND LOCATION MODES */}
              <div className="flex items-center gap-2 sm:gap-2.5 w-full">
                {/* Location Selector Pill */}
                <button
                  type="button"
                  onClick={() => {
                    if (viewMode === "location") {
                      setViewMode("search");
                    } else {
                      setViewMode("location");
                      setTimeout(() => {
                        locationInputRef.current?.focus();
                        locationInputRef.current?.setSelectionRange(0, 0);
                      }, 50);
                    }
                  }}
                  title={viewMode === "location" ? "Close location view" : "Select location"}
                  className={`
                    group h-10 sm:h-11 rounded-full px-3 sm:px-3.5
                    flex items-center gap-1.5 sm:gap-2 border transition-all duration-200 cursor-pointer flex-shrink-0
                    active:scale-95 select-none bg-white border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                    ${viewMode === "location" ? "border-[#FF4E7A]/60 ring-2 ring-[#FF4E7A]/20 bg-[#FFF5F7]" : "hover:border-black/20 hover:bg-neutral-50/80"}
                  `}
                >
                  <MapPin className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#FF4E7A] flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                  <span className="text-xs sm:text-sm font-bold text-[#1B1B23] truncate max-w-[70px] sm:max-w-[105px]">{city}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform duration-200 group-hover:text-neutral-700 ${viewMode === "location" ? "rotate-180 text-[#FF4E7A]" : ""}`} />
                </button>

                {/* Event Search Input Bar (Row 1 Center) */}
                <div
                  onClick={() => {
                    if (viewMode !== "search") setViewMode("search");
                    inputRef.current?.focus();
                    if (!searchQuery) {
                      inputRef.current?.setSelectionRange(0, 0);
                    }
                  }}
                  className="
                    group relative flex-1 min-w-0 h-10 sm:h-11 bg-white rounded-full px-3.5 sm:px-4
                    flex items-center gap-2 sm:gap-2.5 border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                    transition-all duration-200 cursor-text
                    focus-within:border-black/25 focus-within:ring-2 focus-within:ring-black/5
                  "
                >
                  {/* Clean Search Icon */}
                  <Search className="w-4 h-4 text-neutral-400 flex-shrink-0 group-focus-within:text-neutral-700 transition-colors" />

                  {/* Removable Selected Category Chip */}
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 pl-2.5 pr-1.5 py-0.5 rounded-full bg-[#FF4E7A]/10 text-[#FF4E7A] text-[11px] sm:text-xs font-bold flex-shrink-0 select-none animate-in fade-in zoom-in-95">
                      <span className="max-w-[65px] sm:max-w-[110px] truncate">
                        {EVENT_CATEGORIES.find((c) => c.value === selectedCategory)?.shortLabel ||
                          EVENT_CATEGORIES.find((c) => c.value === selectedCategory)?.label ||
                          selectedCategory}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedCategory(null);
                        }}
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center hover:bg-[#FF4E7A]/20 transition-colors"
                        aria-label="Remove category filter"
                      >
                        <X className="w-2.5 h-2.5 stroke-[2.5]" />
                      </button>
                    </span>
                  )}

                  {/* Text Input with Single-line Animated Placeholder positioned directly at cursor start */}
                  <div className="relative flex-1 min-w-0 h-full flex items-center">
                    {!searchQuery && !selectedCategory && (
                      <div className="absolute inset-y-0 left-0 pl-0.5 flex items-center pointer-events-none w-full">
                        <AnimatedSearchPlaceholder className="w-full" />
                      </div>
                    )}
                    <input
                      ref={inputRef}
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleViewMore();
                        }
                      }}
                      onFocus={(e) => {
                        if (!searchQuery) {
                          e.target.setSelectionRange(0, 0);
                          requestAnimationFrame(() => e.target.setSelectionRange(0, 0));
                          setTimeout(() => e.target.setSelectionRange(0, 0), 50);
                        }
                      }}
                      onClick={(e) => {
                        if (!searchQuery) {
                          e.target.setSelectionRange(0, 0);
                          requestAnimationFrame(() => e.target.setSelectionRange(0, 0));
                        }
                      }}
                      onTouchEnd={(e) => {
                        if (!searchQuery) {
                          setTimeout(() => e.target.setSelectionRange(0, 0), 50);
                        }
                      }}
                      placeholder=""
                      className="
                        w-full min-w-0 bg-transparent border-none outline-none text-xs sm:text-sm
                        font-medium text-[#1B1B23] relative z-10 caret-[#FF4E7A] pl-0
                      "
                    />
                  </div>

                  {/* Right: Clear Button or Desktop ⌘K Shortcut */}
                  {searchQuery ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSearchQuery("");
                        inputRef.current?.focus();
                      }}
                      className="w-5 h-5 rounded-full bg-black/5 hover:bg-black/10 flex items-center justify-center text-neutral-500 hover:text-neutral-800 transition-all flex-shrink-0 active:scale-90"
                      aria-label="Clear search"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded-md bg-black/4 text-[9px] font-bold text-[#8C8C9E] border border-black/5 flex-shrink-0 select-none">
                      ⌘K
                    </kbd>
                  )}
                </div>

                {/* Close Modal Button */}
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="
                    w-10 h-10 sm:h-11 sm:w-11 rounded-full bg-white border border-black/[0.08] shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                    flex items-center justify-center text-[#6B6B80] hover:text-[#1B1B23] hover:bg-neutral-50
                    active:scale-95 transition-all flex-shrink-0 cursor-pointer
                  "
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
                </button>
              </div>

              {/* LOCATION MODE ROWS: Row 2 (Search city) & Row 3 (Use Current Location) */}
              {viewMode === "location" && (
                <div className="pt-2 sm:pt-2.5 space-y-1.5 sm:space-y-2 w-full animate-in fade-in slide-in-from-top-1 duration-200">
                  {/* Row 2: Search city, area or locality (Fixed full width searchbar) */}
                  <div className="
                    w-full bg-white rounded-full px-3.5 sm:px-4 py-2 sm:py-2.5
                    flex items-center justify-between gap-2 shadow-[0_2px_8px_rgba(0,0,0,0.03)]
                    border border-black/[0.08] focus-within:border-black/25 focus-within:ring-2 focus-within:ring-black/5
                    transition-all duration-200
                  ">
                    <div className="flex items-center gap-2 flex-1 min-w-0">
                      <Search className="w-4 h-4 text-[#8C8C9E] flex-shrink-0" />
                      <input
                        ref={locationInputRef}
                        type="text"
                        value={locationSearchQuery}
                        onChange={(e) => setLocationSearchQuery(e.target.value)}
                        onFocus={(e) => {
                          if (!locationSearchQuery) {
                            e.target.setSelectionRange(0, 0);
                            requestAnimationFrame(() => e.target.setSelectionRange(0, 0));
                            setTimeout(() => e.target.setSelectionRange(0, 0), 50);
                          }
                        }}
                        onClick={(e) => {
                          if (!locationSearchQuery) {
                            e.target.setSelectionRange(0, 0);
                            requestAnimationFrame(() => e.target.setSelectionRange(0, 0));
                          }
                        }}
                        onTouchEnd={(e) => {
                          if (!locationSearchQuery) {
                            setTimeout(() => e.target.setSelectionRange(0, 0), 50);
                          }
                        }}
                        placeholder="Search city, area or locality"
                        className="
                          w-full bg-transparent border-none outline-none text-xs sm:text-sm
                          font-medium text-[#1B1B23] placeholder:text-[#9A9AA8] caret-[#FF4E7A] pl-0
                        "
                      />
                    </div>
                    {locationSearchQuery && (
                      <button
                        type="button"
                        onClick={() => setLocationSearchQuery("")}
                        className="text-[#8C8C9E] hover:text-[#1B1B23] p-0.5 active:scale-90 transition-transform cursor-pointer"
                        aria-label="Clear city query"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Row 3: Use Current Location (Directly below location search bar with pink symbol, snug spacing) */}
                  <div className="flex items-center px-1.5 pt-1.5 pb-0.5">
                    <button
                      type="button"
                      onClick={handleUseCurrentLocation}
                      disabled={locatingCurrent}
                      className="
                        inline-flex items-center gap-2 py-0.5 px-0.5 text-xs sm:text-sm font-bold text-[#1B1B23]
                        hover:text-[#FF4E7A] active:scale-95 transition-colors cursor-pointer group select-none
                      "
                    >
                      <LocateFixed className={`w-4 h-4 text-[#FF4E7A] ${locatingCurrent ? "animate-spin" : "group-hover:scale-110"} transition-transform flex-shrink-0`} />
                      <span className="group-hover:text-[#FF4E7A] transition-colors">
                        {locatingCurrent ? "Locating…" : "Use Current Location"}
                      </span>
                    </button>
                  </div>
                </div>
              )}
            </motion.div>

        {/* ── SCROLLABLE BODY WRAPPER WITH FIXED RIGHT ALPHABET SCRUBBER ── */}
        <div className="relative flex-1 min-h-0 flex flex-col overflow-hidden">
          <div
            ref={scrollContainerRef}
            onScroll={(e) => {
              if (e.currentTarget.scrollLeft !== 0) e.currentTarget.scrollLeft = 0;
            }}
            className={`
              flex-1 min-h-0 overflow-y-auto overflow-x-hidden [touch-action:pan-y] overscroll-contain
              px-3.5 sm:px-5 lg:px-6 ${viewMode === "location" ? "pt-1.5 pb-3 sm:pt-2 sm:pb-4 space-y-2 sm:space-y-2.5" : "py-2.5 sm:py-3.5 lg:py-4 space-y-3 sm:space-y-4"} scrollbar-hide
            `}
          >
          {/* ── VIEW CONTAINER ── */}
          <div className="relative w-full max-w-full overflow-visible">
            {/* PANEL 0: SEARCH & DISCOVERY VIEW */}
            <div
              className={`
                w-full max-w-full space-y-4 sm:space-y-5
                ${viewMode === "search" ? "block" : "hidden pointer-events-none"}
              `}
            >
            {/* ── BROWSE BY CATEGORY (Top of Search View) ── */}
            {/* DESKTOP CATEGORIES (>= lg) */}
            <div className="hidden lg:block space-y-1.5 pb-1">
              <div className="flex items-center justify-between pb-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80] font-label">
                  Browse by Category
                </span>
                <button
                  type="button"
                  onClick={() => setShowAllCategories((prev) => !prev)}
                  className="text-xs font-bold text-[#FF4E7A] hover:underline inline-flex items-center gap-1 transition-colors py-0.5"
                >
                  <span>{showAllCategories ? "Less" : "More"}</span>
                  <span className="text-[10px]">{showAllCategories ? "▲" : "▼"}</span>
                </button>
              </div>

              <div
                className={`
                  flex flex-wrap items-center gap-2 sm:gap-2.5 overflow-hidden transition-all duration-300 ease-in-out
                  ${showAllCategories ? "max-h-[400px]" : "max-h-[96px] sm:max-h-[104px]"}
                `}
              >
                {BROWSE_CATEGORIES.map((cat) => {
                  const isSelected = selectedCategory === cat.value;
                  const styles = CATEGORY_STYLES[cat.value] || {
                    hoverBg: "hover:bg-gradient-to-r hover:from-pink-50 hover:to-white hover:border-[#FF4E7A]/40",
                    glow: "group-hover:shadow-[0_6px_16px_rgba(255,78,122,0.18)]",
                    textColor: "group-hover:text-[#FF4E7A]",
                    selectedBg: "bg-pink-50 border-[#FF4E7A]",
                    selectedText: "text-[#FF4E7A]",
                  };

                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => handleCategoryClick(cat.value)}
                      className={`
                        group h-[42px] sm:h-[46px] w-auto inline-flex items-center gap-2
                        bg-white rounded-xl sm:rounded-2xl pl-3 sm:pl-3.5 pr-2 py-1 text-left border shadow-2xs
                        transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0
                        hover:-translate-y-0.5 hover:shadow-xs active:scale-95
                        ${styles.hoverBg} ${styles.glow}
                        ${
                          isSelected
                            ? `${styles.selectedBg} ring-2 ring-[#FF4E7A]/30`
                            : "border-black/6"
                        }
                      `}
                    >
                      <span
                        className={`
                          text-xs sm:text-sm font-bold transition-colors
                          ${isSelected ? styles.selectedText : "text-[#1B1B23] group-hover:text-[#FF4E7A]"}
                        `}
                      >
                        {cat.label}
                      </span>

                      <div className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 flex items-center justify-center pointer-events-none">
                        <img
                          src={categoryImage(cat.value)}
                          alt=""
                          aria-hidden="true"
                          className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>

                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E7A]" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* MOBILE & TABLET CATEGORIES (< lg) */}
            <div className="lg:hidden space-y-1.5 pb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80] font-label">
                Browse by Category
              </span>
              <div className="w-full max-w-full overflow-x-auto scrollbar-hide py-1 [touch-action:pan-y_pan-x] select-none cursor-grab active:cursor-grabbing space-y-2">
                {/* Row 1 */}
                <div className="flex items-center gap-2 w-max">
                  {BROWSE_CATEGORIES.filter((_, i) => i % 2 === 0).map((cat) => {
                    const isSelected = selectedCategory === cat.value;
                    const styles = CATEGORY_STYLES[cat.value] || {
                      hoverBg: "hover:bg-gradient-to-r hover:from-pink-50 hover:to-white hover:border-[#FF4E7A]/40",
                      glow: "group-hover:shadow-[0_6px_16px_rgba(255,78,122,0.18)]",
                      textColor: "group-hover:text-[#FF4E7A]",
                      selectedBg: "bg-pink-50 border-[#FF4E7A]",
                      selectedText: "text-[#FF4E7A]",
                    };

                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryClick(cat.value)}
                        className={`
                          group h-[42px] w-auto inline-flex items-center gap-2
                          bg-white rounded-xl pl-3.5 pr-2 py-1 text-left border shadow-2xs
                          transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0
                          active:scale-95
                          ${styles.hoverBg} ${styles.glow}
                          ${
                            isSelected
                              ? `${styles.selectedBg} ring-2 ring-[#FF4E7A]/30`
                              : "border-black/6"
                          }
                        `}
                      >
                        <span
                          className={`
                            text-xs font-bold transition-colors
                            ${isSelected ? styles.selectedText : "text-[#1B1B23] group-hover:text-[#FF4E7A]"}
                          `}
                        >
                          {cat.label}
                        </span>

                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center pointer-events-none">
                          <img
                            src={categoryImage(cat.value)}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>

                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E7A]" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Row 2 */}
                <div className="flex items-center gap-2 w-max">
                  {BROWSE_CATEGORIES.filter((_, i) => i % 2 !== 0).map((cat) => {
                    const isSelected = selectedCategory === cat.value;
                    const styles = CATEGORY_STYLES[cat.value] || {
                      hoverBg: "hover:bg-gradient-to-r hover:from-pink-50 hover:to-white hover:border-[#FF4E7A]/40",
                      glow: "group-hover:shadow-[0_6px_16px_rgba(255,78,122,0.18)]",
                      textColor: "group-hover:text-[#FF4E7A]",
                      selectedBg: "bg-pink-50 border-[#FF4E7A]",
                      selectedText: "text-[#FF4E7A]",
                    };

                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => handleCategoryClick(cat.value)}
                        className={`
                          group h-[42px] w-auto inline-flex items-center gap-2
                          bg-white rounded-xl pl-3.5 pr-2 py-1 text-left border shadow-2xs
                          transition-all duration-200 ease-out whitespace-nowrap flex-shrink-0
                          active:scale-95
                          ${styles.hoverBg} ${styles.glow}
                          ${
                            isSelected
                              ? `${styles.selectedBg} ring-2 ring-[#FF4E7A]/30`
                              : "border-black/6"
                          }
                        `}
                      >
                        <span
                          className={`
                            text-xs font-bold transition-colors
                            ${isSelected ? styles.selectedText : "text-[#1B1B23] group-hover:text-[#FF4E7A]"}
                          `}
                        >
                          {cat.label}
                        </span>

                        <div className="w-6 h-6 flex-shrink-0 flex items-center justify-center pointer-events-none">
                          <img
                            src={categoryImage(cat.value)}
                            alt=""
                            aria-hidden="true"
                            className="w-full h-full object-contain transition-transform duration-300 ease-out group-hover:scale-110"
                            onError={(e) => {
                              e.target.style.display = "none";
                            }}
                          />
                        </div>

                        {isSelected && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#FF4E7A]" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── Filter Chips & Interactive Dropdowns (Compact & Sleek) ── */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16, duration: 0.22, ease: "easeOut" }}
              className="relative flex items-center gap-1.5 sm:gap-2 pb-0.5 flex-wrap z-30 overflow-visible"
            >
              {/* Today Chip */}
              <button
                type="button"
                onClick={() => setDateFilter(dateFilter === "today" ? null : "today")}
                className={`
                  px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 active:scale-95 flex-shrink-0
                  ${
                    dateFilter === "today"
                      ? "bg-[#FF4E7A] text-white shadow-[0_4px_14px_rgba(255,78,122,0.3)]"
                      : "bg-white hover:bg-neutral-50 text-[#1B1B23] border border-black/5 shadow-xs hover:border-[#FF4E7A]/30"
                  }
                `}
              >
                Today
              </button>

              {/* Tomorrow Chip */}
              <button
                type="button"
                onClick={() => setDateFilter(dateFilter === "tomorrow" ? null : "tomorrow")}
                className={`
                  px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 active:scale-95 flex-shrink-0
                  ${
                    dateFilter === "tomorrow"
                      ? "bg-[#FF4E7A] text-white shadow-[0_4px_14px_rgba(255,78,122,0.3)]"
                      : "bg-white hover:bg-neutral-50 text-[#1B1B23] border border-black/5 shadow-xs hover:border-[#FF4E7A]/30"
                  }
                `}
              >
                Tomorrow
              </button>

              {/* Under 10 Km */}
              <button
                type="button"
                onClick={() => setUnder10Km((prev) => !prev)}
                className={`
                  px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold
                  transition-all duration-200 active:scale-95 flex-shrink-0
                  ${
                    under10Km
                      ? "bg-[#FF4E7A] text-white shadow-[0_4px_14px_rgba(255,78,122,0.3)]"
                      : "bg-white hover:bg-neutral-50 text-[#1B1B23] border border-black/5 shadow-xs hover:border-[#FF4E7A]/30"
                  }
                `}
              >
                Under 10 Km
              </button>

              {/* Mobile & Tablet More Filters Button (< lg) */}
              <button
                type="button"
                onClick={() => setIsMoreFiltersOpen(true)}
                className={`lg:hidden px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 flex items-center gap-1.5 transition-all active:scale-95 ${
                  totalSearchFiltersCount > 0
                    ? "bg-[#1B1B23] text-white shadow-xs"
                    : "bg-white hover:bg-neutral-50 text-[#1B1B23] border border-black/5 shadow-xs hover:border-[#FF4E7A]/30"
                }`}
              >
                <SlidersHorizontal className={`w-3.5 h-3.5 ${totalSearchFiltersCount > 0 ? "text-[#FF4E7A]" : "text-[#8C8C9E]"}`} />
                <span>More filters</span>
                {totalSearchFiltersCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF4E7A] text-white text-[10px] font-bold flex items-center justify-center">
                    {totalSearchFiltersCount}
                  </span>
                )}
              </button>

              {/* Desktop Filter Dropdowns (>= lg) */}
              <div className="hidden lg:flex items-center gap-1.5 sm:gap-2">
                {/* 1. Offline / Format Dropdown */}
                <div className="relative flex-shrink-0" data-dropdown="format">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMoreFiltersOpen(false);
                      setActiveDropdown(activeDropdown === "format" ? null : "format");
                    }}
                    className={`
                      inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold
                      transition-all duration-200 active:scale-95
                      ${
                        formatFilter !== "all"
                          ? "bg-[#FF4E7A] text-white shadow-[0_4px_14px_rgba(255,78,122,0.28)]"
                          : "bg-white hover:bg-neutral-50 text-[#1B1B23] border border-black/5 shadow-xs hover:border-[#FF4E7A]/30"
                      }
                    `}
                  >
                    <span>{formatFilterLabel}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === "format" ? "rotate-180" : ""}`} />
                  </button>

                  {activeDropdown === "format" && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
                        absolute left-0 top-full mt-2 z-50
                        w-[200px] max-w-[calc(100vw-32px)] p-1.5 bg-white/95 backdrop-blur-2xl rounded-2xl
                        shadow-[0_16px_36px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.06)] border border-black/8
                        animate-in fade-in zoom-in-95 duration-200
                      "
                    >
                      {[
                        { value: "all", label: "All Formats" },
                        { value: "offline", label: "Offline (In-person)" },
                        { value: "online", label: "Online" },
                        { value: "hybrid", label: "Hybrid" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setFormatFilter(opt.value);
                            setActiveDropdown(null);
                          }}
                          className={`
                            w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-between
                            ${formatFilter === opt.value ? "bg-[#FF4E7A]/10 text-[#FF4E7A]" : "text-[#1B1B23] hover:bg-black/5"}
                          `}
                        >
                          <span>{opt.label}</span>
                          {formatFilter === opt.value && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Paid / Price Dropdown */}
                <div className="relative flex-shrink-0" data-dropdown="price">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMoreFiltersOpen(false);
                      setActiveDropdown(activeDropdown === "price" ? null : "price");
                    }}
                    className={`
                      inline-flex items-center gap-1 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold
                      transition-all duration-200 active:scale-95
                      ${
                        priceFilter !== "all"
                          ? "bg-[#FF4E7A] text-white shadow-[0_4px_14px_rgba(255,78,122,0.28)]"
                          : "bg-white hover:bg-neutral-50 text-[#1B1B23] border border-black/5 shadow-xs hover:border-[#FF4E7A]/30"
                      }
                    `}
                  >
                    <span>{priceFilterLabel}</span>
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${activeDropdown === "price" ? "rotate-180" : ""}`} />
                  </button>

                  {activeDropdown === "price" && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
                        absolute left-0 top-full mt-2 z-50
                        w-[180px] max-w-[calc(100vw-32px)] p-1.5 bg-white/95 backdrop-blur-2xl rounded-2xl
                        shadow-[0_16px_36px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.06)] border border-black/8
                        animate-in fade-in zoom-in-95 duration-200
                      "
                    >
                      {[
                        { value: "all", label: "All Prices" },
                        { value: "paid", label: "Paid" },
                        { value: "free", label: "Free" },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setPriceFilter(opt.value);
                            setActiveDropdown(null);
                          }}
                          className={`
                            w-full text-left px-3 py-1.5 text-xs font-bold rounded-xl transition-all flex items-center justify-between
                            ${priceFilter === opt.value ? "bg-[#FF4E7A]/10 text-[#FF4E7A]" : "text-[#1B1B23] hover:bg-black/5"}
                          `}
                        >
                          <span>{opt.label}</span>
                          {priceFilter === opt.value && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. More Filters Trigger & Popover (Desktop) */}
                <div className="relative flex-shrink-0" data-dropdown="more">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveDropdown(null);
                      setIsMoreFiltersOpen((prev) => !prev);
                    }}
                    className={`
                      inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-full text-xs font-semibold
                      transition-all duration-200 active:scale-95 flex-shrink-0
                      ${
                        advancedFilterCount > 0
                          ? "bg-[#1B1B23] text-white shadow-xs"
                          : "bg-white hover:bg-neutral-50 text-[#1B1B23] border border-black/5 shadow-xs hover:border-[#FF4E7A]/30"
                      }
                    `}
                  >
                    <SlidersHorizontal className={`w-3.5 h-3.5 ${advancedFilterCount > 0 ? "text-[#FF4E7A]" : "text-[#8C8C9E]"}`} />
                    <span>More filters</span>
                    {advancedFilterCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#FF4E7A] text-white text-[10px] font-bold flex items-center justify-center">
                        {advancedFilterCount}
                      </span>
                    )}
                    <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isMoreFiltersOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isMoreFiltersOpen && (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="
                        absolute right-0 top-full mt-2 z-50
                        w-[270px] max-w-[calc(100vw-32px)] p-2
                        bg-white/95 backdrop-blur-2xl rounded-2xl
                        shadow-[0_16px_36px_rgba(0,0,0,0.18),0_2px_8px_rgba(0,0,0,0.06)] border border-black/8
                        animate-in fade-in zoom-in-95 duration-200
                      "
                    >
                      {/* 1. Accessible Venue */}
                      <div className="relative group/tooltip">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={accessibleOnly}
                          title="Wheelchair & step-free accessible venue"
                          onClick={() => setAccessibleOnly(!accessibleOnly)}
                          className={`
                            w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-between group
                            ${accessibleOnly ? "bg-[#FF4E7A]/10 text-[#FF4E7A]" : "text-[#1B1B23] hover:bg-black/5"}
                          `}
                        >
                          <div className="flex items-center gap-2.5">
                            <Accessibility className={`w-3.5 h-3.5 transition-colors ${accessibleOnly ? "text-[#FF4E7A]" : "text-neutral-500 group-hover:text-[#1B1B23]"}`} />
                            <span>Accessible Venue</span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all ${
                              accessibleOnly
                                ? "bg-[#FF4E7A] border-[#FF4E7A] text-white shadow-xs"
                                : "border-neutral-300 bg-white group-hover:border-neutral-400"
                            }`}
                          >
                            {accessibleOnly && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1B1B23]/95 backdrop-blur-md text-white text-[11px] font-semibold rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
                          <span>♿ Wheelchair & step-free access</span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1B1B23]/95" />
                        </div>
                      </div>

                      {/* 2. Accredited Events */}
                      <div className="relative group/tooltip">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={accreditedOnly}
                          title="Certified CPD & accredited events"
                          onClick={() => setAccreditedOnly(!accreditedOnly)}
                          className={`
                            w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-between group
                            ${accreditedOnly ? "bg-[#FF4E7A]/10 text-[#FF4E7A]" : "text-[#1B1B23] hover:bg-black/5"}
                          `}
                        >
                          <div className="flex items-center gap-2.5">
                            <ShieldCheck className={`w-3.5 h-3.5 transition-colors ${accreditedOnly ? "text-[#FF4E7A]" : "text-neutral-500 group-hover:text-[#1B1B23]"}`} />
                            <span>Accredited Events</span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all ${
                              accreditedOnly
                                ? "bg-[#FF4E7A] border-[#FF4E7A] text-white shadow-xs"
                                : "border-neutral-300 bg-white group-hover:border-neutral-400"
                            }`}
                          >
                            {accreditedOnly && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1B1B23]/95 backdrop-blur-md text-white text-[11px] font-semibold rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
                          <span>🎓 Official CPD certifications</span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1B1B23]/95" />
                        </div>
                      </div>

                      {/* 3. On-Chain Verified */}
                      <div className="relative group/tooltip">
                        <button
                          type="button"
                          role="checkbox"
                          aria-checked={blockchainOnly}
                          title="Authentic blockchain-verified tickets"
                          onClick={() => setBlockchainOnly(!blockchainOnly)}
                          className={`
                            w-full text-left px-3 py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-between group
                            ${blockchainOnly ? "bg-[#FF4E7A]/10 text-[#FF4E7A]" : "text-[#1B1B23] hover:bg-black/5"}
                          `}
                        >
                          <div className="flex items-center gap-2.5">
                            <Tag className={`w-3.5 h-3.5 transition-colors ${blockchainOnly ? "text-[#FF4E7A]" : "text-neutral-500 group-hover:text-[#1B1B23]"}`} />
                            <span>On-Chain Verified</span>
                          </div>
                          <div
                            className={`w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all ${
                              blockchainOnly
                                ? "bg-[#FF4E7A] border-[#FF4E7A] text-white shadow-xs"
                                : "border-neutral-300 bg-white group-hover:border-neutral-400"
                            }`}
                          >
                            {blockchainOnly && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </button>
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 hidden group-hover/tooltip:flex items-center gap-1.5 px-2.5 py-1.5 bg-[#1B1B23]/95 backdrop-blur-md text-white text-[11px] font-semibold rounded-xl shadow-[0_8px_20px_rgba(0,0,0,0.25)] pointer-events-none whitespace-nowrap z-50 animate-in fade-in zoom-in-95 duration-150">
                          <span>🛡️ Blockchain ticket protection</span>
                          <div className="absolute top-full left-1/2 -translate-x-1/2 -mt-1 border-4 border-transparent border-t-[#1B1B23]/95" />
                        </div>
                      </div>

                      {/* Actions Footer: Reset and Done */}
                      <div className="pt-2 mt-1.5 border-t border-black/6 flex items-center justify-between gap-2 px-1">
                        <button
                          type="button"
                          onClick={() => {
                            setAccessibleOnly(false);
                            setAccreditedOnly(false);
                            setBlockchainOnly(false);
                          }}
                          disabled={advancedFilterCount === 0}
                          className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                            advancedFilterCount > 0
                              ? "text-neutral-600 hover:text-[#FF4E7A] hover:bg-[#FF4E7A]/10 active:scale-95"
                              : "text-neutral-300 cursor-not-allowed"
                          }`}
                        >
                          Reset
                        </button>
                        <button
                          type="button"
                          onClick={() => setIsMoreFiltersOpen(false)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#FF4E7A] hover:bg-[#e03d67] shadow-sm transition-all active:scale-95 flex items-center gap-1.5"
                        >
                          <span>Done</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Reset Filter Pill (Visible when user has modified filters) */}
              {hasUserFiltered && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="
                    inline-flex items-center gap-1 text-xs font-bold text-[#8C8C9E] hover:text-[#FF4E7A]
                    bg-black/4 hover:bg-[#FF4E7A]/10 px-3 py-1.5 rounded-full transition-colors active:scale-95
                  "
                >
                  <X className="w-3 h-3" />
                  <span>Reset</span>
                </button>
              )}
            </motion.div>

            {/* ── Results Preview & Aesthetic Map (Proportionate Height) ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22, type: "spring", stiffness: 320, damping: 26 }}
              className="space-y-1.5 pt-0.5"
            >
              <div className="flex items-center justify-between px-0.5 pb-0.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80] font-label">
                  {hasUserFiltered ? "Results" : "Recommended"} ({filteredEvents.length})
                </span>
                {totalSearchFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetFilters}
                    className="text-xs font-bold text-[#FF4E7A] hover:underline"
                  >
                    Reset Filters
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 items-start">
                {/* Dynamically Filtered Events List: 2 in a row on Mobile, single column on Desktop */}
                <div className="lg:col-span-2 grid grid-cols-2 gap-2 sm:gap-2.5 lg:grid-cols-1 lg:gap-2">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.slice(0, 4).map((event, idx) => {
                      const isHovered = hoveredEventId === event.id;
                      const catName =
                        EVENT_CATEGORIES.find((c) => c.value === event.category)?.label || "Event";

                      return (
                        <div
                          key={event.id}
                          onClick={() => handleEventClick(event)}
                          onMouseEnter={() => setHoveredEventId(event.id)}
                          onMouseLeave={() => setHoveredEventId(null)}
                          className={`
                            p-2 sm:p-2.5 rounded-2xl bg-white border transition-all duration-200 cursor-pointer
                            flex flex-col lg:flex-row lg:items-center gap-2 sm:gap-2.5 lg:gap-3.5 group
                            ${idx >= 3 ? "lg:hidden" : ""}
                            ${
                              isHovered
                                ? "border-[#FF4E7A] ring-2 ring-[#FF4E7A]/25 shadow-sm -translate-y-0.5"
                                : "border-black/6 hover:border-[#FF4E7A]/40 hover:shadow-2xs"
                            }
                          `}
                        >
                          {/* Thumbnail */}
                          <div className="w-full lg:w-16 h-24 sm:h-28 lg:h-16 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100 shadow-2xs">
                            <img
                              src={event.image || "/images/figma-sample/goa/goa-hero.png"}
                              alt={event.name}
                              className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-300"
                            />
                          </div>

                          {/* Information */}
                          <div className="flex-1 min-w-0 space-y-0.5 w-full">
                            <h4
                              className={`font-bold text-xs sm:text-sm text-[#1B1B23] truncate transition-colors ${
                                isHovered ? "text-[#FF4E7A]" : "group-hover:text-[#FF4E7A]"
                              }`}
                            >
                              {event.name}
                            </h4>
                            <p className="text-[10px] sm:text-xs text-[#8C8C9E] font-medium truncate">
                              {catName}
                              {event.venue ? ` • ${event.venue}` : ""}
                            </p>
                            <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs text-neutral-600 font-medium pt-0.5">
                              <span className="truncate">{event.timeLabel || "Fri, 20 Nov, 7:00 PM"}</span>
                              <span className="text-[#FF4E7A] font-bold">
                                {event.priceLabel || (event.minPrice > 0 ? `• € ${event.minPrice}` : "• Free")}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="col-span-2 bg-white rounded-2xl p-5 sm:p-6 text-center space-y-2 border border-black/5 flex flex-col items-center justify-center">
                      <p className="text-sm font-bold text-[#1B1B23]">No events match your current filters</p>
                      <p className="text-xs text-[#8C8C9E]">Try clearing some filters or changing your search terms.</p>
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="mt-1 px-3.5 py-1.5 rounded-full bg-[#FF4E7A]/10 text-[#FF4E7A] text-xs font-bold hover:bg-[#FF4E7A] hover:text-white transition-colors"
                      >
                        Reset all filters
                      </button>
                    </div>
                  )}
                </div>

                {/* Mobile View More Button: Below Cards, Above Map (Mobile Only) */}
                {filteredEvents.length > 0 && (
                  <div className="lg:hidden w-full pt-1 pb-1">
                    <button
                      type="button"
                      onClick={handleViewMore}
                      className="w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF4E7A] hover:bg-[#e03d67] shadow-sm active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <span>View More Events ({filteredEvents.length})</span>
                      <span className="text-sm">→</span>
                    </button>
                  </div>
                )}

                

                {/* ── CARD 3: Synchronized Vector Map Card with Live Radar & Event Pins ── */}
                <div className="
                  relative bg-[#FBF8F4] rounded-2xl overflow-hidden shadow-[0_2px_12px_rgba(0,0,0,0.03)]
                  border border-black/6 flex flex-col min-h-[170px] sm:min-h-[200px] lg:min-h-[260px] h-full group hover:shadow-[0_14px_30px_rgba(0,0,0,0.08)]
                  hover:-translate-y-1 transition-all duration-300 ease-out
                ">
                  <svg
                    viewBox="0 0 320 280"
                    className="w-full h-full object-cover select-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                    aria-label="Dublin Area Map"
                  >
                    <rect width="320" height="280" fill="#F8F4EE" />
                    <path
                      d="M 240 0 C 230 40, 245 80, 230 120 C 220 150, 250 200, 240 280 L 320 280 L 320 0 Z"
                      fill="#D3E7F8"
                    />
                    <path
                      d="M 0 138 C 50 142, 90 135, 140 142 C 180 146, 205 138, 235 140 L 250 142"
                      fill="none"
                      stroke="#BCDDF6"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 40 20 L 40 260 M 80 10 L 80 270 M 120 10 L 120 270 M 160 10 L 160 270 M 200 10 L 200 270"
                      stroke="#EFE9E0"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 10 50 L 250 50 M 10 90 L 250 90 M 10 180 L 250 180 M 10 220 L 250 220"
                      stroke="#EFE9E0"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M 170 10 C 130 20, 45 40, 30 100 C 15 160, 40 220, 110 255 C 160 275, 190 270, 210 270"
                      fill="none"
                      stroke="#F6BA7C"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <path
                      d="M 30 100 L 160 140 M 35 180 L 160 140 M 110 255 L 160 140 M 170 10 L 160 140"
                      stroke="#FBD8A8"
                      strokeWidth="2.5"
                    />
                    <rect x="155" y="16" width="28" height="15" rx="3" fill="#E6EEF4" stroke="#8EA4B8" strokeWidth="0.8" />
                    <text x="169" y="27" fontSize="8" fontWeight="bold" fill="#2E485E" textAnchor="middle">M50</text>
                    <rect x="75" y="240" width="28" height="15" rx="3" fill="#E6EEF4" stroke="#8EA4B8" strokeWidth="0.8" />
                    <text x="89" y="251" fontSize="8" fontWeight="bold" fill="#2E485E" textAnchor="middle">M50</text>

                    <text
                      x="155"
                      y="136"
                      fontSize="16"
                      fontWeight="800"
                      fill="#1B1B23"
                      textAnchor="middle"
                      fontFamily="sans-serif"
                    >
                      Dublin
                    </text>

                    {/* Synchronized Event Pins tied to Filtered Dataset */}
                    {filteredEvents.length > 0 ? (
                      filteredEvents.slice(0, 4).map((evt, idx) => {
                        const pos = MAP_PIN_POSITIONS[idx % MAP_PIN_POSITIONS.length];
                        const isHovered = hoveredEventId === evt.id;
                        return (
                          <g
                            key={evt.id}
                            transform={`translate(${pos.x}, ${pos.y})`}
                            className="cursor-pointer transition-transform duration-300"
                            onClick={() => handleEventClick(evt)}
                            onMouseEnter={() => setHoveredEventId(evt.id)}
                            onMouseLeave={() => setHoveredEventId(null)}
                          >
                            {/* Animated Radar Pulse */}
                            <circle
                              cx="0"
                              cy="0"
                              r={isHovered ? "18" : "12"}
                              fill="#FF4E7A"
                              opacity={isHovered ? "0.35" : "0.15"}
                              className="animate-ping"
                            />
                            <circle
                              cx="0"
                              cy="0"
                              r={isHovered ? "10" : "7"}
                              fill="#FF4E7A"
                              opacity={isHovered ? "0.5" : "0.3"}
                              className="animate-ping"
                              style={{ animationDelay: `${idx * 250}ms` }}
                            />
                            {/* Core Pin */}
                            <circle
                              cx="0"
                              cy="0"
                              r={isHovered ? "6.5" : "5"}
                              fill={isHovered ? "#E11D48" : "#FF4E7A"}
                              stroke="#FFFFFF"
                              strokeWidth="2"
                            />

                            {/* Synchronized Hover Tooltip on Map */}
                            {isHovered && (
                              <g transform="translate(0, -14)" className="pointer-events-none">
                                <rect
                                  x="-48"
                                  y="-18"
                                  width="96"
                                  height="18"
                                  rx="6"
                                  fill="#1B1B23"
                                  stroke="#FFFFFF"
                                  strokeWidth="0.8"
                                  filter="drop-shadow(0px 4px 8px rgba(0,0,0,0.25))"
                                />
                                <text
                                  x="0"
                                  y="-6"
                                  textAnchor="middle"
                                  fill="#FFFFFF"
                                  fontSize="8"
                                  fontWeight="bold"
                                  fontFamily="sans-serif"
                                >
                                  {evt.name.length > 15 ? evt.name.slice(0, 14) + "…" : evt.name}
                                </text>
                              </g>
                            )}
                          </g>
                        );
                      })
                    ) : (
                      /* Idle beacon when no filtered events */
                      <g transform="translate(160, 140)">
                        <circle cx="0" cy="0" r="10" fill="#8C8C9E" opacity="0.2" />
                        <circle cx="0" cy="0" r="4" fill="#8C8C9E" stroke="#FFFFFF" strokeWidth="1.5" />
                      </g>
                    )}
                  </svg>

                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between pointer-events-none">
                    <span className="text-[11px] font-bold text-[#1B1B23] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/5 shadow-xs flex items-center gap-1.5">
                      <span className={`w-1.5 h-1.5 rounded-full ${filteredEvents.length > 0 ? "bg-emerald-500 animate-pulse" : "bg-neutral-400"}`} />
                      <span>Live Event Radar</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#FF4E7A] bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full border border-black/5 shadow-xs">
                      {filteredEvents.length > 0 ? `${filteredEvents.length} Events Near you` : "No Events Near you"}
                    </span>
                  </div>
                </div>
              </div>

              {filteredEvents.length > 0 && (
                <div className="hidden lg:flex pt-2.5 sm:pt-3 pb-0.5 items-center justify-between">
                  <button
                    type="button"
                    onClick={handleViewMore}
                    className="text-[#FF4E7A] text-xs sm:text-sm font-bold hover:underline inline-flex items-center gap-1.5 transition-colors group cursor-pointer"
                  >
                    <span>View More Events ({filteredEvents.length})</span>
                    <span className="group-hover:translate-x-1 transition-transform duration-200">→</span>
                  </button>
                </div>
              )}
            </motion.div>

            </div>

          {/* ══════════════════════════════════════════════════════════════ */}
          {/* PANEL 1: SELECT LOCATION VIEW                                  */}
          {/* ══════════════════════════════════════════════════════════════ */}
          <div
            className={`
              w-full space-y-2.5 sm:space-y-3
              ${viewMode === "location" ? "block" : "hidden"}
            `}
          >
            {/* ── Popular Cities: 2 Rows Draggable Left-to-Right + Vertical Touch Scroll ── */}
            <div className="space-y-1.5">
              <h4 className="text-xs sm:text-sm font-bold text-[#1B1B23]">
                Popular Cities
              </h4>

              {/* Desktop Popular Cities: 1:1 Aspect Ratio 5-Col Grid for Big Screens */}
              <div className="hidden lg:grid lg:grid-cols-5 lg:grid-rows-2 gap-2.5 lg:gap-3 w-full">
                {filteredPopularCities.map((c) => {
                  const isCurrent = city.toLowerCase() === c.name.toLowerCase();
                  return (
                    <button
                      key={c.name}
                      type="button"
                      onClick={() => handleCitySelect(c.name)}
                      title={c.name}
                      className={`
                        group relative bg-white rounded-2xl p-0 aspect-square w-full
                        flex items-center justify-center border shadow-2xs transition-all duration-200 cursor-pointer overflow-hidden
                        hover:-translate-y-0.5 hover:shadow-xs active:scale-95
                        ${
                          isCurrent
                            ? "border-[#FF4E7A] ring-2 ring-[#FF4E7A]/25 bg-gradient-to-b from-[#FFF5F7] to-white"
                            : "border-black/6 hover:border-[#FF4E7A]/40"
                        }
                      `}
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="w-full h-full object-contain pointer-events-none transition-transform duration-300 group-hover:scale-106"
                      />
                      {isCurrent && (
                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#FF4E7A] ring-2 ring-white animate-pulse" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Mobile & Tablet Popular Cities: 2 Rows Draggable (All Cities with 4th Column Peeking on Side) */}
              <div className="lg:hidden w-full overflow-x-auto scrollbar-hide py-1 [touch-action:pan-y_pan-x] select-none cursor-grab active:cursor-grabbing">
                <div className="grid grid-rows-2 grid-flow-col auto-cols-[calc((100vw-54px)/3.35)] sm:auto-cols-[108px] gap-2 sm:gap-2.5 w-max pr-3">
                  {filteredPopularCities.map((c) => {
                    const isCurrent = city.toLowerCase() === c.name.toLowerCase();
                    return (
                      <button
                        key={c.name}
                        type="button"
                        onClick={() => handleCitySelect(c.name)}
                        title={c.name}
                        className={`
                          group relative bg-white rounded-2xl p-0 aspect-square w-full
                          flex items-center justify-center border shadow-2xs transition-all duration-200 cursor-pointer overflow-hidden
                          active:scale-95
                          ${
                            isCurrent
                              ? "border-[#FF4E7A] ring-2 ring-[#FF4E7A]/25 bg-gradient-to-b from-[#FFF5F7] to-white"
                              : "border-black/6 hover:border-[#FF4E7A]/40"
                          }
                        `}
                      >
                        <img
                          src={c.image}
                          alt={c.name}
                          className="w-full h-full object-contain p-1.5 pointer-events-none transition-transform duration-300 group-hover:scale-108"
                        />
                        {isCurrent && (
                          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#FF4E7A] ring-2 ring-white animate-pulse" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* ── All Cities: Desktop Grid vs Mobile Continuous List ── */}
            <div className="pt-1 lg:pt-2 lg:border-t lg:border-black/6">
              {/* DESKTOP ALL CITIES */}
              <div className="hidden lg:block space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#6B6B80] font-label">
                    All Cities
                  </h4>
                </div>

                {/* Horizontal Alphabet Filter Bar */}
                <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 scrollbar-hide text-xs font-semibold select-none">
                  {ALPHABET_LIST.map((letter) => {
                    const hasCities = (ALPHABET_CITIES_MAP[letter] || []).length > 0;
                    const isActive = selectedLetter === letter;
                    if (!hasCities) {
                      return (
                        <span key={letter} className="w-5 h-5 flex items-center justify-center text-gray-300 select-none text-xs">
                          {letter}
                        </span>
                      );
                    }
                    return (
                      <button
                        key={letter}
                        type="button"
                        onClick={() => setSelectedLetter(isActive ? null : letter)}
                        className={`
                          w-5 h-5 rounded flex items-center justify-center transition-all text-xs font-bold
                          ${
                            isActive
                              ? "text-[#FF4E7A] font-extrabold scale-110"
                              : "text-[#6B6B80] hover:text-[#FF4E7A]"
                          }
                        `}
                      >
                        {letter}
                      </button>
                    );
                  })}
                </div>

                {/* Desktop 4-Column City Grid */}
                <div className="grid grid-cols-4 gap-y-2.5 gap-x-6 pt-2 max-h-[260px] overflow-y-auto pr-1 scrollbar-hide text-xs sm:text-sm font-medium text-[#1B1B23]">
                  {desktopCitiesList.length > 0 ? (
                    desktopCitiesList.map((cityName) => {
                      const isSelected = city.toLowerCase() === cityName.toLowerCase();
                      return (
                        <button
                          key={cityName}
                          type="button"
                          onClick={() => handleCitySelect(cityName)}
                          className={`
                            text-left py-1 hover:text-[#FF4E7A] transition-colors truncate flex items-center justify-between pr-2
                            ${isSelected ? "text-[#FF4E7A] font-bold" : "text-[#1B1B23]"}
                          `}
                        >
                          <span className="truncate">{cityName}</span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4E7A] flex-shrink-0" />}
                        </button>
                      );
                    })
                  ) : (
                    <p className="col-span-4 text-xs text-[#8C8C9E] py-4 text-center">
                      No cities found for "{locationSearchQuery || selectedLetter}"
                    </p>
                  )}
                </div>
              </div>

              {/* MOBILE ALL CITIES: Smooth Scrolling Continuous A to Z List with Right-Side Alphabet Scrubber Starting Beside Cities */}
              <div className="lg:hidden">
                {/* Sticky "All Cities" header (Remains fixed at top on mobile while scrolling) */}
                <div className="sticky top-0 bg-[#F8F5F0] py-1.5 z-20 border-b border-black/5 -mx-3.5 sm:-mx-5 px-3.5 sm:px-5 flex items-center justify-between">
                  <h4 className="text-xs sm:text-sm font-bold text-[#1B1B23]">
                    All Cities
                  </h4>
                </div>

                {/* Cities List + Vertical Alphabet Scrubber Container */}
                <div className="relative flex items-start">
                  {/* Left Column: Cities Content (Cities and ABC section letters scroll together) */}
                  <div className="flex-1 min-w-0 pr-5 space-y-3 pb-8">
                    {locationSearchQuery.trim() ? (
                      /* Live search query results across all letters */
                      <div className="divide-y divide-black/5">
                        {mobileFilteredSearchCities.length > 0 ? (
                          mobileFilteredSearchCities.map((cityName) => {
                            const isSelected = city.toLowerCase() === cityName.toLowerCase();
                            return (
                              <button
                                key={cityName}
                                type="button"
                                onClick={() => handleCitySelect(cityName)}
                                className={`
                                  w-full text-left py-2 px-1 text-xs sm:text-sm transition-colors flex items-center justify-between
                                  ${isSelected ? "text-[#FF4E7A] font-bold" : "text-[#1B1B23] hover:text-[#FF4E7A] font-medium"}
                                `}
                              >
                                <span>{cityName}</span>
                                {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
                              </button>
                            );
                          })
                        ) : (
                          <p className="text-xs text-[#8C8C9E] py-4 text-center">
                            No cities found for "{locationSearchQuery}"
                          </p>
                        )}
                      </div>
                    ) : (
                      /* Full continuous A to Z list grouped by letter: ABC headers scroll naturally with cities */
                      ALPHABET_LIST.map((letter) => {
                        const citiesForLetter = ALPHABET_CITIES_MAP[letter] || [];
                        if (citiesForLetter.length === 0) return null;
                        return (
                          <div key={letter} id={`mobile-city-letter-${letter}`} className="scroll-mt-14 pt-1">
                            {/* Section letter header (scrolls with cities) */}
                            <div className="py-1">
                              <span className="text-xs font-black text-[#FF4E7A] px-1 py-0.5">
                                {letter}
                              </span>
                            </div>
                            <div className="divide-y divide-black/5 mt-0.5">
                              {citiesForLetter.map((cityName) => {
                                const isSelected = city.toLowerCase() === cityName.toLowerCase();
                                return (
                                  <button
                                    key={cityName}
                                    type="button"
                                    onClick={() => handleCitySelect(cityName)}
                                    className={`
                                      w-full text-left py-2 px-1 text-xs sm:text-sm transition-colors flex items-center justify-between
                                      ${isSelected ? "text-[#FF4E7A] font-bold" : "text-[#1B1B23] hover:text-[#FF4E7A] font-medium"}
                                    `}
                                  >
                                    <span>{cityName}</span>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Right Column: Fixed/Sticky Vertical Alphabet Scrubber (Letters animate big & small on scroll and change color) */}
                  {!locationSearchQuery.trim() && (
                    <div
                      className="
                        sticky top-11 -mr-1.5 sm:mr-0 z-30 w-6 flex-shrink-0
                        flex flex-col justify-between items-center py-0 select-none pointer-events-auto
                        h-[calc(100vh-210px)] max-h-[460px]
                      "
                      aria-label="Alphabet Scrubber"
                    >
                      {ALPHABET_LIST.map((letter, idx) => {
                        const hasCities = (ALPHABET_CITIES_MAP[letter] || []).length > 0;
                        const activeLetter = selectedLetter || "A";
                        const activeIdx = ALPHABET_LIST.indexOf(activeLetter);
                        const distance = Math.abs(idx - activeIdx);
                        const isSelected = distance === 0;

                        return (
                          <button
                            key={letter}
                            type="button"
                            disabled={!hasCities}
                            onClick={() => handleMobileLetterClick(letter)}
                            className={`
                              w-6 h-[calc((100%-4px)/26)] min-h-[14px] max-h-[18px] flex items-center justify-center
                              transition-all duration-200 ease-out transform origin-center cursor-pointer select-none
                              ${
                                !hasCities
                                  ? "text-neutral-300/40 pointer-events-none scale-75"
                                  : isSelected
                                  ? "text-[#FF4E7A] font-black scale-140 z-10"
                                  : distance === 1
                                  ? "text-[#6B6B80] font-bold scale-115"
                                  : distance === 2
                                  ? "text-[#8C8C9E] font-medium scale-100"
                                  : "text-[#A8A8B8] font-normal scale-90"
                              }
                            `}
                          >
                            <span className="text-[10px] leading-none select-none">{letter}</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>
      </motion.div>

        {/* ── 85% HEIGHT FILTERS BOTTOM SHEET ON MOBILE & TABLET (< lg) ── */}
        {isMoreFiltersOpen && (
          <div className="fixed inset-0 z-[250] lg:hidden">
            {/* Backdrop */}
            <div
              onClick={() => setIsMoreFiltersOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
            />

            {/* Sheet Container (85% height, fixed bottom sheet without whole-card drag) */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 350 }}
              className="
                fixed inset-x-0 bottom-0 z-10
                h-[85vh] max-h-[85dvh]
                bg-white rounded-t-[32px]
                shadow-[0_-16px_48px_rgba(0,0,0,0.28)]
                flex flex-col overflow-hidden
              "
            >
              {/* Top Pull Handle (Draggable / Tappable down to close) */}
              <motion.div
                drag="y"
                dragConstraints={{ top: 0, bottom: 0 }}
                dragElastic={{ top: 0, bottom: 0.6 }}
                onDragEnd={(_, info) => {
                  if (info.offset.y > 50 || info.velocity.y > 200) {
                    setIsMoreFiltersOpen(false);
                  }
                }}
                onClick={() => setIsMoreFiltersOpen(false)}
                className="pt-3.5 pb-2 flex justify-center flex-shrink-0 cursor-grab active:cursor-grabbing touch-none select-none hover:opacity-70 transition-opacity"
              >
                <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
              </motion.div>

              {/* Header */}
              <div className="px-5 py-3 border-b border-black/6 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4 text-[#FF4E7A]" />
                  <h3 className="font-display font-bold text-base text-[#1B1B23]">Filters</h3>
                  {totalSearchFiltersCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-[#FF4E7A] text-white text-[11px] font-bold flex items-center justify-center">
                      {totalSearchFiltersCount}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {totalSearchFiltersCount > 0 && (
                    <button
                      type="button"
                      onClick={handleResetFilters}
                      className="text-xs font-bold text-[#8C8C9E] hover:text-[#FF4E7A] transition-colors"
                    >
                      Reset all
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setIsMoreFiltersOpen(false)}
                    className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-neutral-600 hover:text-black active:scale-90 transition-transform"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Scrollable Filter Content */}
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6 scrollbar-hide">
                {/* 1. Category */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Category</span>
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedCategory(null)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                        !selectedCategory
                          ? "bg-[#FF4E7A] text-white shadow-xs"
                          : "bg-black/4 text-[#1B1B23] hover:bg-black/8"
                      }`}
                    >
                      All Categories
                    </button>
                    {EVENT_CATEGORIES.map((c) => (
                      <button
                        key={c.value}
                        type="button"
                        onClick={() => setSelectedCategory(selectedCategory === c.value ? null : c.value)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          selectedCategory === c.value
                            ? "bg-[#FF4E7A] text-white shadow-xs"
                            : "bg-black/4 text-[#1B1B23] hover:bg-black/8"
                        }`}
                      >
                        {c.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 2. Format */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Format</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all", label: "All Formats" },
                      { value: "offline", label: "Offline (In-person)" },
                      { value: "online", label: "Online" },
                      { value: "hybrid", label: "Hybrid" },
                    ].map((f) => (
                      <button
                        key={f.value}
                        type="button"
                        onClick={() => setFormatFilter(f.value)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          formatFilter === f.value
                            ? "bg-[#FF4E7A] text-white shadow-xs"
                            : "bg-black/4 text-[#1B1B23] hover:bg-black/8"
                        }`}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 3. Price */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Price</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: "all", label: "All Prices" },
                      { value: "free", label: "Free" },
                      { value: "paid", label: "Paid" },
                    ].map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setPriceFilter(p.value)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          priceFilter === p.value
                            ? "bg-[#FF4E7A] text-white shadow-xs"
                            : "bg-black/4 text-[#1B1B23] hover:bg-black/8"
                        }`}
                      >
                        {p.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 4. Date */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Date</span>
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: null, label: "Any time" },
                      { value: "today", label: "Today" },
                      { value: "tomorrow", label: "Tomorrow" },
                      { value: "week", label: "This week" },
                      { value: "month", label: "This month" },
                    ].map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        onClick={() => setDateFilter(d.value)}
                        className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all active:scale-95 ${
                          dateFilter === d.value
                            ? "bg-[#FF4E7A] text-white shadow-xs"
                            : "bg-black/4 text-[#1B1B23] hover:bg-black/8"
                        }`}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* 5. Distance & Features */}
                <div className="space-y-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Distance & Features</span>
                  <div className="space-y-2">
                    <button
                      type="button"
                      onClick={() => setUnder10Km(!under10Km)}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.99] ${
                        under10Km
                          ? "bg-[#FF4E7A]/5 border-[#FF4E7A]/40 text-[#FF4E7A]"
                          : "bg-black/2 border-black/5 text-[#1B1B23]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <MapPin className="w-4 h-4 text-[#FF4E7A]" />
                        <span className="text-xs font-bold">Under 10 Km</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        under10Km ? "bg-[#FF4E7A] border-[#FF4E7A] text-white" : "border-black/20 bg-white"
                      }`}>
                        {under10Km && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccessibleOnly(!accessibleOnly)}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.99] ${
                        accessibleOnly
                          ? "bg-[#FF4E7A]/5 border-[#FF4E7A]/40 text-[#FF4E7A]"
                          : "bg-black/2 border-black/5 text-[#1B1B23]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Accessibility className="w-4 h-4 text-[#FF4E7A]" />
                        <span className="text-xs font-bold">Accessible Venue</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        accessibleOnly ? "bg-[#FF4E7A] border-[#FF4E7A] text-white" : "border-black/20 bg-white"
                      }`}>
                        {accessibleOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setAccreditedOnly(!accreditedOnly)}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.99] ${
                        accreditedOnly
                          ? "bg-[#FF4E7A]/5 border-[#FF4E7A]/40 text-[#FF4E7A]"
                          : "bg-black/2 border-black/5 text-[#1B1B23]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-[#FF4E7A]" />
                        <span className="text-xs font-bold">Accredited Events</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        accreditedOnly ? "bg-[#FF4E7A] border-[#FF4E7A] text-white" : "border-black/20 bg-white"
                      }`}>
                        {accreditedOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBlockchainOnly(!blockchainOnly)}
                      className={`w-full p-3 rounded-2xl border transition-all flex items-center justify-between active:scale-[0.99] ${
                        blockchainOnly
                          ? "bg-[#FF4E7A]/5 border-[#FF4E7A]/40 text-[#FF4E7A]"
                          : "bg-black/2 border-black/5 text-[#1B1B23]"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <Tag className="w-4 h-4 text-[#FF4E7A]" />
                        <span className="text-xs font-bold">On-Chain Verified</span>
                      </div>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        blockchainOnly ? "bg-[#FF4E7A] border-[#FF4E7A] text-white" : "border-black/20 bg-white"
                      }`}>
                        {blockchainOnly && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer Sticky CTA */}
              <div className="p-4 border-t border-black/6 bg-white flex items-center gap-3 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="py-3 px-5 rounded-full text-xs sm:text-sm font-bold text-neutral-600 hover:text-black bg-black/5 active:scale-95 transition-all"
                >
                  Reset All
                </button>
                <button
                  type="button"
                  onClick={() => setIsMoreFiltersOpen(false)}
                  className="flex-1 py-3 px-6 rounded-full text-xs sm:text-sm font-bold text-white bg-[#FF4E7A] hover:bg-[#e03d67] shadow-md transition-all active:scale-95 text-center flex items-center justify-center gap-2"
                >
                  <span>Done ({filteredEvents.length})</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </motion.div>
      )}
    </AnimatePresence>
  );
}

export default SearchModal;
