import { X } from "lucide-react";

/**
 * Clean circular close button matching the Passqo design specifications
 */
export function AuthCloseButton({ onClick, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        w-8 h-8 rounded-full bg-white/95 hover:bg-white text-[#6B6B80] hover:text-[#1B1B23]
        border border-black/10 shadow-[0_2px_8px_rgba(0,0,0,0.08)]
        flex items-center justify-center transition-all duration-200 active:scale-95 z-30 cursor-pointer
        ${className}
      `}
      aria-label="Close modal"
    >
      <X className="w-4 h-4 stroke-[2.2]" />
    </button>
  );
}

export default AuthCloseButton;

