import { useState, useId } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ArrowLeft,
  ChevronRight,
  Trophy,
  Ticket,
  Users,
  Award,
  Crown,
  Star,
  Lock,
  Check,
  X,
  Copy,
  Gift,
  Globe,
  Gem,
  Sparkles,
  ExternalLink,
  Flame,
  CheckCircle2,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { Footer } from "@/components/ui/Footer";
import { getUser } from "@/lib/auth/storage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

/* ─── LEVELS DEFINITION (1 to 10) ─── */
const ALL_LEVELS = [
  {
    level: 1,
    name: "Newcomer",
    xpRequired: 0,
    unlocked: true,
    perks: ["Access to platform", "Basic ticket purchasing"],
    desc: "Start your journey and explore live events.",
  },
  {
    level: 2,
    name: "Attendee",
    xpRequired: 100,
    unlocked: true,
    perks: ["Event notifications", "Community access"],
    desc: "Stay notified on your favorite upcoming gigs.",
  },
  {
    level: 3,
    name: "Enthusiast",
    xpRequired: 300,
    unlocked: true,
    perks: ["Early event announcements", "Priority waitlist"],
    desc: "Get first dibs and skip the standard line.",
  },
  {
    level: 4,
    name: "Regular",
    xpRequired: 600,
    unlocked: true,
    isCurrent: true,
    perks: ["Free ticket transfers", "Extended event history"],
    desc: "Transfer tickets to friends without fees and retain past memories.",
  },
  {
    level: 5,
    name: "Loyalist",
    xpRequired: 1000,
    unlocked: false,
    perks: ["Exclusive presales", "VIP lounge access"],
    desc: "Special presale windows and entrance to festival VIP lounges.",
  },
  {
    level: 6,
    name: "Devotee",
    xpRequired: 1500,
    unlocked: false,
    perks: ["Meet & greet opportunities", "Collector digital badges"],
    desc: "Exclusive chance to meet featured artists and performers.",
  },
  {
    level: 7,
    name: "Champion",
    xpRequired: 2200,
    unlocked: false,
    perks: ["Priority seating", "Backstage tour access"],
    desc: "Prime venue positioning and behind-the-scenes access passes.",
  },
  {
    level: 8,
    name: "VIP Member",
    xpRequired: 3000,
    unlocked: false,
    perks: ["Organiser Q&A access", "Exclusive secret events"],
    desc: "Intimate sessions with event creators and unlisted pop-ups.",
  },
  {
    level: 9,
    name: "Elite",
    xpRequired: 4000,
    unlocked: false,
    perks: ["Concierge support", "Complimentary upgrades"],
    desc: "Dedicated personal booking concierge and automatic seat bumps.",
  },
  {
    level: 10,
    name: "Legend",
    xpRequired: 5500,
    unlocked: false,
    perks: ["Lifetime VIP status", "All perks unlocked"],
    desc: "The ultimate Passqo badge of honor. Unlocked across all future events.",
  },
];

/* ─── BADGES DEFINITION ─── */
const INITIAL_BADGES = [
  {
    id: "festival-goer",
    icon: "🎪",
    title: "Festival Goer",
    desc: "Attend 3 multi-day festivals",
    xp: 150,
    current: 1,
    target: 3,
    unit: "festivals",
    highlight: false,
  },
  {
    id: "perfect-attendance",
    icon: "⭐",
    title: "Perfect Attendance",
    desc: "Attend 10 events in a year",
    xp: 300,
    current: 6,
    target: 10,
    unit: "events",
    highlight: true, // Matching screenshot pink outline
  },
  {
    id: "genre-explorer",
    icon: "🎭",
    title: "Genre Explorer",
    desc: "Attend events in 5 categories",
    xp: 100,
    current: 2,
    target: 5,
    unit: "categories",
    highlight: false,
  },
  {
    id: "vip-collector",
    icon: "👑",
    title: "VIP Collector",
    desc: "Purchase 5 VIP tickets",
    xp: 250,
    current: 1,
    target: 5,
    unit: "tickets",
    highlight: false,
  },
  {
    id: "global-traveller",
    icon: "🌍",
    title: "Global Traveller",
    desc: "Attend events in 3 different cities",
    xp: 200,
    current: 1,
    target: 3,
    unit: "cities",
    highlight: false,
  },
  {
    id: "high-roller",
    icon: "💎",
    title: "High Roller",
    desc: "Spend over ₹1,000 on tickets",
    xp: 500,
    current: 400,
    target: 1000,
    isCurrency: true,
    unit: "spent",
    highlight: false,
  },
];

