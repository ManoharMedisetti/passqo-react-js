import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link as LinkIcon,
  Copy,
  Check,
  Send,
  Users,
  Gift,
  Zap,
  Share2,
  Mail,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { getUser } from "@/lib/auth/storage";

export function ReferEarnPage() {
  const navigate = useNavigate();
  const user = getUser();
  const [copied, setCopied] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Construct realistic referral code based on current user or fallback
  const referralCode =
    user?.referralCode ||
    (user?.name ? `${user.name.split(" ")[0].toUpperCase()}-PQ24` : "PASSQO-VIP");
  const referralUrl = `https://staging.passqo.co/auth/register?ref=${referralCode}`;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2500);
  };

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(referralUrl);
      } else {
        const el = document.createElement("textarea");
        el.value = referralUrl;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
      setCopied(true);
      showToast("Referral link copied to clipboard! 📋");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      showToast("Referral link: " + referralUrl);
    }
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(
      `Hey! Join me on PassQo to book the hottest live gigs & events. Use my link to get +100 XP instantly: ${referralUrl}`
    );
    window.open(`https://wa.me/?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleShareX = () => {
    const text = encodeURIComponent(
      `Join me on PassQo to discover live gigs, festivals & exclusive events! Sign up with my link for +100 XP: ${referralUrl}`
    );
    window.open(`https://twitter.com/intent/tweet?text=${text}`, "_blank", "noopener,noreferrer");
  };

  const handleShareFacebook = () => {
    const url = encodeURIComponent(referralUrl);
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${url}`, "_blank", "noopener,noreferrer");
  };

  const handleShareEmail = () => {
    const subject = encodeURIComponent("You're invited to join PassQo!");
    const body = encodeURIComponent(
      `Hey!\n\nI'm using PassQo to discover and book live gigs, concerts, and festivals.\n\nSign up using my referral link to get +100 XP bonus:\n${referralUrl}\n\nSee you at the events!`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const handleShareMore = async () => {
    if (navigator?.share) {
      try {
        await navigator.share({
          title: "Join PassQo - Live Events & Gigs",
          text: "Use my referral link to get +100 XP bonus on PassQo!",
          url: referralUrl,
        });
      } catch {
        handleCopy();
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1B1B23] flex flex-col antialiased selection:bg-[#FF4E7A]/20">
      {/* ── UNIFIED SUBPAGE HEADER (No search bar, Back button on mobile, profile & notifications) ── */}
      <SubPageHeader title="Refer & Earn" />

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] bg-[#1B1B23] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-2.5 rounded-full shadow-xl border border-white/10 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-3 duration-200 select-none">
          <Check className="w-4 h-4 text-[#00C896] stroke-[2.5]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MAIN CONTENT CONTAINER (Exact Desktop Dashboard Layout) ── */}
      <main className="w-full max-w-[1080px] mx-auto px-4 sm:px-6 lg:px-8 pt-18 sm:pt-20 md:pt-20 pb-8 sm:pb-12 flex-1 flex flex-col justify-center">

        {/* ── 1. HERO SECTION: EXACT FIGMA VECTOR + FLAMINGO AND TICKETS ── */}
        <div className="relative mb-4 sm:mb-5 pt-1 sm:pt-2">
          
          {/* Exact Figma Vector Asset Layered in Upper Right Background */}
          <div className="hidden md:block absolute -top-14 -right-12 lg:-right-16 w-[560px] lg:w-[640px] pointer-events-none select-none z-0">
            <img
              src="/images/illustrations/Vector.png"
              alt=""
              className="w-full h-auto object-contain object-top-right"
              aria-hidden="true"
            />
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 relative z-10">
            
            {/* Left: Text Content */}
            <div className="flex-1 min-w-0 md:max-w-[480px] lg:max-w-[520px]">
              <span className="inline-block bg-[#FFF0F4] text-[#FF4E7A] text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase px-2.5 sm:px-3 py-1 rounded-full mb-2 sm:mb-2.5">
                REFER & EARN
              </span>

              <h1 className="font-display font-extrabold text-3xl sm:text-4xl text-[#1B1B23] tracking-tight leading-[1.15]">
                Bring your friends
                <br />
                to <span className="text-[#FF4E7A]">more events</span>
              </h1>

              <p className="text-xs sm:text-sm text-[#756C84] mt-2 sm:mt-2.5 leading-relaxed max-w-sm sm:max-w-md">
                Share your link, invite friends and earn rewards
                <br className="hidden sm:inline" />
                together. More friends, more experiences!
              </p>
            </div>

            {/* Right: Exact Figma "Flamingo and tickets.png" Asset */}
            <div className="flex items-center justify-center md:justify-end flex-shrink-0 -my-2 sm:-my-4">
              <div className="relative w-full max-w-[340px] sm:max-w-[420px] md:max-w-[460px] lg:max-w-[500px] flex items-center justify-center">
                <img
                  src="/images/illustrations/Flamingo%20and%20tickets.png"
                  alt="PassQo Referral Flamingo and Tickets"
                  className="w-full h-auto object-contain select-none pointer-events-none"
                  loading="eager"
                />
              </div>
            </div>

          </div>
        </div>

        {/* ── 2. METRICS STRIP: 3 HORIZONTAL TILES (Pink, Peach, Mint) ── */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 md:gap-4 mb-4 sm:mb-5 select-none relative z-10">
          
          {/* Metric 1: Referrals */}
          <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF0F4] text-[#FF4E7A] flex items-center justify-center flex-shrink-0">
              <Users className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-[#1B1B23] block leading-none">
                0
              </span>
              <span className="text-[11px] sm:text-xs text-[#8C8599] font-normal mt-1 block truncate">
                Referrals
              </span>
            </div>
          </div>

          {/* Metric 2: XP Earned */}
          <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#FFF9EE] text-[#D97706] flex items-center justify-center flex-shrink-0">
              <Gift className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-[#1B1B23] block leading-none">
                +0
              </span>
              <span className="text-[11px] sm:text-xs text-[#8C8599] font-normal mt-1 block truncate">
                XP Earned
              </span>
            </div>
          </div>

          {/* Metric 3: Your Level Boost */}
          <div className="rounded-2xl p-3.5 sm:p-4 md:p-5 bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center gap-3 sm:gap-4">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#F0FDF9] text-[#00C896] flex items-center justify-center flex-shrink-0">
              <Zap className="w-4.5 h-4.5 stroke-[2]" />
            </div>
            <div className="min-w-0">
              <span className="font-display font-extrabold text-xl sm:text-2xl md:text-3xl text-[#1B1B23] block leading-none">
                ×1
              </span>
              <span className="text-[11px] sm:text-xs text-[#8C8599] font-normal mt-1 block truncate">
                Your Level Boost
              </span>
            </div>
          </div>

        </div>

        {/* ── 3. YOUR REFERRAL LINK & SOCIAL SHARING CARD (Unified Desktop Row) ── */}
        <div className="rounded-2xl sm:rounded-3xl bg-white border border-black/[0.04] shadow-[0_2px_12px_rgba(0,0,0,0.02)] p-4.5 sm:p-5 md:p-6 mb-4 sm:mb-5 relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-8">
            
            {/* Left Column: Link Header & Copy Input */}
            <div className="flex-1 min-w-0">
              <h2 className="font-display font-bold text-sm sm:text-base text-[#1B1B23]">
                Your referral link
              </h2>
              <p className="text-xs text-[#8C8599] mt-0.5">
                Share this link with your friends
              </p>

              {/* Integrated Input & Pink Copy Button */}
              <div className="flex items-center gap-2 bg-[#FAF7F3] p-1.5 rounded-xl sm:rounded-2xl border border-[#EDE8E1] mt-3 max-w-lg">
                <div className="flex items-center gap-2 flex-1 min-w-0 px-2 py-0.5">
                  <LinkIcon className="w-4 h-4 text-[#FF4E7A] flex-shrink-0" />
                  <span className="text-xs font-mono text-[#4A4553] font-medium truncate select-all">
                    {referralUrl}
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleCopy}
                  className={`px-5 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-95 flex-shrink-0 ${
                    copied
                      ? "bg-[#00C896] text-white"
                      : "bg-[#FF4E7A] hover:bg-[#E03A64] text-white"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Right Column: 5 Social Share Circular Buttons with Divider */}
            <div className="flex items-center justify-between md:justify-end gap-3.5 sm:gap-4 md:gap-5 flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 md:border-l border-[#F0EAE1] md:pl-6 lg:pl-8">
              {/* WhatsApp */}
              <button
                type="button"
                onClick={handleShareWhatsApp}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
                title="Share via WhatsApp"
              >
                <div className="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 active:scale-95">
                  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                    <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.187-2.59-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.071.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.086s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.099.824z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-[#8C8599] group-hover:text-[#1B1B23]">
                  WhatsApp
                </span>
              </button>

              {/* X (Twitter) */}
              <button
                type="button"
                onClick={handleShareX}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
                title="Share on X"
              >
                <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 active:scale-95">
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-[#8C8599] group-hover:text-[#1B1B23]">
                  X
                </span>
              </button>

              {/* Facebook */}
              <button
                type="button"
                onClick={handleShareFacebook}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
                title="Share on Facebook"
              >
                <div className="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 active:scale-95">
                  <svg className="w-4.5 h-4.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-[10px] font-medium text-[#8C8599] group-hover:text-[#1B1B23]">
                  Facebook
                </span>
              </button>

              {/* Email */}
              <button
                type="button"
                onClick={handleShareEmail}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
                title="Share via Email"
              >
                <div className="w-10 h-10 rounded-full bg-[#FF4E7A] text-white flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 active:scale-95">
                  <Mail className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-medium text-[#8C8599] group-hover:text-[#1B1B23]">
                  Email
                </span>
              </button>

              {/* More */}
              <button
                type="button"
                onClick={handleShareMore}
                className="flex flex-col items-center gap-1.5 group cursor-pointer"
                title="More Share Options"
              >
                <div className="w-10 h-10 rounded-full bg-[#F0EAE1] text-[#756C84] flex items-center justify-center shadow-2xs transition-transform group-hover:scale-105 active:scale-95">
                  <Share2 className="w-4.5 h-4.5 stroke-[2.2]" />
                </div>
                <span className="text-[10px] font-medium text-[#8C8599] group-hover:text-[#1B1B23]">
                  More
                </span>
              </button>
            </div>

          </div>
        </div>

        {/* ── 4. HOW IT WORKS ROW (Exact Single Horizontal Strip on Desktop) ── */}
        <div className="rounded-2xl sm:rounded-3xl bg-[#FFF5F8] border border-[#FFE2EB] p-4 sm:p-5 shadow-2xs mb-4 sm:mb-5 relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 lg:gap-6">
            
            {/* Left Header */}
            <div className="flex-shrink-0 lg:w-[190px]">
              <h3 className="font-display font-bold text-sm sm:text-base text-[#1B1B23]">
                How it works
              </h3>
              <p className="text-xs text-[#8C8599] mt-0.5">
                It's simple and takes less than a minute.
              </p>
            </div>

            {/* Right: Step 1 → Step 2 → Step 3 Pipeline */}
            <div className="flex-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-2 lg:gap-3">
              
              {/* Step 1 */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white text-[#FF4E7A] shadow-2xs flex items-center justify-center flex-shrink-0">
                  <Send className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#1B1B23] leading-tight truncate">
                    Share your unique link
                  </h4>
                  <p className="text-[11px] text-[#8C8599] leading-tight mt-0.5 truncate">
                    Send it to your friends on social media.
                  </p>
                </div>
              </div>

              {/* Arrow 1 */}
              <span className="hidden sm:inline-flex items-center justify-center text-[#C4BDCC] text-xs font-normal px-1.5 flex-shrink-0 select-none">
                →
              </span>

              {/* Step 2 */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white text-[#D97706] shadow-2xs flex items-center justify-center flex-shrink-0">
                  <Users className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#1B1B23] leading-tight truncate">
                    They sign up with your link
                  </h4>
                  <p className="text-[11px] text-[#8C8599] leading-tight mt-0.5 truncate">
                    Your friend creates an account.
                  </p>
                </div>
              </div>

              {/* Arrow 2 */}
              <span className="hidden sm:inline-flex items-center justify-center text-[#C4BDCC] text-xs font-normal px-1.5 flex-shrink-0 select-none">
                →
              </span>

              {/* Step 3 */}
              <div className="flex items-center gap-2.5 flex-1 min-w-0">
                <div className="w-8 h-8 rounded-full bg-white text-[#00C896] shadow-2xs flex items-center justify-center flex-shrink-0">
                  <Gift className="w-4 h-4 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-[#1B1B23] leading-tight truncate">
                    You both earn XP
                  </h4>
                  <p className="text-[11px] text-[#8C8599] leading-tight mt-0.5 truncate">
                    You get 200 XP, they get 100 XP!
                  </p>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* ── 5. BOTTOM INSPIRATION BANNER ── */}
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xs min-h-[105px] sm:min-h-[115px] md:min-h-[125px] flex items-center border border-[#FFD5E0] z-10 bg-gradient-to-r from-[#FFF5F8] via-[#FFEBF2] to-[#FFD5E0]">
          
          {/* Exact 1254x160 Figma Asset covering the entire banner on desktop/tablets, hidden on smaller screens */}
          <img
            src="/images/illustrations/Glossy%20Pink%20Celebration%20Ticket%20Banner.png"
            alt="PassQo Celebration Ticket Banner"
            className="hidden md:block absolute inset-0 w-full h-full object-cover object-center select-none pointer-events-none"
          />

          {/* Left Text Layer over the Banner */}
          <div className="relative z-10 px-5 sm:px-8 md:px-10 py-4 max-w-sm sm:max-w-md">
            <div className="flex items-center gap-2 mb-0.5">
              <h4 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23] leading-tight">
                More friends. <span className="text-[#FF4E7A]">More events.</span>
              </h4>
              <span className="text-[#FF4E7A] text-xs font-bold tracking-widest select-none">
                //
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-[#756C84] mt-0.5 leading-relaxed">
              Invite your friends and unlock exclusive perks together on PassQo.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}

export default ReferEarnPage;
