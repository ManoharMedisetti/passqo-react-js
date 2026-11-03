import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

// Responsive home section heading: scales smoothly from mobile up to desktop
export const SECTION_TITLE = "font-display font-bold text-xl sm:text-2xl md:text-3xl lg:text-[32px] xl:text-4xl leading-tight text-[#FF4E7A]";

/**
 * Figma v1 home row:
 * pink heading, ‹ › arrows top-right, a horizontally scrolling track and page dots underneath.
 */
export function Carousel({
  title,
  seeAllHref,
  toolbar,
  dots = true,
  children = [],
  itemClassName = "w-[82%] sm:w-[48%] md:w-[calc((100%-32px)/3)] lg:w-[calc((100%-48px)/4)] xl:w-[calc((100%-48px)/4)] 2xl:w-[calc((100%-48px)/4)]",
}) {
  const trackRef = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(0);

  const measure = useCallback(() => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft < max - 4);
    const total = Math.max(1, Math.ceil(el.scrollWidth / el.clientWidth - 0.05));
    setPages(total);
    setPage(max <= 0 ? 0 : Math.round((el.scrollLeft / max) * (total - 1)));
  }, []);

  useEffect(() => {
    measure();
    const el = trackRef.current;
    if (!el) return;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, children]);

  const scrollByPage = (dir) => {
    const el = trackRef.current;
    if (el) el.scrollBy({ left: dir * el.clientWidth, behavior: "smooth" });
  };

  const goTo = (i) => {
    const el = trackRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    el.scrollTo({ left: pages > 1 ? (max * i) / (pages - 1) : 0, behavior: "smooth" });
  };

  const scrollable = canPrev || canNext;

  return (
    <section className="space-y-5 lg:space-y-8">
      {title && (
        <div className="flex items-center justify-between">
          <h2 className={SECTION_TITLE}>{title}</h2>
        </div>
      )}

      {toolbar}

      <div
        ref={trackRef}
        onScroll={measure}
        className="flex gap-4 lg:gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0 py-3"
      >
        {children.map((child, i) => (
          <div key={i} className={`flex-shrink-0 snap-start ${itemClassName}`}>{child}</div>
        ))}
      </div>

      {dots && pages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          {/* Chevron Left Before Dots */}
          <button
            type="button"
            onClick={() => scrollByPage(-1)}
            disabled={!canPrev}
            aria-label="Previous page"
            className="w-8 h-8 rounded-full bg-white text-[#1B1B23] border border-black/10 shadow-xs flex items-center justify-center transition-all hover:bg-neutral-50 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronLeft className="w-4 h-4" strokeWidth={2.5} />
          </button>

          {/* Pagination Dots */}
          <div className="flex items-center gap-1.5" role="tablist" aria-label="Carousel pages">
            {Array.from({ length: pages }, (_, i) => (
              <button
                key={i}
                role="tab"
                aria-selected={i === page}
                aria-label={`Page ${i + 1} of ${pages}`}
                onClick={() => goTo(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === page ? "w-4 bg-[#FF4E7A]" : "w-1.5 bg-[#1B1B23]/25 hover:bg-[#1B1B23]/40"
                }`}
              />
            ))}
          </div>

          {/* Chevron Right After Dots */}
          <button
            type="button"
            onClick={() => scrollByPage(1)}
            disabled={!canNext}
            aria-label="Next page"
            className="w-8 h-8 rounded-full bg-white text-[#1B1B23] border border-black/10 shadow-xs flex items-center justify-center transition-all hover:bg-neutral-50 hover:shadow-sm disabled:opacity-30 disabled:cursor-not-allowed active:scale-95"
          >
            <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
      )}
    </section>
  );
}

// Figma v1 carousel arrow: 28px white circle, dark chevron, soft shadow.
export function ArrowButton({ dir, disabled, onClick, className = "" }) {
  const Icon = dir === "prev" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className={`w-7 h-7 lg:w-8 lg:h-8 rounded-full bg-white text-[#1B1B23] shadow-xs flex items-center justify-center transition-opacity hover:shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4E7A] disabled:opacity-40 disabled:cursor-not-allowed ${className}`}
    >
      <Icon className="w-4 h-4" strokeWidth={2.5} />
    </button>
  );
}

export default Carousel;

