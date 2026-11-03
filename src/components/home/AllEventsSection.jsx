import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accessibility,
  ArrowLeft,
  Award,
  Building2,
  Calendar,
  Check,
  ChevronDown,
  CreditCard,
  Gift,
  GraduationCap,
  Landmark,
  Layers,
  Loader2,
  MapPin,
  Monitor,
  RotateCw,
  Search,
  ShieldCheck,
  Shuffle,
  SlidersHorizontal,
  Tag,
  X,
} from "lucide-react";
import { EventCard } from "@/components/events/EventCard";
import { api } from "@/lib/api";
import { EVENT_CATEGORIES, categoryImage, categoryLabel } from "@/lib/eventCategories";
import { detectCoords, detectLocation } from "@/lib/location";
import { dateFilterRange, inDateRange, matchesPrice } from "@/lib/eventFilters";
import { MOCK_EVENTS } from "@/lib/mockData";

const NEAR_RADIUS_KM = 10;

const PRICE_OPTIONS = [
  { value: "all", label: "All Prices" },
  { value: "free", label: "Free Events" },
  { value: "paid", label: "Paid Events" },
];

const FORMAT_OPTIONS = [
  { value: "all", label: "All Formats", icon: Layers },
  { value: "IN_PERSON", label: "In-person", icon: Building2 },
  { value: "ONLINE", label: "Online", icon: Monitor },
  { value: "HYBRID", label: "Hybrid", icon: Shuffle },
];

