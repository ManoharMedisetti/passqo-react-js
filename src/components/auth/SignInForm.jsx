import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AuthInputField } from "./AuthInputField";

export function SignInForm({
  email,
  setEmail,
  password,
  setPassword,
  loading,
  error,
  onSubmit,
  onSwitchToSignUp,
  isOrganizer = false,
  onBecomeOrganizer,
  onSwitchToAttendee,
}) {
  return (
    <motion.div
      key={`signin-${isOrganizer ? "organizer" : "attendee"}`}
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* ── Heading (Clean, Minimal, Zero Clutter) ── */}
      <div>
        <h2
          className={`font-display font-bold text-2xl sm:text-[30px] leading-tight ${
            isOrganizer ? "text-[#0284C7]" : "text-[#2C2738]"
          }`}
        >
          {isOrganizer ? "Organiser Sign In" : "Sign In"}
        </h2>
        <p className="text-xs sm:text-sm text-[#756C84] mt-1">
          {isOrganizer
            ? "Manage your events and ticket sales."
            : "Welcome back to Passqo."}
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200 animate-in fade-in">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-3.5 pt-0.5">
        <AuthInputField
          label={isOrganizer ? "Organiser Email" : "Email Address"}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={isOrganizer ? "host@company.com" : "you@example.com"}
          autoComplete="email"
          isOrganizer={isOrganizer}
        />

        <AuthInputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="current-password"
          isOrganizer={isOrganizer}
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className={`
            w-full h-11 sm:h-12 mt-1 font-bold rounded-xl text-sm sm:text-base
            text-white transition-all duration-200 active:scale-[0.98]
            flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer
            ${
              isOrganizer
                ? "bg-gradient-to-r from-[#0284C7] to-[#0EA5E9] hover:brightness-105 shadow-xs"
                : "bg-[#FF4E7A] hover:bg-[#E03A64] shadow-xs"
            }
          `}
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            <span>{isOrganizer ? "Sign In as Organiser" : "Sign In"}</span>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="pt-2 text-center">
        <p className="text-xs sm:text-sm text-[#756C84]">
          {isOrganizer ? (
            <>
              New host?{" "}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="font-bold text-[#0284C7] hover:underline cursor-pointer"
              >
                Register host account
              </button>
            </>
          ) : (
            <>
              No account yet?{" "}
              <button
                type="button"
                onClick={onSwitchToSignUp}
                className="font-bold text-[#FF4E7A] hover:underline cursor-pointer"
              >
                Create one free
              </button>
            </>
          )}
        </p>
      </div>
    </motion.div>
  );
}

export default SignInForm;
