import crypto from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const SUPABASE_URL = process.env.SUPABASE_URL?.trim();
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
const PRODUCT_BUCKET = process.env.TELEGRAM_PRODUCT_BUCKET?.trim() || "product-images";
const DEFAULT_STATUS = process.env.TELEGRAM_PRODUCT_DEFAULT_STATUS?.trim() || "draft";
const ADMIN_PRODUCT_URL =
  process.env.TELEGRAM_ADMIN_PRODUCT_URL?.trim() ||
  "https://lusebylucy.com/admin/products";
const POLL_TIMEOUT_SECONDS = Number.parseInt(
  process.env.TELEGRAM_POLL_TIMEOUT_SECONDS || "25",
  10,
);
const RETRY_DELAY_MS = 3_000;
const MAX_CAPTION_LENGTH = 4_096;
const VALID_STATUSES = new Set(["draft", "approved", "archived"]);
const PRODUCT_CODE_PATTERN = /^[A-Z0-9][A-Z0-9-]{1,39}$/;

const ADMIN_IDS = new Set(
  (process.env.TELEGRAM_ADMIN_IDS || "")
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean),
);

for (const [name, value] of Object.entries({
  TELEGRAM_BOT_TOKEN: BOT_TOKEN,
  SUPABASE_URL,
  SUPABASE_SERVICE_ROLE_KEY,
})) {
  if (!value) {
    throw new Error(`${name} wajib diisi.`);
  }
}

if (!VALID_STATUSES.has(DEFAULT_STATUS)) {
  throw new Error(
    "TELEGRAM_PRODUCT_DEFAULT_STATUS harus draft, approved, atau archived.",
  );
}

if (ADMIN_IDS.size === 0) {
  throw new Error("TELEGRAM_ADMIN_IDS wajib berisi minimal satu Telegram user ID.");
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

const telegramBaseUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;
const telegramFileBaseUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}`;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function telegramRequest(method, payload = {}, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(`${telegramBaseUrl}/${method}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    const data = await response.json();
    if (!response.ok || !data.ok) {
      throw new Error(data.description || `Telegram API ${method} gagal.`);
    }

    return data.result;
  } finally {
    clearTimeout(timeout);
  }
}

async function sendMessage(chatId, text) {
  return telegramRequest("sendMessage", {
    chat_id: chatId,
    text,
    parse_mode: "HTML",
    disable_web_page_preview: true,
  });
}

const escapeHtml = (value) =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");

const normalizeKey = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

const FIELD_ALIASES = new Map([
  ["kode", "productCode"],
  ["kode produk", "productCode"],
  ["product code", "productCode"],
  ["sku", "productCode"],
  ["nama", "name"],
  ["nama produk", "name"],
  ["produk", "name"],
  ["harga", "price"],
  ["harga dasar", "price"],
  ["kategori", "category"],
  ["category", "category"],
  ["deskripsi", "description"],
  ["description", "description"],
  ["cocok untuk", "bestFor"],
  ["best for", "bestFor"],
  ["status", "status"],
  ["urutan", "sortOrder"],
  ["sort", "sortOrder"],
  ["warna", "imageColor"],
  ["warna preview", "imageColor"],
]);

function parseProductCaption(rawText) {
  const text = String(rawText || "").trim();
  if (!text || text.length > MAX_CAPTION_LENGTH) {
    throw new Error("Caption produk kosong atau terlalu panjang.");
  }

  const lines = text.split(/\r?\n/);
  if (/^\/produk(?:@\w+)?(?:\s|$)/i.test(lines[0])) {
    lines[0] = lines[0].replace(/^\/produk(?:@\w+)?\s*/i, "");
    if (!lines[0]) lines.shift();
  }

  const parsed = {};
  let currentField = null;

  for (const line of lines) {
    const match = line.match(/^\s*([^:]{1,40})\s*:\s*(.*)$/);
    if (match) {
      const field = FIELD_ALIASES.get(normalizeKey(match[1]));
      if (field) {
        parsed[field] = match[2].trim();
        currentField = field;
        continue;
      }
    }

    if (currentField && line.trim()) {
      parsed[currentField] = `${parsed[currentField]}\n${line.trim()}`.trim();
    }
  }

  if (!parsed.name) throw new Error("Field Nama wajib diisi.");
  if (!parsed.price) throw new Error("Field Harga wajib diisi.");

  const price = Number(String(parsed.price).replace(/[^0-9]/g, ""));
  if (!Number.isSafeInteger(price) || price < 0) {
    throw new Error("Harga harus berupa angka rupiah yang valid.");
  }

  const productCode = parsed.productCode?.trim().toUpperCase() || null;
  if (productCode && !PRODUCT_CODE_PATTERN.test(productCode)) {
    throw new Error(
      "Kode produk harus 2-40 karakter dan hanya berisi huruf, angka, atau tanda hubung.",
    );
  }

  let status = normalizeKey(parsed.status || DEFAULT_STATUS);
  if (["publish", "published", "publik", "disetujui"].includes(status)) {
    status = "approved";
  } else if (["arsip", "diarsipkan"].includes(status)) {
    status = "archived";
  }

  if (!VALID_STATUSES.has(status)) {
    throw new Error("Status harus draft, approved, atau archived.");
  }

  let sortOrder = null;
  if (parsed.sortOrder) {
    sortOrder = Number.parseInt(parsed.sortOrder, 10);
    if (!Number.isInteger(sortOrder)) {
      throw new Error("Urutan harus berupa angka bulat.");
    }
  }

  const imageColor = parsed.imageColor?.trim() || "#e6d8c2";
  if (!/^#[0-9a-f]{6}$/i.test(imageColor)) {
    throw new Error("Warna preview harus berupa hex, contoh #e6d8c2.");
  }

  return {
    productCode,
    name: parsed.name.trim(),
    price,
    category: parsed.category?.trim() || null,
    description: parsed.description?.trim() || null,
    bestFor: parsed.bestFor?.trim() || null,
    status,
    sortOrder,
    imageColor,
  };
}

