import { AnimatePresence } from "framer-motion";
import { AuthCloseButton } from "./AuthCloseButton";
import { SignInForm } from "./SignInForm";
import { SignUpForm } from "./SignUpForm";

/**
 * Desktop & Tablet Auth Card with side-by-side artwork and form
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
}) {
  return (
    <div className="relative w-full max-w-[840px] mx-auto bg-white rounded-[28px] sm:rounded-[36px] border border-white/80 shadow-[0_24px_64px_rgba(0,0,0,0.22),0_8px_24px_rgba(0,0,0,0.08)] overflow-hidden z-10 my-auto">
      <div className="grid grid-cols-2 items-stretch min-h-[520px]">
        {/* ── LEFT COLUMN: Ticket Artwork Illustration ── */}
        <div className="relative w-full h-full min-h-[500px] overflow-hidden bg-[#E2F7F8]">
          <img
            src="/images/illustrations/auth-ticket.webp"
            alt="A More Connected You - Passqo"
            className="w-full h-full object-cover select-none"
          />
        </div>

        {/* ── RIGHT COLUMN: Auth Form Area with Fluid Switch ── */}
        <div className="relative flex flex-col justify-center px-8 lg:px-10 py-8 lg:py-10 overflow-y-auto max-h-[90vh]">
          {/* Close Button top-right */}
          <AuthCloseButton
            onClick={onClose}
            className="absolute top-5 right-5"
          />

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

export default DesktopAuthCard;

