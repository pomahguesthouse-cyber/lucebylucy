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
  Plus,
  Minus,
  X,
  Check,
  ShoppingBag as BagIcon,
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

  return (
    <main className="min-h-screen bg-[#FAF7F2] text-stone-900 font-sans selection:bg-stone-200 antialiased pb-20 relative overflow-x-hidden">
      <Toaster position="bottom-right" richColors />
      
      {/* 1. Header (Desktop Layout) */}
      <header className="max-w-7xl mx-auto px-6 md:px-12 py-6 flex items-center justify-between border-b border-stone-200/60 sticky top-0 bg-[#FAF7F2]/90 backdrop-blur-md z-40">
        <div className="flex items-center">
          <img src="/logo.png" alt="Luce by Lucy Logo" className="h-12 md:h-14 w-auto object-contain" />
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
              href="#new-arrivals"
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
                onClick={() => addToCart(products[1])}
                className="text-[9px] font-bold text-stone-800 hover:text-stone-900 flex items-center gap-1 mt-1 tracking-wider uppercase border-b border-stone-800/40 pb-0.5"
              >
                Quick Add <ArrowRight size={10} className="stroke-[2.5]" />
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

      {/* 4. Shop Catalog Section (Desktop Catalog view replacing mobile simulation space) */}
      <section id="shop" className="max-w-7xl mx-auto px-6 md:px-12 py-16 border-t border-stone-200/50">
        <div className="flex flex-col text-left mb-10">
          <span className="text-[10px] tracking-[0.3em] font-bold text-stone-400 uppercase mb-1">Our Collection</span>
          <h2 className="font-serif text-3xl font-light text-stone-900 tracking-tight">Shop the Catalog</h2>
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