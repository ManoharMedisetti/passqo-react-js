import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, MapPin, Pencil, Check, ArrowLeft } from "lucide-react";
import { getUser, setUser } from "@/lib/auth/storage";

export function EditProfileModal({ isOpen, onClose }) {
  const [user, setCurrentUser] = useState(() => getUser() || {});
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [email, setEmail] = useState("");
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const u = getUser() || {};
      setCurrentUser(u);
      setName(u.name || "Salapu Rakesh");
      setBio(u.bio || "");
      setLocation(u.location || "Visakhapatnam, Andhra Pradesh");
      setEmail(u.email || "salapurakesh22@gmail.com");
      setSavedSuccess(false);
    }
  }, [isOpen]);

  // Lock background scroll when open
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    const origBody = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = origBody;
      document.documentElement.style.overflow = origHtml;
    };
  }, [isOpen, onClose]);

  const handleSave = (e) => {
    e.preventDefault();
    const updated = {
      ...user,
      name: name.trim() || user.name || "Salapu Rakesh",
      bio: bio.trim(),
      location: location.trim() || "Visakhapatnam, Andhra Pradesh",
      email: email,
      updatedAt: new Date().toISOString(),
    };

    setUser(updated);
    window.dispatchEvent(
      new CustomEvent("passqo-auth-changed", { detail: { user: updated } })
    );

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 600);
  };

  if (typeof document === "undefined") return null;

  // Form Pane
  const formPane = (
    <div className="flex-1 space-y-4 sm:space-y-4.5 bg-white p-4 sm:p-0 rounded-2xl sm:rounded-none border border-black/6 sm:border-0 shadow-2xs sm:shadow-none">
      {/* Display Name */}
      <div>
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1B1B23] mb-1.5">
          <label htmlFor="edit-name">Display name</label>
          <span className="text-xs text-neutral-400 font-normal">
            {name.length}/50
          </span>
        </div>
        <input
          id="edit-name"
          type="text"
          maxLength={50}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your full name"
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#1B1B23] bg-white border border-neutral-200 rounded-xl focus:border-[#FF4E7A] focus:ring-2 focus:ring-[#FF4E7A]/20 transition-all outline-none font-medium placeholder:text-neutral-400"
        />
      </div>

      {/* Bio */}
      <div>
        <div className="flex items-center justify-between text-xs sm:text-sm font-semibold text-[#1B1B23] mb-1.5">
          <label htmlFor="edit-bio">Bio</label>
          <span className="text-xs text-neutral-400 font-normal">
            {bio.length}/200
          </span>
        </div>
        <textarea
          id="edit-bio"
          maxLength={200}
          rows={3}
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="A short line about you (optional)"
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-[#1B1B23] bg-white border border-neutral-200 rounded-xl focus:border-[#FF4E7A] focus:ring-2 focus:ring-[#FF4E7A]/20 transition-all outline-none font-medium placeholder:text-neutral-400 resize-none"
        />
      </div>

      {/* Location */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#1B1B23] mb-1.5">
          Location
        </label>
        <div className="relative flex items-center">
          <div className="absolute left-3 w-5 h-5 rounded-full flex items-center justify-center text-[#FF4E7A] pointer-events-none">
            <MapPin className="w-4 h-4 stroke-[2.2]" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Visakhapatnam, Andhra Pradesh"
            className="w-full pl-9 pr-9 py-2.5 text-xs sm:text-sm text-[#1B1B23] bg-white border border-neutral-200 rounded-xl focus:border-[#FF4E7A] focus:ring-2 focus:ring-[#FF4E7A]/20 transition-all outline-none font-medium placeholder:text-neutral-400"
          />
          {location && (
            <button
              type="button"
              onClick={() => setLocation("")}
              className="absolute right-3 w-4 h-4 text-neutral-400 hover:text-neutral-600 transition-colors flex items-center justify-center cursor-pointer"
              title="Clear location"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-neutral-400 mt-1">
          Set your city to get better event recommendations.
        </p>
      </div>

      {/* Email (Read-only) */}
      <div>
        <label className="block text-xs sm:text-sm font-semibold text-[#1B1B23] mb-1.5">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-3.5 py-2.5 text-xs sm:text-sm text-neutral-600 bg-neutral-100/80 border border-neutral-200 rounded-xl cursor-not-allowed font-medium select-none"
        />
        <p className="text-[11px] text-neutral-400 mt-1">
          Email cannot be changed. Contact support if needed.
        </p>
      </div>
    </div>
  );

  // Preview Pane
  const previewPane = (
    <div className="flex-1 flex flex-col items-center justify-center text-center p-4 sm:p-6 bg-white sm:bg-neutral-50/50 rounded-2xl border border-black/6 sm:border-neutral-100 shadow-2xs sm:shadow-none">
      <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-4">
        Preview
      </span>

      {/* Large Circular Avatar with Edit Badge */}
      <div className="relative group mb-3">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full bg-neutral-200/80 border-2 border-white shadow-md flex items-center justify-center overflow-hidden text-neutral-500 font-bold text-xl sm:text-2xl select-none">
          {name ? (
            <span>
              {name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .substring(0, 2)
                .toUpperCase()}
            </span>
          ) : (
            <span className="text-xs text-neutral-400 text-center px-2">
              Profile Preview
            </span>
          )}
        </div>

        {/* Pencil Badge */}
        <button
          type="button"
          className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-white border border-neutral-200 shadow-md flex items-center justify-center text-neutral-700 hover:text-[#FF4E7A] hover:bg-neutral-50 transition-colors cursor-pointer"
          title="Change photo"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Live Name */}
      <h4 className="font-display font-extrabold text-base sm:text-lg text-[#1B1B23] leading-snug truncate max-w-[220px]">
        {name.trim() || "Your Name"}
      </h4>

      {/* Live Bio */}
      <p className="text-xs text-neutral-500 max-w-[230px] line-clamp-2 mt-1 min-h-[1.5rem]">
        {bio.trim() || "A short line about you (optional)"}
      </p>

      {/* Live Location Pill */}
      {location && (
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 sm:bg-white border border-neutral-200 text-xs font-medium text-neutral-700 shadow-2xs">
          <MapPin className="w-3.5 h-3.5 text-[#FF4E7A] flex-shrink-0" />
          <span className="truncate max-w-[180px]">{location}</span>
        </div>
      )}
    </div>
  );

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100000] flex sm:items-center justify-center p-0 sm:p-5 overflow-hidden sm:overflow-y-auto">
          {/* Backdrop (Active on desktop/tablet) */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-xs z-[100001] hidden sm:block"
            aria-hidden="true"
          />

          {/* Modal / Full-screen Card: Full screen on mobile, modal dialog on sm and up */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="relative z-[100002] w-full h-full sm:h-auto sm:max-h-[92vh] sm:max-w-2xl bg-[#F5F0EB] sm:bg-white rounded-none sm:rounded-3xl shadow-2xl border-0 sm:border sm:border-black/8 flex flex-col justify-between overflow-hidden my-0 sm:my-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-profile-title"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 sm:px-7 py-3.5 sm:py-4 bg-white border-b border-black/6 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                {/* Mobile Back Button */}
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden p-1.5 -ml-1 text-[#FF4E7A] hover:text-[#E03A64] transition-colors cursor-pointer active:scale-95 flex items-center gap-1 text-xs font-bold"
                  aria-label="Back"
                >
                  <ArrowLeft className="w-4 h-4 stroke-[2.2]" />
                  <span>Back</span>
                </button>

                <h3
                  id="edit-profile-title"
                  className="font-display font-black text-base sm:text-xl text-[#1B1B23]"
                >
                  Edit your profile
                </h3>
              </div>

              {/* Desktop Close Button */}
              <button
                type="button"
                onClick={onClose}
                className="hidden sm:flex w-8 h-8 rounded-full items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Mobile Quick Save Button */}
              <button
                type="button"
                onClick={handleSave}
                className="sm:hidden px-3.5 py-1.5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white text-xs font-bold shadow-xs active:scale-95 transition-all cursor-pointer flex items-center gap-1"
              >
                {savedSuccess ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <span>Save</span>
                )}
              </button>
            </div>

            {/* Modal Body: Scrollable, Profile Preview on Left (Top on Mobile), Edit Form on Right */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-7">
              <div className="flex flex-col md:flex-row gap-4 sm:gap-6 md:gap-8 items-stretch">
                {/* Profile Preview */}
                {previewPane}

                {/* Vertical Divider (Desktop) */}
                <div className="hidden md:block w-px bg-neutral-200/80 border-r border-dashed border-neutral-200" />

                {/* Edit Form */}
                {formPane}
              </div>
            </div>

            {/* Footer */}
            <div className="px-4 sm:px-7 py-3.5 sm:py-4 bg-white sm:bg-neutral-50/70 border-t border-black/6 flex flex-row items-center justify-between gap-3 flex-shrink-0">
              <p className="text-xs text-neutral-400 font-medium hidden sm:block">
                Last updated: 3 Jan, 2025
              </p>

              <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 sm:flex-initial px-4 sm:px-5 py-2.5 sm:py-2 text-xs sm:text-sm font-semibold text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSave}
                  className="flex-1 sm:flex-initial px-5 sm:px-6 py-2.5 sm:py-2 text-xs sm:text-sm font-bold text-white bg-[#FF4E7A] hover:bg-[#E03A64] rounded-xl shadow-xs transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-1.5"
                >
                  {savedSuccess ? (
                    <>
                      <Check className="w-4 h-4 text-white" />
                      <span>Saved!</span>
                    </>
                  ) : (
                    <span>Save changes</span>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export default EditProfileModal;

