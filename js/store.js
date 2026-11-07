/**
 * ============================================================================
 * IN-MEMORY DATA STORE (List<Class> ARCHITECTURE)
 * ============================================================================
 * Sesuai PRD Section 3 & Section 6:
 * - Tidak menggunakan database eksternal SQL/NoSQL (In-Memory Runtime).
 * - Menggunakan struktur kelas Section & Product dalam bentuk List (Array of Objects).
 * - Mendukung Drag & Drop interaktif:
 *   1. Drag & drop item produk dari Palet Samping ke dalam Kanvas / Katalog
 *   2. Drag & drop komponen bagian website (Hero, About, Catalog, dll)
 *   3. Re-order urutan komponen secara real-time
 * - Dilengkapi try...catch di seluruh operasi untuk mencegah fatal error.
 * ============================================================================
 */

// Helper untuk membuat ID acak berbentuk GUID / UUID
function generateGuid() {
  try {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  } catch (err) {
    console.error('Error saat generateGuid:', err);
    return 'guid-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
  }
}

// Helper untuk parsing harga angka yang fleksibel (misal: "25.000", "Rp 25.000", 25000)
function parsePrice(val) {
  try {
    if (typeof val === 'number') return isNaN(val) ? 0 : val;
    if (!val) return 0;
    const cleaned = String(val).replace(/[^0-9]/g, '');
    return parseInt(cleaned, 10) || 0;
  } catch (e) {
    return 0;
  }
}

/**
 * AC-3.2: Skema kelas Section wajib memiliki atribut:
 * Id (string/Guid), Type (HERO, CATALOG, ABOUT, CONTACT, FOOTER),
 * Title (string), Subtitle (string), Content (string), dan OrderIndex (int).
 */
class Section {
  constructor({ id = null, type = 'HERO', title = '', subtitle = '', content = '', orderIndex = 1 }) {
    try {
      this.id = id || generateGuid();
      this.type = type ? type.toUpperCase() : 'HERO';
      this.title = title || '';
      this.subtitle = subtitle || '';
      this.content = content || '';
      this.orderIndex = parseInt(orderIndex, 10) || 1;
    } catch (err) {
      console.error('Error saat membuat instance Section:', err);
      this.id = 'err-' + Date.now();
      this.type = 'HERO';
      this.title = 'Judul Bagian';
      this.subtitle = '';
      this.content = '';
      this.orderIndex = 1;
    }
  }
}

/**
 * AC-3.3: Skema kelas Product wajib memiliki atribut:
 * Id (string), Name (string), Price (numeric IDR), dan Category (string).
 */
class Product {
  constructor({ id = null, name = '', price = 0, category = 'Umum' }) {
    try {
      this.id = id || generateGuid();
      this.name = (name || 'Item Baru').trim();
      this.price = parsePrice(price);
      this.category = (category || 'Umum').trim();
    } catch (err) {
      console.error('Error saat membuat instance Product:', err);
      this.id = 'prod-' + Date.now();
      this.name = 'Item Baru';
      this.price = 0;
      this.category = 'Umum';
    }
  }
}

/**
 * Store In-Memory utama yang memegang List<Section>, List<Product>, dan Kolam Palet Item
 */
class InMemoryStore {
  constructor() {
    try {
      /** @type {Section[]} */
      this.sections = [];
      /** @type {Product[]} */
      this.products = [];
      /** @type {Product[]} Daftar item siap pakai di palet samping untuk di-drag and drop */
      this.availableItemsPool = [];
      /** @type {Object} Pengaturan Desain & Tema (Warna Latar, Teks, Tombol, dan Jenis Font) */
      this.theme = this.getDefaultTheme();
      /** @type {string} Template Gaya Desain Aktif (Default: modern-warung yang paling direkomendasikan) */
      this.designTemplate = 'modern-warung';

      this.initSeedData();
    } catch (err) {
      console.error('Gagal inisialisasi InMemoryStore:', err);
      this.sections = [];
      this.products = [];
      this.availableItemsPool = [];
      this.theme = this.getDefaultTheme();
      this.designTemplate = 'modern-warung';
    }
  }

