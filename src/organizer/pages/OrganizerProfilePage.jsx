import { useState } from "react";
import { getUser } from "@/lib/auth/storage";
import { Image, UploadCloud, CheckCircle2, ShieldCheck, ExternalLink } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerProfilePage() {
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState("");
  const [slug, setSlug] = useState("staging.passqo.co/organizers/man-events");
  const [businessName, setBusinessName] = useState("Man Events Live Private Limited");
  const [supportEmail, setSupportEmail] = useState("support@manevents.in");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="profile"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Organiser Profile"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">

        {/* Action Header */}
        <section className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          <h1 className="font-display font-extrabold text-xl sm:text-2xl text-[#0F172A] tracking-tight">
            Profile & Public Brand
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
            Configure how your organization appears to attendees across Passqo event listings
          </p>
        </section>

        {toastMsg && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* Card 1: HOW ATTENDEES SEE YOU matching profile.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <span className="text-[11px] font-bold text-[#94A3B8] uppercase tracking-wider block">
            HOW ATTENDEES SEE YOU
          </span>
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-[#0F172A] text-white font-display font-black text-lg flex items-center justify-center shadow-xs">
              M
            </div>
            <div>
              <div className="flex items-center gap-2">
                <strong className="font-display font-extrabold text-base text-[#0F172A]">
                  man events
                </strong>
                <span className="text-[11px] font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                  <ShieldCheck className="w-3 h-3" />
                  Verified
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5">
                PassQO Creator • Visakhapatnam, India • 5 Events Listed
              </p>
            </div>
          </div>
        </div>

        {/* Card 2: BRANDING (LOGO & BANNER) matching profile.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center gap-2">
            <Image className="w-5 h-5 text-[#FF4E7A]" />
            <h2 className="font-display font-extrabold text-base text-[#0F172A]">
              Branding Assets
            </h2>
          </div>
          <p className="text-xs text-[#64748B]">
            Your logo and banner appear on your public organiser profile and all event landing pages.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                LOGO
              </span>
              <div
                onClick={() => showToast("Upload Logo dialog opened")}
                className="h-36 rounded-2xl border-2 border-dashed border-[#EDE8E1] hover:border-[#FF4E7A] bg-[#FAFAFA] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors group"
              >
                <UploadCloud className="w-6 h-6 text-[#94A3B8] group-hover:text-[#FF4E7A] transition-colors" />
                <span className="font-bold text-xs text-[#0F172A] mt-2">Add Logo</span>
                <span className="text-[10px] text-[#94A3B8]">JPEG, PNG, WebP up to 5MB</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8]">
                BANNER COVER
              </span>
              <div
                onClick={() => showToast("Upload Banner dialog opened")}
                className="h-36 rounded-2xl border-2 border-dashed border-[#EDE8E1] hover:border-[#FF4E7A] bg-[#FAFAFA] flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors group"
              >
                <UploadCloud className="w-6 h-6 text-[#94A3B8] group-hover:text-[#FF4E7A] transition-colors" />
                <span className="font-bold text-xs text-[#0F172A] mt-2">Add Banner</span>
                <span className="text-[10px] text-[#94A3B8]">1920 × 480 recommended</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: GET VERIFIED matching profile.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <h2 className="font-display font-extrabold text-base text-[#0F172A]">
              Get Verified Badge
            </h2>
          </div>
          <p className="text-xs text-[#64748B]">
            Upload proof of your registered business or tax identity (Certificate of Incorporation, GST / VAT registration, Government ID) for expedited review. Once verified, a trust badge appears on all tickets and pages.
          </p>
          <button
            type="button"
            onClick={() => showToast("Upload verification document dialog opened")}
            className="h-9 px-4 rounded-full bg-white border border-[#EDE8E1] hover:border-[#0F172A] text-xs font-bold text-[#0F172A] transition-colors cursor-pointer shadow-2xs"
          >
            Upload Verification Document
          </button>
        </div>

        {/* Card 4: PUBLIC PAGE URL matching profile.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display font-extrabold text-base text-[#0F172A]">
              Public Vanity URL
            </h2>
            <a
              href={`https://${slug}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#FF4E7A] hover:underline inline-flex items-center gap-1"
            >
              <span>View Public Page</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="flex gap-2">
            <input
              type="text"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className="flex-1 h-10 px-3.5 rounded-xl border border-[#EDE8E1] text-xs font-mono text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
            />
            <button
              type="button"
              onClick={() => showToast("Public URL updated successfully!")}
              className="h-10 px-4 rounded-xl bg-[#0F172A] text-white text-xs font-bold hover:bg-black transition-colors"
            >
              Update
            </button>
          </div>
        </div>

        {/* Card 5: BUSINESS DETAILS matching profile.html */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-3">
          <h2 className="font-display font-extrabold text-base text-[#0F172A]">
            Business Entity
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                Legal Entity Name
              </label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
              />
            </div>
            <div>
              <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                Public Support Email
              </label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerProfilePage;

