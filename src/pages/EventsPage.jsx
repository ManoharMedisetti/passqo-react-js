import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { BottomNav } from "@/components/ui/BottomNav";
import { AllEventsSection } from "@/components/home/AllEventsSection";
import { api } from "@/lib/api";
import { MOCK_EVENTS } from "@/lib/mockData";

export function EventsPage() {
  const [events, setEvents] = useState(MOCK_EVENTS);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useEffect(() => {
    let cancelled = false;
    api.events
      .list()
      .then((data) => {
        if (!cancelled && Array.isArray(data) && data.length > 0) {
          setEvents(data);
        }
      })
      .catch(() => {})
      .finally(() => {});

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#F5F0EB] flex flex-col pt-16 sm:pt-20 lg:pt-24">
      <Navbar />

      <main className="flex-1 max-w-[1280px] w-full mx-auto px-5 sm:px-8 lg:px-10 pt-4 sm:pt-6 pb-12 lg:pb-16">
        {/* Simple & Clean Back to Home */}
        <div className="mb-4 sm:mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-[#6B6B80] hover:text-[#FF4E7A] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform duration-200 group-hover:-translate-x-1 text-[#FF4E7A]" />
            <span>Back to Home</span>
          </Link>
        </div>

        {/* ── All Events Section with Dynamic Selected Category Name, Filters & Cards ── */}
        <AllEventsSection initialEvents={events} />
      </main>

      <Footer />
      <BottomNav />
    </div>
  );
}

export default EventsPage;
