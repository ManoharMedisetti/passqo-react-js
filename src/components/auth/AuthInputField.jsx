/**
 * Reusable input field with role-aware label, rounded styling, focus glow,
 * and auto-scroll behavior for mobile virtual keyboards.
 */
export function AuthInputField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  required = true,
  autoComplete,
  id,
  isOrganizer = false,
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

  const handleFocus = (e) => {
    // Pro UI/UX: Smoothly scroll active input into comfortable view when keyboard opens
    setTimeout(() => {
      e.target?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 180);
  };

  return (
    <div className="space-y-1">
      {label && (
        <label
          htmlFor={inputId}
          className={`block text-xs sm:text-[13px] font-semibold tracking-normal ${
            isOrganizer ? "text-[#0284C7]" : "text-[#FF4E7A]"
          }`}
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        onFocus={handleFocus}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className={`
          w-full h-11 sm:h-12 px-4 rounded-xl sm:rounded-2xl
          bg-white text-xs sm:text-sm text-[#2C2738]
          border border-[#E7E7E7] outline-none
          placeholder:text-gray-400
          transition-all duration-200
          ${
            isOrganizer
              ? "focus:border-[#0EA5E9] focus:ring-3 focus:ring-[#0EA5E9]/15"
              : "focus:border-[#FF4E7A] focus:ring-3 focus:ring-[#FF4E7A]/15"
          }
        `}
      />
    </div>
  );
}

export default AuthInputField;
