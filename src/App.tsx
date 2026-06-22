import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ScrollToTop } from "@/components/layout/ScrollToTop";
import { Home } from "@/pages/Home";
import { Collections } from "@/pages/Collections";
import { ProductDetail } from "@/pages/ProductDetail";
import { Customize } from "@/pages/Customize";
import { AIStylist } from "@/pages/AIStylist";
import { VideoPreview } from "@/pages/VideoPreview";
import { SizeGuide } from "@/pages/SizeGuide";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { MyDesigns } from "@/pages/MyDesigns";
import { MyOrders } from "@/pages/MyOrders";
import { MeasurementProfile } from "@/pages/MeasurementProfile";
import { NotFound } from "@/pages/NotFound";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { AdminDesignRequests } from "@/pages/admin/AdminDesignRequests";
import { AdminProducts } from "@/pages/admin/AdminProducts";
import { AdminFabrics } from "@/pages/admin/AdminFabrics";
import { AdminColors } from "@/pages/admin/AdminColors";
import { AdminOrders } from "@/pages/admin/AdminOrders";
import { AdminProductionNotes } from "@/pages/admin/AdminProductionNotes";
import { AdminSettings } from "@/pages/admin/AdminSettings";

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/collections" element={<Collections />} />
        <Route path="/products/:id" element={<ProductDetail />} />
        <Route path="/customize" element={<Customize />} />
        <Route path="/ai-stylist" element={<AIStylist />} />
        <Route path="/video-preview" element={<VideoPreview />} />
        <Route path="/size-guide" element={<SizeGuide />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/my-designs" element={<MyDesigns />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/measurements" element={<MeasurementProfile />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/design-requests" element={<AdminDesignRequests />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/fabrics" element={<AdminFabrics />} />
        <Route path="/admin/colors" element={<AdminColors />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/production-notes" element={<AdminProductionNotes />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
