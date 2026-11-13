import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ChevronRight,
  Trophy,
  Ticket,
  Users,
  Award,
  Crown,
  Lock,
  Check,
  X,
  Zap,
  Info,
  Sparkles,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { getUser } from "@/lib/auth/storage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

/* ─── LEVELS DEFINITION (1 to 10) ─── */
const ALL_LEVELS = [
  { level: 1, name: "Newcomer", xpRequired: 0, perks: ["Platform access", "Ticket booking"] },
  { level: 2, name: "Attendee", xpRequired: 100, perks: ["Drop notifications", "Community hub"] },
  { level: 3, name: "Enthusiast", xpRequired: 300, perks: ["Early announcements", "Priority waitlist"] },
  { level: 4, name: "Regular", xpRequired: 600, isCurrent: true, perks: ["Free ticket transfers", "Extended event history"] },
  { level: 5, name: "Loyalist", xpRequired: 1000, perks: ["Presale windows", "VIP lounge access"] },
  { level: 6, name: "Devotee", xpRequired: 1500, perks: ["Meet & greets", "Collector digital badge"] },
  { level: 7, name: "Champion", xpRequired: 2200, perks: ["Prime seating", "Backstage soundcheck"] },
  { level: 8, name: "VIP Member", xpRequired: 3000, perks: ["Organiser Q&A", "Secret sessions"] },
  { level: 9, name: "Elite", xpRequired: 4000, perks: ["Concierge support", "Festival upgrades"] },
  { level: 10, name: "Legend", xpRequired: 5500, perks: ["Lifetime VIP status", "All perks unlocked"] },
];

