
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from "@/hooks/use-toast";
import ProductImage from '@/components/ProductImage';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [imageError, setImageError] = useState<boolean>(false);
  const [isSubscription, setIsSubscription] = useState<boolean>(false);
  const { addToCart } = useCart();
  const { toast } = useToast();

  useEffect(() => {
    const loadProduct = async () => {
      try {
        setLoading(true);
        const products = await fetchSquareProducts();
        const foundProduct = products.find(p => p.slug === slug);
        
        if (foundProduct) {
          setProduct(foundProduct);
          setSelectedImage(foundProduct.images[0]);
          
          // Set default flavor if available
          if (foundProduct.flavors && foundProduct.flavors.length > 0) {
            setSelectedFlavor(foundProduct.flavors[0]);
          }
        } else {
          setError('Product not found');
        }
      } catch (err) {
        console.error('Failed to load product:', err);
        setError('Failed to load product details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadProduct();
  }, [slug]);

  const handleAddToCart = () => {
    if (product) {
      addToCart(
        product,
        quantity,
        selectedFlavor,
        isSubscription
      );
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
        variant: "default"
      });
    }
  };

  const handleImageError = () => {
    console.log(`Main product image failed to load: ${selectedImage}`);
    setImageError(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-12 pt-32">
        <div className="text-center p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="mb-6">{error || 'Product not found'}</p>
          <Button asChild>
            <Link to="/products">Back to All Products</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 pt-32">
      {/* Product Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <ProductImage
              src={selectedImage} 
              alt={product.title}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button 
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === image ? 'border-primary' : 'border-transparent'}`}
              >
                <ProductImage
                  src={image} 
                  alt={`${product.title} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info & Add to Cart */}
        <div className="space-y-6">
          {/* Product badges */}
          <div className="flex flex-wrap gap-2 mb-2">
            {product.bestSeller && (
              <span className="bg-black text-white text-xs py-1 px-2 rounded">Best Seller</span>
            )}
            {product.featured && (
              <span className="bg-primary text-white text-xs py-1 px-2 rounded">Featured</span>
            )}
            {product.dietary && product.dietary.map((item, index) => (
              <span key={index} className="bg-gray-100 text-gray-800 text-xs py-1 px-2 rounded">
                {item}
              </span>
            ))}
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold">{product.title}</h1>
          
          {/* Price */}
          <div className="flex items-center gap-2 mb-4">
            {product.salePrice ? (
              <>
                <span className="text-2xl font-bold text-primary">
                  {isSubscription && product.subscription_price
                    ? formatPrice(product.subscription_price)
                    : formatPrice(product.salePrice)}
                </span>
                <span className="text-lg line-through text-gray-400">
                  {formatPrice(product.price)}
                </span>
              </>
            ) : (
              <span className="text-2xl font-bold">
                {isSubscription && product.subscription_price
                  ? formatPrice(product.subscription_price)
                  : formatPrice(product.price)}
              </span>
            )}
          </div>
          
          <div className="space-y-4">
            {/* Subscription option if available */}
            {product.subscription_price && (
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="subscription"
                  checked={isSubscription}
                  onChange={(e) => setIsSubscription(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="subscription" className="text-sm font-medium text-gray-700">
                  Subscribe & Save {Math.round((1 - product.subscription_price! / product.price) * 100)}%
                </label>
              </div>
            )}
            
            {/* Flavor Selection if available */}
            {product.flavors && product.flavors.length > 0 && (
              <div>
                <label htmlFor="flavor" className="block text-sm font-medium text-gray-700 mb-1">
                  Flavor
                </label>
                <Select value={selectedFlavor} onValueChange={setSelectedFlavor}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a flavor" />
                  </SelectTrigger>
                  <SelectContent>
                    {product.flavors.map((flavor) => (
                      <SelectItem key={flavor} value={flavor}>
                        {flavor}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            
            {/* Quantity Selection */}
            <div>
              <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="border border-gray-300 rounded-l-md p-2"
                >
                  -
                </button>
                <input
                  type="number"
                  id="quantity"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  className="border-y border-gray-300 p-2 w-16 text-center"
                />
                <button
                  type="button"
                  onClick={() => setQuantity(quantity + 1)}
                  className="border border-gray-300 rounded-r-md p-2"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Stock Status */}
            <div>
              <p className={`text-sm ${product.stock > 10 ? 'text-green-600' : 'text-amber-600'}`}>
                {product.stock > 10 
                  ? 'In Stock' 
                  : product.stock > 0 
                    ? `Only ${product.stock} left in stock!` 
                    : 'Out of Stock'}
              </p>
            </div>
            
            {/* Add to Cart Button */}
            <Button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              size="lg"
              className="w-full mt-4"
            >
              {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
          </div>
        </div>
      </div>
      
      {/* Product Details Accordion - More Compact */}
      <div className="mb-16 max-w-4xl mx-auto">
        <Accordion type="single" collapsible className="w-full space-y-2">
          <AccordionItem value="description" className="border border-gray-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
              Description
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="prose max-w-none">
                <p className="text-gray-700">{product.description}</p>
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="details" className="border border-gray-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
              Details
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-4">
                {product.dietary && product.dietary.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-black">Dietary Information</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.dietary.map((item, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                {product.tags && product.tags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-2 text-black">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.tags.map((tag, index) => (
                        <span key={index} className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">
                          {tag.replace(/-/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="ingredients" className="border border-gray-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
              Ingredients
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <p className="text-gray-700">{product.ingredients}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="directions" className="border border-gray-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
              How To Use
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <p className="text-gray-700">{product.directions}</p>
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="shipping" className="border border-gray-200 rounded-lg">
            <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
              Shipping and Returns
            </AccordionTrigger>
            <AccordionContent className="px-4 pb-3">
              <div className="space-y-3 text-gray-700">
                <div>
                  <h4 className="font-semibold text-black mb-1">Shipping</h4>
                  <p>Free shipping on orders over $50. Standard shipping takes 3-5 business days.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-black mb-1">Returns</h4>
                  <p>30-day return policy. Products must be unopened and in original packaging.</p>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {product.faqs && product.faqs.length > 0 && (
            <AccordionItem value="faqs" className="border border-gray-200 rounded-lg">
              <AccordionTrigger className="px-4 py-3 text-base font-semibold hover:no-underline [&[data-state=open]>svg]:rotate-180">
                FAQs
              </AccordionTrigger>
              <AccordionContent className="px-4 pb-3">
                <div className="space-y-4">
                  {product.faqs.map((faq, index) => (
                    <div key={index} className="border-b border-gray-100 pb-3 last:border-0">
                      <h4 className="font-medium mb-2 text-black">{faq.question}</h4>
                      <p className="text-gray-700">{faq.answer}</p>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          )}
        </Accordion>
      </div>
    </div>
  );
};

export default ProductDetailPage;
