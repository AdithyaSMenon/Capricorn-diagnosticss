import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoadingSpinner from './components/ui/LoadingSpinner';

// Public Pages
import Home                 from './pages/Home';
import About                from './pages/About';
import Products             from './pages/Products';
import BrandPartners        from './pages/BrandPartners';
import LaboratorySolutions  from './pages/LaboratorySolutions';
import Contact              from './pages/Contact';

// Admin Pages
import AdminLogin           from './pages/admin/AdminLogin';
import AdminLayout          from './pages/admin/AdminLayout';
import AdminDashboard       from './pages/admin/AdminDashboard';
import AdminProducts        from './pages/admin/AdminProducts';
import AdminCompanyInfo     from './pages/admin/AdminCompanyInfo';
import { AdminCategories, AdminBrands, AdminEnquiries } from './pages/admin/AdminCrud';

// Protected Route wrapper
function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <LoadingSpinner />;
  if (!user)   return <Navigate to="/admin/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          {/* ── Public Routes ── */}
          <Route path="/"              element={<Home />} />
          <Route path="/about"         element={<About />} />
          <Route path="/products"      element={<Products />} />
          <Route path="/brand-partners" element={<BrandPartners />} />
          <Route path="/lab-solutions" element={<LaboratorySolutions />} />
          <Route path="/contact"       element={<Contact />} />

          {/* ── Admin Auth ── */}
          <Route path="/admin/login"   element={<AdminLogin />} />

          {/* ── Admin Protected ── */}
          <Route path="/admin" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index                element={<AdminDashboard />} />
            <Route path="products"      element={<AdminProducts />} />
            <Route path="categories"    element={<AdminCategories />} />
            <Route path="brands"        element={<AdminBrands />} />
            <Route path="company"       element={<AdminCompanyInfo />} />
            <Route path="enquiries"     element={<AdminEnquiries />} />
          </Route>

          {/* 404 Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}