const slugify = (value) =>
  value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function createUniqueSlug(name) {
  const baseSlug = slugify(name) || `produk-${Date.now()}`;
  const { data, error } = await supabase
    .from("products")
    .select("id")
    .eq("slug", baseSlug)
    .maybeSingle();

  if (error) throw error;
  return data ? `${baseSlug}-${crypto.randomUUID().slice(0, 8)}` : baseSlug;
}

async function getNextSortOrder() {
  const { data, error } = await supabase
    .from("products")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return Number(data?.sort_order || 0) + 10;
}

async function listCategories() {
  const { data, error } = await supabase
    .from("collection_categories")
    .select("id, name, slug, is_active")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error) throw error;
  return data || [];
}

async function resolveCategory(categoryValue) {
  if (!categoryValue) return null;

  const categories = await listCategories();
  const target = normalizeKey(categoryValue);
  const match = categories.find(
    (category) =>
      normalizeKey(category.name) === target || normalizeKey(category.slug) === target,
  );

  if (!match) {
    const choices = categories.map((category) => category.slug).join(", ");
    throw new Error(
      `Kategori “${categoryValue}” tidak ditemukan. Pilihan: ${choices || "belum ada"}.`,
    );
  }

  return match.id;
}

async function downloadTelegramPhoto(message) {
  const photos = Array.isArray(message.photo) ? message.photo : [];
  if (photos.length === 0) return null;

  const selected = photos.at(-1);
  const file = await telegramRequest("getFile", { file_id: selected.file_id });
  const response = await fetch(`${telegramFileBaseUrl}/${file.file_path}`);
  if (!response.ok) throw new Error("Gagal mengunduh foto dari Telegram.");

  return {
    bytes: Buffer.from(await response.arrayBuffer()),
    fileUniqueId: selected.file_unique_id,
    contentType: "image/jpeg",
    extension: "jpg",
  };
}

