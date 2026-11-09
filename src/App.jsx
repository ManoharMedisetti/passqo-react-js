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

