import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MOCK_EVENTS } from "@/lib/mockData";
import { getUser } from "@/lib/auth/storage";
import {
  ArrowLeft,
  Calendar,
  Clock,
  CreditCard,
  User as UserIcon,
  Mail,
  Phone,
  QrCode,
  Lock,
  Edit2,
  Tag,
  Smartphone,
  Wallet,
  Sparkles,
  AlertCircle,
  Check,
} from "lucide-react";

export function BookingPage() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const eventId = id || searchParams.get("eventId");
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedTiers, setSelectedTiers] = useState({});
  const [name, setName] = useState(getUser()?.name || "");
  const [email, setEmail] = useState(getUser()?.email || "");
  const [phone, setPhone] = useState("");
  const [visitorType, setVisitorType] = useState("resident"); // resident | international
  const [paymentMethod, setPaymentMethod] = useState("card"); // card | apple | google | link
  const [cardName, setCardName] = useState(getUser()?.name || "");
  const [cardNumber, setCardNumber] = useState("•••• •••• •••• 4242");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvc, setCardCvc] = useState("888");
  const [postalCode, setPostalCode] = useState("D02 X285");
  const [country, setCountry] = useState("IE");
  const [saveWithLink, setSaveWithLink] = useState(true);
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  // Coupon / Promo code state
  const [couponCode, setCouponCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponApplied, setCouponApplied] = useState("");
  const [couponError, setCouponError] = useState("");

  // Step state synced with URL search params for natural browser & in-app back navigation
  // Flow: payment (step 3) -> details (step 2) -> tickets (step 1) -> event detail -> home
  const stepParam = searchParams.get("step");
  const step = stepParam === "payment" ? 3 : stepParam === "details" ? 2 : 1;

  // 10-Minute Hold Reservation Countdown Timer (600 seconds)
  const [timeLeft, setTimeLeft] = useState(600);
  const [timerExpired, setTimerExpired] = useState(false);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        let data;
        try {
          data = await api.events.get(eventId);
        } catch {
          data = MOCK_EVENTS.find((e) => e.id === eventId || e.slug === eventId) || MOCK_EVENTS[0];
        }
        if (!data || !data.id) {
          data = MOCK_EVENTS.find((e) => e.id === eventId || e.slug === eventId) || MOCK_EVENTS[0];
        }
        if (!cancelled) {
          setEvent(data);
          // Default select 1 ticket of first available tier
          const firstTier = data.ticketTiers?.[0];
          if (firstTier) {
            setSelectedTiers({ [firstTier.id]: 1 });
          }
        }
      } catch {
        if (!cancelled) {
          const fallback = MOCK_EVENTS.find((e) => e.id === eventId || e.slug === eventId) || MOCK_EVENTS[0];
          setEvent(fallback);
          if (fallback.ticketTiers?.[0]) {
            setSelectedTiers({ [fallback.ticketTiers[0].id]: 1 });
          }
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  // 10-minute checkout timer countdown: ONLY starts and counts down on the last step (Step 3: Payment)
  useEffect(() => {
    if (bookingSuccess || step !== 3) return;
    if (timeLeft <= 0) {
      setTimerExpired(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setTimerExpired(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft, bookingSuccess]);

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleResetTimer = () => {
    setTimeLeft(600);
    setTimerExpired(false);
  };

  const goToStep = (targetStep) => {
    const stepQuery = targetStep === 3 ? "payment" : targetStep === 2 ? "details" : "tickets";
    navigate(`/events/${eventId}/book?step=${stepQuery}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBack = () => {
    if (step === 3) {
      goToStep(2);
    } else if (step === 2) {
      goToStep(1);
    } else {
      navigate(`/events/${eventId}`);
    }
  };

  const handleQtyChange = (tierId, delta, max, avail) => {
    setSelectedTiers((prev) => {
      const cur = prev[tierId] ?? 0;
      const next = Math.max(0, Math.min(Math.min(max, avail), cur + delta));
      if (next === 0) {
        const r = { ...prev };
        delete r[tierId];
        return r;
      }
      return { ...prev, [tierId]: next };
    });
  };

  const totalTickets = Object.values(selectedTiers).reduce((a, b) => a + b, 0);
  const totalPrice = event
    ? (event.ticketTiers || []).reduce(
        (s, t) => s + (selectedTiers[t.id] ?? 0) * t.price,
        0
      )
    : 0;

  const finalTotal = Math.max(0, totalPrice - appliedDiscount);

  const handleApplyCoupon = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    const clean = couponCode.trim().toUpperCase();
    if (!clean) return;

    if (clean === "PASSQO10" || clean === "PASSQO") {
      setAppliedDiscount(10);
      setCouponApplied(clean);
      setCouponError("");
    } else if (clean === "EARLYBIRD" || clean === "VIP20") {
      const discountVal = Math.min(20, Math.round(totalPrice * 0.2) || 15);
      setAppliedDiscount(discountVal);
      setCouponApplied(clean);
      setCouponError("");
    } else {
      setCouponError("Invalid or expired coupon code");
    }
  };

  const handleRemoveCoupon = () => {
    setCouponApplied("");
    setAppliedDiscount(0);
    setCouponCode("");
    setCouponError("");
  };

  const handleConfirmBooking = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (totalTickets === 0 || isProcessingPayment) return;
    
    setIsProcessingPayment(true);
    setTimeout(() => {
      const generatedId = `PSQ-${Math.floor(100000 + Math.random() * 900000)}`;
      setOrderId(generatedId);
      setIsProcessingPayment(false);
      setBookingSuccess(true);
    }, 750);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF4E7A] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#F8F5F0] flex flex-col items-center justify-center p-6 text-center">
        <p className="text-xl font-bold text-[#1B1B23]">Event not found</p>
        <Link to="/" className="mt-4 px-5 py-2.5 bg-[#FF4E7A] text-white rounded-xl text-sm font-bold">
          Back to Home
        </Link>
      </div>
    );
  }

  const dateObj = new Date(event.date);
  const dateFormatted = dateObj.toLocaleDateString("en-IE", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
  const timeFormatted = dateObj.toLocaleTimeString("en-IE", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-[#F8F5F0] text-[#1B1B23] flex flex-col font-sans pb-28">
      {/* ── TOP HEADER (Passqo Glass Aesthetic: Logo on left, Event name in center, User avatar on right) ── */}
      <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-2xl backdrop-saturate-180 border-b border-white/90 shadow-[0_4px_24px_rgba(0,0,0,0.04),inset_0_-1px_1.5px_rgba(255,255,255,0.7)] px-4 sm:px-8 h-14 sm:h-16 flex items-center justify-between transition-all">
        {/* Left: Back Button + Passqo Logo */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBack}
            className="w-9 h-9 rounded-full bg-white/80 hover:bg-white active:scale-90 border border-white/90 shadow-2xs flex items-center justify-center text-[#1B1B23] transition-all cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft className="w-4.5 h-4.5 -translate-x-0.5 text-[#1B1B23]" />
          </button>

          <Link to="/" className="flex items-center">
            <img
              src="/images/Logos/navbar%20logo.png"
              alt="Passqo"
              className="h-6 sm:h-7 w-auto object-contain"
            />
          </Link>
        </div>

        {/* Center: Event Name (Clean & prominent with Passqo Pink subtitle) */}
        <div className="hidden sm:block text-center flex-1 max-w-md px-4 truncate">
          <h1 className="font-extrabold text-sm sm:text-base text-[#1B1B23] tracking-tight truncate">
            {event.name}
          </h1>
          <p className="text-[11px] font-semibold text-[#FF4E7A] truncate">
            {dateFormatted} · {event.venue || event.city}
          </p>
        </div>

        {/* Right: User Avatar Circle */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#1B1B23] text-white flex items-center justify-center font-bold text-xs uppercase shadow-xs ring-2 ring-white">
            {(getUser()?.name || "U")[0]}
          </div>
        </div>
      </header>

      {/* ── TIMER BAR (Shows ONLY on the last step: Step 3 - Payment) ── */}
      {step === 3 && (
        <div
          className={`py-2 px-4 text-center text-xs font-semibold flex items-center justify-center gap-1.5 transition-all duration-300 ${
            timeLeft <= 60
              ? "bg-[#FDE8E8] text-[#C81E1E] border-b border-[#F8B4B4] animate-pulse font-bold"
              : timeLeft <= 120
              ? "bg-[#FEF9E7] text-[#9A6B00] border-b border-[#FBE8A6] animate-pulse"
              : "bg-[#EAF7EE] text-[#1D7C39] border-b border-[#D4EFDB]"
          }`}
        >
          <Clock className={`w-3.5 h-3.5 ${timeLeft <= 120 ? "animate-spin" : ""}`} />
          <span>
            {timeLeft <= 60
              ? "Urgent: Complete your booking in "
              : timeLeft <= 120
              ? "Almost expired! Complete your booking in "
              : "Complete your booking in "}
            <strong className="font-mono font-bold">{formatTimer(timeLeft)} mins</strong>
          </span>
        </div>
      )}

      {/* ── PASSQO STEP PROGRESS BAR (Steps 2 & 3: "Buyer details ──────── Review booking") ── */}
      {step >= 2 && (
        <div className="max-w-[760px] md:max-w-[1100px] w-full mx-auto px-4 sm:px-6 pt-5 pb-2">
          <div className="flex items-center justify-between max-w-sm mx-auto relative">
            {/* Step 1: Buyer details */}
            <button
              type="button"
              onClick={() => goToStep(2)}
              className="flex items-center gap-2 text-xs font-bold text-[#1B1B23] cursor-pointer"
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                step === 2
                  ? "border-[#FF4E7A] bg-white text-[#FF4E7A] ring-4 ring-pink-100 shadow-xs"
                  : "border-[#FF4E7A] bg-[#FF4E7A] text-white"
              }`}>
                {step > 2 ? "✓" : "1"}
              </span>
              <span>Buyer details</span>
            </button>

            {/* Connecting line */}
            <div className={`flex-1 h-0.5 mx-3 transition-colors ${step === 3 ? "bg-[#FF4E7A]" : "bg-neutral-200"}`} />

            {/* Step 2: Review booking */}
            <div className="flex items-center gap-2 text-xs font-bold text-[#1B1B23]">
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border transition-all ${
                step === 3
                  ? "border-[#FF4E7A] bg-white text-[#FF4E7A] ring-4 ring-pink-100 shadow-xs"
                  : "border-neutral-300 bg-neutral-100 text-neutral-400"
              }`}>
                2
              </span>
              <span className={step === 3 ? "text-[#1B1B23]" : "text-neutral-400"}>Review booking</span>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STEP 1: SELECT TICKETS                                             */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {step === 1 && (
        <main className="max-w-[760px] md:max-w-[820px] w-full mx-auto px-4 sm:px-6 py-6 space-y-5 animate-in fade-in duration-200">
          {/* Top Date & Time Glass Card */}
          <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] flex items-center gap-3.5">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-pink-50 text-[#FF4E7A] flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-[#FF4E7A]" />
            </div>
            <div>
              <p className="font-extrabold text-xs sm:text-sm text-[#1B1B23]">
                {dateFormatted}
              </p>
              <p className="text-[11px] sm:text-xs text-[#8C8C9E] font-medium mt-0.5">
                {timeFormatted} · {event.venue || event.city}
              </p>
            </div>
          </div>

          {/* Ticket Tiers Divided List (Clean borders, no thick black stroke) */}
          <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl sm:rounded-3xl border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] divide-y divide-black/6 overflow-hidden">
            {(event.ticketTiers || []).map((tier) => {
              const avail = tier.quantity - tier.sold;
              const qty = selectedTiers[tier.id] ?? 0;
              const soldOut = avail <= 0;
              const effectiveMax = event.allowGroupRegistration ? (tier.maxPerOrder || 6) : 4;

              return (
                <div key={tier.id} className="p-4 sm:p-5 flex items-start justify-between gap-4 transition-colors hover:bg-white/95">
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-extrabold text-sm sm:text-base text-[#1B1B23]">
                        {tier.name}
                      </p>
                      {tier.name.toLowerCase().includes("vip") && (
                        <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> VIP
                        </span>
                      )}
                    </div>
                    <p className="font-extrabold text-sm text-[#FF4E7A]">
                      {tier.price === 0 ? "Free" : `€${tier.price}`}
                    </p>
                    <p className="text-xs text-[#8C8C9E] leading-relaxed">
                      {tier.description || "Allows entry to 1 attendee with verified digital access"}
                    </p>
                  </div>

                  {/* Right: Add Button or Stepper Pill */}
                  <div className="flex-shrink-0 pt-0.5">
                    {soldOut ? (
                      <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-4 py-2 rounded-xl block">
                        Sold out
                      </span>
                    ) : qty === 0 ? (
                      <button
                        type="button"
                        onClick={() => handleQtyChange(tier.id, 1, effectiveMax, avail)}
                        className="px-6 py-1.5 rounded-full border border-black/20 bg-white text-[#1B1B23] font-semibold text-xs sm:text-sm hover:border-[#FF4E7A] hover:text-[#FF4E7A] transition-all cursor-pointer active:scale-95 shadow-2xs"
                      >
                        Add
                      </button>
                    ) : (
                      <div className="inline-flex items-center gap-3 px-3.5 py-1.5 rounded-full border border-[#FF4E7A] bg-pink-50/40 text-[#1B1B23] font-bold text-xs sm:text-sm shadow-xs">
                        <button
                          type="button"
                          onClick={() => handleQtyChange(tier.id, -1, effectiveMax, avail)}
                          className="w-5 h-5 flex items-center justify-center font-bold text-base leading-none cursor-pointer hover:text-[#FF4E7A] active:scale-90"
                        >
                          −
                        </button>
                        <span className="min-w-[1.5ch] text-center font-mono">
                          {qty}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQtyChange(tier.id, 1, effectiveMax, avail)}
                          disabled={qty >= effectiveMax || qty >= avail}
                          className="w-5 h-5 flex items-center justify-center font-bold text-base leading-none disabled:opacity-40 cursor-pointer hover:text-[#FF4E7A] active:scale-90"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </main>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STEP 2: BUYER DETAILS (No duplicate bottom CTA; single Pink CTA)   */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {step === 2 && (
        <main className="max-w-[760px] md:max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-7 items-start">
            {/* Left Column: Buyer Information Form */}
            <div className="md:col-span-7 space-y-5">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#1B1B23] tracking-tight">
                  Add buyer information
                </h2>
              </div>

              <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl sm:rounded-3xl p-5 sm:p-6 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] space-y-4">
                {/* Full name input */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-[#8C8C9E] uppercase tracking-wider absolute left-4 top-2 pointer-events-none">
                    Full name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pt-6 pb-2.5 px-4 bg-white/70 border border-black/8 rounded-xl text-sm font-semibold text-[#1B1B23] focus:outline-none focus:border-[#FF4E7A] focus:ring-1 focus:ring-[#FF4E7A] transition-all"
                  />
                </div>

                {/* Mobile number input */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-[#8C8C9E] uppercase tracking-wider absolute left-4 top-2 pointer-events-none">
                    Mobile number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. +353 87 123 4567"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pt-6 pb-2.5 px-4 bg-white/70 border border-black/8 rounded-xl text-sm font-semibold text-[#1B1B23] focus:outline-none focus:border-[#FF4E7A] focus:ring-1 focus:ring-[#FF4E7A] transition-all"
                  />
                </div>

                {/* Email address input */}
                <div className="relative">
                  <label className="text-[11px] font-bold text-[#8C8C9E] uppercase tracking-wider absolute left-4 top-2 pointer-events-none">
                    Email address (Tickets sent here) *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pt-6 pb-2.5 px-4 bg-white/70 border border-black/8 rounded-xl text-sm font-semibold text-[#1B1B23] focus:outline-none focus:border-[#FF4E7A] focus:ring-1 focus:ring-[#FF4E7A] transition-all"
                  />
                </div>

                {/* Radio selection: Resident vs International visitor */}
                <div className="flex items-center gap-6 pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1B1B23]">
                    <input
                      type="radio"
                      name="visitorType"
                      checked={visitorType === "resident"}
                      onChange={() => setVisitorType("resident")}
                      className="w-4 h-4 text-[#FF4E7A] focus:ring-[#FF4E7A] accent-[#FF4E7A]"
                    />
                    <span>Local resident</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#1B1B23]">
                    <input
                      type="radio"
                      name="visitorType"
                      checked={visitorType === "international"}
                      onChange={() => setVisitorType("international")}
                      className="w-4 h-4 text-[#FF4E7A] focus:ring-[#FF4E7A] accent-[#FF4E7A]"
                    />
                    <span>International visitor</span>
                  </label>
                </div>
              </div>

              {/* Desktop-only Continue CTA directly below form (Mobile & Tablets use bottom fixed bar) */}
              <div className="hidden lg:block pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!name.trim() || !email.trim()) return;
                    if (totalPrice === 0) {
                      handleConfirmBooking();
                    } else {
                      goToStep(3);
                    }
                  }}
                  disabled={!name.trim() || !email.trim()}
                  className="w-full sm:w-auto min-w-[220px] px-8 py-3.5 rounded-xl bg-[#FF4E7A] hover:bg-[#E03A64] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm transition-all shadow-md cursor-pointer active:scale-95 flex items-center justify-center gap-2"
                >
                  <span>{totalPrice === 0 ? "Confirm Registration" : "Continue"}</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Right Column: Passqo Event Preview & Itemized Ticket */}
            <div className="md:col-span-5 space-y-4">
              <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl sm:rounded-3xl p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] space-y-4">
                {/* Event Thumbnail + Title & Venue */}
                <div className="flex items-start gap-3.5">
                  <img
                    src={event.image || "/images/figma-sample/goa/goa-hero.png"}
                    alt={event.name}
                    className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-2xs border border-black/5"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-extrabold text-sm sm:text-base text-[#1B1B23] leading-snug">
                      {event.name}
                    </h3>
                    <p className="text-xs text-[#8C8C9E] font-medium mt-0.5 truncate">
                      {event.venue || event.city}
                    </p>
                  </div>
                </div>

                <div className="text-xs font-semibold text-[#FF4E7A] border-t border-black/6 pt-3 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#FF4E7A]" />
                  <span>{dateFormatted} · {timeFormatted}</span>
                </div>

                {/* Selected Tickets Breakdown */}
                <div className="space-y-3 border-t border-black/6 pt-3">
                  {(event.ticketTiers || [])
                    .filter((tier) => (selectedTiers[tier.id] ?? 0) > 0)
                    .map((tier) => {
                      const qty = selectedTiers[tier.id];
                      const sub = qty * tier.price;
                      return (
                        <div key={tier.id} className="flex items-start justify-between gap-2 text-xs">
                          <div>
                            <p className="font-bold text-[#1B1B23]">
                              {qty} x {tier.name}
                            </p>
                            <button
                              type="button"
                              onClick={() => goToStep(1)}
                              className="text-[11px] text-[#8C8C9E] hover:text-[#FF4E7A] underline mt-0.5 cursor-pointer transition-colors"
                            >
                              Edit tickets
                            </button>
                          </div>
                          <span className="font-extrabold text-[#1B1B23]">
                            {sub === 0 ? "Free" : `€${sub}`}
                          </span>
                        </div>
                      );
                    })}
                </div>
              </div>
            </div>
          </div>
        </main>
      )}

      {/* ═══════════════════════════════════════════════════════════════════ */}
      {/* STEP 3: REVIEW & PAYMENT (Mobile: Summary on top, then Coupons,    */}
      {/* then Stripe Payment Interface; Desktop: side-by-side)              */}
      {/* ═══════════════════════════════════════════════════════════════════ */}
      {step === 3 && (() => {
        {/* Sub-component: Event Summary Card */}
        const eventSummaryCard = (
          <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl sm:rounded-3xl p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] space-y-4">
            {/* Event Thumbnail + Title & Venue */}
            <div className="flex items-start gap-3.5">
              <img
                src={event.image || "/images/figma-sample/goa/goa-hero.png"}
                alt={event.name}
                className="w-14 h-14 rounded-2xl object-cover flex-shrink-0 shadow-2xs border border-black/5"
              />
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-sm sm:text-base text-[#1B1B23] leading-snug">
                  {event.name}
                </h3>
                <p className="text-xs text-[#8C8C9E] font-medium mt-0.5 truncate">
                  {event.venue || event.city}
                </p>
              </div>
            </div>

            <div className="text-xs font-semibold text-[#FF4E7A] border-t border-black/6 pt-3 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#FF4E7A]" />
              <span>{dateFormatted} · {timeFormatted}</span>
            </div>

            {/* Selected Tickets */}
            <div className="space-y-2 border-t border-black/6 pt-3">
              {(event.ticketTiers || [])
                .filter((tier) => (selectedTiers[tier.id] ?? 0) > 0)
                .map((tier) => {
                  const qty = selectedTiers[tier.id];
                  const sub = qty * tier.price;
                  return (
                    <div key={tier.id} className="flex items-start justify-between gap-2 text-xs">
                      <div>
                        <p className="font-bold text-[#1B1B23]">
                          {qty} x {tier.name}
                        </p>
                        <button
                          type="button"
                          onClick={() => goToStep(1)}
                          className="text-[11px] text-[#8C8C9E] hover:text-[#FF4E7A] underline mt-0.5 cursor-pointer transition-colors"
                        >
                          Edit tickets
                        </button>
                      </div>
                      <span className="font-extrabold text-[#1B1B23]">
                        {sub === 0 ? "Free" : `€${sub}`}
                      </span>
                    </div>
                  );
                })}
            </div>

            {/* M-Ticket Entry Notice */}
            <div className="flex items-center gap-2 pt-2 border-t border-black/6 text-xs text-[#8C8C9E] font-medium">
              <QrCode className="w-4 h-4 text-[#FF4E7A] flex-shrink-0" />
              <span>M-Ticket: Direct QR entry delivered to email</span>
            </div>
          </div>
        );

        {/* Sub-component: Offers & Coupon Box */}
        const couponOffersCard = (
          <div className="space-y-2">
            <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C8C9E] px-1">
              Offers & Promotions
            </h3>
            <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] space-y-3">
              {couponApplied ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 rounded-xl p-3 text-xs">
                  <div className="flex items-center gap-2">
                    <Tag className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="font-bold text-emerald-800">
                        Coupon &apos;{couponApplied}&apos; Applied!
                      </p>
                      <p className="text-[11px] text-emerald-600">
                        €{appliedDiscount.toFixed(2)} discount deducted from total
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1 min-w-0">
                      <Tag className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Enter coupon / promo code"
                        value={couponCode}
                        onChange={(e) => {
                          setCouponCode(e.target.value);
                          if (couponError) setCouponError("");
                        }}
                        className="w-full pl-10 pr-3 py-2.5 bg-neutral-50/70 border border-black/8 rounded-xl text-xs sm:text-sm font-semibold uppercase tracking-wider focus:outline-none focus:border-[#FF4E7A] focus:ring-1 focus:ring-[#FF4E7A]"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={!couponCode.trim()}
                      className="px-5 py-2.5 rounded-xl bg-[#1B1B23] hover:bg-[#2D2D3A] disabled:opacity-40 text-white font-bold text-xs sm:text-sm transition-all cursor-pointer flex-shrink-0"
                    >
                      Apply
                    </button>
                  </form>
                  {couponError && (
                    <p className="text-xs text-red-500 font-medium pl-1 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{couponError}</span>
                    </p>
                  )}
                  <p className="text-[11px] text-[#8C8C9E] pl-1">
                    Try promo code <span className="font-mono font-bold text-[#FF4E7A]">PASSQO10</span> for €10 off
                  </p>
                </div>
              )}
            </div>
          </div>
        );

        {/* Sub-component: Buyer Summary Chip */}
        const buyerSummaryChip = (
          <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl p-4 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-full bg-pink-50 text-[#FF4E7A] flex items-center justify-center flex-shrink-0">
                <UserIcon className="w-4 h-4 text-[#FF4E7A]" />
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs sm:text-sm text-[#1B1B23] truncate">
                  Buying tickets for <span className="font-extrabold">{name}</span>
                </p>
                <p className="text-[11px] text-[#8C8C9E] font-medium truncate mt-0.5">
                  {phone || "+353 87 123 4567"} · {email}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => goToStep(2)}
              className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-[#8C8C9E] hover:text-[#FF4E7A] transition-colors cursor-pointer flex-shrink-0"
              title="Edit buyer details"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          </div>
        );

        {/* Sub-component: Stripe Payment Interface */}
        const stripePaymentInterface = (
          <div className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <h3 className="font-bold text-xs uppercase tracking-wider text-[#8C8C9E]">
                Payment Interface
              </h3>
              {/* Official Stripe Brand Badge */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#635BFF] bg-[#635BFF]/10 px-2.5 py-0.5 rounded-full border border-[#635BFF]/20 shadow-2xs">
                <Lock className="w-3 h-3 text-[#635BFF]" />
                <span>Powered by <strong className="font-extrabold tracking-tight">stripe</strong></span>
              </div>
            </div>

            <div className="bg-white/90 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl p-4 sm:p-6 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] space-y-4">
              {/* Stripe Payment Method Tabs */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-neutral-100/80 rounded-xl border border-black/5">
                {[
                  { id: "card", label: "Card", icon: CreditCard },
                  { id: "apple", label: "Apple Pay", icon: Smartphone },
                  { id: "google", label: "Google Pay", icon: Wallet },
                  { id: "link", label: "Link", icon: Sparkles },
                ].map((m) => {
                  const Icon = m.icon;
                  const isSelected = paymentMethod === m.id;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setPaymentMethod(m.id)}
                      className={`py-2 px-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-1.5 ${
                        isSelected
                          ? "bg-white text-[#1B1B23] shadow-xs border border-black/5"
                          : "text-neutral-500 hover:text-[#1B1B23]"
                      }`}
                    >
                      <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-[#635BFF]" : "text-neutral-400"}`} />
                      <span className="truncate text-[11px] sm:text-xs">{m.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* 1. Stripe Elements Card Form */}
              {paymentMethod === "card" && (
                <div className="space-y-3 pt-1">
                  {/* Stripe Card Field Container */}
                  <div className="rounded-xl border border-neutral-300 bg-white focus-within:border-[#635BFF] focus-within:ring-2 focus-within:ring-[#635BFF]/20 transition-all shadow-2xs divide-y divide-neutral-200 overflow-hidden">
                    {/* Card Number Row */}
                    <div className="p-3 flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                        <CreditCard className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          placeholder="Card number: 4242 •••• •••• 4242"
                          className="w-full text-xs sm:text-sm font-mono text-[#1B1B23] focus:outline-none placeholder:text-neutral-400"
                        />
                      </div>
                      {/* Mini Card Brands */}
                      <div className="flex items-center gap-1 opacity-70 flex-shrink-0">
                        <span className="text-[10px] font-black bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-200">
                          VISA
                        </span>
                        <span className="text-[10px] font-black bg-amber-50 text-amber-700 px-1.5 py-0.5 rounded border border-amber-200">
                          MC
                        </span>
                      </div>
                    </div>

                    {/* Expiry & CVC Grid */}
                    <div className="grid grid-cols-2 divide-x divide-neutral-200">
                      <div className="p-3">
                        <input
                          type="text"
                          value={cardExpiry}
                          onChange={(e) => setCardExpiry(e.target.value)}
                          placeholder="MM / YY"
                          maxLength={5}
                          className="w-full text-xs sm:text-sm font-mono text-[#1B1B23] focus:outline-none placeholder:text-neutral-400"
                        />
                      </div>
                      <div className="p-3 flex items-center justify-between gap-1">
                        <input
                          type="password"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                          placeholder="CVC"
                          maxLength={4}
                          className="w-full text-xs sm:text-sm font-mono text-[#1B1B23] focus:outline-none placeholder:text-neutral-400"
                        />
                        <Lock className="w-3.5 h-3.5 text-neutral-400" />
                      </div>
                    </div>

                    {/* Country & Postal Code */}
                    <div className="grid grid-cols-2 divide-x divide-neutral-200 bg-neutral-50/50">
                      <div className="p-2.5">
                        <select
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          className="w-full text-xs font-semibold text-[#1B1B23] bg-transparent focus:outline-none cursor-pointer"
                        >
                          <option value="IE">Ireland 🇮🇪</option>
                          <option value="GB">United Kingdom 🇬🇧</option>
                          <option value="US">United States 🇺🇸</option>
                          <option value="EU">European Union 🇪🇺</option>
                          <option value="IN">India 🇮🇳</option>
                        </select>
                      </div>
                      <div className="p-2.5">
                        <input
                          type="text"
                          value={postalCode}
                          onChange={(e) => setPostalCode(e.target.value)}
                          placeholder="Postal code / Eircode"
                          className="w-full text-xs font-mono text-[#1B1B23] bg-transparent focus:outline-none placeholder:text-neutral-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cardholder Name */}
                  <div>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="Name on card"
                      className="w-full px-3.5 py-2.5 bg-white border border-neutral-300 rounded-xl text-xs sm:text-sm font-semibold text-[#1B1B23] focus:outline-none focus:border-[#635BFF] focus:ring-2 focus:ring-[#635BFF]/20"
                    />
                  </div>

                  {/* Stripe Link 1-Click Feature */}
                  <label className="flex items-start gap-2.5 pt-1 text-xs text-[#1B1B23] cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={saveWithLink}
                      onChange={(e) => setSaveWithLink(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded border-neutral-300 text-[#00D66F] focus:ring-[#00D66F] accent-[#00D66F]"
                    />
                    <div>
                      <p className="font-bold flex items-center gap-1.5">
                        <span>Save info with</span>
                        <span className="font-black text-[#00D66F] tracking-tight bg-[#00D66F]/10 px-1.5 py-0.2 rounded">Link</span>
                        <span className="text-[10px] text-neutral-400 font-normal">by Stripe</span>
                      </p>
                      <p className="text-[11px] text-[#8C8C9E]">
                        Secure 1-click checkout on Passqo and thousands of merchant sites.
                      </p>
                    </div>
                  </label>
                </div>
              )}

              {/* 2. Apple Pay Express Option */}
              {paymentMethod === "apple" && (
                <div className="py-6 px-4 bg-black text-white rounded-xl text-center space-y-2 cursor-pointer hover:bg-neutral-900 transition-colors">
                  <div className="flex items-center justify-center gap-1.5 font-bold text-lg">
                    <span>Pay</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-medium">
                    Touch ID or Face ID will authenticate on confirmation
                  </p>
                </div>
              )}

              {/* 3. Google Pay Express Option */}
              {paymentMethod === "google" && (
                <div className="py-6 px-4 bg-[#1F1F1F] text-white rounded-xl text-center space-y-2 cursor-pointer hover:bg-[#2C2C2C] transition-colors border border-white/10">
                  <div className="flex items-center justify-center gap-2 font-bold text-lg">
                    <span>Google Pay</span>
                  </div>
                  <p className="text-xs text-neutral-300 font-medium">
                    Fast checkout with your Google account cards
                  </p>
                </div>
              )}

              {/* 4. Stripe Link 1-Click Option */}
              {paymentMethod === "link" && (
                <div className="py-6 px-4 bg-[#00D66F]/10 border border-[#00D66F]/30 rounded-xl text-center space-y-2">
                  <div className="flex items-center justify-center gap-1.5 font-black text-lg text-[#008744]">
                    <span>⚡ Link</span>
                  </div>
                  <p className="text-xs font-bold text-[#1B1B23]">
                    Pay in 6 seconds with Link 1-click
                  </p>
                  <p className="text-[11px] text-neutral-500">
                    A 6-digit verification code will be sent to your mobile
                  </p>
                </div>
              )}

              {/* Stripe Security Trust Seal */}
              <div className="pt-2 border-t border-neutral-100 flex items-center justify-between text-[11px] text-[#8C8C9E]">
                <div className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-emerald-600" />
                  <span>256-bit SSL encrypted · PCI-DSS Level 1</span>
                </div>
                <span className="font-semibold text-neutral-500">Stripe Certified</span>
              </div>
            </div>
          </div>
        );

        {/* Sub-component: Payment Summary Box */}
        const paymentSummaryBox = (
          <div className="bg-white/85 backdrop-blur-2xl backdrop-saturate-180 rounded-2xl p-4 sm:p-5 border border-white/90 shadow-[0_8px_30px_rgba(0,0,0,0.04),inset_0_1.5px_2px_rgba(255,255,255,1),inset_0_-1px_1.5px_rgba(255,255,255,0.4)] space-y-2.5">
            <h3 className="font-extrabold text-sm text-[#1B1B23]">Payment summary</h3>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between text-[#8C8C9E]">
                <span>Order amount</span>
                <span className="font-bold text-[#1B1B23]">€{totalPrice.toFixed(2)}</span>
              </div>
              {appliedDiscount > 0 && (
                <div className="flex items-center justify-between text-emerald-600 font-bold">
                  <span>Promo discount ({couponApplied})</span>
                  <span>-€{appliedDiscount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#8C8C9E]">
                <span>Fees and charges</span>
                <span className="font-bold text-emerald-600">€0.00 (Passqo Waived)</span>
              </div>
              <div className="border-t border-black/6 pt-2.5 flex items-baseline justify-between text-sm">
                <span className="font-bold text-[#1B1B23]">To pay now</span>
                <span className="font-black text-lg text-[#FF4E7A]">
                  €{finalTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        );

        {/* Sub-component: Pay Now Button (Pink Stripe-powered CTA) */}
        const payNowButton = (
          <button
            type="button"
            onClick={handleConfirmBooking}
            disabled={isProcessingPayment}
            className="w-full bg-[#FF4E7A] hover:bg-[#E03A64] disabled:opacity-75 disabled:cursor-wait text-white rounded-2xl p-4.5 flex items-center justify-between cursor-pointer transition-all shadow-md active:scale-98 select-none"
          >
            {isProcessingPayment ? (
              <div className="w-full flex items-center justify-center gap-2.5 py-1">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span className="font-bold text-sm text-white">Processing with Stripe...</span>
              </div>
            ) : (
              <>
                <div className="text-left">
                  <p className="text-lg font-black leading-tight text-white">
                    €{finalTotal.toFixed(2)}
                  </p>
                  <p className="text-[10px] uppercase font-bold text-pink-100 tracking-wider">
                    Total to pay via Stripe
                  </p>
                </div>
                <div className="flex items-center gap-1.5 font-extrabold text-sm text-white">
                  <Lock className="w-4 h-4 text-white" />
                  <span>Pay Now</span>
                  <span>→</span>
                </div>
              </>
            )}
          </button>
        );

        return (
          <main className="max-w-[760px] md:max-w-[1100px] w-full mx-auto px-4 sm:px-6 py-6 animate-in fade-in duration-200">
            {/* ── MOBILE VIEW (< md): EVENT SUMMARY ON TOP, THEN COUPONS, THEN BUYER INFO, THEN STRIPE PAYMENT ── */}
            <div className="md:hidden space-y-4 mb-4">
              {/* 1. Event Summary Card on Top */}
              {eventSummaryCard}

              {/* 2. Offers & Coupons Directly Below Event Summary */}
              {couponOffersCard}

              {/* 3. Buyer Summary Chip */}
              {buyerSummaryChip}

              {/* 4. Stripe Payment Interface */}
              {stripePaymentInterface}

              {/* 5. Payment Summary Breakdown */}
              {paymentSummaryBox}
            </div>

            {/* ── TABLET & DESKTOP VIEW (>= md): SIDE-BY-SIDE LAYOUT ── */}
            <div className="hidden md:grid md:grid-cols-12 md:gap-7 items-start">
              {/* Left Column: Buyer Details + Coupons + Stripe Payment + Summary */}
              <div className="md:col-span-7 space-y-5">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-[#1B1B23] tracking-tight">
                    Confirm details and payment
                  </h2>
                </div>

                {buyerSummaryChip}
                {couponOffersCard}
                {stripePaymentInterface}
                {paymentSummaryBox}
              </div>

              {/* Right Column: Sticky Event Summary & Desktop Pay Now Button */}
              <div className="md:col-span-5 space-y-4 md:sticky md:top-20">
                {eventSummaryCard}
                <div className="hidden lg:block">
                  {payNowButton}
                </div>
              </div>
            </div>
          </main>
        );
      })()}

      {/* ── PASSQO LIQUID GLASS FIXED BOTTOM BAR (Always fixed in the same position on Mobile & Tablets < lg across all 3 steps!) ── */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-2xl backdrop-saturate-180 border-t border-white/90 shadow-[0_-8px_32px_rgba(0,0,0,0.08),inset_0_1.5px_2px_rgba(255,255,255,0.9)] px-4 sm:px-8 py-3.5 pb-safe transition-all">
        <div className="max-w-[1060px] mx-auto flex items-center justify-between gap-4">
          {/* Price Summary */}
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-xs text-[#8C8C9E] font-semibold">Total:</span>
              <span className="text-xl sm:text-2xl font-black text-[#1B1B23]">
                {step === 3
                  ? finalTotal === 0
                    ? "Free"
                    : `€${finalTotal.toFixed(2)}`
                  : totalPrice === 0
                  ? "Free"
                  : `€${totalPrice.toFixed(2)}`}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#8C8C9E]">
              {step === 1 && (totalTickets > 0 ? `${totalTickets} Ticket${totalTickets > 1 ? "s" : ""} selected` : "Select tickets")}
              {step === 2 && "Step 2 of 3 · Buyer details"}
              {step === 3 && (appliedDiscount > 0 ? `€${appliedDiscount.toFixed(2)} promo applied` : "Step 3 of 3 · Final payment")}
            </p>
          </div>

          {/* Fixed Action Button in EXACT SAME POSITION */}
          <div>
            {step === 1 && (
              <button
                type="button"
                onClick={() => {
                  if (totalTickets > 0) goToStep(2);
                }}
                disabled={totalTickets === 0}
                className="bg-[#FF4E7A] hover:bg-[#E03A64] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>Continue</span>
                <span>→</span>
              </button>
            )}

            {step === 2 && (
              <button
                type="button"
                onClick={() => {
                  if (!name.trim() || !email.trim()) return;
                  if (totalPrice === 0) {
                    handleConfirmBooking();
                  } else {
                    goToStep(3);
                  }
                }}
                disabled={!name.trim() || !email.trim()}
                className="bg-[#FF4E7A] hover:bg-[#E03A64] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs sm:text-sm px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <span>{totalPrice === 0 ? "Confirm" : "Continue"}</span>
                <span>→</span>
              </button>
            )}

            {step === 3 && (
              <button
                type="button"
                onClick={handleConfirmBooking}
                disabled={isProcessingPayment}
                className="bg-[#FF4E7A] hover:bg-[#E03A64] disabled:opacity-75 disabled:cursor-wait text-white font-extrabold text-xs sm:text-sm px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                {isProcessingPayment ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Processing...</span>
                  </div>
                ) : (
                  <>
                    <Lock className="w-3.5 h-3.5 text-white" />
                    <span>Pay €{finalTotal.toFixed(2)}</span>
                    <span>→</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── BOOKING CONFIRMED MODAL ── */}
      {bookingSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl text-center space-y-4 border border-black/5 animate-in zoom-in-95 duration-150">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto text-2xl">
              ✓
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                Booking Confirmed
              </span>
              <h3 className="font-black text-2xl text-[#1B1B23] mt-1">
                You&apos;re going!
              </h3>
              <p className="text-xs text-[#8C8C9E] mt-1">
                Your tickets have been sent to <span className="font-bold text-[#1B1B23]">{email}</span>
              </p>
            </div>

            {/* Mock QR Ticket Card */}
            <div className="bg-neutral-50 border border-black/6 rounded-2xl p-4 text-left space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] uppercase font-bold text-[#8C8C9E]">Booking Ref</p>
                  <p className="font-mono font-bold text-sm text-[#1B1B23]">{orderId}</p>
                </div>
                <QrCode className="w-10 h-10 text-[#1B1B23]" />
              </div>
              <div className="border-t border-black/6 pt-2 text-xs">
                <p className="font-bold text-[#1B1B23] truncate">{event.name}</p>
                <p className="text-[#8C8C9E] text-[11px]">{dateFormatted} · {event.venue || event.city}</p>
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <button
                type="button"
                onClick={() => navigate(`/events/${event.id}`)}
                className="w-full py-3 rounded-xl bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-extrabold text-xs transition-colors cursor-pointer"
              >
                Back to Event Details
              </button>
              <Link
                to="/"
                className="block text-xs font-bold text-[#8C8C9E] hover:text-[#1B1B23] transition-colors py-1"
              >
                Discover more events
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingPage;
