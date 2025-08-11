import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ScrollToTop from './components/ScrollToTop';

// Store
import { useAuthStore } from './store/authStore';

// Mobile features
import { useMobileFeatures } from './mobile/MobileApp';

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
import NotFoundPage from './pages/NotFoundPage';

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
import ClassAttendance from './pages/admin/ClassAttendance';

// Composants
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';
import SEOHead from './components/SEOHead';

// Créer le client React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 1000 * 60 * 5, // 5 minutes
    },
  },
});

// Error Boundary pour capturer les erreurs
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-6">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Une erreur s'est produite</h1>
            <p className="text-gray-600 mb-4">
              {this.state.error?.message || 'Erreur inconnue'}
            </p>
            <pre className="bg-gray-100 p-4 rounded text-xs overflow-auto">
              {this.state.error?.stack}
            </pre>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

function AppContent() {
  const initAuth = useAuthStore((state) => state.initAuth);
  const { isNative, platform } = useMobileFeatures();

  useEffect(() => {
    // Initialiser l'authentification au démarrage
    try {
      initAuth();
    } catch (error) {
      console.error('Error initializing auth:', error);
    }
  }, [initAuth]);

  return (
    <Router>
      <ScrollToTop />
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
            <Route path="attendance" element={<ClassAttendance />} />
          </Route>
        </Route>
        
        {/* Routes avec AuthLayout */}
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
        
        {/* Page 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
}

function App() {
  console.log('App component rendering - with React Query');
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AppContent />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
