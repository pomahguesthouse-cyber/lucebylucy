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
} from "lucide-react";
import "./App.css";

const products = [
  {
    name: "Oversized Blazer",
    price: "$89.99",
    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Leather Handbag",
    price: "$99.99",
    image:
      "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Knitted Sweater",
    price: "$59.99",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Ankle Boots",
    price: "$109.99",
    image:
      "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?auto=format&fit=crop&w=700&q=80",
  },
];

const shopProducts = [
  ...products,
  {
    name: "Satin Dress",
    price: "$79.99",
    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=700&q=80",
  },
  {
    name: "Wide Leg Pants",
    price: "$69.99",
    image:
      "https://images.unsplash.com/photo-1506629905607-d405d7d3b0d2?auto=format&fit=crop&w=700&q=80",
  },
];

const categories = ["Dresses", "Tops", "Bags", "Shoes"];

function Header() {
  return (
    <header className="header">
      <div className="brand">
        <span>LUCE</span>
        <small>BY LUCY</small>
      </div>

      <nav>
        <a className="active">Home</a>
        <a>Shop</a>
        <a>Collections</a>
        <a>New Arrivals</a>
        <a>About Us</a>
        <a>Contact</a>
      </nav>

      <div className="icons">
        <Search size={21} />
        <User size={21} />
        <div className="cart">
          <ShoppingBag size={21} />
          <span>0</span>
        </div>
      </div>
    </header>
  );
}

function TrustBadges() {
  const items = [
    { icon: Truck, title: "Free Shipping", text: "On orders over $99" },
    { icon: RotateCcw, title: "Easy Returns", text: "30-day return policy" },
    { icon: ShieldCheck, title: "Secure Payment", text: "100% secure checkout" },
    { icon: Headphones, title: "24/7 Support", text: "We're here to help" },
  ];

  return (
    <div className="trust-grid">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <div className="trust-item" key={item.title}>
            <Icon size={24} />
            <div>
              <strong>{item.title}</strong>
              <p>{item.text}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Hero() {
  return (
    <section className="hero">
      <Header />

      <div className="hero-content">
        <div className="hero-copy">
          <p className="eyebrow">New Collection</p>
          <h1>Elevate Your Style, Embrace Elegance.</h1>
          <p className="subtitle">
            Discover timeless fashion pieces crafted for the modern woman.
          </p>

          <div className="hero-actions">
            <button className="primary-btn">Shop Now</button>
            <button className="secondary-btn">View Collection</button>
          </div>
        </div>

        <div className="hero-visual">
          <img
            src="https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=900&q=85"
            alt="Elegant fashion model"
          />
          <div className="trending-card">
            <img src={products[1].image} alt="Minimal shoulder bag" />
            <div>
              <small>Trending Now</small>
              <strong>Minimal Shoulder Bag</strong>
              <p>$79.99</p>
              <button>
                Shop Now <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <TrustBadges />
    </section>
  );
}

function ProductCard({ product }: { product: (typeof products)[number] }) {
  return (
    <article className="product-card">
      <button className="heart-btn">
        <Heart size={18} />
      </button>
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>{product.price}</p>
    </article>
  );
}

function NewArrivals() {
  return (
    <section className="arrivals-section">
      <div className="section-header">
        <h2>New Arrivals</h2>
        <button>
          View All <ArrowRight size={16} />
        </button>
      </div>

      <div className="product-grid">
        {products.map((product) => (
          <ProductCard product={product} key={product.name} />
        ))}
      </div>
    </section>
  );
}

function EditorialCard() {
  return (
    <section className="editorial-card">
      <h2>Fashion Store</h2>
      <span>Design</span>
      <div />
      <p>Elegant. Modern. Timeless.</p>
    </section>
  );
}

function PhoneMockup({
  type,
}: {
  type: "home" | "shop" | "detail" | "bag";
}) {
  return (
    <div className="phone">
      <div className="phone-top">
        <span>9:41</span>
        <div />
      </div>

      {type === "home" && (
        <div className="phone-home">
          <strong className="phone-logo">LUCE</strong>
          <p className="eyebrow">New Collection</p>
          <h3>Elevate Your Style, Embrace Elegance.</h3>
          <button className="phone-btn">Shop Now</button>
          <p className="phone-title">Categories</p>
          <div className="category-row">
            {categories.map((item) => (
              <span key={item}>{item}</span>
            ))}
          </div>
          <p className="phone-title">New Arrivals</p>
          <div className="mini-grid">
            {products.slice(0, 2).map((product) => (
              <img src={product.image} key={product.name} />
            ))}
          </div>
        </div>
      )}

      {type === "shop" && (
        <div>
          <div className="phone-nav">
            <span>←</span>
            <strong>Shop</strong>
          </div>
          <div className="phone-filter">
            <span>
              <SlidersHorizontal size={13} /> Filter
            </span>
            <span>Sort</span>
          </div>
          <div className="mini-grid">
            {shopProducts.slice(0, 4).map((product) => (
              <div className="mini-product" key={product.name}>
                <img src={product.image} />
                <small>{product.name}</small>
                <strong>{product.price}</strong>
              </div>
            ))}
          </div>
        </div>
      )}

      {type === "detail" && (
        <div>
          <div className="phone-nav">
            <span>←</span>
            <strong>Product Details</strong>
          </div>
          <img className="detail-img" src={products[1].image} />
          <h3>Leather Handbag</h3>
          <h2>$99.99</h2>
          <p className="muted">Color: Brown</p>
          <div className="qty">− 1 +</div>
          <button className="phone-wide dark">Add to Cart</button>
          <button className="phone-wide light">Buy Now</button>
        </div>
      )}

      {type === "bag" && (
        <div>
          <div className="phone-nav">
            <span>←</span>
            <strong>Shopping Bag</strong>
          </div>
          {products.slice(0, 3).map((product) => (
            <div className="bag-item" key={product.name}>
              <img src={product.image} />
              <div>
                <strong>{product.name}</strong>
                <p>{product.price}</p>
                <span>− 1 +</span>
              </div>
            </div>
          ))}
          <div className="total">
            <span>Total</span>
            <strong>$299.97</strong>
          </div>
          <button className="phone-wide dark">Checkout</button>
        </div>
      )}
    </div>
  );
}

function MobilePreview() {
  return (
    <section className="mobile-preview">
      <PhoneMockup type="home" />
      <PhoneMockup type="shop" />
      <PhoneMockup type="detail" />
      <PhoneMockup type="bag" />
    </section>
  );
}

function App() {
  return (
    <main className="page">
      <Hero />

      <section className="middle-grid">
        <NewArrivals />
        <EditorialCard />
      </section>

      <MobilePreview />
      <TrustBadges />
    </main>
  );
}

export default App;