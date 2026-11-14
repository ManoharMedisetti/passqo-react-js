import { AnimatePresence } from "framer-motion";
import { AuthCloseButton } from "./AuthCloseButton";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

/**
 * Desktop & Tablet Auth Card:
 * - Original compact height (max-w-[840px], min-h-[500px]).
 * - Left column is always Artwork; Right column is always Form.
 * - Minimal, clean, white background, zero dark/heavy visual clutter.
 */
export function DesktopAuthCard({
  mode,
  setMode,
  onClose,
  name,
  setName,
  email,
  setEmail,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  error,
  setError,
  onSubmit,
  isOrganizer,
  setIsOrganizer,
  onBecomeOrganizer,
}) {
  return (
    <div className="relative w-full max-w-[840px] mx-auto bg-white rounded-[28px] sm:rounded-[36px] border border-white/80 shadow-[0_24px_64px_rgba(0,0,0,0.22),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden z-10 my-auto">
      <div className="grid grid-cols-2 items-stretch min-h-[500px]">
        {/* ── LEFT COLUMN: Artwork (Always Left, Clean & Framed) ── */}
        <div
          className={`relative w-full h-full min-h-[500px] overflow-hidden transition-colors duration-300 ${
            isOrganizer ? "bg-[#E0F2FE]" : "bg-[#E2F7F8]"
          }`}
        >
          <img
            key={isOrganizer ? "art-organizer" : "art-attendee"}
            src={
              isOrganizer
                ? "/images/illustrations/organiserlogin.png"
                : "/images/illustrations/auth-ticket.webp"
            }
            alt={isOrganizer ? "Passqo Organiser" : "A More Connected You - Passqo"}
            className="w-full h-full object-cover object-top select-none animate-in fade-in duration-300"
          />
        </div>

        {/* ── RIGHT COLUMN: Form Area (Always Right, Clean Minimal) ── */}
        <div className="relative flex flex-col justify-center px-8 lg:px-10 py-7 lg:py-8 overflow-y-auto max-h-[90vh] bg-white">
          {/* Close Button top-right */}
          <AuthCloseButton onClick={onClose} className="absolute top-5 right-5" />

          {/* ── MINIMAL CLEAN ROLE SWITCHER TABS ── */}
          <div className="flex items-center gap-1 p-1 bg-[#F5F0EB] rounded-full w-fit mb-3 select-none">
            <button
              type="button"
              onClick={() => {
                setError("");
                setIsOrganizer(false);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                !isOrganizer
                  ? "bg-white text-[#FF4E7A] shadow-2xs"
                  : "text-[#756C84] hover:text-[#2C2738]"
              }`}
            >
              Attendee
            </button>
            <button
              type="button"
              onClick={() => {
                setError("");
                setIsOrganizer(true);
              }}
              className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                isOrganizer
                  ? "bg-white text-[#0284C7] shadow-2xs"
                  : "text-[#756C84] hover:text-[#2C2738]"
              }`}
            >
              Organiser
            </button>
          </div>

          <AnimatePresence mode="wait">
            {mode === "signin" ? (
              <SignInForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                loading={loading}
                error={error}
                onSubmit={onSubmit}
                onSwitchToSignUp={() => {
                  setError("");
                  setMode("signup");
                }}
                isOrganizer={isOrganizer}
                onBecomeOrganizer={onBecomeOrganizer}
                onSwitchToAttendee={() => {
                  setError("");
                  setIsOrganizer(false);
                }}
              />
            ) : (
              <SignUpForm
                name={name}
                setName={setName}
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                loading={loading}
                error={error}
                onSubmit={onSubmit}
                onSwitchToSignIn={() => {
                  setError("");
                  setMode("signin");
                }}
                isOrganizer={isOrganizer}
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default DesktopAuthCard;
