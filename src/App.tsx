import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import Index from '@/pages/Index';
import AllProductsPage from '@/pages/AllProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AuthPage from '@/pages/AuthPage';
import AccountPage from '@/pages/AccountPage';
import BlogPage from '@/pages/BlogPage';
import NotFound from '@/pages/NotFound';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';

const queryClient = new QueryClient();

function App() {
  return (
    <Router>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-background">
              <Header />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/products" element={<AllProductsPage />} />
                <Route path="/product/:slug" element={<ProductDetailPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/blog" element={<BlogPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order-success" element={<OrderSuccessPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
