import { Routes, Route, Navigate } from "react-router-dom";
import { A11yInit } from "@/components/ui/A11yInit";
import { HomePage } from "@/pages/HomePage";
import { EventsPage } from "@/pages/EventsPage";
import { EventDetailPage } from "@/pages/EventDetailPage";
import { SearchProvider } from "@/context/SearchContext";
import { SearchModal } from "@/components/search/SearchModal";
import { AuthProvider } from "@/context/AuthContext";
import { AuthModal } from "@/components/auth/AuthModal";

export function App() {
  return (
    <AuthProvider>
      <SearchProvider>
        <A11yInit />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/category/:category" element={<EventsPage />} />
          <Route path="/search" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
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

