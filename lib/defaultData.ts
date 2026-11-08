import { SectionItem, ProductItem, DesignTheme, DesignTemplate } from './types';

export const DEFAULT_THEMES: DesignTheme[] = [
  {
    id: 'modern-warung',
    name: 'Modern Warung (Rekomendasi)',
    tag: 'Populer & Segar',
    primaryColor: '#059669', // Emerald
    secondaryColor: '#d97706', // Amber
    backgroundColor: '#ffffff',
    textColor: '#334155',
    headingColor: '#0f172a',
    cardBackground: '#f8fafc',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    accentBadge: 'Pilihan Utama UMKM'
  },
  {
    id: 'warm-traditional',
    name: 'Tradisional Hangat & Rempah',
    tag: 'Khas Nusantara',
    primaryColor: '#92400e', // Amber-800
    secondaryColor: '#b45309',
    backgroundColor: '#fffbeb',
    textColor: '#451a03',
    headingColor: '#78350f',
    cardBackground: '#ffffff',
    headingFont: 'Georgia',
    bodyFont: 'Plus Jakarta Sans',
    accentBadge: 'Rasa Autentik'
  },
  {
    id: 'cafe-aesthetic',
    name: 'Kedai Kopi & Cafe Santai',
    tag: 'Kekinian & Tenang',
    primaryColor: '#78350f', // Warm Coffee
    secondaryColor: '#d97706',
    backgroundColor: '#fafaf9',
    textColor: '#292524',
    headingColor: '#1c1917',
    cardBackground: '#ffffff',
    headingFont: 'Georgia',
    bodyFont: 'Inter',
    accentBadge: 'Suasana Nyaman'
  },
  {
    id: 'ocean-clean',
    name: 'Biru Profesional & Jasa',
    tag: 'Bersih & Terpercaya',
    primaryColor: '#2563eb', // Electric blue
    secondaryColor: '#0284c7',
    backgroundColor: '#ffffff',
    textColor: '#1e293b',
    headingColor: '#0f172a',
    cardBackground: '#f0f9ff',
    headingFont: 'Inter',
    bodyFont: 'Inter',
    accentBadge: 'Layanan Terpercaya'
  },
  {
    id: 'bold-impact',
    name: 'Merah Berani & Pedas',
    tag: 'Menggugah Selera',
    primaryColor: '#dc2626', // Red
    secondaryColor: '#ea580c',
    backgroundColor: '#ffffff',
    textColor: '#18181b',
    headingColor: '#09090b',
    cardBackground: '#fff1f2',
    headingFont: 'Plus Jakarta Sans',
    bodyFont: 'Plus Jakarta Sans',
    accentBadge: 'Spesial Pedas Mantap'
  }
];

export const DEFAULT_TEMPLATES: DesignTemplate[] = [
  {
    id: 'modern-warung',
    name: 'Warung & Resto Modern',
    description: 'Layout paling direkomendasikan. Penataan menu 2 kolom sangat nyaman dan tombol WhatsApp terpasang di posisi emas.',
    category: 'Kuliner',
    isRecommended: true,
    score: '9.9/10',
    themeId: 'modern-warung',
    styleConfig: {
      heroVariant: 'modern-centered',
      cardVariant: 'modern-rounded',
      accentLabel: 'Usaha Kuliner Terpercaya'
    }
  },
  {
    id: 'cafe-handcrafted',
    name: 'Kedai Minuman & Cafe',
    description: 'Nuansa hangat bersahabat dengan kartu menu berbingkai artisanal khas tongkrongan.',
    category: 'Minuman & Cafe',
    isRecommended: false,
    score: '9.6/10',
    themeId: 'cafe-aesthetic',
    styleConfig: {
      heroVariant: 'split-classic',
      cardVariant: 'cafe-handcrafted',
      accentLabel: 'Racikan Spesial Setiap Hari'
    }
  },
  {
    id: 'bold-pedas',
    name: 'Kuliner Pedas & Cepat Saji',
    description: 'Desain warna tegas, menonjolkan menu terlaris dan promo hari ini.',
    category: 'Fast Food / Pedas',
    isRecommended: false,
    score: '9.5/10',
    themeId: 'bold-impact',
    styleConfig: {
      heroVariant: 'bold-impact',
      cardVariant: 'bold-compact',
      accentLabel: 'Pilihan Terlaris Wajib Coba'
    }
  },
  {
    id: 'corporate-clean',
    name: 'Katering & Jasa Resmi',
    description: 'Tampilan rapi dan formal, cocok untuk katering kantor dan pesanan partai besar.',
    category: 'Katering / Jasa',
    isRecommended: false,
    score: '9.7/10',
    themeId: 'ocean-clean',
    styleConfig: {
      heroVariant: 'minimal-warm',
      cardVariant: 'corporate-clean',
      accentLabel: 'Layanan Katering Profesional'
    }
  }
];

