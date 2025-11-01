import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminOverview } from './components/admin/AdminOverview';
import { AdminCustomers } from './components/admin/AdminCustomers';
import { AdminTechnicians } from './components/admin/AdminTechnicians';
import { AdminOrders } from './components/admin/AdminOrders';
import { AdminPayments } from './components/admin/AdminPayments';
import { AdminAI } from './components/admin/AdminAI';
import { AdminSupport } from './components/admin/AdminSupport';
import { AdminSettings } from './components/admin/AdminSettings';
import { NotFound } from './components/admin/NotFound';
import { Toaster } from './components/ui/sonner';

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Redirect root to login */}
        <Route path="/" element={<Navigate to="/login" replace />} />
        
        {/* Login Route */}
        <Route path="/login" element={<AdminLogin />} />

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
