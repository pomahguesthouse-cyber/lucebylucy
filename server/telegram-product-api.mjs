import crypto from "node:crypto";
import http from "node:http";
import { createClient } from "@supabase/supabase-js";

const HOST = process.env.TELEGRAM_PRODUCT_API_HOST || "127.0.0.1";
const PORT = Number(process.env.TELEGRAM_PRODUCT_API_PORT || 9132);
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const PRODUCT_BUCKET = process.env.TELEGRAM_PRODUCT_BUCKET?.trim() || "product-images";
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_IMAGES_PER_PRODUCT = 10;
const ADMIN_IDS = new Set(
  (process.env.TELEGRAM_ADMIN_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

const MIME_EXTENSIONS = new Map([
  ["image/jpeg", "jpg"],
  ["image/png", "png"],
  ["image/webp", "webp"],
]);

if (!BOT_TOKEN || !SUPABASE_URL || !SERVICE_KEY || ADMIN_IDS.size === 0) {
  throw new Error(
    "TELEGRAM_BOT_TOKEN, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, dan TELEGRAM_ADMIN_IDS wajib diisi.",
  );
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

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    let tooLarge = false;

    req.on("data", (chunk) => {
      if (tooLarge) return;
      raw += chunk;
      if (raw.length > 65_536) {
        tooLarge = true;
        raw = "";
      }
    });
    req.on("end", () => {
      if (tooLarge) {
        reject(new Error("PAYLOAD_TOO_LARGE"));
        return;
      }
      try {
        resolve(JSON.parse(raw || "{}"));
      } catch {
        reject(new Error("INVALID_JSON"));
      }
    });
    req.on("error", reject);
  });
}