export const INITIAL_SECTIONS: SectionItem[] = [
  {
    id: 'sec-nav-1',
    type: 'NAVBAR',
    title: 'Dapoer Berkah Nusantara',
    subtitle: 'Katering & Masakan Tradisional',
    content: JSON.stringify([
      { label: 'Beranda', target: '#hero' },
      { label: 'Tentang Kami', target: '#about' },
      { label: 'Daftar Menu', target: '#catalog' },
      { label: 'Kontak', target: '#contact' }
    ]),
    orderIndex: 0
  },
  {
    id: 'sec-hero-1',
    type: 'HERO',
    title: 'Cita Rasa Nusantara Asli, Masakan Rumah Penuh Cinta',
    subtitle: 'Sajian hangat dan higienis dengan bumbu rempah pilihan, siap antar langsung ke depan pintu Anda.',
    content: 'Pesan Sekarang Langsung via WhatsApp | Promo Gratis Ongkir Radius 5 Km',
    orderIndex: 1
  },
  {
    id: 'sec-about-1',
    type: 'ABOUT',
    title: 'Cerita Dapoer Berkah Sejak 2018',
    subtitle: 'Berawal dari dapur rumahan, kini melayani ribuan porsi katering harian',
    content: 'Dapoer Berkah berdedikasi menyajikan makanan khas Indonesia dengan bahan rempah lokal segar tanpa bahan pengawet. Setiap menu diolah higienis untuk menjaga mutu dan cita rasa rumahan yang dirindukan keluarga.',
    orderIndex: 2
  },
  {
    id: 'sec-catalog-1',
    type: 'CATALOG',
    title: 'Pilihan Menu Favorit Keluarga',
    subtitle: 'Dipilih dari resep terbaik warisan keluarga dengan porsi mantap mengenyangkan',
    content: 'Tersedia paket nasi kotak hemat dan katering prasmanan pesta.',
    orderIndex: 3
  },
  {
    id: 'sec-contact-1',
    type: 'CONTACT',
    title: 'Hubungi Kami & Pemesanan Cepat',
    subtitle: 'Siap melayani pesanan katering, syukuran, dan nasi kotak harian',
    content: 'WhatsApp: 0812-3456-7890 | Alamat: Jl. Kenanga No. 24, Pasar Minggu, Jakarta Selatan | Buka setiap hari: 08.00 - 20.00 WIB',
    waMessage: 'Halo Dapoer Berkah, saya ingin memesan menu katering dari website.',
    orderIndex: 4
  },
  {
    id: 'sec-footer-1',
    type: 'FOOTER',
    title: 'Dapoer Berkah Nusantara',
    subtitle: 'Hak Cipta © 2026 Dapoer Berkah. Seluruh hak cipta dilindungi.',
    content: 'Website dibuat dengan NexaWeb.ai - Platform Website AI Praktis untuk UMKM.',
    orderIndex: 5
  }
];

export const INITIAL_PRODUCTS: ProductItem[] = [
  { id: 'prod-1', name: 'Nasi Liwet Komplit Ayam Goreng', price: 28000, category: 'Makanan Utama' },
  { id: 'prod-2', name: 'Ayam Bakar Bumbu Rujak Spesial', price: 25000, category: 'Makanan Utama' },
  { id: 'prod-3', name: 'Es Jeruk Nipis Madu Murni', price: 8000, category: 'Minuman' },
  { id: 'prod-4', name: 'Tahu & Tempe Mendoan Hangat', price: 12000, category: 'Camilan' }
];

export const INITIAL_PALETTE_ITEMS: ProductItem[] = [
  { id: 'pal-1', name: 'Sate Ayam Madura (10 Tusuk)', price: 25000, category: 'Makanan Utama' },
  { id: 'pal-2', name: 'Soto Betawi Daging Sapi Kuah Santan', price: 35000, category: 'Makanan Utama' },
  { id: 'pal-3', name: 'Es Teh Manis Jumbo Segar', price: 5000, category: 'Minuman' },
  { id: 'pal-4', name: 'Kopi Susu Gula Aren Asli', price: 15000, category: 'Minuman' },
  { id: 'pal-5', name: 'Pisang Goreng Keju Cokelat', price: 14000, category: 'Camilan' },
  { id: 'pal-6', name: 'Paket Katering Syukuran 20 Box', price: 500000, category: 'Paket Spesial' }
];

