import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from '../contexts/AuthContext';
import { ProtectedRoute } from '../components/guards/ProtectedRoute';
import { PublicRoute } from '../components/guards/PublicRoute';
import { MainLayout } from '../components/layouts/MainLayout';
import { DashboardLayout } from '../components/layouts/DashboardLayout';

// Public pages
import { Home } from '../pages/public/Home';
import { Login } from '../pages/auth/Login';
import { Register } from '../pages/auth/Register';
import { ForgotPassword } from '../pages/auth/ForgotPassword';
import { VerifyOTP } from '../pages/auth/VerifyOTP';
import { ResetPassword } from '../pages/auth/ResetPassword';
import { Onboarding } from '../pages/onboarding/Onboarding';

// Protected pages
import { Dashboard } from '../pages/dashboard/Dashboard';

// Error pages
import { NotFound } from '../pages/errors/NotFound';
import { Unauthorized } from '../pages/errors/Unauthorized';
import { ServerError } from '../pages/errors/ServerError';
import { FormBuilder } from '../pages/formBuilder/FormBuilder';
import { AutomationBuilder } from '../pages/automationBuilder/AutomationBuilder';
import { FormBuilderLayout } from '../components/layouts/FormBuilderLayout';

// Placeholder components for other pages
const Pricing = () => <div className="p-8">Pricing Page</div>;
const Features = () => <div className="p-8">Features Page</div>;
const About = () => <div className="p-8">About Page</div>;
const Contact = () => <div className="p-8">Contact Page</div>;
const Terms = () => <div className="p-8">Terms Page</div>;
const Privacy = () => <div className="p-8">Privacy Page</div>;

// Protected page placeholders
const Profile = () => <div className="p-8">Profile Page</div>;
const Settings = () => <div className="p-8">Settings Page</div>;
const Billing = () => <div className="p-8">Billing Page</div>;
const Team = () => <div className="p-8">Team Page</div>;
const Analytics = () => <div className="p-8">Analytics Page</div>;
const Reports = () => <div className="p-8">Reports Page</div>;
const Integrations = () => <div className="p-8">Integrations Page</div>;
const ApiKeys = () => <div className="p-8">API Keys Page</div>;
const Webhooks = () => <div className="p-8">Webhooks Page</div>;
const Logs = () => <div className="p-8">Logs Page</div>;

// Admin page placeholders
const AdminUsers = () => <div className="p-8">Admin Users Page</div>;
const AdminOrganizations = () => <div className="p-8">Admin Organizations Page</div>;
const AdminLogs = () => <div className="p-8">Admin Logs Page</div>;
const AdminSettings = () => <div className="p-8">Admin Settings Page</div>;
const AdminBilling = () => <div className="p-8">Admin Billing Page</div>;

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AuthProvider>
        <MainLayout>
          <Home />
        </MainLayout>
      </AuthProvider>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthProvider>
        <PublicRoute>
          <Login />
        </PublicRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/register',
    element: (
      <AuthProvider>
        <PublicRoute>
          <Register />
        </PublicRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/verify-otp',
    element: (
      <AuthProvider>
        <PublicRoute>
          <VerifyOTP />
        </PublicRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <AuthProvider>
        <PublicRoute>
          <ForgotPassword />
        </PublicRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <AuthProvider>
        <PublicRoute>
          <ResetPassword />
        </PublicRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/onboarding',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <Onboarding />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/pricing',
    element: (
      <AuthProvider>
        <MainLayout>
          <Pricing />
        </MainLayout>
      </AuthProvider>
    ),
  },
  {
    path: '/features',
    element: (
      <AuthProvider>
        <MainLayout>
          <Features />
        </MainLayout>
      </AuthProvider>
    ),
  },
  {
    path: '/about',
    element: (
      <AuthProvider>
        <MainLayout>
          <About />
        </MainLayout>
      </AuthProvider>
    ),
  },
  {
    path: '/contact',
    element: (
      <AuthProvider>
        <MainLayout>
          <Contact />
        </MainLayout>
      </AuthProvider>
    ),
  },
  {
    path: '/terms',
    element: (
      <AuthProvider>
        <MainLayout>
          <Terms />
        </MainLayout>
      </AuthProvider>
    ),
  },
  {
    path: '/privacy',
    element: (
      <AuthProvider>
        <MainLayout>
          <Privacy />
        </MainLayout>
      </AuthProvider>
    ),
  },
  // Protected routes
  {
    path: '/dashboard',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Dashboard />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/dashboard/form-builder',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <FormBuilderLayout>
            <FormBuilder />
          </FormBuilderLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/dashboard/automation-builder',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <AutomationBuilder />
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/profile',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Profile />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/settings',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Settings />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/billing',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Billing />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/team',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Team />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/analytics',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Analytics />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/reports',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Reports />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/integrations',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Integrations />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/api-keys',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <ApiKeys />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/webhooks',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Webhooks />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/logs',
    element: (
      <AuthProvider>
        <ProtectedRoute>
          <DashboardLayout>
            <Logs />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  // Admin routes
  {
    path: '/admin/users',
    element: (
      <AuthProvider>
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout>
            <AdminUsers />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/admin/organizations',
    element: (
      <AuthProvider>
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout>
            <AdminOrganizations />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/admin/logs',
    element: (
      <AuthProvider>
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout>
            <AdminLogs />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/admin/settings',
    element: (
      <AuthProvider>
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout>
            <AdminSettings />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  {
    path: '/admin/billing',
    element: (
      <AuthProvider>
        <ProtectedRoute roles={['admin']}>
          <DashboardLayout>
            <AdminBilling />
          </DashboardLayout>
        </ProtectedRoute>
      </AuthProvider>
    ),
  },
  // Error routes
  {
    path: '/401',
    element: (
      <AuthProvider>
        <Unauthorized />
      </AuthProvider>
    ),
  },
  {
    path: '/500',
    element: (
      <AuthProvider>
        <ServerError />
      </AuthProvider>
    ),
  },
  {
    path: '*',
    element: (
      <AuthProvider>
        <NotFound />
      </AuthProvider>
    ),
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
}; 