/* ─── LEADERBOARD DATA ─── */
const LEADERBOARD_USERS = [
  { rank: "🥇", name: "Diag Test 2", level: 1, xp: 1800, color: "#FF9800", isYou: false },
  { rank: "🥈", name: "Tanmayi", level: 1, xp: 1300, color: "#FF5722", isYou: false },
  { rank: "🥉", name: "E2E Guest A", level: 3, xp: 500, color: "#E91E63", isYou: false },
  { rank: "#4", name: "Manohar", level: 4, xp: 600, color: "#FF4E7A", isYou: true },
  { rank: "#5", name: "Vinod Kumar Reddy", level: 1, xp: 400, color: "#9C27B0", isYou: false },
  { rank: "#6", name: "Sarah Connor", level: 3, xp: 350, color: "#00BCD4", isYou: false },
  { rank: "#7", name: "Alex Chen", level: 2, xp: 220, color: "#4CAF50", isYou: false },
];

export function RewardsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getUser();

  // Modals state
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAllLevelsOpen, setIsAllLevelsOpen] = useState(false);
  const [isAllBadgesOpen, setIsAllBadgesOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [leaderboardTab, setLeaderboardTab] = useState("all-time"); // 'all-time' | 'month' | 'week'

  const currentLevel = ALL_LEVELS.find((l) => l.isCurrent) || ALL_LEVELS[3];
  const nextLevel = ALL_LEVELS[currentLevel.level] || ALL_LEVELS[4];
  const userXP = 600;
  const xpNeeded = nextLevel.xpRequired - userXP; // 400 XP
  const progressPercent = Math.min(
    100,
    Math.round(
      ((userXP - currentLevel.xpRequired) /
        (nextLevel.xpRequired - currentLevel.xpRequired || 1)) *
        100
    ) || 60
  );

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2800);
  };

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/invite?ref=${user?.id || "manohar"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    showToast("Referral link copied to clipboard! 🎁");
  };

  const handleDesktopBack = () => {
    if (location.state?.openedFromSidebar) {
      navigate("/");
      window.dispatchEvent(new CustomEvent("passqo-open-profile-menu"));
    } else {
      navigate("/");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1B1B23]">
      {/* ── MOBILE / SUBPAGE HEADER ── */}
      <SubPageHeader title="Rewards" />

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1B1B23] text-white text-xs sm:text-sm font-semibold px-4 py-3 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#00C896] flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <main className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 pb-20">
        {/* Desktop Back Link */}
        <button
          type="button"
          onClick={handleDesktopBack}
          className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors mb-5 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>

        {/* ── PAGE HEADER (Matching Screenshot) ── */}
        <div className="relative mb-6 sm:mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-xs sm:text-[13px] font-bold text-[#FF4E7A] uppercase tracking-wider mb-1">
              REWARDS
            </p>
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-[#1B1B23] tracking-tight">
              Your journey, perks and achievements
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1.5 max-w-xl">
              Attend, explore and invite friends to earn XP and unlock exclusive benefits.
            </p>
          </div>

          {/* Top Right Floating Ticket & Crown Illustration */}
          <div className="hidden lg:block relative -mt-6 -mr-2 select-none pointer-events-none">
            <img
              src="/images/illustrations/rewards-tickets-crown.webp"
              alt="Rewards illustration"
              className="w-40 xl:w-44 h-auto drop-shadow-md hover:scale-105 transition-transform duration-300"
            />
          </div>
        </div>

        {/* ── HERO LEVEL BANNER (Coral/Orange Gradient) ── */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#FF3B69] via-[#FF5858] to-[#FF8A38] text-white p-5 sm:p-7 shadow-lg mb-6 sm:mb-8">
          {/* Subtle decorative glow overlay */}
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Level circle badge + info + progress bar */}
            <div className="flex-1">
              <div className="flex items-center gap-4 sm:gap-5 mb-4 sm:mb-5">
                {/* Big Circle with Level Number */}
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-white/35 flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl font-display shadow-inner bg-white/10 backdrop-blur-xs flex-shrink-0">
                  {currentLevel.level}
                </div>

                <div>
                  <p className="text-[11px] sm:text-xs font-extrabold tracking-widest uppercase text-white/80">
                    LEVEL {currentLevel.level}
                  </p>
                  <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-white leading-tight">
                    {currentLevel.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/90 font-medium mt-0.5">
                    {userXP} XP total
                  </p>
                </div>
              </div>

              {/* Progress Bar inside Banner */}
              <div className="max-w-xl">
                <div className="flex items-center justify-between text-[11px] sm:text-xs font-medium text-white/90 mb-1.5">
                  <span>0 XP</span>
                  <span>
                    {xpNeeded} XP to Level {nextLevel.level} - {nextLevel.name}
                  </span>
                </div>
                <div className="h-2 sm:h-2.5 bg-white/25 rounded-full overflow-hidden p-0.5 shadow-inner">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-700 ease-out shadow-sm"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Stats Counters + Leaderboard Button */}
            <div className="flex items-center justify-between lg:justify-end gap-3 sm:gap-6 pt-3 lg:pt-0 border-t border-white/15 lg:border-t-0">
              {/* Stat 1: Tickets */}
              <div className="text-center px-2 sm:px-3">
                <div className="flex items-center justify-center text-white/90 mb-1">
                  <Ticket className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div className="font-display font-extrabold text-lg sm:text-2xl text-white">
                  8
                </div>
                <div className="text-[10px] sm:text-xs text-white/80 font-medium">Tickets</div>
              </div>

              {/* Stat 2: Referrals */}
              <div className="text-center px-2 sm:px-3">
                <div className="flex items-center justify-center text-white/90 mb-1">
                  <Users className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div className="font-display font-extrabold text-lg sm:text-2xl text-white">
                  0
                </div>
                <div className="text-[10px] sm:text-xs text-white/80 font-medium">Referrals</div>
              </div>

              {/* Stat 3: Badges */}
              <div className="text-center px-2 sm:px-3">
                <div className="flex items-center justify-center text-white/90 mb-1">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
                </div>
                <div className="font-display font-extrabold text-lg sm:text-2xl text-white">
                  0
                </div>
                <div className="text-[10px] sm:text-xs text-white/80 font-medium">Badges</div>
              </div>

              {/* Leaderboard Button */}
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(true)}
                className="bg-white hover:bg-neutral-50 active:scale-95 text-[#1B1B23] font-bold text-xs sm:text-sm py-2 sm:py-2.5 px-4 sm:px-5 rounded-full shadow-md transition-all flex items-center gap-2 cursor-pointer ml-1 sm:ml-2 flex-shrink-0"
              >
                <Trophy className="w-4 h-4 text-[#FF4E7A] fill-[#FF4E7A]/20" />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN MAIN CONTENT (Your Progress vs Badges) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN: YOUR PROGRESS
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-black/6 shadow-xs p-5 sm:p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1B23]">
                Your Progress
              </h2>
              <button
                type="button"
                onClick={() => setIsAllLevelsOpen(true)}
                className="text-xs sm:text-sm font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View all levels</span>
                <span className="text-xs">→</span>
              </button>
            </div>

            {/* Horizontal 1-10 Step Line with "YOU" tag on Level 4 */}
            <div className="pt-5 pb-3 px-1 overflow-x-auto scrollbar-none">
              <div className="flex items-center justify-between min-w-[380px] sm:min-w-0 relative">
                {/* Background Connecting Line */}
                <div className="absolute top-1/2 left-3 right-3 h-0.5 bg-neutral-200 -translate-y-1/2 z-0" />

                {ALL_LEVELS.map((lvl) => {
                  const isPast = lvl.level < currentLevel.level;
                  const isCurrent = lvl.level === currentLevel.level;

                  return (
                    <div
                      key={lvl.level}
                      onClick={() => setSelectedLevel(lvl)}
                      className="relative z-10 flex flex-col items-center cursor-pointer group"
                    >
                      {/* Floating "YOU" Pill on active level */}
                      {isCurrent && (
                        <span className="absolute -top-5 left-1/2 -translate-x-1/2 bg-[#FF4E7A] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full shadow-xs tracking-wider animate-bounce">
                          YOU
                        </span>
                      )}

                      {/* Numbered Step Circle */}
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
                          isCurrent
                            ? "bg-[#FF4E7A] text-white shadow-md ring-4 ring-[#FF4E7A]/25 scale-110"
                            : isPast
                            ? "bg-[#00C896] text-white shadow-xs"
                            : "bg-[#EFEAE4] text-neutral-400 group-hover:bg-neutral-200 group-hover:text-neutral-600"
                        }`}
                      >
                        {lvl.level}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Active Level 4 Box with Pink Background */}
            <div className="bg-[#FFF5F8] border border-[#FF4E7A]/20 rounded-2xl p-4 sm:p-5 mt-4 mb-4">
              <div className="flex items-start gap-3.5 mb-3">
                {/* Crown Icon Box */}
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#FF6B8B] to-[#FF8E53] text-white flex items-center justify-center flex-shrink-0 shadow-sm">
                  <Crown className="w-5 h-5 fill-white text-white" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <p className="text-[11px] font-bold text-[#FF4E7A] uppercase tracking-wider">
                        Level {currentLevel.level}
                      </p>
                      <h3 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23]">
                        {currentLevel.name}
                      </h3>
                    </div>
                    <span className="text-[11px] font-bold text-neutral-500 text-right">
                      {xpNeeded} XP to Level {nextLevel.level}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-500 font-medium mt-0.5">
                    {userXP} XP total
                  </p>
                </div>
              </div>

              {/* Mini progress bar inside active box */}
              <div className="h-1.5 bg-neutral-200/80 rounded-full overflow-hidden mb-3.5">
                <div
                  className="h-full bg-[#FF4E7A] rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Unlocked Perks Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {currentLevel.perks.map((perk, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white text-[#FF4E7A] text-[11px] font-bold border border-[#FF4E7A]/20 shadow-2xs"
                  >
                    <Check className="w-3 h-3 stroke-[2.5]" />
                    <span>{perk}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Upcoming Levels List (Levels 5 to 10) */}
            <div className="divide-y divide-black/5 mt-1">
              {ALL_LEVELS.filter((l) => l.level > currentLevel.level).map((lvl) => (
                <div
                  key={lvl.level}
                  onClick={() => setSelectedLevel(lvl)}
                  className="py-3 sm:py-3.5 flex items-center justify-between gap-3 text-left hover:bg-neutral-50/70 rounded-xl px-2 -mx-2 transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {/* Lock Icon + Level Number */}
                    <div className="flex items-center gap-1.5 text-neutral-400 font-bold text-xs flex-shrink-0">
                      <Lock className="w-3.5 h-3.5" />
                      <span className="w-3 text-center">{lvl.level}</span>
                    </div>

                    {/* Level Name */}
                    <span className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors truncate">
                      {lvl.name}
                    </span>

                    {/* Perk Pills (hidden on small mobile screens to prevent clutter) */}
                    <div className="hidden sm:flex items-center gap-1.5 flex-wrap">
                      {lvl.perks.map((perk, idx) => (
                        <span
                          key={idx}
                          className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600 text-[10px] font-medium truncate max-w-[150px]"
                        >
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* XP Requirement + Arrow */}
                  <div className="flex items-center gap-1.5 text-xs text-neutral-400 font-semibold flex-shrink-0 group-hover:text-neutral-700">
                    <span>{lvl.xpRequired.toLocaleString()} XP</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: BADGES
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 bg-white rounded-3xl border border-black/6 shadow-xs p-5 sm:p-6 flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between gap-3 mb-6">
              <h2 className="font-display font-extrabold text-lg sm:text-xl text-[#1B1B23]">
                Badges
              </h2>
              <button
                type="button"
                onClick={() => setIsAllBadgesOpen(true)}
                className="text-xs sm:text-sm font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View all badges</span>
                <span className="text-xs">→</span>
              </button>
            </div>

            {/* 2x3 Grid of Badge Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {INITIAL_BADGES.map((b) => {
                const pct = Math.min(100, Math.round((b.current / b.target) * 100));

                return (
                  <div
                    key={b.id}
                    onClick={() => setSelectedBadge(b)}
                    className={`relative rounded-2xl p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                      b.highlight
                        ? "border-2 border-[#FF4E7A] bg-[#FFF9FA] shadow-xs hover:shadow-md"
                        : "border border-neutral-200/80 bg-white hover:border-neutral-300 hover:shadow-xs"
                    }`}
                  >
                    {/* Top Row: Icon + XP Pill */}
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <div className="text-2xl sm:text-3xl select-none">{b.icon}</div>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          b.highlight
                            ? "bg-[#FF4E7A] text-white"
                            : "bg-[#FFF0F4] text-[#FF4E7A]"
                        }`}
                      >
                        +{b.xp} XP
                      </span>
                    </div>

                    {/* Title & Description */}
                    <div>
                      <h3 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] leading-snug">
                        {b.title}
                      </h3>
                      <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5 font-medium leading-relaxed">
                        {b.desc}
                      </p>
                    </div>

                    {/* Bottom Progress Bar & Label */}
                    <div className="mt-4 pt-1">
                      <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-1.5">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            b.highlight ? "bg-[#FF4E7A]" : "bg-[#FF4E7A]"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <div className="text-right text-[10px] font-semibold text-neutral-400">
                        {b.isCurrency
                          ? `₹${b.current} / ₹${b.target}`
                          : `${b.current}/${b.target} ${b.unit}`}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ── BOTTOM FULL-WIDTH CARD: EARN XP ── */}
        <div className="mt-6 bg-white rounded-3xl border border-black/6 shadow-xs p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-5">
          {/* Left Text */}
          <div className="flex-shrink-0">
            <h3 className="font-display font-bold text-base sm:text-lg text-[#1B1B23]">
              Earn XP
            </h3>
            <p className="text-xs text-neutral-500 font-medium mt-0.5">
              Simple actions, big rewards.
            </p>
          </div>

          {/* Right Action Pills Grid / Wrap */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
            {/* Action 1: Buy a ticket */}
            <button
              type="button"
              onClick={() => navigate("/events")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF1] border border-[#FF4E7A]/15 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95"
            >
              <span>🎟️</span>
              <span>Buy a ticket</span>
              <span className="text-[#FF4E7A] font-extrabold text-[11px]">+100 XP</span>
            </button>

            {/* Action 2: Refer a friend */}
            <button
              type="button"
              onClick={() => navigate("/referrals")}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF1] border border-[#FF4E7A]/15 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95"
            >
              <span>👥</span>
              <span>Refer a friend</span>
              <span className="text-[#FF4E7A] font-extrabold text-[11px]">+200 XP</span>
            </button>

            {/* Action 3: Friend signs up */}
            <button
              type="button"
              onClick={handleCopyReferral}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF1] border border-[#FF4E7A]/15 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95"
              title="Copy referral link"
            >
              <span>🎁</span>
              <span>Friend signs up</span>
              <span className="text-[#FF4E7A] font-extrabold text-[11px]">+100 XP</span>
            </button>

            {/* Action 4: Complete profile */}
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-2xl bg-[#FFF5F8] hover:bg-[#FFEBF1] border border-[#FF4E7A]/15 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95"
            >
              <span>📋</span>
              <span>Complete profile</span>
              <span className="text-[#FF4E7A] font-extrabold text-[11px]">+50 XP</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── MODAL 1: LEADERBOARD ── */}
      {isLeaderboardOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLeaderboardOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl p-6 shadow-2xl border border-black/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#FFF0F4] text-[#FF4E7A] flex items-center justify-center font-bold">
                  <Trophy className="w-5 h-5 fill-[#FF4E7A]/20" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-lg text-[#1B1B23]">
                    Leaderboard
                  </h3>
                  <p className="text-xs text-neutral-500 font-medium">
                    Top attendees ranked by total XP earned
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Timeframe Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-neutral-100 rounded-full my-4">
              <button
                type="button"
                onClick={() => setLeaderboardTab("all-time")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer text-center ${
                  leaderboardTab === "all-time"
                    ? "bg-white text-[#1B1B23] shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                All Time
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardTab("month")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer text-center ${
                  leaderboardTab === "month"
                    ? "bg-white text-[#1B1B23] shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                This Month
              </button>
              <button
                type="button"
                onClick={() => setLeaderboardTab("week")}
                className={`flex-1 py-1.5 text-xs font-bold rounded-full transition-all cursor-pointer text-center ${
                  leaderboardTab === "week"
                    ? "bg-white text-[#1B1B23] shadow-xs"
                    : "text-neutral-500 hover:text-neutral-800"
                }`}
              >
                This Week
              </button>
            </div>

            {/* Leaderboard List */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 pr-1 -mr-1">
              {LEADERBOARD_USERS.map((item, idx) => (
                <div
                  key={idx}
                  className={`py-3 flex items-center justify-between gap-3 px-2 rounded-xl transition-colors ${
                    item.isYou
                      ? "bg-[#FFF0F4] border border-[#FF4E7A]/25"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="w-6 text-center text-sm font-extrabold text-neutral-600">
                      {item.rank}
                    </span>

                    {/* Avatar */}
                    <div
                      className="w-9 h-9 rounded-full text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.name.charAt(0)}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-display font-bold text-xs sm:text-sm text-[#1B1B23] truncate">
                          {item.name}
                        </span>
                        {item.isYou && (
                          <span className="bg-[#FF4E7A] text-white text-[9px] font-extrabold px-1.5 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-neutral-400 font-medium">
                        Level {item.level}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-extrabold text-sm sm:text-base text-[#FF4E7A]">
                      {item.xp.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-neutral-400 font-bold ml-1">XP</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom info */}
            <div className="pt-4 mt-3 border-t border-black/5 text-center">
              <p className="text-[11px] text-neutral-500">
                Rankings refresh daily at midnight UTC. Earn XP to climb the ranks!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ALL LEVELS ROADMAP ── */}
      {isAllLevelsOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAllLevelsOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-black/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#1B1B23]">
                  All Level Progression
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  Unlock permanent perks as you level up your Passqo profile
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAllLevelsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Levels List */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 my-3 pr-1 -mr-1">
              {ALL_LEVELS.map((lvl) => {
                const isPast = lvl.level < currentLevel.level;
                const isCurrent = lvl.level === currentLevel.level;

                return (
                  <div
                    key={lvl.level}
                    className={`py-4 px-3 rounded-2xl transition-colors ${
                      isCurrent
                        ? "bg-[#FFF5F8] border border-[#FF4E7A]/25"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3 mb-1.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? "bg-[#FF4E7A] text-white"
                              : isPast
                              ? "bg-[#00C896] text-white"
                              : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          {lvl.level}
                        </div>
                        <h4 className="font-display font-bold text-sm text-[#1B1B23]">
                          {lvl.name}
                        </h4>
                        {isCurrent && (
                          <span className="bg-[#FF4E7A] text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded-full">
                            CURRENT LEVEL
                          </span>
                        )}
                      </div>

                      <span className="text-xs font-bold text-neutral-500">
                        {lvl.xpRequired.toLocaleString()} XP
                      </span>
                    </div>

                    <p className="text-xs text-neutral-500 mb-2 pl-9">{lvl.desc}</p>

                    <div className="flex items-center gap-1.5 flex-wrap pl-9">
                      {lvl.perks.map((perk, i) => (
                        <span
                          key={i}
                          className={`text-[10px] font-semibold px-2.5 py-0.5 rounded-full ${
                            isCurrent || isPast
                              ? "bg-[#00C896]/10 text-[#00C896] border border-[#00C896]/20"
                              : "bg-neutral-100 text-neutral-500"
                          }`}
                        >
                          ✓ {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 3: BADGE DETAILS ── */}
      {selectedBadge && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBadge(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-black/10 text-center animate-in zoom-in-95 duration-200">
            <div className="text-5xl mb-3 select-none">{selectedBadge.icon}</div>
            <h3 className="font-display font-extrabold text-xl text-[#1B1B23]">
              {selectedBadge.title}
            </h3>
            <span className="inline-block bg-[#FFF0F4] text-[#FF4E7A] font-extrabold text-xs px-2.5 py-1 rounded-full my-2">
              +{selectedBadge.xp} XP Reward
            </span>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mb-5">
              {selectedBadge.desc}
            </p>

            {/* Progress */}
            <div className="bg-neutral-50 p-4 rounded-2xl border border-neutral-100 mb-5 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-600 mb-1.5">
                <span>Progress</span>
                <span>
                  {selectedBadge.isCurrency
                    ? `₹${selectedBadge.current} / ₹${selectedBadge.target}`
                    : `${selectedBadge.current}/${selectedBadge.target} ${selectedBadge.unit}`}
                </span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF4E7A] rounded-full"
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((selectedBadge.current / selectedBadge.target) * 100)
                    )}%`,
                  }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setSelectedBadge(null)}
              className="w-full py-2.5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ALL BADGES ── */}
      {isAllBadgesOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAllBadgesOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-xl rounded-3xl p-6 shadow-2xl border border-black/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-black/5">
              <div>
                <h3 className="font-display font-extrabold text-lg text-[#1B1B23]">
                  Achievement Badges
                </h3>
                <p className="text-xs text-neutral-500 font-medium">
                  Earn badges to boost your XP and unlock levels faster
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAllBadgesOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-4 pr-1 -mr-1">
              {INITIAL_BADGES.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setIsAllBadgesOpen(false);
                    setSelectedBadge(b);
                  }}
                  className="rounded-2xl p-4 border border-neutral-200 bg-white hover:border-[#FF4E7A]/50 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{b.icon}</span>
                    <span className="text-[10px] font-bold text-[#FF4E7A] bg-[#FFF0F4] px-2 py-0.5 rounded-full">
                      +{b.xp} XP
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-medium mt-0.5">{b.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: SINGLE LEVEL DETAIL ── */}
      {selectedLevel && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLevel(null);
          }}
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl border border-black/10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-[#FFF0F4] text-[#FF4E7A] font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
              {selectedLevel.level}
            </div>
            <h3 className="font-display font-extrabold text-xl text-[#1B1B23]">
              Level {selectedLevel.level} - {selectedLevel.name}
            </h3>
            <p className="text-xs text-[#FF4E7A] font-bold mt-1">
              {selectedLevel.xpRequired.toLocaleString()} XP required
            </p>
            <p className="text-xs text-neutral-500 font-medium my-3">
              {selectedLevel.desc}
            </p>

            <div className="text-left bg-neutral-50 p-4 rounded-2xl border border-neutral-100 mb-5">
              <p className="text-xs font-bold text-neutral-700 mb-2">Perks Included:</p>
              <ul className="space-y-1.5 text-xs text-neutral-600 font-medium">
                {selectedLevel.perks.map((p, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-[#00C896] stroke-[2.5]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedLevel(null)}
              className="w-full py-2.5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs sm:text-sm transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE MODAL (Triggered from Complete Profile) ── */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
      />

      <Footer />
    </div>
  );
}

export default RewardsPage;