// Data untuk Simulator Prompt di Landing Page (AC-H.3)
export const SIMULATOR_PROMPTS = [
  {
    id: 'sim-batik',
    label: '👗 Butik Batik Solo',
    prompt: 'Buatkan toko baju online batik tulis Solo modern dengan katalog gamis dan kemeja pria',
    result: {
      brand: 'Batik Sekar Ayu Solo',
      tagline: 'Koleksi Batik Tulis & Cap Warisan Budaya Berkelas Modern',
      themeColor: '#78350f',
      items: [
        { name: 'Kemeja Batik Katun Primisima', price: 'Rp 175.000', tag: 'Terlaris' },
        { name: 'Gamis Batik Canting Kencana', price: 'Rp 295.000', tag: 'Baru' },
        { name: 'Kain Jarik Sutra Motif Parang', price: 'Rp 220.000', tag: 'Spesial' }
      ],
      whatsapp: '081298765432',
      badge: 'Fashion & Kriya'
    }
  },
  {
    id: 'sim-kopi',
    label: '☕ Kedai Kopi Senja',
    prompt: 'Buatkan website kedai kopi susu gula aren kekinian lengkap dengan menu roti bakar & wifi gratis',
    result: {
      brand: 'Kopi Seduh Sahabat',
      tagline: 'Ngopi Santai, Rasa Autentik, Harga Ramah Kantong',
      themeColor: '#b45309',
      items: [
        { name: 'Kopi Susu Aren Double Shot', price: 'Rp 18.000', tag: 'Favorit' },
        { name: 'Roti Bakar Cokelat Lumer', price: 'Rp 15.000', tag: 'Camilan' },
        { name: 'Cold Brew Citrus Segar', price: 'Rp 22.000', tag: 'Signature' }
      ],
      whatsapp: '081387654321',
      badge: 'Kafe & Minuman'
    }
  },
  {
    id: 'sim-soto',
    label: '🍲 Warung Soto Madura',
    prompt: 'Buatkan website warung makan soto daging sapi khas Madura dengan es jeruk nipis segar',
    result: {
      brand: 'Soto Daging H. Mahmud',
      tagline: 'Kuah Rempah Gurih Alami Sejak 1995, Gurih Meresap Sampai Sendok Terakhir',
      themeColor: '#059669',
      items: [
        { name: 'Soto Daging Sapi + Nasi Pulen', price: 'Rp 30.000', tag: 'Menu Utama' },
        { name: 'Soto Babat & Jeroan Spesial', price: 'Rp 32.000', tag: 'Komplit' },
        { name: 'Es Jeruk Peras Murni Jumbo', price: 'Rp 7.000', tag: 'Segar' }
      ],
      whatsapp: '081512345678',
      badge: 'Kuliner Tradisional'
    }
  },
  {
    id: 'sim-bengkel',
    label: '🔧 Servis AC & Bengkel',
    prompt: 'Buatkan website jasa perbaikan AC panggilan dan servis rutin bergaransi area Jabodetabek',
    result: {
      brand: 'Berkah Mandiri Sejuk (AC)',
      tagline: 'Teknisi Ramah, Berpengalaman, dan Bergaransi 30 Hari',
      themeColor: '#2563eb',
      items: [
        { name: 'Cuci AC Standar 0.5 - 2 PK', price: 'Rp 75.000', tag: 'Paket Hemat' },
        { name: 'Isi Ulang Freon R32 / R410', price: 'Rp 150.000', tag: 'Rutin' },
        { name: 'Bongkar Pasang AC Cepat', price: 'Rp 250.000', tag: 'Lengkap' }
      ],
      whatsapp: '081798765432',
      badge: 'Jasa Lokal Panggilan'
    }
  }
];

