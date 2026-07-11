import {
  Ruler,
  Scissors,
  Shirt,
  MessageCircle,
  CircleUserRound,
  PackageCheck,
  Bookmark,
  Sparkles,
  ShoppingBag,
} from "lucide-react";

export const navItems = [
  "Koleksi",
  "Custom Studio",
  "Bahan",
  "Size Guide",
  "Tentang Luse by lucy",
  "Kontak",
];

export const problems = [
  {
    icon: Ruler,
    title: "Takut ukuran tidak pas",
    text: "Ukuran sulit ditebak saat belanja online.",
  },
  {
    icon: Scissors,
    title: "Bingung bahan jatuhnya seperti apa",
    text: "Hanya lihat foto, tidak tahu tekstur dan karakter kain.",
  },
  {
    icon: Shirt,
    title: "Sulit membayangkan hasil akhir",
    text: "Tidak bisa lihat tampilan dari berbagai sisi.",
  },
  {
    icon: MessageCircle,
    title: "Custom order rawan miskomunikasi",
    text: "Detail desain, ukuran, dan permintaan sering keliru.",
  },
];

export const steps: [string, string][] = [
  ["Pilih Model", "Pilih gamis, abaya, tunik, atau set favoritmu."],
  ["Tentukan Bahan & Warna", "Sesuaikan karakter bahan, warna, dan finishing."],
  ["Masukkan Ukuran", "Gunakan ukuran standar atau input ukuran tubuh sendiri."],
  ["Preview di Manekin 3D", "Lihat tampilan busana dari depan, samping, dan belakang."],
  ["Konfirmasi & Pesan", "Simpan desain, konsultasi, atau lanjut checkout pesananmu."],
];

export const collections: [string, string, string, string][] = [
  ["A-Line Daily Gamis", "Mulai Rp399.000", "Custom size available", "sage"],
  ["Elegant Abaya Set", "Mulai Rp599.000", "Custom size available", "navy"],
  ["Modern Tunik", "Mulai Rp329.000", "Custom size available", "blush"],
  ["Family Custom Set", "Mulai Rp899.000", "Custom size available", "sand"],
];

export const fabrics: [string, string, string][] = [
  ["Toyobo", "Halus, rapi, semi-formal", "ivory"],
  ["Ceruty", "Ringan, flowy, feminin", "rose"],
  ["Satin Silk", "Glossy, elegan, premium", "gold"],
  ["Linen", "Natural, adem, casual luxury", "linen"],
  ["Rayon", "Lembut, jatuh, nyaman harian", "rayon"],
];

export const trusts: [string, typeof Shirt][] = [
  ["Konsultasi Ukuran Sebelum Produksi", CircleUserRound],
  ["Estimasi Produksi Jelas & Transparan", PackageCheck],
  ["Detail Pesanan Tersimpan Otomatis", Bookmark],
  ["Quality Control Sebelum Dikirim", Sparkles],
  ["Custom untuk Individu & Keluarga", ShoppingBag],
];

export const testimonials: [string, string][] = [
  ["Alya Putri", "Biasanya saya bingung pilih ukuran online. Dengan preview 3D dan konsultasi, hasilnya lebih yakin sebelum pesan."],
  ["Nisa Rahma", "Pilihan bahannya lengkap dan jelas. Warna bisa dicoba dulu, hasil akhirnya sesuai ekspektasi."],
  ["Fatimah Zahra", "Pesan untuk keluarga jadi lebih mudah. Semua bisa custom ukuran dan warnanya juga cantik."],
];

export const WHATSAPP_URL = "https://wa.me/6281200000000?text=Halo%20Luse by lucy%2C%20saya%20tertarik%20untuk%20custom%20busana";

export const modelOptions = ["Gamis A-Line", "Abaya", "Tunik", "Family Set"];
export const fabricOptions = ["Toyobo", "Ceruty", "Satin Silk", "Linen", "Rayon"];
export const colorOptions = ["sage", "ivory", "blush", "navy", "black"] as const;
export const sizeOptions = ["S", "M", "L", "XL", "Custom"];

export type ColorKey = (typeof colorOptions)[number];
