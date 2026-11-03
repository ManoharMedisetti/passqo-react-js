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
}) {
  return (
    <motion.div
      key="signin"
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 16 }}
      transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-4"
    >
      {/* Heading */}
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-[32px] text-[#FF4E7A] leading-tight">
          Sign In
        </h2>
        <p className="text-xs sm:text-sm text-[#4B4B5A] mt-1">
          Welcome back to Passqo.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="p-2.5 rounded-xl bg-red-50 text-red-600 text-xs font-medium border border-red-200 animate-in fade-in">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-3.5 pt-1">
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
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={loading}
          className="
            w-full h-11 sm:h-12 mt-2 bg-[#FF4E7A] hover:bg-[#FF3567]
            text-white font-bold rounded-xl sm:rounded-2xl text-sm sm:text-base
            shadow-sm hover:shadow-md transition-all duration-200 active:scale-[0.98]
            flex items-center justify-center gap-2 disabled:opacity-70 cursor-pointer
          "
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Signing in…</span>
            </>
          ) : (
            <span>Sign In</span>
          )}
        </button>
      </form>

      {/* Footer Switch */}
      <div className="pt-3 text-center">
        <p className="text-xs sm:text-sm text-[#6B6B80]">
          No account yet?{" "}
          <button
            type="button"
            onClick={onSwitchToSignUp}
            className="text-[#FF4E7A] font-semibold hover:underline cursor-pointer"
          >
            Create one free
          </button>
        </p>
      </div>
    </motion.div>
  );
}

export default SignInForm;

