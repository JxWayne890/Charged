import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchSquareProducts } from '@/lib/square';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Home, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/context/CartContext';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from "@/components/ui/use-toast";

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isSubscription, setIsSubscription] = useState<boolean>(false);
  const { addToCart } = useCart();

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
      addToCart({
        product,
        quantity,
        flavor: selectedFlavor,
        subscription: isSubscription
      });
      
      toast({
        title: "Added to cart",
        description: `${product.title} has been added to your cart.`,
      });
    }
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
      {/* Enhanced Breadcrumbs with better styling */}
      <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-3 mb-8">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/" className="flex items-center">
                  <Home className="h-4 w-4 mr-1" />
                  <span>Home</span>
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to="/products">Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={`/category/${product.category.toLowerCase().replace(/ /g, '-')}`} className="capitalize">
                  {product.category}
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{product.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Product Overview Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img 
              src={selectedImage} 
              alt={product.title} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {product.images.map((image, index) => (
              <button 
                key={index}
                onClick={() => setSelectedImage(image)}
                className={`flex-shrink-0 w-20 h-20 rounded-md overflow-hidden border-2 ${selectedImage === image ? 'border-primary' : 'border-transparent'}`}
              >
                <img 
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
          
          <div className="flex items-center gap-4 mb-4">
            {/* Rating Stars */}
            <div className="flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <svg 
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {product.rating} ({product.reviewCount} {product.reviewCount === 1 ? 'review' : 'reviews'})
              </span>
            </div>
          </div>
          
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
      
      {/* Product Details Tabs */}
      <Tabs defaultValue="description" className="mb-16">
        <TabsList className="w-full justify-start border-b space-x-8">
          <TabsTrigger value="description">Description</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
          <TabsTrigger value="faqs">FAQs</TabsTrigger>
        </TabsList>
        
        <TabsContent value="description" className="py-6">
          <div className="prose max-w-none">
            <p className="text-lg mb-6">{product.description}</p>
            
            <h3 className="text-xl font-semibold mb-4">Key Benefits</h3>
            <ul className="space-y-2 mb-6">
              {product.benefits.map((benefit, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-primary mr-2">✓</span>
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
        
        <TabsContent value="details" className="py-6 space-y-6">
          <div>
            <h3 className="text-xl font-semibold mb-4">Ingredients</h3>
            <p>{product.ingredients}</p>
          </div>
          
          <div>
            <h3 className="text-xl font-semibold mb-4">Directions for Use</h3>
            <p>{product.directions}</p>
          </div>
          
          {product.dietary && product.dietary.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold mb-4">Dietary Information</h3>
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
              <h3 className="text-xl font-semibold mb-4">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag, index) => (
                  <span key={index} className="bg-gray-100 text-gray-800 py-1 px-3 rounded-full text-sm">
                    {tag.replace(/-/g, ' ')}
                  </span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="faqs" className="py-6">
          <div className="space-y-6">
            <h3 className="text-xl font-semibold mb-4">Frequently Asked Questions</h3>
            {product.faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 mb-4 last:border-0">
                <h4 className="text-lg font-medium mb-2">{faq.question}</h4>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductDetailPage;
