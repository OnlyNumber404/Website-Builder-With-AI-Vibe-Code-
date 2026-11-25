# 🚀 NexaWeb.ai (v2.0.0) — Modern AI Website Builder

> **Platform Pembuat Website Berbasis AI & Freeform Visual Canvas Generasi Baru untuk UMKM & Kreator Indonesia.**  
> Bangun website profesional, responsif, dan siap rilis hanya dalam hitungan detik menggunakan kekuatan **Gemini AI** dan kanvas visual bebas berpresisi tinggi.

---

## 🌟 Ikhtisar Aplikasi

**NexaWeb.ai** adalah platform pembuat website modern berbasis **Next.js 14 (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Framer Motion**. Aplikasi ini menghadirkan dua mode pembuatan website yang fleksibel:

1. **Mode Standar (`/studio`)**: Pembuatan website berbasis blok section terstruktur (Hero, Katalog, Tentang Kami, Kontak, Footer) dengan kustomisasi cepat dan asistensi AI Copilot.
2. **Mode Advance Studio (`/studio/advance`)**: Editor kanvas visual bebas (*freeform infinite canvas*) dengan kontrol desain tingkat tinggi, multi-kanvas halaman, shape vektor, masking gambar, multi-select, precision snap, dan **NexaWeb AI Architect Pro** yang mampu merancang seluruh halaman website secara otomatis disertai animasi kursor live!

---

## ✨ Fitur Unggulan Mode Advance Studio (`/studio/advance`)

### 1. 🤖 NexaWeb AI Architect Pro & Live Animated Cursor
- **Auto-Build Multi-Kanvas**: Cukup masukkan prompt kasual bahasa manusia (contoh: *"Buatkan website UMKM penjualan donat yang memiliki 4 produk donat, ada tombol kontak nomor HP, dan bagian about"*), AI akan langsung membuatkan kanvas-kanvas baru yang tertata rapi dari Navbar, Hero Banner, Grid Katalog Produk, Cerita Tentang Kami, hingga Tombol Kontak WhatsApp.
- **Animasi Kursor AI Interaktif**: Kanvas menampilkan kursor bercahaya (*glowing live cursor*) lengkap dengan nama desainer AI, efek klik riak gelombang (*ripple*), dan kartu progres melayang saat AI meletakkan dan menata elemen secara real-time.
- **Smart Business Engine & Gemini Fallback**: Terkoneksi dengan Google AI Studio (Gemini 2.0 Flash) dan dilengkapi dengan mesin heuristik bisnis cerdas offline jika API key belum dikonfigurasi.

### 2. 🔺 Geometric Shape Suite (10 Bentuk Vektor)
- **Koleksi Lengkap Bentuk**: Persegi (*Rectangle*), Kotak Halus (*Rounded Rect*), Bujur Sangkar (*Square*), Lingkaran/Elips (*Circle*), Segitiga (*Triangle*), Bintang 5 Sudut (*Star*), Hati (*Heart/Love*), Panah Kanan (*Arrow Right*), Hexagon (Segienam), dan Garis Pembatas Halus (*Divider Line*).
- **Kustomisasi Penuh**: Pengaturan warna isian (*fill*), palet preset, ketebalan border (0px–8px), kelengkungan sudut tajam hingga pill, serta efek bayangan (*drop shadow* halus s/d melayang).

### 3. 🎚️ Universal Opacity System (Slider Volume Bar & Preset)
- **Kontrol Transparansi Universal**: Tersedia pada setiap elemen (Teks, Shape, Gambar, Kartu Produk, Tombol, hingga Navbar).
- **Akses Cepat & Akurat**: Dilengkapi penggeser (*volume-bar slider*), input angka persentase manual (0%–100%), dan tombol pintas preset (`25%`, `50%`, `75%`, `100%`).
- **Antarmuka Rapi**: Toolbar satu baris yang bersih dengan *smart popover alignment* dinamis sehingga menu opsi tidak pernah terpotong keluar layar.

### 4. 🎭 Smart Masking & Image Clip System
- **Shape Overlap Masking**: Seleksi dua shape yang saling bertumpuk untuk membuat potongan bentuk artistik baru.
- **Image-to-Shape Masking**: Masukkan gambar/foto ke dalam bentuk geometris apa pun (lingkaran, rounded rectangle, bintang, hati, hexagon, dll.) menggunakan kliping SVG teroptimasi.
- **Deteksi Masking Otomatis**: Tombol *Masking* otomatis menyala di toolbar saat Anda memilih dua objek yang bersinggungan.

### 5. 🏷️ Kustomisasi Logo Perusahaan pada Navbar
- **Slot Logo Unggah**: Navigasi kini dapat menggunakan logo grafis asli perusahaan (format PNG, JPG, WebP, SVG) menggantikan teks biasa.
- **Tombol Penggantian Cepat**: Ganti gambar logo kapan saja langsung melalui tombol toolbar tanpa merusak susunan tautan menu.

### 6. ⚡ Multi-Select Marquee & GPU-Accelerated 60 FPS Drag
- **Kotak Seleksi Transparan (Marquee Drag)**: Klik dan tahan geser kursor di area kosong kanvas untuk menyeleksi banyak elemen sekaligus ala software desain profesional.
- **Shift + Click Multi-Select**: Tambah atau kurangi seleksi elemen dengan menahan tombol `Shift`.
- **Performa 60 FPS Halus**: Menggunakan akselerasi perangkat keras GPU (`transform: translate3d`) saat menggeser grup elemen, membebaskan kanvas dari lag dan re-render berat.
- **Bulk Editing**: Pindahkan, ubah transparansi, duplikat, atau hapus sekelompok elemen sekaligus dalam satu langkah.

### 7. 📐 Precision Design Controls & Smart Snap Lines
- **Shift-Proportional Resize**: Tahan tombol `Shift` saat menarik titik sudut elemen untuk mengunci rasio aspek (lebar dan tinggi membesar/mengecil seragam) disertai indikator dimensi *real-time* (`W x H px`).
- **Equal-Spacing Smart Snap**: Saat mengatur susunan objek (misalnya 3 atau 4 kartu produk), garis pandu otomatis muncul dan menampilkan jarak dalam piksel (`px`) ketika jarak antar elemen sudah seimbang.
- **Inner-Container & Margin Snap**: Garis pandu pengukur jarak otomatis saat menempatkan elemen di dalam kontainer lain atau mendekati tepi/sudut kanvas.
- **Micro-Movement Keyboard Nudge**: Geser elemen terpilih dengan tombol panah keyboard (`↑`, `↓`, `←`, `→`) sebesar `1px` per tekan untuk akurasi mikro, atau tahan `Shift + Arrow` untuk pergeseran `10px`.

### 8. 📦 Ekspor Website Mandiri & Smooth Scroll Navigation
- **One-Click Download ZIP**: Hasilkan paket website mandiri (HTML5 murni, CSS responsif teroptimasi, dan aset gambar).
- **Cubic Ease-in-Out Smooth Scroll**: Saat link menu navigasi diklik di website hasil ekspor, halaman berpindah secara halus dan elegan menuju kanvas target tanpa loncat kaku.
- **Modal Preview Ringan**: Preview langsung seluruh halaman web dengan scrolling mulus tanpa beban rendering berlebih.

---

## ⌨️ Panduan Tombol Pintas (Keyboard Shortcuts) di Mode Advance

| Shortcut | Aksi / Fungsi |
|---|---|
| **Drag Area Kosong** | Membuat kotak seleksi transparan (*Marquee Selection*) |
| **Shift + Klik** | Menambah / mengurangi elemen ke seleksi aktif |
| **Tahan Shift + Resize** | Mengunci perbandingan rasio aspek saat mengubah ukuran |
| **Tombol Panah (`↑ ↓ ← →`)** | Menggeser elemen sejauh **1px** (Micro-nudge presisi) |
| **Shift + Tombol Panah** | Menggeser elemen sejauh **10px** |
| **Ctrl + Z / Cmd + Z** | Undo (Batalkan perubahan terakhir) |
| **Delete / Backspace** | Menghapus elemen yang sedang dipilih |
| **Escape (Esc)** | Menghapus fokus seleksi elemen |

---

## 🛠️ Arsitektur & Teknologi

- **Frontend Framework**: [Next.js 14](https://nextjs.org/) (App Router & Server Components)
- **Bahasa Pemrograman**: [TypeScript](https://www.typescriptlang.org/)
- **Styling & UI**: [Tailwind CSS](https://tailwindcss.com/), [Lucide React Icons](https://lucide.dev/), [Canvas Confetti](https://www.npmjs.com/package/canvas-confetti)
- **Animasi**: [Framer Motion](https://www.framer.com/motion/)
- **Ekspor Arsip**: [JSZip](https://stuk.github.io/jszip/)
- **AI Core**: [Google AI Studio Gemini API](https://aistudio.google.com/) (`gemini-2.0-flash` / `gemini-1.5-flash`) dengan fallback mesin template bisnis lokal.

---

## 📁 Struktur Direktori Utama

```
├── app/
│   ├── api/
│   │   └── advance-ai/route.ts       # Endpoint AI Architect & generator struktur halaman
│   ├── about/page.tsx               # Halaman Tentang NexaWeb.ai & Misi UMKM
│   ├── studio/
│   │   ├── page.tsx                 # Studio Mode Standar (Block-based)
│   │   └── advance/page.tsx         # Studio Mode Advance (Freeform Multi-Canvas)
│   ├── layout.tsx                   # Layout global aplikasi
│   └── page.tsx                     # Landing page interaktif & showcase
├── components/
│   ├── advance/
│   │   ├── AdvanceAiCopilot.tsx      # Sidebar AI Architect dengan saran perintah
│   │   ├── AdvanceCanvasPage.tsx     # Engine utama kanvas, drag, snap, & kursor AI
│   │   ├── AdvanceContextualToolbar.tsx # Toolbar dinamis (opacity, border, masking, logo)
│   │   ├── AdvancePaletteSidebar.tsx # Palet elemen, 10 bentuk geometris, produk, nav
│   │   ├── AdvancePreviewModal.tsx   # Modal preview responsif multi-halaman
│   │   └── AdvanceShapeRenderer.tsx  # Komponen SVG renderer 10 bentuk geometris
│   ├── home/                        # Komponen interaktif di Landing Page
│   ├── studio/                      # Komponen untuk Studio Mode Standar
│   └── Navbar.tsx & Footer.tsx      # Navigasi utama aplikasi
├── lib/
│   ├── advanceAiEngine.ts           # Mesin heuristik arsitektur web otomatis
│   ├── advanceExport.ts             # Generator ekspor ZIP website mandiri (HTML/CSS/JS)
│   ├── advanceMaskUtils.ts          # Utilitas SVG clip-path & deteksi masking tumpuk
│   └── advanceTypes.ts              # Type definition elemen kanvas & konfigurasi
└── public/                          # Aset statis & gambar demo
```

---

## 🚀 Cara Menjalankan Proyek Secara Lokal

### 1. Prasyarat
- **Node.js** v18.17 atau lebih baru
- **npm**, **pnpm**, atau **yarn**

### 2. Instalasi Dependensi
```bash
# Clone repositori (jika belum)
git clone https://github.com/OnlyNumber404/Website-Builder-With-AI-Vibe-Code-.git
cd "Website Builder AI Demo"

# Install paket dependensi
npm install
```

### 3. Konfigurasi Google AI Studio (Opsional tapi Direkomendasikan)
Buat file `.env.local` di direktori utama:
```env
GEMINI_API_KEY=MASUKKAN_GEMINI_API_KEY_ANDA_DI_SINI
```
> *Catatan: Jika API Key tidak diisi, NexaWeb.ai tetap berfungsi normal menggunakan **Smart Heuristic Engine Offline** bawaan.*

### 4. Menjalankan Server Pengembangan
```bash
npm run dev
```
Buka browser dan akses:
- **Landing Page**: [http://localhost:3000](http://localhost:3000)
- **Mode Standar**: [http://localhost:3000/studio](http://localhost:3000/studio)
- **Mode Advance Studio**: [http://localhost:3000/studio/advance](http://localhost:3000/studio/advance)

### 5. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 💡 Contoh Perintah AI untuk Dicoba

- *"Buatkan website UMKM penjualan donat yang memiliki 4 produk donat, ada about, dan tombol kontak nomor HP 0812-3456-7890"*
- *"Buatkan website Kedai Kopi Artisan 4 menu lengkap, tentang kami, dan tombol pemesanan WhatsApp"*
- *"Buatkan website Toko Fashion Butik 4 produk modern & elegan beserta profil singkat"*
- *"Tambahkan bagian kontak nomor HP di bagian bawah"*

---

## 📄 Lisensi & Kontribusi

Proyek ini dikembangkan untuk memajukan transformasi digital UMKM Indonesia. Kontribusi dan saran fitur baru sangat terbuka melalui Pull Request atau Issue di branch `feature` / `main`.
