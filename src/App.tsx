import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
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
import { NotFound } from "./components/admin/NotFound";
import { UserLayout } from "./components/user/UserLayout";
import { UserHome } from "./components/user/UserHome";
import { UserServices } from "./components/user/UserServices";
import UserServiceDetail from "./components/user/UserServiceDetail";
import { UserTechnicians } from "./components/user/UserTechnicians";
import { UserBooking } from "./components/user/UserBooking";
import { UserOrders } from "./components/user/UserOrders";
import { UserProfile } from "./components/user/UserProfile";
import { UserAI } from "./components/user/UserAI";
import { Toaster } from "./components/ui/sonner";
import { PricingPage } from "./components/user/PricingPage";
import { AboutPage } from "./components/user/AboutPage";
import { ScrollToTop } from "./components/ScrollToTop";
import { UserGuide } from "./components/user/UserGuide";
import { TechnicianGuide } from "./components/user/TechnicianGuide";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* User Routes */}
        <Route path="/" element={<UserLayout />}>
          <Route index element={<UserHome />} />
          <Route path="services" element={<UserServices />} />
          <Route path="services/:category/:detailId" element={<UserServiceDetail />} />
          <Route path="technicians" element={<UserTechnicians />} />
          <Route path="booking" element={<UserBooking />} />
          <Route path="orders" element={<UserOrders />} />
          <Route path="profile" element={<UserProfile />} />
          <Route path="ai" element={<UserAI />} />
          <Route path="pricing" element={<PricingPage />} />
          <Route path="about" element={<AboutPage />} />
          <Route path="customer" element={<UserGuide />} />
          <Route path="technician" element={<TechnicianGuide />} />
        </Route>

        {/* Admin Login Route */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="customers" element={<AdminCustomers />} />
          <Route path="technicians" element={<AdminTechnicians />} />
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
  );
}
