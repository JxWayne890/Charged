
import { Minus, Plus, X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatPrice } from '@/lib/utils';

const CartDrawer = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    isCartOpen, 
    setIsCartOpen, 
    cartTotal,
    freeShippingThreshold,
    amountToFreeShipping,
    toggleSubscription
  } = useCart();

  const handleClose = () => {
    setIsCartOpen(false);
  };

  // Calculate progress towards free shipping
  const shippingProgress = Math.min((cartTotal / freeShippingThreshold) * 100, 100);

  return (
    <Sheet open={isCartOpen} onOpenChange={setIsCartOpen}>
      <SheetContent className="w-full sm:max-w-md flex flex-col">
        <SheetHeader className="border-b pb-4">
          <div className="flex justify-between items-center">
            <SheetTitle className="flex items-center">
              <ShoppingCart className="mr-2" size={20} />
              Your Cart ({cartItems.length})
            </SheetTitle>
            <SheetClose>
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center py-12">
            <ShoppingCart className="h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-xl font-medium mb-2">Your cart is empty</h3>
            <p className="text-center text-gray-500 mb-6">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Button onClick={handleClose}>
              Continue Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Free shipping progress */}
            <div className="py-3 px-1">
              {amountToFreeShipping > 0 ? (
                <p className="text-sm text-center mb-2">
                  You're <span className="font-medium">${amountToFreeShipping.toFixed(2)}</span> away from free shipping!
                </p>
              ) : (
                <p className="text-sm text-center mb-2 text-primary font-medium">
                  🎉 You've unlocked FREE shipping!
                </p>
              )}
              
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-500 ease-in-out"
                  style={{ width: `${shippingProgress}%` }}
                />
              </div>
            </div>
          
            <ScrollArea className="flex-1 pb-16">
              <div className="space-y-4 pt-4">
                {cartItems.map((item) => {
                  const price = item.subscription && item.product.subscription_price
                    ? item.product.subscription_price
                    : item.product.salePrice || item.product.price;
                    
                  return (
                    <div key={`${item.product.id}-${item.flavor || 'default'}`} className="flex border-b pb-4">
                      <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 ml-4">
                        <div className="flex justify-between">
                          <Link 
                            to={`/product/${item.product.slug}`} 
                            className="font-medium hover:text-primary transition line-clamp-2"
                            onClick={handleClose}
                          >
                            {item.product.title}
                          </Link>
                          <button 
                            onClick={() => removeFromCart(item.product.id)} 
                            className="text-gray-400 hover:text-red-500"
                          >
                            <X size={16} />
                          </button>
                        </div>
                        
                        {item.flavor && (
                          <p className="text-sm text-gray-500">Flavor: {item.flavor}</p>
                        )}
                        
                        <div className="mt-1 flex items-center justify-between">
                          <div className="flex items-center border rounded">
                            <button
                              onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                              className="px-2 py-1 text-gray-600 hover:text-primary"
                              disabled={item.quantity <= 1}
                            >
                              <Minus size={14} />
                            </button>
                            <span className="px-2 text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="px-2 py-1 text-gray-600 hover:text-primary"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          
                          <div className="text-right">
                            <div className="flex flex-col items-end">
                              <span className="font-medium price">
                                ${(price * item.quantity).toFixed(2)}
                              </span>
                              {item.subscription && (
                                <span className="text-xs text-primary">Subscription</span>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        {item.product.subscription_price && (
                          <button
                            onClick={() => toggleSubscription(item.product.id)}
                            className="text-xs mt-2 text-primary hover:text-primary-dark underline"
                          >
                            {item.subscription ? "Switch to one-time purchase" : "Subscribe & save 10%"}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
                
                {cartItems.length > 0 && (
                  <div className="pt-4">
                    <h4 className="font-medium mb-2">You might also like:</h4>
                    <div className="flex overflow-x-auto space-x-4 pb-2 scrollbar-none">
                      {/* First cross-sell item */}
                      <div className="w-32 flex-shrink-0">
                        <div className="bg-gray-100 rounded overflow-hidden aspect-square mb-2">
                          <img 
                            src="/products/multivitamin-1.jpg" 
                            alt="Daily Multivitamin Plus" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h5 className="text-xs font-medium line-clamp-2">Daily Multivitamin Plus</h5>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs price">$29.99</span>
                          <button className="text-xs text-primary hover:text-primary-dark">
                            + Add
                          </button>
                        </div>
                      </div>
                      
                      {/* Second cross-sell item */}
                      <div className="w-32 flex-shrink-0">
                        <div className="bg-gray-100 rounded overflow-hidden aspect-square mb-2">
                          <img 
                            src="/products/collagen-1.jpg" 
                            alt="Collagen Peptides" 
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <h5 className="text-xs font-medium line-clamp-2">Collagen Peptides</h5>
                        <div className="flex justify-between items-center mt-1">
                          <span className="text-xs price">$34.99</span>
                          <button className="text-xs text-primary hover:text-primary-dark">
                            + Add
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            
            <div className="border-t mt-auto pt-4 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span className="price">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{cartTotal >= freeShippingThreshold ? "FREE" : "Calculated at checkout"}</span>
                </div>
              </div>
              
              <div className="flex justify-between font-medium">
                <span>Total</span>
                <span className="price">${cartTotal.toFixed(2)}</span>
              </div>
              
              <div className="space-y-2">
                <Button className="w-full bg-primary hover:bg-primary-dark" asChild>
                  <Link to="/checkout" onClick={handleClose}>
                    Proceed to Checkout
                  </Link>
                </Button>
                
                <Button variant="outline" className="w-full" onClick={handleClose}>
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
