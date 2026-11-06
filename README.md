# AI Custom Website Builder (Prototype)

Prototipe aplikasi pembuat website berbasis AI dan Drag & Drop yang dirancang praktis untuk siapa saja yang ingin membuat website profesional secara instan tanpa perlu keahlian koding, sesuai dengan spesifikasi dokumen **Product Requirement Document (PRD)**.

---

## 🎯 Fitur Baru: Drag & Drop Item & Komponen ke Kanvas

Sesuai permintaan Anda, kini kanvas dapat diisi secara visual dengan **Drag & Drop**:
1. **Palet Item di Sisi Kiri:**
   - Berisi daftar item produk/menu makanan yang sudah dibuat dan siap pakai (Sate Madura, Rendang Daging, Soto Betawi, Bakso Urat, Es Kopi Susu, dll).
   - Dilengkapi form cepat **"Buat Item Baru"** untuk membuat item sendiri dan langsung dimasukkan ke palet.
2. **Tarik (Drag) & Lepas (Drop) ke Kanvas:**
   - Klik dan tahan (drag) kartu item dari palet samping sebelah kiri.
   - Arahkan ke kotak oranye bertuliskan **"TARIK (DRAG) ITEM DARI PALET SAMPING & LEPASKAN (DROP) DI SINI"** di dalam bagian Katalog.
   - Lepaskan (drop) mouse! Item otomatis masuk ke dalam list (`List<Product>`) dan langsung di-loop tampil di kanvas.
3. **Opsi 1-Klik "+ Taruh":**
   - Setiap kartu item di palet juga memiliki tombol cepat **`+ Taruh`**, sehingga Anda juga bisa memasukkan item ke kanvas hanya dengan sekali klik tanpa harus menarik mouse!
4. **Drag & Drop Bagian Website:**
   - Tab **"Bagian Web"** di palet samping memungkinkan Anda menarik komponen baru (Hero, About, Catalog, Contact, Footer) dan menjatuhkannya di sela-sela komponen kanvas.

---

## 📌 Lokasi Integrasi API Key (Google AI Studio Gemini)

Integrasi API dapat dilakukan secara manual melalui **2 cara mudah**:

### Cara 1: Langsung di Dalam File Kode (Sudah Diberi Tanda Jelas)
Buka file:
📁 **[`js/api.js`](file:///d:/Website%20Builder%20AI%20Demo/js/api.js#L14-L35)**

Cari blok komentar besar berikut:
```javascript
/* ======================================================================================
 * >>>>>>>>>>>>>>>>>>>>> [TEMPAT TARUH API KEY GEMINI DI SINI] <<<<<<<<<<<<<<<<<<<<<<<<
 * Silakan ganti string di bawah ini dengan Google AI Studio API Key milik Anda.
 * Dapatkan API Key gratis di: https://aistudio.google.com/app/apikey
 * ====================================================================================== */
const CONFIG_GEMINI = {
  // GANTI VALUE DI BAWAH DENGAN API KEY ANDA:
  API_KEY: 'MASUKKAN_GEMINI_API_KEY_ANDA_DI_SINI', 

  // Model resmi Gemini Flash terbaru (gemini-3.1-flash-lite)
  MODEL_NAME: 'gemini-3.1-flash-lite',

  // Endpoint resmi Google AI Studio
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models'
};
/* ======================================================================================
 * >>>>>>>>>>>>>>>>>>>>> [AKHIR TEMPAT TARUH API KEY] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * ====================================================================================== */
```

### Cara 2: Lewat Antarmuka Web (UI)
1. Buka website di browser.
2. Login ke Canvas Editor.
3. Klik tombol **"API Key"** di pojok kanan atas bilah navigasi.
4. Tempelkan Google AI Studio API Key Anda, lalu klik **"Simpan Kunci API"**.

> 💡 **Offline Fallback Interpreter:** Jika API Key belum diisi, website tetap bisa dicoba langsung karena sudah dilengkapi intepreter lokal bawaan.

---

## 🛡️ Proteksi `try...catch` Komprehensif (Bebas Error Crash)

Sesuai instruksi Anda:
- Seluruh pemanggilan jaringan `fetch`, parsing JSON Gemini, inisialisasi sesi, proses drag & drop, penambahan/penghapusan item, hingga manipulasi DOM telah dibungkus blok `try...catch`.
- Sesuai **AC-4.4**, jika kuota harian/rate-limit habis atau terjadi kegagalan jaringan, web menampilkan notifikasi peringatan fallback:
  > *"Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi."*

---

## 🚀 Cara Menjalankan Website

1. Buka file **[`index.html`](file:///d:/Website%20Builder%20AI%20Demo/index.html)** langsung di browser Anda.
2. Login dengan akun demo:
   - **Email:** `pemilik@umkm.id`
   - **Kata Sandi:** `demo123`
   *(Atau klik tombol **"Isi Otomatis Kredensial Demo"**)*

---

## 💬 Contoh Perintah Kasual AI yang Didukung

- *"Tambah item Soto Betawi Daging harga 35000"*
- *"Tambah item Es Jeruk Segar harga 8000"*
- *"Ganti judul toko jadi Warung Barokah Bu Siti"*
- *"Ubah slogan jadi Resep Asli Warisan Nenek Sejak 1990"*
- *"Hapus bagian kontak"*
