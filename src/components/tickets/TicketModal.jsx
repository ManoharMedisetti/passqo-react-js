import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  X,
  MapPin,
  Calendar,
  Clock,
  Ticket as TicketIcon,
  Copy,
  Check,
  Download,
  Share2,
  Sparkles,
  ShieldCheck,
  Radio,
} from "lucide-react";

export function TicketModal({ isOpen, onClose, ticket }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !ticket) return null;

  const handleCopyCode = () => {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(ticket.ticketCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const ticketCode = ticket.ticketCode || "PSQ-524401";

  return createPortal(
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/65 backdrop-blur-xs z-[100001] transition-opacity"
        aria-hidden="true"
      />

      {/* Ticket Container */}
      <div
        className="relative z-[100002] w-full max-w-sm sm:max-w-md md:max-w-3xl max-h-[92vh] bg-white rounded-3xl shadow-2xl border border-black/8 flex flex-col justify-between overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ticket-title"
      >
        {/* Top Header Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-neutral-900 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00A86B] animate-pulse" />
            <span className="font-display font-black text-xs uppercase tracking-wider text-neutral-200">
              PassQO Verified E-Ticket
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-neutral-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Ticket Body:
            Mobile: Vertical layout (Details on Top, Big QR on Bottom)
            Wider screens (md): Side-by-side (Details on Left, QR on Right) */}
        <div className="flex-1 overflow-y-auto flex flex-col md:flex-row items-stretch">
          {/* Left / Top Details Pane */}
          <div className="flex-1 p-5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-4 sm:space-y-5">
            {/* Event Head */}
            <div className="flex items-start gap-3.5 sm:gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-neutral-100 flex-shrink-0 shadow-2xs border border-neutral-200">
                <img
                  src={ticket.image}
                  alt={ticket.title}
                  onError={(e) => {
                    if (ticket.fallbackImage) e.currentTarget.src = ticket.fallbackImage;
                  }}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FF4E7A]/10 text-[#FF4E7A] text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wide mb-1">
                  <Sparkles className="w-3 h-3" />
                  <span>{ticket.isLive ? "Live Now" : "Confirmed Pass"}</span>
                </div>
                <h2
                  id="ticket-title"
                  className="font-display font-black text-base sm:text-lg text-[#1B1B23] leading-snug line-clamp-2"
                >
                  {ticket.title}
                </h2>
                <p className="text-xs text-neutral-500 font-medium mt-0.5">
                  {ticket.meta}
                </p>
              </div>
            </div>

            {/* Venue & Time Grid */}
            <div className="space-y-2 bg-[#FAF7F4] rounded-2xl p-3.5 sm:p-4 border border-black/5 text-xs">
              <div className="flex items-start gap-2.5 text-neutral-700">
                <MapPin className="w-4 h-4 text-[#FF4E7A] flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-[#1B1B23]">Venue & Location</p>
                  <p className="text-neutral-600 font-medium leading-relaxed">
                    {ticket.venue}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 text-neutral-700 pt-1.5 border-t border-black/5">
                <Calendar className="w-4 h-4 text-[#FF4E7A] flex-shrink-0 mt-0.5" />
                <div className="min-w-0">
                  <p className="font-bold text-[#1B1B23]">Date & Time</p>
                  <p className="text-neutral-600 font-medium">
                    {ticket.date || "Friday, 20 November 2026 • 6:00 PM"}
                  </p>
                </div>
              </div>
            </div>

            {/* Pass Metadata Grid */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Tier / Section
                </p>
                <p className="font-extrabold text-[#1B1B23] mt-0.5 truncate">
                  {ticket.tier || "General Admission"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Gate / Access
                </p>
                <p className="font-extrabold text-[#1B1B23] mt-0.5 truncate">
                  {ticket.gate || "Gate A • FastTrack"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Pass Holder
                </p>
                <p className="font-extrabold text-[#1B1B23] mt-0.5 truncate">
                  {ticket.holder || "John Doe"}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-200/80">
                <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">
                  Passes Count
                </p>
                <p className="font-extrabold text-[#1B1B23] mt-0.5 truncate">
                  {ticket.ticketsCount || 1} Person
                </p>
              </div>
            </div>
          </div>

          {/* Perforated Ticket Divider:
              Mobile: Horizontal dashed line with left and right semicircular notch cutouts.
              Desktop: Vertical dashed line with top and bottom semicircular notch cutouts. */}
          <div className="relative flex items-center justify-center flex-shrink-0">
            {/* Mobile horizontal divider */}
            <div className="md:hidden w-full border-t border-dashed border-neutral-300 relative py-2">
              <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1B1B23] shadow-inner" />
              <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#1B1B23] shadow-inner" />
            </div>

            {/* Desktop vertical divider */}
            <div className="hidden md:block h-full border-r border-dashed border-neutral-300 relative px-2">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#1B1B23] shadow-inner" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-[#1B1B23] shadow-inner" />
            </div>
          </div>

          {/* Right / Bottom QR Code Pane:
              Bigger QR Code on bottom in mobile; side-by-side in desktop */}
          <div className="md:w-80 lg:w-88 p-5 sm:p-6 lg:p-7 bg-[#FAF7F4] flex flex-col items-center justify-center text-center space-y-4 flex-shrink-0">
            <span className="text-[11px] font-black uppercase tracking-wider text-neutral-400">
              Official Entry Pass
            </span>

            {/* Bigger QR Code Container with Scan Frame */}
            <div className="relative p-3.5 bg-white rounded-2xl sm:rounded-3xl shadow-sm border border-black/8 flex items-center justify-center">
              {/* Realistic High-Res Vector QR Code */}
              <svg
                className="w-48 h-48 sm:w-56 sm:h-56 md:w-52 md:h-52 text-[#1B1B23]"
                viewBox="0 0 140 140"
                fill="currentColor"
              >
                {/* Background */}
                <rect width="140" height="140" fill="white" />

                {/* Top-Left Finder */}
                <rect x="10" y="10" width="34" height="34" rx="4" />
                <rect x="15" y="15" width="24" height="24" fill="white" rx="2" />
                <rect x="20" y="20" width="14" height="14" rx="2" />

                {/* Top-Right Finder */}
                <rect x="96" y="10" width="34" height="34" rx="4" />
                <rect x="101" y="15" width="24" height="24" fill="white" rx="2" />
                <rect x="106" y="20" width="14" height="14" rx="2" />

                {/* Bottom-Left Finder */}
                <rect x="10" y="96" width="34" height="34" rx="4" />
                <rect x="15" y="101" width="24" height="24" fill="white" rx="2" />
                <rect x="20" y="106" width="14" height="14" rx="2" />

                {/* Alignment Patterns & Data Matrix */}
                <rect x="52" y="12" width="6" height="6" />
                <rect x="64" y="12" width="6" height="12" />
                <rect x="76" y="12" width="12" height="6" />
                <rect x="52" y="24" width="18" height="6" />
                <rect x="76" y="24" width="6" height="12" />
                <rect x="88" y="24" width="6" height="6" />

                {/* Center Timing & Pattern */}
                <rect x="12" y="52" width="6" height="18" />
                <rect x="24" y="52" width="12" height="6" />
                <rect x="24" y="64" width="6" height="12" />
                <rect x="36" y="52" width="6" height="6" />
                <rect x="36" y="64" width="18" height="6" />

                <rect x="52" y="52" width="12" height="12" />
                <rect x="70" y="52" width="6" height="24" />
                <rect x="82" y="52" width="18" height="6" />
                <rect x="106" y="52" width="24" height="6" />
                <rect x="118" y="64" width="12" height="6" />

                <rect x="52" y="70" width="6" height="6" />
                <rect x="64" y="70" width="12" height="6" />
                <rect x="82" y="64" width="6" height="18" />
                <rect x="94" y="64" width="18" height="6" />
                <rect x="106" y="76" width="12" height="12" />

                <rect x="52" y="82" width="18" height="6" />
                <rect x="52" y="94" width="6" height="18" />
                <rect x="64" y="94" width="12" height="6" />
                <rect x="82" y="88" width="18" height="6" />
                <rect x="76" y="100" width="12" height="12" />
                <rect x="64" y="106" width="6" height="18" />

                <rect x="52" y="118" width="18" height="12" />
                <rect x="76" y="118" width="6" height="12" />
                <rect x="88" y="100" width="6" height="24" />
                <rect x="100" y="94" width="12" height="6" />
                <rect x="118" y="94" width="12" height="12" />
                <rect x="100" y="106" width="6" height="18" />
                <rect x="112" y="112" width="18" height="18" />

                {/* PassQO Pink Center Badge */}
                <rect x="58" y="58" width="24" height="24" rx="6" fill="#FF4E7A" />
                <circle cx="70" cy="70" r="5" fill="white" />
              </svg>

              {/* Verified Ribbon */}
              <div className="absolute -bottom-2.5 px-3 py-0.5 rounded-full bg-[#1B1B23] text-white text-[10px] font-black uppercase tracking-wider shadow-xs">
                Scan for Entry
              </div>
            </div>

            {/* Ticket Code with Copy Action */}
            <div className="pt-1">
              <p className="text-[10px] uppercase font-bold text-neutral-400">
                Ticket Reference Code
              </p>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="font-mono font-black text-sm sm:text-base text-[#1B1B23] tracking-widest bg-white px-3 py-1 rounded-xl border border-neutral-200">
                  {ticketCode}
                </span>
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="p-1.5 rounded-xl bg-white border border-neutral-200 text-neutral-600 hover:text-[#FF4E7A] hover:border-[#FF4E7A] transition-colors cursor-pointer"
                  title="Copy code"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-[11px] text-neutral-500 font-medium leading-relaxed max-w-[240px]">
              Present this digital pass at the entrance scanner. Screenshots or printouts are also valid.
            </p>
          </div>
        </div>

        {/* Modal Bottom Action Bar */}
        <div className="px-5 sm:px-6 py-3.5 bg-neutral-50/80 border-t border-black/6 flex items-center justify-between gap-3 flex-shrink-0">
          <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold">
            <ShieldCheck className="w-4 h-4 text-[#00A86B]" />
            <span>PassQO Encrypted Pass</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-200/70 transition-colors cursor-pointer"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleCopyCode}
              className="px-4 sm:px-5 py-2 rounded-xl text-xs sm:text-sm font-bold text-white bg-[#FF4E7A] hover:bg-[#E03A64] shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TicketModal;

