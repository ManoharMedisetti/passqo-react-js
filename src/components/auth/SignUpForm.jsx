import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { AuthInputField } from "./AuthInputField";

export function SignUpForm({
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
  onSubmit,
  onSwitchToSignIn,
}) {
  return (
    <motion.div
      key="signup"
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -16 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-3 sm:space-y-3.5"
    >
      {/* Heading */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-[30px] text-[#FF4E7A] leading-tight">
          Create account
        </h2>
        <p className="text-xs sm:text-sm text-[#4B4B5A] mt-1">
          Join Passqo in under a minute.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200 animate-in fade-in">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-2.5 sm:space-y-3 pt-0.5">
        <AuthInputField
          label="Your Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="John Doe"
          autoComplete="name"
        />

        <AuthInputField
          label="Email Address"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
        />

        <AuthInputField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <AuthInputField
          label="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="••••••••"
          autoComplete="new-password"
        />

        <p className="text-[11px] sm:text-xs text-[#6B6B80] leading-snug pt-0.5">
          By creating an account you agree to our Terms of Service and Privacy Policy.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="
            w-full h-11 sm:h-12 bg-[#FF4E7A] hover:bg-[#FF3567]
            text-white font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base
            shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]
            flex items-center justify-center gap-2 disabled:opacity-70 mt-1 cursor-pointer
          "
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Creating account…</span>
            </>
          ) : (
            <span>Create Account</span>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="pt-2 text-center">
        <p className="text-xs sm:text-sm text-[#6B6B80]">
          Already have an account?{" "}
          <button
            type="button"
            onClick={onSwitchToSignIn}
            className="text-[#FF4E7A] font-semibold hover:underline cursor-pointer"
          >
            Sign in
          </button>
        </p>
      </div>
    </motion.div>
  );
}

export default SignUpForm;

