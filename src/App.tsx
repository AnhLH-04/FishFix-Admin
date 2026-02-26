import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AdminLogin } from "./components/admin/AdminLogin";
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminOverview } from "./components/admin/AdminOverview";
import { AdminCustomers } from "./components/admin/AdminCustomers";
import { AdminTechnicians } from "./components/admin/AdminTechnicians";
import { AdminOrders } from "./components/admin/AdminOrders";
import { AdminPayments } from "./components/admin/AdminPayments";
import { AdminAI } from "./components/admin/AdminAI";
import { AdminSupport } from "./components/admin/AdminSupport";
import { AdminSettings } from "./components/admin/AdminSettings";
import { AdminTechnicianDetail } from "./components/admin/AdminTechnicianDetail";
import { NotFound } from "./components/admin/NotFound";
import { UserLayout } from "./components/user/UserLayout";
import { UserHome } from "./components/user/UserHome";
import { UserServices } from "./components/user/UserServices";
import UserServiceDetail from "./components/user/UserServiceDetail";
import { UserTechnicians } from "./components/user/UserTechnicians";
import { UserBooking } from "./components/user/UserBooking";
import { UserOrders } from "./components/user/UserOrders";
import { UserProfile } from "./components/user/UserProfile";
import { WorkerProfile } from "./components/user/WorkerProfile";
import { WorkerRegistration } from "./components/user/WorkerRegistration";
import { UserAI } from "./components/user/UserAI";
import { UserRegister } from "./components/user/UserRegister";
import { ForgotPassword } from "./components/auth/ForgotPassword";
import { ResetPassword } from "./components/auth/ResetPassword";
import { Toaster } from "./components/ui/sonner";
import { PricingPage } from "./components/user/PricingPage";
import { AboutPage } from "./components/user/AboutPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { UserGuide } from "./components/user/UserGuide";
import { TechnicianGuide } from "./components/user/TechnicianGuide";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import UserTechnicianProfile from "./components/user/UserTechnicianProfile";
import MessagesPage from "./components/user/MessagesPage";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <Routes>
          {/* User Routes */}
          <Route path="/" element={<UserLayout />}>
            {/* Public Routes - Không cần đăng nhập */}
            <Route index element={<UserHome />} />
            <Route path="services" element={<UserServices />} />
            <Route path="services/:category/:detailId" element={<UserServiceDetail />} />
            <Route path="technicians" element={<UserTechnicians />} />
            <Route path="technicians/:id" element={<UserTechnicianProfile />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="customer" element={<UserGuide />} />
            <Route path="technician" element={<TechnicianGuide />} />
            <Route path="/messages" element={<MessagesPage />} />

            {/* Protected Routes - Yêu cầu đăng nhập */}
            <Route
              path="booking"
              element={
                <ProtectedRoute>
                  <UserBooking />
                </ProtectedRoute>
              }
            />
            <Route
              path="orders"
              element={
                <ProtectedRoute>
                  <UserOrders />
                </ProtectedRoute>
              }
            />
            <Route
              path="profile"
              element={
                <ProtectedRoute>
                  <UserProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="worker/profile"
              element={
                <ProtectedRoute>
                  <WorkerProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="worker/register"
              element={
                <ProtectedRoute>
                  <WorkerRegistration />
                </ProtectedRoute>
              }
            />
            <Route
              path="ai"
              element={
                <ProtectedRoute>
                  <UserAI />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Auth Routes */}
          <Route path="/register" element={<UserRegister />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOverview />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="technicians/:workerId" element={<AdminTechnicianDetail />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="ai" element={<AdminAI />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
}
