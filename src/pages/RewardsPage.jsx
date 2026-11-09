import { useState } from "react";
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
  Info,
  Zap,
  Shield,
  Layers,
  Compass,
} from "lucide-react";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { getUser } from "@/lib/auth/storage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";

/* ─── LEVELS DEFINITION (1 to 10) ─── */
const ALL_LEVELS = [
  {
    level: 1,
    name: "Newcomer",
    xpRequired: 0,
    unlocked: true,
    rarity: "COMMON",
    perks: ["Access to platform", "Basic ticket purchasing"],
    desc: "Start your live journey and attend your first event.",
  },
  {
    level: 2,
    name: "Attendee",
    xpRequired: 100,
    unlocked: true,
    rarity: "COMMON",
    perks: ["Event drop notifications", "Community hub access"],
    desc: "Stay notified on your favorite artists and secret shows.",
  },
  {
    level: 3,
    name: "Enthusiast",
    xpRequired: 300,
    unlocked: true,
    rarity: "UNCOMMON",
    perks: ["Early event announcements", "Priority waitlist jump"],
    desc: "Skip the line when waitlists open and get 24h heads-up.",
  },
  {
    level: 4,
    name: "Regular",
    xpRequired: 600,
    unlocked: true,
    isCurrent: true,
    rarity: "RARE",
    perks: ["Zero fee ticket transfers", "Extended event memory archive"],
    desc: "Transfer tickets to friends without fees and retain past gig memories.",
  },
  {
    level: 5,
    name: "Loyalist",
    xpRequired: 1000,
    unlocked: false,
    rarity: "RARE",
    perks: ["Exclusive presale windows", "Festival VIP lounge access"],
    desc: "Guaranteed presale access and entry to festival lounge tents.",
  },
  {
    level: 6,
    name: "Devotee",
    xpRequired: 1500,
    unlocked: false,
    rarity: "EPIC",
    perks: ["Meet & greet opportunities", "Collector digital badge"],
    desc: "Win backstage sessions with featured DJs, creators and headliners.",
  },
  {
    level: 7,
    name: "Champion",
    xpRequired: 2200,
    unlocked: false,
    rarity: "EPIC",
    perks: ["Prime venue seating", "Backstage soundcheck tour"],
    desc: "Priority entry doors and behind-the-scenes access passes.",
  },
  {
    level: 8,
    name: "VIP Member",
    xpRequired: 3000,
    unlocked: false,
    rarity: "LEGENDARY",
    perks: ["Private organiser Q&A", "Secret pop-up invitations"],
    desc: "Intimate sessions with event curators and secret venue invites.",
  },
  {
    level: 9,
    name: "Elite",
    xpRequired: 4000,
    unlocked: false,
    rarity: "LEGENDARY",
    perks: ["Dedicated concierge line", "Complimentary seat upgrades"],
    desc: "Personal booking concierge and automated tier upgrades.",
  },
  {
    level: 10,
    name: "Legend",
    xpRequired: 5500,
    unlocked: false,
    rarity: "MYTHIC",
    perks: ["Lifetime VIP pass status", "All future perks unlocked"],
    desc: "The pinnacle Passqo status. Unlocks every perk across all events.",
  },
];

