import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/NewFooter';
import ErrorBoundary from './components/common/ErrorBoundary';

// Context Providers
import { RegistrationProvider } from './contexts/RegistrationContext';
import { EventsProvider } from './contexts/EventsContext';

// Pages - Using Premium Landing Page with Full Animations
import HomePage from './pages/home/PremiumHomePage';
import EventsPage from './pages/events/EventsPage';
import EventDetailPage from './pages/events/EventDetailPage';
import SchedulePage from './pages/events/SchedulePage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import TicketLookupPage from './pages/tickets/TicketLookupPage';
import MyTicketsPage from './pages/tickets/MyTicketsPage';
import RegistrationPage from './pages/registration/RegistrationPage';
import NotFoundPage from './pages/NotFoundPage';

// Admin Pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import ProtectedRoute from './components/admin/ProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      retry: 3,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <EventsProvider>
          <RegistrationProvider>
          <Router>
            <div className="min-h-screen bg-navy-950">
              <Routes>
                {/* Admin Routes - No public navbar */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute>
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
                
                {/* Public Routes - With public navbar and footer */}
                <Route path="/*" element={
                  <div className="relative z-10">
                    <Navbar />
                    <main className="min-h-screen">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/events" element={<EventsPage />} />
                        <Route path="/events/:slug" element={<EventDetailPage />} />
                        <Route path="/schedule" element={<SchedulePage />} />
                        <Route path="/about" element={<AboutPage />} />
                        <Route path="/contact" element={<ContactPage />} />
                        <Route path="/registration/:eventId" element={<RegistrationPage />} />
                        <Route path="/my-tickets" element={<MyTicketsPage />} />
                        <Route path="/ticket-lookup" element={<TicketLookupPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                } />
              </Routes>
              
              {/* Toast Notifications */}
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: 'rgba(15, 23, 42, 0.9)',
                    color: '#fff',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                  },
                  success: {
                    iconTheme: {
                      primary: '#10B981',
                      secondary: '#fff',
                    },
                  },
                  error: {
                    iconTheme: {
                      primary: '#EF4444',
                      secondary: '#fff',
                    },
                  },
                }}
              />
            </div>
          </Router>
        </RegistrationProvider>
      </EventsProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;