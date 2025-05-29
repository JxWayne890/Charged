
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';
import { CartProvider } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer';
import Index from '@/pages/Index';
import AllProductsPage from '@/pages/AllProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import OrderSuccessPage from '@/pages/OrderSuccessPage';
import AuthPage from '@/pages/AuthPage';
import AccountPage from '@/pages/AccountPage';
import BlogPage from '@/pages/BlogPage';
import SearchResultsPage from '@/pages/SearchResultsPage';
import NotFound from '@/pages/NotFound';
import TermsOfServicePage from '@/pages/TermsOfServicePage';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

// Brand Pages
import AbePage from '@/pages/brands/AbePage';
import AlphaLionPage from '@/pages/brands/AlphaLionPage';
import AxeSledgePage from '@/pages/brands/AxeSledgePage';
import BuckedUpPage from '@/pages/brands/BuckedUpPage';
import ChemixPage from '@/pages/brands/ChemixPage';
import CoreNutritionalPage from '@/pages/brands/CoreNutritionalPage';
import FreshSuppsPage from '@/pages/brands/FreshSuppsPage';
import GorillaMindPage from '@/pages/brands/GorillaMindPage';
import MetabolicNutritionPage from '@/pages/brands/MetabolicNutritionPage';
import PandaSupplementsPage from '@/pages/brands/PandaSupplementsPage';
import RawNutritionPage from '@/pages/brands/RawNutritionPage';
import RuleOnePage from '@/pages/brands/RuleOnePage';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-grow pt-20">
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/products" element={<AllProductsPage />} />
                  <Route path="/product/:id" element={<ProductDetailPage />} />
                  <Route path="/checkout" element={<CheckoutPage />} />
                  <Route path="/order-success" element={<OrderSuccessPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  <Route path="/blog" element={<BlogPage />} />
                  <Route path="/search" element={<SearchResultsPage />} />
                  <Route path="/terms" element={<TermsOfServicePage />} />
                  
                  {/* Brand pages */}
                  <Route path="/brands/abe" element={<AbePage />} />
                  <Route path="/brands/alpha-lion" element={<AlphaLionPage />} />
                  <Route path="/brands/axe-sledge" element={<AxeSledgePage />} />
                  <Route path="/brands/bucked-up" element={<BuckedUpPage />} />
                  <Route path="/brands/chemix" element={<ChemixPage />} />
                  <Route path="/brands/core-nutritional" element={<CoreNutritionalPage />} />
                  <Route path="/brands/fresh-supps" element={<FreshSuppsPage />} />
                  <Route path="/brands/gorilla-mind" element={<GorillaMindPage />} />
                  <Route path="/brands/metabolic-nutrition" element={<MetabolicNutritionPage />} />
                  <Route path="/brands/panda-supplements" element={<PandaSupplementsPage />} />
                  <Route path="/brands/raw-nutrition" element={<RawNutritionPage />} />
                  <Route path="/brands/rule-one" element={<RuleOnePage />} />
                  
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
              <Toaster />
            </div>
          </CartProvider>
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
