import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminOverview } from "./components/admin/AdminOverview";
import { AdminCustomers } from "./components/admin/AdminCustomers";
import { AdminTechnicians } from "./components/admin/AdminTechnicians";
import { AdminOrders } from "./components/admin/AdminOrders";
import { AdminPayments } from "./components/admin/AdminPayments";
import { AdminAI } from "./components/admin/AdminAI";
import { AdminSupport } from "./components/admin/AdminSupport";
import { AdminSettings } from "./components/admin/AdminSettings";
import { NotFound } from "./components/admin/NotFound";

import { UserLayout } from "./components/user/UserLayout";
import { UserHome } from "./components/user/UserHome";
import { UserServices } from "./components/user/UserServices";
import UserServiceDetail from "./components/user/UserServiceDetail";
import { UserTechnicians } from "./components/user/UserTechnicians";
import UserTechnicianProfile from "./components/user/UserTechnicianProfile";
import { UserBooking } from "./components/user/UserBooking";
import { UserOrders } from "./components/user/UserOrders";
import { UserProfile } from "./components/user/UserProfile";
import { UserAI } from "./components/user/UserAI";
import { PricingPage } from "./components/user/PricingPage";
import { AboutPage } from "./components/user/AboutPage";
import { UserGuide } from "./components/user/UserGuide";
import { TechnicianGuide } from "./components/user/TechnicianGuide";

import { Toaster } from "./components/ui/sonner";
import { ScrollToTop } from "./components/ScrollToTop";

import { AuthProvider } from "./auth/AuthProvider";
import TechnicianProLayout from "./components/tech/TechnicianLayout";
import TechDashboardPage from "./components/tech/TechnicianDashboardPage";
import TechHistoryPage from "./components/tech/TechHistoryPage";
import TechNewOrdersPage from "./components/tech/TechNewOrdersPage";
import TechSchedulePage from "./components/tech/TechSchedulePage";
import TechSupportPage from "./components/tech/TechSupportPage";
import TechWalletPage from "./components/tech/TechWalletPage";
import TechSettingsPage from "./components/tech/TechSettingsPage";
import TechProfilePage from "./components/tech/TechProfilePage";
import { AdminTechApprovals } from "./components/admin/AdminTechApprovals";

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToTop />

        <Routes>
          {/* =========================
              Public/User Routes
          ========================== */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<UserHome />} />
            <Route path="services" element={<UserServices />} />
            <Route path="services/:category/:detailId" element={<UserServiceDetail />} />
            <Route path="technicians" element={<UserTechnicians />} />
            <Route path="technicians/:id" element={<UserTechnicianProfile />} />
            <Route path="booking" element={<UserBooking />} />
            <Route path="orders" element={<UserOrders />} />
            <Route path="profile" element={<UserProfile />} />
            <Route path="ai" element={<UserAI />} />
            <Route path="pricing" element={<PricingPage />} />
            <Route path="about" element={<AboutPage />} />
            <Route path="customer" element={<UserGuide />} />
            <Route path="technician" element={<TechnicianGuide />} />
          </Route>

          {/* =========================
              Technician Routes (Thợ)
              - UI giống ảnh (Pro Connect)
              - Nếu muốn bắt buộc đăng nhập: bọc RequireAuth
          ========================== */}
          <Route
            path="/tech"
            element={
              // <RequireAuth>
              <TechnicianProLayout />
              // </RequireAuth>
            }
          >
            <Route index element={<TechDashboardPage />} />
            <Route path="new-orders" element={<TechNewOrdersPage />} />
            <Route path="history" element={<TechHistoryPage />} />
            <Route path="wallet" element={<TechWalletPage />} />
            <Route path="schedule" element={<TechSchedulePage />} />
            <Route path="techpro" element={<TechProfilePage />} />
            <Route path="support" element={<TechSupportPage />} />
            <Route path="settings" element={<TechSettingsPage />} />
          </Route>

          {/* =========================
              Admin Routes (requires admin)
          ========================== */}
          <Route
            path="/admin"
            element={
              // <RequireAdmin>
              <AdminLayout />
              // </RequireAdmin>
            }
          >
            <Route index element={<AdminOverview />} />
            <Route path="customers" element={<AdminCustomers />} />
            <Route path="technicians" element={<AdminTechnicians />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="ai" element={<AdminAI />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="approvals" element={<AdminTechApprovals />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Optional: redirect old admin login */}
          <Route path="/admin/login" element={<Navigate to="/login" replace />} />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>

        <Toaster />
      </AuthProvider>
    </Router>
  );
}
