
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';
import Index from '@/pages/Index';
import AllProductsPage from '@/pages/AllProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import AuthPage from '@/pages/AuthPage';
import AccountPage from '@/pages/AccountPage';
import BlogPage from '@/pages/BlogPage';
import NotFound from '@/pages/NotFound';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';

// Brand pages
import AbePage from '@/pages/brands/AbePage';
import AlphaLionPage from '@/pages/brands/AlphaLionPage';
import AxeSledgePage from '@/pages/brands/AxeSledgePage';
import BuckedUpPage from '@/pages/brands/BuckedUpPage';
import ChemixPage from '@/pages/brands/ChemixPage';
import CoreNutritionalPage from '@/pages/brands/CoreNutritionalPage';
import FreshSuppsPage from '@/pages/brands/FreshSuppsPage';
import GorillaMindPage from '@/pages/brands/GorillaMindPage';
import MetabolicNutritionPage from '@/pages/brands/MetabolicNutritionPage';
import RawNutritionPage from '@/pages/brands/RawNutritionPage';
import RuleOnePage from '@/pages/brands/RuleOnePage';
import PandaSupplementsPage from '@/pages/brands/PandaSupplementsPage';

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
                
                {/* Brand pages */}
                <Route path="/brands/abe" element={<AbePage />} />
                <Route path="/brands/alpha-lion" element={<AlphaLionPage />} />
                <Route path="/brands/axe-sledge" element={<AxeSledgePage />} />
                <Route path="/brands/bucked-up" element={<BuckedUpPage />} />
                <Route path="/brands/chemix" element={<ChemixPage />} />
                <Route path="/brands/core-nutritionals" element={<CoreNutritionalPage />} />
                <Route path="/brands/fresh-supps" element={<FreshSuppsPage />} />
                <Route path="/brands/gorilla-mind" element={<GorillaMindPage />} />
                <Route path="/brands/metabolic-nutrition" element={<MetabolicNutritionPage />} />
                <Route path="/brands/raw-nutrition" element={<RawNutritionPage />} />
                <Route path="/brands/rule-one" element={<RuleOnePage />} />
                <Route path="/brands/panda-supplements" element={<PandaSupplementsPage />} />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Footer />
              <CartDrawer />
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </QueryClientProvider>
    </Router>
  );
}

export default App;
