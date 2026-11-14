import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUser } from "@/lib/auth/storage";
import { OrganizerSidebar } from "../components/OrganizerSidebar";
import { OrganizerHeader } from "../components/OrganizerHeader";
import { GreetingBanner } from "../components/GreetingBanner";
import { YourActivityChart } from "../components/YourActivityChart";
import { KeyMetricsGrid } from "../components/KeyMetricsGrid";
import { SalesAnalyticsCard } from "../components/SalesAnalyticsCard";
import { ConversionAndTopEvents } from "../components/ConversionAndTopEvents";
import { RecentActivityCard } from "../components/RecentActivityCard";
import { UpcomingEventsCard } from "../components/UpcomingEventsCard";
import { QuickActionsCard } from "../components/QuickActionsCard";
import { RecentOrdersCard } from "../components/RecentOrdersCard";
import { PerformanceInsightsCard } from "../components/PerformanceInsightsCard";
import { CreateEventModal } from "../components/CreateEventModal";

export function OrganizerDashboardPage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(() => getUser() || { name: "manoharprasadmedisetti", email: "manohar@passqo.com" });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleEventCreated = (newEvent) => {
    // Navigate or notify
    navigate("/organizer/events");
  };

  return (
    <div className="min-h-screen bg-[#fdfdfe] text-[#0f172a] antialiased selection:bg-blue-600/10 selection:text-blue-600">
      {/* ── SIDEBAR (Matching 2nd Reference Image with "Dashboard") ── */}
      <OrganizerSidebar
        activeId="dashboard"
        onCreateEventClick={() => setIsCreateModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* ── TOP HEADER (Fixed matching Venue X) ── */}
      <OrganizerHeader
        title="Dashboard"
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        user={user}
      />

      {/* ── MAIN CONTENT AREA (Offset by fixed sidebar xl:ml-64 and fixed header pt-20) ── */}
      <main className="xl:ml-64 pt-20 px-4 sm:px-6 md:px-8 pb-12 space-y-6">
        {/* ── ROW 1: Greeting Banner (Left) + Your Activity (Right) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 h-full flex flex-col">
            <GreetingBanner
              user={user}
              activeEventsCount={5}
              upcomingEventsCount={12}
              todaySales="$2,340"
              ticketsToday="48"
            />
          </div>
          <div className="lg:col-span-1 h-full flex flex-col">
            <YourActivityChart />
          </div>
        </div>

        {/* ── ROW 2: Key Metrics Cards (Row of 4) ── */}
        <KeyMetricsGrid
          revenue="$89,245"
          revenueGrowth="+12.5%"
          ticketsSold="2,847"
          ticketsGrowth="+8.2%"
          activeEvents="23"
          eventsBadge="5 this week"
          totalCustomers="8,734"
          customersGrowth="+15.3%"
        />

        {/* ── ROW 3: Sales Analytics (2/3) + Conversion Rate & Top Events (1/3) (Same Height) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-2 h-full flex flex-col">
            <SalesAnalyticsCard />
          </div>
          <div className="lg:col-span-1 h-full flex flex-col">
            <ConversionAndTopEvents
              conversionRate="73.5%"
              conversionGrowth="+2.3% from last month"
            />
          </div>
        </div>

        {/* ── ROW 4: Recent Activity (1/3) + Upcoming Events (2/3) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1 h-full flex flex-col">
            <RecentActivityCard onViewAll={() => navigate("/organizer/analytics")} />
          </div>
          <div className="lg:col-span-2 h-full flex flex-col">
            <UpcomingEventsCard onViewCalendar={() => navigate("/organizer/events")} />
          </div>
        </div>

        {/* ── ROW 5: Quick Actions (1/3) + Recent Orders (2/3) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <div className="lg:col-span-1 h-full flex flex-col">
            <QuickActionsCard
              onCreateEvent={() => setIsCreateModalOpen(true)}
              onAddTeam={() => navigate("/organizer/people")}
              onGenerateReport={() => navigate("/organizer/analytics")}
              onOpenSettings={() => navigate("/organizer/settings")}
            />
          </div>
          <div className="lg:col-span-2 h-full flex flex-col">
            <RecentOrdersCard onViewAll={() => navigate("/organizer/tickets")} />
          </div>
        </div>

        {/* ── ROW 6: Performance Insights (Bottom Row of 3) ── */}
        <PerformanceInsightsCard
          avgOrderValue="$65.50"
          avgOrderGrowth="+5.2% from last month"
          retention="68%"
          retentionGrowth="+2.1% from last month"
          successRate="89%"
          successRateGrowth="-1.3% from last month"
        />
      </main>

      {/* Create Event Modal */}
      <CreateEventModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreated={handleEventCreated}
      />
    </div>
  );
}

export default OrganizerDashboardPage;

