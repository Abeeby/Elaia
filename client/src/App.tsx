import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

// Store
import { useAuthStore } from './store/authStore';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages publiques
import HomePage from './pages/HomePage';
import CoursesPage from './pages/CoursesPage';
import SchedulePage from './pages/SchedulePage';
import PricingPage from './pages/PricingPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import FaqPage from './pages/FaqPage';
import LegalPage from './pages/LegalPage';

// Pages d'authentification
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

// Pages privées
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import BookingsPage from './pages/BookingsPage';
import SubscriptionPage from './pages/SubscriptionPage';
import CreditHistoryPage from './pages/CreditHistoryPage';
import ProspectsPage from './pages/ProspectsPage';
import TrialPage from './pages/TrialPage';

// Pages admin
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminClasses from './pages/admin/AdminClasses';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminMessages from './pages/admin/AdminMessages';

// Composants
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import SEOHead from './components/SEOHead';

// Créer le client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const initAuth = useAuthStore((state) => state.initAuth);

  useEffect(() => {
    // Initialiser l'authentification au démarrage
    initAuth();
  }, [initAuth]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <SEOHead />
        <Routes>
          {/* Routes avec MainLayout */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<HomePage />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="faq" element={<FaqPage />} />
            <Route path="legal" element={<LegalPage />} />
            
            {/* Routes privées */}
            <Route element={<PrivateRoute />}>
              <Route path="dashboard" element={<DashboardPage />} />
              <Route path="profile" element={<ProfilePage />} />
              <Route path="bookings" element={<BookingsPage />} />
              <Route path="subscription" element={<SubscriptionPage />} />
              <Route path="credit-history" element={<CreditHistoryPage />} />
              <Route path="prospects" element={<ProspectsPage />} />
              <Route path="trial" element={<TrialPage />} />
            </Route>
            
            {/* Routes admin */}
            <Route path="admin" element={<AdminRoute />}>
              <Route index element={<AdminDashboard />} />
              <Route path="classes" element={<AdminClasses />} />
              <Route path="users" element={<AdminUsers />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="messages" element={<AdminMessages />} />
            </Route>
          </Route>
          
          {/* Routes avec AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="login" element={<LoginPage />} />
            <Route path="register" element={<RegisterPage />} />
          </Route>
          
          {/* Redirection 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}

export default App;