/* ─── BADGES DEFINITION ─── */
const ALL_BADGES = [
  {
    id: "perfect-attendance",
    icon: "⭐",
    title: "Perfect Attendance",
    desc: "Attend 10 events this year",
    xp: 300,
    current: 6,
    target: 10,
    unit: "events",
  },
  {
    id: "festival-goer",
    icon: "🎪",
    title: "Festival Goer",
    desc: "Attend 3 multi-day festivals",
    xp: 150,
    current: 1,
    target: 3,
    unit: "festivals",
  },
  {
    id: "genre-explorer",
    icon: "🎭",
    title: "Genre Explorer",
    desc: "Attend 5 event categories",
    xp: 100,
    current: 2,
    target: 5,
    unit: "categories",
  },
  {
    id: "vip-collector",
    icon: "👑",
    title: "VIP Collector",
    desc: "Purchase 5 VIP stage passes",
    xp: 250,
    current: 1,
    target: 5,
    unit: "tickets",
  },
  {
    id: "global-traveller",
    icon: "🌍",
    title: "Global Traveller",
    desc: "Attend events in 3 cities",
    xp: 200,
    current: 1,
    target: 3,
    unit: "cities",
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
  const [isXpGuideOpen, setIsXpGuideOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [leaderboardTab, setLeaderboardTab] = useState("all-time");

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

  // Apple Health concentric circles math
  // Outer circle: Level Progress (PassQo Pink #FF4E7A)
  const rOuter = 40;
  const circOuter = 2 * Math.PI * rOuter; // ~251.3
  const offsetOuter = circOuter - (progressPercent / 100) * circOuter;

  // Inner circle: Badges Progress (Gamification Teal #00C896)
  const badgePercent = 35; // 35% milestone progression
  const rInner = 28;
  const circInner = 2 * Math.PI * rInner; // ~175.9
  const offsetInner = circInner - (badgePercent / 100) * circInner;

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2400);
  };

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/invite?ref=${user?.id || "manohar"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    showToast("Invite link copied to clipboard");
  };

  return (
    <div className="min-h-screen bg-[#FBF9F6] text-[#2C2738] flex flex-col justify-between selection:bg-[#FF4E7A]/20">
      {/* Mobile Subpage Header */}
      <SubPageHeader title="Rewards" />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-white text-[#2C2738] text-xs font-semibold px-4 py-2.5 rounded-2xl shadow-lg border border-[#EDE8E1] flex items-center gap-2 animate-in slide-in-from-bottom-2 duration-200">
          <Zap className="w-3.5 h-3.5 text-[#FF4E7A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Container: Clean Apple-Style Whitespace, Top Aligned, Super Responsive on Mobile & Tablets */}
      <main className="max-w-5xl w-full mx-auto px-3.5 sm:px-6 md:px-8 pt-16 sm:pt-18 md:pt-20 pb-24 sm:pb-16 flex-1 flex flex-col justify-start">
        
        {/* Top Header: Clean, Minimalist (No redundant desktop back button) */}
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-5">
          <div>
            <h1 className="font-display font-bold text-xl sm:text-2xl text-[#2C2738] tracking-tight">
              Rewards & Levels
            </h1>
            <p className="text-xs text-[#8C8599] mt-0.5">
              Earn XP, complete quests, and unlock exclusive VIP perks
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsXpGuideOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C8599] hover:text-[#2C2738] transition-colors cursor-pointer bg-white px-3 sm:px-3.5 py-1.5 rounded-full border border-[#EDE8E1] shadow-2xs hover:border-[#FF4E7A]/30 flex-shrink-0"
          >
            <Info className="w-3.5 h-3.5 text-[#FF4E7A]" />
            <span className="hidden xs:inline">How XP Works</span>
            <span className="xs:hidden">XP Info</span>
          </button>
        </div>

        {/* ── TOP HERO STATUS CARD: APPLE HEALTH DUAL CONCENTRIC ACTIVITY RINGS ── */}
        <div className="rounded-3xl bg-white border border-[#EDE8E1] p-4 sm:p-5 md:p-6 shadow-sm mb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            
            {/* Left: Dual Apple Health Concentric Rings + Level Details */}
            <div className="flex items-center gap-3.5 sm:gap-5 flex-1 min-w-0">
              
              {/* Apple Health 2-Ring Concentric SVG Activity Meter */}
              <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-26 md:h-26 flex items-center justify-center flex-shrink-0">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* Outer Ring: Level XP Progression (PassQo Pink) */}
                  <circle
                    cx="50"
                    cy="50"
                    r={rOuter}
                    className="stroke-[#FFE4EC]"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={rOuter}
                    className="stroke-[#FF4E7A] transition-all duration-1000 ease-out"
                    strokeWidth="6"
                    strokeDasharray={circOuter}
                    strokeDashoffset={offsetOuter}
                    strokeLinecap="round"
                    fill="none"
                  />

                  {/* Inner Ring: Badges Progression (Gamification Teal) */}
                  <circle
                    cx="50"
                    cy="50"
                    r={rInner}
                    className="stroke-[#E6FAF4]"
                    strokeWidth="5.5"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r={rInner}
                    className="stroke-[#00C896] transition-all duration-1000 ease-out"
                    strokeWidth="5.5"
                    strokeDasharray={circInner}
                    strokeDashoffset={offsetInner}
                    strokeLinecap="round"
                    fill="none"
                  />
                </svg>

                {/* Center Badge: Level Number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none select-none">
                  <Crown className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#FF4E7A] -mb-0.5" />
                  <span className="font-display font-black text-xl sm:text-2xl text-[#2C2738] leading-none">
                    {currentLevel.level}
                  </span>
                </div>
              </div>

              {/* Status Labels & Dual Legend */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display font-bold text-base sm:text-lg md:text-xl text-[#2C2738] leading-tight truncate">
                    Level {currentLevel.level} — {currentLevel.name}
                  </h2>
                  <span className="text-[10px] sm:text-xs font-bold px-2 sm:px-2.5 py-0.5 rounded-full bg-[#FFF0F4] text-[#FF4E7A] border border-[#FFD5E0] whitespace-nowrap">
                    {userXP} XP TOTAL
                  </span>
                </div>

                {/* Dual Ring Apple Health Legend */}
                <div className="mt-2 sm:mt-2.5 space-y-1 sm:space-y-1.5">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-[#756C84]">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#FF4E7A] flex-shrink-0" />
                    <span className="truncate"><strong>Level Progress:</strong> {userXP}/{nextLevel.xpRequired} XP ({xpNeeded} XP to L{nextLevel.level})</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs font-medium text-[#756C84]">
                    <span className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-[#00C896] flex-shrink-0" />
                    <span className="truncate"><strong>Milestones:</strong> 2 Active Perks • 1/6 Badges</span>
                  </div>
                </div>
              </div>

            </div>

            {/* Right: Crisp Metrics & Leaderboard Button */}
            <div className="flex flex-col sm:flex-row md:flex-row items-stretch sm:items-center justify-between md:justify-end gap-3 sm:gap-4 pt-3 sm:pt-4 md:pt-0 border-t border-[#F5F0EB] md:border-t-0 flex-shrink-0">
              <div className="grid grid-cols-3 gap-2 bg-[#FBF9F6] md:bg-transparent p-2.5 md:p-0 rounded-2xl md:rounded-none border border-[#EDE8E1] md:border-0 text-center items-center">
                <div>
                  <span className="text-sm sm:text-base font-bold font-display text-[#2C2738] block leading-none">
                    8
                  </span>
                  <span className="text-[10px] text-[#8C8599] font-medium mt-1 block">Tickets</span>
                </div>
                <div className="relative">
                  <div className="hidden md:block absolute -left-2 top-1/2 -translate-y-1/2 w-px h-6 bg-[#EDE8E1]" />
                  <span className="text-sm sm:text-base font-bold font-display text-[#2C2738] block leading-none">
                    0
                  </span>
                  <span className="text-[10px] text-[#8C8599] font-medium mt-1 block">Invites</span>
                  <div className="hidden md:block absolute -right-2 top-1/2 -translate-y-1/2 w-px h-6 bg-[#EDE8E1]" />
                </div>
                <div>
                  <span className="text-sm sm:text-base font-bold font-display text-[#FF4E7A] block leading-none">
                    0/6
                  </span>
                  <span className="text-[10px] text-[#8C8599] font-medium mt-1 block">Badges</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(true)}
                className="bg-[#FBF9F6] hover:bg-[#FFF0F4] text-[#2C2738] hover:text-[#FF4E7A] border border-[#EDE8E1] hover:border-[#FFD5E0] font-semibold text-xs py-2 px-3.5 rounded-full transition-all flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap active:scale-95 shadow-2xs"
              >
                <Trophy className="w-3.5 h-3.5 text-[#FF4E7A]" />
                <span>Leaderboard</span>
              </button>
            </div>

          </div>
        </div>

        {/* ── MAIN ARENA: 2 MINIMALIST COLUMNS (No Horizontal Scrollbars!) ── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-stretch">
          
          {/* ══════════════════════════════════════════════════════════════
              LEFT COLUMN: LEVEL PROGRESSION (100% Responsive, NO Scrollbar)
             ══════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl border border-[#EDE8E1] p-4 sm:p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <h3 className="font-display font-bold text-sm sm:text-base text-[#2C2738]">
                  Level Progression
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAllLevelsOpen(true)}
                  className="text-xs font-semibold text-[#FF4E7A] hover:underline transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>All 10 levels</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Modern Interactive Number Line (Levels 1 to 10): 100% responsive, never distorts */}
              <div className="w-full pt-6 pb-5 px-1 mb-2 select-none">
                <div className="relative w-full h-1.5 bg-[#F0EAE1] rounded-full">
                  {/* Active Progress Fill from Level 1 up to Current Level */}
                  <div
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-[#00C896] to-[#FF4E7A] rounded-full transition-all duration-500"
                    style={{
                      width: `${((currentLevel.level - 1) / (ALL_LEVELS.length - 1)) * 100}%`,
                    }}
                  />

                  {/* Evenly Spaced Ticks & Numbers across the line */}
                  <div className="absolute inset-0 flex items-center justify-between">
                    {ALL_LEVELS.map((lvl) => {
                      const isPast = lvl.level < currentLevel.level;
                      const isCurrent = lvl.level === currentLevel.level;

                      return (
                        <button
                          key={lvl.level}
                          type="button"
                          onClick={() => setSelectedLevel(lvl)}
                          title={`Level ${lvl.level} — ${lvl.name} (${lvl.xpRequired} XP)`}
                          className="group relative flex flex-col items-center justify-center cursor-pointer focus:outline-none touch-manipulation"
                        >
                          {/* Current Level Indicator Badge floating above */}
                          {isCurrent && (
                            <span className="absolute -top-6 px-1.5 py-0.5 rounded-md bg-[#FFF0F4] border border-[#FFD5E0] text-[9px] font-extrabold text-[#FF4E7A] whitespace-nowrap shadow-2xs">
                              YOU
                            </span>
                          )}

                          {/* Tick Node on the line */}
                          <span
                            className={`rounded-full transition-all duration-200 flex-shrink-0 ${
                              isCurrent
                                ? "w-3.5 h-3.5 sm:w-4 sm:h-4 bg-[#FF4E7A] ring-4 ring-[#FFD5E0] shadow-xs z-20"
                                : isPast
                                ? "w-2.5 h-2.5 sm:w-3 sm:h-3 bg-[#00C896] ring-2 ring-white z-10"
                                : "w-2 h-2 sm:w-2.5 sm:h-2.5 bg-[#D6CFC7] group-hover:bg-[#FF4E7A] group-hover:scale-125 z-10"
                            }`}
                          />

                          {/* Number placed cleanly below the line */}
                          <span
                            className={`absolute top-4 sm:top-4.5 text-[10px] sm:text-[11px] transition-all font-bold ${
                              isCurrent
                                ? "text-[#FF4E7A] font-extrabold scale-110"
                                : isPast
                                ? "text-[#00C896]"
                                : "text-[#A69FB0] group-hover:text-[#2C2738]"
                            }`}
                          >
                            {lvl.level}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Active Perks: Clean and Minimal */}
              <div className="bg-[#FBF9F6] border border-[#EDE8E1] rounded-2xl p-3.5 sm:p-4 mb-3.5 sm:mb-4">
                <div className="flex items-center justify-between mb-2 sm:mb-2.5">
                  <span className="text-xs font-bold text-[#2C2738]">
                    Current Perks Unlocked
                  </span>
                  <span className="text-[10px] font-semibold text-[#00C896] bg-white px-2 py-0.5 rounded-full border border-[#00C896]/20">
                    Active
                  </span>
                </div>

                <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                  {currentLevel.perks.map((perk, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-xl bg-white text-[#2C2738] text-[11px] sm:text-xs font-medium border border-[#EDE8E1]"
                    >
                      <Check className="w-3 h-3 text-[#00C896] stroke-[2.5]" />
                      <span>{perk}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Next Level Card with Always-Visible Progress Bar & What to Do Guide */}
              <div
                onClick={() => setSelectedLevel(nextLevel)}
                className="p-3.5 sm:p-4 rounded-2xl bg-[#FBF9F6] hover:bg-white border border-[#EDE8E1] hover:border-[#FFD5E0] transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-[#FFF0F4] border border-[#FFD5E0] flex items-center justify-center text-[#FF4E7A] font-bold text-xs flex-shrink-0">
                      L{nextLevel.level}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                        <span className="text-xs font-bold text-[#2C2738] group-hover:text-[#FF4E7A] transition-colors truncate">
                          Next: Level {nextLevel.level} — {nextLevel.name}
                        </span>
                        <span className="text-[9px] sm:text-[10px] font-bold text-[#FF4E7A] bg-[#FFF0F4] px-1.5 py-0.2 rounded-md">
                          Locked
                        </span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] text-[#8C8599] mt-0.5 block truncate">
                        Unlocks {nextLevel.perks.join(" • ")}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-[#8C8599] group-hover:translate-x-0.5 transition-transform flex-shrink-0" />
                </div>

                {/* Always-Visible Progress Bar & XP Remaining */}
                <div className="mt-2.5 sm:mt-3 pt-2.5 border-t border-[#EDE8E1]">
                  <div className="flex items-center justify-between text-xs font-medium text-[#756C84] mb-1.5">
                    <span>Progress to Level {nextLevel.level}</span>
                    <span className="font-bold text-[#2C2738]">{userXP} / {nextLevel.xpRequired} XP</span>
                  </div>
                  <div className="h-2 bg-[#F2EDE6] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4E7A] to-[#FF7A59] rounded-full transition-all duration-500"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between mt-1.5 text-[10px] sm:text-[11px] gap-2">
                    <span className="font-bold text-[#FF4E7A] truncate">{xpNeeded} XP left to unlock</span>
                    <span className="text-[#8C8599] font-semibold group-hover:text-[#FF4E7A] flex items-center gap-1 transition-colors flex-shrink-0">
                      <span>What to do</span>
                      <span className="text-xs">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT COLUMN: BADGES (Responsive Grid)
             ══════════════════════════════════════════════════════════════ */}
          <div className="bg-white rounded-3xl border border-[#EDE8E1] p-4 sm:p-5 md:p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-3.5 sm:mb-4">
                <h3 className="font-display font-bold text-sm sm:text-base text-[#2C2738]">
                  Badges
                </h3>
                <button
                  type="button"
                  onClick={() => setIsAllBadgesOpen(true)}
                  className="text-xs font-semibold text-[#FF4E7A] hover:underline transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2x2 Clean Apple-Style Badge Tiles with Responsive Grid */}
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-2.5 sm:gap-3">
                {ALL_BADGES.slice(0, 4).map((b) => {
                  const pct = Math.min(100, Math.round((b.current / b.target) * 100));

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBadge(b)}
                      className="rounded-2xl p-3 sm:p-3.5 border border-[#EDE8E1] bg-white hover:border-[#FFD5E0] hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-xl sm:text-2xl select-none">{b.icon}</span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#FFF0F4] text-[#FF4E7A]">
                            +{b.xp} XP
                          </span>
                        </div>
                        <h4 className="font-bold text-xs text-[#2C2738] truncate">
                          {b.title}
                        </h4>
                        <p className="text-[10px] sm:text-[11px] text-[#8C8599] mt-0.5 line-clamp-1">
                          {b.desc}
                        </p>
                      </div>

                      {/* Clean Progress Meter */}
                      <div className="mt-2.5 sm:mt-3 pt-1">
                        <div className="h-1.5 bg-[#F2EDE6] rounded-full overflow-hidden mb-1">
                          <div
                            className="h-full bg-[#FF4E7A] rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-right text-[10px] font-medium text-[#8C8599]">
                          {b.current}/{b.target} {b.unit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

        </div>

      </main>

      {/* ── MODAL 1: LEADERBOARD ── */}
      {isLeaderboardOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLeaderboardOpen(false);
          }}
          className="fixed inset-0 z-50 bg-[#2C2738]/30 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-4.5 sm:p-6 shadow-xl border border-[#EDE8E1] flex flex-col max-h-[85vh] sm:max-h-[80vh] my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <Trophy className="w-5 h-5 text-[#FF4E7A]" />
                <h3 className="font-display font-bold text-base text-[#2C2738]">
                  Leaderboard
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F5EFF2] flex items-center justify-center text-[#8C8599] hover:text-[#2C2738] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Timeframe Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#FBF9F6] rounded-full my-3.5 border border-[#EDE8E1] flex-shrink-0">
              {["all-time", "month", "week"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLeaderboardTab(tab)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-full transition-all cursor-pointer text-center capitalize ${
                    leaderboardTab === tab
                      ? "bg-white text-[#FF4E7A] shadow-xs"
                      : "text-[#8C8599] hover:text-[#2C2738]"
                  }`}
                >
                  {tab === "all-time" ? "All Time" : tab === "month" ? "This Month" : "This Week"}
                </button>
              ))}
            </div>

            {/* Leaderboard List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#F2EDE6] pr-1 -mr-1">
              {LEADERBOARD_USERS.map((item, idx) => (
                <div
                  key={idx}
                  className={`py-3 flex items-center justify-between gap-3 px-3 rounded-2xl transition-colors ${
                    item.isYou ? "bg-[#FFF0F4]" : "hover:bg-[#FBF9F6]"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="w-5 text-center text-xs font-bold text-[#8C8599]">
                      {item.rank}
                    </span>
                    <div
                      className="w-8 h-8 rounded-full text-white font-bold text-xs flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.name.charAt(0)}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-xs text-[#2C2738]">
                          {item.name}
                        </span>
                        {item.isYou && (
                          <span className="bg-[#FF4E7A] text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-[#8C8599]">
                        Level {item.level}
                      </span>
                    </div>
                  </div>

                  <span className="font-bold text-xs text-[#2C2738]">
                    {item.xp.toLocaleString()} XP
                  </span>
                </div>
              ))}
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
          className="fixed inset-0 z-50 bg-[#2C2738]/30 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-3xl rounded-3xl p-4.5 sm:p-7 shadow-2xl border border-[#EDE8E1] flex flex-col max-h-[85vh] sm:max-h-[80vh] my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6] flex-shrink-0">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg text-[#2C2738]">
                  All Levels & Perks
                </h3>
                <p className="text-xs text-[#8C8599] mt-0.5">
                  10-level progression and permanent unlocked perks
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsAllLevelsOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F5EFF2] flex items-center justify-center text-[#8C8599] hover:text-[#2C2738] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* 2-Column Spacious Grid */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 pr-1 -mr-1">
              {ALL_LEVELS.map((lvl) => {
                const isPast = lvl.level < currentLevel.level;
                const isCurrent = lvl.level === currentLevel.level;

                return (
                  <div
                    key={lvl.level}
                    className={`p-3.5 rounded-2xl transition-all border ${
                      isCurrent
                        ? "bg-[#FFF0F4] border-[#FFD5E0] shadow-xs"
                        : "bg-[#FBF9F6] border-[#EDE8E1] hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? "bg-[#FF4E7A] text-white shadow-xs"
                              : isPast
                              ? "bg-[#00C896] text-white"
                              : "bg-[#F2EDE6] text-[#8C8599]"
                          }`}
                        >
                          {lvl.level}
                        </div>
                        <h4 className="font-bold text-xs sm:text-sm text-[#2C2738]">
                          {lvl.name}
                        </h4>
                        {isCurrent && (
                          <span className="text-[10px] font-bold text-[#FF4E7A] bg-white px-2 py-0.2 rounded-full border border-[#FFD5E0]">
                            Current
                          </span>
                        )}
                      </div>
                      <span className="text-xs font-semibold text-[#8C8599]">
                        {lvl.xpRequired.toLocaleString()} XP
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 flex-wrap">
                      {lvl.perks.map((perk, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-white text-[#2C2738] border border-[#EDE8E1]"
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
          className="fixed inset-0 z-50 bg-[#2C2738]/30 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-3xl p-5 sm:p-6 shadow-xl border border-[#EDE8E1] text-center my-auto animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="text-4xl mb-3 select-none">{selectedBadge.icon}</div>
            <h3 className="font-display font-bold text-base text-[#2C2738]">
              {selectedBadge.title}
            </h3>
            <p className="text-xs text-[#8C8599] mt-1 mb-4">
              {selectedBadge.desc}
            </p>

            <div className="bg-[#FBF9F6] p-3.5 rounded-2xl border border-[#EDE8E1] mb-4 text-left">
              <div className="flex items-center justify-between text-xs font-semibold text-[#2C2738] mb-1.5">
                <span>Progress</span>
                <span className="text-[#FF4E7A] font-bold">
                  {selectedBadge.isCurrency
                    ? `₹${selectedBadge.current} / ₹${selectedBadge.target}`
                    : `${selectedBadge.current}/${selectedBadge.target} ${selectedBadge.unit}`}
                </span>
              </div>
              <div className="h-2 bg-[#F2EDE6] rounded-full overflow-hidden">
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
              className="w-full py-2.5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ALL BADGES CATALOG ── */}
      {isAllBadgesOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAllBadgesOpen(false);
          }}
          className="fixed inset-0 z-50 bg-[#2C2738]/30 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-3xl rounded-3xl p-4.5 sm:p-7 shadow-xl border border-[#EDE8E1] flex flex-col max-h-[85vh] sm:max-h-[80vh] my-auto animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6] flex-shrink-0">
              <h3 className="font-display font-bold text-base text-[#2C2738]">
                All Badges
              </h3>
              <button
                type="button"
                onClick={() => setIsAllBadgesOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F5EFF2] flex items-center justify-center text-[#8C8599] hover:text-[#2C2738] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-3 py-3 pr-1 -mr-1">
              {ALL_BADGES.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setIsAllBadgesOpen(false);
                    setSelectedBadge(b);
                  }}
                  className="rounded-2xl p-3.5 border border-[#EDE8E1] bg-[#FBF9F6] hover:bg-white hover:border-[#FFD5E0] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xl select-none">{b.icon}</span>
                    <span className="text-[10px] font-bold text-[#FF4E7A] bg-[#FFF0F4] px-2 py-0.5 rounded-full border border-[#FFD5E0]">
                      +{b.xp} XP
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-[#2C2738]">
                    {b.title}
                  </h4>
                  <p className="text-[11px] text-[#8C8599] mt-0.5 line-clamp-1">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: LEVEL DETAIL, PROGRESS & WHAT TO DO GUIDE ── */}
      {selectedLevel && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLevel(null);
          }}
          className="fixed inset-0 z-50 bg-[#2C2738]/30 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-4.5 sm:p-6 shadow-2xl border border-[#EDE8E1] my-auto animate-in zoom-in-95 duration-200 flex flex-col max-h-[85vh] sm:max-h-[80vh]">
            {/* Header */}
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6] flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#FFF0F4] border border-[#FFD5E0] text-[#FF4E7A] font-black text-sm flex items-center justify-center">
                  L{selectedLevel.level}
                </div>
                <div>
                  <h3 className="font-display font-bold text-base text-[#2C2738]">
                    Level {selectedLevel.level} — {selectedLevel.name}
                  </h3>
                  <span className="text-[11px] text-[#8C8599]">
                    {selectedLevel.level <= currentLevel.level ? "Currently Unlocked" : "Next Milestone Target"}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedLevel(null)}
                className="w-8 h-8 rounded-full hover:bg-[#F5EFF2] flex items-center justify-center text-[#8C8599] hover:text-[#2C2738] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Body */}
            <div className="flex-1 overflow-y-auto py-3.5 space-y-3.5 pr-1 -mr-1">
              
              {/* Progress Bar & XP Remaining */}
              <div className="bg-[#FBF9F6] p-4 rounded-2xl border border-[#EDE8E1]">
                <div className="flex items-center justify-between text-xs font-semibold text-[#2C2738] mb-1.5">
                  <span>Level Progress</span>
                  <span className="font-bold text-[#FF4E7A]">
                    {selectedLevel.level <= currentLevel.level
                      ? `${selectedLevel.xpRequired} XP Completed`
                      : `${userXP} / ${selectedLevel.xpRequired} XP`}
                  </span>
                </div>
                
                <div className="h-2.5 bg-[#F2EDE6] rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-gradient-to-r from-[#FF4E7A] to-[#FF7A59] rounded-full transition-all duration-500"
                    style={{
                      width: selectedLevel.level <= currentLevel.level ? "100%" : `${progressPercent}%`,
                    }}
                  />
                </div>

                <div className="text-xs font-medium text-[#756C84]">
                  {selectedLevel.level <= currentLevel.level ? (
                    <span className="text-[#00C896] font-bold flex items-center gap-1.5">
                      <Check className="w-3.5 h-3.5" /> All perks for this tier are unlocked & active!
                    </span>
                  ) : (
                    <span>
                      You need <strong className="text-[#FF4E7A] font-bold">{Math.max(0, selectedLevel.xpRequired - userXP)} more XP</strong> to unlock Level {selectedLevel.level}.
                    </span>
                  )}
                </div>
              </div>

              {/* Perks Unlocked */}
              <div>
                <h4 className="text-xs font-bold text-[#2C2738] mb-2">Perks Included in This Tier:</h4>
                <div className="space-y-1.5">
                  {selectedLevel.perks.map((p, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-[#2C2738] font-medium bg-white p-2.5 rounded-xl border border-[#EDE8E1]">
                      <Check className="w-3.5 h-3.5 text-[#00C896] stroke-[2.5]" />
                      <span>{p}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* What to do to reach this level */}
              {selectedLevel.level > currentLevel.level && (
                <div>
                  <h4 className="text-xs font-bold text-[#2C2738] mb-2 flex items-center gap-1.5">
                    <Zap className="w-3.5 h-3.5 text-[#FF4E7A]" />
                    <span>What to do to reach Level {selectedLevel.level}:</span>
                  </h4>
                  <div className="space-y-2">
                    <div
                      onClick={() => {
                        setSelectedLevel(null);
                        navigate("/events");
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#FFF5F8] border border-[#EDE8E1] hover:border-[#FFD5E0] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span>🎟️</span>
                        <div>
                          <span className="font-bold text-[#2C2738] block group-hover:text-[#FF4E7A]">Book an event</span>
                          <span className="text-[10px] text-[#8C8599]">Check in at any live venue</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#00C896] bg-[#E6FAF4] px-2 py-0.5 rounded-full">+100 XP</span>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedLevel(null);
                        handleCopyReferral();
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#FFF5F8] border border-[#EDE8E1] hover:border-[#FFD5E0] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span>👥</span>
                        <div>
                          <span className="font-bold text-[#2C2738] block group-hover:text-[#FF4E7A]">Invite friends</span>
                          <span className="text-[10px] text-[#8C8599]">Earn when friends attend gigs</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#7C3AED] bg-[#FAF5FF] px-2 py-0.5 rounded-full">+200 XP</span>
                    </div>

                    <div
                      onClick={() => {
                        setSelectedLevel(null);
                        setIsEditProfileOpen(true);
                      }}
                      className="flex items-center justify-between p-3 rounded-xl bg-white hover:bg-[#FFF5F8] border border-[#EDE8E1] hover:border-[#FFD5E0] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-2 text-xs">
                        <span>📋</span>
                        <div>
                          <span className="font-bold text-[#2C2738] block group-hover:text-[#FF4E7A]">Complete profile details</span>
                          <span className="text-[10px] text-[#8C8599]">Add your city & bio</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold text-[#FF4E7A] bg-[#FFF0F4] px-2 py-0.5 rounded-full">+50 XP</span>
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Footer */}
            <button
              type="button"
              onClick={() => setSelectedLevel(null)}
              className="w-full py-2.5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95 flex-shrink-0 mt-3"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 6: HOW XP WORKS GUIDE ── */}
      {isXpGuideOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsXpGuideOpen(false);
          }}
          className="fixed inset-0 z-50 bg-[#2C2738]/30 backdrop-blur-md flex items-center justify-center p-3.5 sm:p-6 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 sm:p-6 shadow-xl border border-[#EDE8E1] my-auto animate-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3.5 border-b border-[#F2EDE6]">
              <h3 className="font-display font-bold text-base text-[#2C2738]">
                How XP Works
              </h3>
              <button
                type="button"
                onClick={() => setIsXpGuideOpen(false)}
                className="w-8 h-8 rounded-full hover:bg-[#F5EFF2] flex items-center justify-center text-[#8C8599] hover:text-[#2C2738] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-4 space-y-3 text-xs text-[#8C8599]">
              <div className="p-3 bg-[#FBF9F6] rounded-2xl border border-[#EDE8E1]">
                <p className="font-bold text-[#2C2738] mb-0.5">🎟️ Ticket Check-ins (+100 XP)</p>
                <p className="text-[11px]">Earn XP each time your event ticket is scanned.</p>
              </div>
              <div className="p-3 bg-[#FBF9F6] rounded-2xl border border-[#EDE8E1]">
                <p className="font-bold text-[#2C2738] mb-0.5">👥 Invite Friends (+200 XP)</p>
                <p className="text-[11px]">Earn +200 XP when friends join and attend an event.</p>
              </div>
              <div className="p-3 bg-[#FBF9F6] rounded-2xl border border-[#EDE8E1]">
                <p className="font-bold text-[#2C2738] mb-0.5">⭐ Badges (+100 to +500 XP)</p>
                <p className="text-[11px]">Unlock milestone badges for instant bonus XP drops.</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsXpGuideOpen(false)}
              className="w-full py-2.5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs active:scale-95"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
      />
    </div>
  );
}

export default RewardsPage;