/* ─── GAMIFIED BADGES DEFINITION ─── */
const ALL_BADGES = [
  {
    id: "perfect-attendance",
    icon: "⭐",
    title: "Perfect Attendance",
    desc: "Attend 10 live events in a single year",
    rarity: "EPIC",
    xp: 300,
    current: 6,
    target: 10,
    unit: "events",
    highlight: true,
  },
  {
    id: "festival-goer",
    icon: "🎪",
    title: "Festival Goer",
    desc: "Attend 3 multi-day festival weekenders",
    rarity: "RARE",
    xp: 150,
    current: 1,
    target: 3,
    unit: "festivals",
    highlight: false,
  },
  {
    id: "genre-explorer",
    icon: "🎭",
    title: "Genre Explorer",
    desc: "Attend events across 5 different categories",
    rarity: "UNCOMMON",
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
    desc: "Purchase 5 VIP stage pass tickets",
    rarity: "EPIC",
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
    rarity: "RARE",
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
    rarity: "LEGENDARY",
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

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage("");
    }, 2600);
  };

  const handleCopyReferral = () => {
    const link = `${window.location.origin}/invite?ref=${user?.id || "manohar"}`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(link);
    }
    showToast("Quest link copied to clipboard! 🎁");
  };

  const handleDesktopBack = () => {
    if (location.state?.openedFromSidebar) {
      navigate("/");
      window.dispatchEvent(new CustomEvent("passqo-open-profile-menu"));
    } else {
      navigate("/");
    }
  };

  const rarityColor = (rarity) => {
    switch (rarity) {
      case "MYTHIC":
        return "text-purple-400 bg-purple-950/40 border-purple-800/40";
      case "LEGENDARY":
        return "text-amber-400 bg-amber-950/40 border-amber-800/40";
      case "EPIC":
        return "text-[#FF4E7A] bg-[#FF4E7A]/10 border-[#FF4E7A]/25";
      case "RARE":
        return "text-blue-400 bg-blue-950/40 border-blue-800/40";
      default:
        return "text-neutral-400 bg-neutral-800/40 border-neutral-700/40";
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1B1B23] flex flex-col justify-between">
      {/* ── MOBILE / SUBPAGE HEADER ── */}
      <SubPageHeader title="Rewards" />

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#121218] text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-white/10 flex items-center gap-2.5 animate-in slide-in-from-bottom-3 duration-200">
          <Zap className="w-4 h-4 text-[#FF4E7A] flex-shrink-0 animate-bounce" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── MAIN CONTENT (Clean, compact, no-scroll gamified structure) ── */}
      <main className="max-w-6xl w-full mx-auto px-4 sm:px-6 pt-20 sm:pt-22 md:pt-26 pb-4 flex-1 flex flex-col justify-center">
        {/* Top Navigation Row */}
        <div className="flex items-center justify-between gap-4 mb-3">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleDesktopBack}
              className="hidden md:inline-flex items-center gap-1.5 text-xs font-bold text-neutral-600 hover:text-[#FF4E7A] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>
            <div className="hidden md:block w-px h-4 bg-neutral-300" />
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold text-[#121218] uppercase tracking-wider bg-black/5 px-2 py-0.5 rounded-full border border-black/10">
                PLAYER REWARDS
              </span>
              <h1 className="font-display font-extrabold text-lg sm:text-xl md:text-2xl text-[#1B1B23] tracking-tight">
                Live Passes & Perks
              </h1>
            </div>
          </div>

          {/* Quick Info & Help Trigger */}
          <button
            type="button"
            onClick={() => setIsXpGuideOpen(true)}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#1B1B23] transition-colors cursor-pointer bg-white px-3 py-1.5 rounded-full border border-black/8 shadow-2xs"
          >
            <Info className="w-3.5 h-3.5 text-[#FF4E7A]" />
            <span>How XP Works</span>
          </button>
        </div>

        {/* ── ULTRA-CLEAN GAMIFIED PLAYER HUD CARD (Replaced gradient with Clean Obsidian Console) ── */}
        <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-[#121218] text-white p-4 sm:p-5 shadow-sm border border-white/8 mb-3.5">
          {/* Subtle micro ambient glow */}
          <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 bg-[#FF4E7A]/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            {/* Left: Player Level Shield + Rank + Segmented XP Bar */}
            <div className="flex items-center gap-3.5 sm:gap-4 flex-1 min-w-0">
              {/* Level Shield Crest */}
              <div className="relative flex-shrink-0">
                <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-2xl bg-[#1C1C24] border-2 border-white/20 flex flex-col items-center justify-center text-white shadow-sm ring-1 ring-white/10">
                  <Shield className="w-3.5 h-3.5 text-[#FF4E7A] mb-0.5" />
                  <span className="font-display font-extrabold text-sm sm:text-base leading-none">
                    L{currentLevel.level}
                  </span>
                </div>
                <span className="absolute -bottom-1 -right-1 bg-[#00C896] text-black text-[8px] font-black px-1 rounded-full uppercase tracking-widest shadow-xs">
                  ACTIVE
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="font-display font-extrabold text-lg sm:text-xl text-white leading-tight">
                    {currentLevel.name}
                  </h2>
                  <span className="text-[10px] font-extrabold px-2 py-0.2 rounded-md bg-[#FF4E7A]/20 text-[#FF4E7A] border border-[#FF4E7A]/30">
                    TIER IV
                  </span>
                  <span className="text-white/60 text-xs hidden sm:inline">•</span>
                  <span className="text-xs text-white/90 font-medium hidden sm:inline">
                    {userXP.toLocaleString()} XP
                  </span>
                </div>

                {/* Gamified Segmented Progress Bar */}
                <div className="flex items-center gap-2.5 mt-1.5 max-w-md">
                  <div className="flex-1 h-2 bg-white/10 rounded-full overflow-hidden p-0.5 border border-white/10">
                    <div
                      className="h-full bg-gradient-to-r from-[#FF4E7A] to-[#FF8A38] rounded-full transition-all duration-700 ease-out shadow-sm"
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-neutral-300 whitespace-nowrap">
                    {xpNeeded} XP to {nextLevel.name}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Stats Matrix + Leaderboard Action */}
            <div className="flex items-center justify-between md:justify-end gap-2.5 sm:gap-4 pt-2.5 md:pt-0 border-t border-white/10 md:border-t-0 flex-shrink-0">
              <div className="flex items-center gap-3 bg-[#1C1C24] px-3.5 py-1.5 rounded-2xl border border-white/10">
                <div className="text-center">
                  <span className="text-sm font-extrabold font-display leading-none block text-white">
                    8
                  </span>
                  <span className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">
                    Tickets
                  </span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div className="text-center">
                  <span className="text-sm font-extrabold font-display leading-none block text-white">
                    0
                  </span>
                  <span className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">
                    Referrals
                  </span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <div className="text-center">
                  <span className="text-sm font-extrabold font-display leading-none block text-[#FF4E7A]">
                    0/6
                  </span>
                  <span className="text-[9px] text-neutral-400 font-semibold uppercase tracking-wider">
                    Badges
                  </span>
                </div>
              </div>

              {/* Leaderboard Button */}
              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(true)}
                className="bg-white hover:bg-neutral-100 active:scale-95 text-[#121218] font-bold text-xs py-2 px-3.5 rounded-full shadow-sm transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
              >
                <Trophy className="w-3.5 h-3.5 text-[#FF4E7A] fill-[#FF4E7A]/20" />
                <span>Leaderboard</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── TWO-COLUMN ARENA (Level Skill Tree vs Collectible Badges) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-stretch">
          {/* ══════════════════════════════════════════════════════════════
              LEFT: MILESTONE LADDER & PERKS INVENTORY
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-xs p-4 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-extrabold text-sm sm:text-base text-[#1B1B23]">
                    Milestone Skill Tree
                  </h2>
                  <span className="text-[10px] font-extrabold bg-neutral-100 text-neutral-700 px-2 py-0.5 rounded-full">
                    10 Stages
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAllLevelsOpen(true)}
                  className="text-xs font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>All tiers</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Horizontal Skill Stage Line */}
              <div className="pt-3.5 pb-2 px-1 overflow-x-auto scrollbar-none mb-2">
                <div className="flex items-center justify-between min-w-[320px] sm:min-w-0 relative">
                  <div className="absolute top-1/2 left-2 right-2 h-0.5 bg-neutral-200 -translate-y-1/2 z-0" />

                  {ALL_LEVELS.map((lvl) => {
                    const isPast = lvl.level < currentLevel.level;
                    const isCurrent = lvl.level === currentLevel.level;

                    return (
                      <div
                        key={lvl.level}
                        onClick={() => setSelectedLevel(lvl)}
                        className="relative z-10 flex flex-col items-center cursor-pointer group"
                        title={`Stage ${lvl.level}: ${lvl.name} (${lvl.xpRequired} XP)`}
                      >
                        {isCurrent && (
                          <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#121218] text-[#00C896] text-[8px] font-black px-1 py-0.1 rounded-full shadow-2xs tracking-widest border border-[#00C896]/30">
                            YOU
                          </span>
                        )}
                        <div
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-full flex items-center justify-center font-bold text-[10px] transition-all ${
                            isCurrent
                              ? "bg-[#121218] text-white shadow-xs ring-2 ring-[#FF4E7A] scale-110"
                              : isPast
                              ? "bg-[#00C896] text-white shadow-2xs"
                              : "bg-[#EAE6E1] text-neutral-400 group-hover:bg-neutral-200"
                          }`}
                        >
                          {lvl.level}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Current Active Perks Box */}
              <div className="bg-[#FAF7F4] border border-black/6 rounded-2xl p-3 mb-2.5">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Crown className="w-3.5 h-3.5 text-[#FF4E7A]" />
                    <span className="text-xs font-bold text-[#1B1B23]">
                      Stage 4 Unlocked Perks
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-[#00C896] bg-[#00C896]/10 px-2 py-0.2 rounded-full border border-[#00C896]/20">
                    2 Active
                  </span>
                </div>

                <div className="flex items-center gap-1.5 flex-wrap">
                  {currentLevel.perks.map((perk, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-xl bg-white text-neutral-800 text-[10px] font-bold border border-black/6 shadow-2xs"
                    >
                      <Check className="w-2.5 h-2.5 text-[#00C896] stroke-[3]" />
                      <span>{perk}</span>
                    </span>
                  ))}
                </div>
              </div>

              {/* Next Stage Teaser */}
              <div
                onClick={() => setSelectedLevel(nextLevel)}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white hover:bg-neutral-50 border border-black/6 transition-colors cursor-pointer group"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-6 h-6 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <Lock className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-[#1B1B23] group-hover:text-[#FF4E7A] transition-colors">
                        Next: Stage {nextLevel.level} - {nextLevel.name}
                      </span>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        ({nextLevel.xpRequired} XP)
                      </span>
                    </div>
                    <p className="text-[10px] text-neutral-500 truncate">
                      Unlocks: {nextLevel.perks.join(" • ")}
                    </p>
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>

            {/* Bottom Ladder Modal Trigger */}
            <div className="pt-2.5 border-t border-black/5 mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Lifetime status per stage</span>
              <button
                type="button"
                onClick={() => setIsAllLevelsOpen(true)}
                className="font-bold text-neutral-800 hover:text-[#FF4E7A] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Full Skill Tree</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════════════
              RIGHT: COLLECTIBLE ACHIEVEMENT VAULT
             ══════════════════════════════════════════════════════════════ */}
          <div className="lg:col-span-6 bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-xs p-4 flex flex-col justify-between">
            <div>
              {/* Header */}
              <div className="flex items-center justify-between gap-3 mb-2.5">
                <div className="flex items-center gap-2">
                  <h2 className="font-display font-extrabold text-sm sm:text-base text-[#1B1B23]">
                    Achievement Vault
                  </h2>
                  <span className="text-[10px] font-extrabold bg-[#FF4E7A]/10 text-[#FF4E7A] px-2 py-0.5 rounded-full">
                    Collectibles
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsAllBadgesOpen(true)}
                  className="text-xs font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors flex items-center gap-0.5 cursor-pointer"
                >
                  <span>View all</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* 2x2 Grid of Clean Collectible Achievement Tiles */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {ALL_BADGES.slice(0, 4).map((b) => {
                  const pct = Math.min(100, Math.round((b.current / b.target) * 100));

                  return (
                    <div
                      key={b.id}
                      onClick={() => setSelectedBadge(b)}
                      className={`relative rounded-xl p-2.5 transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                        b.highlight
                          ? "border border-[#FF4E7A] bg-[#FFF9FA] shadow-2xs hover:shadow-xs"
                          : "border border-neutral-200/70 bg-white hover:border-neutral-300 hover:shadow-2xs"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1.5 mb-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xl select-none">{b.icon}</span>
                          <span
                            className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider ${rarityColor(
                              b.rarity
                            )}`}
                          >
                            {b.rarity}
                          </span>
                        </div>
                        <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-[#121218] text-white">
                          +{b.xp} XP
                        </span>
                      </div>

                      <div>
                        <h3 className="font-display font-bold text-xs text-[#1B1B23] leading-snug truncate">
                          {b.title}
                        </h3>
                        <p className="text-[10px] text-neutral-500 truncate mt-0.2 font-medium">
                          {b.desc}
                        </p>
                      </div>

                      {/* Progress Bar */}
                      <div className="mt-2 pt-0.5">
                        <div className="h-1.5 bg-neutral-100 rounded-full overflow-hidden mb-0.5">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${
                              b.highlight
                                ? "bg-gradient-to-r from-[#FF4E7A] to-[#FF8A38]"
                                : "bg-[#121218]"
                            }`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="text-right text-[9px] font-bold text-neutral-400">
                          {b.current}/{b.target} {b.unit}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Vault Trigger */}
            <div className="pt-2.5 border-t border-black/5 mt-2.5 flex items-center justify-between text-[11px]">
              <span className="text-neutral-400">Inspect collectible perks</span>
              <button
                type="button"
                onClick={() => setIsAllBadgesOpen(true)}
                className="font-bold text-neutral-800 hover:text-[#FF4E7A] transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Badge Showcase</span>
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ── COMPACT GAMIFIED DAILY QUESTS & BOUNTIES ── */}
        <div className="mt-3.5 bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-xs p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-7 h-7 rounded-xl bg-[#121218] text-white flex items-center justify-center font-bold">
              <Zap className="w-3.5 h-3.5 text-[#00C896] fill-[#00C896]" />
            </div>
            <div>
              <span className="font-display font-extrabold text-xs sm:text-sm text-[#1B1B23]">
                Daily Quests & Bounties
              </span>
              <span className="text-[10px] text-neutral-400 font-medium ml-1.5 hidden sm:inline">
                Instant XP rewards
              </span>
            </div>
          </div>

          {/* Action Chips */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#FFF5F8] hover:bg-[#FFEBF1] border border-[#FF4E7A]/25 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95 shadow-2xs"
            >
              <span>📋</span>
              <span>Complete profile</span>
              <span className="text-[#FF4E7A] font-extrabold text-[10px]">+50 XP</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/events")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-black/6 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95"
            >
              <span>🎟️</span>
              <span>Book event</span>
              <span className="text-neutral-500 font-extrabold text-[10px]">+100 XP</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("/referrals")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-black/6 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95"
            >
              <span>👥</span>
              <span>Recruit friends</span>
              <span className="text-neutral-500 font-extrabold text-[10px]">+200 XP</span>
            </button>

            <button
              type="button"
              onClick={handleCopyReferral}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 border border-black/6 text-xs font-bold text-[#1B1B23] transition-all cursor-pointer active:scale-95"
              title="Copy referral link"
            >
              <span>🎁</span>
              <span>Friend attends</span>
              <span className="text-neutral-500 font-extrabold text-[10px]">+100 XP</span>
            </button>
          </div>
        </div>
      </main>

      {/* ── MODAL 1: LEADERBOARD POPUP ── */}
      {isLeaderboardOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsLeaderboardOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-md rounded-3xl p-5 shadow-2xl border border-black/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#121218] text-white flex items-center justify-center font-bold">
                  <Trophy className="w-4 h-4 text-[#FF4E7A]" />
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-base text-[#1B1B23]">
                    Player Leaderboard
                  </h3>
                  <p className="text-[11px] text-neutral-500 font-medium">
                    Top attendees ranked by seasonal XP
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsLeaderboardOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Timeframe Filter Tabs */}
            <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-full my-3">
              {["all-time", "month", "week"].map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setLeaderboardTab(tab)}
                  className={`flex-1 py-1 text-xs font-bold rounded-full transition-all cursor-pointer text-center capitalize ${
                    leaderboardTab === tab
                      ? "bg-white text-[#1B1B23] shadow-xs"
                      : "text-neutral-500 hover:text-neutral-800"
                  }`}
                >
                  {tab === "all-time" ? "All Time" : tab === "month" ? "This Month" : "This Week"}
                </button>
              ))}
            </div>

            {/* Leaderboard List */}
            <div className="flex-1 overflow-y-auto divide-y divide-black/5 pr-1 -mr-1">
              {LEADERBOARD_USERS.map((item, idx) => (
                <div
                  key={idx}
                  className={`py-2.5 flex items-center justify-between gap-3 px-2 rounded-xl transition-colors ${
                    item.isYou
                      ? "bg-[#FFF0F4] border border-[#FF4E7A]/25"
                      : "hover:bg-neutral-50"
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className="w-5 text-center text-xs font-extrabold text-neutral-600">
                      {item.rank}
                    </span>

                    <div
                      className="w-8 h-8 rounded-full text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs"
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
                          <span className="bg-[#FF4E7A] text-white text-[8px] font-extrabold px-1.5 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-neutral-400 font-medium">
                        Stage {item.level}
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-display font-extrabold text-xs sm:text-sm text-[#121218]">
                      {item.xp.toLocaleString()}
                    </span>
                    <span className="text-[9px] text-neutral-400 font-bold ml-1">XP</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="pt-2.5 mt-2 border-t border-black/5 text-center">
              <p className="text-[10px] text-neutral-400">
                Leaderboard resets every Sunday at 23:59 UTC.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 2: ALL LEVELS ROADMAP POPUP ── */}
      {isAllLevelsOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAllLevelsOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-black/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <h3 className="font-display font-extrabold text-base text-[#1B1B23]">
                  10-Stage Milestone Skill Tree
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Permanent lifetime perks unlocked at every milestone
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAllLevelsOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-black/5 my-2 pr-1 -mr-1">
              {ALL_LEVELS.map((lvl) => {
                const isPast = lvl.level < currentLevel.level;
                const isCurrent = lvl.level === currentLevel.level;

                return (
                  <div
                    key={lvl.level}
                    className={`py-3 px-2.5 rounded-xl transition-colors ${
                      isCurrent
                        ? "bg-[#FAF7F4] border border-black/10"
                        : "hover:bg-neutral-50"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                            isCurrent
                              ? "bg-[#121218] text-white"
                              : isPast
                              ? "bg-[#00C896] text-white"
                              : "bg-neutral-100 text-neutral-400"
                          }`}
                        >
                          {lvl.level}
                        </div>
                        <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
                          {lvl.name}
                        </h4>
                        <span
                          className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider ${rarityColor(
                            lvl.rarity
                          )}`}
                        >
                          {lvl.rarity}
                        </span>
                        {isCurrent && (
                          <span className="bg-[#121218] text-[#00C896] text-[8px] font-black px-1.5 py-0.2 rounded-full">
                            YOU
                          </span>
                        )}
                      </div>

                      <span className="text-[11px] font-bold text-neutral-500">
                        {lvl.xpRequired.toLocaleString()} XP
                      </span>
                    </div>

                    <p className="text-[11px] text-neutral-500 mb-1.5 pl-8">{lvl.desc}</p>

                    <div className="flex items-center gap-1.5 flex-wrap pl-8">
                      {lvl.perks.map((perk, i) => (
                        <span
                          key={i}
                          className={`text-[9px] font-semibold px-2 py-0.5 rounded-full ${
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

      {/* ── MODAL 3: BADGE DETAILS POPUP ── */}
      {selectedBadge && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedBadge(null);
          }}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-3xl p-5 shadow-2xl border border-black/10 text-center animate-in zoom-in-95 duration-200">
            <div className="text-4xl mb-2 select-none">{selectedBadge.icon}</div>
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <span
                className={`text-[9px] font-black px-2 py-0.5 rounded border uppercase tracking-wider ${rarityColor(
                  selectedBadge.rarity
                )}`}
              >
                {selectedBadge.rarity}
              </span>
              <span className="inline-block bg-[#121218] text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                +{selectedBadge.xp} XP
              </span>
            </div>

            <h3 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23] mt-1">
              {selectedBadge.title}
            </h3>
            <p className="text-xs text-neutral-500 font-medium mb-4 mt-0.5">
              {selectedBadge.desc}
            </p>

            <div className="bg-neutral-50 p-3 rounded-2xl border border-neutral-100 mb-4 text-left">
              <div className="flex items-center justify-between text-xs font-bold text-neutral-700 mb-1">
                <span>Unlock Progress</span>
                <span>
                  {selectedBadge.isCurrency
                    ? `₹${selectedBadge.current} / ₹${selectedBadge.target}`
                    : `${selectedBadge.current}/${selectedBadge.target} ${selectedBadge.unit}`}
                </span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#121218] rounded-full"
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
              className="w-full py-2 rounded-full bg-[#121218] hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 4: ALL BADGES CATALOG POPUP ── */}
      {isAllBadgesOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsAllBadgesOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-lg rounded-3xl p-5 shadow-2xl border border-black/10 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div>
                <h3 className="font-display font-extrabold text-base text-[#1B1B23]">
                  Achievement Showcase
                </h3>
                <p className="text-[11px] text-neutral-500 font-medium">
                  Collect badges to earn bonus XP drops and climb tiers
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsAllBadgesOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3 pr-1 -mr-1">
              {ALL_BADGES.map((b) => (
                <div
                  key={b.id}
                  onClick={() => {
                    setIsAllBadgesOpen(false);
                    setSelectedBadge(b);
                  }}
                  className="rounded-xl p-3 border border-neutral-200/80 bg-white hover:border-[#121218] transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xl select-none">{b.icon}</span>
                    <span
                      className={`text-[8px] font-black px-1.5 py-0.2 rounded border uppercase tracking-wider ${rarityColor(
                        b.rarity
                      )}`}
                    >
                      {b.rarity}
                    </span>
                  </div>
                  <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
                    {b.title}
                  </h4>
                  <p className="text-[10px] text-neutral-500 font-medium mt-0.5 line-clamp-1">
                    {b.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL 5: SINGLE LEVEL DETAIL POPUP ── */}
      {selectedLevel && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedLevel(null);
          }}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-xs sm:max-w-sm rounded-3xl p-5 shadow-2xl border border-black/10 text-center animate-in zoom-in-95 duration-200">
            <div className="w-10 h-10 rounded-2xl bg-[#121218] text-white font-extrabold text-sm flex items-center justify-center mx-auto mb-2">
              L{selectedLevel.level}
            </div>
            <h3 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23]">
              Stage {selectedLevel.level} — {selectedLevel.name}
            </h3>
            <p className="text-xs text-neutral-500 font-bold mt-0.5">
              {selectedLevel.xpRequired.toLocaleString()} XP required
            </p>
            <p className="text-xs text-neutral-500 font-medium my-2">
              {selectedLevel.desc}
            </p>

            <div className="text-left bg-neutral-50 p-3 rounded-2xl border border-neutral-100 mb-4">
              <p className="text-xs font-bold text-neutral-700 mb-1">Perks Unlocked:</p>
              <ul className="space-y-1 text-xs text-neutral-600 font-medium">
                {selectedLevel.perks.map((p, i) => (
                  <li key={i} className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-[#00C896] stroke-[2.5]" />
                    <span>{p}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button
              type="button"
              onClick={() => setSelectedLevel(null)}
              className="w-full py-2 rounded-full bg-[#121218] hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer shadow-sm active:scale-95"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ── MODAL 6: HOW XP WORKS GUIDE POPUP ── */}
      {isXpGuideOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setIsXpGuideOpen(false);
          }}
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200 select-none"
        >
          <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-black/10 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-black/5">
              <div className="flex items-center gap-2">
                <Info className="w-4 h-4 text-[#FF4E7A]" />
                <h3 className="font-display font-extrabold text-base text-[#1B1B23]">
                  Passqo XP Economy
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsXpGuideOpen(false)}
                className="w-7 h-7 rounded-full hover:bg-neutral-100 flex items-center justify-center text-neutral-500 hover:text-neutral-900 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="py-3 space-y-2.5 text-xs text-neutral-600">
              <div className="p-2.5 bg-neutral-50 rounded-xl">
                <p className="font-bold text-[#1B1B23] mb-0.5">🎟️ Ticket Scans (+100 XP)</p>
                <p className="text-[11px] text-neutral-500">
                  Earn XP whenever your ticket is checked in at the door. Multi-day festival wristbands yield extra XP drops.
                </p>
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl">
                <p className="font-bold text-[#1B1B23] mb-0.5">👥 Squad Invites (+200 XP)</p>
                <p className="text-[11px] text-neutral-500">
                  Earn +200 XP each time a friend signs up & attends an event via your referral link.
                </p>
              </div>

              <div className="p-2.5 bg-neutral-50 rounded-xl">
                <p className="font-bold text-[#1B1B23] mb-0.5">⭐ Achievement Drops (+100 to +500 XP)</p>
                <p className="text-[11px] text-neutral-500">
                  Unlock collectible badges to claim instant bonus XP and accelerate your stage ascension.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsXpGuideOpen(false)}
              className="w-full py-2 rounded-full bg-[#121218] hover:bg-black text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Understood
            </button>
          </div>
        </div>
      )}

      {/* ── EDIT PROFILE MODAL ── */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        user={user}
      />
    </div>
  );
}

export default RewardsPage;
