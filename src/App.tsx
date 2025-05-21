
import React, { useState } from 'react';
import './App.css';
import { Route, Routes } from 'react-router-dom';
import Index from './pages/Index';
import ProductDetailPage from './pages/ProductDetailPage';
import AccountPage from './pages/AccountPage';
import NotFound from './pages/NotFound';
import Header from './components/Header/Header';
import Footer from './components/Footer';
import AnnouncementBar from './components/AnnouncementBar';
import CartDrawer from './components/CartDrawer';
import ShopPage from './pages/categories/ShopPage';
import AuthPage from './pages/AuthPage';
import AllProductsPage from './pages/AllProductsPage';
import BlogPage from './pages/BlogPage';
import CategoryPage from './pages/CategoryPage';
import ProteinPage from './pages/categories/ProteinPage';
import PreWorkoutPage from './pages/categories/PreWorkoutPage';
import WeightLossPage from './pages/categories/WeightLossPage';
import AminoAcidsPage from './pages/categories/AminoAcidsPage';
import WellnessPage from './pages/categories/WellnessPage';
import { Toaster } from '@/components/ui/toaster';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import CategoriesPage from './pages/CategoriesPage';
import SquareCategoriesPage from './pages/SquareCategoriesPage';

function App() {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  return (
    <AuthProvider>
      <CartProvider>
        <div className="App">
          <AnnouncementBar />
          <Header toggleCart={toggleCart} />
          <CartDrawer isOpen={isCartOpen} onClose={toggleCart} />

          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/shop" element={<ShopPage />} />
            <Route path="/product/:slug" element={<ProductDetailPage />} />
            <Route path="/account" element={<AccountPage />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/all-products" element={<AllProductsPage />} />
            <Route path="/blog" element={<BlogPage />} />
            <Route path="/category/:category" element={<CategoryPage />} />
            <Route path="/category/protein" element={<ProteinPage />} />
            <Route path="/category/pre-workout" element={<PreWorkoutPage />} />
            <Route path="/category/weight-loss" element={<WeightLossPage />} />
            <Route path="/category/amino-acids" element={<AminoAcidsPage />} />
            <Route path="/category/wellness" element={<WellnessPage />} />
            <Route path="/square-categories" element={<CategoriesPage />} />
            <Route path="/square-products" element={<SquareCategoriesPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>

          <Footer />
          <Toaster />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
