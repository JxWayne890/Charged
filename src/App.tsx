
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Index from "./pages/Index";
import Header from "./components/Header/Header";
import Footer from "./components/Footer";
import AnnouncementBar from "./components/AnnouncementBar";
import CartDrawer from "./components/CartDrawer";
import NotFound from "./pages/NotFound";
import AllProductsPage from "./pages/AllProductsPage";
import BlogPage from "./pages/BlogPage";
import AuthPage from "./pages/AuthPage";
import AccountPage from "./pages/AccountPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import CategoriesPage from "./pages/CategoriesPage";

// Import category pages
import ShopPage from "./pages/categories/ShopPage";
import ProteinPage from "./pages/categories/ProteinPage";
import PreWorkoutPage from "./pages/categories/PreWorkoutPage";
import WeightLossPage from "./pages/categories/WeightLossPage";
import AminoAcidsPage from "./pages/categories/AminoAcidsPage";
import WellnessPage from "./pages/categories/WellnessPage";
import CategoryPage from "./pages/CategoryPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            
            <div className="flex flex-col min-h-screen">
              <AnnouncementBar />
              <Header />
              <CartDrawer />
              
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Index />} />
                  
                  {/* Auth & Account Pages */}
                  <Route path="/auth" element={<AuthPage />} />
                  <Route path="/account" element={<AccountPage />} />
                  
                  {/* Products Pages */}
                  <Route path="/shop" element={<ShopPage />} />
                  <Route path="/products" element={<AllProductsPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  
                  {/* Square Categories Page */}
                  <Route path="/square-categories" element={<CategoriesPage />} />
                  
                  {/* Category Pages - with direct category parameter */}
                  <Route path="/category/:category" element={<CategoryPage />} />
                  
                  {/* Also keep the specific category pages for direct links */}
                  <Route path="/category/protein" element={<ProteinPage />} />
                  <Route path="/category/pre-workout" element={<PreWorkoutPage />} />
                  <Route path="/category/weight-loss" element={<WeightLossPage />} />
                  <Route path="/category/amino-acids" element={<AminoAcidsPage />} />
                  <Route path="/category/wellness" element={<WellnessPage />} />
                  
                  {/* Blog Page */}
                  <Route path="/blog" element={<BlogPage />} />
                  
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              
              <Footer />
            </div>
          </TooltipProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
