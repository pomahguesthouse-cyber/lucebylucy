# Telegram Product Import — LUSE

Integrasi ini memungkinkan admin mengirim foto dan data produk melalui Telegram. Bot akan:

1. Memastikan pengirim ada di `TELEGRAM_ADMIN_IDS`.
2. Membaca caption produk.
3. Memvalidasi kategori, harga, status, dan warna.
4. Mengunggah foto ke Supabase Storage bucket `product-images`.
5. Menambahkan produk ke tabel `public.products`.
6. Menyimpan audit dan deduplikasi di `public.telegram_product_imports`.
7. Membalas hasil import ke Telegram.

## 1. Buat bot melalui BotFather

Di Telegram:

1. Buka `@BotFather`.
2. Jalankan `/newbot`.
3. Simpan token bot.
4. Atur command melalui `/setcommands`:

```text
produk - Tambahkan produk ke database
categories - Lihat slug kategori aktif
id - Lihat Telegram user ID
help - Lihat format produk
```

Jangan meletakkan token bot di frontend, GitHub, atau file yang ikut di-commit.

## 2. Jalankan migrasi Supabase

Jalankan migration berikut melalui Supabase CLI atau SQL Editor:

```text
supabase/migrations/20260712000200_add_telegram_product_import.sql
```

Migration membuat:

- tabel audit `telegram_product_imports`;
- bucket publik `product-images`;
- policy baca gambar produk;
- policy admin untuk melihat audit import.

## 3. Ambil Telegram user ID admin

Bot menyediakan command `/id` sebelum whitelist diperiksa.

1. Jalankan bot sementara dengan ID placeholder milik Anda, atau gunakan API/bot ID checker.
2. Kirim `/id` ke bot.
3. Salin angka yang dibalas.
4. Masukkan angka tersebut ke `TELEGRAM_ADMIN_IDS`.

Beberapa admin dapat ditulis dengan koma:

```env
TELEGRAM_ADMIN_IDS=123456789,987654321
```

Whitelist memakai **Telegram user ID**, bukan username dan bukan nomor telepon.

## 4. Buat environment file di VPS

```bash
sudo mkdir -p /etc/luse
sudo nano /etc/luse/telegram-product-bot.env
```

Isi berdasarkan `server/telegram-product-bot.env.example`:

```env
TELEGRAM_BOT_TOKEN=TOKEN_DARI_BOTFATHER
TELEGRAM_ADMIN_IDS=TELEGRAM_USER_ID_ADMIN
SUPABASE_URL=https://PROJECT_REF.supabase.co
SUPABASE_SERVICE_ROLE_KEY=SERVICE_ROLE_KEY_SUPABASE
TELEGRAM_PRODUCT_BUCKET=product-images
TELEGRAM_PRODUCT_DEFAULT_STATUS=draft
TELEGRAM_ADMIN_PRODUCT_URL=https://lusebylucy.com/admin/products
TELEGRAM_POLL_TIMEOUT_SECONDS=25
```

Amankan file:

```bash
sudo chmod 600 /etc/luse/telegram-product-bot.env
```

`SUPABASE_SERVICE_ROLE_KEY` adalah secret backend dan tidak boleh menggunakan prefix `VITE_`.

## 5. Pastikan bot memakai long polling

Jika bot pernah memakai webhook, hapus webhook sebelum menjalankan service polling:

```bash
source /etc/luse/telegram-product-bot.env
curl -s "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/deleteWebhook?drop_pending_updates=true"
```

## 6. Pasang service systemd

Dari folder repository di VPS:

```bash
cd /var/www/lusebylucy
npm ci

sudo cp deploy/systemd/luse-telegram-product-bot.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now luse-telegram-product-bot
sudo systemctl status luse-telegram-product-bot --no-pager
```

Pantau log:

```bash
journalctl -u luse-telegram-product-bot -f
```

Setelah pull/deploy kode baru:

```bash
cd /var/www/lusebylucy
git pull origin main
npm ci
sudo systemctl restart luse-telegram-product-bot
```

## 7. Tampilkan tombol Telegram di halaman Settings

Tambahkan username bot ke environment frontend saat build:

```env
VITE_TELEGRAM_BOT_USERNAME=luse_product_bot
```

Kemudian rebuild frontend:

```bash
npm run build
```

## Format kirim produk

Kirim foto produk dengan caption:

```text
/produk
Nama: Satin Moon Pajama
Harga: 289000
Kategori: pajama-set
Deskripsi: Set piyama satin lembut dan nyaman.
Cocok untuk: Tidur malam dan bersantai
Status: draft
Warna: #e6d8c2
```

Field wajib:

- `Nama`
- `Harga`

Field opsional:

- `Kategori` — harus sama dengan nama atau slug kategori aktif;
- `Deskripsi`;
- `Cocok untuk`;
- `Status` — `draft`, `approved`, atau `archived`;
- `Warna` — hex enam digit;
- `Urutan` — angka bulat.

Foto bersifat opsional. Tanpa foto, produk tetap dibuat dengan `image_url = null`.

Gunakan `/categories` untuk melihat slug kategori yang valid.

## Keamanan

- Hanya Telegram user ID dalam whitelist yang dapat membuat produk.
- Token bot dan service-role key hanya berada di environment backend VPS.
- Update Telegram disimpan berdasarkan `update_id` serta `(chat_id, message_id)` agar pesan yang sama tidak membuat produk ganda.
- Produk default dibuat sebagai `draft`, kecuali environment atau caption menentukan status lain.
- Semua keberhasilan dan kegagalan dicatat pada `telegram_product_imports`.
