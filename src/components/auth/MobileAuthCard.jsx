import { AnimatePresence } from "framer-motion";
import { AuthCloseButton } from "./AuthCloseButton";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

/**
 * Full-Page Mobile Auth Screen:
 * - Minimal, clean, white background across both modes.
 * - Artwork changes based on role (organiserlogin.png for host vs mobilelogin.png for attendee).
 */
export function MobileAuthCard({
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
    <div className="w-full h-full min-h-screen bg-white text-[#2C2738] overflow-y-auto overscroll-contain flex flex-col relative">
      {/* ── TOP HERO BANNER (Flush to Top Edge) ── */}
      <div
        className={`relative w-full flex-shrink-0 overflow-hidden border-b border-black/5 shadow-xs transition-colors duration-300 ${
          isOrganizer ? "bg-[#E0F2FE]" : "bg-[#E2F7F8]"
        }`}
      >
        {/* Floating Close Button in top right */}
        <AuthCloseButton
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 shadow-md bg-white/95 text-[#2C2738]"
        />

        <div className="w-full h-[280px] xs:h-[300px] sm:h-[340px] max-h-[42dvh] overflow-hidden select-none">
          <img
            key={isOrganizer ? "mobile-art-organizer" : "mobile-art-attendee"}
            src={
              isOrganizer
                ? "/images/illustrations/organiserlogin.png"
                : "/images/illustrations/mobilelogin.png"
            }
            alt={isOrganizer ? "Passqo Organiser" : "Passqo - A More Connected You"}
            className={`w-full h-full object-cover select-none animate-in fade-in duration-300 ${
              isOrganizer ? "object-[center_28%]" : "object-top"
            }`}
          />
        </div>
      </div>

      {/* ── FORM CONTENT (Clean, Minimal, Pure White) ── */}
      <div className="w-full px-5 sm:px-6 py-5 pb-28 bg-white flex-1">
        <div className="max-w-md mx-auto w-full pb-8">
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

export default MobileAuthCard;
