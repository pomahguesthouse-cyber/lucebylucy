import crypto from "node:crypto";
import http from "node:http";
import { createClient } from "@supabase/supabase-js";

const HOST = process.env.TELEGRAM_PRODUCT_API_HOST || "127.0.0.1";
const PORT = Number(process.env.TELEGRAM_PRODUCT_API_PORT || 9132);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const ADMIN_IDS = new Set((process.env.TELEGRAM_ADMIN_IDS || "").split(",").map((v) => v.trim()).filter(Boolean));

if (!BOT_TOKEN || !SUPABASE_URL || !SERVICE_KEY || ADMIN_IDS.size === 0) {
  throw new Error("TELEGRAM_BOT_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan TELEGRAM_ADMIN_IDS wajib diisi.");
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});

function json(res, status, payload) {
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Content-Length": Buffer.byteLength(body),
    "Cache-Control": "no-store",
    "X-Content-Type-Options": "nosniff",
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 32768) reject(new Error("PAYLOAD_TOO_LARGE"));
    });
    req.on("end", () => {
      try { resolve(JSON.parse(raw || "{}")); }
      catch { reject(new Error("INVALID_JSON")); }
    });
    req.on("error", reject);
  });
}

function authorize(req) {
  const initData = req.headers["x-telegram-init-data"];
  if (typeof initData !== "string" || !initData) throw new Error("UNAUTHORIZED");

  const params = new URLSearchParams(initData);
  const hash = params.get("hash");
  if (!hash || !/^[a-f0-9]{64}$/i.test(hash)) throw new Error("UNAUTHORIZED");
  params.delete("hash");

  const check = [...params.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}=${value}`)
    .join("\n");
  const secret = crypto.createHmac("sha256", "WebAppData").update(BOT_TOKEN).digest();
  const expected = crypto.createHmac("sha256", secret).update(check).digest("hex");
  if (!crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expected, "hex"))) throw new Error("UNAUTHORIZED");

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Date.now() / 1000 - authDate > 3600) throw new Error("AUTH_EXPIRED");

  const user = JSON.parse(params.get("user") || "{}");
  if (!ADMIN_IDS.has(String(user.id))) throw new Error("FORBIDDEN");
  return user;
}

const slugify = (value) => String(value).normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

async function uniqueSlug(name) {
  const base = slugify(name) || `produk-${Date.now()}`;
  const { data, error } = await supabase.from("products").select("id").eq("slug", base).maybeSingle();
  if (error) throw error;
  return data ? `${base}-${crypto.randomUUID().slice(0, 8)}` : base;
}

async function nextSortOrder() {
  const { data, error } = await supabase.from("products").select("sort_order").order("sort_order", { ascending: false }).limit(1).maybeSingle();
  if (error) throw error;
  return Number(data?.sort_order || 0) + 10;
}

async function handleCategories(res) {
  const { data, error } = await supabase.from("collection_categories").select("id,name").eq("is_active", true).order("sort_order");
  if (error) throw error;
  json(res, 200, { categories: data || [] });
}

async function handleCreate(req, res, user) {
  const body = await readBody(req);
  const name = String(body.name || "").trim();
  const productCode = String(body.productCode || "").trim().toUpperCase();
  const basePrice = Number(body.basePrice);
  const imageColor = String(body.imageColor || "#e6d8c2");

  if (!name || name.length > 160) throw new Error("Nama produk wajib diisi.");
  if (productCode && !/^[A-Z0-9][A-Z0-9-]{1,39}$/.test(productCode)) throw new Error("Kode produk tidak valid.");
  if (!Number.isSafeInteger(basePrice) || basePrice < 0) throw new Error("Harga tidak valid.");
  if (!/^#[0-9a-f]{6}$/i.test(imageColor)) throw new Error("Warna pratinjau tidak valid.");

  const [slug, sortOrder] = await Promise.all([uniqueSlug(name), nextSortOrder()]);
  const { data, error } = await supabase.from("products").insert({
    slug,
    ...(productCode ? { product_code: productCode } : {}),
    name,
    category_id: body.categoryId || null,
    description: String(body.description || "").trim() || null,
    base_price: basePrice,
    image_url: String(body.imageUrl || "").trim() || null,
    image_color: imageColor,
    best_for: String(body.bestFor || "").trim() || null,
    status: body.status === "approved" ? "approved" : "draft",
    sort_order: sortOrder,
  }).select("id,product_code,name,slug,status").single();
  if (error) throw error;

  await supabase.from("telegram_product_imports").insert({
    telegram_user_id: user.id,
    chat_id: user.id,
    message_id: Date.now(),
    status: "success",
    product_id: data.id,
    payload: { source: "mini_app", telegram_username: user.username || null },
    processed_at: new Date().toISOString(),
  });

  json(res, 201, { product: data });
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") return json(res, 200, { ok: true, service: "telegram-product-api" });
    const user = authorize(req);
    if (req.method === "GET" && req.url === "/categories") return await handleCategories(res);
    if (req.method === "POST" && req.url === "/products") return await handleCreate(req, res, user);
    json(res, 404, { error: "Not found" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    const status = message === "UNAUTHORIZED" || message === "AUTH_EXPIRED" ? 401 : message === "FORBIDDEN" ? 403 : message === "INVALID_JSON" ? 400 : 500;
    console.error("Telegram product API:", error);
    json(res, status, { error: status === 500 && message === "UNKNOWN" ? "Gagal memproses permintaan." : message });
  }
});

server.listen(PORT, HOST, () => console.log(`Telegram Product API listening at http://${HOST}:${PORT}`));
