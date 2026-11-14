import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/auth/storage";
import { Calendar, MapPin, Tag, Users, DollarSign, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";

export function OrganizerCreateEventPage() {
  const navigate = useNavigate();
  const [user] = useState(() => getUser() || { name: "man events", email: "manohar@passqo.com" });
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  // Form State
  const [title, setTitle] = useState("Suncoast Electronic Beat 2026");
  const [category, setCategory] = useState("music");
  const [organizerBrand] = useState("man events");
  const [description, setDescription] = useState(
    "Get ready for a night of world-class electronic synthesizers, live DJ performances, and beachside visual projections."
  );

  const [startDate, setStartDate] = useState("2026-11-20T18:30");
  const [endDate, setEndDate] = useState("2026-11-20T23:30");
  const [venue, setVenue] = useState("GMR Arena Grounds, Beach Road");
  const [city, setCity] = useState("Visakhapatnam, India");

  const [tiers, setTiers] = useState([
    { id: 1, name: "General Admission (Phase 1)", price: 25, quantity: 300 },
    { id: 2, name: "VIP Lounge & Backstage Pass", price: 75, quantity: 50 },
  ]);

  const addTier = () => {
    setTiers((prev) => [
      ...prev,
      { id: Date.now(), name: "Early Bird Admission", price: 20, quantity: 100 },
    ]);
  };

  const removeTier = (id) => {
    if (tiers.length <= 1) return;
    setTiers((prev) => prev.filter((t) => t.id !== id));
  };

  const updateTier = (id, field, value) => {
    setTiers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t))
    );
  };

  const handleSave = (isDraft) => {
    const msg = `✓ "${title || "New Event"}" ${isDraft ? "saved as Draft" : "published Live"}!`;
    setToastMessage(msg);
    setTimeout(() => {
      navigate("/organizer/events");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      <OrganizerSidebar
        activeId="create-event"
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      <OrganizerHeader
        title="Create Event"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        user={user}
      />

      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">
        {/* Action Header */}
        <div className="bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f172a] tracking-tight">
              Create Event
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b] mt-0.5">
              Launch a live ticketing experience on Passqo
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => handleSave(true)}
              className="h-10 px-4 rounded-full bg-white border border-[#EDE8E1] hover:border-[#0F172A] text-xs font-bold text-[#0F172A] transition-colors cursor-pointer"
            >
              Save Draft
            </button>
            <button
              type="button"
              onClick={() => handleSave(false)}
              className="h-10 px-5 rounded-full bg-[#FF4E7A] hover:bg-[#E03A64] text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
            >
              <span>Publish Event</span>
            </button>
          </div>
        </div>

        {/* Toast Alert */}
        {toastMessage && (
          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Section 1: Event Basics */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="font-display font-extrabold text-base text-[#0F172A] pb-2 border-b border-[#F1EFEA]">
            1. Event Basics
          </h2>

          <div className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                Event Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Coastal Waves Indie Music Festival"
                className="w-full h-11 px-3.5 rounded-xl border border-[#EDE8E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#FF4E7A] transition-all"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A] bg-white transition-all cursor-pointer"
                >
                  <option value="music">Music & Concerts</option>
                  <option value="business">Business & Conferences</option>
                  <option value="tech">Tech & Hackathons</option>
                  <option value="cultural">Arts & Culture</option>
                  <option value="sports">Fitness & Sports</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Organizer Brand
                </label>
                <input
                  type="text"
                  value={organizerBrand}
                  readOnly
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EDE8E1] text-xs text-[#64748B] bg-[#FAFAFA]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#0F172A] mb-1">
                About this Event
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Share why attendees will love this event..."
                className="w-full p-3 rounded-xl border border-[#EDE8E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#FF4E7A] transition-all resize-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Date, Time & Venue */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <h2 className="font-display font-extrabold text-base text-[#0F172A] pb-2 border-b border-[#F1EFEA]">
            2. Date, Time & Venue
          </h2>

          <div className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Start Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  End Date & Time
                </label>
                <input
                  type="datetime-local"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EDE8E1] text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A] transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  Venue Name
                </label>
                <input
                  type="text"
                  value={venue}
                  onChange={(e) => setVenue(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EDE8E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#FF4E7A] transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#0F172A] mb-1">
                  City / Location
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 px-3.5 rounded-xl border border-[#EDE8E1] text-xs sm:text-sm text-[#0F172A] focus:outline-none focus:border-[#FF4E7A] transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Ticket Tiers & Capacity */}
        <div className="bg-white rounded-3xl border border-[#EDE8E1] p-5 sm:p-6 shadow-[0_4px_20px_rgba(0,0,0,0.02)] space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#F1EFEA]">
            <h2 className="font-display font-extrabold text-base text-[#0F172A]">
              3. Ticket Tiers & Capacity
            </h2>
            <button
              type="button"
              onClick={addTier}
              className="text-xs font-bold text-[#FF4E7A] hover:underline flex items-center gap-1 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Tier</span>
            </button>
          </div>

          <div className="space-y-3">
            {tiers.map((tier) => (
              <div
                key={tier.id}
                className="grid grid-cols-1 sm:grid-cols-12 gap-3 p-3.5 rounded-2xl bg-[#FAFAFA] border border-[#EDE8E1] items-end"
              >
                <div className="sm:col-span-6">
                  <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                    Tier Name
                  </label>
                  <input
                    type="text"
                    value={tier.name}
                    onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                    className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
                  />
                </div>
                <div className="sm:col-span-3">
                  <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                    Price (€)
                  </label>
                  <input
                    type="number"
                    value={tier.price}
                    onChange={(e) => updateTier(tier.id, "price", parseFloat(e.target.value) || 0)}
                    className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-bold text-[#64748B] mb-1">
                    Total Qty
                  </label>
                  <input
                    type="number"
                    value={tier.quantity}
                    onChange={(e) => updateTier(tier.id, "quantity", parseInt(e.target.value, 10) || 0)}
                    className="w-full h-10 px-3 rounded-xl border border-[#EDE8E1] bg-white text-xs text-[#0F172A] focus:outline-none focus:border-[#FF4E7A]"
                  />
                </div>
                <div className="sm:col-span-1 flex justify-end">
                  <button
                    type="button"
                    onClick={() => removeTier(tier.id)}
                    className="w-10 h-10 rounded-xl hover:bg-neutral-200 text-neutral-400 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
                    title="Remove Tier"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default OrganizerCreateEventPage;

