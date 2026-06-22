// Tipe data inti untuk LUCE Custom Studio

export type CategoryId =
  | "gamis"
  | "abaya"
  | "tunik"
  | "dress"
  | "outer"
  | "blouse"
  | "rok"
  | "hijab-set"
  | "family-set";

export interface Category {
  id: CategoryId;
  name: string;
  description: string;
  emoji: string;
}

export interface ProductModel {
  id: string;
  name: string;
  category: CategoryId;
  description: string;
  basePrice: number;
  imageColor: string;
  bestFor: string;
}

export interface Fabric {
  id: string;
  name: string;
  description: string;
  texture: string;
  comfortLevel: "Ringan" | "Sedang" | "Hangat";
  thickness: "Tipis" | "Medium" | "Tebal";
  priceModifier: number;
  swatch: string;
}

export interface ColorOption {
  id: string;
  name: string;
  hex: string;
  family: string;
}

export interface DesignDetails {
  neckline: string;
  sleeveLength: string;
  sleeveModel: string;
  outfitLength: string;
  cutting: string;
  accents: string[];
}

export type SizeType = "standard" | "custom";

export interface Measurements {
  height: string;
  weight: string;
  bust: string;
  waist: string;
  hip: string;
  shoulder: string;
  armLength: string;
  armCircumference: string;
  dressLength: string;
}

export interface AIRecommendation {
  designName: string;
  category: string;
  fabric: string;
  color: string;
  cutting: string;
  designDetails: string;
  suitableOccasion: string;
  productionNotes: string;
}

export type VideoPreviewState =
  | "empty"
  | "ready"
  | "generating"
  | "generated"
  | "failed";

export type DesignRequestStatus =
  | "draft"
  | "preview_requested"
  | "preview_generated"
  | "submitted"
  | "waiting_review"
  | "need_revision"
  | "approved"
  | "waiting_payment"
  | "in_production"
  | "ready"
  | "completed"
  | "cancelled";

export type VideoStatus =
  | "not_requested"
  | "queued"
  | "generating"
  | "generated"
  | "failed"
  | "cancelled";

export type PaymentStatus = "unpaid" | "down_payment" | "paid" | "refunded";

export type ProductionStatus =
  | "pending_confirmation"
  | "design_confirmed"
  | "pattern_created"
  | "cutting"
  | "sewing"
  | "quality_control"
  | "ready_to_ship"
  | "completed"
  | "cancelled";

export interface DesignRequest {
  id: string;
  customerName: string;
  category: string;
  productName: string;
  fabric: string;
  color: string;
  sizeType: SizeType;
  measurements: Partial<Measurements>;
  aiRecommendation: AIRecommendation;
  videoPrompt: string;
  videoStatus: VideoStatus;
  estimatedPrice: number;
  productionNotes: string;
  status: DesignRequestStatus;
  paymentStatus: PaymentStatus;
  productionStatus: ProductionStatus;
  createdAt: string;
}
