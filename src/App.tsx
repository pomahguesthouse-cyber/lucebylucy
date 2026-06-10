import { useState, useEffect } from "react";
import {
  HashRouter as Router,
  Routes,
  Route,
  Link,
} from "react-router-dom";
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
  LayoutDashboard,
  Sliders,
  Package,
  LogOut,
  Globe,
  Settings,
  PlusCircle,
  Edit2,
  Trash2,
  Lock,
} from "lucide-react";
import { Toaster, toast } from "sonner";
import "./App.css";

// ----------------------------------------------------
// DEFAULT DATA SYSTEM
// ----------------------------------------------------

const defaultProducts = [
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

const defaultSlides = [
  {
    id: 1,
    eyebrow: "Feel the Fashion",
    headline: "Elevate Your Style!",
    description: "Discover timeless fashion pieces crafted for the modern woman.",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1600&q=85",
    trendingProductId: "satin-dress"
  },
  {
    id: 2,
    eyebrow: "New Collection",
    headline: "Embrace Elegance.",
    description: "Indulge in tailored linen blazers, trousers, and refined silhouettes.",
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1600&q=85",
    trendingProductId: "oversized-blazer"
  },
  {
    id: 3,
    eyebrow: "Autumn Warmth",
    headline: "Refined Textures.",
    description: "Discover cozy knitted cotton-wool blends and warm color palettes.",
    image: "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1600&q=85",
    trendingProductId: "leather-handbag"
  }
];

// Helper functions for LocalStorage sync
const loadProducts = () => {
  const data = localStorage.getItem("luce_products");
  if (data) return JSON.parse(data);
  localStorage.setItem("luce_products", JSON.stringify(defaultProducts));
  return defaultProducts;
};

const loadSlides = () => {
  const data = localStorage.getItem("luce_slides");
  if (data) return JSON.parse(data);
  localStorage.setItem("luce_slides", JSON.stringify(defaultSlides));
  return defaultSlides;
};

// ----------------------------------------------------
// MAIN ROUTER ENTRY POINT
// ----------------------------------------------------

function App() {
  return (
    <Router>
      <Toaster position="bottom-right" richColors />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/admin" element={<AdminPage />} />
      </Routes>
    </Router>
  );
}

// ----------------------------------------------------
// PUBLIC LANDING PAGE
// ----------------------------------------------------

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  colorName: string;
}

