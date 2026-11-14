import { useState } from "react";
import { X, Calendar, MapPin, Tag, Users, DollarSign, Loader2 } from "lucide-react";

export function CreateEventModal({ isOpen, onClose, onCreated }) {
  const [eventName, setEventName] = useState("");
  const [eventCategory, setEventCategory] = useState("Music and Entertainment");
  const [eventDate, setEventDate] = useState("");
  const [eventVenue, setEventVenue] = useState("");
  const [eventPrice, setEventPrice] = useState("25");
  const [eventCapacity, setEventCapacity] = useState("200");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!eventName.trim()) return;

    setIsSubmitting(true);
    const newEvt = {
      id: "evt-" + Date.now(),
      name: eventName.trim(),
      category: eventCategory,
      date: eventDate || "Sat, 12 Dec 2026",
      venue: eventVenue.trim() || "Dublin City Center, Ireland",
      price: parseFloat(eventPrice) || 0,
      totalCapacity: parseInt(eventCapacity, 10) || 100,
      ticketsSold: 0,
      status: "LIVE",
    };

    setTimeout(() => {
      setIsSubmitting(false);
      if (onCreated) onCreated(newEvt);
      onClose();
      setEventName("");
      setEventVenue("");
      setEventDate("");
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white rounded-xl border border-[#e2e8f0] p-6 shadow-2xl z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#e2e8f0]">
          <div>
            <h3 className="text-lg font-semibold text-[#0f172a]">
              Create New Event
            </h3>
            <p className="text-xs text-[#64748b] mt-0.5">
              Launch a live ticketing experience on Passqo
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-[#64748b] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Event Title
            </label>
            <input
              type="text"
              required
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="e.g. Dublin Summer Music Festival 2026"
              className="w-full h-10 px-3.5 rounded-lg border border-[#e2e8f0] text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/15 transition-all"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Category
              </label>
              <div className="relative">
                <Tag className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <select
                  value={eventCategory}
                  onChange={(e) => setEventCategory(e.target.value)}
                  className="w-full h-10 pl-9 pr-3.5 rounded-lg border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-blue-600 bg-white transition-all cursor-pointer"
                >
                  <option value="Music and Entertainment">Music & Entertainment</option>
                  <option value="Education">Education & Masterclass</option>
                  <option value="Food and Drink">Food & Culinary</option>
                  <option value="Business">Business & Tech</option>
                  <option value="Health and Wellness">Health & Wellness</option>
                  <option value="Sport">Sports & Fitness</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Event Date
              </label>
              <div className="relative">
                <Calendar className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="date"
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full h-10 pl-9 pr-3.5 rounded-lg border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#0f172a] mb-1">
              Venue Location
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
              <input
                type="text"
                value={eventVenue}
                onChange={(e) => setEventVenue(e.target.value)}
                placeholder="e.g. 3Arena & Docklands, Dublin"
                className="w-full h-10 pl-9 pr-3.5 rounded-lg border border-[#e2e8f0] text-xs sm:text-sm text-[#0f172a] focus:outline-none focus:border-blue-600 transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Ticket Price (€)
              </label>
              <div className="relative">
                <DollarSign className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={eventPrice}
                  onChange={(e) => setEventPrice(e.target.value)}
                  className="w-full h-10 pl-9 pr-3.5 rounded-lg border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#0f172a] mb-1">
                Capacity
              </label>
              <div className="relative">
                <Users className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
                <input
                  type="number"
                  min="10"
                  step="10"
                  value={eventCapacity}
                  onChange={(e) => setEventCapacity(e.target.value)}
                  className="w-full h-10 pl-9 pr-3.5 rounded-lg border border-[#e2e8f0] text-xs text-[#0f172a] focus:outline-none focus:border-blue-600 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#e2e8f0]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-[#e2e8f0] text-xs font-medium text-[#64748b] hover:text-[#0f172a] hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Publish Event</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateEventModal;