  /**
   * Mengembalikan skema warna & font awal (Default Theme)
   */
  getDefaultTheme() {
    return {
      primaryColor: '#15803d',     // Warna Tombol & Aksen Utama (Hijau Emerald)
      secondaryColor: '#d97706',   // Warna Aksen Pendukung (Amber)
      backgroundColor: '#ffffff',  // Warna Latar Halaman (Putih Bersih)
      cardBackground: '#f8fafc',   // Warna Latar Kartu / Box (Slate-50)
      headingColor: '#0f172a',     // Warna Font Judul (Slate-900)
      textColor: '#334155',        // Warna Font Teks Isi / Paragraf (Slate-700)
      headingFont: 'Playfair Display', // Jenis Font Judul
      bodyFont: 'Plus Jakarta Sans',   // Jenis Font Isi Teks
      presetId: 'nusantara-hijau'
    };
  }

  /**
   * Mengambil ID template desain aktif
   */
  getDesignTemplate() {
    return this.designTemplate || 'modern-warung';
  }

  /**
   * Mengambil data lengkap template desain aktif
   */
  getActiveDesignTemplateData() {
    const id = this.getDesignTemplate();
    return DESIGN_TEMPLATES[id] || DESIGN_TEMPLATES['modern-warung'];
  }

  /**
   * Mengubah template gaya desain website
   * @param {string} templateId 
   * @param {boolean} applyMatchingTheme Apakah warna dan font juga diselaraskan otomatis
   */
  setDesignTemplate(templateId, applyMatchingTheme = true) {
    try {
      const template = DESIGN_TEMPLATES[templateId] || DESIGN_TEMPLATES['modern-warung'];
      this.designTemplate = template.id;

      if (applyMatchingTheme && template.styleConfig?.themePresetId) {
        const matchingTheme = THEME_PRESETS[template.styleConfig.themePresetId];
        if (matchingTheme) {
          this.updateTheme({
            ...matchingTheme,
            presetId: matchingTheme.id
          });
        }
      }

      return {
        success: true,
        templateId: this.designTemplate,
        template: template
      };
    } catch (err) {
      console.error('Error saat setDesignTemplate:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Mengembalikan seluruh koleksi template gaya desain
   */
  getAvailableDesignTemplates() {
    return DESIGN_TEMPLATES;
  }

  /**
   * Mengambil tema aktif
   */
  getTheme() {
    try {
      return { ...this.theme };
    } catch (e) {
      return this.getDefaultTheme();
    }
  }

  /**
   * Memperbarui pengaturan tema (warna latar, warna teks, tombol, atau font)
   */
  updateTheme(themeUpdates = {}) {
    try {
      this.theme = {
        ...this.theme,
        ...themeUpdates
      };
      return { success: true, theme: { ...this.theme } };
    } catch (err) {
      console.error('Error saat updateTheme:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Reset tema ke kondisi default
   */
  resetTheme() {
    try {
      this.theme = this.getDefaultTheme();
      return { success: true, theme: { ...this.theme } };
    } catch (err) {
      console.error('Error saat resetTheme:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * AC-3.4: Inisialisasi seed data default secara otomatis
   */
  initSeedData() {
    try {
      // Seed List<Product> aktif di kanvas
      this.products = [
        new Product({
          id: 'prod-1',
          name: 'Nasi Liwet Solo Komplit',
          price: 28000,
          category: 'Makanan Utama'
        }),
        new Product({
          id: 'prod-2',
          name: 'Ayam Goreng Lengkuas Gurih',
          price: 32000,
          category: 'Makanan Utama'
        }),
        new Product({
          id: 'prod-3',
          name: 'Es Dawet Ayu Gula Aren',
          price: 12000,
          category: 'Minuman Segar'
        }),
        new Product({
          id: 'prod-4',
          name: 'Tahu Tempe Bacem Khas Solo',
          price: 10000,
          category: 'Camilan Tradisional'
        })
      ];

      // Seed Palet Item yang sudah dibuat & siap di-drag ke kanvas
      this.availableItemsPool = [
        ...this.products.map(p => new Product({ id: p.id, name: p.name, price: p.price, category: p.category })),
        new Product({
          id: 'pool-1',
          name: 'Sate Ayam Madura Asli',
          price: 25000,
          category: 'Makanan Utama'
        }),
        new Product({
          id: 'pool-2',
          name: 'Rendang Daging Sapi Padang',
          price: 35000,
          category: 'Makanan Utama'
        }),
        new Product({
          id: 'pool-3',
          name: 'Bakso Sapi Urat Spesial',
          price: 22000,
          category: 'Makanan Utama'
        }),
        new Product({
          id: 'pool-4',
          name: 'Soto Betawi Kuah Susu',
          price: 30000,
          category: 'Makanan Utama'
        }),
        new Product({
          id: 'pool-5',
          name: 'Es Kopi Susu Gula Aren',
          price: 18000,
          category: 'Minuman Segar'
        }),
        new Product({
          id: 'pool-6',
          name: 'Es Jeruk Peras Segar',
          price: 8000,
          category: 'Minuman Segar'
        }),
        new Product({
          id: 'pool-7',
          name: 'Pisang Goreng Keju Cokelat',
          price: 15000,
          category: 'Camilan Tradisional'
        })
      ];

      // Seed List<Section> aktif di kanvas
      this.sections = [
        new Section({
          id: 'sec-hero-1',
          type: 'HERO',
          title: 'Dapoer Berkah Nusantara',
          subtitle: 'Masakan Tradisional Gurih & Asli Resep Warisan Nenek Sejak 1988',
          content: 'Kami menghadirkan aneka masakan Nusantara dengan bahan-bahan pilihan segar dari pasar lokal dan rempah alami terbaik. Higienis, terjangkau, dan lezat untuk keluarga Anda.',
          orderIndex: 1
        }),
        new Section({
          id: 'sec-about-2',
          type: 'ABOUT',
          title: 'Tentang Dapoer Berkah',
          subtitle: 'Kisah Kami Melayani Selera Nusantara Selama Lebih Dari 30 Tahun',
          content: 'Berawal dari warung makan sederhana di sudut pasar tradisional, kini Dapoer Berkah melayani ribuan porsi setiap bulan untuk pesanan harian, arisan, syukuran, dan katering kantor. Komitmen kami tetap sama: rasa rumahan yang otentik dan harga yang bersahabat bagi siapa saja.',
          orderIndex: 2
        }),
        new Section({
          id: 'sec-catalog-3',
          type: 'CATALOG',
          title: 'Daftar Menu & Produk Favorit',
          subtitle: 'Tarik & lepaskan item produk dari palet samping untuk menambahkannya ke sini',
          content: 'Semua masakan diolah setiap pagi tanpa bahan pengawet.',
          orderIndex: 3
        }),
        new Section({
          id: 'sec-contact-4',
          type: 'CONTACT',
          title: 'Hubungi Kami & Pemesanan',
          subtitle: 'Siap melayani pesanan katering, prasmanan, dan nasi kotak',
          content: 'WhatsApp: 0812-3456-7890 | Alamat: Jl. Kenanga No. 24, Pasar Minggu, Jakarta Selatan | Buka setiap hari: 08.00 - 20.00 WIB',
          orderIndex: 4
        }),
        new Section({
          id: 'sec-footer-5',
          type: 'FOOTER',
          title: 'Dapoer Berkah Nusantara',
          subtitle: 'Hak Cipta © 2026 Dapoer Berkah. Seluruh hak cipta dilindungi undang-undang.',
          content: 'Maju bersama UMKM Indonesia. Rasa otentik warisan keluarga.',
          orderIndex: 5
        })
      ];

      this.reorderIndexes();
      console.log('Seed mock data berhasil dimuat ke dalam memori aplikasi.');
      return true;
    } catch (err) {
      console.error('Error saat initSeedData:', err);
      return false;
    }
  }

  /**
   * AC-5.4: Reset Demo Data
   */
  resetDemoData() {
    try {
      this.initSeedData();
      return { success: true, message: 'Data demo berhasil direset ke kondisi awal.' };
    } catch (err) {
      console.error('Error saat resetDemoData:', err);
      return { success: false, message: 'Gagal mereset data demo: ' + err.message };
    }
  }

  /**
   * AC-5.1: Mengembalikan List<Section> yang diurutkan menurut OrderIndex ascending.
   */
  getSortedSections() {
    try {
      return [...this.sections].sort((a, b) => a.orderIndex - b.orderIndex);
    } catch (err) {
      console.error('Error saat getSortedSections:', err);
      return this.sections || [];
    }
  }

  /**
   * Operasi Tambah Komponen
   */
  addSection({ type, title, subtitle, content, orderIndex }) {
    try {
      let newOrderIndex = orderIndex;

      // Posisikan sebelum FOOTER, khusus NAVBAR ditaruh di urutan paling atas (order 1)
      if (newOrderIndex === undefined || newOrderIndex === null) {
        if (type && type.toUpperCase() === 'NAVBAR') {
          newOrderIndex = 1;
          // Geser semua section yang ada agar urutan mulai dari 2
          this.sections.forEach(s => {
            s.orderIndex += 1;
          });
        } else {
          const footerIndex = this.sections.findIndex(s => s.type === 'FOOTER');
          if (footerIndex !== -1) {
            newOrderIndex = this.sections[footerIndex].orderIndex;
            this.sections[footerIndex].orderIndex += 1;
          } else {
            newOrderIndex = this.sections.length + 1;
          }
        }
      } else {
        newOrderIndex = parseInt(newOrderIndex, 10);
      }

      const newSection = new Section({
        id: generateGuid(),
        type: type || 'ABOUT',
        title: title || 'Bagian Baru',
        subtitle: subtitle || '',
        content: content || '',
        orderIndex: newOrderIndex
      });

      this.sections.push(newSection);
      this.reorderIndexes();
      return { success: true, section: newSection };
    } catch (err) {
      console.error('Error saat addSection:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Sisipkan Section pada urutan tertentu (untuk Drag & Drop antar section)
   */
  insertSectionAt(targetOrderIndex, { type, title, subtitle, content }) {
    try {
      const newSection = new Section({
        id: generateGuid(),
        type: type || 'ABOUT',
        title: title || 'Bagian Baru',
        subtitle: subtitle || '',
        content: content || '',
        orderIndex: targetOrderIndex
      });

      // Geser semua section yang orderIndex >= targetOrderIndex
      this.sections.forEach(s => {
        if (s.orderIndex >= targetOrderIndex) {
          s.orderIndex += 1;
        }
      });

      this.sections.push(newSection);
      this.reorderIndexes();
      return { success: true, section: newSection };
    } catch (err) {
      console.error('Error saat insertSectionAt:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Operasi Edit Komponen
   */
  updateSection({ targetId, type, title, subtitle, content, orderIndex }) {
    try {
      let target = null;
      if (targetId) {
        target = this.sections.find(s => s.id === targetId || s.id.toLowerCase() === targetId.toLowerCase());
      }
      if (!target && type) {
        const cleanType = type.toUpperCase().trim();
        target = this.sections.find(s => s.type === cleanType);
      }
      if (!target && this.sections.length > 0) {
        target = this.sections[0];
      }

      if (!target) {
        return { success: false, error: 'Bagian website tidak ditemukan untuk diperbarui.' };
      }

      if (title !== undefined && title !== null && title !== '') target.title = title;
      if (subtitle !== undefined && subtitle !== null) target.subtitle = subtitle;
      if (content !== undefined && content !== null) target.content = content;
      if (type !== undefined && type !== null && type !== '') target.type = type.toUpperCase().trim();
      if (orderIndex !== undefined && orderIndex !== null && !isNaN(orderIndex)) {
        target.orderIndex = parseInt(orderIndex, 10);
        this.reorderIndexes();
      }

      return { success: true, section: target };
    } catch (err) {
      console.error('Error saat updateSection:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Operasi Hapus Komponen
   */
  deleteSection(targetIdOrType) {
    try {
      if (!targetIdOrType) {
        return { success: false, error: 'ID atau Tipe bagian harus ditentukan untuk dihapus.' };
      }

      const initialLength = this.sections.length;
      const foundById = this.sections.some(s => s.id === targetIdOrType);

      if (foundById) {
        // Hapus HANYA satu bagian yang memiliki id spesifik ini (aman jika ada multiple hero/bagian bertipe sama)
        this.sections = this.sections.filter(s => s.id !== targetIdOrType);
      } else {
        // Jika bukan ID, hapus berdasarkan nama tipe (misal: 'FOOTER')
        const targetType = targetIdOrType.toString().toUpperCase().trim();
        this.sections = this.sections.filter(s => s.type.toUpperCase() !== targetType);
      }

      if (this.sections.length === initialLength) {
        return { success: false, error: 'Bagian yang ingin dihapus tidak ditemukan.' };
      }

      this.reorderIndexes();
      return { success: true, count: initialLength - this.sections.length };
    } catch (err) {
      console.error('Error saat deleteSection:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Pindah urutan Section (Geser Naik atau Turun)
   */
  moveSection(id, direction) {
    try {
      const sorted = this.getSortedSections();
      const index = sorted.findIndex(s => s.id === id);
      if (index === -1) return { success: false, error: 'Bagian tidak ditemukan.' };

      if (direction === 'UP' && index > 0) {
        const temp = sorted[index].orderIndex;
        sorted[index].orderIndex = sorted[index - 1].orderIndex;
        sorted[index - 1].orderIndex = temp;
      } else if (direction === 'DOWN' && index < sorted.length - 1) {
        const temp = sorted[index].orderIndex;
        sorted[index].orderIndex = sorted[index + 1].orderIndex;
        sorted[index + 1].orderIndex = temp;
      }

      this.reorderIndexes();
      return { success: true };
    } catch (err) {
      console.error('Error saat moveSection:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Mengurutkan ulang OrderIndex menjadi 1, 2, 3, ... N
   */
  reorderIndexes() {
    try {
      this.sections.sort((a, b) => a.orderIndex - b.orderIndex);
      this.sections.forEach((sec, idx) => {
        sec.orderIndex = idx + 1;
      });
    } catch (err) {
      console.error('Error saat reorderIndexes:', err);
    }
  }

  /**
   * Mengambil semua item aktif di kanvas (List<Product>)
   */
  getProducts() {
    try {
      return [...this.products];
    } catch (err) {
      console.error('Error saat getProducts:', err);
      return [];
    }
  }

  /**
   * Mengambil item-item yang ada di palet samping untuk di-drag
   */
  getAvailableItems() {
    try {
      // Sinkronkan otomatis item yang ada di kanvas (this.products) ke dalam pool palet
      if (Array.isArray(this.products)) {
        this.products.forEach(prod => {
          const exists = this.availableItemsPool.some(
            p => p.id === prod.id || p.name.toLowerCase().trim() === prod.name.toLowerCase().trim()
          );
          if (!exists) {
            this.availableItemsPool.unshift(prod);
          }
        });
      }
      return [...this.availableItemsPool];
    } catch (err) {
      console.error('Error saat getAvailableItems:', err);
      return [];
    }
  }

  /**
   * Buat item baru ke dalam palet samping
   */
  createAvailableItem({ name, price, category }) {
    try {
      const parsedPrice = parsePrice(price);
      const newItem = new Product({
        id: generateGuid(),
        name: (name || '').trim() || 'Item Baru',
        price: parsedPrice,
        category: (category || '').trim() || 'Menu'
      });
      this.availableItemsPool.unshift(newItem);
      return { success: true, item: newItem };
    } catch (err) {
      console.error('Error saat createAvailableItem:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Tambah item produk ke dalam kanvas (bisa via Drag & Drop atau manual)
   * Otomatis memastikan section CATALOG ada di canvas
   */
  addProduct({ name, price, category }) {
    try {
      const parsedPrice = parsePrice(price);
      const newProduct = new Product({
        id: generateGuid(),
        name: (name || '').trim() || 'Item Baru',
        price: parsedPrice,
        category: (category || '').trim() || 'Makanan Utama'
      });
      this.products.push(newProduct);

      // Sinkronkan juga langsung ke palet samping (availableItemsPool) di posisi paling atas
      const alreadyInPool = this.availableItemsPool.some(
        p => p.id === newProduct.id || p.name.toLowerCase().trim() === newProduct.name.toLowerCase().trim()
      );
      if (!alreadyInPool) {
        this.availableItemsPool.unshift(newProduct);
      }

      // Pastikan ada section CATALOG agar item yang di-loop selalu tampil di canvas
      const hasCatalog = this.sections.some(s => s.type === 'CATALOG');
      if (!hasCatalog) {
        this.addSection({
          type: 'CATALOG',
          title: 'Daftar Menu & Produk',
          subtitle: 'Pilihan sajian istimewa andalan kami',
          content: 'Semua masakan diolah setiap hari dengan bahan pilihan segar.'
        });
      }

      console.log('Item produk berhasil masuk ke List<Product> kanvas:', newProduct);
      return { success: true, product: newProduct };
    } catch (err) {
      console.error('Error saat addProduct:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Edit item produk
   */
  updateProduct(id, { name, price, category }) {
    try {
      let product = null;
      if (id) product = this.products.find(p => p.id === id);
      if (!product && name) product = this.products.find(p => p.name.toLowerCase() === name.toLowerCase());
      if (!product && this.products.length > 0) product = this.products[0];

      if (!product) return { success: false, error: 'Item produk tidak ditemukan.' };

      if (name) product.name = name.trim();
      if (price !== undefined && price !== null) product.price = parsePrice(price);
      if (category) product.category = category.trim();

      return { success: true, product };
    } catch (err) {
      console.error('Error saat updateProduct:', err);
      return { success: false, error: err.message };
    }
  }

  /**
   * Hapus item produk dari List<Product>
   */
  deleteProduct(id) {
    try {
      const initialLength = this.products.length;
      const targetProduct = this.products.find(p => p.id === id);
      this.products = this.products.filter(p => p.id !== id);
      if (targetProduct) {
        this.availableItemsPool = this.availableItemsPool.filter(
          p => p.id !== id && p.name.toLowerCase().trim() !== targetProduct.name.toLowerCase().trim()
        );
      }
      if (this.products.length === initialLength) {
        return { success: false, error: 'Produk tidak ditemukan.' };
      }
      return { success: true };
    } catch (err) {
      console.error('Error saat deleteProduct:', err);
      return { success: false, error: err.message };
    }
  }
}

// Koleksi Gaya Desain Template Website Siap Pakai Tanpa Koding
const DESIGN_TEMPLATES = {
  'modern-warung': {
    id: 'modern-warung',
    name: 'Warung Modern & Bersih',
    isRecommended: true,
    score: '9.9/10',
    badge: 'Paling Laris & Efektif',
    tagline: 'Format paling efektif dan mudah digunakan dengan tingkat konversi pesanan WhatsApp tertinggi',
    recommendationReason: 'Layout ini terbukti paling disukai dan nyaman dibaca siapa saja: teks jelas dan ramah pemula, penataan menu 2 kolom sangat pas di HP dan laptop tanpa perlu paham koding, serta tombol pemesanan WhatsApp terpasang di posisi emas dengan konversi tertinggi.',
    bestFor: 'Warung Makan, Dapur Nusantara, Rumah Makan Padang, Aneka Nasi Liwet & Katering Harian',
    highlights: [
      'Struktur tata letak teruji menghasilkan pemesanan WhatsApp paling cepat',
      'Format tulisan jelas dan kontras tinggi, sangat nyaman dibaca',
      'Etalase daftar menu berpenampilan segar, higienis, dan terpercaya'
    ],
    styleConfig: {
      heroVariant: 'modern-centered',
      cardVariant: 'modern-rounded',
      badgeVariant: 'soft-pill',
      themePresetId: 'nusantara-hijau',
      accentLabel: 'Usaha Kuliner Terpercaya'
    }
  },
  'aesthetic-cafe': {
    id: 'aesthetic-cafe',
    name: 'Kafe & Kedai Estetik',
    isRecommended: false,
    score: '9.4/10',
    badge: 'Nuansa Hangat & Santai',
    tagline: 'Gaya tata letak modern estetik ala coffee shop dan bakery kekinian',
    recommendationReason: 'Sangat cocok jika usaha Anda menjual minuman racikan, kopi, pastry, atau kue basah yang mengutamakan suasana santai dan foto produk estetik.',
    bestFor: 'Kedai Kopi, Coffee Shop, Bakery, Toko Kue & Pastry, Minuman Kekinian',
    highlights: [
      'Header terbagi dua kolom (Split Grid) yang menampilkan cerita resep dan racikan',
      'Kartu menu bernuansa papan menu kafe dengan aksen border putus-putus (*dashed*)',
      'Tipografi hangat klasik yang membangkitkan rasa santai dan betah'
    ],
    styleConfig: {
      heroVariant: 'split-cafe',
      cardVariant: 'cafe-handcrafted',
      badgeVariant: 'dashed-tag',
      themePresetId: 'kopi-tradisional',
      accentLabel: 'Kedai Racikan Istimewa'
    }
  },
  'bold-fastfood': {
    id: 'bold-fastfood',
    name: 'Resto Mantap & Cepat Saji',
    isRecommended: false,
    score: '9.3/10',
    badge: 'Pedas & Menggugah Selera',
    tagline: 'Tampilan berani, menyala, dan memicu nafsu makan seketika',
    recommendationReason: 'Format dengan penekanan harga murah, paket kenyang, dan tombol pemesanan super mencolok yang langsung mendorong pelanggan memesan makanan.',
    bestFor: 'Ayam Geprek, Bakso Mercon, Sate Taichan, Bebek Goreng, Kuliner Sambal Pedas',
    highlights: [
      'Banner menyala dengan badge penanda promo dan headline ekstra berani',
      'Pita merah "TERLARIS" di kartu menu untuk mempercepat keputusan pembeli',
      'Tombol pemesanan WhatsApp berpendar (*glow pulse*) yang tidak bisa dilewatkan'
    ],
    styleConfig: {
      heroVariant: 'bold-banner',
      cardVariant: 'bold-compact',
      badgeVariant: 'high-contrast',
      themePresetId: 'merah-selera',
      accentLabel: 'Pedas Mantap Gurih Juara'
    }
  },
  'corporate-catering': {
    id: 'corporate-catering',
    name: 'Katering & Usaha Resmi',
    isRecommended: false,
    score: '9.5/10',
    badge: 'Resmi & Berstandar Halal',
    tagline: 'Tampilan terstruktur, profesional, dan meyakinkan untuk pesanan partai besar & kantor',
    recommendationReason: 'Menonjolkan legalitas, higienitas bersertifikat, dan kepastian kapasitas porsi untuk pesanan rapat kantor, arisan akbar, dan pesta pernikahan.',
    bestFor: 'Katering Nasi Kotak Kantor, Prasmanan Wedding, Paket Tumpeng, Bento Acara',
    highlights: [
      'Badge jaminan kebersihan, sertifikasi Halal, dan ketepatan pengantaran',
      'Kartu menu dengan rincian porsi, kapasitas pesanan, dan minimum order jelas',
      'Layout profesional yang meyakinkan panitia acara dan instansi'
    ],
    styleConfig: {
      heroVariant: 'corporate-card',
      cardVariant: 'corporate-clean',
      badgeVariant: 'sharp-tag',
      themePresetId: 'biru-terpercaya',
      accentLabel: 'Jasa Katering Resmi Berpengalaman'
    }
  },
  'luxury-artisan': {
    id: 'luxury-artisan',
    name: 'Kuliner Mewah & Hampers Sultan',
    isRecommended: false,
    score: '9.2/10',
    badge: 'Mewah & Eksklusif',
    tagline: 'Nuansa gelap elegan beraksen emas berkilau untuk produk premium dan hampers berkelas',
    recommendationReason: 'Pilihan tepat untuk produk bernilai tinggi seperti hampers hari raya, kue kering toples kaca, daging wagyu/steak siap saji, dan oleh-oleh premium.',
    bestFor: 'Hampers Lebaran/Natal, Artisan Cookies, Frozen Beef Premium, Oleh-oleh Sultan',
    highlights: [
      'Latar belakang hitam berwibawa dengan ornamen bingkai emas halus (*gold foil*)',
      'Tipografi ningrat dengan spasi huruf berjarak anggun',
      'Penanda koleksi eksklusif / edisi terbatas (*artisan selection*)'
    ],
    styleConfig: {
      heroVariant: 'luxury-artisan',
      cardVariant: 'luxury-gold',
      badgeVariant: 'gold-outline',
      themePresetId: 'emas-mewah',
      accentLabel: 'Koleksi Kuliner Eksklusif & Terbatas'
    }
  }
};

// Preset Tema Siap Pakai yang dirancang serasi dan ramah pemula (tanpa koding)
const THEME_PRESETS = {
  'nusantara-hijau': {
    id: 'nusantara-hijau',
    name: 'Hijau Daun Nusantara',
    description: 'Segar & alami, khas warung makan & kuliner sehat',
    badge: 'Paling Populer',
    primaryColor: '#15803d',
    secondaryColor: '#d97706',
    backgroundColor: '#ffffff',
    cardBackground: '#f0fdf4',
    headingColor: '#0f172a',
    textColor: '#334155',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans'
  },
  'kopi-tradisional': {
    id: 'kopi-tradisional',
    name: 'Kopi & Cokelat Klasik',
    description: 'Hangat & tenang, cocok untuk kedai kopi & aneka kue',
    badge: 'Nuansa Hangat',
    primaryColor: '#78350f',
    secondaryColor: '#b45309',
    backgroundColor: '#fefce8',
    cardBackground: '#fffbeb',
    headingColor: '#361605',
    textColor: '#451a03',
    headingFont: 'Playfair Display',
    bodyFont: 'Lora'
  },
  'merah-selera': {
    id: 'merah-selera',
    name: 'Merah Berani & Berselera',
    description: 'Menggugah selera, cocok untuk resto, sate, & ayam bakar',
    badge: 'Khas Resto',
    primaryColor: '#b91c1c',
    secondaryColor: '#ea580c',
    backgroundColor: '#fff7ed',
    cardBackground: '#ffffff',
    headingColor: '#7f1d1d',
    textColor: '#374151',
    headingFont: 'Poppins',
    bodyFont: 'Plus Jakarta Sans'
  },
  'biru-terpercaya': {
    id: 'biru-terpercaya',
    name: 'Biru Modern & Elegan',
    description: 'Bersih & profesional untuk usaha umum, katering & jasa',
    badge: 'Modern',
    primaryColor: '#1d4ed8',
    secondaryColor: '#0284c7',
    backgroundColor: '#f8fafc',
    cardBackground: '#ffffff',
    headingColor: '#0f172a',
    textColor: '#334155',
    headingFont: 'Inter',
    bodyFont: 'Inter'
  },
  'emas-mewah': {
    id: 'emas-mewah',
    name: 'Hitam & Emas Eksklusif',
    description: 'Mewah, elegan, dan berkelas tinggi untuk produk premium',
    badge: 'Eksklusif',
    primaryColor: '#d97706',
    secondaryColor: '#f59e0b',
    backgroundColor: '#0f172a',
    cardBackground: '#1e293b',
    headingColor: '#fbbf24',
    textColor: '#cbd5e1',
    headingFont: 'Playfair Display',
    bodyFont: 'Plus Jakarta Sans'
  }
};

// Inisialisasi global store instance dan ekspos langsung ke WINDOW
var appStore;
try {
  appStore = new InMemoryStore();
  if (typeof window !== 'undefined') {
    window.appStore = appStore;
    window.Section = Section;
    window.Product = Product;
    window.InMemoryStore = InMemoryStore;
    window.THEME_PRESETS = THEME_PRESETS;
    window.DESIGN_TEMPLATES = DESIGN_TEMPLATES;
  }
  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Section, Product, InMemoryStore, THEME_PRESETS, DESIGN_TEMPLATES, appStore };
  }
} catch (e) {
  console.error('Inisialisasi global appStore gagal:', e);
}