async function uploadProductImage(photo, message) {
  if (!photo) return null;

  const date = new Date().toISOString().slice(0, 10);
  const safeUniqueId = photo.fileUniqueId.replace(/[^a-zA-Z0-9_-]/g, "");
  const objectPath = `telegram/${date}/${message.chat.id}-${message.message_id}-${safeUniqueId}.${photo.extension}`;

  const { error } = await supabase.storage
    .from(PRODUCT_BUCKET)
    .upload(objectPath, photo.bytes, {
      contentType: photo.contentType,
      cacheControl: "31536000",
      upsert: false,
    });

  if (error) throw error;

  const { data } = supabase.storage.from(PRODUCT_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

async function beginImport(update, message) {
  const payload = {
    update_id: update.update_id,
    telegram_user_id: message.from?.id ?? null,
    chat_id: message.chat.id,
    message_id: message.message_id,
    status: "processing",
    payload: {
      text: message.caption || message.text || null,
      telegram_username: message.from?.username || null,
      has_photo: Array.isArray(message.photo) && message.photo.length > 0,
    },
  };

  const { data, error } = await supabase
    .from("telegram_product_imports")
    .insert(payload)
    .select("id")
    .single();

  if (error?.code === "23505") return null;
  if (error) throw error;
  return data.id;
}

async function finishImport(importId, values) {
  if (!importId) return;

  const { error } = await supabase
    .from("telegram_product_imports")
    .update({ ...values, processed_at: new Date().toISOString() })
    .eq("id", importId);

  if (error) console.error("Gagal memperbarui audit import:", error.message);
}

async function createProductFromMessage(update, message) {
  const importId = await beginImport(update, message);
  if (!importId) {
    await sendMessage(message.chat.id, "Pesan ini sudah pernah diproses.");
    return;
  }

  try {
    const input = parseProductCaption(message.caption || message.text);
    const [categoryId, photo] = await Promise.all([
      resolveCategory(input.category),
      downloadTelegramPhoto(message),
    ]);
    const imageUrl = await uploadProductImage(photo, message);
    const slug = await createUniqueSlug(input.name);
    const sortOrder = input.sortOrder ?? (await getNextSortOrder());

    const { data: product, error } = await supabase
      .from("products")
      .insert({
        slug,
        ...(input.productCode ? { product_code: input.productCode } : {}),
        name: input.name,
        category_id: categoryId,
        description: input.description,
        base_price: input.price,
        image_url: imageUrl,
        image_color: input.imageColor,
        best_for: input.bestFor,
        status: input.status,
        sort_order: sortOrder,
        created_by: null,
      })
      .select("id, product_code, name, slug, status, base_price")
      .single();

    if (error) {
      if (error.code === "23505" && error.message?.includes("product_code")) {
        throw new Error("Kode produk sudah digunakan. Kosongkan Kode agar dibuat otomatis.");
      }
      throw error;
    }

    await finishImport(importId, {
      status: "success",
      product_id: product.id,
      error_message: null,
    });

    await sendMessage(
      message.chat.id,
      [
        "✅ <b>Produk berhasil masuk ke database.</b>",
        `Kode: <code>${escapeHtml(product.product_code)}</code>`,
        `Nama: <b>${escapeHtml(product.name)}</b>`,
        `Harga: Rp${Number(product.base_price).toLocaleString("id-ID")}`,
        `Status: ${escapeHtml(product.status)}`,
        `Slug: <code>${escapeHtml(product.slug)}</code>`,
        `Kelola: ${escapeHtml(ADMIN_PRODUCT_URL)}`,
      ].join("\n"),
    );
  } catch (error) {
    const messageText = error instanceof Error ? error.message : "Import produk gagal.";
    await finishImport(importId, {
      status: "failed",
      error_message: messageText.slice(0, 2_000),
    });

    await sendMessage(
      message.chat.id,
      `❌ <b>Produk gagal disimpan.</b>\n${escapeHtml(messageText)}\n\nKetik /help untuk melihat format.`,
    );
  }
}

function isAdmin(message) {
  return ADMIN_IDS.has(String(message.from?.id || ""));
}

async function handleMessage(update) {
  const message = update.message;
  if (!message?.chat?.id || !message.from?.id) return;

  const text = String(message.text || message.caption || "").trim();
  const command = text.match(/^\/(\w+)(?:@\w+)?/i)?.[1]?.toLowerCase();

  if (command === "id") {
    await sendMessage(
      message.chat.id,
      `Telegram user ID Anda: <code>${message.from.id}</code>`,
    );
    return;
  }

  if (!isAdmin(message)) {
    await sendMessage(
      message.chat.id,
      "Akses ditolak. Kirim /id lalu tambahkan ID tersebut ke TELEGRAM_ADMIN_IDS di VPS.",
    );
    return;
  }

  if (command === "start" || command === "help") {
    await sendMessage(
      message.chat.id,
      [
        "<b>LUSE Product Bot</b>",
        "Kirim foto produk dengan caption berikut:",
        "",
        "<code>/produk",
        "Kode: LU-0079 (opsional, kosongkan untuk otomatis)",
        "Nama: Satin Moon Pajama",
        "Harga: 289000",
        "Kategori: pajama-set",
        "Deskripsi: Set piyama satin lembut.",
        "Cocok untuk: Tidur dan bersantai",
        "Status: draft",
        "Warna: #e6d8c2</code>",
        "",
        "Perintah: /categories, /id, /help",
      ].join("\n"),
    );
    return;
  }

  if (command === "categories") {
    const categories = await listCategories();
    const lines = categories.map(
      (category) => `• ${escapeHtml(category.name)} — <code>${escapeHtml(category.slug)}</code>`,
    );
    await sendMessage(
      message.chat.id,
      `<b>Kategori aktif</b>\n${lines.join("\n") || "Belum ada kategori."}`,
    );
    return;
  }

  if (command === "produk") {
    await createProductFromMessage(update, message);
    return;
  }

  await sendMessage(message.chat.id, "Perintah tidak dikenali. Ketik /help.");
}

async function startPolling() {
  let offset = 0;
  console.log(
    `LUSE Telegram Product Bot aktif untuk ${ADMIN_IDS.size} admin, bucket ${PRODUCT_BUCKET}.`,
  );

  while (true) {
    try {
      const updates = await telegramRequest(
        "getUpdates",
        {
          offset,
          timeout: POLL_TIMEOUT_SECONDS,
          allowed_updates: ["message"],
        },
        (POLL_TIMEOUT_SECONDS + 10) * 1_000,
      );

      for (const update of updates) {
        offset = Math.max(offset, update.update_id + 1);
        try {
          await handleMessage(update);
        } catch (error) {
          console.error("Gagal memproses update Telegram:", error);
        }
      }
    } catch (error) {
      console.error("Polling Telegram gagal:", error.message || error);
      await sleep(RETRY_DELAY_MS);
    }
  }
}

process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));

await startPolling();
