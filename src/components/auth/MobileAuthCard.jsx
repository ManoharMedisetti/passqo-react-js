import { AnimatePresence } from "framer-motion";
import { AuthCloseButton } from "./AuthCloseButton";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

/**
 * Full-Page Mobile Auth Screen:
 * - Full page mobile view (not a popup sheet).
 * - No swipe-down dismissal; closed exclusively via the close button (X) or form completion.
 * - Image uses object-top and top safe-area offset so the top ("A MORE CONNECTED YOU", flamingo head) is never clipped.
 * - Solid white, responsive, and seamless continuous scrolling.
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
}) {
  return (
    <div className="w-full h-full min-h-screen bg-white overflow-y-auto overscroll-contain flex flex-col relative">
      {/* ── TOP HERO BANNER (Flush to Top Edge, Zero Top Space) ── */}
      <div className="relative w-full bg-[#E2F7F8] flex-shrink-0 overflow-hidden border-b border-black/5 shadow-xs">
        {/* Floating Close Button in top right */}
        <AuthCloseButton
          onClick={onClose}
          className="absolute top-4 right-4 sm:top-5 sm:right-5 z-30 shadow-md bg-white/95"
        />

        <div className="w-full h-[290px] xs:h-[310px] sm:h-[350px] max-h-[44dvh] overflow-hidden select-none">
          <img
            src="/images/illustrations/mobilelogin.png"
            alt="Passqo - A More Connected You"
            className="w-full h-full object-cover object-top select-none"
          />
        </div>
      </div>

      {/* ── FORM CONTENT (Natural fluid scroll on mobile) ── */}
      <div className="w-full px-5 sm:px-6 py-6 pb-28 bg-white flex-1">
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
              />
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default MobileAuthCard;
