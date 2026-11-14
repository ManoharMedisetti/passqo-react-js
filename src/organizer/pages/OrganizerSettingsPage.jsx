import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { Sliders, CheckCircle2 } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerSettingsPage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const [privateDefault, setPrivateDefault] = useState(false);
  const [publicGuestlist, setPublicGuestlist] = useState(false);
  const [collectFeedback, setCollectFeedback] = useState(true);

  const handleSave = () => {
    setToastMsg("Defaults saved successfully!");
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="settings"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Settings"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
            Settings & Defaults
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Default configurations and automated behavior for newly published events
          </p>
        </section>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* DEFAULTS FOR NEW EVENTS matching settings.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-5">
          <div className="flex items-center gap-2 text-[11px] font-extrabold uppercase tracking-wider text-[#FF4E7A] pb-2 border-b border-[#F1EFEA]">
            <Sliders className="w-4 h-4" />
            <span>DEFAULTS FOR NEW EVENTS</span>
          </div>

          <div className="space-y-5 divide-y divide-[#F1EFEA]">
            {/* Setting 1: Private by default */}
            <div className="flex items-center justify-between gap-4 pt-1">
              <div className="space-y-0.5 max-w-lg">
                <span className="font-display font-extrabold text-sm text-[#0F172A] block">
                  Private by default
                </span>
                <span className="text-xs text-[#64748B] block">
                  New events start hidden from search and Discover, reachable only via direct private link
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPrivateDefault(!privateDefault)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors flex-shrink-0 cursor-pointer ${
                  privateDefault ? "bg-[#FF4E7A]" : "bg-neutral-200"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    privateDefault ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Setting 2: Public guest list by default */}
            <div className="flex items-center justify-between gap-4 pt-5">
              <div className="space-y-0.5 max-w-lg">
                <span className="font-display font-extrabold text-sm text-[#0F172A] block">
                  Public guest list by default
                </span>
                <span className="text-xs text-[#64748B] block">
                  New events show attendee names publicly unless you explicitly disable it on the event page
                </span>
              </div>
              <button
                type="button"
                onClick={() => setPublicGuestlist(!publicGuestlist)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors flex-shrink-0 cursor-pointer ${
                  publicGuestlist ? "bg-[#FF4E7A]" : "bg-neutral-200"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    publicGuestlist ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Setting 3: Collect feedback by default */}
            <div className="flex items-center justify-between gap-4 pt-5">
              <div className="space-y-0.5 max-w-lg">
                <span className="font-display font-extrabold text-sm text-[#0F172A] block">
                  Collect feedback by default
                </span>
                <span className="text-xs text-[#64748B] block">
                  New events automatically email a post-event satisfaction survey 2 hours after conclusion
                </span>
              </div>
              <button
                type="button"
                onClick={() => setCollectFeedback(!collectFeedback)}
                className={`w-12 h-6.5 rounded-full p-1 transition-colors flex-shrink-0 cursor-pointer ${
                  collectFeedback ? "bg-[#FF4E7A]" : "bg-neutral-200"
                }`}
              >
                <div
                  className={`w-4.5 h-4.5 rounded-full bg-white transition-transform ${
                    collectFeedback ? "translate-x-5.5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-[#F1EFEA]">
            <button
              type="button"
              onClick={handleSave}
              className="h-10 px-6 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs transition-all cursor-pointer"
            >
              Save Defaults
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerSettingsPage;
