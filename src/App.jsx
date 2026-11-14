import { Routes, Route, Navigate } from "react-router-dom";
import { A11yInit } from "@/components/ui/A11yInit";
import { ScrollToTop } from "@/components/ui/ScrollToTop";
import { HomePage } from "@/pages/HomePage";
import { EventsPage } from "@/pages/EventsPage";
import { EventDetailPage } from "@/pages/EventDetailPage";
import { BookingPage } from "@/pages/BookingPage";
import { NotificationsPage } from "@/pages/NotificationsPage";
import { MyTicketsPage } from "@/pages/MyTicketsPage";
import { RateExperiencePage } from "@/pages/RateExperiencePage";
import { SettingsPage } from "@/pages/SettingsPage";
import { RewardsPage } from "@/pages/RewardsPage";
import { ReferEarnPage } from "@/pages/ReferEarnPage";
import { OrganizerDashboardPage } from "@/organizer/pages/OrganizerDashboardPage";
import { OrganizerOverviewPage } from "@/organizer/pages/OrganizerOverviewPage";
import { OrganizerEventsPage } from "@/organizer/pages/OrganizerEventsPage";
import { OrganizerCreateEventPage } from "@/organizer/pages/OrganizerCreateEventPage";
import { OrganizerAnalyticsPage } from "@/organizer/pages/OrganizerAnalyticsPage";
import { OrganizerTicketsPage } from "@/organizer/pages/OrganizerTicketsPage";
import { OrganizerPeoplePage } from "@/organizer/pages/OrganizerPeoplePage";
import { OrganizerApprovalsPage } from "@/organizer/pages/OrganizerApprovalsPage";
import { OrganizerRefundsPage } from "@/organizer/pages/OrganizerRefundsPage";
import { OrganizerCouponsPage } from "@/organizer/pages/OrganizerCouponsPage";
import { OrganizerScannerPage } from "@/organizer/pages/OrganizerScannerPage";
import { OrganizerProfilePage } from "@/organizer/pages/OrganizerProfilePage";
import { OrganizerSettingsPage } from "@/organizer/pages/OrganizerSettingsPage";
import { SearchProvider } from "@/context/SearchContext";
import { SearchModal } from "@/components/search/SearchModal";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <A11yInit />
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/category/:category" element={<EventsPage />} />
          <Route path="/search" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/events/:id/book" element={<BookingPage />} />
          <Route path="/checkout" element={<BookingPage />} />
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/tickets" element={<MyTicketsPage />} />
          <Route path="/tickets/:id/rate" element={<RateExperiencePage />} />
          <Route path="/rate-experience" element={<RateExperiencePage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/referrals" element={<ReferEarnPage />} />
          <Route path="/refer-and-earn" element={<ReferEarnPage />} />
          <Route path="/organizer" element={<OrganizerDashboardPage />} />
          <Route path="/organizer/dashboard" element={<OrganizerDashboardPage />} />
          <Route path="/organizer/overview" element={<OrganizerOverviewPage />} />
          <Route path="/organizer/events" element={<OrganizerEventsPage />} />
          <Route path="/organizer/create-event" element={<OrganizerCreateEventPage />} />
          <Route path="/organizer/analytics" element={<OrganizerAnalyticsPage />} />
          <Route path="/organizer/tickets" element={<OrganizerTicketsPage />} />
          <Route path="/organizer/people" element={<OrganizerPeoplePage />} />
          <Route path="/organizer/approvals" element={<OrganizerApprovalsPage />} />
          <Route path="/organizer/refunds" element={<OrganizerRefundsPage />} />
          <Route path="/organizer/coupons" element={<OrganizerCouponsPage />} />
          <Route path="/organizer/scanner" element={<OrganizerScannerPage />} />
          <Route path="/organizer/profile" element={<OrganizerProfilePage />} />
          <Route path="/organizer/settings" element={<OrganizerSettingsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/settings/:section" element={<SettingsPage />} />
          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <SearchModal />
        <AuthModal />
      </SearchProvider>
    </AuthProvider>
  );
}

export default App;

