import { create } from "zustand";
import type {
  AIRecommendation,
  CategoryId,
  ColorOption,
  DesignDetails,
  Fabric,
  Measurements,
  ProductModel,
  SizeType,
  VideoPreviewState,
} from "@/types";

const emptyMeasurements: Measurements = {
  height: "",
  weight: "",
  bust: "",
  waist: "",
  hip: "",
  shoulder: "",
  armLength: "",
  armCircumference: "",
  dressLength: "",
};

const emptyDesignDetails: DesignDetails = {
  neckline: "",
  sleeveLength: "",
  sleeveModel: "",
  outfitLength: "",
  cutting: "",
  accents: [],
};

interface CustomizerState {
  customerName: string;
  selectedCategory: CategoryId | null;
  selectedModel: ProductModel | null;
  selectedFabric: Fabric | null;
  selectedColor: ColorOption | null;
  designDetails: DesignDetails;
  sizeType: SizeType;
  selectedSize: string;
  measurements: Measurements;
  aiRecommendation: AIRecommendation | null;
  videoPreviewState: VideoPreviewState;
  setCustomerName: (name: string) => void;
  setCategory: (category: CategoryId) => void;
  setModel: (model: ProductModel) => void;
  setFabric: (fabric: Fabric) => void;
  setColor: (color: ColorOption) => void;
  setDesignDetails: (details: Partial<DesignDetails>) => void;
  setSizeType: (type: SizeType) => void;
  setSelectedSize: (size: string) => void;
  setMeasurements: (measurements: Partial<Measurements>) => void;
  setAIRecommendation: (rec: AIRecommendation) => void;
  setVideoPreviewState: (state: VideoPreviewState) => void;
  resetCustomizer: () => void;
}

export const useCustomizerStore = create<CustomizerState>((set) => ({
  customerName: "",
  selectedCategory: null,
  selectedModel: null,
  selectedFabric: null,
  selectedColor: null,
  designDetails: emptyDesignDetails,
  sizeType: "standard",
  selectedSize: "M",
  measurements: emptyMeasurements,
  aiRecommendation: null,
  videoPreviewState: "empty",
  setCustomerName: (customerName) => set({ customerName }),
  setCategory: (selectedCategory) => set({ selectedCategory }),
  setModel: (selectedModel) => set({ selectedModel }),
  setFabric: (selectedFabric) => set({ selectedFabric }),
  setColor: (selectedColor) => set({ selectedColor }),
  setDesignDetails: (details) =>
    set((state) => ({ designDetails: { ...state.designDetails, ...details } })),
  setSizeType: (sizeType) => set({ sizeType }),
  setSelectedSize: (selectedSize) => set({ selectedSize }),
  setMeasurements: (measurements) =>
    set((state) => ({ measurements: { ...state.measurements, ...measurements } })),
  setAIRecommendation: (aiRecommendation) => set({ aiRecommendation }),
  setVideoPreviewState: (videoPreviewState) => set({ videoPreviewState }),
  resetCustomizer: () =>
    set({
      customerName: "",
      selectedCategory: null,
      selectedModel: null,
      selectedFabric: null,
      selectedColor: null,
      designDetails: emptyDesignDetails,
      sizeType: "standard",
      selectedSize: "M",
      measurements: emptyMeasurements,
      aiRecommendation: null,
      videoPreviewState: "empty",
    }),
}));
