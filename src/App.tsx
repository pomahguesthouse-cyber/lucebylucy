import { useState, useEffect } from "react";
import {
  Search,
  User,
  ShoppingBag,
  Heart,
  Truck,
  RotateCcw,
  ShieldCheck,
  Headphones,
  ArrowRight,
  Plus,
  Minus,
  X,
  Check,
  ShoppingBag as BagIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import "./App.css";

// Premium products data matching the warm aesthetic
const products = [
  {
    id: "oversized-blazer",
    name: "Oversized Blazer",
    price: 89.99,
    priceStr: "$89.99",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&w=700&q=80",
    description: "A tailored oversized blazer crafted from premium breathable linen blend. Perfect for layering and creating an effortless elegant silhouette.",
    colors: ["#D4C5B9", "#111111", "#FAF8F5"],
    colorNames: ["Taupe", "Black", "Cream"]
  },
  {
    id: "leather-handbag",
    name: "Leather Handbag",
    price: 99.99,
    priceStr: "$99.99",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=700&q=80",
    description: "Chic structured handbag in rich pebbled calf leather. Features a spacious compartment, interior pockets, and elegant gold-tone hardware lock.",
    colors: ["#8B5A2B", "#111111", "#EAD8C3"],
    colorNames: ["Brown", "Black", "Beige"]
  },
  {
    id: "knitted-sweater",
    name: "Knitted Sweater",
    price: 59.99,
    priceStr: "$59.99",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=700&q=80",
    description: "Cozy knit sweater made from ultra-soft organic cotton and wool blend. Features a ribbed collar, cuffs, and a relaxed, comfortable fit.",
    colors: ["#FAF8F5", "#8F8175", "#6B7C85"],
    colorNames: ["Cream", "Taupe", "Dusty Blue"]
  },
  {
    id: "ankle-boots",
    name: "Ankle Boots",
    price: 109.99,
    priceStr: "$109.99",
    image: "https://images.unsplash.com/photo-1535043934128-cf0b28d52f95?auto=format&fit=crop&w=700&q=80",
    description: "Crafted from fine split suede, these ankle boots feature a comfortable block heel and side zip closure. Elevates any outfit effortlessly.",
    colors: ["#C5A880", "#111111", "#8C6D4F"],
    colorNames: ["Sand", "Black", "Cocoa"]
  },
  {
    id: "satin-dress",
    name: "Satin Dress",
    price: 79.99,
    priceStr: "$79.99",
    image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=700&q=80",
    description: "A flowing satin slip dress with adjustable spaghetti straps. Features a subtle cowl neck and a graceful side slit for premium elegance.",
    colors: ["#EAD8C3", "#3B2E2A", "#721C24"],
    colorNames: ["Champagne", "Espresso", "Burgundy"]
  },
  {
    id: "wide-leg-pants",
    name: "Wide Leg Pants",
    price: 69.99,
    priceStr: "$69.99",
    image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=700&q=80",
    description: "Relaxed wide-leg trousers cut from premium heavy linen. Features a high-rise elastic waist, side pockets, and double pleat details.",
    colors: ["#DFD5C6", "#111111", "#FAF8F5"],
    colorNames: ["Oatmeal", "Black", "White"]
  }
];

// Premium hero slides matching the new design layout (wide images)
const heroSlides = [
  {
    id: 1,
    eyebrow: "Feel the Fashion",
    headline: "Elevate Your Style!",
    description: "Discover timeless fashion pieces crafted for the modern woman.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85",
    trendingProduct: products[4] // Satin Dress
  },
  {
    id: 2,
    eyebrow: "New Collection",
    headline: "Embrace Elegance.",
    description: "Indulge in tailored linen blazers, trousers, and refined silhouettes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
    trendingProduct: products[0] // Oversized Blazer
  },
  {
    id: 3,
    eyebrow: "Autumn Warmth",
    headline: "Refined Textures.",
    description: "Discover cozy knitted cotton-wool blends and warm color palettes.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85",
    trendingProduct: products[1] // Leather Handbag
  }
];

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  colorName: string;
}

