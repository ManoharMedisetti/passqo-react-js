import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import { SubPageHeader } from "@/components/ui/SubPageHeader";
import { getUser, clearAuth } from "@/lib/auth/storage";
import { EditProfileModal } from "@/components/profile/EditProfileModal";
import {
  User,
  Bell,
  Lock,
  Shield,
  Eye,
  EyeOff,
  SquarePen,
  LogOut,
  ArrowLeft,
  ChevronRight,
  Sliders,
  Info,
} from "lucide-react";

const SETTINGS_SECTIONS = [
  {
    id: "profile",
    label: "Profile",
    icon: User,
    desc: "Personal information & public avatar",
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: Bell,
    desc: "Reminders, rewards, updates & alerts",
  },
  {
    id: "security",
    label: "Security",
    icon: Lock,
    desc: "Password reset & account protection",
  },
  {
    id: "privacy",
    label: "Privacy",
    icon: Shield,
    desc: "Analytics sharing & communications",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    icon: Sliders,
    desc: "High contrast, large text & motion",
  },
  {
    id: "account",
    label: "Account Details",
    icon: Info,
    desc: "App version, platform & joined date",
  },
];

export function SettingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { section } = useParams();

  const [user, setUser] = useState(() => getUser() || {});
  const [activeSection, setActiveSection] = useState("profile");
  const [isCustomEditOpen, setIsCustomEditOpen] = useState(false);
  const isClickingRef = useRef(false);
  const initialDesktopScrollDone = useRef(false);

  // Active section from URL path: /settings/:section
  const validMobileSections = [
    "notifications",
    "security",
    "privacy",
    "accessibility",
    "account",
  ];
  const activeMobileSection =
    section && validMobileSections.includes(section) ? section : null;
  const isEditProfileOpen =
    section === "edit-profile" || section === "profile" || isCustomEditOpen;

  // Scroll to top on mount (unless a specific desktop section was requested)
  useEffect(() => {
    if (!section || section === "profile") {
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      if (document.documentElement) document.documentElement.scrollTop = 0;
      if (document.body) document.body.scrollTop = 0;
    }
  }, []);

  // Sync desktop section and scroll smoothly ONLY on initial mount if a section was requested in URL
  useEffect(() => {
    if (initialDesktopScrollDone.current) return;
    if (section && [...validMobileSections, "profile"].includes(section)) {
      initialDesktopScrollDone.current = true;
      setActiveSection(section);
      if (typeof window !== "undefined" && window.innerWidth >= 768) {
        if (section === "profile") {
          window.scrollTo({ top: 0, behavior: "smooth" });
        } else {
          const el = document.getElementById(section);
          if (el) {
            setTimeout(() => {
              el.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 100);
          }
        }
      }
    }
  }, [section]);

  const handleDesktopBack = () => {
    if (location.state?.openedFromSidebar) {
      navigate("/");
      window.dispatchEvent(new CustomEvent("passqo-open-profile-menu"));
    } else {
      navigate("/");
    }
  };

  // ── Scrollspy for Desktop: Automatically update selected sidebar tab depending on scroll position ──
  useEffect(() => {
    const SECTION_IDS = [
      "profile",
      "notifications",
      "security",
      "privacy",
      "accessibility",
      "account",
    ];

    const handleScroll = () => {
      if (isClickingRef.current) return;

      // If near top of page, select profile
      if (window.scrollY < 180) {
        setActiveSection("profile");
        return;
      }

      // If at bottom of page, select the last section ("account")
      const atBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 60;

      if (atBottom) {
        setActiveSection("account");
        return;
      }

      // Check sections from bottom to top with threshold for navbar (200px)
      const scrollPosition = window.scrollY + 200;

      for (let i = SECTION_IDS.length - 1; i >= 0; i--) {
        const id = SECTION_IDS[i];
        const el = document.getElementById(id);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            setActiveSection(id);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Listen to auth changes
  useEffect(() => {
    const handleAuthChange = (e) => {
      const u = e?.detail?.user ?? getUser();
      setUser(u || {});
    };
    window.addEventListener("passqo-auth-changed", handleAuthChange);
    return () => window.removeEventListener("passqo-auth-changed", handleAuthChange);
  }, []);

  // ── Notification Toggles State ──
  const [notificationsState, setNotificationsState] = useState({
    reminders: true,
    waitlist: true,
    rewards: true,
    referrals: true,
    broadcasts: false,
  });

  // ── Password Inputs State ──
  const [passwords, setPasswords] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    newPass: false,
    confirm: false,
  });
  const [passwordFeedback, setPasswordFeedback] = useState("");

  // ── Privacy Toggles State ──
  const [privacyState, setPrivacyState] = useState({
    analytics: true,
    marketing: false,
  });

  // ── Accessibility Toggles State ──
  const [a11yState, setA11yState] = useState(() => ({
    highContrast: localStorage.getItem("a11y-high-contrast") === "true",
    largeText: localStorage.getItem("a11y-large-text") === "true",
    reducedMotion: localStorage.getItem("a11y-reduced-motion") === "true",
  }));

  const handleA11yToggle = (key, storageKey, className) => {
    setA11yState((prev) => {
      const nextVal = !prev[key];
      localStorage.setItem(storageKey, String(nextVal));
      if (nextVal) {
        document.documentElement.classList.add(className);
      } else {
        document.documentElement.classList.remove(className);
      }
      return { ...prev, [key]: nextVal };
    });
  };

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    if (!passwords.newPass) {
      setPasswordFeedback("Please enter a new password.");
      return;
    }
    if (passwords.newPass.length < 8) {
      setPasswordFeedback("Password must be at least 8 characters.");
      return;
    }
    if (passwords.newPass !== passwords.confirm) {
      setPasswordFeedback("Passwords do not match.");
      return;
    }

    setPasswordFeedback("Password updated successfully!");
    setPasswords({ current: "", newPass: "", confirm: "" });
    setTimeout(() => setPasswordFeedback(""), 3500);
  };

  const handleLogout = () => {
    clearAuth();
    window.dispatchEvent(
      new CustomEvent("passqo-auth-changed", { detail: { user: null } })
    );
    navigate("/");
  };

  const scrollToDesktopSection = (sectionId) => {
    setActiveSection(sectionId);
    isClickingRef.current = true;

    if (sectionId === "profile") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(sectionId);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
    setTimeout(() => {
      isClickingRef.current = false;
    }, 800);
  };

  // Mobile URL-based navigation pushes to history so swipe back works natively
  const openMobileSection = (sectionId) => {
    navigate(`/settings/${sectionId}`, {
      state: location.state,
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
  };

  const closeMobileSection = () => {
    navigate("/settings", {
      state: location.state,
    });
    window.scrollTo({ top: 0, behavior: "instant" });
    if (document.documentElement) document.documentElement.scrollTop = 0;
  };

  const openEditProfile = () => {
    navigate("/settings/edit-profile", {
      state: location.state,
    });
  };

  const closeEditProfile = () => {
    setIsCustomEditOpen(false);
    if (section === "edit-profile" || section === "profile") {
      navigate("/settings", {
        state: location.state,
      });
    }
  };

  // ── Sub-card Renderers ──
  const renderProfileCard = () => (
    <section
      id="profile"
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-black/6 shadow-2xs flex items-center justify-between gap-3 scroll-mt-36 md:scroll-mt-40"
    >
      <div className="flex items-center gap-3.5 min-w-0">
        <div className="w-12 h-12 rounded-full border border-neutral-300 bg-neutral-50 flex items-center justify-center flex-shrink-0 text-neutral-800 shadow-2xs">
          <User className="w-6 h-6 stroke-[1.8]" />
        </div>
        <div className="min-w-0">
          <h3 className="font-display font-extrabold text-sm sm:text-base text-[#1B1B23] truncate leading-tight">
            {user?.name || "John Doe"}
          </h3>
          <p className="text-xs text-[#8C8C9E] font-medium truncate mt-0.5">
            {user?.email || "johndoe@gmail.com"}
          </p>
        </div>
      </div>

      {/* Edit Profile Trigger */}
      <button
        type="button"
        onClick={openEditProfile}
        className="w-9 h-9 rounded-xl hover:bg-neutral-100 flex items-center justify-center text-neutral-800 hover:text-[#FF4E7A] transition-colors cursor-pointer flex-shrink-0"
        title="Edit Profile"
        aria-label="Edit Profile"
      >
        <SquarePen className="w-5 h-5 stroke-[1.8]" />
      </button>
    </section>
  );

  const renderNotificationsCard = () => (
    <section
      id="notifications"
      className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-5 sm:p-6 scroll-mt-36 md:scroll-mt-40"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 flex-shrink-0">
          <Bell className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23]">
            Notifications
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Choose what you want to be notified about.
          </p>
        </div>
      </div>

      <div className="divide-y divide-black/5">
        {[
          {
            key: "reminders",
            title: "Event reminders",
            desc: "Get email and push reminders before events you are attending.",
          },
          {
            key: "waitlist",
            title: "Waitlist openings",
            desc: "Know when a spot becomes available on a waitlist you have joined.",
          },
          {
            key: "rewards",
            title: "Rewards & badges",
            desc: "Receive updates about level-ups and badge unlocks.",
          },
          {
            key: "referrals",
            title: "Referral activity",
            desc: "Get notified when someone joins using your referral code.",
          },
          {
            key: "broadcasts",
            title: "Organiser broadcasts",
            desc: "Receive announcements from organisers of events you follow.",
          },
        ].map((item) => {
          const isChecked = notificationsState[item.key];
          return (
            <div
              key={item.key}
              className="py-3.5 sm:py-4 flex items-center justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
                  {item.title}
                </h4>
                <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
                  {item.desc}
                </p>
              </div>

              {/* Pink Toggle Switch */}
              <button
                type="button"
                role="switch"
                aria-checked={isChecked}
                onClick={() =>
                  setNotificationsState((prev) => ({
                    ...prev,
                    [item.key]: !prev[item.key],
                  }))
                }
                className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 p-0.5 ${
                  isChecked ? "bg-[#FF4E7A]" : "bg-neutral-200"
                }`}
              >
                <span
                  className={`w-5 h-5 rounded-full bg-white shadow-sm block transition-transform ${
                    isChecked ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </section>
  );

  const renderSecurityCard = () => (
    <section
      id="security"
      className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-5 sm:p-6 scroll-mt-36 md:scroll-mt-40"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 flex-shrink-0">
          <Lock className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23]">
            Security
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Keep your account secure.
          </p>
        </div>
      </div>

      <form onSubmit={handleUpdatePassword} className="space-y-4">
        {/* Current password */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#1B1B23] mb-1.5">
            Current password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPasswords.current ? "text" : "password"}
              value={passwords.current}
              onChange={(e) =>
                setPasswords({ ...passwords, current: e.target.value })
              }
              placeholder="Enter your current password"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#1B1B23] bg-white border border-neutral-200 rounded-xl focus:border-[#FF4E7A] focus:ring-2 focus:ring-[#FF4E7A]/20 transition-all outline-none font-medium placeholder:text-neutral-400 pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  current: !prev.current,
                }))
              }
              className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              title={showPasswords.current ? "Hide" : "Show"}
            >
              {showPasswords.current ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* New password */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#1B1B23] mb-1.5">
            New password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPasswords.newPass ? "text" : "password"}
              value={passwords.newPass}
              onChange={(e) =>
                setPasswords({ ...passwords, newPass: e.target.value })
              }
              placeholder="Enter a new password"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#1B1B23] bg-white border border-neutral-200 rounded-xl focus:border-[#FF4E7A] focus:ring-2 focus:ring-[#FF4E7A]/20 transition-all outline-none font-medium placeholder:text-neutral-400 pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  newPass: !prev.newPass,
                }))
              }
              className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              title={showPasswords.newPass ? "Hide" : "Show"}
            >
              {showPasswords.newPass ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
          <p className="text-[11px] text-neutral-400 mt-1">
            Must be at least 8 characters with a mix of letters, numbers and a special character.
          </p>
        </div>

        {/* Confirm new password */}
        <div>
          <label className="block text-xs sm:text-sm font-semibold text-[#1B1B23] mb-1.5">
            Confirm new password
          </label>
          <div className="relative flex items-center">
            <input
              type={showPasswords.confirm ? "text" : "password"}
              value={passwords.confirm}
              onChange={(e) =>
                setPasswords({ ...passwords, confirm: e.target.value })
              }
              placeholder="Confirm your new password"
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#1B1B23] bg-white border border-neutral-200 rounded-xl focus:border-[#FF4E7A] focus:ring-2 focus:ring-[#FF4E7A]/20 transition-all outline-none font-medium placeholder:text-neutral-400 pr-10"
            />
            <button
              type="button"
              onClick={() =>
                setShowPasswords((prev) => ({
                  ...prev,
                  confirm: !prev.confirm,
                }))
              }
              className="absolute right-3 text-neutral-400 hover:text-neutral-700 cursor-pointer"
              title={showPasswords.confirm ? "Hide" : "Show"}
            >
              {showPasswords.confirm ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {passwordFeedback && (
          <p
            className={`text-xs font-semibold ${
              passwordFeedback.includes("success")
                ? "text-emerald-600"
                : "text-red-500"
            }`}
          >
            {passwordFeedback}
          </p>
        )}

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#FF4E7A] hover:bg-[#E03A64] text-white text-xs sm:text-sm font-bold shadow-xs transition-all active:scale-95 cursor-pointer"
        >
          Update password
        </button>
      </form>
    </section>
  );

  const renderPrivacyCard = () => (
    <section
      id="privacy"
      className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-5 sm:p-6 scroll-mt-36 md:scroll-mt-40"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 flex-shrink-0">
          <Shield className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23]">
            Privacy
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Control how passQO uses your information.
          </p>
        </div>
      </div>

      <div className="divide-y divide-black/5">
        <div className="py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
              Analytics
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
              Help improve passQO using anonymous usage data.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={privacyState.analytics}
            onClick={() =>
              setPrivacyState((prev) => ({
                ...prev,
                analytics: !prev.analytics,
              }))
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 p-0.5 ${
              privacyState.analytics ? "bg-[#FF4E7A]" : "bg-neutral-200"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm block transition-transform ${
                privacyState.analytics ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        <div className="py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
              Marketing communications
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
              Receive offers, promotions and product updates.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={privacyState.marketing}
            onClick={() =>
              setPrivacyState((prev) => ({
                ...prev,
                marketing: !prev.marketing,
              }))
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 p-0.5 ${
              privacyState.marketing ? "bg-[#FF4E7A]" : "bg-neutral-200"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm block transition-transform ${
                privacyState.marketing ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );

  const renderAccessibilityCard = () => (
    <section
      id="accessibility"
      className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs p-5 sm:p-6 scroll-mt-36 md:scroll-mt-40"
    >
      <div className="flex items-start gap-3 mb-5">
        <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 flex-shrink-0">
          <Sliders className="w-4 h-4 stroke-[2]" />
        </div>
        <div>
          <h2 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23]">
            Accessibility
          </h2>
          <p className="text-xs text-neutral-500 font-medium">
            Make passQO easier to use.
          </p>
        </div>
      </div>

      <div className="divide-y divide-black/5">
        {/* High Contrast */}
        <div className="py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
              High contrast
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
              Increase contrast for better readability on this device.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={a11yState.highContrast}
            onClick={() =>
              handleA11yToggle(
                "highContrast",
                "a11y-high-contrast",
                "a11y-high-contrast"
              )
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 p-0.5 ${
              a11yState.highContrast ? "bg-[#FF4E7A]" : "bg-neutral-200"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm block transition-transform ${
                a11yState.highContrast ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Large Text */}
        <div className="py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
              Large text
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
              Increase default text size across the interface.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={a11yState.largeText}
            onClick={() =>
              handleA11yToggle(
                "largeText",
                "a11y-large-text",
                "a11y-large-text"
              )
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 p-0.5 ${
              a11yState.largeText ? "bg-[#FF4E7A]" : "bg-neutral-200"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm block transition-transform ${
                a11yState.largeText ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>

        {/* Reduced Motion */}
        <div className="py-3.5 sm:py-4 flex items-center justify-between gap-4">
          <div className="min-w-0 flex-1">
            <h4 className="font-display font-bold text-xs sm:text-sm text-[#1B1B23]">
              Reduced motion
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-500 font-medium mt-0.5">
              Limit animations and motion effects across the app.
            </p>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={a11yState.reducedMotion}
            onClick={() =>
              handleA11yToggle(
                "reducedMotion",
                "a11y-reduced-motion",
                "a11y-reduced-motion"
              )
            }
            className={`w-11 h-6 rounded-full transition-colors relative cursor-pointer flex-shrink-0 p-0.5 ${
              a11yState.reducedMotion ? "bg-[#FF4E7A]" : "bg-neutral-200"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full bg-white shadow-sm block transition-transform ${
                a11yState.reducedMotion ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );

  const renderAccountCard = () => (
    <section
      id="account"
      className="bg-white rounded-2xl sm:rounded-3xl border border-black/6 shadow-2xs divide-y divide-black/5 overflow-hidden scroll-mt-36 md:scroll-mt-40"
    >
      <div className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
        <span className="text-neutral-500 font-medium">Account created</span>
        <span className="font-bold text-[#1B1B23]">3 August 2026</span>
      </div>
      <div className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
        <span className="text-neutral-500 font-medium">App version</span>
        <span className="font-bold text-[#1B1B23]">1.0.0</span>
      </div>
      <div className="p-4 sm:p-5 flex items-center justify-between text-xs sm:text-sm">
        <span className="text-neutral-500 font-medium">Platform</span>
        <span className="font-bold text-[#1B1B23]">PassQO Universal</span>
      </div>
    </section>
  );

  const renderSignOutButton = () => (
    <button
      type="button"
      onClick={handleLogout}
      className="w-full py-3.5 sm:py-4 rounded-2xl bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-extrabold text-sm sm:text-base shadow-sm transition-all active:scale-98 flex items-center justify-center gap-2 cursor-pointer select-none"
    >
      <LogOut className="w-4 h-4 stroke-[2.2]" />
      <span>Sign out</span>
    </button>
  );

  // Compute mobile title
  const currentMobileSectionObj = SETTINGS_SECTIONS.find(
    (s) => s.id === activeMobileSection
  );
  const mobileHeaderTitle = currentMobileSectionObj
    ? currentMobileSectionObj.label
    : "Settings";

  return (
    <div className="min-h-screen bg-[#F5F0EB] text-[#1B1B23]">
      <SubPageHeader
        title={mobileHeaderTitle}
        onBack={activeMobileSection ? closeMobileSection : undefined}
      />

      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-24 sm:pt-28 md:pt-36 pb-20">
        {/* ═══════════════════════════════════════════════════════════
            MOBILE-ONLY SETTINGS VIEW (md:hidden)
            Clean, uncluttered, iOS/Android-style flow with native swipe back support:
            1. Screen 1: Profile card + Grouped menu items + Sign out (/settings)
            2. Screen 2: Dedicated subpage view (/settings/:section)
           ═══════════════════════════════════════════════════════════ */}
        <div className="md:hidden">
          {activeMobileSection === null ? (
            /* Screen 1: Mobile Settings Main Menu (/settings) */
            <div className="space-y-6">
              {/* Header Title */}
              <div>
                <h1 className="font-display font-extrabold text-2xl text-[#1B1B23] tracking-tight">
                  Settings
                </h1>
                <p className="text-xs text-neutral-500 font-medium mt-1">
                  Manage your account, notifications, privacy and more.
                </p>
              </div>

              {/* Profile Card with Tap-to-Edit */}
              <div className="relative">
                {renderProfileCard()}
              </div>

              {/* Grouped Settings Menu List */}
              <div>
                <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-neutral-400 mb-2 px-1">
                  Preferences & Security
                </h2>
                <div className="bg-white rounded-2xl border border-black/6 shadow-2xs divide-y divide-black/5 overflow-hidden">
                  {SETTINGS_SECTIONS.filter((s) => s.id !== "profile").map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => openMobileSection(item.id)}
                        className="w-full px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50 active:bg-neutral-100 transition-colors text-left cursor-pointer group"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-xl bg-[#FF4E7A]/10 text-[#FF4E7A] flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform">
                            <Icon className="w-4 h-4 stroke-[2]" />
                          </div>
                          <div className="min-w-0">
                            <h3 className="font-display font-bold text-sm text-[#1B1B23] leading-tight">
                              {item.label}
                            </h3>
                            <p className="text-[11px] text-neutral-500 font-medium truncate mt-0.5">
                              {item.desc}
                            </p>
                          </div>
                        </div>

                        <ChevronRight className="w-4 h-4 text-neutral-400 flex-shrink-0 group-hover:translate-x-0.5 transition-transform" />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sign Out Action */}
              <div className="pt-2">
                {renderSignOutButton()}
              </div>
            </div>
          ) : (
            /* Screen 2: Mobile Dedicated Sub-page View (/settings/:section) */
            <div className="space-y-4">
              {/* Dedicated Section View */}
              {activeMobileSection === "notifications" && renderNotificationsCard()}
              {activeMobileSection === "security" && renderSecurityCard()}
              {activeMobileSection === "privacy" && renderPrivacyCard()}
              {activeMobileSection === "accessibility" && renderAccessibilityCard()}
              {activeMobileSection === "account" && (
                <div className="space-y-4">
                  {renderAccountCard()}
                  {renderSignOutButton()}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════════════════════
            DESKTOP-ONLY SETTINGS VIEW (hidden md:block)
            Standard 2-Column Layout (Sticky Left Nav + Stacked Right Cards)
           ═══════════════════════════════════════════════════════════ */}
        <div className="hidden md:block">
          {/* Desktop Back Link */}
          <button
            type="button"
            onClick={handleDesktopBack}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#FF4E7A] hover:text-[#E03A64] transition-colors mb-4 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back</span>
          </button>

          {/* Page Intro Header */}
          <div className="mb-8">
            <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#1B1B23] tracking-tight">
              Settings
            </h1>
            <p className="text-xs sm:text-sm text-neutral-500 font-medium mt-1">
              Manage your account, notifications, privacy and more.
            </p>
          </div>

          <div className="flex items-start gap-6 lg:gap-8">
            {/* Left Sticky Sidebar Navigation */}
            <aside className="w-56 lg:w-64 flex-shrink-0 sticky top-36 z-20 space-y-1.5">
              {SETTINGS_SECTIONS.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeSection === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => scrollToDesktopSection(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-2xl text-sm font-bold transition-all text-left cursor-pointer active:scale-98 select-none ${
                      isActive
                        ? "bg-[#FF4E7A] text-white shadow-xs"
                        : "bg-white/80 hover:bg-white text-neutral-700 border border-black/5"
                    }`}
                  >
                    <Icon className="w-4 h-4 stroke-[2] flex-shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </aside>

            {/* Right Content Cards Stack */}
            <div className="flex-1 w-full space-y-6">
              {renderProfileCard()}
              {renderNotificationsCard()}
              {renderSecurityCard()}
              {renderPrivacyCard()}
              {renderAccessibilityCard()}
              {renderAccountCard()}
              {renderSignOutButton()}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Profile Modal (Triggered by pencil icon on profile card or /settings/edit-profile) */}
      <EditProfileModal
        isOpen={isEditProfileOpen}
        onClose={closeEditProfile}
      />
    </div>
  );
}

export default SettingsPage;
