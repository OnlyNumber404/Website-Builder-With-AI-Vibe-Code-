import {
  AdvanceAiAction,
  AdvanceAiPlan,
  AdvanceCanvas,
  CANVAS_DEFAULT_HEIGHT,
  CANVAS_DEFAULT_WIDTH
} from './advanceTypes';

interface BusinessTemplate {
  nicheKey: string;
  brandName: string;
  badgeText: string;
  heroTitle: string;
  heroSubtitle: string;
  aboutTitle: string;
  aboutStory: string;
  highlights: string[];
  primaryColor: string;
  accentColor: string;
  heroBg: string;
  aboutBg: string;
  heroImage: string;
  aboutImage: string;
  products: {
    title: string;
    description: string;
    price: string;
    image: string;
  }[];
}

const BUSINESS_TEMPLATES: Record<string, BusinessTemplate> = {
  donat: {
    nicheKey: 'donat',
    brandName: 'Donat Lumer Nusantara',
    badgeText: '🍩 Fresh Baked Setiap Pagi • 100% Halal',
    heroTitle: 'Donat Lembut & Lumer di Setiap Gigitan',
    heroSubtitle:
      'Dibuat dari bahan premium pilihan tanpa pengawet. Tersedia aneka topping coklat Belgia, matcha, stroberi, dan keju melimpah untuk keluarga & acara spesial Anda.',
    aboutTitle: 'Racikan Donat Artisan dengan Cinta & Kualitas Terbaik',
    aboutStory:
      'Berawal dari dapur rumahan UMKM, kami menghadirkan donat kentang super empuk yang digoreng segar setiap hari. Setiap topping diracik khusus agar manisnya pas dan bikin ketagihan.',
    highlights: ['✨ 100% Bahan Premium', '🔥 Selalu Fresh & Hangat', '🛵 Siap Antar Cepat'],
    primaryColor: '#d97706',
    accentColor: '#f59e0b',
    heroBg: '#fffbeb',
    aboutBg: '#fefce8',
    heroImage: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Donat Coklat Lumer Belgia',
        description: 'Donat kentang super lembut disiram glaze coklat Belgia pekat dengan taburan choco crunch.',
        price: 'Rp 12.000',
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Donat Strawberry Glaze Pink',
        description: 'Perpaduan rasa stroberi segar manis-asam dengan taburan meses warna-warni favorit semua usia.',
        price: 'Rp 11.000',
        image: 'https://images.unsplash.com/photo-1556913396-7a3c459ef68e?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Donat Klasik Gula Salju',
        description: 'Resep klasik donat kentang empuk dengan taburan gula halus dingin yang lumer di mulut.',
        price: 'Rp 9.000',
        image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Box Hampers Isi 6',
        description: 'Bebas pilih 6 varian rasa donat favorit dalam kemasan box eksklusif, cocok untuk oleh-oleh.',
        price: 'Rp 58.000',
        image: 'https://images.unsplash.com/photo-1612240498936-65f5101365d2?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Donat Matcha Almond Crunch',
        description: 'Glaze matcha Jepang autentik dengan topping irisan kacang almond panggang yang renyah.',
        price: 'Rp 14.000',
        image: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Donat Tiramisu Keju Melimpah',
        description: 'Krim tiramisu lembut dipadu parutan keju cheddar tebal untuk pencinta rasa gurih-manis.',
        price: 'Rp 13.500',
        image: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  kopi: {
    nicheKey: 'kopi',
    brandName: 'Kopi Senja Roastery',
    badgeText: '☕ Biji Kopi Arabika Pilihan Nusantara',
    heroTitle: 'Nikmati Seduhan Kopi Artisan Penuh Karakter',
    heroSubtitle:
      'Biji kopi segar hasil sangrai sendiri dari petani lokal terbaik Indonesia. Hadir dalam sajian kopi susu gula aren, espresso, hingga paket literan siap antar.',
    aboutTitle: 'Cerita di Balik Setiap Cangkir Kopi Kami',
    aboutStory:
      'Kami bekerja sama langsung dengan petani kopi Gayo, Toraja, dan Kintamani untuk menyajikan kualitas seduhan terbaik dengan harga bersahabat bagi semua penikmat kopi.',
    highlights: ['☕ 100% Arabika Lokal', '🔥 Fresh Roasted', '⚡ Pesan Antar Cepat'],
    primaryColor: '#78350f',
    accentColor: '#d97706',
    heroBg: '#faf7f2',
    aboutBg: '#f5f0e6',
    heroImage: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Es Kopi Susu Gula Aren',
        description: 'Perpaduan espresso house blend, susu segar creamy, dan gula aren organik pilihan.',
        price: 'Rp 22.000',
        image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Caramel Macchiato Artisan',
        description: 'Espresso lembut dengan sirup karamel rumahan dan foam susu halus nan harum.',
        price: 'Rp 28.000',
        image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Americano Single Origin',
        description: 'Seduhan kopi hitam bersih beraroma fruity dari biji Arabika Gayo pilihan.',
        price: 'Rp 20.000',
        image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Kopi Literan 1L',
        description: 'Kemasan botol 1 liter praktis untuk dinikmati bersama keluarga atau teman kantor.',
        price: 'Rp 79.000',
        image: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  kuliner: {
    nicheKey: 'kuliner',
    brandName: 'Dapoer Nusantara Berkah',
    badgeText: '🍲 Masakan Rumahan Autentik & Higienis',
    heroTitle: 'Cita Rasa Rempah Nusantara yang Selalu Dirindukan',
    heroSubtitle:
      'Sajian menu lezat dimasak segar setiap hari menggunakan bumbu rempah alami. Cocok untuk makan siang, keluarga, hingga pesanan nasi kotak acara.',
    aboutTitle: 'Resep Keluarga Turun-Temurun yang Terjaga Mutunya',
    aboutStory:
      'Kami percaya makanan enak berawal dari bahan segar dan kebersihan dapur. Setiap porsi disajikan hangat dengan porsi melimpah dan harga ramah di kantong.',
    highlights: ['🌿 Bumbu Rempah Asli', '✅ 100% Halal & Bersih', '📦 Terima Nasi Kotak'],
    primaryColor: '#b91c1c',
    accentColor: '#ea580c',
    heroBg: '#fff7ed',
    aboutBg: '#fef2f2',
    heroImage: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Paket Spesial Komplit',
        description: 'Nasi hangat pulen dengan lauk utama bumbu rempah, lalapan segar, dan sambal terasi.',
        price: 'Rp 28.000',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Menu Bakar Madu Istimewa',
        description: 'Dipanggang perlahan dengan olesan madu murni dan kecap rempah hingga meresap sempurna.',
        price: 'Rp 32.000',
        image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Hemat Berdua',
        description: 'Dua porsi menu favorit lengkap dengan minuman segar pilihan untuk santap hemat.',
        price: 'Rp 52.000',
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Catering Nasi Box',
        description: 'Menu lengkap rapi dan higienis untuk rapat kantor, pengajian, atau syukuran keluarga.',
        price: 'Rp 35.000',
        image: 'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  fashion: {
    nicheKey: 'fashion',
    brandName: 'Karya Modis Boutique',
    badgeText: '✨ Koleksi Fashion Lokal Berkualitas Tinggi',
    heroTitle: 'Tampil Percaya Diri dengan Gaya Modern & Nyaman',
    heroSubtitle:
      'Koleksi busana pilihan berbahan adem, jahitan rapi standar butik, dan potongan elegan yang cocok dipakai harian maupun acara formal.',
    aboutTitle: 'Kualitas Bahan Terbaik untuk Kenyamanan Sepanjang Hari',
    aboutStory:
      'Kami merancang setiap koleksi bersama penjahit lokal berpengalaman untuk menghadirkan busana yang awet, modis, dan tetap terjangkau untuk seluruh pelanggan di Indonesia.',
    highlights: ['🧵 Jahitan Rapi Butik', '🌿 Bahan Katun Adem', '🚚 Kirim Seluruh Indonesia'],
    primaryColor: '#1e3a8a',
    accentColor: '#2563eb',
    heroBg: '#f8fafc',
    aboutBg: '#eff6ff',
    heroImage: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Kemeja Linen Casual Premium',
        description: 'Bahan katun linen import yang ringan, menyerap keringat, dan tidak mudah kusut.',
        price: 'Rp 149.000',
        image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Outer Elegan Signature',
        description: 'Potongan modern minimalis yang mudah dipadupadankan untuk gaya kantor maupun santai.',
        price: 'Rp 185.000',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Sneakers Harian Ultra Ringan',
        description: 'Sol empuk anti slip dengan desain trendi yang nyaman dipakai beraktivitas seharian.',
        price: 'Rp 245.000',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Tas Selempang Kulit Minimalis',
        description: 'Kompartemen luas dengan material kulit sintetis premium tahan air dan jahitan kokoh.',
        price: 'Rp 165.000',
        image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  skincare: {
    nicheKey: 'skincare',
    brandName: 'GlowNatura Skincare',
    badgeText: '✨ BPOM Certified • Bahan Alami Lembut',
    heroTitle: 'Rawat Kulit Sehat & Bercahaya Secara Alami',
    heroSubtitle:
      'Rangkaian perawatan wajah yang diformulasikan lembut untuk kulit tropis Indonesia. Aman untuk pemakaian harian dan bebas bahan berbahaya.',
    aboutTitle: 'Kecantikan Alami Dimulai dari Kulit yang Terawat',
    aboutStory:
      'GlowNatura memadukan ekstrak bahan botanical alami dengan teknologi dermatologi modern agar setiap orang bisa merasakan perawatan kulit berkualitas klinik dari rumah.',
    highlights: ['✅ Terdaftar BPOM', '🌿 Ekstrak Botanical', '💧 Cocok Kulit Sensitif'],
    primaryColor: '#db2777',
    accentColor: '#ec4899',
    heroBg: '#fdf2f8',
    aboutBg: '#fff1f2',
    heroImage: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Brightening Glow Serum 30ml',
        description: 'Mengandung Niacinamide & Vitamin C untuk mencerahkan dan menyamarkan noda hitam.',
        price: 'Rp 89.000',
        image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Hydra Barrier Moisturizer',
        description: 'Melembapkan kulit hingga 24 jam dengan Ceramide dan Hyaluronic Acid ringan.',
        price: 'Rp 75.000',
        image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Gentle Amino Facial Wash',
        description: 'Pembersih wajah berbusa lembut yang mengangkat kotoran tanpa membuat kulit kering.',
        price: 'Rp 55.000',
        image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Lengkap Glowing 4-in-1',
        description: 'Paket hemat perawatan pagi & malam lengkap dengan pouch cantik eksklusif.',
        price: 'Rp 235.000',
        image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  elektronik: {
    nicheKey: 'elektronik',
    brandName: 'Nusantara Tech Store',
    badgeText: '⚡ Produk Original • Garansi Resmi',
    heroTitle: 'Solusi Gadget & Aksesoris Modern Bergaransi',
    heroSubtitle:
      'Temukan berbagai perangkat teknologi, audio, dan aksesoris berkualitas tinggi dengan harga kompetitif serta layanan purna jual terpercaya.',
    aboutTitle: 'Partner Teknologi Terpercaya untuk Produktivitas Anda',
    aboutStory:
      'Kami menyediakan produk teknologi terkurasi yang telah melewati pengecekan kualitas ketat. Didukung konsultasi gratis via WhatsApp sebelum membeli.',
    highlights: ['🛡️ Garansi Resmi', '⚡ Pengiriman Aman', '💬 Konsultasi Gratis'],
    primaryColor: '#2563eb',
    accentColor: '#0ea5e9',
    heroBg: '#f0f9ff',
    aboutBg: '#f8fafc',
    heroImage: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Headphone Wireless ANC Pro',
        description: 'Suara jernih bass mendalam dengan fitur peredam bising aktif dan baterai 35 jam.',
        price: 'Rp 450.000',
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Smartwatch Fitness AMOLED',
        description: 'Pantau kesehatan, olahraga, dan notifikasi pesan langsung dari pergelangan tangan.',
        price: 'Rp 599.000',
        image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Smartphone Series Ultra 5G',
        description: 'Performa kencang, kamera tajam, dan pengisian daya super cepat untuk aktivitas harian.',
        price: 'Rp 3.299.000',
        image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Aksesoris Kerja WFH',
        description: 'Bundling stand laptop, hub USB-C, dan mouse ergonomis untuk meja kerja rapi.',
        price: 'Rp 349.000',
        image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  florist: {
    nicheKey: 'florist',
    brandName: 'Mekar Indah Florist',
    badgeText: '💐 Bunga Segar Pilihan • Bisa Same-Day Delivery',
    heroTitle: 'Rangkaian Bunga Segar untuk Setiap Momen Berharga',
    heroSubtitle:
      'Buket wisuda, ulang tahun, pernikahan, hingga papan bunga ucapan yang dirangkai secara artistik oleh florist berpengalaman.',
    aboutTitle: 'Menyampaikan Perasaan Lewat Keindahan Bunga Segar',
    aboutStory:
      'Setiap tangkai bunga kami pilih langsung dari kebun terbaik setiap pagi agar tetap segar, harum, dan memukau saat diterima orang tersayang.',
    highlights: ['🌸 Bunga Segar Harian', '🎁 Gratis Kartu Ucapan', '🛵 Kirim Hari Yang Sama'],
    primaryColor: '#059669',
    accentColor: '#10b981',
    heroBg: '#f0fdf4',
    aboutBg: '#fdf2f8',
    heroImage: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Buket Mawar Pastel Romantis',
        description: 'Rangkaian mawar segar warna lembut dengan wrapping kertas Korea premium.',
        price: 'Rp 175.000',
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Buket Wisuda Sunflower Cerah',
        description: 'Bunga matahari segar melambangkan kebahagiaan dan semangat kesuksesan baru.',
        price: 'Rp 145.000',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Tanaman Hias Meja Estetik',
        description: 'Tanaman indoor mudah dirawat lengkap dengan pot keramik minimalis cantik.',
        price: 'Rp 85.000',
        image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Flower Box Premium Exclusive',
        description: 'Rangkaian bunga segar mewah di dalam kotak bulat elegan untuk hadiah spesial.',
        price: 'Rp 285.000',
        image: 'https://images.unsplash.com/photo-1487530811176-3780de880c2d?w=600&auto=format&fit=crop&q=80'
      }
    ]
  },
  umum: {
    nicheKey: 'umum',
    brandName: 'Karya Mandiri UMKM',
    badgeText: '✨ Produk & Layanan Berkualitas Terbaik',
    heroTitle: 'Solusi Produk Terbaik untuk Kebutuhan Harian Anda',
    heroSubtitle:
      'Kami menghadirkan produk pilihan bermutu tinggi dengan pelayanan ramah, harga jujur, dan pemesanan cepat langsung melalui WhatsApp.',
    aboutTitle: 'Dedikasi Kami untuk Kepuasan Setiap Pelanggan',
    aboutStory:
      'Sebagai pelaku UMKM modern, kami berkomitmen menjaga kualitas di setiap detail produk serta memberikan respon cepat dan pengiriman aman ke seluruh pelanggan.',
    highlights: ['⭐ Kualitas Terjamin', '💬 Respon Cepat WA', '📦 Pengiriman Aman'],
    primaryColor: '#2563eb',
    accentColor: '#0ea5e9',
    heroBg: '#f8fafc',
    aboutBg: '#eff6ff',
    heroImage: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=700&auto=format&fit=crop&q=80',
    aboutImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=700&auto=format&fit=crop&q=80',
    products: [
      {
        title: 'Paket Unggulan Best Seller',
        description: 'Produk terfavorit pelanggan dengan kualitas premium dan harga paling hemat.',
        price: 'Rp 75.000',
        image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Reguler Harian',
        description: 'Pilihan praktis dan ekonomis untuk kebutuhan rutin keluarga maupun usaha Anda.',
        price: 'Rp 45.000',
        image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Premium Eksklusif',
        description: 'Varian kualitas tertinggi dengan kemasan rapi dan garansi kepuasan pelanggan.',
        price: 'Rp 125.000',
        image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&auto=format&fit=crop&q=80'
      },
      {
        title: 'Paket Bundling Hemat',
        description: 'Beli paket bundling lebih hemat hingga 20% untuk kebutuhan acara atau reseller.',
        price: 'Rp 195.000',
        image: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&auto=format&fit=crop&q=80'
      }
    ]
  }
};

function detectBusinessTemplate(prompt: string): BusinessTemplate {
  const lower = prompt.toLowerCase();

  if (
    lower.includes('donat') ||
    lower.includes('donut') ||
    lower.includes('roti') ||
    lower.includes('bakery') ||
    lower.includes('kue') ||
    lower.includes('cake') ||
    lower.includes('brownies') ||
    lower.includes('pastry')
  ) {
    return BUSINESS_TEMPLATES.donat;
  }
  if (
    lower.includes('kopi') ||
    lower.includes('coffee') ||
    lower.includes('cafe') ||
    lower.includes('kafe') ||
    lower.includes('boba') ||
    lower.includes('minuman') ||
    lower.includes('teh') ||
    lower.includes('matcha')
  ) {
    return BUSINESS_TEMPLATES.kopi;
  }
  if (
    lower.includes('makanan') ||
    lower.includes('kuliner') ||
    lower.includes('warung') ||
    lower.includes('resto') ||
    lower.includes('ayam') ||
    lower.includes('bakso') ||
    lower.includes('sate') ||
    lower.includes('nasi') ||
    lower.includes('catering') ||
    lower.includes('katering') ||
    lower.includes('seblak') ||
    lower.includes('soto')
  ) {
    return BUSINESS_TEMPLATES.kuliner;
  }
  if (
    lower.includes('baju') ||
    lower.includes('fashion') ||
    lower.includes('pakaian') ||
    lower.includes('batik') ||
    lower.includes('hijab') ||
    lower.includes('distro') ||
    lower.includes('sepatu') ||
    lower.includes('tas') ||
    lower.includes('butik')
  ) {
    return BUSINESS_TEMPLATES.fashion;
  }
  if (
    lower.includes('skincare') ||
    lower.includes('kosmetik') ||
    lower.includes('kecantikan') ||
    lower.includes('salon') ||
    lower.includes('parfum') ||
    lower.includes('beauty')
  ) {
    return BUSINESS_TEMPLATES.skincare;
  }
  if (
    lower.includes('elektronik') ||
    lower.includes('gadget') ||
    lower.includes('hp') && lower.includes('toko') ||
    lower.includes('laptop') ||
    lower.includes('komputer') ||
    lower.includes('aksesoris')
  ) {
    return BUSINESS_TEMPLATES.elektronik;
  }
  if (
    lower.includes('bunga') ||
    lower.includes('florist') ||
    lower.includes('buket') ||
    lower.includes('tanaman')
  ) {
    return BUSINESS_TEMPLATES.florist;
  }

  return BUSINESS_TEMPLATES.umum;
}

function extractProductCount(prompt: string): number {
  const match = prompt.match(/(\d+)\s*(?:produk|menu|item|varian|paket|donat|kopi|baju|kue|barang)/i);
  if (match) {
    const n = parseInt(match[1], 10);
    if (n >= 1 && n <= 6) return n;
    if (n > 6) return 6;
  }
  return 4;
}

function extractPhoneNumber(prompt: string): string {
  const match = prompt.match(/(?:(?:\+?62|0)8[0-9\-\s]{7,15})/);
  if (match) return match[0].trim();
  return '0812-3456-7890';
}

function extractCustomBrandName(prompt: string, fallback: string): string {
  const namedMatch = prompt.match(/(?:nama(?:nya)?|brand|toko)\s+["']?([A-Za-z0-9\s]{3,28})["']?/i);
  if (namedMatch) {
    const candidate = namedMatch[1].replace(/\b(yang|dengan|memiliki|punya|dan|untuk)\b.*/i, '').trim();
    if (candidate.length >= 3) return candidate;
  }
  return fallback;
}

/**
 * Overpowered Smart Advance AI Engine:
 * Generates full multi-canvas websites OR targeted edits from natural Indonesian/English prompts.
 */
export function generateSmartAdvanceAiPlan(
  prompt: string,
  context: {
    activeCanvas: AdvanceCanvas;
    allCanvases: AdvanceCanvas[];
  }
): AdvanceAiPlan {
  const lower = prompt.toLowerCase().trim();
  const { activeCanvas, allCanvases } = context;

  // =========================================================================
  // 1. FULL WEBSITE / LANDING PAGE BUILDER (OVERPOWERED MULTI-CANVAS MODE)
  // =========================================================================
  const isFullWebsiteRequest =
    lower.includes('buatkan website') ||
    lower.includes('buatkan sebuah website') ||
    lower.includes('bikin website') ||
    lower.includes('buat website') ||
    lower.includes('buatkan web') ||
    lower.includes('bikin web') ||
    lower.includes('landing page') ||
    lower.includes('toko online') ||
    (lower.includes('umkm') && (lower.includes('produk') || lower.includes('about') || lower.includes('kontak') || lower.includes('contact'))) ||
    (lower.includes('produk') && (lower.includes('about') || lower.includes('tentang') || lower.includes('kontak') || lower.includes('contact')));

  if (isFullWebsiteRequest) {
    const template = detectBusinessTemplate(prompt);
    const brandName = extractCustomBrandName(prompt, template.brandName);
    const productCount = extractProductCount(prompt);
    const phone = extractPhoneNumber(prompt);
    const cleanWa = phone.replace(/[^0-9]/g, '');
    const waFormatted = cleanWa.startsWith('0') ? '62' + cleanWa.slice(1) : cleanWa;

    const actions: AdvanceAiAction[] = [];

    // 1. Reset & Setup Kanvas 1: Beranda (Hero)
    actions.push({
      type: 'RESET_CANVASES',
      label: 'Menyiapkan Kanvas Beranda...',
      firstCanvasTitle: 'Beranda (Hero)',
      firstCanvasBg: template.heroBg,
      firstCanvasHeight: 650
    });

    // Decorative background shapes for Hero
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambah aksen bentuk dekoratif...',
      canvasKey: 'hero',
      element: {
        category: 'SHAPE',
        posX: 600,
        posY: 115,
        width: 360,
        height: 360,
        color: template.accentColor,
        properties: {
          shapeType: 'circle',
          opacity: 0.14
        }
      }
    });

    // Navbar connected to all 4 canvases
    actions.push({
      type: 'ADD_ELEMENT',
      label: `Memasang Navbar ${brandName}...`,
      canvasKey: 'hero',
      element: {
        category: 'NAV',
        posX: 30,
        posY: 20,
        width: 940,
        height: 64,
        color: '#ffffff',
        properties: {
          navBrand: brandName,
          navVariant: 'floating',
          color: '#0f172a',
          navItems: [
            { id: 'nav-1', label: 'Beranda', targetCanvasId: '__KEY__:hero' },
            { id: 'nav-2', label: 'Produk', targetCanvasId: '__KEY__:products' },
            { id: 'nav-3', label: 'Tentang Kami', targetCanvasId: '__KEY__:about' },
            { id: 'nav-4', label: 'Kontak', targetCanvasId: '__KEY__:contact' }
          ]
        }
      }
    });

    // Hero Badge Pill
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambahkan badge unggulan...',
      canvasKey: 'hero',
      element: {
        category: 'TEXT',
        posX: 55,
        posY: 132,
        width: 390,
        height: 34,
        color: template.primaryColor,
        properties: {
          text: template.badgeText,
          fontSize: 13,
          fontWeight: 'bold',
          font: 'Inter, sans-serif',
          textAlign: 'left'
        }
      }
    });

    // Hero Headline
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis judul utama Hero...',
      canvasKey: 'hero',
      element: {
        category: 'TEXT',
        posX: 55,
        posY: 172,
        width: 470,
        height: 120,
        color: '#0f172a',
        properties: {
          text: template.heroTitle,
          fontSize: 38,
          fontWeight: 'extrabold',
          font: 'Inter, sans-serif',
          textAlign: 'left'
        }
      }
    });

    // Hero Subheadline
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis deskripsi penawaran...',
      canvasKey: 'hero',
      element: {
        category: 'TEXT',
        posX: 55,
        posY: 302,
        width: 460,
        height: 92,
        color: '#475569',
        properties: {
          text: template.heroSubtitle,
          fontSize: 15,
          fontWeight: 'normal',
          font: 'Inter, sans-serif',
          textAlign: 'left'
        }
      }
    });

    // Hero Primary CTA (WhatsApp)
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Memasang tombol Pesan WhatsApp...',
      canvasKey: 'hero',
      element: {
        category: 'BUTTON',
        posX: 55,
        posY: 422,
        width: 225,
        height: 52,
        color: template.primaryColor,
        properties: {
          text: 'Pesan Sekarang via WA',
          buttonVariant: 'pill',
          buttonTextColor: '#ffffff',
          linkType: 'wa',
          waNumber: phone,
          waMessage: `Halo ${brandName}, saya tertarik memesan produk Anda.`
        }
      }
    });

    // Hero Secondary CTA (Scroll to Products)
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Memasang tombol Lihat Produk...',
      canvasKey: 'hero',
      element: {
        category: 'BUTTON',
        posX: 295,
        posY: 422,
        width: 195,
        height: 52,
        color: '#0f172a',
        properties: {
          text: 'Lihat Katalog Produk',
          buttonVariant: 'outline',
          buttonTextColor: '#0f172a',
          linkType: 'canvas',
          targetCanvasId: '__KEY__:products'
        }
      }
    });

    // Hero Featured Image
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Memasang foto utama bisnis...',
      canvasKey: 'hero',
      element: {
        category: 'IMAGE',
        posX: 555,
        posY: 125,
        width: 395,
        height: 415,
        color: '#ffffff',
        properties: {
          imageUrl: template.heroImage,
          objectFit: 'cover',
          borderRadius: 24
        }
      }
    });

    // Hero Divider Line + Rating
    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambahkan garis aksen & rating...',
      canvasKey: 'hero',
      element: {
        category: 'SHAPE',
        posX: 55,
        posY: 515,
        width: 440,
        height: 24,
        color: '#cbd5e1',
        properties: {
          shapeType: 'line',
          borderWidth: 2
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambahkan ulasan singkat...',
      canvasKey: 'hero',
      element: {
        category: 'TEXT',
        posX: 55,
        posY: 545,
        width: 450,
        height: 36,
        color: '#64748b',
        properties: {
          text: `⭐ 4.9/5 Dipercaya Ratusan Pelanggan • 📞 ${phone}`,
          fontSize: 13,
          fontWeight: 'semibold',
          font: 'Inter, sans-serif',
          textAlign: 'left'
        }
      }
    });

    // =======================================================================
    // 2. KANVAS 2: KATALOG PRODUK (N PRODUK RAPI TANPA TUMPANG TINDIH)
    // =======================================================================
    const productsCanvasHeight = productCount > 3 ? 980 : 650;
    actions.push({
      type: 'CREATE_CANVAS',
      label: `Membuat Halaman Katalog (${productCount} Produk)...`,
      canvasKey: 'products',
      title: `Katalog Produk (${productCount} Item)`,
      backgroundColor: '#ffffff',
      height: productsCanvasHeight
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis judul Katalog Produk...',
      canvasKey: 'products',
      element: {
        category: 'TEXT',
        posX: 80,
        posY: 32,
        width: 840,
        height: 56,
        color: '#0f172a',
        properties: {
          text: `Pilihan Produk Terbaik ${brandName}`,
          fontSize: 30,
          fontWeight: 'extrabold',
          font: 'Inter, sans-serif',
          textAlign: 'center'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis subjudul Katalog...',
      canvasKey: 'products',
      element: {
        category: 'TEXT',
        posX: 160,
        posY: 96,
        width: 680,
        height: 40,
        color: '#64748b',
        properties: {
          text: 'Pilih varian favorit Anda dan klik tombol pesan untuk terhubung langsung ke WhatsApp kami.',
          fontSize: 14,
          fontWeight: 'normal',
          font: 'Inter, sans-serif',
          textAlign: 'center'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambahkan garis pemisah katalog...',
      canvasKey: 'products',
      element: {
        category: 'SHAPE',
        posX: 430,
        posY: 142,
        width: 140,
        height: 24,
        color: template.primaryColor,
        properties: {
          shapeType: 'line',
          borderWidth: 4
        }
      }
    });

    // Place product cards neatly
    for (let i = 0; i < productCount; i++) {
      const prod = template.products[i % template.products.length];
      let cardX = 60;
      let cardY = 184;
      let cardW = 290;
      let cardH = 385;

      if (productCount === 4) {
        // Spacious 2x2 Grid
        cardW = 420;
        cardH = 365;
        const col = i % 2;
        const row = Math.floor(i / 2);
        cardX = col === 0 ? 60 : 520;
        cardY = row === 0 ? 184 : 578;
      } else if (productCount <= 3) {
        // 1xN Centered Row
        cardW = 290;
        cardH = 390;
        const totalWidth = productCount * cardW + (productCount - 1) * 28;
        const startX = Math.round((CANVAS_DEFAULT_WIDTH - totalWidth) / 2);
        cardX = startX + i * (cardW + 28);
        cardY = 184;
      } else {
        // 5 or 6 items -> 2x3 Grid
        cardW = 290;
        cardH = 365;
        const col = i % 3;
        const row = Math.floor(i / 3);
        cardX = 40 + col * 315;
        cardY = row === 0 ? 184 : 578;
      }

      actions.push({
        type: 'ADD_ELEMENT',
        label: `Menyusun Produk ${i + 1}/${productCount}: ${prod.title}...`,
        canvasKey: 'products',
        element: {
          category: 'PRODUCT',
          posX: cardX,
          posY: cardY,
          width: cardW,
          height: cardH,
          color: '#ffffff',
          properties: {
            cardData: {
              title: prod.title,
              description: prod.description,
              image: prod.image,
              price: prod.price,
              buttonText: 'Pesan via WhatsApp',
              buttonLink: `https://wa.me/${waFormatted}?text=${encodeURIComponent(
                `Halo ${brandName}, saya mau pesan ${prod.title} (${prod.price})`
              )}`
            },
            buttonVariant: 'rounded',
            buttonTextColor: '#ffffff'
          }
        }
      });
    }

    // =======================================================================
    // 3. KANVAS 3: TENTANG KAMI (ABOUT)
    // =======================================================================
    actions.push({
      type: 'CREATE_CANVAS',
      label: 'Membuat Halaman Tentang Kami (About)...',
      canvasKey: 'about',
      title: 'Tentang Kami',
      backgroundColor: template.aboutBg,
      height: 650
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambahkan bingkai dekorasi About...',
      canvasKey: 'about',
      element: {
        category: 'SHAPE',
        posX: 48,
        posY: 105,
        width: 400,
        height: 430,
        color: template.primaryColor,
        properties: {
          shapeType: 'rounded-rect',
          borderRadius: 28,
          opacity: 0.14
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Memasang foto cerita usaha...',
      canvasKey: 'about',
      element: {
        category: 'IMAGE',
        posX: 72,
        posY: 128,
        width: 390,
        height: 400,
        color: '#ffffff',
        properties: {
          imageUrl: template.aboutImage,
          objectFit: 'cover',
          borderRadius: 24
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis label Tentang Kami...',
      canvasKey: 'about',
      element: {
        category: 'TEXT',
        posX: 505,
        posY: 120,
        width: 220,
        height: 30,
        color: template.primaryColor,
        properties: {
          text: 'TENTANG KAMI',
          fontSize: 13,
          fontWeight: 'extrabold',
          font: 'Inter, sans-serif',
          textAlign: 'left'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis judul Tentang Kami...',
      canvasKey: 'about',
      element: {
        category: 'TEXT',
        posX: 505,
        posY: 155,
        width: 440,
        height: 85,
        color: '#0f172a',
        properties: {
          text: template.aboutTitle,
          fontSize: 30,
          fontWeight: 'extrabold',
          font: 'Inter, sans-serif',
          textAlign: 'left'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis cerita & keunggulan usaha...',
      canvasKey: 'about',
      element: {
        category: 'TEXT',
        posX: 505,
        posY: 252,
        width: 440,
        height: 115,
        color: '#475569',
        properties: {
          text: template.aboutStory,
          fontSize: 15,
          fontWeight: 'normal',
          font: 'Inter, sans-serif',
          textAlign: 'left'
        }
      }
    });

    // 3 Highlight Pills
    template.highlights.forEach((hl, idx) => {
      actions.push({
        type: 'ADD_ELEMENT',
        label: `Menambahkan keunggulan ${idx + 1}/3...`,
        canvasKey: 'about',
        element: {
          category: 'TEXT',
          posX: 505,
          posY: 382 + idx * 36,
          width: 360,
          height: 30,
          color: '#1e293b',
          properties: {
            text: hl,
            fontSize: 14,
            fontWeight: 'bold',
            font: 'Inter, sans-serif',
            textAlign: 'left'
          }
        }
      });
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Memasang tombol Hubungi Kami...',
      canvasKey: 'about',
      element: {
        category: 'BUTTON',
        posX: 505,
        posY: 505,
        width: 235,
        height: 50,
        color: template.primaryColor,
        properties: {
          text: 'Hubungi Kami Sekarang',
          buttonVariant: 'rounded',
          buttonTextColor: '#ffffff',
          linkType: 'canvas',
          targetCanvasId: '__KEY__:contact'
        }
      }
    });

    // =======================================================================
    // 4. KANVAS 4: KONTAK & NOMOR HP WHATSAPP
    // =======================================================================
    actions.push({
      type: 'CREATE_CANVAS',
      label: 'Membuat Halaman Kontak & Nomor HP...',
      canvasKey: 'contact',
      title: 'Kontak & Pemesanan',
      backgroundColor: '#0f172a',
      height: 650
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambahkan kartu kontak premium...',
      canvasKey: 'contact',
      element: {
        category: 'SHAPE',
        posX: 90,
        posY: 85,
        width: 820,
        height: 480,
        color: '#1e293b',
        properties: {
          shapeType: 'rounded-rect',
          borderRadius: 28,
          borderColor: '#334155',
          borderWidth: 1,
          shadow: 'lg'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis judul Kontak & Pemesanan...',
      canvasKey: 'contact',
      element: {
        category: 'TEXT',
        posX: 150,
        posY: 135,
        width: 700,
        height: 56,
        color: '#ffffff',
        properties: {
          text: `Pesan Produk ${brandName} Sekarang!`,
          fontSize: 32,
          fontWeight: 'extrabold',
          font: 'Inter, sans-serif',
          textAlign: 'center'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis ajakan konsultasi...',
      canvasKey: 'contact',
      element: {
        category: 'TEXT',
        posX: 180,
        posY: 198,
        width: 640,
        height: 48,
        color: '#cbd5e1',
        properties: {
          text: 'Ada pertanyaan, ingin pesan satuan atau paket acara? Tim kami siap melayani Anda dengan cepat.',
          fontSize: 15,
          fontWeight: 'normal',
          font: 'Inter, sans-serif',
          textAlign: 'center'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: `Menampilkan nomor HP ${phone}...`,
      canvasKey: 'contact',
      element: {
        category: 'TEXT',
        posX: 180,
        posY: 266,
        width: 640,
        height: 44,
        color: '#34d399',
        properties: {
          text: `📞 Nomor HP / WhatsApp: ${phone}`,
          fontSize: 22,
          fontWeight: 'extrabold',
          font: 'Inter, sans-serif',
          textAlign: 'center'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menulis jam buka & lokasi...',
      canvasKey: 'contact',
      element: {
        category: 'TEXT',
        posX: 180,
        posY: 318,
        width: 640,
        height: 40,
        color: '#94a3b8',
        properties: {
          text: '📍 Melayani Pengiriman & Ambil di Toko • Buka Setiap Hari 08.00 – 21.00 WIB',
          fontSize: 14,
          fontWeight: 'medium',
          font: 'Inter, sans-serif',
          textAlign: 'center'
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Memasang tombol WhatsApp aktif...',
      canvasKey: 'contact',
      element: {
        category: 'BUTTON',
        posX: 325,
        posY: 388,
        width: 350,
        height: 58,
        color: '#059669',
        properties: {
          text: `Hubungi WhatsApp (${phone})`,
          buttonVariant: 'pill',
          buttonTextColor: '#ffffff',
          linkType: 'wa',
          waNumber: phone,
          waMessage: `Halo ${brandName}, saya ingin bertanya dan memesan produk.`
        }
      }
    });

    actions.push({
      type: 'ADD_ELEMENT',
      label: 'Menambahkan footer hak cipta...',
      canvasKey: 'contact',
      element: {
        category: 'TEXT',
        posX: 200,
        posY: 495,
        width: 600,
        height: 30,
        color: '#64748b',
        properties: {
          text: `© ${new Date().getFullYear()} ${brandName} • Dibangun dengan NexaWeb AI`,
          fontSize: 12,
          fontWeight: 'normal',
          font: 'Inter, sans-serif',
          textAlign: 'center'
        }
      }
    });

    return {
      isFullBuild: true,
      source: 'smart-engine',
      reply: `Selesai! Website **${brandName}** telah saya rakit lengkap di kanvas Anda:\n\n• **Kanvas 1 (Beranda)**: Navbar terhubung, Hero Headline, Foto Utama, & Tombol CTA\n• **Kanvas 2 (Katalog Produk)**: ${productCount} Kartu Produk lengkap dengan foto, harga, & link WhatsApp\n• **Kanvas 3 (Tentang Kami)**: Cerita usaha, foto, & 3 poin keunggulan\n• **Kanvas 4 (Kontak)**: Nomor HP \`${phone}\` & tombol Chat WhatsApp aktif\n\nSemua elemen 100% bebas digeser, di-resize, atau diedit ulang!`,
      actions
    };
  }

  // =========================================================================
  // 2. BERSIHKAN / RESET KANVAS
  // =========================================================================
  if (lower.includes('hapus semua') || lower.includes('bersihkan kanvas') || lower.includes('reset kanvas')) {
    return {
      source: 'smart-engine',
      reply: `Beres! Seluruh elemen pada ${activeCanvas.title || `Kanvas ${activeCanvas.pageIndex}`} telah dibersihkan.`,
      actions: [
        {
          type: 'CLEAR_CANVAS',
          label: 'Membersihkan kanvas aktif...'
        }
      ]
    };
  }

  // =========================================================================
  // 3. TAMBAH HALAMAN / KANVAS BARU
  // =========================================================================
  if (
    lower.includes('tambah kanvas') ||
    lower.includes('tambah halaman') ||
    lower.includes('lembar baru') ||
    lower.includes('kanvas baru')
  ) {
    return {
      source: 'smart-engine',
      reply: `Siap! Lembar kanvas baru (Kanvas ${allCanvases.length + 1}) berhasil ditambahkan.`,
      actions: [
        {
          type: 'CREATE_CANVAS',
          label: `Membuat Kanvas ${allCanvases.length + 1}...`,
          canvasKey: `page-${allCanvases.length + 1}`,
          title: `Kanvas ${allCanvases.length + 1}`,
          backgroundColor: '#ffffff',
          height: CANVAS_DEFAULT_HEIGHT
        }
      ]
    };
  }

  // =========================================================================
  // 4. UBAH WARNA LATAR / TEMA KANVAS
  // =========================================================================
  if (
    lower.includes('warna latar') ||
    lower.includes('background') ||
    lower.includes('ganti warna') ||
    lower.includes('ubah warna') ||
    lower.includes('dark mode') ||
    lower.includes('tema gelap')
  ) {
    let color = '#f8fafc';
    let colorName = 'abu-abu lembut';
    let isDark = false;

    if (lower.includes('krem') || lower.includes('warm') || lower.includes('hangat')) {
      color = '#fffbeb';
      colorName = 'krem hangat';
    } else if (lower.includes('biru')) {
      color = '#eff6ff';
      colorName = 'biru lembut';
    } else if (lower.includes('hijau') || lower.includes('mint')) {
      color = '#ecfdf5';
      colorName = 'hijau mint';
    } else if (lower.includes('pink') || lower.includes('merah muda')) {
      color = '#fdf2f8';
      colorName = 'pink pastel';
    } else if (lower.includes('gelap') || lower.includes('hitam') || lower.includes('dark')) {
      color = '#0f172a';
      colorName = 'slate gelap premium';
      isDark = true;
    } else if (lower.includes('putih')) {
      color = '#ffffff';
      colorName = 'putih bersih';
    }

    const actions: AdvanceAiAction[] = [
      {
        type: 'SET_CANVAS_STYLE',
        label: `Mengubah latar kanvas jadi ${colorName}...`,
        backgroundColor: color
      }
    ];
    if (isDark) {
      actions.push({
        type: 'UPDATE_ALL_TEXT_COLOR',
        label: 'Menyesuaikan kontras teks menjadi putih...',
        color: '#f8fafc'
      });
    }

    return {
      source: 'smart-engine',
      reply: `Beres! Warna latar ${activeCanvas.title || `Kanvas ${activeCanvas.pageIndex}`} telah diubah menjadi ${colorName} (${color}).`,
      actions
    };
  }

  // =========================================================================
  // 5. TAMBAH BAGIAN KONTAK / NOMOR HP
  // =========================================================================
  if (lower.includes('kontak') || lower.includes('contact') || lower.includes('nomer hp') || lower.includes('nomor hp')) {
    const phone = extractPhoneNumber(prompt);
    return {
      source: 'smart-engine',
      reply: `Bagian kontak dengan nomor HP **${phone}** dan tombol WhatsApp aktif berhasil ditambahkan ke kanvas!`,
      actions: [
        {
          type: 'ADD_ELEMENT',
          label: 'Membuat kartu background kontak...',
          element: {
            category: 'SHAPE',
            posX: 140,
            posY: 360,
            width: 720,
            height: 240,
            color: '#0f172a',
            properties: {
              shapeType: 'rounded-rect',
              borderRadius: 24,
              shadow: 'lg'
            }
          }
        },
        {
          type: 'ADD_ELEMENT',
          label: 'Menulis judul Hubungi Kami...',
          element: {
            category: 'TEXT',
            posX: 200,
            posY: 392,
            width: 600,
            height: 44,
            color: '#ffffff',
            properties: {
              text: 'Hubungi Kami & Pesan Sekarang',
              fontSize: 26,
              fontWeight: 'extrabold',
              font: 'Inter, sans-serif',
              textAlign: 'center'
            }
          }
        },
        {
          type: 'ADD_ELEMENT',
          label: `Menampilkan nomor HP ${phone}...`,
          element: {
            category: 'TEXT',
            posX: 220,
            posY: 444,
            width: 560,
            height: 36,
            color: '#34d399',
            properties: {
              text: `📞 WhatsApp / HP: ${phone}`,
              fontSize: 18,
              fontWeight: 'bold',
              font: 'Inter, sans-serif',
              textAlign: 'center'
            }
          }
        },
        {
          type: 'ADD_ELEMENT',
          label: 'Memasang tombol Chat WhatsApp...',
          element: {
            category: 'BUTTON',
            posX: 350,
            posY: 504,
            width: 300,
            height: 52,
            color: '#059669',
            properties: {
              text: 'Chat via WhatsApp',
              buttonVariant: 'pill',
              buttonTextColor: '#ffffff',
              linkType: 'wa',
              waNumber: phone,
              waMessage: 'Halo, saya ingin memesan produk Anda.'
            }
          }
        }
      ]
    };
  }

  // =========================================================================
  // 6. TAMBAH TOMBOL CTA / WHATSAPP
  // =========================================================================
  if (lower.includes('tombol') || lower.includes('button') || lower.includes('cta')) {
    const isWa = lower.includes('wa') || lower.includes('whatsapp') || lower.includes('pesan') || lower.includes('hubungi');
    const phone = extractPhoneNumber(prompt);
    return {
      source: 'smart-engine',
      reply: `Tombol ${isWa ? 'WhatsApp interaktif' : 'CTA'} berhasil dipasang di kanvas aktif.`,
      actions: [
        {
          type: 'ADD_ELEMENT',
          label: isWa ? 'Memasang tombol WhatsApp...' : 'Memasang tombol aksi...',
          element: {
            category: 'BUTTON',
            posX: Math.round((CANVAS_DEFAULT_WIDTH - 240) / 2),
            posY: Math.round((CANVAS_DEFAULT_HEIGHT - 52) / 2) + 40,
            width: 240,
            height: 52,
            color: isWa ? '#059669' : '#2563eb',
            properties: {
              text: isWa ? 'Hubungi via WhatsApp' : 'Pelajari Selengkapnya',
              buttonVariant: 'pill',
              buttonTextColor: '#ffffff',
              linkType: isWa ? 'wa' : 'url',
              waNumber: phone,
              waMessage: 'Halo, saya ingin memesan produk Anda.'
            }
          }
        }
      ]
    };
  }

  // =========================================================================
  // 7. TAMBAH KARTU PRODUK (1 ATAU BANYAK)
  // =========================================================================
  if (lower.includes('produk') || lower.includes('menu') || lower.includes('katalog') || lower.includes('kartu')) {
    const template = detectBusinessTemplate(prompt);
    const countMatch = prompt.match(/(\d+)\s*(?:produk|menu|item|kartu|donat|kopi)/i);
    const count = countMatch ? Math.min(4, Math.max(1, parseInt(countMatch[1], 10))) : 1;
    const actions: AdvanceAiAction[] = [];

    for (let i = 0; i < count; i++) {
      const prod = template.products[i % template.products.length];
      const cardW = count === 1 ? 320 : 290;
      const totalW = count * cardW + (count - 1) * 24;
      const startX = Math.max(20, Math.round((CANVAS_DEFAULT_WIDTH - totalW) / 2));

      actions.push({
        type: 'ADD_ELEMENT',
        label: `Menambahkan kartu produk ${prod.title}...`,
        element: {
          category: 'PRODUCT',
          posX: startX + i * (cardW + 24),
          posY: 130,
          width: cardW,
          height: 390,
          color: '#ffffff',
          properties: {
            cardData: {
              title: prod.title,
              description: prod.description,
              image: prod.image,
              price: prod.price,
              buttonText: 'Pesan Sekarang',
              buttonLink: `https://wa.me/6281234567890?text=${encodeURIComponent(`Halo, saya mau pesan ${prod.title}`)}`
            },
            buttonVariant: 'rounded',
            buttonTextColor: '#ffffff'
          }
        }
      });
    }

    return {
      source: 'smart-engine',
      reply: `Beres! ${count} kartu produk lengkap dengan foto, harga, dan tombol pesan berhasil ditambahkan ke kanvas.`,
      actions
    };
  }

  // =========================================================================
  // 8. TAMBAH NAVBAR
  // =========================================================================
  if (lower.includes('nav') || lower.includes('menu atas') || lower.includes('header')) {
    return {
      source: 'smart-engine',
      reply: 'Bilah navigasi (Navbar) telah dipasang di bagian atas kanvas aktif.',
      actions: [
        {
          type: 'ADD_ELEMENT',
          label: 'Memasang Navbar di bagian atas...',
          element: {
            category: 'NAV',
            posX: 30,
            posY: 20,
            width: 940,
            height: 64,
            color: '#ffffff',
            properties: {
              navBrand: 'Toko UMKM Saya',
              navVariant: 'floating',
              color: '#0f172a',
              navItems: [
                { id: 'nav-1', label: 'Beranda', targetCanvasId: allCanvases[0]?.id },
                { id: 'nav-2', label: 'Produk', targetCanvasId: allCanvases[1]?.id || allCanvases[0]?.id },
                { id: 'nav-3', label: 'Tentang Kami', targetCanvasId: allCanvases[2]?.id || allCanvases[0]?.id },
                { id: 'nav-4', label: 'Kontak', targetCanvasId: allCanvases[allCanvases.length - 1]?.id }
              ]
            }
          }
        }
      ]
    };
  }

  // =========================================================================
  // 9. TAMBAH SHAPE / BENTUK GEOMETRIS
  // =========================================================================
  if (
    lower.includes('shape') ||
    lower.includes('bentuk') ||
    lower.includes('lingkaran') ||
    lower.includes('circle') ||
    lower.includes('segitiga') ||
    lower.includes('triangle') ||
    lower.includes('bintang') ||
    lower.includes('star') ||
    lower.includes('hati') ||
    lower.includes('heart') ||
    lower.includes('panah') ||
    lower.includes('kotak') ||
    lower.includes('garis')
  ) {
    let shapeType: any = 'rounded-rect';
    let shapeName = 'kotak halus';
    let width = 200;
    let height = 140;
    let color = '#2563eb';

    if (lower.includes('lingkaran') || lower.includes('circle')) {
      shapeType = 'circle';
      shapeName = 'lingkaran';
      width = 160;
      height = 160;
    } else if (lower.includes('segitiga') || lower.includes('triangle')) {
      shapeType = 'triangle';
      shapeName = 'segitiga';
      width = 160;
      height = 160;
    } else if (lower.includes('bintang') || lower.includes('star')) {
      shapeType = 'star';
      shapeName = 'bintang emas';
      width = 160;
      height = 160;
      color = '#f59e0b';
    } else if (lower.includes('hati') || lower.includes('heart')) {
      shapeType = 'heart';
      shapeName = 'hati';
      width = 160;
      height = 160;
      color = '#ef4444';
    } else if (lower.includes('panah')) {
      shapeType = 'arrow-right';
      shapeName = 'panah';
      width = 200;
      height = 90;
    } else if (lower.includes('garis')) {
      shapeType = 'line';
      shapeName = 'garis pembatas';
      width = 380;
      height = 28;
      color = '#94a3b8';
    }

    return {
      source: 'smart-engine',
      reply: `Bentuk **${shapeName}** berhasil ditambahkan ke tengah kanvas!`,
      actions: [
        {
          type: 'ADD_ELEMENT',
          label: `Menggambar shape ${shapeName}...`,
          element: {
            category: 'SHAPE',
            posX: Math.round((CANVAS_DEFAULT_WIDTH - width) / 2),
            posY: Math.round((CANVAS_DEFAULT_HEIGHT - height) / 2),
            width,
            height,
            color,
            properties: {
              shapeType,
              borderRadius: shapeType === 'rounded-rect' ? 20 : 0,
              shadow: 'sm'
            }
          }
        }
      ]
    };
  }

  // =========================================================================
  // 10. DEFAULT: TAMBAH TEKS HEADLINE / COPYWRITING
  // =========================================================================
  const cleanText =
    prompt.length > 5 && !lower.startsWith('tambah')
      ? prompt
      : 'Solusi Terbaik Untuk Kebutuhan Anda';

  return {
    source: 'smart-engine',
    reply: `Teks "${cleanText}" berhasil ditambahkan ke kanvas aktif. Anda juga bisa meminta saya membuatkan **website lengkap multi-halaman**, misal: *"Buatkan website UMKM penjualan donat 4 produk lengkap dengan about dan kontak"*!`,
    actions: [
      {
        type: 'ADD_ELEMENT',
        label: 'Menuliskan teks ke kanvas...',
        element: {
          category: 'TEXT',
          posX: Math.round((CANVAS_DEFAULT_WIDTH - 560) / 2),
          posY: Math.round((CANVAS_DEFAULT_HEIGHT - 80) / 2) - 20,
          width: 560,
          height: 80,
          color: '#0f172a',
          properties: {
            text: cleanText,
            fontSize: 34,
            fontWeight: 'extrabold',
            font: 'Inter, sans-serif',
            textAlign: 'center'
          }
        }
      }
    ]
  };
}
