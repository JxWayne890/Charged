
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
                  <Route path="/products" element={<AllProductsPage />} />
                  <Route path="/product/:slug" element={<ProductDetailPage />} />
                  
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
