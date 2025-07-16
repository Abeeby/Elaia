import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';

// Layouts
import MainLayout from './components/layouts/MainLayout';
import AuthLayout from './components/layouts/AuthLayout';

// Pages publiques
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PricingPage from './pages/PricingPage';
import FaqPage from './pages/FaqPage';
import ContactPage from './pages/ContactPage';
import LegalPage from './pages/LegalPage';
import CoursesPage from './pages/CoursesPage';

// Pages privées
import DashboardPage from './pages/DashboardPage';
import SchedulePage from './pages/SchedulePage';
import BookingsPage from './pages/BookingsPage';
import ProfilePage from './pages/ProfilePage';
import SubscriptionPage from './pages/SubscriptionPage';
import CreditHistoryPage from './pages/CreditHistoryPage';

// Pages admin - Lazy loading pour optimiser le bundle
import { lazy, Suspense } from 'react';
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'));
const AdminClasses = lazy(() => import('./pages/admin/AdminClasses'));
const AdminReports = lazy(() => import('./pages/admin/AdminReports'));
const AdminMessages = lazy(() => import('./pages/admin/AdminMessages'));

// Composants
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import LoadingSpinner from './components/LoadingSpinner';
import NotificationSystem, { useNotifications } from './components/NotificationSystem';
import SmartChat from './components/SmartChat';

// Store
import { useAuthStore } from './store/authStore';

// Créer le client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  const { isAuthenticated, fetchProfile } = useAuthStore();
  const notifications = useNotifications();

  useEffect(() => {
    // Si l'utilisateur est authentifié, récupérer son profil
    if (isAuthenticated) {
      fetchProfile().catch(() => {
        // Géré dans le store
      });
    }
  }, [isAuthenticated, fetchProfile]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Routes publiques avec AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Routes avec MainLayout */}
          <Route element={<MainLayout />}>
            {/* Pages publiques */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/pricing" element={<PricingPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/legal" element={<LegalPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/schedule" element={<SchedulePage />} />

            {/* Pages privées */}
            <Route element={<PrivateRoute />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/subscription" element={<SubscriptionPage />} />
              <Route path="/credits/history" element={<CreditHistoryPage />} />
            </Route>

            {/* Pages admin */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={
                <Suspense fallback={<LoadingSpinner text="Chargement du tableau de bord..." />}>
                  <AdminDashboard />
                </Suspense>
              } />
              <Route path="/admin/users" element={
                <Suspense fallback={<LoadingSpinner text="Chargement des utilisateurs..." />}>
                  <AdminUsers />
                </Suspense>
              } />
              <Route path="/admin/classes" element={
                <Suspense fallback={<LoadingSpinner text="Chargement des cours..." />}>
                  <AdminClasses />
                </Suspense>
              } />
              <Route path="/admin/reports" element={
                <Suspense fallback={<LoadingSpinner text="Chargement des rapports..." />}>
                  <AdminReports />
                </Suspense>
              } />
              <Route path="/admin/messages" element={
                <Suspense fallback={<LoadingSpinner text="Chargement des messages..." />}>
                  <AdminMessages />
                </Suspense>
              } />
            </Route>
          </Route>

          {/* Redirection par défaut */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      
      {/* Notifications toast */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#333',
            color: '#fff',
          },
          success: {
            style: {
              background: '#6A7352',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      
      {/* Système de notifications global */}
      <NotificationSystem 
        notifications={notifications.notifications}
        onDismiss={notifications.removeNotification}
      />
      
      {/* Chatbot intelligent */}
      <SmartChat />
    </QueryClientProvider>
  );
}

export default App;
