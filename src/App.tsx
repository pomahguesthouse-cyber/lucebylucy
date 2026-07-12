import { BrowserRouter, Route, Routes, useLocation } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { RequireAdmin } from "@/components/admin/RequireAdmin";
import { Home } from "@/pages/Home";
import { Collections } from "@/pages/Collections";
import { ProductDetail } from "@/pages/ProductDetail";
import { Customize } from "@/pages/Customize";
import { AIStylist } from "@/pages/AIStylist";
import { VideoPreview } from "@/pages/VideoPreview";
import { Gallery } from "@/pages/Gallery";
import { SizeGuide } from "@/pages/SizeGuide";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { MyDesigns } from "@/pages/MyDesigns";
import { MyOrders } from "@/pages/MyOrders";
import { MeasurementProfile } from "@/pages/MeasurementProfile";
import { NotFound } from "@/pages/NotFound";
import { AdminLogin } from "@/pages/AdminLogin";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminDesignRequests } from "@/pages/admin/AdminDesignRequests";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminCategories } from "@/pages/admin/AdminCategories";
import { AdminFabrics } from "@/pages/admin/AdminFabrics";
import { AdminColors } from "@/pages/admin/AdminColors";
import { AdminMedia } from "@/pages/admin/AdminMedia";
import { AdminHeroMedia } from "@/pages/admin/AdminHeroMedia";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminProductionNotes } from "@/pages/admin/AdminProductionNotes";
import { AdminSettings } from "@/pages/admin/AdminSettings";
import { TelegramProductForm } from "@/pages/TelegramProductForm";
import { LuseAssistantWidget } from "@/components/agent/LuseAssistantWidget";

function PublicAssistant() {
  const { pathname } = useLocation();
  return pathname.startsWith("/admin") || pathname.startsWith("/telegram") ? null : <LuseAssistantWidget />;
}

const protect = (element: React.ReactNode) => <RequireAdmin>{element}</RequireAdmin>;

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <PublicAssistant />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/ai-stylist" element={<AIStylist />} />
        <Route path="/video-preview" element={<VideoPreview />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-designs" element={<MyDesigns />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/measurements" element={<MeasurementProfile />} />
        <Route path="/telegram/products/new" element={<TelegramProductForm />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={protect(<AdminDashboard />)} />
        <Route path="/admin/design-requests" element={protect(<AdminDesignRequests />)} />
        <Route path="/admin/categories" element={protect(<AdminCategories />)} />
        <Route path="/admin/products" element={protect(<AdminProducts />)} />
        <Route path="/admin/fabrics" element={protect(<AdminFabrics />)} />
        <Route path="/admin/colors" element={protect(<AdminColors />)} />
        <Route path="/admin/media" element={protect(<AdminMedia />)} />
        <Route path="/admin/video-hero" element={protect(<AdminHeroMedia />)} />
        <Route path="/admin/orders" element={protect(<AdminOrders />)} />
        <Route path="/admin/production-notes" element={protect(<AdminProductionNotes />)} />
        <Route path="/admin/settings" element={protect(<AdminSettings />)} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