function LandingPage() {
  // Sync products and slides from LocalStorage
  const [productsList, setProductsList] = useState<typeof defaultProducts>([]);
  const [slidesList, setSlidesList] = useState<typeof defaultSlides>([]);

  useEffect(() => {
    setProductsList(loadProducts());
    setSlidesList(loadSlides());
  }, []);

  // Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<string[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Initialize cart from localStorage if exists
  useEffect(() => {
    const cachedCart = localStorage.getItem("luce_cart");
    if (cachedCart) {
      setCart(JSON.parse(cachedCart));
    } else if (productsList.length > 0) {
      const initialCart = [
        {
          id: productsList[0].id,
          name: productsList[0].name,
          price: productsList[0].price,
          image: productsList[0].image,
          quantity: 1,
          color: productsList[0].colors[0],
          colorName: productsList[0].colorNames[0]
        },
        {
          id: productsList[1].id,
          name: productsList[1].name,
          price: productsList[1].price,
          image: productsList[1].image,
          quantity: 1,
          color: productsList[1].colors[0],
          colorName: productsList[1].colorNames[0]
        }
      ];
      setCart(initialCart);
      localStorage.setItem("luce_cart", JSON.stringify(initialCart));
    }
  }, [productsList]);

  // Wishlist cache
  useEffect(() => {
    const cachedWish = localStorage.getItem("luce_wishlist");
    if (cachedWish) {
      setWishlist(JSON.parse(cachedWish));
    } else {
      const initialWish = ["leather-handbag"];
      setWishlist(initialWish);
      localStorage.setItem("luce_wishlist", JSON.stringify(initialWish));
    }
  }, []);

  // Save cart changes
  const saveCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem("luce_cart", JSON.stringify(newCart));
  };

  // Auto-play interval for hero slider
  useEffect(() => {
    if (slidesList.length === 0) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesList.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slidesList]);

  const nextSlide = () => {
    if (slidesList.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slidesList.length);
  };

  const prevSlide = () => {
    if (slidesList.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slidesList.length) % slidesList.length);
  };

  // Wishlist handler
  const toggleWishlist = (id: string, name: string) => {
    let updated: string[];
    if (wishlist.includes(id)) {
      updated = wishlist.filter(item => item !== id);
      toast.info(`Removed ${name} from your Wishlist`);
    } else {
      updated = [...wishlist, id];
      toast.success(`Added ${name} to your Wishlist!`);
    }
    setWishlist(updated);
    localStorage.setItem("luce_wishlist", JSON.stringify(updated));
  };

  // Add to cart handler
  const addToCart = (product: typeof defaultProducts[0], colorCode?: string, colorName?: string, qty: number = 1) => {
    const code = colorCode || product.colors[0];
    const name = colorName || product.colorNames[0];

    const existing = cart.find(item => item.id === product.id && item.color === code);
    let updatedCart: CartItem[];
    if (existing) {
      updatedCart = cart.map(item => 
        (item.id === product.id && item.color === code)
          ? { ...item, quantity: item.quantity + qty }
          : item
      );
    } else {
      updatedCart = [...cart, {
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: qty,
        color: code,
        colorName: name
      }];
    }
    saveCart(updatedCart);
    toast.success(`Added ${product.name} (${name}) to your Shopping Bag!`, {
      action: {
        label: "View Bag",
        onClick: () => setIsCartOpen(true)
      }
    });
  };

  const removeFromCart = (id: string, color: string, name: string) => {
    const updated = cart.filter(item => !(item.id === id && item.color === color));
    saveCart(updated);
    toast.info(`Removed ${name} from your Shopping Bag`);
  };

  const updateCartQty = (id: string, color: string, change: number) => {
    const updated = cart.map(item => {
      if (item.id === id && item.color === color) {
        const newQty = item.quantity + change;
        return { ...item, quantity: newQty < 1 ? 1 : newQty };
      }
      return item;
    });
    saveCart(updated);
  };

  const getCartCount = () => cart.reduce((total, item) => total + item.quantity, 0);
  const getCartSubtotal = () => cart.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = () => {
    toast.success("Checkout simulation complete! Thank you for purchasing from Luce by Lucy.");
    saveCart([]);
    setIsCartOpen(false);
  };

  if (productsList.length === 0 || slidesList.length === 0) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-stone-300 border-t-stone-900 rounded-full animate-spin" />
      </div>
    );
  }

  const activeSlide = slidesList[currentSlide];
  // Retrieve corresponding trending product for active slide
  const activeTrendingProduct = productsList.find(p => p.id === activeSlide.trendingProductId) || productsList[0];

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans selection:bg-stone-200 antialiased pb-20 relative overflow-x-hidden">
      
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
              onClick={() => toggleWishlist(activeTrendingProduct.id, activeTrendingProduct.name)}
              aria-label="Wishlist" 
              className="hover:text-stone-900 transition-colors"
            >
              <Heart size={20} strokeWidth={1.5} className={wishlist.includes(activeTrendingProduct.id) ? "fill-red-500 stroke-red-500" : ""} />
            </button>
            <Link to="/admin" aria-label="Admin Dashboard" className="hover:text-stone-900 transition-colors">
              <User size={20} strokeWidth={1.5} />
            </Link>
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
                className="pulse-btn bg-[#A38D7D] text-white font-sans font-medium text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-xl hover:bg-[#927E6E] shadow-sm hover:shadow-md transition-all"
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
            src={activeTrendingProduct.image} 
            alt="Trending item" 
            className="w-14 h-14 object-cover rounded-2xl bg-stone-100 shadow-inner"
          />
          <div className="text-left">
            <span className="text-[8px] font-bold tracking-[0.2em] text-stone-400 uppercase block">Trending Now</span>
            <h4 className="font-sans font-bold text-[11px] text-stone-800 truncate max-w-[130px]">
              {activeTrendingProduct.name}
            </h4>
            <p className="font-semibold text-[10px] text-stone-900 mt-0.5">
              ${activeTrendingProduct.price.toFixed(2)}
            </p>
            <button 
              onClick={() => addToCart(activeTrendingProduct)}
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
          {slidesList.map((_, idx) => (
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
              {productsList.slice(0, 4).map((product) => (
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
                    ${product.price.toFixed(2)}
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
          <h2 className="font-serif text-3xl font-light text-stone-955 tracking-tight">Shop the Catalog</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-6">
          {productsList.map((product) => (
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
                ${product.price.toFixed(2)}
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
          <div 
            className="absolute inset-0 bg-stone-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsCartOpen(false)}
          />

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

// ----------------------------------------------------
// BACKEND ADMIN PANELS
// ----------------------------------------------------

interface AdminUser {
  name: string;
  email: string;
  avatar: string;
}

function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => localStorage.getItem("admin_logged_in") === "true");
  const [user, setUser] = useState<AdminUser | null>(null);
  
  // Google sign in popup triggers
  const [showGooglePopup, setShowGooglePopup] = useState(false);
  const [googleStep, setGoogleStep] = useState(0); // 0: Choose Account, 1: Loading verification

  // Navigation inside Admin Dashboard
  const [activeTab, setActiveTab] = useState<"dashboard" | "slider" | "products">("slider");

  // Local state for slide and product lists
  const [slides, setSlides] = useState<typeof defaultSlides>([]);
  const [products, setProducts] = useState<typeof defaultProducts>([]);

  // Modals / Editors state
  const [editingSlideId, setEditingSlideId] = useState<number | null>(null);
  const [slideForm, setSlideForm] = useState({
    eyebrow: "",
    headline: "",
    description: "",
    image: "",
    trendingProductId: ""
  });

  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    price: 0,
    image: "",
    description: "",
    colorsStr: "",
    colorNamesStr: ""
  });

  // Sync session and backend arrays
  useEffect(() => {
    if (isLoggedIn) {
      setUser({
        name: localStorage.getItem("admin_user_name") || "Lucy Admin",
        email: localStorage.getItem("admin_user_email") || "admin@lucebylucy.online",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80"
      });
      setSlides(loadSlides());
      setProducts(loadProducts());
    }
  }, [isLoggedIn]);

  // Google Login Handshake simulation
  const handleGoogleLoginClick = () => {
    setShowGooglePopup(true);
    setGoogleStep(0);
  };

  const handleChooseAccount = (name: string, email: string) => {
    setGoogleStep(1);
    // Simulate API authorization wait
    setTimeout(() => {
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_user_name", name);
      localStorage.setItem("admin_user_email", email);
      setIsLoggedIn(true);
      setShowGooglePopup(false);
      toast.success(`Welcome back, ${name}! Signed in successfully via Google.`);
    }, 1800);
  };

  const handleLogout = () => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_user_name");
    localStorage.removeItem("admin_user_email");
    setIsLoggedIn(false);
    setUser(null);
    toast.info("Logged out successfully");
  };

  // Slider Editor Handlers
  const handleEditSlide = (slide: typeof defaultSlides[0]) => {
    setEditingSlideId(slide.id);
    setSlideForm({
      eyebrow: slide.eyebrow,
      headline: slide.headline,
      description: slide.description,
      image: slide.image,
      trendingProductId: slide.trendingProductId
    });
  };

  const handleSaveSlide = (id: number) => {
    const updated = slides.map(s => s.id === id ? { ...s, ...slideForm } : s);
    setSlides(updated);
    localStorage.setItem("luce_slides", JSON.stringify(updated));
    setEditingSlideId(null);
    toast.success(`Hero Slide #${id} updated and published!`);
  };

  // Product Manager Handlers
  const handleAddProductClick = () => {
    setEditingProductId(null);
    setProductForm({
      name: "",
      price: 0,
      image: "",
      description: "",
      colorsStr: "#A38D7D, #111111",
      colorNamesStr: "Beige, Black"
    });
    setShowProductModal(true);
  };

  const handleEditProductClick = (p: typeof defaultProducts[0]) => {
    setEditingProductId(p.id);
    setProductForm({
      name: p.name,
      price: p.price,
      image: p.image,
      description: p.description,
      colorsStr: p.colors.join(", "),
      colorNamesStr: p.colorNames.join(", ")
    });
    setShowProductModal(true);
  };

  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productForm.name || !productForm.image) {
      toast.error("Please fill in all required fields.");
      return;
    }

    const colors = productForm.colorsStr.split(",").map(c => c.trim()).filter(Boolean);
    const colorNames = productForm.colorNamesStr.split(",").map(c => c.trim()).filter(Boolean);

    if (editingProductId) {
      // Edit mode
      const updated = products.map(p => p.id === editingProductId ? {
        ...p,
        name: productForm.name,
        price: Number(productForm.price),
        priceStr: `$${Number(productForm.price).toFixed(2)}`,
        image: productForm.image,
        description: productForm.description,
        colors,
        colorNames
      } : p);
      setProducts(updated);
      localStorage.setItem("luce_products", JSON.stringify(updated));
      toast.success("Product updated successfully!");
    } else {
      // Add mode
      const newId = productForm.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      const newProduct = {
        id: newId,
        name: productForm.name,
        price: Number(productForm.price),
        priceStr: `$${Number(productForm.price).toFixed(2)}`,
        image: productForm.image,
        description: productForm.description,
        colors: colors.length > 0 ? colors : ["#FAF8F5"],
        colorNames: colorNames.length > 0 ? colorNames : ["White"]
      };
      const updated = [...products, newProduct];
      setProducts(updated);
      localStorage.setItem("luce_products", JSON.stringify(updated));
      toast.success("New product added to catalog!");
    }
    setShowProductModal(false);
  };

  const handleDeleteProduct = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}" from the store catalog?`)) {
      const updated = products.filter(p => p.id !== id);
      setProducts(updated);
      localStorage.setItem("luce_products", JSON.stringify(updated));
      toast.info(`Product "${name}" deleted`);
    }
  };

  // Render Login Panel
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center p-6 select-none relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 w-64 h-64 bg-amber-100/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-stone-200/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-white border border-stone-200/80 rounded-[30px] p-8 shadow-xl relative z-10 text-center animate-fade-in">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-stone-900 flex items-center justify-center text-white mb-4 shadow-md">
              <Lock size={28} className="stroke-[1.5]" />
            </div>
            <h1 className="font-serif text-3xl font-bold tracking-[0.05em] text-stone-900 leading-tight">LUCE BY LUCY</h1>
            <span className="text-[10px] tracking-[0.2em] font-semibold text-stone-400 uppercase mt-1">Control Dashboard</span>
          </div>

          <p className="text-stone-500 font-light text-sm leading-relaxed mb-8">
            Access to this administrative workspace is restricted. Please sign in with your store Google account credentials to proceed.
          </p>

          <button 
            onClick={handleGoogleLoginClick}
            className="w-full bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 font-sans font-semibold text-xs tracking-wider uppercase h-12 rounded-full flex items-center justify-center gap-3 active:scale-98 transition-all shadow-sm"
          >
            {/* Google Logo SVG */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign In with Google
          </button>

          <div className="w-full h-[1px] bg-stone-200/50 my-6" />
          
          <Link to="/" className="text-[10px] font-bold text-stone-500 hover:text-stone-900 flex items-center justify-center gap-1.5 tracking-wider uppercase">
            <Globe size={11} /> Return to Storefront
          </Link>
        </div>

        {/* GOOGLE OAUTH POPUP SIMULATOR MODAL */}
        {showGooglePopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in">
            {/* Pop-up Window Box */}
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden text-left flex flex-col justify-between h-[480px]">
              
              {/* Fake Browser Top Bar */}
              <div className="bg-stone-100 border-b border-stone-200 px-4 py-2.5 flex items-center justify-between">
                <span className="text-[10px] text-stone-500 font-semibold truncate">Sign in - Google Accounts</span>
                <button onClick={() => setShowGooglePopup(false)} className="text-stone-400 hover:text-stone-700">
                  <X size={14} />
                </button>
              </div>

              {/* Popup Content */}
              {googleStep === 0 ? (
                // Step 0: Account Selection
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-center mb-4">
                      {/* Google G Logo */}
                      <svg className="w-8 h-8" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                      </svg>
                    </div>

                    <h2 className="text-center font-sans font-bold text-stone-900 text-lg">Choose an account</h2>
                    <p className="text-center text-stone-400 text-[10px] mt-1">to continue to <span className="font-semibold text-stone-600">lucebylucy.online</span></p>

                    {/* Accounts list */}
                    <div className="mt-6 divide-y divide-stone-100 border-y border-stone-100">
                      
                      <div 
                        onClick={() => handleChooseAccount("Luce Admin", "admin@lucebylucy.online")}
                        className="py-3 flex items-center gap-3.5 hover:bg-stone-50 cursor-pointer transition-colors px-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-stone-900 text-stone-100 flex items-center justify-center font-bold text-xs">LA</div>
                        <div>
                          <p className="text-xs font-bold text-stone-800 leading-none">Luce Admin</p>
                          <span className="text-[10px] text-stone-400">admin@lucebylucy.online</span>
                        </div>
                      </div>

                      <div 
                        onClick={() => handleChooseAccount("Lucy Storefront", "lucy@lucebylucy.online")}
                        className="py-3 flex items-center gap-3.5 hover:bg-stone-50 cursor-pointer transition-colors px-2"
                      >
                        <div className="w-8 h-8 rounded-full bg-amber-800 text-stone-100 flex items-center justify-center font-bold text-xs">LS</div>
                        <div>
                          <p className="text-xs font-bold text-stone-800 leading-none">Lucy Storefront</p>
                          <span className="text-[10px] text-stone-400">lucy@lucebylucy.online</span>
                        </div>
                      </div>

                    </div>
                  </div>

                  <p className="text-[9px] text-stone-400 font-light leading-relaxed">
                    To continue, Google will share your name, email address, language preference, and profile picture with Luce by Lucy.
                  </p>
                </div>
              ) : (
                // Step 1: Simulated Loading Handshake
                <div className="p-6 flex-1 flex flex-col items-center justify-center text-center">
                  <div className="w-10 h-10 border-[3px] border-stone-200 border-t-[#4285F4] rounded-full animate-spin mb-4" />
                  <p className="text-xs font-bold text-stone-700 uppercase tracking-widest">Verifying Account...</p>
                  <span className="text-[10px] text-stone-400 font-light mt-1">Connecting Google Authorization Tokens</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F6F4F0] flex text-stone-900 font-sans select-none antialiased">
      
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-64 bg-stone-900 text-stone-300 flex flex-col justify-between sticky top-0 h-screen p-6 shadow-xl z-20">
        <div>
          {/* Brand Logo inside Sidebar */}
          <div className="flex flex-col text-left mb-10 pb-4 border-b border-stone-850">
            <span className="font-serif text-lg font-bold tracking-[0.25em] text-white leading-tight">LUCE</span>
            <span className="font-sans text-[8px] tracking-[0.35em] text-stone-500 font-bold -mt-0.5">BY LUCY ADMIN</span>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1.5">
            <button 
              onClick={() => setActiveTab("dashboard")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "dashboard" 
                  ? "bg-white text-stone-900 shadow-md" 
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              <LayoutDashboard size={16} />
              Dashboard Home
            </button>
            
            <button 
              onClick={() => setActiveTab("slider")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "slider" 
                  ? "bg-white text-stone-900 shadow-md" 
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              <Sliders size={16} />
              Hero Slider Editor
            </button>

            <button 
              onClick={() => setActiveTab("products")}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors ${
                activeTab === "products" 
                  ? "bg-white text-stone-900 shadow-md" 
                  : "text-stone-400 hover:text-white hover:bg-stone-800"
              }`}
            >
              <Package size={16} />
              Daftar Barang
            </button>
          </nav>
        </div>

        {/* User profile footer inside Sidebar */}
        <div className="flex flex-col border-t border-stone-850 pt-5 mt-auto gap-4">
          {user && (
            <div className="flex items-center gap-3">
              <img src={user.avatar} className="w-8 h-8 rounded-full border border-stone-700 shadow-sm" alt="User avatar" />
              <div className="text-left min-w-0">
                <p className="text-xs font-bold text-white leading-tight truncate">{user.name}</p>
                <span className="text-[9px] text-stone-400 truncate block mt-0.5">{user.email}</span>
              </div>
            </div>
          )}

          <button 
            onClick={handleLogout}
            className="flex items-center justify-center gap-2 w-full border border-stone-700 hover:border-red-500 hover:text-red-400 text-stone-400 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
          >
            <LogOut size={14} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-y-auto">
        
        {/* Admin Header */}
        <header className="bg-white border-b border-stone-200 px-8 py-5 flex items-center justify-between sticky top-0 z-10 shadow-xs">
          <div className="text-left">
            <h2 className="text-lg font-bold text-stone-850">
              {activeTab === "dashboard" && "Dashboard Overview"}
              {activeTab === "slider" && "Hero Slider Configuration"}
              {activeTab === "products" && "Product Inventory Management"}
            </h2>
            <span className="text-[10px] text-stone-400 mt-0.5 block">
              Manage store content and products in real-time
            </span>
          </div>

          <Link 
            to="/" 
            className="flex items-center gap-1.5 border border-stone-300 hover:bg-stone-50 text-stone-750 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-inner"
          >
            <Globe size={14} />
            Visit Live Store
          </Link>
        </header>

        {/* Main Dashboard Screens */}
        <main className="flex-1 p-8">
          
          {/* 1. DASHBOARD HOME VIEW */}
          {activeTab === "dashboard" && (
            <div className="animate-fade-in flex flex-col gap-8 text-left">
              {/* welcome message */}
              <div className="bg-white border border-stone-200/80 rounded-3xl p-6 shadow-sm flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-stone-900 text-stone-50 flex items-center justify-center font-bold text-lg">
                  👋
                </div>
                <div>
                  <h3 className="font-serif text-xl font-bold">Hello, {user?.name}!</h3>
                  <p className="text-xs text-stone-400 mt-1 font-light">Welcome to the administrative portal. Changes made in the editor screens are instantly synced and published.</p>
                </div>
              </div>

              {/* Stats panel */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28 cursor-pointer" onClick={() => setActiveTab("products")}>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Total Inventory Items</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-stone-900">{products.length}</span>
                    <span className="text-[10px] text-stone-400 font-light">Products Listed</span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28 cursor-pointer" onClick={() => setActiveTab("slider")}>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Hero Carousel Slides</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-stone-900">{slides.length}</span>
                    <span className="text-[10px] text-stone-400 font-light">Banner Configurations</span>
                  </div>
                </div>

                <div className="bg-white border border-stone-200/80 p-5 rounded-2xl shadow-sm flex flex-col justify-between h-28">
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Active Simulator Sessions</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-extrabold text-stone-900">1</span>
                    <span className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider">Live</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 2. HERO SLIDER EDITOR VIEW */}
          {activeTab === "slider" && (
            <div className="animate-fade-in flex flex-col gap-6 text-left">
              {slides.map((slide) => (
                <div key={slide.id} className="bg-white border border-stone-200/85 rounded-3xl p-6 shadow-sm">
                  {editingSlideId === slide.id ? (
                    // Slide Editing Mode Form
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* image preview column */}
                      <div className="w-full md:w-1/3 flex flex-col gap-3">
                        <span className="text-[9px] font-bold text-stone-400 uppercase tracking-widest block">Slide Image Preview</span>
                        <div className="aspect-[4/3] rounded-2xl bg-stone-50 border border-stone-200 overflow-hidden shadow-inner">
                          <img src={slideForm.image || slide.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                        
                        <div className="flex flex-col gap-1.5 mt-2">
                          <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Image URL</label>
                          <input 
                            type="text" 
                            value={slideForm.image}
                            onChange={(e) => setSlideForm({ ...slideForm, image: e.target.value })}
                            className="border border-stone-250 p-2.5 rounded-xl text-xs font-medium focus:outline-stone-500 w-full"
                            placeholder="Enter image URL"
                          />
                        </div>
                      </div>

                      {/* form data column */}
                      <div className="flex-1 flex flex-col gap-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Eyebrow (Subtitle)</label>
                            <input 
                              type="text" 
                              value={slideForm.eyebrow}
                              onChange={(e) => setSlideForm({ ...slideForm, eyebrow: e.target.value })}
                              className="border border-stone-250 p-2.5 rounded-xl text-xs font-medium focus:outline-stone-500 w-full"
                              placeholder="e.g. New Collection"
                            />
                          </div>

                          <div className="flex flex-col gap-1.5">
                            <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Linked Trending Product</label>
                            <select 
                              value={slideForm.trendingProductId}
                              onChange={(e) => setSlideForm({ ...slideForm, trendingProductId: e.target.value })}
                              className="border border-stone-250 p-2.5 rounded-xl text-xs font-semibold focus:outline-stone-500 w-full bg-white"
                            >
                              {products.map(p => (
                                <option key={p.id} value={p.id}>{p.name} (${p.price.toFixed(2)})</option>
                              ))}
                            </select>
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Headline</label>
                          <input 
                            type="text" 
                            value={slideForm.headline}
                            onChange={(e) => setSlideForm({ ...slideForm, headline: e.target.value })}
                            className="border border-stone-250 p-2.5 rounded-xl text-xs font-semibold focus:outline-stone-500 w-full"
                            placeholder="e.g. Elevate Your Style!"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Description</label>
                          <textarea 
                            rows={3}
                            value={slideForm.description}
                            onChange={(e) => setSlideForm({ ...slideForm, description: e.target.value })}
                            className="border border-stone-250 p-2.5 rounded-xl text-xs font-medium focus:outline-stone-500 w-full resize-none"
                            placeholder="Describe this slide collection..."
                          />
                        </div>

                        <div className="flex items-center gap-3 mt-4">
                          <button 
                            onClick={() => handleSaveSlide(slide.id)}
                            className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans font-bold text-[10px] tracking-widest uppercase h-9 px-6 rounded-xl transition-colors shadow-sm"
                          >
                            Save slide
                          </button>
                          <button 
                            onClick={() => setEditingSlideId(null)}
                            className="border border-stone-300 hover:bg-stone-50 text-stone-600 font-sans font-bold text-[10px] tracking-widest uppercase h-9 px-6 rounded-xl transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // Slide Display Mode
                    <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
                      <div className="flex flex-col md:flex-row gap-4 items-center w-full md:w-3/4">
                        <img src={slide.image} alt={slide.headline} className="w-24 h-20 object-cover rounded-xl shadow-sm border border-stone-200" />
                        <div className="text-left min-w-0 flex-1">
                          <span className="text-[9px] font-bold text-amber-800 uppercase tracking-widest block">{slide.eyebrow}</span>
                          <h4 className="font-serif text-lg font-bold text-stone-850 mt-1 truncate">{slide.headline}</h4>
                          <p className="text-xs text-stone-400 mt-1 truncate max-w-lg font-light">{slide.description}</p>
                          <div className="flex items-center gap-1.5 mt-2">
                            <span className="text-[8px] bg-stone-100 border border-stone-200/50 rounded-full py-0.5 px-2 font-bold text-stone-500 uppercase tracking-wider">
                              Trending Product: {products.find(p => p.id === slide.trendingProductId)?.name || "Unknown"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <button 
                        onClick={() => handleEditSlide(slide)}
                        className="flex items-center gap-2 border border-stone-300 hover:bg-stone-50 text-stone-700 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors shadow-inner w-full md:w-auto justify-center"
                      >
                        <Edit2 size={12} />
                        Edit Slide
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* 3. PRODUCT CATALOG EDITOR VIEW (DAFTAR BARANG) */}
          {activeTab === "products" && (
            <div className="animate-fade-in flex flex-col gap-6 text-left">
              {/* Titlebar with Add Button */}
              <div className="flex items-center justify-between bg-white border border-stone-200/60 p-4 rounded-2xl shadow-sm">
                <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">Catalog Inventory ({products.length} listed)</span>
                <button 
                  onClick={handleAddProductClick}
                  className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-stone-50 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md active:scale-98 cursor-pointer"
                >
                  <PlusCircle size={14} />
                  Add New Product
                </button>
              </div>

              {/* Inventory Table Card */}
              <div className="bg-white border border-stone-200/80 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                        <th className="py-4 px-6">Product</th>
                        <th className="py-4 px-6">Price</th>
                        <th className="py-4 px-6">Colors</th>
                        <th className="py-4 px-6">Description</th>
                        <th className="py-4 px-6 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200/50 text-xs">
                      {products.map((p) => (
                        <tr key={p.id} className="hover:bg-stone-50/50 transition-colors">
                          <td className="py-4 px-6 flex items-center gap-3.5 min-w-[200px]">
                            <img src={p.image} alt={p.name} className="w-10 h-12 object-cover rounded-xl bg-stone-100 border border-stone-200/40" />
                            <div className="text-left min-w-0">
                              <span className="font-bold text-stone-850 block truncate">{p.name}</span>
                              <span className="text-[10px] text-stone-400 truncate block mt-0.5">ID: {p.id}</span>
                            </div>
                          </td>
                          <td className="py-4 px-6 font-bold text-stone-900">${p.price.toFixed(2)}</td>
                          <td className="py-4 px-6 min-w-[120px]">
                            <div className="flex gap-1.5 flex-wrap">
                              {p.colors.map((color, i) => (
                                <span 
                                  key={color} 
                                  title={p.colorNames[i]}
                                  className="px-2 py-0.5 rounded-full border border-stone-200/80 text-[8px] font-semibold text-stone-500 flex items-center gap-1 bg-stone-100"
                                >
                                  <span style={{ backgroundColor: color }} className="w-1.5 h-1.5 rounded-full inline-block border border-stone-400/20" />
                                  {p.colorNames[i]}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 px-6 text-stone-400 font-light max-w-sm truncate">{p.description}</td>
                          <td className="py-4 px-6 text-right">
                            <div className="flex justify-end gap-2">
                              <button 
                                onClick={() => handleEditProductClick(p)}
                                className="p-2 border border-stone-200 hover:bg-stone-50 text-stone-600 rounded-xl transition-colors cursor-pointer"
                                title="Edit Product"
                              >
                                <Edit2 size={13} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(p.id, p.name)}
                                className="p-2 border border-stone-200 hover:border-red-200 hover:bg-red-50 text-red-500 rounded-xl transition-colors cursor-pointer"
                                title="Delete Product"
                              >
                                <Trash2 size={13} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </main>
      </div>

      {/* PRODUCT FORM ADD / EDIT DIALOG */}
      {showProductModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-fade-in text-left">
          <form 
            onSubmit={handleSaveProduct}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col justify-between"
          >
            <div className="px-6 py-5 border-b border-stone-200/60 flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold tracking-wide">
                {editingProductId ? "Edit Product Details" : "Add New Store Product"}
              </h3>
              <button 
                type="button" 
                onClick={() => setShowProductModal(false)} 
                className="text-stone-400 hover:text-stone-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4 overflow-y-auto max-h-[420px]">
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Product Name *</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="border border-stone-250 p-2.5 rounded-xl text-xs font-medium focus:outline-stone-500 w-full"
                    placeholder="e.g. Linen Scarf"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Price ($ USD) *</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    required
                    value={productForm.price || ""}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="border border-stone-250 p-2.5 rounded-xl text-xs font-semibold focus:outline-stone-500 w-full"
                    placeholder="e.g. 49.99"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Image URL *</label>
                <input 
                  type="text" 
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  className="border border-stone-250 p-2.5 rounded-xl text-xs font-medium focus:outline-stone-500 w-full"
                  placeholder="Paste Unsplash image URL"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Colors (Comma separated HEX) *</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.colorsStr}
                    onChange={(e) => setProductForm({ ...productForm, colorsStr: e.target.value })}
                    className="border border-stone-250 p-2.5 rounded-xl text-xs font-semibold focus:outline-stone-500 w-full"
                    placeholder="e.g. #A38D7D, #111111"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Color Names (Comma separated) *</label>
                  <input 
                    type="text" 
                    required
                    value={productForm.colorNamesStr}
                    onChange={(e) => setProductForm({ ...productForm, colorNamesStr: e.target.value })}
                    className="border border-stone-250 p-2.5 rounded-xl text-xs font-medium focus:outline-stone-500 w-full"
                    placeholder="e.g. Beige, Black"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[9px] font-bold text-stone-400 uppercase tracking-widest">Product Description</label>
                <textarea 
                  rows={3}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="border border-stone-250 p-2.5 rounded-xl text-xs font-medium focus:outline-stone-500 w-full resize-none"
                  placeholder="Detail information about materials, fitting, and style..."
                />
              </div>

            </div>

            <div className="px-6 py-4 border-t border-stone-150 bg-stone-50 flex items-center justify-end gap-3">
              <button 
                type="button" 
                onClick={() => setShowProductModal(false)}
                className="border border-stone-300 hover:bg-stone-100 text-stone-600 font-sans font-bold text-[10px] tracking-widest uppercase h-9 px-6 rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="bg-stone-900 hover:bg-stone-800 text-stone-50 font-sans font-bold text-[10px] tracking-widest uppercase h-9 px-6 rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Save Product
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}

export default App;