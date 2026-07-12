const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN?.trim();
const MINI_APP_URL =
  process.env.TELEGRAM_MINI_APP_URL?.trim() ||
  "https://lusebylucy.com/telegram/products/new";
const MENU_TEXT = process.env.TELEGRAM_MINI_APP_MENU_TEXT?.trim() || "Tambah Produk";

if (!BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN wajib diisi.");
}

if (!/^https:\/\//i.test(MINI_APP_URL)) {
  throw new Error("TELEGRAM_MINI_APP_URL wajib memakai HTTPS.");
}

const telegramBaseUrl = `https://api.telegram.org/bot${BOT_TOKEN}`;

async function telegramRequest(method, payload = {}) {
  const response = await fetch(`${telegramBaseUrl}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(data.description || `Telegram API ${method} gagal.`);
  }

  return data.result;
}

const bot = await telegramRequest("getMe");

await telegramRequest("setChatMenuButton", {
  menu_button: {
    type: "web_app",
    text: MENU_TEXT,
    web_app: { url: MINI_APP_URL },
  },
});

await telegramRequest("setMyCommands", {
  scope: { type: "all_private_chats" },
  commands: [
    { command: "start", description: "Buka menu LUSE Product Bot" },
    { command: "produk", description: "Tambah produk melalui caption" },
    { command: "categories", description: "Lihat kategori aktif" },
    { command: "id", description: "Lihat Telegram user ID" },
    { command: "help", description: "Lihat panduan penggunaan" },
  ],
});

const configuredButton = await telegramRequest("getChatMenuButton");

console.log(`Bot: @${bot.username}`);
console.log(`Mini App URL: ${MINI_APP_URL}`);
console.log(`Menu button: ${JSON.stringify(configuredButton)}`);
console.log("Telegram Mini App menu berhasil dikonfigurasi.");