function readBinaryBody(req, maxBytes) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    let totalBytes = 0;
    let tooLarge = false;

    req.on("data", (chunk) => {
      totalBytes += chunk.length;
      if (totalBytes > maxBytes) {
        tooLarge = true;
        chunks.length = 0;
        return;
      }
      if (!tooLarge) chunks.push(chunk);
    });
    req.on("end", () => {
      if (tooLarge) {
        reject(new Error("FILE_TOO_LARGE"));
        return;
      }
      const body = Buffer.concat(chunks);
      if (body.length === 0) {
        reject(new Error("EMPTY_FILE"));
        return;
      }
      resolve(body);
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
  if (!crypto.timingSafeEqual(Buffer.from(hash, "hex"), Buffer.from(expected, "hex"))) {
    throw new Error("UNAUTHORIZED");
  }

  const authDate = Number(params.get("auth_date"));
  if (!authDate || Date.now() / 1000 - authDate > 3600) throw new Error("AUTH_EXPIRED");

  const user = JSON.parse(params.get("user") || "{}");
  if (!ADMIN_IDS.has(String(user.id))) throw new Error("FORBIDDEN");
  return user;
}

function detectImageMime(bytes) {
  if (bytes.length >= 3 && bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) {
    return "image/jpeg";
  }

  if (
    bytes.length >= 8 &&
    bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
  ) {
    return "image/png";
  }

  if (
    bytes.length >= 12 &&
    bytes.subarray(0, 4).toString("ascii") === "RIFF" &&
    bytes.subarray(8, 12).toString("ascii") === "WEBP"
  ) {
    return "image/webp";
  }

  return null;
}

const slugify = (value) =>
  String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function uniqueSlug(name) {
  const base = slugify(name) || `produk-${Date.now()}`;
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", base)
    .maybeSingle();
  if (error) throw error;
  return data ? `${base}-${crypto.randomUUID().slice(0, 8)}` : base;
}

async function nextSortOrder() {
  const { data, error } = await supabase
    .from("products")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (error) throw error;
  return Number(data?.sort_order || 0) + 10;
}

async function handleCategories(res) {
  const { data, error } = await supabase
    .from("collection_categories")
    .select("id,name")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  json(res, 200, { categories: data || [] });
}

async function handleImageUpload(req, res, user) {
  const declaredMime = String(req.headers["content-type"] || "")
    .split(";")[0]
    .trim()
    .toLowerCase();
  const contentLength = Number(req.headers["content-length"] || 0);

  if (!MIME_EXTENSIONS.has(declaredMime)) throw new Error("BAD_FILE_TYPE");
  if (contentLength > MAX_IMAGE_BYTES) throw new Error("FILE_TOO_LARGE");

  const bytes = await readBinaryBody(req, MAX_IMAGE_BYTES);
  const detectedMime = detectImageMime(bytes);
  if (!detectedMime || detectedMime !== declaredMime) throw new Error("INVALID_IMAGE");

  const extension = MIME_EXTENSIONS.get(detectedMime);
  const date = new Date().toISOString().slice(0, 10);
  const storagePath = `miniapp/${user.id}/${date}/${crypto.randomUUID()}.${extension}`;
  const { error } = await supabase.storage.from(PRODUCT_BUCKET).upload(storagePath, bytes, {
    contentType: detectedMime,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(storagePath);
  json(res, 201, {
    image: {
      url: data.publicUrl,
      storagePath,
      contentType: detectedMime,
      size: bytes.length,
    },
  });
}

function normalizeImageUrls(values) {
  return Array.from(
    new Set(
      values
        .map((value) => String(value || "").trim())
        .filter(Boolean),
    ),
  ).slice(0, MAX_IMAGES_PER_PRODUCT);
}

function validStoragePaths(paths, user) {
  const prefix = `miniapp/${user.id}/`;
  return Array.from(
    new Set(
      (Array.isArray(paths) ? paths : [])
        .map((value) => String(value || "").trim())
        .filter((value) => value.startsWith(prefix)),
    ),
  ).slice(0, MAX_IMAGES_PER_PRODUCT);
}

async function cleanupImages(paths, user) {
  const safePaths = validStoragePaths(paths, user);
  if (safePaths.length === 0) return;
  const { error } = await supabase.storage.from(PRODUCT_BUCKET).remove(safePaths);
  if (error) console.error("Gagal membersihkan upload Mini App:", error.message);
}

function isMissingImageGalleryColumn(error) {
  return Boolean(
    error &&
      (error.code === "42703" || String(error.message || "").toLowerCase().includes("image_urls")),
  );
}

async function insertProduct(payload) {
  let result = await supabase
    .from("products")
    .insert(payload)
    .select("id,product_code,name,slug,status")
    .single();

  if (isMissingImageGalleryColumn(result.error)) {
    const legacyPayload = { ...payload };
    delete legacyPayload.image_urls;
    result = await supabase
      .from("products")
      .insert(legacyPayload)
      .select("id,product_code,name,slug,status")
      .single();
  }

  return result;
}

async function handleProductRequest(req, res, user) {
  const body = await readJsonBody(req);

  if (body.action === "cleanupUploads") {
    await cleanupImages(body.storagePaths, user);
    json(res, 200, { ok: true });
    return;
  }

  const name = String(body.name || "").trim();
  const productCode = String(body.productCode || "").trim().toUpperCase();
  const basePrice = Number(body.basePrice);
  const imageColor = String(body.imageColor || "#e6d8c2");
  const imageUrls = normalizeImageUrls([
    ...(Array.isArray(body.imageUrls) ? body.imageUrls : []),
    body.imageUrl,
  ]);
  const storagePaths = validStoragePaths(body.imageStoragePaths, user);

  if (!name || name.length > 160) throw new Error("Nama produk wajib diisi.");
  if (productCode && !/^[A-Z0-9][A-Z0-9-]{1,39}$/.test(productCode)) {
    throw new Error("Kode produk tidak valid.");
  }
  if (!Number.isSafeInteger(basePrice) || basePrice < 0) throw new Error("Harga tidak valid.");
  if (!/^#[0-9a-f]{6}$/i.test(imageColor)) {
    throw new Error("Warna pratinjau tidak valid.");
  }

  const [slug, sortOrder] = await Promise.all([uniqueSlug(name), nextSortOrder()]);
  const payload = {
    slug,
    ...(productCode ? { product_code: productCode } : {}),
    name,
    category_id: body.categoryId || null,
    description: String(body.description || "").trim() || null,
    base_price: basePrice,
    image_url: imageUrls[0] || null,
    image_urls: imageUrls,
    image_color: imageColor,
    best_for: String(body.bestFor || "").trim() || null,
    status: body.status === "approved" ? "approved" : "draft",
    sort_order: sortOrder,
  };

  const { data, error } = await insertProduct(payload);
  if (error) {
    await cleanupImages(storagePaths, user);
    throw error;
  }

  await supabase.from("telegram_product_imports").insert({
    telegram_user_id: user.id,
    chat_id: user.id,
    message_id: Date.now(),
    status: "success",
    product_id: data.id,
    payload: {
      source: "mini_app",
      telegram_username: user.username || null,
      image_count: imageUrls.length,
    },
    processed_at: new Date().toISOString(),
  });

  json(res, 201, { product: data });
}

function errorStatus(message) {
  if (message === "UNAUTHORIZED" || message === "AUTH_EXPIRED") return 401;
  if (message === "FORBIDDEN") return 403;
  if (message === "FILE_TOO_LARGE" || message === "PAYLOAD_TOO_LARGE") return 413;
  if (
    ["INVALID_JSON", "BAD_FILE_TYPE", "INVALID_IMAGE", "EMPTY_FILE"].includes(message)
  ) {
    return 400;
  }
  return 500;
}

function publicErrorMessage(message, status) {
  if (message === "FILE_TOO_LARGE") return "Ukuran gambar maksimal 10 MB.";
  if (message === "BAD_FILE_TYPE") return "Format gambar harus JPG, PNG, atau WebP.";
  if (message === "INVALID_IMAGE") return "Isi file tidak sesuai dengan format gambar.";
  if (message === "EMPTY_FILE") return "File gambar kosong.";
  if (message === "PAYLOAD_TOO_LARGE") return "Data formulir terlalu besar.";
  if (message === "INVALID_JSON") return "Format permintaan tidak valid.";
  return status === 500 && message === "UNKNOWN" ? "Gagal memproses permintaan." : message;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "GET" && req.url === "/health") {
      return json(res, 200, { ok: true, service: "telegram-product-api" });
    }

    const user = authorize(req);
    if (req.method === "GET" && req.url === "/categories") {
      return await handleCategories(res);
    }
    if (
      req.method === "POST" &&
      req.url === "/products" &&
      req.headers["x-luse-action"] === "upload-image"
    ) {
      return await handleImageUpload(req, res, user);
    }
    if (req.method === "POST" && req.url === "/products") {
      return await handleProductRequest(req, res, user);
    }

    json(res, 404, { error: "Not found" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNKNOWN";
    const status = errorStatus(message);
    console.error("Telegram product API:", error);
    json(res, status, { error: publicErrorMessage(message, status) });
  }
});

server.listen(PORT, HOST, () =>
  console.log(`Telegram Product API listening at http://${HOST}:${PORT}`),
);