// Showcase UMKM untuk Galeri (AC-H.5)
export const SHOWCASE_ITEMS = [
  {
    id: 'sc-1',
    category: 'Kuliner',
    title: 'Soto Betawi H. Joko',
    owner: 'Pak Joko Susilo (52 thn)',
    location: 'Pasar Senen, Jakarta Pusat',
    description: 'Situs kuliner tradisional dengan daftar menu lengkap dan tombol pesan antar instan ke WhatsApp kasir.',
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=700&auto=format&fit=crop&q=80',
    color: '#059669',
    badge: 'Kuliner'
  },
  {
    id: 'sc-2',
    category: 'Fashion',
    title: 'Galeri Batik Sekar Ayu',
    owner: 'Ibu Maya Dewi (43 thn)',
    location: 'Laweyan, Solo',
    description: 'Katalog online busana batik modern yang membuat pelanggan luar pulau mudah memilih motif dan ukuran.',
    image: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=700&auto=format&fit=crop&q=80',
    color: '#78350f',
    badge: 'Fashion'
  },
  {
    id: 'sc-3',
    category: 'Kuliner',
    title: 'Dapoer Berkah Katering',
    owner: 'Ibu Sri Wahyuni (47 thn)',
    location: 'Pasar Minggu, Jakarta Selatan',
    description: 'Layanan katering nasi kotak harian dan paket prasmanan syukuran untuk perumahan dan perkantoran.',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    color: '#d97706',
    badge: 'Katering'
  },
  {
    id: 'sc-4',
    category: 'Jasa Lokal',
    title: 'Berkah Teknik AC & Kelistrikan',
    owner: 'Pak Ridwan Santoso (49 thn)',
    location: 'Depok, Jawa Barat',
    description: 'Jasa panggilan cepat perbaikan rumah tangga bergaransi dengan testimoni asli warga sekitar.',
    image: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=700&auto=format&fit=crop&q=80',
    color: '#2563eb',
    badge: 'Jasa Lokal'
  },
  {
    id: 'sc-5',
    category: 'Kriya',
    title: 'Anyaman Rotan Asli Jepara',
    owner: 'Pak Bambang Irawan (54 thn)',
    location: 'Jepara, Jawa Tengah',
    description: 'Koleksi perabotan dan souvenir anyaman tangan ramah lingkungan untuk dekorasi rumah minimalis.',
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=700&auto=format&fit=crop&q=80',
    color: '#b45309',
    badge: 'Kriya & Kerajinan'
  },
  {
    id: 'sc-6',
    category: 'Kuliner',
    title: 'Kedai Kopi Rukun Tetangga',
    owner: 'Mas Hendra & Bu Ani (41 thn)',
    location: 'Bandung, Jawa Barat',
    description: 'Kedai minuman kopi susu gula aren dengan tempat nongkrong asri dan menu camilan pisang lumer.',
    image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&auto=format&fit=crop&q=80',
    color: '#475569',
    badge: 'Kedai Kopi'
  }
];

// Testimoni Pemilik Usaha Usia 40-50 Tahun (AC-H.6)
export const TESTIMONIALS = [
  {
    id: 't-1',
    name: 'Pak Joko Susilo',
    age: '52 Tahun',
    business: 'Soto Betawi H. Joko (Pasar Senen)',
    photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    quote: 'Dulu saya ragu karena sama sekali nggak ngerti komputer. Di NexaWeb, saya cuma ketik menu soto dan nomor WhatsApp seperti kirim pesan ke anak saya. 10 menit kemudian, link website toko saya sudah bisa saya share ke langganan di grup arisan!',
    highlight: 'Bebas Jargon & Teks Besar Jelas'
  },
  {
    id: 't-2',
    name: 'Ibu Sri Wahyuni',
    age: '47 Tahun',
    business: 'Dapoer Berkah Katering (Pasar Minggu)',
    photo: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&auto=format&fit=crop&q=80',
    quote: 'Biasanya kalau mau bikin website ditawari agensi jutaan rupiah dan nunggunya berminggu-minggu. Dengan NexaWeb, saya bisa atur sendiri menu paket nasi liwet dan pesanan katering langsung masuk ke WhatsApp toko tanpa komisi aplikasi.',
    highlight: 'Pesanan Langsung Masuk WhatsApp'
  },
  {
    id: 't-3',
    name: 'Ibu Maya Dewi',
    age: '43 Tahun',
    business: 'Galeri Batik Sekar Ayu (Solo)',
    photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80',
    quote: 'Bikin toko terlihat sangat profesional dan meyakinkan untuk pembeli dari luar kota. Saya paling suka fitur ganti warnanya yang tinggal klik, tidak ada istilah bahasa Inggris yang bikin pusing.',
    highlight: 'Tingkatkan Kepercayaan Pembeli Luar Kota'
  }
];
