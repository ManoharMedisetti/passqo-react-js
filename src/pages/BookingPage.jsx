import { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import { MOCK_EVENTS } from "@/lib/mockData";
import { getUser } from "@/lib/auth/storage";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import {
  ArrowLeft,
  Check,
  ShieldCheck,
  Ticket,
  Calendar,
  MapPin,
  Clock,
  CreditCard,
  User,
  Mail,
  Phone,
  Sparkles,
  QrCode,
  Lock,
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
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

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
          // Default select 1 ticket of first tier
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

  const handleConfirmBooking = (e) => {
    e.preventDefault();
    if (totalTickets === 0) return;
    const generatedId = `PSQ-${Math.floor(100000 + Math.random() * 900000)}`;
    setOrderId(generatedId);
    setBookingSuccess(true);
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
        <Link to="/" className="mt-4 px-5 py-2.5 bg-[#1B1B23] text-white rounded-xl text-sm font-bold">
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
    <div className="min-h-screen bg-[#F8F5F0] flex flex-col pt-16 sm:pt-20">
      <Navbar />

      <main className="flex-1 max-w-[1100px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => navigate(`/events/${event.id}`)}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#1B1B23] hover:text-[#FF4E7A] transition-colors cursor-pointer group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Back to event details</span>
          </button>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-3 py-1 rounded-full">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Official Passqo Guaranteed Checkout</span>
          </div>
        </div>

        {/* Event Quick Summary Banner */}
        <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/6 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={event.image}
              alt={event.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover flex-shrink-0 shadow-xs"
            />
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF4E7A]">
                {event.category?.replace(/_/g, " ")}
              </span>
              <h1 className="font-extrabold text-lg sm:text-2xl text-[#1B1B23] tracking-tight leading-tight">
                {event.name}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs text-[#8C8C9E] font-medium mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-[#1B1B23]" />
                  {dateFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-[#1B1B23]" />
                  {timeFormatted}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#1B1B23]" />
                  {event.venue || event.city}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Booking Grid */}
        <form onSubmit={handleConfirmBooking} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Tiers & Attendee Details */}
          <div className="lg:col-span-7 space-y-5">
            {/* 1. Ticket Tier Selection */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-black/6 pb-3">
                <h2 className="font-bold text-base sm:text-lg text-[#1B1B23] flex items-center gap-2">
                  <Ticket className="w-5 h-5 text-[#FF4E7A]" />
                  <span>Select Tickets</span>
                </h2>
                <span className="text-xs text-[#8C8C9E] font-medium">Step 1 of 2</span>
              </div>

              <div className="space-y-3">
                {(event.ticketTiers || []).map((tier) => {
                  const avail = tier.quantity - tier.sold;
                  const qty = selectedTiers[tier.id] ?? 0;
                  const soldOut = avail <= 0;
                  const effectiveMax = event.allowGroupRegistration ? (tier.maxPerOrder || 6) : 4;

                  return (
                    <div
                      key={tier.id}
                      className={`p-4 rounded-2xl border transition-all ${
                        qty > 0
                          ? "border-[#1B1B23] bg-neutral-50/70 shadow-2xs ring-1 ring-[#1B1B23]"
                          : "border-black/6 bg-white hover:border-black/15"
                      } ${soldOut ? "opacity-60" : ""}`}
                    >
                      <div className="flex items-start justify-between gap-3">
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
                          <p className="text-sm font-bold text-[#FF4E7A]">
                            {tier.price === 0 ? "Free" : `€${tier.price}`}
                          </p>
                          {tier.description && (
                            <p className="text-xs text-[#8C8C9E] leading-relaxed">
                              {tier.description}
                            </p>
                          )}
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex-shrink-0 pt-1">
                          {soldOut ? (
                            <span className="text-xs font-bold text-neutral-400 bg-neutral-100 px-3 py-1.5 rounded-lg">
                              Sold out
                            </span>
                          ) : qty === 0 ? (
                            <button
                              type="button"
                              onClick={() => handleQtyChange(tier.id, 1, effectiveMax, avail)}
                              className="px-4 py-2 rounded-xl text-xs font-bold text-[#1B1B23] bg-neutral-100 hover:bg-[#1B1B23] hover:text-white transition-all cursor-pointer active:scale-95"
                            >
                              Add +
                            </button>
                          ) : (
                            <div className="inline-flex items-center gap-2.5 bg-[#1B1B23] text-white rounded-xl px-3 py-1.5 shadow-xs">
                              <button
                                type="button"
                                onClick={() => handleQtyChange(tier.id, -1, effectiveMax, avail)}
                                className="w-6 h-6 flex items-center justify-center font-bold text-base leading-none cursor-pointer hover:opacity-80 active:scale-90"
                              >
                                −
                              </button>
                              <span className="text-sm font-bold min-w-[1.5ch] text-center">
                                {qty}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQtyChange(tier.id, 1, effectiveMax, avail)}
                                disabled={qty >= effectiveMax || qty >= avail}
                                className="w-6 h-6 flex items-center justify-center font-bold text-base leading-none disabled:opacity-40 cursor-pointer hover:opacity-80 active:scale-90"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Attendee Contact Details */}
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between border-b border-black/6 pb-3">
                <h2 className="font-bold text-base sm:text-lg text-[#1B1B23] flex items-center gap-2">
                  <User className="w-5 h-5 text-[#FF4E7A]" />
                  <span>Contact & Ticket Details</span>
                </h2>
                <span className="text-xs text-[#8C8C9E] font-medium">Step 2 of 2</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="space-y-1 sm:col-span-2">
                  <label className="text-xs font-bold text-[#1B1B23]">Full Name *</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-black/8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1B23]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1B1B23]">Email Address *</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. sarah@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-black/8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1B23]/20"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-[#1B1B23]">Phone Number</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="e.g. +353 87 123 4567"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-neutral-50/50 border border-black/8 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#1B1B23]/20"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 text-[11px] text-[#8C8C9E]">
                <Lock className="w-3.5 h-3.5 text-neutral-400 flex-shrink-0" />
                <span>Tickets and entry QR codes will be securely sent to your email.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Order Summary */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-4">
            <div className="bg-white rounded-3xl p-5 sm:p-6 border border-black/6 shadow-sm space-y-4">
              <h3 className="font-bold text-base sm:text-lg text-[#1B1B23] border-b border-black/6 pb-3">
                Order Summary
              </h3>

              {totalTickets === 0 ? (
                <div className="py-8 text-center text-[#8C8C9E] space-y-2">
                  <Ticket className="w-8 h-8 mx-auto text-neutral-300" />
                  <p className="text-xs font-medium">Please add at least 1 ticket to proceed</p>
                </div>
              ) : (
                <div className="space-y-3 divide-y divide-black/6">
                  <div className="space-y-2.5">
                    {(event.ticketTiers || [])
                      .filter((tier) => (selectedTiers[tier.id] ?? 0) > 0)
                      .map((tier) => {
                        const qty = selectedTiers[tier.id];
                        const sub = qty * tier.price;
                        return (
                          <div key={tier.id} className="flex items-center justify-between text-xs sm:text-sm">
                            <span className="text-[#1B1B23] font-medium">
                              {tier.name} <span className="text-[#8C8C9E]">× {qty}</span>
                            </span>
                            <span className="font-bold text-[#1B1B23]">
                              {sub === 0 ? "Free" : `€${sub.toFixed(2)}`}
                            </span>
                          </div>
                        );
                      })}
                  </div>

                  <div className="pt-3 space-y-1.5 text-xs text-[#8C8C9E]">
                    <div className="flex items-center justify-between">
                      <span>Booking fee</span>
                      <span className="text-emerald-600 font-semibold">€0.00 (Free)</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Taxes & charges</span>
                      <span>Included</span>
                    </div>
                  </div>

                  <div className="pt-3 flex items-baseline justify-between">
                    <div>
                      <p className="text-xs text-[#8C8C9E] font-medium">Total Amount</p>
                      <p className="text-2xl font-black text-[#1B1B23]">
                        {totalPrice === 0 ? "Free" : `€${totalPrice.toFixed(2)}`}
                      </p>
                    </div>
                    <span className="text-xs font-semibold text-neutral-500">
                      {totalTickets} Ticket{totalTickets > 1 ? "s" : ""}
                    </span>
                  </div>
                </div>
              )}

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={totalTickets === 0}
                className="w-full py-3.5 rounded-2xl bg-[#1B1B23] hover:bg-[#2D2D3A] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-sm transition-all shadow-md active:scale-98 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{totalPrice === 0 ? "Confirm Free Registration" : `Proceed to Pay · €${totalPrice.toFixed(2)}`}</span>
                <span>→</span>
              </button>

              <p className="text-[11px] text-center text-[#8C8C9E]">
                By proceeding, you agree to the event&apos;s Terms & Conditions and Passqo Booking Policy.
              </p>
            </div>
          </div>
        </form>
      </main>

      {/* Booking Success Modal */}
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
                className="w-full py-3 rounded-xl bg-[#1B1B23] hover:bg-[#2D2D3A] text-white font-bold text-xs transition-colors cursor-pointer"
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

      <Footer />
    </div>
  );
}

export default BookingPage;