function App() {
  // Global cart, wishlist, and slide-over states
  const [cart, setCart] = useState<CartItem[]>([
    {
      id: "oversized-blazer",
      name: "Oversized Blazer",
      price: 89.99,
      image: products[0].image,
      quantity: 1,
      color: "#D4C5B9",
      colorName: "Taupe"
    },
    {
      id: "leather-handbag",
      name: "Leather Handbag",
      price: 99.99,
      image: products[1].image,
      quantity: 1,
      color: "#8B5A2B",
      colorName: "Brown"
    }
  ]);
  const [wishlist, setWishlist] = useState<string[]>(["leather-handbag"]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Hero Slider active index state
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-play interval for hero slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  // Wishlist handler
  const toggleWishlist = (id: string, name: string) => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
      toast.info(`Removed ${name} from your Wishlist`);
    } else {
      setWishlist([...wishlist, id]);
      toast.success(`Added ${name} to your Wishlist!`);
    }
  };

  // Add to cart handler
  const addToCart = (product: typeof products[0], colorCode?: string, colorName?: string, qty: number = 1) => {
    const code = colorCode || product.colors[0];
    const name = colorName || product.colorNames[0];

    const existing = cart.find(item => item.id === product.id && item.color === code);
    if (existing) {
      setCart(cart.map(item => 
        (item.id === product.id && item.color === code)
          ? { ...item, quantity: item.quantity + qty }
          : item
      ));
    } else {
      setCart([...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
        color: code,
        colorName: name
      }]);
    }
    toast.success(`Added ${product.name} (${name}) to your Shopping Bag!`, {
      action: {
        label: "View Bag",
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const removeFromCart = (id: string, color: string, name: string) => {
    setCart(cart.filter(item => !(item.id === id && item.color === color)));
    toast.info(`Removed ${name} from your Shopping Bag`);
  };

  const updateCartQty = (id: string, color: string, change: number) => {
    setCart(cart.map(item => {
      if (item.id === id && item.color === color) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    }));
  };

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getCartSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    toast.success("Checkout simulation complete! Thank you for purchasing from Luce by Lucy.");
    setCart([]);
    setIsCartOpen(false);
  };

  const activeSlide = heroSlides[currentSlide];

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans selection:bg-stone-200 antialiased pb-20 relative overflow-x-hidden">
      <Toaster position="bottom-right" richColors />
      
      {/* Hero Wrapper: Full Width and Height spanning the very top of the page */}
      <div className="relative w-full overflow-hidden border-b border-stone-250/20 h-[600px] lg:h-[720px]">
        
        {/* Full-Width Background Images */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{ backgroundImage: `url(${activeSlide.image})` }}
        >
          {/* Soft overlay gradient for text readability (solid warm cream on the left, fade to transparent on the right) */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#FAF7F2]/95 via-[#FAF7F2]/50 md:from-[#FAF7F2]/90 md:via-[#FAF7F2]/30 to-transparent pointer-events-none" />
        </div>

        {/* 1. Header (Overlay Layout aligned with max-w-7xl) */}
        <header className="absolute top-0 left-0 right-0 max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between z-40 bg-transparent">
          <div className="flex items-center">
            <img src="/logo.png" alt="Luce by Lucy Logo" className="h-12 md:h-14 w-auto object-contain" />
          </div>

          <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.25em] font-semibold text-stone-500 uppercase">
            <a href="#home" className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 translate-y-0.5">Home</a>
            <a href="#shop" className="hover:text-stone-900 transition-colors">Shop</a>
            <a href="#shape" className="hover:text-stone-900 transition-colors">Shape</a>
            <a href="#product" className="hover:text-stone-900 transition-colors">Product</a>
            <a href="#style" className="hover:text-stone-900 transition-colors">Style</a>
            <a href="#blog" className="hover:text-stone-900 transition-colors">Blog</a>
          </nav>

          <div className="flex items-center gap-6 text-stone-700">
            <button aria-label="Search" className="hover:text-stone-900 transition-colors">
              <Search size={20} strokeWidth={1.5} />
            </button>
            <button 
              onClick={() => toggleWishlist(activeSlide.trendingProduct.id, activeSlide.trendingProduct.name)}
              aria-label="Wishlist" 
              className="hover:text-stone-900 transition-colors"
            >
              <Heart size={20} strokeWidth={1.5} className={wishlist.includes(activeSlide.trendingProduct.id) ? "fill-red-500 stroke-red-500" : ""} />
            </button>
            <button aria-label="User Account" className="hover:text-stone-900 transition-colors">
              <User size={20} strokeWidth={1.5} />
            </button>
            <button 
              aria-label="Shopping Bag" 
              className="relative hover:text-stone-900 transition-colors" 
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingBag size={20} strokeWidth={1.5} />
              {getCartCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-stone-900 text-[#FAF7F2] font-sans font-bold text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center scale-90 animate-fade-in">
                  {getCartCount()}
                </span>
              )}
            </button>
          </div>
        </header>

        {/* 2. Hero Content (Centered grid content container) */}
        <div className="relative max-w-7xl mx-auto px-6 md:px-12 h-full flex items-center z-10 w-full text-left pt-20">
          <div key={currentSlide} className="animate-fade-in max-w-md md:max-w-xl">
            <span className="text-[10px] tracking-[0.3em] font-bold text-amber-800 uppercase mb-3 block">
              {activeSlide.eyebrow}
            </span>
            <h1 className="font-serif text-5xl md:text-[70px] leading-[1.08] font-light text-stone-900 tracking-tight mb-4">
              {activeSlide.headline}
            </h1>
            <p className="text-stone-600 font-light text-base md:text-lg mb-8 max-w-md leading-relaxed">
              {activeSlide.description}
            </p>

            <div className="flex items-center gap-4">
              <a 
                href="#shop"
                className="pulse-btn bg-[#A38D7D] text-white font-sans font-medium text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-xl hover:bg-[#927E6E] shadow-md hover:shadow-lg transition-all"
              >
                Shop Now
              </a>
              <a 
                href="#new-arrivals"
                className="border border-stone-300 text-stone-850 font-sans font-medium text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-xl hover:bg-white/40 transition-all"
              >
                New Arrivals
              </a>
            </div>
          </div>
        </div>

        {/* Floating Trending Overlay Card in Bottom Right corner */}
        <div key={`trending-${currentSlide}`} className="animate-fade-in animate-float absolute bottom-8 right-6 md:right-12 bg-white/75 backdrop-blur-xl border border-white/40 p-4 rounded-3xl shadow-xl flex items-center gap-4 max-w-[270px] z-30">
          <img 
            src={activeSlide.trendingProduct.image} 
            alt="Trending item" 
            className="w-14 h-14 object-cover rounded-2xl bg-stone-100 shadow-inner"
          />
          <div className="text-left">
            <span className="text-[8px] font-bold tracking-[0.2em] text-stone-400 uppercase block">Trending Now</span>
            <h4 className="font-sans font-bold text-[11px] text-stone-800 truncate max-w-[130px]">
              {activeSlide.trendingProduct.name}
            </h4>
            <p className="font-semibold text-[10px] text-stone-900 mt-0.5">
              {activeSlide.trendingProduct.priceStr}
            </p>
            <button 
              onClick={() => addToCart(activeSlide.trendingProduct)}
              className="text-[9px] font-bold text-stone-800 hover:text-stone-900 flex items-center gap-1 mt-1 tracking-wider uppercase border-b border-stone-800/40 pb-0.5"
            >
              Quick Add <ArrowRight size={10} className="stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Slider Controls (Overlay Chevrons on far edges) */}
        <button 
          onClick={prevSlide}
          className="absolute left-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-stone-800 p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors z-30 cursor-pointer"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-6 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white text-stone-850 p-2.5 rounded-full shadow-md backdrop-blur-xs transition-colors z-30 cursor-pointer"
          aria-label="Next Slide"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

        {/* Dot indicators in bottom-center */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
          {heroSlides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-1.5 rounded-full transition-all ${
                currentSlide === idx ? "bg-stone-900 w-5" : "bg-stone-900/40 w-1.5"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>

      {/* 3. New Arrivals & Editorial Grid */}
      <section id="new-arrivals" className="max-w-7xl mx-auto px-6 md:px-12 py-16">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-12 items-stretch">
          
          {/* New Arrivals Section */}
          <div className="xl:col-span-9 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div className="flex flex-col text-left">
                <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase mb-1">Our Latest Pieces</span>
                <h2 className="font-serif text-3xl font-light text-stone-900 tracking-tight">New Arrivals</h2>
              </div>
              <a 
                href="#shop"
                className="text-[10px] font-bold tracking-[0.2em] uppercase text-stone-800 hover:underline flex items-center gap-1.5"
              >
                View All <ArrowRight size={12} strokeWidth={2.5} />
              </a>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 md:gap-6">
              {products.slice(0, 4).map((product) => (
                <div key={product.id} className="group flex flex-col text-left relative">
                  
                  {/* Heart Wishlist Trigger */}
                  <button 
                    onClick={() => toggleWishlist(product.id, product.name)}
                    className="absolute top-3 right-3 bg-white/80 hover:bg-white text-stone-700 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm z-10 transition-colors"
                  >
                    <Heart 
                      size={14} 
                      className={wishlist.includes(product.id) ? "fill-red-500 stroke-red-500" : "stroke-[2px]"} 
                    />
                  </button>

                  {/* Image wrapper */}
                  <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-sm mb-3">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />
                    
                    {/* Desktop Hover Quick Add overlay */}
                    <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-white/95 text-stone-900 font-sans font-bold text-[9px] tracking-widest uppercase py-2 px-4 rounded-full shadow-md hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
                      >
                        Quick Add
                      </button>
                    </div>
                  </div>

                  <h3 className="font-sans text-xs text-stone-600 font-semibold truncate px-1">
                    {product.name}
                  </h3>
                  <p className="font-sans text-xs text-stone-900 font-bold mt-0.5 px-1">
                    {product.priceStr}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Editorial Section */}
          <div className="xl:col-span-3 flex bg-[#FAF3EA] border border-stone-200/50 rounded-[30px] p-8 flex-col justify-between items-center text-center shadow-sm relative min-h-[320px]">
            <div className="my-auto flex flex-col items-center">
              <span className="font-serif text-5xl font-light tracking-[0.1em] leading-none text-stone-900 uppercase">FASHION</span>
              <span className="font-serif text-5xl font-light tracking-[0.1em] leading-none text-stone-900 uppercase mt-2">STORE</span>
              <span className="font-script text-5xl text-amber-800 rotate-[-12deg] tracking-normal capitalize my-1 block">Design</span>
              
              <div className="w-16 h-[1px] bg-stone-400/50 my-6" />
              
              <span className="text-[10px] tracking-[0.35em] font-semibold text-stone-500 uppercase">
                Elegant. Modern. Timeless.
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Shop Catalog Section */}
      <section id="shop" className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-stone-200/50">
        <div className="flex flex-col text-left mb-10">
          <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase mb-1">Our Collection</span>
          <h2 className="font-serif text-3xl font-light text-stone-950 tracking-tight">Shop the Catalog</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {products.map((product) => (
            <div key={product.id} className="group flex flex-col text-left relative">
              {/* Heart Wishlist Trigger */}
              <button 
                onClick={() => toggleWishlist(product.id, product.name)}
                className="absolute top-3 right-3 bg-white/80 hover:bg-white text-stone-700 hover:text-red-500 w-8 h-8 rounded-full flex items-center justify-center shadow-md backdrop-blur-sm z-10 transition-colors"
              >
                <Heart 
                  size={14} 
                  className={wishlist.includes(product.id) ? "fill-red-500 stroke-red-500" : "stroke-[2px]"} 
                />
              </button>

              {/* Image wrapper */}
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-sm mb-3">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                />
                
                {/* Quick Add overlay */}
                <div className="absolute inset-0 bg-stone-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                  <button 
                    onClick={() => addToCart(product)}
                    className="bg-white/95 text-stone-900 font-sans font-bold text-[9px] tracking-widest uppercase py-2 px-4 rounded-full shadow-md hover:bg-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300"
                  >
                    Quick Add
                  </button>
                </div>
              </div>

              <h3 className="font-sans text-xs text-stone-600 font-semibold truncate px-1">
                {product.name}
              </h3>
              <p className="font-sans text-xs text-stone-900 font-bold mt-0.5 px-1">
                {product.priceStr}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Footer Trust Badges */}
      <footer className="max-w-7xl mx-auto px-6 md:px-12 border-t border-stone-200 mt-20 pt-10 text-stone-500 font-sans">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 justify-items-center text-center">
          
          <div className="flex flex-col items-center max-w-[200px]">
            <Truck size={24} className="text-stone-700 stroke-[1.2] mb-3" />
            <span className="font-bold text-xs tracking-wider uppercase text-stone-850">Free Shipping</span>
            <span className="text-[11px] text-stone-400 font-light mt-1">On orders over $99</span>
          </div>

          <div className="flex flex-col items-center max-w-[200px]">
            <RotateCcw size={24} className="text-stone-700 stroke-[1.2] mb-3" />
            <span className="font-bold text-xs tracking-wider uppercase text-stone-850">Easy Returns</span>
            <span className="text-[11px] text-stone-400 font-light mt-1">30-day return policy</span>
          </div>

          <div className="flex flex-col items-center max-w-[200px]">
            <ShieldCheck size={24} className="text-stone-700 stroke-[1.2] mb-3" />
            <span className="font-bold text-xs tracking-wider uppercase text-stone-850">Secure Payment</span>
            <span className="text-[11px] text-stone-400 font-light mt-1">100% secure checkout</span>
          </div>

          <div className="flex flex-col items-center max-w-[200px]">
            <Headphones size={24} className="text-stone-700 stroke-[1.2] mb-3" />
            <span className="font-bold text-xs tracking-wider uppercase text-stone-850">24/7 Support</span>
            <span className="text-[11px] text-stone-400 font-light mt-1">We're here to help</span>
          </div>

        </div>

        <div className="text-center mt-12 pt-6 border-t border-stone-100 text-[10px] tracking-widest text-stone-400 uppercase">
          &copy; {new Date().getFullYear()} Luce by Lucy. All rights reserved. Crafted with elegance.
        </div>
      </footer>

      {/* 6. Shopping Bag Slide-Over Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-screen max-w-md bg-[#FAF7F2] shadow-2xl h-full flex flex-col justify-between z-10 animate-slide-in-right">
            <div className="px-6 py-6 border-b border-stone-200/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BagIcon size={18} className="text-stone-700" />
                <h3 className="font-serif text-lg font-bold tracking-wide">Shopping Bag</h3>
                <span className="bg-stone-200 text-stone-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {getCartCount()}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto px-6 py-4 divide-y divide-stone-200/50">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center py-20">
                  <ShoppingBag size={48} className="text-stone-300 stroke-[1.2] mb-4" />
                  <p className="font-sans font-bold text-stone-400 uppercase tracking-widest text-xs">Your bag is empty</p>
                  <span className="text-stone-400 font-light text-xs mt-1">Add items to view them here.</span>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.color}`} className="py-5 flex gap-4">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-16 h-20 object-cover rounded-2xl bg-stone-100 border border-stone-200/20"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-sans font-bold text-xs text-stone-850">{item.name}</h4>
                          <p className="text-[10px] text-stone-400 font-medium mt-0.5">Color: {item.colorName}</p>
                        </div>
                        <button 
                          onClick={() => removeFromCart(item.id, item.color, item.name)}
                          className="text-stone-400 hover:text-stone-600 p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-xs text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                        <div className="flex items-center border border-stone-300/80 rounded-full h-6 overflow-hidden bg-white">
                          <button 
                            onClick={() => updateCartQty(item.id, item.color, -1)}
                            className="w-6 h-full flex items-center justify-center hover:bg-stone-50 text-[10px] font-bold"
                          >
                            <Minus size={8} />
                          </button>
                          <span className="w-6 text-center text-[10px] font-bold text-stone-700">{item.quantity}</span>
                          <button 
                            onClick={() => updateCartQty(item.id, item.color, 1)}
                            className="w-6 h-full flex items-center justify-center hover:bg-stone-50 text-[10px] font-bold"
                          >
                            <Plus size={8} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* pricing footer */}
            {cart.length > 0 && (
              <div className="bg-stone-100/60 border-t border-stone-200/80 px-6 py-6">
                <div className="flex justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  <span>Subtotal</span>
                  <span className="text-stone-850 font-bold">${getCartSubtotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-semibold text-stone-500 uppercase tracking-wider mt-3">
                  <span>Shipping</span>
                  <span className="text-emerald-600 font-bold text-[11px] tracking-widest uppercase">Free</span>
                </div>
                <div className="w-full h-[1px] bg-stone-300/50 my-4" />
                <div className="flex justify-between text-sm font-bold text-stone-900 uppercase tracking-wider">
                  <span>Total</span>
                  <span>${getCartSubtotal().toFixed(2)}</span>
                </div>

                <button 
                  onClick={handleCheckout}
                  className="w-full bg-stone-900 text-stone-50 font-sans font-bold text-xs tracking-[0.2em] uppercase py-4 rounded-full mt-6 hover:bg-stone-800 shadow-md hover:shadow-lg transition-all"
                >
                  Proceed to Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}

    </main>
  );
}

export default App;