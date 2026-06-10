import { useState } from "react";
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
  SlidersHorizontal,
  Plus,
  Minus,
  X,
  Check,
  Menu,
  ChevronLeft,
  Share2,
  Star,
  CheckCircle2,
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

const categories = ["Dresses", "Tops", "Bags", "Shoes"];

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  colorName: string;
}

interface PhoneState {
  screen: "home" | "shop" | "detail" | "bag";
  selectedProductId: string;
}

function App() {
  // Global cart and wishlist states
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
    },
    {
      id: "ankle-boots",
      name: "Ankle Boots",
      price: 109.99,
      image: products[3].image,
      quantity: 1,
      color: "#C5A880",
      colorName: "Sand"
    }
  ]);
  const [wishlist, setWishlist] = useState<string[]>(["leather-handbag"]);

  // Mobile simulation states for each of the 4 phones
  const [phone1, setPhone1] = useState<PhoneState>({ screen: "home", selectedProductId: "oversized-blazer" });
  const [phone2, setPhone2] = useState<PhoneState>({ screen: "shop", selectedProductId: "oversized-blazer" });
  const [phone3, setPhone3] = useState<PhoneState>({ screen: "detail", selectedProductId: "leather-handbag" });
  const [phone4, setPhone4] = useState<PhoneState>({ screen: "bag", selectedProductId: "oversized-blazer" });

  // Mobile product page custom configurator states (simulate active edits inside Phone 3)
  const [phone3Qty, setPhone3Qty] = useState(1);
  const [phone3ColorIdx, setPhone3ColorIdx] = useState(0);

  // Mobile order success states
  const [phone1Success, setPhone1Success] = useState(false);
  const [phone2Success, setPhone2Success] = useState(false);
  const [phone3Success, setPhone3Success] = useState(false);
  const [phone4Success, setPhone4Success] = useState(false);

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
  const addToCart = (product: typeof products[0], colorCode: string, colorName: string, qty: number = 1) => {
    const existing = cart.find(item => item.id === product.id && item.color === colorCode);
    if (existing) {
      setCart(cart.map(item => 
        (item.id === product.id && item.color === colorCode)
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
        color: colorCode,
        colorName: colorName
      }]);
    }
    toast.success(`Added ${qty}x ${product.name} (${colorName}) to Shopping Bag!`);
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

  // Handle phone screen changes
  const handlePhoneNavigation = (phoneId: number, screen: PhoneState["screen"], productId?: string) => {
    const prodId = productId || "oversized-blazer";
    if (phoneId === 1) {
      setPhone1({ screen, selectedProductId: prodId });
    } else if (phoneId === 2) {
      setPhone2({ screen, selectedProductId: prodId });
    } else if (phoneId === 3) {
      setPhone3({ screen, selectedProductId: prodId });
      // Reset details configuration
      const prod = products.find(p => p.id === prodId);
      setPhone3Qty(1);
      setPhone3ColorIdx(0);
    } else if (phoneId === 4) {
      setPhone4({ screen, selectedProductId: prodId });
    }
  };

  const handlePhoneCheckout = (phoneId: number) => {
    if (phoneId === 1) {
      setPhone1Success(true);
      setTimeout(() => { setPhone1Success(false); handlePhoneNavigation(1, "home"); setCart([]); }, 3000);
    } else if (phoneId === 2) {
      setPhone2Success(true);
      setTimeout(() => { setPhone2Success(false); handlePhoneNavigation(2, "shop"); setCart([]); }, 3000);
    } else if (phoneId === 3) {
      setPhone3Success(true);
      setTimeout(() => { setPhone3Success(false); handlePhoneNavigation(3, "detail", "leather-handbag"); setCart([]); }, 3000);
    } else if (phoneId === 4) {
      setPhone4Success(true);
      setTimeout(() => { setPhone4Success(false); handlePhoneNavigation(4, "bag"); setCart([]); }, 3000);
    }
    toast.success("Order Placed! Simulating secure checkout...");
  };

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans selection:bg-stone-200 antialiased pb-20">
      <Toaster position="bottom-right" richColors />
      
      {/* 1. Header (Desktop Layout) */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between border-b border-stone-200/60 sticky top-0 bg-[#FAF7F2]/90 backdrop-blur-md z-40">
        <div className="flex flex-col text-left">
          <span className="font-serif text-2xl font-bold tracking-[0.18em] leading-tight">LUCE</span>
          <span className="font-sans text-[9px] tracking-[0.35em] text-stone-500 font-semibold -mt-0.5">BY LUCY</span>
        </div>

        <nav className="hidden md:flex items-center gap-10 text-[11px] tracking-[0.25em] font-semibold text-stone-500 uppercase">
          <a href="#home" className="text-stone-900 font-bold border-b-2 border-stone-900 pb-1 translate-y-0.5">Home</a>
          <a href="#shop" className="hover:text-stone-900 transition-colors">Shop</a>
          <a href="#collections" className="hover:text-stone-900 transition-colors">Collections</a>
          <a href="#new-arrivals" className="hover:text-stone-900 transition-colors">New Arrivals</a>
          <a href="#about" className="hover:text-stone-900 transition-colors">About Us</a>
          <a href="#contact" className="hover:text-stone-900 transition-colors">Contact</a>
        </nav>

        <div className="flex items-center gap-6 text-stone-700">
          <button aria-label="Search" className="hover:text-stone-900 transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button aria-label="User Account" className="hover:text-stone-900 transition-colors">
            <User size={20} strokeWidth={1.5} />
          </button>
          <button aria-label="Shopping Bag" className="relative hover:text-stone-900 transition-colors" onClick={() => handlePhoneNavigation(4, "bag")}>
            <ShoppingBag size={20} strokeWidth={1.5} />
            {getCartCount() > 0 && (
              <span className="absolute -top-2 -right-2 bg-stone-900 text-[#FAF7F2] font-sans font-bold text-[9px] w-[18px] h-[18px] rounded-full flex items-center justify-center scale-90 animate-fade-in">
                {getCartCount()}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 2. Hero Section */}
      <section id="home" className="max-w-7xl mx-auto px-6 md:px-12 pt-8 md:pt-16 pb-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Hero Left Content */}
        <div className="lg:col-span-5 flex flex-col justify-center text-left">
          <span className="text-[10px] tracking-[0.3em] font-bold text-amber-800 uppercase mb-3 block">
            New Collection
          </span>
          <h1 className="font-serif text-5xl md:text-[66px] leading-[1.08] font-light text-stone-900 tracking-tight">
            Elevate Your Style,<br />Embrace Elegance.
          </h1>
          <p className="text-stone-600 font-light mt-5 mb-8 text-base md:text-lg leading-relaxed max-w-md">
            Discover timeless fashion pieces crafted for the modern woman.
          </p>

          <div className="flex items-center gap-4">
            <a 
              href="#mobile-mockups"
              className="pulse-btn bg-stone-900 text-stone-50 font-sans font-medium text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-full hover:bg-stone-800 shadow-md hover:shadow-lg transition-all"
            >
              Shop Now
            </a>
            <a 
              href="#new-arrivals"
              className="border border-stone-300 text-stone-800 font-sans font-medium text-xs tracking-[0.2em] uppercase px-8 py-3.5 rounded-full hover:bg-stone-100/40 transition-all"
            >
              View Collection
            </a>
          </div>

          {/* Hero Bottom Trust Badges (Compact) */}
          <div className="border-t border-stone-200 mt-16 pt-6 grid grid-cols-3 gap-4 text-left">
            <div className="flex flex-col">
              <span className="font-bold text-[10px] tracking-wider uppercase text-stone-800">Free Shipping</span>
              <span className="text-[9px] text-stone-500 font-light mt-0.5">On orders over $99</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[10px] tracking-wider uppercase text-stone-800">Easy Returns</span>
              <span className="text-[9px] text-stone-500 font-light mt-0.5">30-day return policy</span>
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-[10px] tracking-wider uppercase text-stone-800">Secure Payment</span>
              <span className="text-[9px] text-stone-500 font-light mt-0.5">100% secure checkout</span>
            </div>
          </div>
        </div>

        {/* Hero Right Visuals */}
        <div className="lg:col-span-7 relative flex justify-center lg:justify-end">
          <div className="relative w-full max-w-lg lg:max-w-xl aspect-[4/5] overflow-hidden rounded-[40px] shadow-2xl">
            <img 
              src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=85" 
              alt="Model in elegant cream blazer suit" 
              className="w-full h-full object-cover object-top hover:scale-[1.03] transition-transform duration-700 ease-out"
            />
            
            {/* Ambient Leaf shadows overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-stone-900/10 via-transparent to-transparent pointer-events-none" />
          </div>

          {/* Floating Trending Overly Card */}
          <div className="animate-float absolute bottom-8 left-4 md:left-8 bg-white/75 backdrop-blur-xl border border-white/40 p-4 rounded-3xl shadow-xl flex items-center gap-4 max-w-[270px]">
            <img 
              src={products[1].image} 
              alt="Minimal handbag" 
              className="w-14 h-14 object-cover rounded-2xl bg-stone-100 shadow-inner"
            />
            <div className="text-left">
              <span className="text-[8px] font-bold tracking-[0.2em] text-stone-400 uppercase block">Trending Now</span>
              <h4 className="font-sans font-bold text-[11px] text-stone-800 truncate max-w-[130px]">{products[1].name}</h4>
              <p className="font-semibold text-[10px] text-stone-900 mt-0.5">{products[1].priceStr}</p>
              <button 
                onClick={() => handlePhoneNavigation(3, "detail", "leather-handbag")}
                className="text-[9px] font-bold text-stone-800 hover:text-stone-900 flex items-center gap-1 mt-1 tracking-wider uppercase"
              >
                Shop Now <ArrowRight size={10} className="stroke-[2.5]" />
              </button>
            </div>
          </div>
        </div>
      </section>

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
                href="#mobile-mockups"
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
                  <div 
                    onClick={() => handlePhoneNavigation(3, "detail", product.id)}
                    className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-stone-100 shadow-sm cursor-pointer mb-3"
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500 ease-out"
                    />
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

      {/* 4. Mobile Showcase Section */}
      <section id="mobile-mockups" className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-stone-200/50">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-[10px] tracking-[0.3em] font-bold text-amber-800 uppercase mb-2 block">Interactive Simulator</span>
          <h2 className="font-serif text-4xl font-light tracking-tight mb-4">Mobile App Showcase</h2>
          <p className="text-stone-500 font-light text-sm leading-relaxed">
            Click elements on the mobile phone mockups below to test the shopping cart and checkout interactions in real-time.
          </p>
        </div>

        {/* 4 Phones Showcase Grid */}
        <div className="flex flex-wrap justify-center gap-8 xl:gap-10">
          
          {/* PHONE 1: HOME SCREEN */}
          <div className="flex flex-col items-center">
            <span className="text-stone-400 text-xs font-bold tracking-widest uppercase mb-4">1. Home Screen</span>
            <div className="phone-mockup">
              <div className="phone-notch" />
              <div className="phone-screen no-scrollbar pt-10 pb-6">
                
                {/* Simulated App Header */}
                <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-white/80 sticky top-0 backdrop-blur-sm z-30">
                  <Menu size={16} className="text-stone-600" />
                  <div className="flex flex-col text-center">
                    <span className="font-serif text-sm font-bold tracking-widest leading-none">LUCE</span>
                    <span className="font-sans text-[6px] tracking-widest text-stone-500 font-bold -mt-0.5">BY LUCY</span>
                  </div>
                  <ShoppingBag size={16} className="text-stone-600" onClick={() => handlePhoneNavigation(1, "bag")} />
                </div>

                {/* Simulated Success State */}
                {phone1Success && (
                  <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <CheckCircle2 size={48} className="text-emerald-500 animate-bounce mb-3" />
                    <h4 className="font-serif text-lg font-bold">Order Confirmed!</h4>
                    <p className="text-stone-500 text-xs mt-1">Thank you for your purchase.</p>
                  </div>
                )}

                {/* Phone 1 Screen Routing */}
                {phone1.screen === "home" && (
                  <div className="animate-fade-in text-left">
                    {/* Hero Slide Banner */}
                    <div className="relative aspect-[4/3] bg-stone-100 overflow-hidden">
                      <img 
                        src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=600&q=80" 
                        alt="Mobile Banner"
                        className="w-full h-full object-cover object-top"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-stone-900/20 to-transparent flex flex-col justify-end p-4">
                        <span className="text-[7px] tracking-widest font-bold text-amber-300 uppercase">New Collection</span>
                        <h3 className="font-serif text-sm text-white font-light tracking-wide mt-1 leading-snug">
                          Elevate Your Style,<br />Embrace Elegance.
                        </h3>
                        <button 
                          onClick={() => handlePhoneNavigation(1, "shop")}
                          className="mt-2 bg-white text-stone-900 font-sans font-bold text-[8px] tracking-wider uppercase py-1.5 px-3 rounded-full self-start hover:bg-stone-100 transition-colors"
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>

                    {/* Categories Row */}
                    <div className="px-4 py-5">
                      <span className="text-[9px] font-bold tracking-wider uppercase text-stone-800 block mb-3">Categories</span>
                      <div className="flex justify-between">
                        {categories.map((cat, i) => (
                          <div 
                            key={cat} 
                            onClick={() => handlePhoneNavigation(1, "shop")}
                            className="flex flex-col items-center cursor-pointer group"
                          >
                            <div className="w-12 h-12 rounded-full bg-stone-100 border border-stone-200/50 flex items-center justify-center text-[10px] shadow-sm group-hover:bg-stone-50 transition-colors">
                              {i === 0 ? "👗" : i === 1 ? "👚" : i === 2 ? "👜" : "👠"}
                            </div>
                            <span className="text-[8px] font-semibold text-stone-500 mt-1.5">{cat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* New Arrivals Grid (2 Items) */}
                    <div className="px-4 pb-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[9px] font-bold tracking-wider uppercase text-stone-800">New Arrivals</span>
                        <span 
                          onClick={() => handlePhoneNavigation(1, "shop")}
                          className="text-[8px] font-bold text-stone-500 cursor-pointer hover:underline"
                        >
                          View All
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        {products.slice(0, 2).map((product) => (
                          <div 
                            key={product.id} 
                            onClick={() => handlePhoneNavigation(1, "detail", product.id)}
                            className="flex flex-col cursor-pointer"
                          >
                            <img src={product.image} className="aspect-[3/4] object-cover rounded-xl shadow-sm bg-stone-50" />
                            <span className="text-[9px] font-semibold text-stone-700 mt-1.5 truncate">{product.name}</span>
                            <span className="text-[8px] font-bold text-stone-900 mt-0.5">{product.priceStr}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                )}

                {/* Nested Screen Layouts inside Phone 1 */}
                {phone1.screen === "shop" && <PhoneShopView phoneId={1} onSelectProduct={(id) => handlePhoneNavigation(1, "detail", id)} />}
                {phone1.screen === "detail" && (
                  <PhoneDetailView 
                    phoneId={1} 
                    productId={phone1.selectedProductId} 
                    onBack={() => handlePhoneNavigation(1, "home")} 
                    onAddToCart={(p, code, name, q) => addToCart(p, code, name, q)}
                    onBuyNow={() => handlePhoneCheckout(1)}
                  />
                )}
                {phone1.screen === "bag" && (
                  <PhoneBagView 
                    phoneId={1} 
                    cart={cart} 
                    onBack={() => handlePhoneNavigation(1, "home")} 
                    onRemove={(id, c, name) => removeFromCart(id, c, name)} 
                    onQtyChange={(id, c, ch) => updateCartQty(id, c, ch)} 
                    onCheckout={() => handlePhoneCheckout(1)}
                  />
                )}

              </div>
              <div className="phone-home-indicator" />
            </div>
          </div>

          {/* PHONE 2: SHOP SCREEN */}
          <div className="flex flex-col items-center">
            <span className="text-stone-400 text-xs font-bold tracking-widest uppercase mb-4">2. Shop Screen</span>
            <div className="phone-mockup">
              <div className="phone-notch" />
              <div className="phone-screen no-scrollbar pt-10 pb-6">
                
                {/* Simulated Success State */}
                {phone2Success && (
                  <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <CheckCircle2 size={48} className="text-emerald-500 animate-bounce mb-3" />
                    <h4 className="font-serif text-lg font-bold">Order Confirmed!</h4>
                    <p className="text-stone-500 text-xs mt-1">Thank you for your purchase.</p>
                  </div>
                )}

                {/* Phone 2 Screen Routing */}
                {phone2.screen === "shop" && (
                  <div className="animate-fade-in text-left">
                    {/* Header */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-white/80 sticky top-0 backdrop-blur-sm z-30">
                      <ChevronLeft size={16} className="text-stone-600 cursor-pointer" onClick={() => handlePhoneNavigation(2, "shop")} />
                      <span className="text-[10px] tracking-widest font-bold uppercase text-stone-850">Shop</span>
                      <ShoppingBag size={16} className="text-stone-600 cursor-pointer" onClick={() => handlePhoneNavigation(2, "bag")} />
                    </div>

                    {/* Filter and Sort bar */}
                    <div className="px-4 py-2 flex items-center justify-between border-b border-stone-100 bg-stone-50/50 text-[8px] font-bold text-stone-500 uppercase tracking-wider">
                      <span className="flex items-center gap-1"><SlidersHorizontal size={8} /> Filter</span>
                      <span className="w-[1px] h-3 bg-stone-250" />
                      <span>Sort</span>
                    </div>

                    {/* Catalog Grid */}
                    <div className="px-4 py-4 grid grid-cols-2 gap-4">
                      {products.map((product) => (
                        <div 
                          key={product.id} 
                          onClick={() => handlePhoneNavigation(2, "detail", product.id)}
                          className="flex flex-col cursor-pointer"
                        >
                          <div className="relative">
                            <img src={product.image} className="aspect-[3/4] object-cover rounded-xl shadow-sm bg-stone-50" />
                            <button 
                              onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id, product.name); }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/80 flex items-center justify-center shadow-sm"
                            >
                              <Heart size={10} className={wishlist.includes(product.id) ? "fill-red-500 stroke-red-500" : "stroke-stone-700"} />
                            </button>
                          </div>
                          <span className="text-[9px] font-semibold text-stone-700 mt-1.5 truncate">{product.name}</span>
                          <span className="text-[8px] font-bold text-stone-900 mt-0.5">{product.priceStr}</span>
                        </div>
                      ))}
                    </div>

                  </div>
                )}

                {/* Nested Screen Layouts inside Phone 2 */}
                {phone2.screen === "detail" && (
                  <PhoneDetailView 
                    phoneId={2} 
                    productId={phone2.selectedProductId} 
                    onBack={() => handlePhoneNavigation(2, "shop")} 
                    onAddToCart={(p, code, name, q) => addToCart(p, code, name, q)}
                    onBuyNow={() => handlePhoneCheckout(2)}
                  />
                )}
                {phone2.screen === "bag" && (
                  <PhoneBagView 
                    phoneId={2} 
                    cart={cart} 
                    onBack={() => handlePhoneNavigation(2, "shop")} 
                    onRemove={(id, c, name) => removeFromCart(id, c, name)} 
                    onQtyChange={(id, c, ch) => updateCartQty(id, c, ch)} 
                    onCheckout={() => handlePhoneCheckout(2)}
                  />
                )}

              </div>
              <div className="phone-home-indicator" />
            </div>
          </div>

          {/* PHONE 3: PRODUCT DETAILS SCREEN */}
          <div className="flex flex-col items-center">
            <span className="text-stone-400 text-xs font-bold tracking-widest uppercase mb-4">3. Product Details</span>
            <div className="phone-mockup">
              <div className="phone-notch" />
              <div className="phone-screen no-scrollbar pt-10 pb-6">
                
                {/* Simulated Success State */}
                {phone3Success && (
                  <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <CheckCircle2 size={48} className="text-emerald-500 animate-bounce mb-3" />
                    <h4 className="font-serif text-lg font-bold">Order Confirmed!</h4>
                    <p className="text-stone-500 text-xs mt-1">Thank you for your purchase.</p>
                  </div>
                )}

                {/* Phone 3 Screen Routing */}
                {phone3.screen === "detail" && (
                  <div className="animate-fade-in text-left">
                    {/* Header */}
                    <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-white/80 sticky top-0 backdrop-blur-sm z-30">
                      <ChevronLeft size={16} className="text-stone-600 cursor-pointer" onClick={() => handlePhoneNavigation(3, "shop", "leather-handbag")} />
                      <span className="text-[10px] tracking-widest font-bold uppercase text-stone-850">Product Details</span>
                      <ShoppingBag size={16} className="text-stone-600 cursor-pointer" onClick={() => handlePhoneNavigation(3, "bag")} />
                    </div>

                    {/* Active product selector */}
                    {(() => {
                      const activeProduct = products.find(p => p.id === phone3.selectedProductId) || products[1];
                      return (
                        <div className="pb-4">
                          {/* Image */}
                          <div className="relative aspect-square bg-stone-50 overflow-hidden">
                            <img src={activeProduct.image} alt={activeProduct.name} className="w-full h-full object-cover" />
                            <button 
                              onClick={() => toggleWishlist(activeProduct.id, activeProduct.name)}
                              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 flex items-center justify-center shadow-md"
                            >
                              <Heart size={14} className={wishlist.includes(activeProduct.id) ? "fill-red-500 stroke-red-500" : "stroke-stone-700"} />
                            </button>
                          </div>

                          {/* Info */}
                          <div className="px-4 pt-4">
                            <h3 className="font-serif text-lg font-semibold text-stone-900 leading-tight">
                              {activeProduct.name}
                            </h3>
                            <h2 className="font-sans text-md font-bold text-stone-950 mt-1">
                              {activeProduct.priceStr}
                            </h2>
                            
                            {/* Color description */}
                            <p className="text-[9px] text-stone-500 mt-3 font-semibold uppercase tracking-wider">
                              Color: {activeProduct.colorNames[phone3ColorIdx]}
                            </p>
                            <div className="flex gap-2.5 mt-2">
                              {activeProduct.colors.map((color, idx) => (
                                <button 
                                  key={color} 
                                  onClick={() => setPhone3ColorIdx(idx)}
                                  style={{ backgroundColor: color }}
                                  className={`w-6 h-6 rounded-full border flex items-center justify-center shadow-sm relative ${
                                    phone3ColorIdx === idx ? "border-stone-900 scale-105" : "border-stone-200"
                                  }`}
                                >
                                  {phone3ColorIdx === idx && (
                                    <Check size={10} className={color === "#FAF8F5" ? "text-stone-900" : "text-white"} />
                                  )}
                                </button>
                              ))}
                            </div>

                            {/* Quantity */}
                            <p className="text-[9px] text-stone-500 mt-4 font-semibold uppercase tracking-wider">
                              Quantity
                            </p>
                            <div className="flex items-center border border-stone-250 w-24 rounded-full mt-2 h-7 overflow-hidden">
                              <button 
                                onClick={() => setPhone3Qty(q => q > 1 ? q - 1 : 1)}
                                className="flex-1 h-full flex items-center justify-center hover:bg-stone-50 text-[10px] font-bold"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-6 text-center text-[10px] font-bold text-stone-800">{phone3Qty}</span>
                              <button 
                                onClick={() => setPhone3Qty(q => q + 1)}
                                className="flex-1 h-full flex items-center justify-center hover:bg-stone-50 text-[10px] font-bold"
                              >
                                <Plus size={10} />
                              </button>
                            </div>

                            {/* Add to Cart Actions */}
                            <div className="flex flex-col gap-2 mt-6">
                              <button 
                                onClick={() => addToCart(activeProduct, activeProduct.colors[phone3ColorIdx], activeProduct.colorNames[phone3ColorIdx], phone3Qty)}
                                className="w-full bg-stone-900 text-stone-50 font-sans font-bold text-[9px] tracking-widest uppercase h-9 rounded-full hover:bg-stone-850 active:scale-95 transition-all shadow-sm"
                              >
                                Add to Cart
                              </button>
                              <button 
                                onClick={() => handlePhoneCheckout(3)}
                                className="w-full bg-transparent border border-stone-300 text-stone-800 font-sans font-bold text-[9px] tracking-widest uppercase h-9 rounded-full hover:bg-stone-50/50 active:scale-95 transition-all"
                              >
                                Buy Now
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                )}

                {/* Nested Screen Layouts inside Phone 3 */}
                {phone3.screen === "shop" && (
                  <PhoneShopView phoneId={3} onSelectProduct={(id) => handlePhoneNavigation(3, "detail", id)} />
                )}
                {phone3.screen === "bag" && (
                  <PhoneBagView 
                    phoneId={3} 
                    cart={cart} 
                    onBack={() => handlePhoneNavigation(3, "detail", phone3.selectedProductId)} 
                    onRemove={(id, c, name) => removeFromCart(id, c, name)} 
                    onQtyChange={(id, c, ch) => updateCartQty(id, c, ch)} 
                    onCheckout={() => handlePhoneCheckout(3)}
                  />
                )}

              </div>
              <div className="phone-home-indicator" />
            </div>
          </div>

          {/* PHONE 4: SHOPPING BAG SCREEN */}
          <div className="flex flex-col items-center">
            <span className="text-stone-400 text-xs font-bold tracking-widest uppercase mb-4">4. Shopping Bag</span>
            <div className="phone-mockup">
              <div className="phone-notch" />
              <div className="phone-screen no-scrollbar pt-10 pb-6">
                
                {/* Simulated Success State */}
                {phone4Success && (
                  <div className="absolute inset-0 bg-white/95 z-50 flex flex-col items-center justify-center p-6 text-center animate-fade-in">
                    <CheckCircle2 size={48} className="text-emerald-500 animate-bounce mb-3" />
                    <h4 className="font-serif text-lg font-bold">Order Confirmed!</h4>
                    <p className="text-stone-500 text-xs mt-1">Thank you for your purchase.</p>
                  </div>
                )}

                {/* Phone 4 Screen Routing */}
                {phone4.screen === "bag" && (
                  <PhoneBagView 
                    phoneId={4} 
                    cart={cart} 
                    onBack={() => handlePhoneNavigation(4, "shop")} 
                    onRemove={(id, c, name) => removeFromCart(id, c, name)} 
                    onQtyChange={(id, c, ch) => updateCartQty(id, c, ch)} 
                    onCheckout={() => handlePhoneCheckout(4)}
                  />
                )}

                {/* Nested Screen Layouts inside Phone 4 */}
                {phone4.screen === "shop" && (
                  <PhoneShopView phoneId={4} onSelectProduct={(id) => handlePhoneNavigation(4, "detail", id)} />
                )}
                {phone4.screen === "detail" && (
                  <PhoneDetailView 
                    phoneId={4} 
                    productId={phone4.selectedProductId} 
                    onBack={() => handlePhoneNavigation(4, "bag")} 
                    onAddToCart={(p, code, name, q) => addToCart(p, code, name, q)}
                    onBuyNow={() => handlePhoneCheckout(4)}
                  />
                )}

              </div>
              <div className="phone-home-indicator" />
            </div>
          </div>

        </div>
      </section>

      {/* 5. Footer Trust Badges (Expanded layout) */}
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
    </main>
  );
}

// ----------------------------------------------------
// MOBILE SUB-VIEWS FOR SIMULATION
// ----------------------------------------------------

interface MobileShopProps {
  phoneId: number;
  onSelectProduct: (id: string) => void;
}

function PhoneShopView({ phoneId, onSelectProduct }: MobileShopProps) {
  return (
    <div className="animate-fade-in text-left">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-white">
        <span className="text-[10px] tracking-widest font-bold uppercase text-stone-850">Shop Collection</span>
      </div>

      <div className="px-4 py-3 grid grid-cols-2 gap-3">
        {products.map((product) => (
          <div 
            key={product.id} 
            onClick={() => onSelectProduct(product.id)}
            className="flex flex-col cursor-pointer"
          >
            <img src={product.image} className="aspect-[3/4] object-cover rounded-xl shadow-sm bg-stone-50" />
            <span className="text-[8.5px] font-semibold text-stone-700 mt-1 truncate">{product.name}</span>
            <span className="text-[8px] font-bold text-stone-900 mt-0.5">{product.priceStr}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

interface MobileDetailProps {
  phoneId: number;
  productId: string;
  onBack: () => void;
  onAddToCart: (product: typeof products[0], colorCode: string, colorName: string, qty: number) => void;
  onBuyNow: () => void;
}

function PhoneDetailView({ phoneId, productId, onBack, onAddToCart, onBuyNow }: MobileDetailProps) {
  const product = products.find(p => p.id === productId) || products[0];
  const [localQty, setLocalQty] = useState(1);
  const [localColorIdx, setLocalColorIdx] = useState(0);

  return (
    <div className="animate-fade-in text-left">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-10">
        <ChevronLeft size={16} className="text-stone-600 cursor-pointer" onClick={onBack} />
        <span className="text-[9px] tracking-widest font-bold uppercase text-stone-800">Product Details</span>
        <div className="w-4" /> {/* Spacer */}
      </div>

      {/* Image */}
      <div className="relative aspect-square bg-stone-50">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      {/* Content */}
      <div className="px-4 py-4">
        <h3 className="font-serif text-base font-semibold text-stone-900">{product.name}</h3>
        <h2 className="font-sans text-sm font-bold text-stone-950 mt-1">{product.priceStr}</h2>
        <p className="text-[9px] text-stone-500 mt-3 leading-relaxed font-light">{product.description}</p>
        
        {/* Colors */}
        <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider mt-4">
          Color: {product.colorNames[localColorIdx]}
        </p>
        <div className="flex gap-2 mt-1.5">
          {product.colors.map((color, idx) => (
            <button 
              key={color} 
              onClick={() => setLocalColorIdx(idx)}
              style={{ backgroundColor: color }}
              className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                localColorIdx === idx ? "border-stone-900 scale-105" : "border-stone-200"
              }`}
            >
              {localColorIdx === idx && (
                <Check size={8} className={color === "#FAF8F5" ? "text-stone-900" : "text-white"} />
              )}
            </button>
          ))}
        </div>

        {/* Quantity */}
        <p className="text-[8px] text-stone-400 font-bold uppercase tracking-wider mt-4">
          Quantity
        </p>
        <div className="flex items-center border border-stone-200 w-20 rounded-full mt-1.5 h-6 overflow-hidden">
          <button 
            onClick={() => setLocalQty(q => q > 1 ? q - 1 : 1)}
            className="flex-1 h-full flex items-center justify-center hover:bg-stone-50 text-[9px] font-bold"
          >
            <Minus size={8} />
          </button>
          <span className="w-5 text-center text-[9px] font-bold text-stone-855">{localQty}</span>
          <button 
            onClick={() => setLocalQty(q => q + 1)}
            className="flex-1 h-full flex items-center justify-center hover:bg-stone-50 text-[9px] font-bold"
          >
            <Plus size={8} />
          </button>
        </div>

        {/* Buttons */}
        <div className="flex flex-col gap-2 mt-6">
          <button 
            onClick={() => onAddToCart(product, product.colors[localColorIdx], product.colorNames[localColorIdx], localQty)}
            className="w-full bg-stone-900 text-stone-50 font-sans font-bold text-[9px] tracking-widest uppercase h-8 rounded-full shadow-sm hover:bg-stone-800"
          >
            Add to Bag
          </button>
          <button 
            onClick={onBuyNow}
            className="w-full bg-transparent border border-stone-300 text-stone-850 font-sans font-bold text-[9px] tracking-widest uppercase h-8 rounded-full hover:bg-stone-50"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  );
}

interface MobileBagProps {
  phoneId: number;
  cart: CartItem[];
  onBack: () => void;
  onRemove: (id: string, color: string, name: string) => void;
  onQtyChange: (id: string, color: string, change: number) => void;
  onCheckout: () => void;
}

function PhoneBagView({ phoneId, cart, onBack, onRemove, onQtyChange, onCheckout }: MobileBagProps) {
  const subtotal = cart.reduce((tot, item) => tot + (item.price * item.quantity), 0);
  const total = subtotal;

  return (
    <div className="animate-fade-in text-left flex flex-col min-h-full">
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-stone-100 bg-white sticky top-0 z-10">
        <ChevronLeft size={16} className="text-stone-600 cursor-pointer" onClick={onBack} />
        <span className="text-[10px] tracking-widest font-bold uppercase text-stone-800">Shopping Bag</span>
        <div className="w-4" /> {/* Spacer */}
      </div>

      {cart.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center my-12">
          <ShoppingBag size={36} className="text-stone-300 mb-2 stroke-[1.2]" />
          <p className="text-[11px] font-bold text-stone-400 uppercase tracking-wider">Your bag is empty</p>
          <span className="text-[9px] text-stone-400 mt-1 font-light">Explore items and add them.</span>
        </div>
      ) : (
        <div className="flex-1 flex flex-col justify-between">
          {/* Cart items list */}
          <div className="divide-y divide-stone-100 px-4">
            {cart.map((item) => (
              <div key={`${item.id}-${item.color}`} className="py-3.5 flex gap-3.5">
                <img src={item.image} alt={item.name} className="w-12 h-16 object-cover rounded-xl bg-stone-50 border border-stone-100" />
                <div className="flex-1 flex flex-col justify-between min-w-0">
                  <div className="flex justify-between items-start gap-1">
                    <div>
                      <h4 className="text-[10px] font-bold text-stone-800 truncate max-w-[100px]">{item.name}</h4>
                      <p className="text-[8px] text-stone-400 font-medium tracking-wide mt-0.5">{item.colorName} / M</p>
                    </div>
                    <button 
                      onClick={() => onRemove(item.id, item.color, item.name)}
                      className="text-stone-400 hover:text-stone-600 p-0.5"
                    >
                      <X size={10} />
                    </button>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] font-bold text-stone-900">${(item.price * item.quantity).toFixed(2)}</span>
                    <div className="flex items-center border border-stone-200 rounded-full h-5 overflow-hidden">
                      <button 
                        onClick={() => onQtyChange(item.id, item.color, -1)}
                        className="w-4 h-full flex items-center justify-center hover:bg-stone-50 text-[8px] font-bold"
                      >
                        <Minus size={6} />
                      </button>
                      <span className="w-4 text-center text-[8px] font-bold text-stone-700">{item.quantity}</span>
                      <button 
                        onClick={() => onQtyChange(item.id, item.color, 1)}
                        className="w-4 h-full flex items-center justify-center hover:bg-stone-50 text-[8px] font-bold"
                      >
                        <Plus size={6} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pricing Summary */}
          <div className="bg-stone-50 border-t border-stone-100 px-4 py-4 mt-auto">
            <div className="flex justify-between text-[9px] font-semibold text-stone-500 uppercase">
              <span>Subtotal</span>
              <span className="text-stone-800 font-bold">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-[9px] font-semibold text-stone-500 uppercase mt-2">
              <span>Shipping</span>
              <span className="text-emerald-600 font-bold tracking-wider uppercase text-[8px]">Free</span>
            </div>
            <div className="w-full h-[1px] bg-stone-200/60 my-3" />
            <div className="flex justify-between text-[10px] font-bold text-stone-900 uppercase">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>

            <button 
              onClick={onCheckout}
              className="w-full bg-stone-900 text-stone-50 font-sans font-bold text-[9px] tracking-widest uppercase h-9 rounded-full mt-4 hover:bg-stone-800 transition-colors shadow-sm"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;