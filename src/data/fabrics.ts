import type { Fabric } from "@/types";

export const fabrics: Fabric[] = [
  { id: "crinkle-premium", name: "Crinkle Premium", description: "Tekstur kerut halus, ringan, dan adem.", texture: "Kerut lembut", comfortLevel: "Ringan", thickness: "Medium", priceModifier: 35000, swatch: "#ece3d4" },
  { id: "rayon", name: "Rayon", description: "Jatuh kain luwes dan sangat nyaman dipakai.", texture: "Halus mengalir", comfortLevel: "Ringan", thickness: "Tipis", priceModifier: 0, swatch: "#e4dccb" },
  { id: "linen", name: "Linen", description: "Serat alami, bertekstur, dan sejuk.", texture: "Serat alami", comfortLevel: "Sedang", thickness: "Medium", priceModifier: 45000, swatch: "#ddd3bd" },
  { id: "toyobo", name: "Toyobo", description: "Premium, rapi, dan tidak menerawang.", texture: "Rapat halus", comfortLevel: "Sedang", thickness: "Medium", priceModifier: 60000, swatch: "#efe7d8" },
  { id: "satin-silk", name: "Satin Silk", description: "Berkilau lembut dengan kesan mewah.", texture: "Licin berkilau", comfortLevel: "Ringan", thickness: "Tipis", priceModifier: 75000, swatch: "#e9d8c6" },
  { id: "katun-madina", name: "Katun Madina", description: "Adem, lembut, dan nyaman untuk harian.", texture: "Katun lembut", comfortLevel: "Ringan", thickness: "Medium", priceModifier: 20000, swatch: "#e7ddca" },
  { id: "ceruty", name: "Ceruty", description: "Ringan melayang, cocok untuk layer.", texture: "Ringan flowy", comfortLevel: "Ringan", thickness: "Tipis", priceModifier: 30000, swatch: "#ded6c6" },
  { id: "wolfis-premium", name: "Wolfis Premium", description: "Tebal lembut, jatuh rapi, tidak licin.", texture: "Doff lembut", comfortLevel: "Sedang", thickness: "Tebal", priceModifier: 40000, swatch: "#d9cdb6" },
  { id: "moscrepe", name: "Moscrepe", description: "Tekstur crepe halus dengan jatuh anggun.", texture: "Crepe halus", comfortLevel: "Sedang", thickness: "Medium", priceModifier: 35000, swatch: "#e2d6c1" },
  { id: "airflow", name: "Airflow", description: "Adem dan ringan, ideal cuaca panas.", texture: "Ringan adem", comfortLevel: "Ringan", thickness: "Tipis", priceModifier: 25000, swatch: "#e8e0d0" },
];