export function AllEventsSection({ initialEvents = MOCK_EVENTS }) {
  const [searchParams] = useSearchParams();
  const [events, setEvents] = useState(initialEvents && initialEvents.length > 0 ? initialEvents : MOCK_EVENTS);
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("all");
  const [format, setFormat] = useState("all");
  const [dateFilter, setDateFilter] = useState("any");
  const [locationQuery, setLocationQuery] = useState("");
  const [accessibleOnly, setAccessibleOnly] = useState(false);
  const [accreditedOnly, setAccreditedOnly] = useState(false);
  const [blockchainOnly, setBlockchainOnly] = useState(false);
  const [nearMe, setNearMe] = useState(false);
  const [coords, setCoords] = useState(undefined);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleCount, setVisibleCount] = useState(8);
  const [error, setError] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [openDropdown, setOpenDropdown] = useState(null); // 'price' | 'category' | 'format' | null
  const [isMoreFiltersOpen, setIsMoreFiltersOpen] = useState(false);
  const [isMobileFilterSheetOpen, setIsMobileFilterSheetOpen] = useState(false);
  const firstRun = useRef(true);

  // Lock body scroll when mobile 70% filter bottom sheet is open
  useEffect(() => {
    if (isMobileFilterSheetOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileFilterSheetOpen]);

  // Sync incoming filters from search popup (URL query params)
  useEffect(() => {
    const cat = searchParams.get("category");
    const pr = searchParams.get("price");
    const fmt = searchParams.get("format");
    const dt = searchParams.get("date");
    const loc = searchParams.get("location") || searchParams.get("city");
    const near = searchParams.get("nearMe");
    const acc = searchParams.get("accessible");
    const acr = searchParams.get("accredited");
    const blk = searchParams.get("blockchain");
    const q = searchParams.get("q");

    setCategory(cat !== null ? cat : "");
    setPrice(pr !== null ? pr : "all");
    setFormat(fmt !== null ? fmt : "all");
    setDateFilter(dt !== null ? dt : "any");
    setLocationQuery(q || loc || "");
    setNearMe(near === "true");
    setAccessibleOnly(acc === "true");
    setAccreditedOnly(acr === "true");
    setBlockchainOnly(blk === "true");
    setVisibleCount(8);
  }, [searchParams]);

  const priceRef = useRef(null);
  const categoryRef = useRef(null);
  const formatRef = useRef(null);
  const moreFiltersRef = useRef(null);

  // Close dropdowns on outside click or escape key
  useEffect(() => {
    const handleOutside = (e) => {
      if (
        priceRef.current && !priceRef.current.contains(e.target) &&
        categoryRef.current && !categoryRef.current.contains(e.target) &&
        formatRef.current && !formatRef.current.contains(e.target) &&
        moreFiltersRef.current && !moreFiltersRef.current.contains(e.target)
      ) {
        setOpenDropdown(null);
        setIsMoreFiltersOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === "Escape") {
        setOpenDropdown(null);
        setIsMoreFiltersOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("touchstart", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("touchstart", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    if (initialEvents && initialEvents.length > 0) {
      setEvents(initialEvents);
    }
  }, [initialEvents]);

  // Whether "Under 10 Km" can work at all — needs the viewer's coordinates.
  useEffect(() => {
    detectCoords().then(setCoords);
  }, []);

  useEffect(() => {
    if (firstRun.current && initialEvents && initialEvents.length > 0) {
      firstRun.current = false;
      return;
    }
    firstRun.current = false;
    let cancelled = false;
    setLoading(true);
    setError(false);
    setVisibleCount(8);

    const load = async () => {
      if (nearMe && coords) {
        const res = await api.events.nearby({
          lat: coords.lat,
          lng: coords.lng,
          radiusKm: NEAR_RADIUS_KM,
          category: category || undefined,
          limit: 60,
        });
        return res.events.filter((e) => inDateRange(e, dateFilter));
      }
      const loc = await detectLocation();
      return api.events.list({
        category: category || undefined,
        ...dateFilterRange(dateFilter),
        near: loc?.city,
        nearCountry: loc?.country ?? undefined,
      });
    };

    load()
      .then((list) => {
        if (!cancelled) setEvents(list || []);
      })
      .catch(() => {
        if (!cancelled) setError(true);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [category, dateFilter, nearMe, coords, reloadKey]);

  // Combined filtering across Price, Category, Format, Date, Location, and Advanced Toggles
  const allFiltered = (events || []).filter((e) => {
    if (!matchesPrice(e, price)) return false;
    if (category && e.category !== category) return false;
    if (format !== "all" && e.format !== format) return false;
    if (!inDateRange(e, dateFilter)) return false;
    if (locationQuery.trim()) {
      let q = locationQuery.toLowerCase().trim();
      // If query is formatted like "Category : search term", extract the search term
      if (q.includes(":")) {
        q = q.split(":").slice(1).join(":").trim();
      }
      if (q) {
        const matchName = e.name?.toLowerCase().includes(q);
        const matchCity = e.city?.toLowerCase().includes(q);
        const matchVenue = e.venue?.toLowerCase().includes(q);
        const matchAddress = e.address?.toLowerCase().includes(q);
        if (!matchName && !matchCity && !matchVenue && !matchAddress) return false;
      }
    }
    if (accessibleOnly && !e.isAccessible) return false;
    if (accreditedOnly && !e.isAccredited) return false;
    if (blockchainOnly && !e.isBlockchain) return false;
    return true;
  });

  const shown = allFiltered.slice(0, visibleCount);
  const hasMore = visibleCount < allFiltered.length;
  const filtered =
    category !== "" ||
    price !== "all" ||
    format !== "all" ||
    dateFilter !== "any" ||
    nearMe ||
    locationQuery.trim() !== "" ||
    accessibleOnly ||
    accreditedOnly ||
    blockchainOnly;

  const activeAdvancedCount =
    (accessibleOnly ? 1 : 0) +
    (accreditedOnly ? 1 : 0) +
    (blockchainOnly ? 1 : 0);

  const totalActiveFiltersCount =
    (category ? 1 : 0) +
    (price !== "all" ? 1 : 0) +
    (format !== "all" ? 1 : 0) +
    (dateFilter !== "any" ? 1 : 0) +
    (nearMe ? 1 : 0) +
    (accessibleOnly ? 1 : 0) +
    (accreditedOnly ? 1 : 0) +
    (blockchainOnly ? 1 : 0);

  const clear = () => {
    setCategory("");
    setPrice("all");
    setFormat("all");
    setDateFilter("any");
    setNearMe(false);
    setLocationQuery("");
    setAccessibleOnly(false);
    setAccreditedOnly(false);
    setBlockchainOnly(false);
    setVisibleCount(8);
    setOpenDropdown(null);
    setIsMobileFilterSheetOpen(false);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => prev + 4);
      setLoadingMore(false);
    }, 250);
  };

  const selectedCategoryLabel = EVENT_CATEGORIES.find((c) => c.value === category)?.label;
  const selectedFormatLabel = FORMAT_OPTIONS.find((f) => f.value === format)?.label;

  const toolbar = (
    <div className="flex items-center gap-2 lg:gap-3 overflow-visible py-1 flex-wrap">
      {/* ── 1. Modern Price Dropdown ── */}
      <div className="relative flex-shrink-0" ref={priceRef}>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "price" ? null : "price")}
          aria-expanded={openDropdown === "price"}
          className={`
            inline-flex items-center gap-1.5 sm:gap-2 text-xs lg:text-sm font-semibold
            px-3 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl
            backdrop-blur-md transition-all duration-200 active:scale-95
            ${
              price !== "all"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white/85 hover:bg-white text-[#1B1B23] border border-black/8 hover:border-black/15 shadow-xs"
            }
          `}
        >
          <Tag className={`w-3.5 h-3.5 ${price !== "all" ? "text-white" : "text-[#8C8C9E]"}`} />
          <span>{price === "all" ? "Price" : price === "free" ? "Free" : "Paid"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
              openDropdown === "price" ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Fluid Glass Animated Popover */}
        <div
          className={`
            absolute left-0 top-full mt-2 z-30
            min-w-[170px] p-1.5
            bg-white/95 backdrop-blur-2xl rounded-2xl
            border border-black/8 shadow-[0_16px_36px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)]
            transition-all duration-200 ease-out origin-top-left
            ${
              openDropdown === "price"
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }
          `}
        >
          {PRICE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                setPrice(opt.value);
                setOpenDropdown(null);
                setVisibleCount(8);
              }}
              className={`
                w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold
                flex items-center justify-between transition-colors
                ${
                  price === opt.value
                    ? "bg-[#FF4E7A]/10 text-[#FF4E7A]"
                    : "text-[#1B1B23] hover:bg-black/5"
                }
              `}
            >
              <span>{opt.label}</span>
              {price === opt.value && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
            </button>
          ))}
        </div>
      </div>

      {/* ── 2. Modern Category Dropdown ── */}
      <div className="relative flex-shrink-0" ref={categoryRef}>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
          aria-expanded={openDropdown === "category"}
          className={`
            inline-flex items-center gap-1.5 sm:gap-2 text-xs lg:text-sm font-semibold
            px-3 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl
            backdrop-blur-md transition-all duration-200 active:scale-95
            ${
              category
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white/85 hover:bg-white text-[#1B1B23] border border-black/8 hover:border-black/15 shadow-xs"
            }
          `}
        >
          <SlidersHorizontal className={`w-3.5 h-3.5 ${category ? "text-white" : "text-[#8C8C9E]"}`} />
          <span className="max-w-[130px] truncate">{selectedCategoryLabel || "Categories"}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
              openDropdown === "category" ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Fluid Glass Animated Popover */}
        <div
          className={`
            absolute left-0 top-full mt-2 z-30
            min-w-[230px] max-h-[300px] overflow-y-auto p-1.5
            bg-white/95 backdrop-blur-2xl rounded-2xl
            border border-black/8 shadow-[0_16px_36px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)]
            transition-all duration-200 ease-out origin-top-left scrollbar-hide
            ${
              openDropdown === "category"
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }
          `}
        >
          <button
            type="button"
            onClick={() => {
              setCategory("");
              setOpenDropdown(null);
              setVisibleCount(8);
            }}
            className={`
              w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold
              flex items-center justify-between transition-colors
              ${
                category === ""
                  ? "bg-[#FF4E7A]/10 text-[#FF4E7A]"
                  : "text-[#1B1B23] hover:bg-black/5"
              }
            `}
          >
            <span>All Categories</span>
            {category === "" && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
          </button>
          {EVENT_CATEGORIES.map((c) => (
            <button
              key={c.value}
              type="button"
              onClick={() => {
                setCategory(c.value);
                setOpenDropdown(null);
                setVisibleCount(8);
              }}
              className={`
                w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold
                flex items-center justify-between transition-colors
                ${
                  category === c.value
                    ? "bg-[#FF4E7A]/10 text-[#FF4E7A]"
                    : "text-[#1B1B23] hover:bg-black/5"
                }
              `}
            >
              <span>{c.label}</span>
              {category === c.value && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
            </button>
          ))}
        </div>
      </div>

      {/* ── 3. Modern Format Dropdown (Beside Categories & Price) ── */}
      <div className="relative flex-shrink-0" ref={formatRef}>
        <button
          type="button"
          onClick={() => setOpenDropdown(openDropdown === "format" ? null : "format")}
          aria-expanded={openDropdown === "format"}
          className={`
            inline-flex items-center gap-1.5 sm:gap-2 text-xs lg:text-sm font-semibold
            px-3 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl
            backdrop-blur-md transition-all duration-200 active:scale-95
            ${
              format !== "all"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white/85 hover:bg-white text-[#1B1B23] border border-black/8 hover:border-black/15 shadow-xs"
            }
          `}
        >
          <Building2 className={`w-3.5 h-3.5 ${format !== "all" ? "text-white" : "text-[#8C8C9E]"}`} />
          <span>{format === "all" ? "Format" : selectedFormatLabel}</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-300 ease-out ${
              openDropdown === "format" ? "rotate-180" : ""
            }`}
          />
        </button>

        {/* Fluid Glass Animated Popover */}
        <div
          className={`
            absolute left-0 top-full mt-2 z-30
            min-w-[170px] p-1.5
            bg-white/95 backdrop-blur-2xl rounded-2xl
            border border-black/8 shadow-[0_16px_36px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)]
            transition-all duration-200 ease-out origin-top-left
            ${
              openDropdown === "format"
                ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
                : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
            }
          `}
        >
          {FORMAT_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  setFormat(opt.value);
                  setOpenDropdown(null);
                  setVisibleCount(8);
                }}
                className={`
                  w-full text-left px-3.5 py-2 rounded-xl text-xs font-bold
                  flex items-center justify-between transition-colors
                  ${
                    format === opt.value
                      ? "bg-[#FF4E7A]/10 text-[#FF4E7A]"
                      : "text-[#1B1B23] hover:bg-black/5"
                  }
                `}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-3.5 h-3.5 text-neutral-500" />
                  <span>{opt.label}</span>
                </div>
                {format === opt.value && <Check className="w-3.5 h-3.5 text-[#FF4E7A]" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── 4. Quick Date Filter Chips ── */}
      {[
        ["today", "Today"],
        ["week", "This week"],
        ["month", "This month"],
      ].map(([val, label]) => {
        const active = dateFilter === val;
        return (
          <button
            key={val}
            type="button"
            aria-pressed={active}
            onClick={() => {
              setDateFilter(active ? "any" : val);
              setVisibleCount(8);
            }}
            className={`
              flex-shrink-0 inline-flex items-center text-xs lg:text-sm font-semibold
              px-3 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl
              backdrop-blur-md transition-all duration-200 active:scale-95
              ${
                active
                  ? "bg-[#FF4E7A] text-white shadow-xs"
                  : "bg-white/85 hover:bg-white text-[#1B1B23] border border-black/8 hover:border-black/15 shadow-xs hover:text-[#FF4E7A]"
              }
            `}
          >
            {label}
          </button>
        );
      })}

      {/* ── 5. Distance Radar Filter ── */}
      <button
        type="button"
        aria-pressed={nearMe}
        disabled={coords === null}
        title={coords === null ? "Allow location access to see events near you" : undefined}
        onClick={() => {
          setNearMe((v) => !v);
          setVisibleCount(8);
        }}
        className={`
          flex-shrink-0 inline-flex items-center gap-1.5 text-xs lg:text-sm font-semibold
          px-3 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl
          backdrop-blur-md transition-all duration-200 active:scale-95
          ${
            nearMe
              ? "bg-[#FF4E7A] text-white shadow-xs"
              : coords === null
              ? "bg-white/50 text-[#8C8C9E] cursor-not-allowed border border-black/5"
              : "bg-white/85 hover:bg-white text-[#1B1B23] border border-black/8 hover:border-black/15 shadow-xs hover:text-[#FF4E7A]"
          }
        `}
      >
        <MapPin className={`w-3.5 h-3.5 ${nearMe ? "text-white" : "text-[#8C8C9E]"}`} />
        <span>Under {NEAR_RADIUS_KM} Km</span>
      </button>

      {/* ── 6. More Filters Contextual Popover (Windows right-click style dropdown) ── */}
      <div className="relative flex-shrink-0" ref={moreFiltersRef}>
        <button
          type="button"
          onClick={() => {
            setOpenDropdown(null);
            setIsMoreFiltersOpen((prev) => !prev);
          }}
          className={`
            inline-flex items-center gap-1.5 sm:gap-2 text-xs lg:text-sm font-semibold
            px-3 sm:px-3.5 lg:px-4 py-2 sm:py-2.5 rounded-xl sm:rounded-2xl
            backdrop-blur-md transition-all duration-200 active:scale-95
            ${
              activeAdvancedCount > 0
                ? "bg-[#1B1B23] text-white shadow-xs"
                : "bg-white/85 hover:bg-white text-[#1B1B23] border border-black/8 hover:border-black/15 shadow-xs hover:border-[#FF4E7A]/40"
            }
          `}
        >
          <SlidersHorizontal className={`w-3.5 h-3.5 ${activeAdvancedCount > 0 ? "text-[#FF4E7A]" : "text-[#8C8C9E]"}`} />
          <span>More Filters</span>
          {activeAdvancedCount > 0 && (
            <span className="w-5 h-5 rounded-full bg-[#FF4E7A] text-white text-[10px] font-bold flex items-center justify-center">
              {activeAdvancedCount}
            </span>
          )}
          <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isMoreFiltersOpen ? "rotate-180" : ""}`} />
        </button>

        {isMoreFiltersOpen && (
          <div
            className="
              absolute right-0 top-full mt-2 z-30
              min-w-[220px] p-2
              bg-white/95 backdrop-blur-2xl rounded-2xl
              border border-black/8 shadow-[0_16px_36px_rgba(0,0,0,0.12),0_2px_6px_rgba(0,0,0,0.04)]
              animate-in fade-in zoom-in-95 -translate-y-1 duration-200
            "
          >
            {/* 1. Accessible Venue */}
            <div className="relative group/tooltip">
              <button
                type="button"
                role="checkbox"
                aria-checked={accessibleOnly}
                title="Wheelchair & step-free accessible venue"
                onClick={() => {
                  setAccessibleOnly((v) => !v);
                  setVisibleCount(8);
                }}
                className={`
                  w-full text-left px-3 py-2 rounded-xl text-xs font-bold
                  flex items-center justify-between transition-all group
                  ${
                    accessibleOnly
                      ? "bg-[#FF4E7A]/10 text-[#FF4E7A]"
                      : "text-[#1B1B23] hover:bg-black/5"
                  }
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

              {/* Hover Tooltip Label */}
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
                onClick={() => {
                  setAccreditedOnly((v) => !v);
                  setVisibleCount(8);
                }}
                className={`
                  w-full text-left px-3 py-2 rounded-xl text-xs font-bold
                  flex items-center justify-between transition-all group
                  ${
                    accreditedOnly
                      ? "bg-[#FF4E7A]/10 text-[#FF4E7A]"
                      : "text-[#1B1B23] hover:bg-black/5"
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <Award className={`w-3.5 h-3.5 transition-colors ${accreditedOnly ? "text-[#FF4E7A]" : "text-neutral-500 group-hover:text-[#1B1B23]"}`} />
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

              {/* Hover Tooltip Label */}
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
                onClick={() => {
                  setBlockchainOnly((v) => !v);
                  setVisibleCount(8);
                }}
                className={`
                  w-full text-left px-3 py-2 rounded-xl text-xs font-bold
                  flex items-center justify-between transition-all group
                  ${
                    blockchainOnly
                      ? "bg-[#FF4E7A]/10 text-[#FF4E7A]"
                      : "text-[#1B1B23] hover:bg-black/5"
                  }
                `}
              >
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className={`w-3.5 h-3.5 transition-colors ${blockchainOnly ? "text-[#FF4E7A]" : "text-neutral-500 group-hover:text-[#1B1B23]"}`} />
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

              {/* Hover Tooltip Label */}
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
                  setVisibleCount(8);
                }}
                disabled={activeAdvancedCount === 0}
                className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  activeAdvancedCount > 0
                    ? "text-neutral-600 hover:text-[#FF4E7A] hover:bg-[#FF4E7A]/10 active:scale-95"
                    : "text-neutral-300 cursor-not-allowed"
                }`}
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setIsMoreFiltersOpen(false)}
                className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-[#FF4E7A] hover:bg-[#e03d67] shadow-sm transition-all active:scale-95"
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── 7. Reset All Pill (Fluidly reveals when filters active) ── */}
      {filtered && (
        <button
          type="button"
          onClick={clear}
          className="
            flex-shrink-0 inline-flex items-center gap-1 text-xs font-bold
            text-[#8C8C9E] hover:text-[#FF4E7A] bg-black/4 hover:bg-[#FF4E7A]/10
            px-3.5 py-2.5 rounded-2xl
            transition-all duration-200 active:scale-95
          "
        >
          <X className="w-3.5 h-3.5" />
          <span>Reset</span>
        </button>
      )}

      {loading && <Loader2 className="w-4 h-4 text-[#FF4E7A] animate-spin flex-shrink-0 ml-1" aria-label="Loading" />}
    </div>
  );

  // Calculate dynamic display title: "Results for : [Searched Name / Category]"
  const rawQ = searchParams.get("q") || locationQuery;
  let displayTitle = "All Events";
  if (rawQ && rawQ.trim()) {
    const cleanQ = rawQ.replace(/\s*:\s*$/, "").trim();
    displayTitle = `Results for : ${cleanQ}`;
  } else if (selectedCategoryLabel) {
    displayTitle = `Results for : ${selectedCategoryLabel}`;
  }

  return (
    <section id="all-events-section" className="space-y-4 lg:space-y-6 scroll-mt-24">
      {/* Section Title */}
      <div className="flex items-center justify-between">
        <h2 className="font-display font-bold text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl leading-tight text-[#FF4E7A]">
          {displayTitle}
        </h2>
        {(displayTitle !== "All Events" || filtered) && (
          <span className="text-xs sm:text-sm font-semibold text-[#8C8C9E]">
            {allFiltered.length} {allFiltered.length === 1 ? "event" : "events"} found
          </span>
        )}
      </div>

      {/* ── Sticky Filters Toolbar: Only Filters Fixed, No Shadows ── */}
      <div
        className="sticky z-40 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8 py-2 bg-[#F5F0EB]/95 backdrop-blur-md border-b border-black/5 transition-all shadow-none"
        style={{ top: "var(--navbar-height, 64px)" }}
      >
        {/* Mobile & Tablet Toolbar (< lg): Quick Clickable Filters (Today, Tomorrow, Under 10km, More filters) */}
        <div className="lg:hidden flex items-center gap-1.5 overflow-x-auto scrollbar-hide py-1 touch-pan-x select-none">
          {/* Today */}
          <button
            type="button"
            onClick={() => {
              setDateFilter(dateFilter === "today" ? "any" : "today");
              setVisibleCount(8);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all active:scale-95 ${
              dateFilter === "today"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-[#1B1B23] border border-black/8 shadow-2xs hover:border-[#FF4E7A]/30"
            }`}
          >
            Today
          </button>

          {/* Tomorrow */}
          <button
            type="button"
            onClick={() => {
              setDateFilter(dateFilter === "tomorrow" ? "any" : "tomorrow");
              setVisibleCount(8);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 transition-all active:scale-95 ${
              dateFilter === "tomorrow"
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-[#1B1B23] border border-black/8 shadow-2xs hover:border-[#FF4E7A]/30"
            }`}
          >
            Tomorrow
          </button>

          {/* Under 10 Km */}
          <button
            type="button"
            onClick={() => {
              setNearMe(!nearMe);
              setVisibleCount(8);
            }}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 flex items-center gap-1 transition-all active:scale-95 ${
              nearMe
                ? "bg-[#FF4E7A] text-white shadow-xs"
                : "bg-white text-[#1B1B23] border border-black/8 shadow-2xs hover:border-[#FF4E7A]/30"
            }`}
          >
            <MapPin className={`w-3.5 h-3.5 ${nearMe ? "text-white" : "text-[#8C8C9E]"}`} />
            <span>Under 10 Km</span>
          </button>

          {/* More filters (Opens 70% Bottom Sheet) */}
          <button
            type="button"
            onClick={() => setIsMobileFilterSheetOpen(true)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold flex-shrink-0 flex items-center gap-1.5 transition-all active:scale-95 ${
              totalActiveFiltersCount > 0
                ? "bg-[#1B1B23] text-white shadow-xs"
                : "bg-white text-[#1B1B23] border border-black/8 shadow-2xs hover:border-[#FF4E7A]/30"
            }`}
          >
            <SlidersHorizontal className={`w-3.5 h-3.5 ${totalActiveFiltersCount > 0 ? "text-[#FF4E7A]" : "text-[#8C8C9E]"}`} />
            <span>More filters</span>
            {totalActiveFiltersCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#FF4E7A] text-white text-[10px] font-bold flex items-center justify-center">
                {totalActiveFiltersCount}
              </span>
            )}
          </button>

          {/* Reset (if active) */}
          {filtered && (
            <button
              type="button"
              onClick={clear}
              className="px-2.5 py-1.5 rounded-full text-xs font-bold text-[#8C8C9E] hover:text-[#FF4E7A] bg-black/5 flex-shrink-0 active:scale-95 transition-colors"
            >
              Reset
            </button>
          )}
        </div>

        {/* Desktop Toolbar (>= lg) */}
        <div className="hidden lg:block">
          {toolbar}
        </div>
      </div>

      {error ? (
        <div className="bg-white rounded-3xl p-8 text-center text-sm text-[#1B1B23] border border-black/8 shadow-xs max-w-lg mx-auto">
          <p className="font-bold mb-2">Couldn&apos;t load events.</p>
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="inline-flex items-center gap-1.5 text-[#FF4E7A] font-bold hover:underline"
          >
            <RotateCw className="w-4 h-4" /> Try again
          </button>
        </div>
      ) : shown.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center text-sm text-[#1B1B23] border border-black/8 shadow-xs max-w-lg mx-auto space-y-3">
          <p className="font-bold text-base text-[#1B1B23]">
            {loading ? "Loading events…" : "No events match these filters."}
          </p>
          <p className="text-xs text-[#8C8C9E]">
            Try relaxing your filter criteria or search query to discover more events.
          </p>
          {!loading && (
            <button
              type="button"
              onClick={clear}
              className="inline-flex items-center gap-1.5 text-[#FF4E7A] font-bold hover:underline pt-2"
            >
              <RotateCw className="w-3.5 h-3.5" /> Reset all filters
            </button>
          )}
        </div>
      ) : (
        <div className={`grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2.5 sm:gap-4.5 lg:gap-5.5 ${loading ? "opacity-60 transition-opacity" : "transition-opacity"}`}>
          {shown.map((event) => (
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
        </div>
      )}

      {/* Centered Load More Button */}
      {hasMore && (
        <div className="flex justify-center pt-4 lg:pt-6">
          <button
            type="button"
            onClick={handleLoadMore}
            disabled={loadingMore}
            className="
              inline-flex items-center gap-2
              bg-white/80 hover:bg-white
              text-[#1B1B23] text-sm font-bold
              px-8 py-3 rounded-full
              backdrop-blur-md border border-black/10 hover:border-black/20
              shadow-xs hover:shadow-md active:scale-95
              transition-all duration-200
            "
          >
            {loadingMore ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-[#FF4E7A]" />
                <span>Loading more events…</span>
              </>
            ) : (
              <span>Load More Events</span>
            )}
          </button>
        </div>
      )}

      {/* ── 70% HEIGHT BOTTOM SHEET MODAL ON MOBILE & TABLET (< lg) ── */}
      {isMobileFilterSheetOpen && (
        <div className="fixed inset-0 z-[200] lg:hidden">
          {/* Backdrop */}
          <div
            onClick={() => setIsMobileFilterSheetOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          />

          {/* Sheet Container (85% height, rock-solid fixed at bottom, inside elements scroll) */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 32, stiffness: 380 }}
            className="
              fixed inset-x-0 bottom-0 z-[210]
              h-[85vh] max-h-[85dvh]
              bg-white rounded-t-[32px]
              shadow-[0_-16px_48px_rgba(0,0,0,0.28)]
              flex flex-col overflow-hidden
            "
          >
            {/* Top Pull Handle (Tappable to close) */}
            <div
              onClick={() => setIsMobileFilterSheetOpen(false)}
              className="pt-3.5 pb-2 flex justify-center flex-shrink-0 cursor-pointer select-none hover:opacity-70 transition-opacity"
            >
              <div className="w-12 h-1.5 bg-neutral-300 rounded-full" />
            </div>

            {/* Header */}
            <div className="px-5 py-3 border-b border-black/6 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#FF4E7A]" />
                <h3 className="font-display font-bold text-base text-[#1B1B23]">Filters</h3>
                {totalActiveFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#FF4E7A] text-white text-[11px] font-bold flex items-center justify-center">
                    {totalActiveFiltersCount}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                {filtered && (
                  <button
                    type="button"
                    onClick={clear}
                    className="text-xs font-bold text-[#8C8C9E] hover:text-[#FF4E7A] transition-colors"
                  >
                    Reset all
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => setIsMobileFilterSheetOpen(false)}
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
                    onClick={() => setCategory("")}
                    className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                      category === ""
                        ? "bg-[#FF4E7A] text-white shadow-xs"
                        : "bg-neutral-100 text-[#1B1B23] hover:bg-neutral-200"
                    }`}
                  >
                    All Categories
                  </button>
                  {EVENT_CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(category === c.value ? "" : c.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                        category === c.value
                          ? "bg-[#FF4E7A] text-white shadow-xs"
                          : "bg-neutral-100 text-[#1B1B23] hover:bg-neutral-200"
                      }`}
                    >
                      <span>{c.label}</span>
                      {category === c.value && <Check className="w-3 h-3 stroke-[3]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. When / Date */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">When</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    ["any", "Any Date"],
                    ["today", "Today"],
                    ["tomorrow", "Tomorrow"],
                    ["week", "This Week"],
                    ["month", "This Month"],
                  ].map(([val, label]) => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setDateFilter(dateFilter === val ? "any" : val)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        dateFilter === val
                          ? "bg-[#FF4E7A] text-white shadow-xs"
                          : "bg-neutral-100 text-[#1B1B23] hover:bg-neutral-200"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 3. Distance */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Distance</span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setNearMe(!nearMe)}
                    className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all ${
                      nearMe
                        ? "bg-[#FF4E7A] text-white shadow-xs"
                        : "bg-neutral-100 text-[#1B1B23] hover:bg-neutral-200"
                    }`}
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    <span>Under 10 Km</span>
                    {nearMe && <Check className="w-3 h-3 stroke-[3]" />}
                  </button>
                </div>
              </div>

              {/* 4. Format */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Format</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All Formats" },
                    { value: "IN_PERSON", label: "In-Person" },
                    { value: "ONLINE", label: "Online" },
                    { value: "HYBRID", label: "Hybrid" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormat(opt.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        format === opt.value
                          ? "bg-[#FF4E7A] text-white shadow-xs"
                          : "bg-neutral-100 text-[#1B1B23] hover:bg-neutral-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 5. Price */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Price</span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { value: "all", label: "All Prices" },
                    { value: "free", label: "Free Events" },
                    { value: "paid", label: "Paid Events" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setPrice(opt.value)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                        price === opt.value
                          ? "bg-[#FF4E7A] text-white shadow-xs"
                          : "bg-neutral-100 text-[#1B1B23] hover:bg-neutral-200"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Special Verification & Badges */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B80]">Special Features</span>
                <div className="space-y-2">
                  {/* Accessible */}
                  <button
                    type="button"
                    onClick={() => setAccessibleOnly(!accessibleOnly)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                      accessibleOnly
                        ? "bg-[#FF4E7A]/10 border-[#FF4E7A] text-[#FF4E7A]"
                        : "bg-white border-black/8 text-[#1B1B23]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Accessibility className="w-4 h-4" />
                      <span>Accessible Venue</span>
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      accessibleOnly ? "bg-[#FF4E7A] border-[#FF4E7A] text-white" : "border-neutral-300"
                    }`}>
                      {accessibleOnly && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  {/* Accredited */}
                  <button
                    type="button"
                    onClick={() => setAccreditedOnly(!accreditedOnly)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                      accreditedOnly
                        ? "bg-[#FF4E7A]/10 border-[#FF4E7A] text-[#FF4E7A]"
                        : "bg-white border-black/8 text-[#1B1B23]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Accredited Events</span>
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      accreditedOnly ? "bg-[#FF4E7A] border-[#FF4E7A] text-white" : "border-neutral-300"
                    }`}>
                      {accreditedOnly && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>

                  {/* On-Chain Verified */}
                  <button
                    type="button"
                    onClick={() => setBlockchainOnly(!blockchainOnly)}
                    className={`w-full px-3.5 py-2.5 rounded-2xl border text-xs font-bold flex items-center justify-between transition-all ${
                      blockchainOnly
                        ? "bg-[#FF4E7A]/10 border-[#FF4E7A] text-[#FF4E7A]"
                        : "bg-white border-black/8 text-[#1B1B23]"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Tag className="w-4 h-4" />
                      <span>On-Chain Verified</span>
                    </div>
                    <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                      blockchainOnly ? "bg-[#FF4E7A] border-[#FF4E7A] text-white" : "border-neutral-300"
                    }`}>
                      {blockchainOnly && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                </div>
              </div>
            </div>

            {/* Sticky Bottom Actions Footer */}
            <div className="px-5 py-3 border-t border-black/8 bg-white flex items-center gap-3 flex-shrink-0">
              <button
                type="button"
                onClick={() => {
                  clear();
                }}
                className="px-4 py-3 rounded-full text-xs font-bold text-neutral-600 bg-neutral-100 hover:bg-neutral-200 transition-colors active:scale-95"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFilterSheetOpen(false)}
                className="flex-1 py-3 px-6 rounded-full text-xs sm:text-sm font-bold text-white bg-[#FF4E7A] hover:bg-[#e03d67] shadow-md transition-all active:scale-95 text-center"
              >
                Show {allFiltered.length} Events
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </section>
  );
}

export default AllEventsSection;

