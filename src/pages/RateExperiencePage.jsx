import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { MOCK_EVENTS } from "@/lib/mockData";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Ticket,
  ThumbsUp,
  ThumbsDown,
  Sparkles,
  Heart,
  Check,
} from "lucide-react";

export function RateExperiencePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  // Scroll unconditionally to top when opening this page
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
    if (document.body) document.body.scrollTop = 0;
  }, [id]);

  // Find event in our actual mock data
  const event =
    MOCK_EVENTS.find((e) => e.id === id || e.slug === id) ||
    MOCK_EVENTS[0]; // Fallback to Dublin Bay Electronic Music Festival

  // Form state matching 2.html
  const [overallRating, setOverallRating] = useState(null); // "liked" | "not-good" | null
  const [categoryRatings, setCategoryRatings] = useState({
    entry: null, // "up" | "down" | null
    production: null,
    performance: null,
    venue: null,
    fnb: null,
  });
  const [feedbackText, setFeedbackText] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCategoryVote = (categoryKey, value) => {
    setCategoryRatings((prev) => ({
      ...prev,
      [categoryKey]: prev[categoryKey] === value ? null : value,
    }));
  };

  const categoriesRatedCount = Object.values(categoryRatings).filter(Boolean).length;
  const isSubmitEnabled = overallRating !== null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isSubmitEnabled) return;
    setIsSubmitted(true);
  };

  const genres =
    event.artist?.genres ||
    [
      event.category?.replace(/_/g, " ").toLowerCase() || "Live Event",
      event.format === "IN_PERSON" ? "In-Person" : "Virtual Stream",
      "PassQO Experience",
    ];

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1B1B23] overflow-x-hidden">
      <SubPageHeader title="Rate Experience" backTo="/tickets" />

      <main className="max-w-4xl mx-auto px-3.5 sm:px-6 pt-18 sm:pt-24 md:pt-32 pb-20">
        {/* Desktop Breadcrumb Back Link */}
        <Link
          to="/tickets"
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors mb-3 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to My Tickets</span>
        </Link>

        {/* Page Intro - Compact on mobile */}
        <div className="mb-3 sm:mb-6">
          <h1 className="font-display font-extrabold text-xl sm:text-3xl text-[#1B1B23] tracking-tight">
            Rate your experience
          </h1>
          <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-0.5 sm:mt-1">
            Your feedback helps us improve events for everyone.
          </p>
        </div>

        {/* ================================================================
             EVENT SUMMARY CARD (Compact on mobile so ratings fit above fold)
             ================================================================ */}
        <section
          className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-3 sm:p-6 mb-3 sm:mb-6 flex flex-col md:flex-row items-stretch justify-between gap-4 md:gap-6"
          aria-label="Event Details"
        >
          {/* Left: Thumbnail & Details */}
          <div className="flex items-center gap-3 sm:gap-5 flex-1 min-w-0">
            <div className="w-14 h-16 sm:w-28 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-neutral-100 flex-shrink-0 shadow-2xs">
              <img
                src={event.image || "/images/figma-sample/goa/goa-hero.png"}
                alt={event.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.src =
                    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=400&q=80";
                }}
              />
            </div>

            <div className="min-w-0 flex-1 space-y-1 sm:space-y-2">
              <h2 className="font-display font-extrabold text-sm sm:text-lg text-[#1B1B23] leading-snug line-clamp-1 sm:line-clamp-none">
                {event.name}
              </h2>

              <div className="space-y-0.5 sm:space-y-1 text-[11px] sm:text-xs text-neutral-600 font-medium">
                {/* Venue */}
                <div className="flex items-center gap-1.5 truncate">
                  <MapPin className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="truncate">
                    {event.venue}, {event.city}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="flex items-center gap-1.5 truncate">
                  <Calendar className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="truncate">
                    {event.details?.dateLabel || "Sun, 29 Nov 2026 • 6:30 PM"}
                  </span>
                </div>

                {/* Tickets Count (Desktop only to save mobile height) */}
                <div className="hidden sm:flex items-center gap-1.5 truncate">
                  <Ticket className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                  <span className="truncate">
                    2 passes • General Admission
                  </span>
                </div>
              </div>

              {/* Genre & Category Pills (Desktop only to save mobile height) */}
              <div className="hidden sm:flex flex-wrap items-center gap-1.5 pt-1">
                {genres.map((g, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-0.5 rounded-full bg-neutral-100 text-[11px] font-semibold text-neutral-600 capitalize"
                  >
                    {g}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Soft Pink Community Note Card (Desktop only to prevent pushing Step 1 down) */}
          <div className="hidden md:flex bg-[#FFF0F4] border border-[#FFCCD8] rounded-2xl p-4 sm:p-5 flex-col justify-between max-w-xs relative overflow-hidden">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#FF4E7A] text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                <Heart className="w-4 h-4 fill-white text-white" />
              </div>
              <div>
                <h3 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] leading-tight">
                  Thank you for being part of this experience!
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-600 font-medium mt-1 leading-relaxed">
                  Your feedback helps organisers craft unforgettable live events for the PassQO community.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold text-[#FF4E7A] mt-3 self-end">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PassQO Verified</span>
            </div>
          </div>
        </section>

        {/* ================================================================
             SECTION 1: OVERALL RATING CARD (Step 1 - Immediately visible above fold)
             ================================================================ */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-3.5 sm:p-6 mb-3 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 pb-1 sm:pb-3">
            <div className="flex items-center gap-2.5 sm:gap-3">
              <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1B1B23] text-white text-[11px] sm:text-xs font-black flex items-center justify-center flex-shrink-0">
                1
              </span>
              <div>
                <h2 className="font-display font-bold text-sm sm:text-lg text-[#1B1B23] leading-tight">
                  How was the event?
                </h2>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                  Start with your overall experience.
                </p>
              </div>
            </div>

            {/* Two Responsive Rate Buttons - Clean side-by-side grid on mobile */}
            <div className="grid grid-cols-2 sm:flex items-center gap-2.5 sm:gap-3 w-full sm:w-auto">
              {/* Not Good (Thumbs Down) */}
              <button
                type="button"
                onClick={() => setOverallRating("not-good")}
                className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-full border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer active:scale-95 ${
                  overallRating === "not-good"
                    ? "bg-[#C8552D] border-[#C8552D] text-white shadow-xs"
                    : "bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                }`}
              >
                <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                <span>Not good!</span>
              </button>

              {/* Liked It (Thumbs Up) */}
              <button
                type="button"
                onClick={() => setOverallRating("liked")}
                className={`w-full sm:w-auto px-4 sm:px-5 py-2.5 rounded-full border text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 sm:gap-2 transition-all cursor-pointer active:scale-95 ${
                  overallRating === "liked"
                    ? "bg-[#20A05A] border-[#20A05A] text-white shadow-xs"
                    : "bg-white border-neutral-300 text-neutral-700 hover:border-neutral-400 hover:bg-neutral-50"
                }`}
              >
                <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.2]" />
                <span>Liked it!</span>
              </button>
            </div>
          </div>

          {/* Dynamic Feedback Status Banner */}
          {overallRating && (
            <div
              className={`mt-2.5 p-2.5 sm:p-3 rounded-xl text-xs font-semibold flex items-center gap-2 ${
                overallRating === "liked"
                  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                  : "bg-orange-50 text-orange-800 border border-orange-200"
              }`}
            >
              <span>
                {overallRating === "liked"
                  ? "Glad you had an unforgettable time! 🎉"
                  : "Sorry to hear that! Tell us what went wrong below."}
              </span>
            </div>
          )}
        </section>

        {/* ================================================================
             SECTION 2: CATEGORY RATING CARDS (5 Horizontal Cards - Step 2)
             ================================================================ */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-3.5 sm:p-6 mb-3 sm:mb-6">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3.5 sm:mb-5">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1B1B23] text-white text-[11px] sm:text-xs font-black flex items-center justify-center flex-shrink-0">
              2
            </span>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-lg text-[#1B1B23] leading-tight">
                How would you rate the following?
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                Tell us more about specific aspects of this live event.
              </p>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3">
            {[
              {
                key: "entry",
                question: "Entry, security & queue management",
              },
              {
                key: "production",
                question: "Sound, lighting & stage production",
              },
              {
                key: "performance",
                question: "Artist performance & crowd energy",
              },
              {
                key: "venue",
                question: "Venue space, safety & cleanliness",
              },
              {
                key: "fnb",
                question: "Food, drinks & stall service",
              },
            ].map((cat) => {
              const currentVal = categoryRatings[cat.key];
              return (
                <div
                  key={cat.key}
                  className="p-2.5 sm:p-4 rounded-xl sm:rounded-2xl border border-neutral-200/80 bg-neutral-50/50 flex items-center justify-between gap-2.5"
                >
                  <p className="text-xs sm:text-sm font-semibold text-[#1B1B23] min-w-0 flex-1 leading-snug">
                    {cat.question}
                  </p>

                  <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                    {/* Thumbs Down Button */}
                    <button
                      type="button"
                      onClick={() => handleCategoryVote(cat.key, "down")}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
                        currentVal === "down"
                          ? "bg-[#C8552D] border-[#C8552D] text-white shadow-xs"
                          : "bg-white border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800"
                      }`}
                      aria-label={`Thumbs down for ${cat.question}`}
                    >
                      <ThumbsDown className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                    </button>

                    {/* Thumbs Up Button */}
                    <button
                      type="button"
                      onClick={() => handleCategoryVote(cat.key, "up")}
                      className={`w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center border transition-all cursor-pointer active:scale-95 ${
                        currentVal === "up"
                          ? "bg-[#20A05A] border-[#20A05A] text-white shadow-xs"
                          : "bg-white border-neutral-300 text-neutral-500 hover:border-neutral-400 hover:text-neutral-800"
                      }`}
                      aria-label={`Thumbs up for ${cat.question}`}
                    >
                      <ThumbsUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2]" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ================================================================
             SECTION 3: OPTIONAL FEEDBACK TEXTAREA (Step 3)
             ================================================================ */}
        <section className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-3.5 sm:p-6 mb-5 sm:mb-7">
          <div className="flex items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
            <span className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#1B1B23] text-white text-[11px] sm:text-xs font-black flex items-center justify-center flex-shrink-0">
              3
            </span>
            <div>
              <h2 className="font-display font-bold text-sm sm:text-lg text-[#1B1B23] leading-tight">
                Anything else you’d like to tell us?
              </h2>
              <p className="text-[11px] sm:text-xs text-neutral-500 font-medium">
                Share your concert highlights, sound experience, or feedback for the organisers.
              </p>
            </div>
          </div>

          <div className="relative">
            <textarea
              maxLength={500}
              rows={3}
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Share your highlights, artist moments, crowd vibe, or feedback for the organisers..."
              className="w-full p-3 sm:p-4 text-xs sm:text-sm text-[#1B1B23] bg-neutral-50 border border-neutral-200 rounded-xl sm:rounded-2xl outline-none focus:border-[#FF4E7A] focus:ring-2 focus:ring-[#FF4E7A]/20 transition-all font-medium placeholder:text-neutral-400 resize-none"
            />
            <div className="text-right text-[11px] text-neutral-400 font-medium mt-1">
              {feedbackText.length}/500
            </div>
          </div>
        </section>

        {/* ================================================================
             BOTTOM ACTION BAR
             ================================================================ */}
        <div className="flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate("/tickets")}
            className="px-5 sm:px-6 py-2.5 rounded-full border border-neutral-300 text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!isSubmitEnabled}
            onClick={handleSubmit}
            className={`px-6 sm:px-7 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer ${
              isSubmitEnabled
                ? "bg-[#FF4E7A] hover:bg-[#E03A64] text-white active:scale-95"
                : "bg-neutral-200 text-neutral-400 cursor-not-allowed"
            }`}
          >
            Submit
          </button>
        </div>
      </main>

      {/* ================================================================
           SUCCESS CONFIRMATION MODAL (Matching 2.html)
           ================================================================ */}
      {isSubmitted && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => navigate("/tickets")}
          />

          <div className="relative z-10 w-full max-w-md bg-white rounded-3xl p-6 sm:p-7 shadow-2xl border border-black/8 text-center space-y-4">
            {/* Heart Badge */}
            <div className="w-14 h-14 rounded-full bg-[#FFF0F4] border border-[#FFCCD8] text-[#FF4E7A] flex items-center justify-center mx-auto shadow-xs text-2xl">
              ❤️
            </div>

            <h3 className="font-display font-black text-lg sm:text-xl text-[#1B1B23]">
              Thanks for sharing your experience!
            </h3>

            <p className="text-xs sm:text-sm text-neutral-500 font-medium leading-relaxed">
              Your rating helps event organisers optimize entry, sound, and facilities, and helps fellow fans discover the best live experiences.
            </p>

            {/* Summary Boxes */}
            <div className="space-y-2 text-xs font-semibold pt-2">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-[#1B1B23]">
                <span className="text-neutral-500">Overall Verdict:</span>
                <span
                  className={
                    overallRating === "liked" ? "text-emerald-600" : "text-orange-600"
                  }
                >
                  {overallRating === "liked" ? "Liked it!" : "Not good!"}
                </span>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 flex items-center justify-between text-[#1B1B23]">
                <span className="text-neutral-500">Categories:</span>
                <span className="text-[#FF4E7A]">
                  {categoriesRatedCount} of 5 aspects rated
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/tickets")}
              className="w-full py-3 rounded-2xl bg-[#1B1B23] hover:bg-black text-white font-bold text-xs sm:text-sm shadow-sm transition-all active:scale-98 cursor-pointer mt-2"
            >
              Back to My Tickets
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default RateExperiencePage;
