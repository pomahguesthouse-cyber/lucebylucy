# Product image upload

- Admin dapat memilih beberapa file JPG, PNG, atau WebP dari perangkat lokal.
- File diunggah ke bucket publik `product-images` pada folder per admin dan tanggal.
- Gambar yang diberi tanda centang menjadi cover dan disimpan sebagai urutan pertama `image_urls` sekaligus `image_url` kompatibilitas.
- Maksimal 10 file dalam satu proses upload dan 10 MB per file.
