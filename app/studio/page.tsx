'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Sparkles,
  ArrowLeft,
  Layout,
  Palette,
  Layers,
  Plus,
  UtensilsCrossed,
  RotateCcw,
  KeyRound,
  Eye,
  EyeOff,
  GripVertical,
  Trash2,
  Edit3,
  ChevronUp,
  ChevronDown,
  Navigation,
  MessageCircle,
  Phone,
  MapPin,
  Clock,
  HeartHandshake,
  Flame,
  Check,
  PackageOpen,
  Coffee,
  CheckCircle2,
  Undo2,
  Redo2,
  Rocket,
  Download
} from 'lucide-react';
import confetti from 'canvas-confetti';
import {
  SectionItem,
  SectionType,
  ProductItem,
  DesignTheme,
  DesignTemplate,
  NavLinkItem
} from '@/lib/types';
import {
  INITIAL_SECTIONS,
  INITIAL_PRODUCTS,
  INITIAL_PALETTE_ITEMS,
  DEFAULT_THEMES,
  DEFAULT_TEMPLATES
} from '@/lib/defaultData';
import AiCopilotSidebar from '@/components/studio/AiCopilotSidebar';
import SectionModals from '@/components/studio/SectionModals';
import { downloadWebsiteZip } from '@/lib/exportWebsite';
import { DeploySuccessModal } from '@/components/modals/DeploySuccessModal';

interface CanvasSnapshot {
  sections: SectionItem[];
  products: ProductItem[];
  paletteItems: ProductItem[];
  activeTheme: DesignTheme;
  activeDesign: DesignTemplate;
}

export default function StudioPage() {
  // 1. Data Store State
  const [sections, setSections] = useState<SectionItem[]>(INITIAL_SECTIONS);
  const [products, setProducts] = useState<ProductItem[]>(INITIAL_PRODUCTS);
  const [paletteItems, setPaletteItems] = useState<ProductItem[]>(INITIAL_PALETTE_ITEMS);
  const [activeTheme, setActiveTheme] = useState<DesignTheme>(DEFAULT_THEMES[0]);
  const [activeDesign, setActiveDesign] = useState<DesignTemplate>(DEFAULT_TEMPLATES[0]);

  // Undo & Redo History System (Dibatasi Maksimal 3x Sebelum & 3x Sesudah)
  const [history, setHistory] = useState<CanvasSnapshot[]>([
    {
      sections: INITIAL_SECTIONS,
      products: INITIAL_PRODUCTS,
      paletteItems: INITIAL_PALETTE_ITEMS,
      activeTheme: DEFAULT_THEMES[0],
      activeDesign: DEFAULT_TEMPLATES[0]
    }
  ]);
  const [historyIndex, setHistoryIndex] = useState<number>(0);
  const isHistoryActionRef = React.useRef<boolean>(false);
  const isInitialMountRef = React.useRef<boolean>(true);
  const lastRecordedRef = React.useRef<string>('');

  // Sinkronisasi Riwayat Canvas: Simpan snapshot setiap ada perubahan (Maks. 3 Undo & 3 Redo)
  useEffect(() => {
    if (isInitialMountRef.current) {
      isInitialMountRef.current = false;
      lastRecordedRef.current = JSON.stringify({
        sections,
        products,
        paletteItems,
        themeId: activeTheme.id,
        designId: activeDesign.id
      });
      return;
    }

    if (isHistoryActionRef.current) {
      isHistoryActionRef.current = false;
      lastRecordedRef.current = JSON.stringify({
        sections,
        products,
        paletteItems,
        themeId: activeTheme.id,
        designId: activeDesign.id
      });
      return;
    }

    const currentKey = JSON.stringify({
      sections,
      products,
      paletteItems,
      themeId: activeTheme.id,
      designId: activeDesign.id
    });

    if (currentKey === lastRecordedRef.current) {
      return;
    }
    lastRecordedRef.current = currentKey;

    const newSnapshot: CanvasSnapshot = {
      sections: JSON.parse(JSON.stringify(sections)),
      products: JSON.parse(JSON.stringify(products)),
      paletteItems: JSON.parse(JSON.stringify(paletteItems)),
      activeTheme: { ...activeTheme },
      activeDesign: { ...activeDesign }
    };

    setHistory((prev) => {
      const branch = prev.slice(0, historyIndex + 1);
      const next = [...branch, newSnapshot];
      // Batasi maksimal 4 snapshot (1 state saat ini + maksimal 3 sebelum / undo)
      if (next.length > 4) {
        return next.slice(next.length - 4);
      }
      return next;
    });

    setHistoryIndex((prev) => Math.min(prev + 1, 3));
  }, [sections, products, paletteItems, activeTheme, activeDesign]);

  const canUndo = historyIndex > 0;
  const undoCount = historyIndex; // 0, 1, 2, atau 3
  const canRedo = historyIndex < history.length - 1;
  const redoCount = history.length - 1 - historyIndex; // 0, 1, 2, atau 3

  const handleUndo = () => {
    if (!canUndo) return;
    const targetIdx = historyIndex - 1;
    const target = history[targetIdx];
    if (!target) return;

    isHistoryActionRef.current = true;
    setSections(JSON.parse(JSON.stringify(target.sections)));
    setProducts(JSON.parse(JSON.stringify(target.products)));
    setPaletteItems(JSON.parse(JSON.stringify(target.paletteItems)));
    setActiveTheme({ ...target.activeTheme });
    setActiveDesign({ ...target.activeDesign });
    setHistoryIndex(targetIdx);
  };

  const handleRedo = () => {
    if (!canRedo) return;
    const targetIdx = historyIndex + 1;
    const target = history[targetIdx];
    if (!target) return;

    isHistoryActionRef.current = true;
    setSections(JSON.parse(JSON.stringify(target.sections)));
    setProducts(JSON.parse(JSON.stringify(target.products)));
    setPaletteItems(JSON.parse(JSON.stringify(target.paletteItems)));
    setActiveTheme({ ...target.activeTheme });
    setActiveDesign({ ...target.activeDesign });
    setHistoryIndex(targetIdx);
  };

  // 2. Editor & UI Control State
  const [isEditorMode, setIsEditorMode] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(true);
  const [isAiChatOpen, setIsAiChatOpen] = useState(true);
  const [sidebarTab, setSidebarTab] = useState<'items' | 'sections'>('items');
  const [highlightedSectionId, setHighlightedSectionId] = useState<string | null>(null);

  // Drag & Drop State untuk Bagian Web (Sections)
  const [draggedSectionIndex, setDraggedSectionIndex] = useState<number | null>(null);
  const [dragOverSectionIndex, setDragOverSectionIndex] = useState<number | null>(null);
  const [draggedPresetType, setDraggedPresetType] = useState<SectionType | null>(null);

  // 3. Form Buat Item Sendiri di Sidebar
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Makanan Utama');

  // 4. Modal States
  const [isAddSectionOpen, setIsAddSectionOpen] = useState(false);
  const [editingSection, setEditingSection] = useState<SectionItem | null>(null);
  const [isManageMenuOpen, setIsManageMenuOpen] = useState(false);
  const [isDesignModalOpen, setIsDesignModalOpen] = useState(false);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [wizardInfo, setWizardInfo] = useState<{ businessType: string; description: string } | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [lastExportedFileName, setLastExportedFileName] = useState('');

  // Cek API Key & Wizard Setup dari sessionStorage saat mount (PRD Step 3 Action Flow)
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const key = localStorage.getItem('gemini_api_key');
    setHasApiKey(Boolean(key && key.trim()));

    // Cek apakah ada data setup dari Studio Selection Wizard (Card 1 Submission)
    const setupRaw = sessionStorage.getItem('nexaweb_wizard_setup');
    if (!setupRaw) return;

    try {
      const setup = JSON.parse(setupRaw);
      sessionStorage.removeItem('nexaweb_wizard_setup'); // Konsumsi sekali agar tidak menimpa pengeditan manual berikutnya

      const bType: string = setup.businessType || 'Makanan & Minuman (Kuliner)';
      const desc: string = setup.description || '';
      const feat = setup.features || {
        userAuth: true,
        productCrud: true,
        whatsappOrder: true,
        cartEngine: true,
        contactHours: true
      };

      setWizardInfo({
        businessType: bType,
        description: desc
      });

      if (bType.includes('Pakaian') || bType.includes('Fashion')) {
        // Template Usaha Pakaian / Fashion
        setActiveTheme(DEFAULT_THEMES[3] || DEFAULT_THEMES[0]);
        setSections([
          {
            id: 'sec-nav-1',
            type: 'NAVBAR',
            title: 'Aura Mode & Butik',
            subtitle: 'Koleksi Busana Tren Kekinian',
            content: JSON.stringify([
              { label: 'Beranda', target: '#hero' },
              { label: 'Tentang Kami', target: '#about' },
              { label: 'Koleksi Busana', target: '#catalog' },
              { label: 'Kontak WhatsApp', target: '#contact' },
              ...(feat.userAuth ? [{ label: 'Akun Pelanggan', target: '#auth' }] : [])
            ]),
            orderIndex: 0
          },
          {
            id: 'sec-hero-1',
            type: 'HERO',
            title: 'Tampil Percaya Diri dengan Koleksi Busana Berkualitas',
            subtitle: desc || 'Pilihan busana modern & kasual dengan bahan adem terbaik, jahitan rapi, dan desain memikat.',
            content: feat.whatsappOrder ? 'Order Cepat Langsung via WhatsApp | Garansi Tukar Ukuran' : 'Koleksi Terbaru Musim Ini',
            orderIndex: 1
          },
          {
            id: 'sec-about-1',
            type: 'ABOUT',
            title: 'Cerita Aura Mode',
            subtitle: 'Hadir untuk mempercantik gaya harian Anda',
            content: desc || 'Kami menghadirkan koleksi busana berkualitas tinggi yang nyaman dipakai sepanjang hari dengan harga ramah kantong.',
            orderIndex: 2
          },
          {
            id: 'sec-catalog-1',
            type: 'CATALOG',
            title: 'Koleksi Busana Terfavorit',
            subtitle: 'Model terlaris minggu ini yang siap kirim ke rumah Anda',
            content: 'Tersedia berbagai pilihan ukuran dan warna menarik.',
            orderIndex: 3
          },
          {
            id: 'sec-contact-1',
            type: 'CONTACT',
            title: 'Pemesanan & Lokasi Toko',
            subtitle: 'Hubungi admin kami untuk konsultasi ukuran dan ketersediaan stok',
            content: 'WhatsApp: 0812-9876-5432 | Toko: Pasar Tanah Abang Blok A Lt. 2, Jakarta | Buka: Senin - Sabtu 09.00 - 17.00 WIB',
            waMessage: 'Halo Aura Mode, saya ingin bertanya tentang koleksi busana di website.',
            orderIndex: 4
          },
          {
            id: 'sec-footer-1',
            type: 'FOOTER',
            title: 'Aura Mode & Butik',
            subtitle: 'Hak Cipta © 2026 Aura Mode. Seluruh hak cipta dilindungi.',
            content: 'Website dibuat dengan NexaWeb.ai - Solusi Website Praktis UMKM.',
            orderIndex: 5
          }
        ]);

        setProducts([
          { id: 'prod-f1', name: 'Kemeja Katun Casual Pria Modern', price: 165000, category: 'Pakaian Pria' },
          { id: 'prod-f2', name: 'Gamis Silk Bordir Elegan', price: 275000, category: 'Busana Muslim' },
          { id: 'prod-f3', name: 'Celana Kulot Linen Highwaist', price: 135000, category: 'Bawahan' },
          { id: 'prod-f4', name: 'Dress Floral Casual Katun', price: 195000, category: 'Gaun & Dress' }
        ]);

        setPaletteItems([
          { id: 'pal-f1', name: 'Hijab Voal Motif Premium', price: 45000, category: 'Hijab' },
          { id: 'pal-f2', name: 'Blazer Formal Santai', price: 260000, category: 'Luaran' },
          { id: 'pal-f3', name: 'Kaos Polos Katun Combed 30s', price: 75000, category: 'Kaos' },
          { id: 'pal-f4', name: 'Totebag Kanvas Aesthetic', price: 55000, category: 'Aksesoris' }
        ]);
      } else if (bType.includes('Jasa') || bType.includes('Layanan')) {
        // Template Jasa / Layanan
        setActiveTheme(DEFAULT_THEMES[3] || DEFAULT_THEMES[0]);
        setSections([
          {
            id: 'sec-nav-1',
            type: 'NAVBAR',
            title: 'Mitra Solusi Jasa Profesional',
            subtitle: 'Layanan Terpercaya & Bergaransi',
            content: JSON.stringify([
              { label: 'Beranda', target: '#hero' },
              { label: 'Tentang Kami', target: '#about' },
              { label: 'Daftar Layanan', target: '#catalog' },
              { label: 'Kontak Cepat', target: '#contact' },
              ...(feat.userAuth ? [{ label: 'Akun Pelanggan', target: '#auth' }] : [])
            ]),
            orderIndex: 0
          },
          {
            id: 'sec-hero-1',
            type: 'HERO',
            title: 'Solusi Cepat, Rapi, & Bergaransi untuk Kebutuhan Anda',
            subtitle: desc || 'Didukung tenaga ahli berpengalaman dan peralatan lengkap standar industri. Konsultasi gratis langsung via WhatsApp.',
            content: feat.whatsappOrder ? 'Konsultasi Gratis via WhatsApp | Respon Cepat 10 Menit' : 'Layanan Jasa Terbaik Bergaransi',
            orderIndex: 1
          },
          {
            id: 'sec-about-1',
            type: 'ABOUT',
            title: 'Tentang Layanan Kami',
            subtitle: 'Berdedikasi memberikan hasil terbaik sejak 2019',
            content: desc || 'Kami berkomitmen memberikan pelayanan tepat waktu, transparan tanpa biaya tersembunyi, dan mengutamakan kepuasan pelanggan.',
            orderIndex: 2
          },
          {
            id: 'sec-catalog-1',
            type: 'CATALOG',
            title: 'Paket Pilihan Layanan Kami',
            subtitle: 'Pilih paket layanan yang sesuai dengan kebutuhan Anda',
            content: 'Dikerjakan langsung oleh teknisi dan spesialis bersertifikat.',
            orderIndex: 3
          },
          {
            id: 'sec-contact-1',
            type: 'CONTACT',
            title: 'Hubungi Kami & Jadwalkan Layanan',
            subtitle: 'Kami siap datang ke lokasi Anda atau melayani konsultasi online',
            content: 'WhatsApp: 0813-8888-9999 | Kantor: Jl. Gatot Subroto No. 45, Jakarta | Jam Operasional: Setiap Hari 08.00 - 21.00 WIB',
            waMessage: 'Halo Mitra Solusi, saya ingin berkonsultasi mengenai layanan jasa.',
            orderIndex: 4
          },
          {
            id: 'sec-footer-1',
            type: 'FOOTER',
            title: 'Mitra Solusi Jasa Profesional',
            subtitle: 'Hak Cipta © 2026 Mitra Solusi. Seluruh hak cipta dilindungi.',
            content: 'Website dibuat dengan NexaWeb.ai - Solusi Website Praktis UMKM.',
            orderIndex: 5
          }
        ]);

        setProducts([
          { id: 'prod-s1', name: 'Paket Servis Panggilan Standar', price: 150000, category: 'Layanan Utama' },
          { id: 'prod-s2', name: 'Paket Perawatan Berkala Lengkap', price: 320000, category: 'Layanan Utama' },
          { id: 'prod-s3', name: 'Pemeriksaan & Diagnosis Cepat', price: 75000, category: 'Pemeriksaan' },
          { id: 'prod-s4', name: 'Paket Solusi Tuntas Bergaransi 60 Hari', price: 650000, category: 'Paket Spesial' }
        ]);

        setPaletteItems([
          { id: 'pal-s1', name: 'Biaya Transport Teknisi Wilayah', price: 30000, category: 'Tambahan' },
          { id: 'pal-s2', name: 'Penggantian Komponen Standar', price: 125000, category: 'Komponen' },
          { id: 'pal-s3', name: 'Garansi Servis Tambahan 30 Hari', price: 80000, category: 'Garansi' }
        ]);
      } else if (bType.includes('Kerajinan') || bType.includes('Kriya')) {
        // Template Kerajinan Tangan / Kriya
        setActiveTheme(DEFAULT_THEMES[1] || DEFAULT_THEMES[0]);
        setSections([
          {
            id: 'sec-nav-1',
            type: 'NAVBAR',
            title: 'Kriya Karya Nusantara',
            subtitle: 'Kerajinan Tangan Autentik & Bernilai Seni',
            content: JSON.stringify([
              { label: 'Beranda', target: '#hero' },
              { label: 'Tentang Pengrajin', target: '#about' },
              { label: 'Katalog Kriya', target: '#catalog' },
              { label: 'Pemesanan', target: '#contact' },
              ...(feat.userAuth ? [{ label: 'Akun Pelanggan', target: '#auth' }] : [])
            ]),
            orderIndex: 0
          },
          {
            id: 'sec-hero-1',
            type: 'HERO',
            title: 'Karya Seni Kerajinan Tangan Unik & Bernilai Tinggi',
            subtitle: desc || 'Dibuat dengan ketelitian pengrajin lokal menggunakan bahan alami ramah lingkungan, mempercantik estetika rumah Anda.',
            content: feat.whatsappOrder ? 'Pesan Produk Kriya Asli Langsung via WhatsApp' : 'Koleksi Kerajinan Nusantara Pilihan',
            orderIndex: 1
          },
          {
            id: 'sec-about-1',
            type: 'ABOUT',
            title: 'Kisah di Balik Setiap Anyaman & Ukiran',
            subtitle: 'Melestarikan warisan seni budaya Indonesia',
            content: desc || 'Setiap produk kriya kami dikerjakan secara manual (handmade) oleh para pengrajin desa binaan dengan penuh cinta dan dedikasi.',
            orderIndex: 2
          },
          {
            id: 'sec-catalog-1',
            type: 'CATALOG',
            title: 'Koleksi Kriya Unggulan',
            subtitle: 'Karya kerajinan tangan terpopuler untuk dekorasi dan cinderamata',
            content: 'Cocok untuk hadiah istimewa, souvenir acara, dan perabot rumah.',
            orderIndex: 3
          },
          {
            id: 'sec-contact-1',
            type: 'CONTACT',
            title: 'Hubungi Pengrajin & Galeri Kami',
            subtitle: 'Menerima pesanan custom souvenir dan cinderamata partai besar',
            content: 'WhatsApp: 0812-7777-6666 | Workshop: Desa Wisata Pengrajin No. 12, Sleman, Yogyakarta | Buka: Setiap Hari 08.00 - 18.00 WIB',
            waMessage: 'Halo Kriya Karya Nusantara, saya tertarik memesan produk kerajinan tangan.',
            orderIndex: 4
          },
          {
            id: 'sec-footer-1',
            type: 'FOOTER',
            title: 'Kriya Karya Nusantara',
            subtitle: 'Hak Cipta © 2026 Kriya Karya Nusantara. Seluruh hak cipta dilindungi.',
            content: 'Website dibuat dengan NexaWeb.ai - Solusi Website Praktis UMKM.',
            orderIndex: 5
          }
        ]);

        setProducts([
          { id: 'prod-k1', name: 'Tas Anyaman Rotan Motif Etnik', price: 135000, category: 'Anyaman & Rotan' },
          { id: 'prod-k2', name: 'Vas Bunga Keramik Handmade Berglasur', price: 95000, category: 'Keramik' },
          { id: 'prod-k3', name: 'Lampu Meja Anyaman Bambu Minimalis', price: 165000, category: 'Dekorasi Rumah' },
          { id: 'prod-k4', name: 'Dompet Kulit Nabati Jahit Tangan', price: 145000, category: 'Kriya Kulit' }
        ]);

        setPaletteItems([
          { id: 'pal-k1', name: 'Tatakan Gelas Kayu Jati Set (6 pcs)', price: 48000, category: 'Peralatan Kayu' },
          { id: 'pal-k2', name: 'Taplak Meja Tenun Asli Motif Parang', price: 115000, category: 'Kain Tenun' },
          { id: 'pal-k3', name: 'Kotak Tisu Anyaman Enceng Gondok', price: 52000, category: 'Aksesoris Rumah' }
        ]);
      } else if (bType !== 'Makanan & Minuman (Kuliner)') {
        // Usaha Lainnya (Tulis Sendiri)
        const customTitle = setup.customBusinessType || bType;
        setActiveTheme(DEFAULT_THEMES[0]);
        setSections((prev) =>
          prev.map((s) => {
            if (s.type === 'NAVBAR' || s.type === 'FOOTER') {
              return { ...s, title: customTitle };
            }
            if (s.type === 'HERO') {
              return {
                ...s,
                title: `Selamat Datang di ${customTitle}`,
                subtitle: desc || s.subtitle
              };
            }
            if (s.type === 'ABOUT' && desc) {
              return {
                ...s,
                title: `Tentang ${customTitle}`,
                content: desc
              };
            }
            return s;
          })
        );
      } else {
        // Makanan & Minuman dengan deskripsi kustom jika diisi
        if (desc) {
          setSections((prev) =>
            prev.map((s) => {
              if (s.type === 'ABOUT') {
                return { ...s, content: desc };
              }
              return s;
            })
          );
        }
      }

      try {
        confetti({ particleCount: 50, spread: 80, origin: { y: 0.6 } });
      } catch {}
    } catch (e) {
      console.error('Error applying wizard setup:', e);
    }
  }, []);

  // Perhitungan Label Seragam (e.g. Hero #1, Hero #2, About #1, About #2)
  const getSectionUniformLabel = (section: SectionItem) => {
    const sameType = sections.filter((s) => s.type === section.type);
    const index = sameType.findIndex((s) => s.id === section.id) + 1;
    const typeNames: Record<SectionType, string> = {
      NAVBAR: 'Navbar Navigasi',
      HERO: 'Hero',
      ABOUT: 'About',
      CATALOG: 'Katalog Menu',
      CONTACT: 'Kontak WhatsApp',
      FOOTER: 'Footer'
    };
    return `${typeNames[section.type] || section.type} #${index}`;
  };

  // Scroll & Sorot Bagian Kanvas
  const handleHighlightSection = (secId: string) => {
    setHighlightedSectionId(secId);
    const el = document.getElementById(`section-${secId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    setTimeout(() => {
      setHighlightedSectionId(null);
    }, 2000);
  };

  // Drag & Drop Handler untuk Item Produk
  const handleDragStart = (e: React.DragEvent, item: ProductItem) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDropOnCatalog = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const raw = e.dataTransfer.getData('text/plain');
      if (!raw) return;
      const item: ProductItem = JSON.parse(raw);
      addProductToCanvas(item);
    } catch (err) {
      console.error('Error drop item:', err);
    }
  };

  // Handler Deploy / Ekspor Website Menjadi File ZIP Standalone (index.html & style.css)
  const handleDeployWebsite = async () => {
    try {
      setIsExporting(true);
      const fileName = await downloadWebsiteZip(sections, products, activeTheme, activeDesign);
      setLastExportedFileName(fileName);
      setIsDeployModalOpen(true);
    } catch (err) {
      console.error('Error generating website zip:', err);
      alert('Terjadi kendala saat merakit file ZIP website. Silakan coba kembali.');
    } finally {
      setIsExporting(false);
    }
  };

  const addProductToCanvas = (item: ProductItem) => {
    const newProd: ProductItem = {
      id: item.id || ('prod-' + Date.now()),
      name: item.name,
      price: item.price,
      category: item.category
    };
    setProducts((prev) => [...prev, newProd]);
    setPaletteItems((prev) => {
      if (prev.some((p) => p.name.toLowerCase() === newProd.name.toLowerCase())) {
        return prev;
      }
      return [newProd, ...prev];
    });
    try {
      confetti({ particleCount: 30, spread: 60, origin: { y: 0.7 } });
    } catch {}
  };

  // Drag & Drop Handlers untuk Bagian Web (Sections Reorder & Preset Insertion)
  const handleSectionDragStart = (e: React.DragEvent, index: number) => {
    setDraggedSectionIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', `section:${index}`);
  };

  const handleSectionDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverSectionIndex !== index) {
      setDragOverSectionIndex(index);
    }
  };

  const handleSectionDragLeave = (e: React.DragEvent, index: number) => {
    if (dragOverSectionIndex === index) {
      setDragOverSectionIndex(null);
    }
  };

  const handleSectionDrop = (e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    setDragOverSectionIndex(null);

    // 1. Kasus: Drop Preset Bagian Baru dari Sidebar
    const presetType = (e.dataTransfer.getData('application/nexaweb-preset') || draggedPresetType) as SectionType | null;
    if (presetType) {
      insertPresetSectionAt(presetType, targetIndex);
      setDraggedPresetType(null);
      setDraggedSectionIndex(null);
      return;
    }

    // 2. Kasus: Pindah / Reorder Bagian yang Sudah Ada
    let sourceIndex = draggedSectionIndex;
    if (sourceIndex === null) {
      const raw = e.dataTransfer.getData('text/plain');
      if (raw && raw.startsWith('section:')) {
        sourceIndex = parseInt(raw.split(':')[1], 10);
      }
    }

    if (sourceIndex === null || isNaN(sourceIndex) || sourceIndex === targetIndex) {
      setDraggedSectionIndex(null);
      return;
    }

    const reordered = [...sections];
    const [moved] = reordered.splice(sourceIndex, 1);
    const destIndex = targetIndex > sourceIndex ? targetIndex - 1 : targetIndex;
    reordered.splice(destIndex, 0, moved);

    // Update index urutan
    reordered.forEach((s, idx) => {
      s.orderIndex = idx;
    });

    setSections(reordered);
    setDraggedSectionIndex(null);

    handleHighlightSection(moved.id);
    try {
      confetti({ particleCount: 25, spread: 50, origin: { y: 0.6 } });
    } catch {}
  };

  const handleSectionDragEnd = () => {
    setDraggedSectionIndex(null);
    setDragOverSectionIndex(null);
    setDraggedPresetType(null);
  };

  const insertPresetSectionAt = (type: SectionType, targetIndex: number) => {
    const newSec: SectionItem = {
      id: 'sec-' + Date.now(),
      type,
      title: type === 'HERO' ? 'Penawaran Spesial Terbaru' : `Bagian ${type}`,
      subtitle: type === 'HERO' ? 'Sajian lezat siap antar untuk Anda' : '',
      content: type === 'CONTACT' ? 'WhatsApp: 0812-3456-7890 | Alamat: Toko Kami | Buka: 08.00 - 20.00 WIB' : '',
      waMessage: type === 'CONTACT' ? 'Halo, saya ingin memesan menu dari website Anda.' : undefined,
      orderIndex: targetIndex
    };

    const updated = [...sections];
    const safeTarget = Math.min(Math.max(0, targetIndex), updated.length);
    updated.splice(safeTarget, 0, newSec);
    updated.forEach((s, idx) => {
      s.orderIndex = idx;
    });
    setSections(updated);
    handleHighlightSection(newSec.id);
    try {
      confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
    } catch {}
  };

  // Simpan Item Baru ke Palet
  const handleSaveItemToPalette = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    const priceNum = parseInt(newItemPrice.replace(/\D/g, ''), 10) || 15000;
    const newItem: ProductItem = {
      id: 'pal-' + Date.now(),
      name: newItemName.trim(),
      price: priceNum,
      category: newItemCategory
    };
    setPaletteItems((prev) => [newItem, ...prev]);
    // Juga langsung bisa dimasukkan ke katalog bila diinginkan
    addProductToCanvas(newItem);
    setNewItemName('');
    setNewItemPrice('');
  };

  // Tambah Preset Section dari Sidebar
  const handleAddPresetSection = (type: SectionType) => {
    const newSec: SectionItem = {
      id: 'sec-' + Date.now(),
      type,
      title: type === 'HERO' ? 'Penawaran Spesial Terbaru' : `Bagian ${type}`,
      subtitle: type === 'HERO' ? 'Sajian lezat siap antar untuk Anda' : '',
      content: type === 'CONTACT' ? 'WhatsApp: 0812-3456-7890 | Alamat: Toko Kami | Buka: 08.00 - 20.00 WIB' : '',
      waMessage: type === 'CONTACT' ? 'Halo, saya ingin memesan menu dari website Anda.' : undefined,
      orderIndex: sections.length + 1
    };
    setSections((prev) => [...prev, newSec]);
  };

  // Reorder Sections
  const handleMoveSection = (idx: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? idx - 1 : idx + 1;
    if (targetIdx < 0 || targetIdx >= sections.length) return;
    const updated = [...sections];
    const temp = updated[idx];
    updated[idx] = updated[targetIdx];
    updated[targetIdx] = temp;
    // update orderIndex
    updated.forEach((s, i) => {
      s.orderIndex = i;
    });
    setSections(updated);
  };

  // Delete Section
  const handleDeleteSection = (id: string) => {
    if (sections.length <= 1) {
      alert('Minimal harus ada 1 bagian di kanvas website.');
      return;
    }
    setSections((prev) => prev.filter((s) => s.id !== id));
  };

  // Eksekusi Tindakan AI (Action Dispatcher Lengkap: Reset, Judul, Isi, Menu, Nomor WA, Alamat, Navigasi, Tema, Template)
  const handleExecuteAiAction = (action: any) => {
    if (!action) return;

    // 1. KEMBALIKAN KE AWAL / RESET KANVAS
    if (action.type === 'RESET_CANVAS') {
      setSections(INITIAL_SECTIONS);
      setProducts(INITIAL_PRODUCTS);
      setPaletteItems(INITIAL_PALETTE_ITEMS);
      setActiveTheme(DEFAULT_THEMES[0]);
      setActiveDesign(DEFAULT_TEMPLATES[0]);
      setTimeout(() => {
        handleHighlightSection(INITIAL_SECTIONS[0]?.id || 'sec-nav-1');
      }, 100);
      return;
    }

    // 2. TAMBAH PRODUK / MENU BARU
    if (action.type === 'ADD_PRODUCT' && action.payload) {
      const p = action.payload;
      const newProd: ProductItem = {
        id: 'prod-' + Date.now(),
        name: p.name || 'Menu Spesial',
        price: p.price || 15000,
        category: p.category || 'Makanan Utama'
      };
      setProducts((prev) => [...prev, newProd]);
      setPaletteItems((prev) => {
        const withoutDup = prev.filter((item) => item.name.toLowerCase() !== newProd.name.toLowerCase());
        return [newProd, ...withoutDup];
      });
      // Pastikan sidebar palet terbuka dan mengarah ke tab "Item Menu"
      setSidebarTab('items');
      setIsPaletteOpen(true);

      // Efek confetti ceria saat produk berhasil ditambah
      try {
        confetti({ particleCount: 35, spread: 60, origin: { y: 0.7 } });
      } catch {}
      return;
    }

    // 3. HAPUS PRODUK / MENU
    if (action.type === 'DELETE_PRODUCT' && action.payload?.query) {
      const q = action.payload.query.toLowerCase().trim();
      setProducts((prev) => prev.filter((item) => !item.name.toLowerCase().includes(q)));
      setPaletteItems((prev) => prev.filter((item) => !item.name.toLowerCase().includes(q)));
      return;
    }

    // 4. GANTI GAYA DESAIN / TEMPLATE
    if (action.type === 'SET_DESIGN' && action.payload?.templateId) {
      const tid = action.payload.templateId;
      const tmpl = DEFAULT_TEMPLATES.find((t) => t.id === tid || t.name.toLowerCase().includes(tid.toLowerCase()));
      if (tmpl) {
        setActiveDesign(tmpl);
        if (tmpl.themeId) {
          const th = DEFAULT_THEMES.find((t) => t.id === tmpl.themeId);
          if (th) setActiveTheme(th);
        }
      }
      return;
    }

    // 5. GANTI TEMA / WARNA
    if (action.type === 'SET_THEME' && action.payload?.themeId) {
      const found = DEFAULT_THEMES.find((t) => t.id === action.payload.themeId);
      if (found) setActiveTheme(found);
      return;
    }

    // 6. TAMBAH BAGIAN BARU
    if (action.type === 'ADD_SECTION' && action.payload) {
      const p = action.payload;
      const newSec: SectionItem = {
        id: 'sec-ai-' + Date.now(),
        type: p.type || 'HERO',
        title: p.title || 'Bagian Baru',
        subtitle: p.subtitle || '',
        content: p.content || '',
        waMessage: p.waMessage,
        orderIndex: sections.length + 1
      };
      setSections((prev) => [...prev, newSec]);
      handleHighlightSection(newSec.id);
      return;
    }

    // 7. HAPUS BAGIAN
    if (action.type === 'DELETE_SECTION' && action.payload) {
      const p = action.payload;
      setSections((prev) =>
        prev.filter((s) => (p.id ? s.id !== p.id : p.sectionType ? s.type !== p.sectionType : true))
      );
      return;
    }

    // 8. UPDATE BAGIAN (JUDUL, ISI, NOMOR WA, ALAMAT, JAM BUKA, PESAN WA)
    if (action.type === 'UPDATE_SECTION' && action.payload) {
      const p = action.payload;
      let targetSecId: string | null = null;

      setSections((prev) => {
        let idx = -1;
        if (p.id) {
          idx = prev.findIndex((s) => s.id === p.id);
        }
        if (idx === -1 && p.sectionType) {
          idx = prev.findIndex((s) => s.type === p.sectionType);
        }
        if (idx === -1 && p.type) {
          idx = prev.findIndex((s) => s.type === p.type);
        }
        // Fallback default ke HERO jika tidak spesifik
        if (idx === -1) {
          idx = prev.findIndex((s) => s.type === 'HERO');
        }
        if (idx === -1 && prev.length > 0) {
          idx = 0;
        }

        if (idx === -1) return prev;

        const updated = [...prev];
        const cur = updated[idx];

        let newContent = p.content !== undefined && p.content.trim() ? p.content.trim() : cur.content;

        // Jika ada perubahan phone, address, atau hours untuk CONTACT
        if (cur.type === 'CONTACT' && (p.phone || p.address || p.hours)) {
          let phone = p.phone;
          let address = p.address;
          let hours = p.hours;
          let waMsg = p.waMessage;

          if (!phone) {
            const m = cur.content.match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([^|]+)/i);
            if (m) phone = m[1].trim();
          }
          if (!address) {
            const m = cur.content.match(/(?:Alamat|Lokasi):\s*([^|]+)/i);
            if (m) address = m[1].trim();
          }
          if (!hours) {
            const m = cur.content.match(/(?:Buka|Operasional|Jam):\s*([^|]+)/i);
            if (m) hours = m[1].trim();
          }
          if (!waMsg) {
            const m = cur.content.match(/(?:Pesan(?:\s*WA)?|Template):\s*([^|]+)/i);
            if (m) waMsg = m[1].trim();
          }

          const parts = [];
          if (phone) parts.push(`WhatsApp: ${phone}`);
          if (address) parts.push(`Alamat: ${address}`);
          if (hours) parts.push(`Buka: ${hours}`);
          if (waMsg) parts.push(`Pesan: ${waMsg}`);
          newContent = parts.join(' | ');
        }

        updated[idx] = {
          ...cur,
          title: p.title !== undefined && p.title.trim() ? p.title.trim() : cur.title,
          subtitle: p.subtitle !== undefined && p.subtitle.trim() ? p.subtitle.trim() : cur.subtitle,
          content: newContent,
          waMessage: p.waMessage !== undefined && p.waMessage.trim() ? p.waMessage.trim() : cur.waMessage
        };
        targetSecId = updated[idx].id;
        return updated;
      });

      // Gulirkan otomatis dan sorot bagian kanvas yang baru diperbarui
      if (targetSecId) {
        setTimeout(() => {
          handleHighlightSection(targetSecId!);
        }, 100);
      }
      return;
    }

    // 9. UPDATE TAUTAN NAVIGASI
    if (action.type === 'UPDATE_NAV_LINKS' && action.payload) {
      const newLinks = action.payload.links;
      if (Array.isArray(newLinks)) {
        let navId: string | null = null;
        setSections((prev) =>
          prev.map((s) => {
            if (s.type === 'NAVBAR') {
              navId = s.id;
              return { ...s, content: JSON.stringify(newLinks) };
            }
            return s;
          })
        );
        if (navId) {
          setTimeout(() => {
            handleHighlightSection(navId!);
          }, 100);
        }
      }
      return;
    }
  };

  return (
    <div className="fixed inset-0 h-screen w-screen overflow-hidden flex flex-col bg-slate-100 text-slate-900 font-sans select-none z-0">
      
      {/* 1. TOP STUDIO NAVIGATION BAR (ZERO HORIZONTAL SCROLL, RESPONSIF & TERSTRUKTUR) */}
      <header className="h-[64px] w-full bg-white border-b border-slate-200 px-3 sm:px-4 flex items-center justify-between shrink-0 z-30 shadow-xs gap-2">
        
        {/* KIRI: Brand, Kembali, Palet & Riwayat Kanvas */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href="/"
            className="flex items-center gap-1.5 p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
            title="Kembali ke Beranda"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold hidden 2xl:inline whitespace-nowrap">Kembali</span>
          </Link>

          <div className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center text-white shadow-sm shrink-0">
              <Sparkles className="w-4 h-4 text-blue-400" />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-tight text-slate-900 leading-none hidden sm:inline whitespace-nowrap">
                NexaWeb<span className="text-blue-600">.ai</span>
              </span>
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mt-0.5 hidden 2xl:inline whitespace-nowrap">
                Studio Kanvas
              </span>
            </div>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden sm:block mx-0.5 shrink-0" />

          {/* Toggle Palet Samping */}
          <button
            type="button"
            onClick={() => setIsPaletteOpen(!isPaletteOpen)}
            className={`p-2 2xl:px-2.5 2xl:py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 ${
              isPaletteOpen
                ? 'bg-slate-100 border-slate-300 text-slate-900'
                : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
            title={isPaletteOpen ? 'Sembunyikan Palet Item & Bagian' : 'Tampilkan Palet Item & Bagian'}
          >
            <Layers className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden 2xl:inline whitespace-nowrap">Palet</span>
          </button>

          {/* Tombol Undo & Redo (Maksimal 3x) */}
          <div className="flex items-center gap-0.5 bg-slate-100/90 p-0.5 rounded-xl border border-slate-200/90 shrink-0">
            <button
              type="button"
              onClick={handleUndo}
              disabled={!canUndo}
              className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition flex items-center gap-1"
              title={canUndo ? `Undo / Batalkan Perubahan (Tersisa: ${undoCount}/3x)` : 'Undo tidak tersedia (Maks. 3x)'}
            >
              <Undo2 className="w-3.5 h-3.5" />
              {canUndo && (
                <span className="text-[9px] font-extrabold bg-blue-100 text-blue-700 px-1 py-0.2 rounded leading-none">
                  {undoCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={handleRedo}
              disabled={!canRedo}
              className="p-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-400 transition flex items-center gap-1"
              title={canRedo ? `Redo / Ulangi Perubahan (Tersisa: ${redoCount}/3x)` : 'Redo tidak tersedia (Maks. 3x)'}
            >
              <Redo2 className="w-3.5 h-3.5" />
              {canRedo && (
                <span className="text-[9px] font-extrabold bg-indigo-100 text-indigo-700 px-1 py-0.2 rounded leading-none">
                  {redoCount}
                </span>
              )}
            </button>
          </div>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={() => {
              if (confirm('Apakah Anda yakin ingin mereset susunan toko kembali ke contoh awal?')) {
                setSections(INITIAL_SECTIONS);
                setProducts(INITIAL_PRODUCTS);
                setPaletteItems(INITIAL_PALETTE_ITEMS);
                setActiveTheme(DEFAULT_THEMES[0]);
                setActiveDesign(DEFAULT_TEMPLATES[0]);
              }
            }}
            title="Reset ke Toko Default Awal"
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition shrink-0"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* TENGAH: ALAT DESAIN, KONTEN & PREVIEW (TERKELOMPOK RAPI TANPA SCROLL) */}
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          
          {/* GRUP DESAIN TOKO (Gaya Desain & Warna Font dalam 1 Kapsul Jelas) */}
          <div className="flex items-center gap-1 p-1 bg-indigo-50/70 rounded-xl border border-indigo-200/70 shrink-0">
            <button
              type="button"
              onClick={() => setIsDesignModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 transition flex items-center gap-1.5 shadow-2xs"
              title="Gaya Desain Website (★ Rekomendasi Utama)"
            >
              <Layout className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="hidden lg:inline xl:hidden whitespace-nowrap">Desain</span>
              <span className="hidden xl:inline whitespace-nowrap">Gaya Desain</span>
              <span className="text-amber-500 text-[10px] leading-none" title="Rekomendasi">★</span>
            </button>

            <button
              type="button"
              onClick={() => setIsThemeModalOpen(true)}
              className="px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white hover:bg-slate-50 text-slate-800 border border-slate-200/90 transition flex items-center gap-1.5 shadow-2xs"
              title="Ubah Palet Warna & Jenis Font Toko"
            >
              <Palette className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
              <span className="hidden lg:inline xl:hidden whitespace-nowrap">Warna</span>
              <span className="hidden xl:inline whitespace-nowrap">Warna & Font</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden lg:block shrink-0" />

          {/* GRUP KONTEN & BAGIAN WEBSITE */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={() => setIsAddSectionOpen(true)}
              className="px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-extrabold bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition flex items-center gap-1.5"
              title="Tambah Bagian Baru ke Kanvas Website"
            >
              <Plus className="w-3.5 h-3.5 text-blue-400 shrink-0" />
              <span className="hidden lg:inline 2xl:hidden whitespace-nowrap">Bagian</span>
              <span className="hidden 2xl:inline whitespace-nowrap">Tambah Bagian</span>
            </button>

            <button
              type="button"
              onClick={() => setIsManageMenuOpen(true)}
              className="px-2.5 py-1.5 rounded-xl text-xs font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition flex items-center gap-1.5 shadow-2xs"
              title="Kelola Daftar Menu & Produk Jualan"
            >
              <UtensilsCrossed className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span className="hidden lg:inline 2xl:hidden whitespace-nowrap">Menu</span>
              <span className="hidden 2xl:inline whitespace-nowrap">Kelola Menu</span>
            </button>
          </div>

          <div className="h-5 w-px bg-slate-200 hidden lg:block shrink-0" />

          {/* PREVIEW FULLSCREEN TOGGLE */}
          <button
            type="button"
            onClick={() => setIsEditorMode(!isEditorMode)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 ${
              !isEditorMode
                ? 'bg-blue-600 border-blue-600 text-white shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={isEditorMode ? 'Lihat Tampilan Penuh Toko (Mode Publik)' : 'Kembali ke Mode Edit'}
          >
            {!isEditorMode ? <EyeOff className="w-3.5 h-3.5 shrink-0" /> : <Eye className="w-3.5 h-3.5 text-blue-600 shrink-0" />}
            <span className="hidden lg:inline whitespace-nowrap">{isEditorMode ? 'Preview' : 'Mode Edit'}</span>
          </button>

        </div>

        {/* PALING POJOK KANAN: API KEY, DEPLOY, & CHAT AI */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Tombol API Key */}
          <button
            type="button"
            onClick={() => setIsApiKeyModalOpen(true)}
            className={`p-2 rounded-xl border transition flex items-center gap-1 shrink-0 ${
              hasApiKey
                ? 'text-emerald-700 bg-emerald-50 border-emerald-200 hover:bg-emerald-100'
                : 'text-slate-500 bg-white border-slate-200 hover:bg-slate-50'
            }`}
            title={hasApiKey ? 'Google AI Studio API Key Terhubung' : 'Pasang Google AI Studio API Key'}
          >
            <KeyRound className="w-3.5 h-3.5" />
            {hasApiKey && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden sm:inline-block" />}
          </button>

          {/* Tombol Deploy (Unduh ZIP Website) */}
          <button
            type="button"
            onClick={handleDeployWebsite}
            disabled={isExporting}
            className="px-3 sm:px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white shadow-md hover:shadow-lg transition flex items-center gap-1.5 active:scale-95 disabled:opacity-50 shrink-0"
            title="Deploy Website: Unduh file ZIP lengkap (index.html & style.css) siap pakai"
          >
            {isExporting ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden sm:inline whitespace-nowrap">Menyiapkan...</span>
              </>
            ) : (
              <>
                <Rocket className="w-3.5 h-3.5 text-blue-200 shrink-0" />
                <span className="hidden sm:inline whitespace-nowrap">Deploy</span>
              </>
            )}
          </button>

          {/* Tombol Buka / Tutup Chat AI */}
          <button
            type="button"
            onClick={() => setIsAiChatOpen(!isAiChatOpen)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 shrink-0 ${
              isAiChatOpen
                ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
            title={isAiChatOpen ? 'Tutup Panel Asisten AI' : 'Buka Panel Asisten AI'}
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="hidden sm:inline whitespace-nowrap">{isAiChatOpen ? 'Tutup AI' : 'Chat AI'}</span>
          </button>
        </div>

      </header>

      {/* 2. BODY BUILDER 3-PANEL (SIDEBAR KIRI, CENTER KANVAS, SIDEBAR KANAN) */}
      <div className="flex-1 w-full flex overflow-hidden relative">
        
        {/* PANEL KIRI: PALET ITEM & BAGIAN */}
        {isPaletteOpen && isEditorMode && (
          <aside className="w-72 sm:w-80 h-full bg-white border-r border-slate-200 flex flex-col shrink-0 z-20 shadow-md overflow-hidden">
            
            {/* Header Tab Palet */}
            <div className="p-3 border-b border-slate-100 bg-slate-50/70">
              <div className="flex items-center gap-1 p-1 bg-slate-200/70 rounded-xl">
                <button
                  type="button"
                  onClick={() => setSidebarTab('items')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    sidebarTab === 'items'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Item Menu ({paletteItems.length})
                </button>
                <button
                  type="button"
                  onClick={() => setSidebarTab('sections')}
                  className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition ${
                    sidebarTab === 'sections'
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Bagian Web ({sections.length})
                </button>
              </div>
            </div>

            {/* Konten Tab 1: Item Produk */}
            {sidebarTab === 'items' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                
                {/* Form Buat Item Sendiri */}
                <form
                  onSubmit={handleSaveItemToPalette}
                  className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 shadow-sm"
                >
                  <span className="text-[11px] font-black uppercase text-slate-800 tracking-wider flex items-center gap-1">
                    <Plus className="w-3.5 h-3.5 text-blue-600" /> Buat Item Sendiri:
                  </span>
                  <div>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      placeholder="Nama menu (misal: Sate Padang)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      placeholder="Harga (misal: 25000)"
                      className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-900"
                      required
                    />
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-300 bg-white"
                    >
                      <option value="Makanan Utama">Makanan Utama</option>
                      <option value="Minuman">Minuman</option>
                      <option value="Camilan">Camilan</option>
                      <option value="Paket Spesial">Paket Spesial</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow transition"
                  >
                    + Simpan & Masukkan Kanvas
                  </button>
                </form>

                {/* Daftar Item Siap Di-Drag */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-700 px-1">
                    <span>Item Siap Di-Drag:</span>
                    <span className="text-[10px] text-blue-600 font-semibold">Tarik ke kanvas</span>
                  </div>

                  <div className="space-y-2">
                    {paletteItems.map((item) => (
                      <div
                        key={item.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, item)}
                        className="p-3 rounded-xl border border-slate-200 bg-white hover:border-blue-400 hover:shadow-md transition cursor-grab active:cursor-grabbing flex items-center justify-between group"
                      >
                        <div className="flex items-center gap-2">
                          <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-blue-500" />
                          <div>
                            <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-50 text-blue-700">
                              {item.category}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 mt-0.5 line-clamp-1">
                              {item.name}
                            </h5>
                            <span className="text-xs font-extrabold text-emerald-700 block mt-0.5">
                              Rp {item.price.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => addProductToCanvas(item)}
                          className="px-2 py-1 rounded-lg bg-slate-100 group-hover:bg-blue-600 group-hover:text-white text-slate-600 text-[10px] font-bold transition shrink-0"
                          title="Langsung masukkan ke kanvas"
                        >
                          + Taruh
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {/* Konten Tab 2: Bagian Web (Preset & Bagian Aktif di Kanvas) */}
            {sidebarTab === 'sections' && (
              <div className="flex-1 overflow-y-auto p-3 space-y-4">
                
                {/* Presets Cepat Tambah (Bisa Diklik atau Di-Drag ke Kanvas) */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      + Preset Bagian:
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold">
                      Klik / Tarik ke kanvas
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-1.5">
                    {[
                      { type: 'HERO', label: '+ Hero Baru' },
                      { type: 'ABOUT', label: '+ Tentang Usaha' },
                      { type: 'CATALOG', label: '+ Katalog Menu' },
                      { type: 'CONTACT', label: '+ Kontak WhatsApp' },
                      { type: 'NAVBAR', label: '+ Navigasi' },
                      { type: 'FOOTER', label: '+ Footer' }
                    ].map((p) => (
                      <button
                        key={p.type}
                        type="button"
                        draggable
                        onDragStart={(e) => {
                          e.dataTransfer.setData('application/nexaweb-preset', p.type);
                          setDraggedPresetType(p.type as SectionType);
                        }}
                        onDragEnd={handleSectionDragEnd}
                        onClick={() => handleAddPresetSection(p.type as SectionType)}
                        className="p-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-900 hover:text-white text-slate-700 text-xs font-bold transition text-left flex items-center justify-between cursor-grab active:cursor-grabbing group shadow-2xs"
                        title="Klik untuk tambah, atau Tarik (Drag & Drop) langsung ke kanvas"
                      >
                        <span>{p.label}</span>
                        <GripVertical className="w-3 h-3 opacity-40 group-hover:opacity-100" />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daftar Bagian Aktif di Kanvas (Bisa Di-Drag untuk Atur Urutan) */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <div className="flex items-center justify-between px-1">
                    <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider block">
                      Bagian Aktif ({sections.length}):
                    </span>
                    <span className="text-[10px] text-blue-600 font-semibold flex items-center gap-1">
                      <GripVertical className="w-3 h-3" /> Tarik untuk urutkan
                    </span>
                  </div>

                  <div className="space-y-2">
                    {sections.map((sec, idx) => {
                      const isDragging = draggedSectionIndex === idx;
                      const isDragOver = dragOverSectionIndex === idx && draggedSectionIndex !== idx;

                      return (
                        <div
                          key={sec.id}
                          draggable
                          onDragStart={(e) => handleSectionDragStart(e, idx)}
                          onDragOver={(e) => handleSectionDragOver(e, idx)}
                          onDragLeave={(e) => handleSectionDragLeave(e, idx)}
                          onDrop={(e) => handleSectionDrop(e, idx)}
                          onDragEnd={handleSectionDragEnd}
                          className={`p-3 rounded-2xl border transition-all cursor-grab active:cursor-grabbing select-none relative ${
                            isDragging
                              ? 'opacity-40 border-2 border-dashed border-blue-500 scale-95 bg-blue-50/50'
                              : isDragOver
                              ? 'border-2 border-blue-600 bg-blue-50/90 shadow-md ring-2 ring-blue-400'
                              : highlightedSectionId === sec.id
                              ? 'border-blue-600 bg-blue-50/70 shadow-md ring-2 ring-blue-400'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:shadow-2xs'
                          }`}
                        >
                          {isDragOver && (
                            <div className="absolute inset-x-0 -top-1.5 h-1 bg-blue-600 rounded-full z-10 shadow" />
                          )}

                          <div className="flex items-center justify-between mb-1.5">
                            <div className="flex items-center gap-1.5">
                              <div className="p-1 rounded bg-slate-100 text-slate-400 group-hover:text-blue-600">
                                <GripVertical className="w-3.5 h-3.5" />
                              </div>
                              <span className="text-xs font-black text-slate-900">
                                {getSectionUniformLabel(sec)}
                              </span>
                            </div>
                            
                            {/* Reorder Buttons */}
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveSection(idx, 'up');
                                }}
                                disabled={idx === 0}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                title="Pindah ke Atas"
                              >
                                <ChevronUp className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMoveSection(idx, 'down');
                                }}
                                disabled={idx === sections.length - 1}
                                className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                                title="Pindah ke Bawah"
                              >
                                <ChevronDown className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          <p className="text-[11px] text-slate-500 line-clamp-1 mb-2 pl-6">
                            {sec.title || 'Tanpa Judul'}
                          </p>

                          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-[11px] pl-6">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleHighlightSection(sec.id);
                              }}
                              className="font-bold text-blue-600 hover:underline"
                            >
                              Sorot
                            </button>

                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setEditingSection(sec);
                                }}
                                className="text-slate-600 hover:text-slate-900 font-bold"
                              >
                                Edit
                              </button>
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteSection(sec.id);
                                }}
                                className="text-rose-600 hover:text-rose-800 font-bold"
                              >
                                Hapus
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>
            )}

          </aside>
        )}

        {/* CENTER: DESK KANVAS WEBSITE PREVIEW (HANYA AREA INI YANG DI-SCROLL KE BAWAH) */}
        <main
          id="mainCanvasArea"
          className="flex-1 min-h-0 h-full overflow-y-auto bg-slate-100/90 relative"
          style={{ overflowY: 'scroll', WebkitOverflowScrolling: 'touch' }}
        >
          <div className="max-w-4xl mx-auto p-4 sm:p-8 pb-48 w-full flex flex-col items-center">
            
            {/* Header Status Bar Kanvas */}
            <div className="w-full bg-white rounded-2xl p-3 px-5 mb-5 border border-slate-200 shadow-sm flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
              <div className="flex items-center gap-2 font-semibold">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span>Status: <strong>Kanvas Siap Digunakan</strong></span>
                <span className="text-slate-300">|</span>
                <span>Total Bagian: <strong>{sections.length}</strong></span>
                <span className="text-slate-300">|</span>
                <span>Total Menu: <strong>{products.length}</strong></span>
              </div>

              <div className="flex items-center gap-2.5">
                {sections.length < 5 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSections(INITIAL_SECTIONS);
                      setProducts(INITIAL_PRODUCTS);
                    }}
                    className="text-[11px] font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-lg border border-blue-200 transition flex items-center gap-1 shadow-2xs"
                    title="Klik untuk memulihkan seluruh susunan bagian website (Navbar, Hero, About, Katalog Menu, Kontak WhatsApp, Footer)"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Pulihkan Lengkap (6 Bagian)</span>
                  </button>
                )}
                <span className="text-[11px] text-slate-400 font-medium hidden sm:inline">
                  ↕ Scroll ke bawah untuk melihat seluruh website
                </span>
              </div>
            </div>

            {/* Banner Sukses Mode Template Wizard (PRD Step 3) */}
            {wizardInfo && (
              <div className="w-full bg-blue-50/90 border border-blue-200/90 rounded-2xl p-3 sm:p-4 mb-4 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs shrink-0">
                    <Sparkles className="w-4 h-4 text-blue-200" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-blue-900">
                        Mode Template Aktif: {wizardInfo.businessType}
                      </span>
                      <span className="text-[10px] font-extrabold bg-blue-600 text-white px-2 py-0.2 rounded-full">
                        Siap Pakai
                      </span>
                    </div>
                    <p className="text-[11px] text-blue-700 mt-0.5">
                      Website toko Anda telah berhasil dirakit otomatis sesuai pilihan jenis usaha & fitur yang Anda centang.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setWizardInfo(null)}
                  className="text-xs font-bold text-blue-600 hover:text-blue-900 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition shrink-0"
                >
                  Tutup
                </button>
              </div>
            )}

            {/* KERTAS KANVAS (CANVAS PAPER) - SELURUH BAGIAN DARI NAV SAMPAI FOOTER TAMPIL UTUH */}
            <div
              id="canvasPaper"
              className="w-full bg-white rounded-3xl shadow-2xl border border-slate-200/90 transition-all duration-300 relative divide-y divide-slate-100 overflow-hidden"
              style={{
                backgroundColor: activeTheme.backgroundColor,
                fontFamily: `'${activeTheme.bodyFont}', sans-serif`,
                color: activeTheme.textColor
              }}
            >
            {sections.map((section, sIdx) => {
              const isHighlight = highlightedSectionId === section.id;
              const isDraggingThis = isEditorMode && draggedSectionIndex === sIdx;
              const isDragOverThis = isEditorMode && dragOverSectionIndex === sIdx && draggedSectionIndex !== sIdx;

              return (
                <div
                  key={section.id}
                  id={`section-${section.id}`}
                  onDragOver={(e) => isEditorMode && handleSectionDragOver(e, sIdx)}
                  onDragLeave={(e) => isEditorMode && handleSectionDragLeave(e, sIdx)}
                  onDrop={(e) => isEditorMode && handleSectionDrop(e, sIdx)}
                  className={`relative group transition-all duration-200 ${
                    isHighlight ? 'ring-4 ring-blue-500 shadow-xl' : ''
                  } ${
                    isDragOverThis ? 'ring-4 ring-blue-500 bg-blue-50/20 shadow-md' : ''
                  } ${
                    isDraggingThis ? 'opacity-40 border-2 border-dashed border-blue-400 bg-blue-50/30' : ''
                  }`}
                >
                  {/* Indikator Garis Target Drop Saat Drag & Drop */}
                  {isDragOverThis && (
                    <div className="absolute inset-x-0 -top-1.5 h-2 bg-blue-600 rounded-full z-30 shadow-lg animate-pulse" />
                  )}

                  {/* Indikator Garis Dot Border Saat Hover (Khusus Mode Editor) */}
                  {isEditorMode && (
                    <div
                      className={`absolute inset-0 border-2 border-dotted pointer-events-none z-10 transition-colors duration-150 ${
                        isHighlight
                          ? 'border-blue-600 bg-blue-500/[0.03]'
                          : 'border-transparent group-hover:border-blue-500 group-hover:bg-blue-500/[0.015]'
                      }`}
                    />
                  )}

                  {/* Handle Drag & Drop di Pojok Kiri Atas Bagian (Khusus Mode Editor - Muncul Saat Hover) */}
                  {isEditorMode && (
                    <div
                      draggable
                      onDragStart={(e) => handleSectionDragStart(e, sIdx)}
                      onDragEnd={handleSectionDragEnd}
                      className="absolute top-3 left-3 z-20 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 hover:bg-blue-600 text-white px-2.5 py-1.5 rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-sm select-none border border-white/10 pointer-events-none group-hover:pointer-events-auto"
                      title="Tahan & Tarik (Drag & Drop) untuk memindahkan urutan bagian ini"
                    >
                      <GripVertical className="w-3.5 h-3.5 text-blue-300" />
                      <span className="text-[10px] font-black uppercase tracking-wider">
                        {getSectionUniformLabel(section)}
                      </span>
                      <span className="text-[9px] text-blue-200 border-l border-white/20 pl-1.5 hidden sm:inline">
                        Tarik Bagian
                      </span>
                    </div>
                  )}

                  {/* Overlay Kontrol Bagian (Khusus Mode Editor - Muncul Saat Hover) */}
                  {isEditorMode && (
                    <div className="absolute top-3 right-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-slate-900/90 text-white p-1.5 rounded-xl shadow-lg flex items-center gap-1.5 backdrop-blur-sm pointer-events-none group-hover:pointer-events-auto">
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIdx, 'up')}
                        disabled={sIdx === 0}
                        className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white disabled:opacity-20 transition"
                        title="Pindah ke Atas"
                      >
                        <ChevronUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveSection(sIdx, 'down')}
                        disabled={sIdx === sections.length - 1}
                        className="p-1 hover:bg-slate-700 rounded text-slate-300 hover:text-white disabled:opacity-20 transition"
                        title="Pindah ke Bawah"
                      >
                        <ChevronDown className="w-3.5 h-3.5" />
                      </button>
                      <div className="h-3 w-px bg-white/20 mx-0.5" />
                      <button
                        type="button"
                        onClick={() => setEditingSection(section)}
                        className="p-1 hover:bg-slate-700 rounded text-slate-200 hover:text-white transition"
                        title="Edit Bagian Ini"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(section.id)}
                        className="p-1 hover:bg-rose-900 rounded text-rose-300 hover:text-rose-100 transition"
                        title="Hapus Bagian Ini"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {/* 1. SECTION: NAVBAR */}
                  {section.type === 'NAVBAR' && (
                    <nav className="py-4 px-6 sm:px-10 border-b border-slate-200/60 flex items-center justify-between">
                      <div>
                        <h2 className="font-black text-lg sm:text-xl tracking-tight" style={{ color: activeTheme.headingColor }}>
                          {section.title || 'Nama Toko'}
                        </h2>
                        {section.subtitle && (
                          <p className="text-xs opacity-75">{section.subtitle}</p>
                        )}
                      </div>

                      {/* Dynamic Links */}
                      <div className="flex items-center gap-4 sm:gap-6">
                        {(() => {
                          try {
                            const links: NavLinkItem[] = JSON.parse(section.content);
                            if (Array.isArray(links)) {
                              return links.map((l, i) => (
                                <a
                                  key={i}
                                  href={l.target}
                                  onClick={(e) => {
                                    e.preventDefault();
                                    const clean = (l.target || '').replace(/^#/, '');
                                    const el =
                                      document.getElementById(clean) ||
                                      document.getElementById(`section-${clean}`) ||
                                      (clean === 'hero' ? document.getElementById(`section-${sections.find((s) => s.type === 'HERO')?.id}`) : null) ||
                                      (clean === 'about' ? document.getElementById(`section-${sections.find((s) => s.type === 'ABOUT')?.id}`) : null) ||
                                      (clean === 'catalog' ? document.getElementById(`section-${sections.find((s) => s.type === 'CATALOG')?.id}`) : null) ||
                                      (clean === 'contact' ? document.getElementById(`section-${sections.find((s) => s.type === 'CONTACT')?.id}`) : null);
                                    if (el) {
                                      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
                                    }
                                  }}
                                  className="text-xs font-bold hover:opacity-80 transition cursor-pointer"
                                  style={{ color: activeTheme.primaryColor }}
                                >
                                  {l.label}
                                </a>
                              ));
                            }
                          } catch {}
                          return (
                            <span className="text-xs opacity-60">Menu Navigasi</span>
                          );
                        })()}
                      </div>
                    </nav>
                  )}

                  {/* 2. SECTION: HERO (BERBAGAI VARIAN LAYOUT GAYA DESAIN) */}
                  {section.type === 'HERO' && (
                    <>
                      {activeDesign?.styleConfig?.heroVariant === 'split-classic' ? (
                        <div className="py-14 sm:py-20 px-6 sm:px-12">
                          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                            <div className="md:col-span-7 space-y-4 text-left">
                              <span
                                className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border inline-block"
                                style={{
                                  color: activeTheme.primaryColor,
                                  borderColor: `${activeTheme.primaryColor}40`,
                                  backgroundColor: `${activeTheme.primaryColor}15`
                                }}
                              >
                                ☕ {activeTheme.accentBadge}
                              </span>
                              <h2
                                className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                                style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                              >
                                {section.title}
                              </h2>
                              <p className="text-sm sm:text-base leading-relaxed opacity-90">
                                {section.subtitle}
                              </p>
                              <div className="pt-2 flex flex-wrap gap-3">
                                <a
                                  href="#section-catalog"
                                  className="px-6 py-3 rounded-xl font-bold text-sm text-white shadow-md hover:opacity-90 transition"
                                  style={{ backgroundColor: activeTheme.primaryColor }}
                                >
                                  Lihat Racikan Menu
                                </a>
                                <a
                                  href="#section-contact"
                                  className="px-6 py-3 rounded-xl font-bold text-sm border hover:bg-black/5 transition"
                                  style={{ borderColor: activeTheme.primaryColor, color: activeTheme.primaryColor }}
                                >
                                  Reservasi & Kontak
                                </a>
                              </div>
                            </div>
                            <div
                              className="md:col-span-5 rounded-3xl p-6 border-2 border-dashed text-center space-y-3 shadow-sm"
                              style={{
                                backgroundColor: activeTheme.cardBackground || '#fffbeb',
                                borderColor: `${activeTheme.primaryColor}40`
                              }}
                            >
                              <div
                                className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
                                style={{ backgroundColor: activeTheme.primaryColor }}
                              >
                                <Coffee className="w-7 h-7" />
                              </div>
                              <h4 className="font-bold text-base" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}>
                                Seduh Hangat Setiap Hari
                              </h4>
                              <p className="text-xs leading-relaxed opacity-80">
                                Kopi pilihan dan seduhan racikan istimewa untuk menemani hari santai Anda.
                              </p>
                              <div className="pt-2">
                                <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-200">
                                  Buka: 09.00 - 22.00 WIB
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : activeDesign?.styleConfig?.heroVariant === 'bold-impact' ? (
                        <div className="py-16 sm:py-20 px-6 sm:px-12 text-center bg-gradient-to-b from-red-500/10 to-transparent">
                          <div className="max-w-2xl mx-auto space-y-4">
                            <span className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full bg-red-600 text-white inline-flex items-center gap-1 shadow-sm">
                              <Flame className="w-3.5 h-3.5 fill-white" /> {activeTheme.accentBadge || 'SPESIAL PEDAS GURIH TERLARIS'}
                            </span>
                            <h2
                              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-red-950"
                              style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', sans-serif` }}
                            >
                              {section.title}
                            </h2>
                            <p className="text-sm sm:text-base leading-relaxed text-red-900/80 font-medium max-w-xl mx-auto">
                              {section.subtitle}
                            </p>
                            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                              <a
                                href="#section-catalog"
                                className="px-8 py-3.5 rounded-xl font-black text-sm text-white shadow-xl bg-red-600 hover:bg-red-700 transition transform hover:scale-105"
                              >
                                PESAN SEKARANG (PROMO CEPAT)
                              </a>
                              <a
                                href="#section-contact"
                                className="px-6 py-3.5 rounded-xl font-bold text-sm bg-white border border-red-300 text-red-700 hover:bg-red-50 transition"
                              >
                                WhatsApp Kasir
                              </a>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-16 sm:py-24 px-6 sm:px-12 text-center relative overflow-hidden">
                          <div className="max-w-2xl mx-auto space-y-4">
                            <span
                              className="text-xs font-black uppercase tracking-widest px-3 py-1 rounded-full border"
                              style={{
                                color: activeTheme.primaryColor,
                                borderColor: `${activeTheme.primaryColor}40`,
                                backgroundColor: `${activeTheme.primaryColor}15`
                              }}
                            >
                              {activeTheme.accentBadge}
                            </span>

                            <h2
                              className="text-3xl sm:text-5xl font-black tracking-tight leading-tight"
                              style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                            >
                              {section.title}
                            </h2>

                            <p className="text-sm sm:text-base leading-relaxed opacity-90 max-w-xl mx-auto">
                              {section.subtitle}
                            </p>

                            <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                              <a
                                href="#section-catalog"
                                className="px-7 py-3 rounded-xl font-black text-sm text-white shadow-lg hover:opacity-90 transition transform hover:scale-105"
                                style={{ backgroundColor: activeTheme.primaryColor }}
                              >
                                Lihat Menu Pilihan
                              </a>
                              <a
                                href="#section-contact"
                                className="px-6 py-3 rounded-xl font-bold text-sm border hover:bg-black/5 transition"
                                style={{ borderColor: activeTheme.primaryColor, color: activeTheme.primaryColor }}
                              >
                                Hubungi Pemesanan
                              </a>
                            </div>
                          </div>
                        </div>
                      )}
                    </>
                  )}

                  {/* 3. SECTION: ABOUT */}
                  {section.type === 'ABOUT' && (
                    <div className="py-14 px-6 sm:px-12 border-t border-slate-200/40">
                      <div className="max-w-3xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                        <div
                          className="md:col-span-5 rounded-3xl p-6 border text-center space-y-3 shadow-sm"
                          style={{
                            backgroundColor: activeTheme.cardBackground,
                            borderColor: `${activeTheme.primaryColor}30`
                          }}
                        >
                          <div
                            className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center text-white shadow-md"
                            style={{ backgroundColor: activeTheme.primaryColor }}
                          >
                            <HeartHandshake className="w-7 h-7" />
                          </div>
                          <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor }}>
                            Resep Khas & Higienis
                          </h4>
                          <p className="text-xs leading-relaxed opacity-85">
                            Diolah setiap hari dengan bahan pilihan segar dan rempah alami tanpa bahan pengawet.
                          </p>
                        </div>

                        <div className="md:col-span-7 space-y-3">
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.primaryColor }}>
                            Cerita Kami
                          </span>
                          <h3
                            className="text-2xl sm:text-3xl font-black"
                            style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                          >
                            {section.title}
                          </h3>
                          <h4 className="text-xs sm:text-sm font-semibold opacity-90">
                            {section.subtitle}
                          </h4>
                          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-line opacity-85">
                            {section.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* 4. SECTION: CATALOG (SESUAI VARIAN KARTU GAYA DESAIN) */}
                  {section.type === 'CATALOG' && (
                    <div id="section-catalog" className="py-16 px-6 sm:px-12 border-t border-slate-200/40">
                      <div className="max-w-3xl mx-auto space-y-6">
                        
                        <div className="text-center space-y-2">
                          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.secondaryColor }}>
                            {activeDesign?.styleConfig?.accentLabel || 'Pilihan Menu Favorit'}
                          </span>
                          <h3
                            className="text-2xl sm:text-3xl font-black"
                            style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                          >
                            {section.title}
                          </h3>
                          <p className="text-xs sm:text-sm opacity-85 max-w-lg mx-auto">
                            {section.subtitle}
                          </p>
                        </div>

                        {/* Interactive Drop Target */}
                        {isEditorMode && (
                          <div
                            onDragOver={(e) => e.preventDefault()}
                            onDrop={handleDropOnCatalog}
                            onClick={() => setIsManageMenuOpen(true)}
                            className="p-5 rounded-2xl border-2 border-dashed border-slate-300 hover:border-blue-500 bg-slate-50/50 hover:bg-blue-50/30 text-center cursor-pointer transition space-y-1"
                          >
                            <div className="flex items-center justify-center gap-2 font-bold text-xs" style={{ color: activeTheme.primaryColor }}>
                              <Sparkles className="w-4 h-4" />
                              <span>TARIK (DRAG) ITEM DARI PALET SAMPING & LEPASKAN DI SINI</span>
                            </div>
                            <p className="text-[11px] opacity-70">
                              Atau klik area ini untuk mengetik menu baru secara langsung
                            </p>
                          </div>
                        )}

                        {/* Products Grid Sesuai Card Variant Gaya Desain */}
                        {products.length === 0 ? (
                          <div className="p-8 text-center rounded-2xl border border-dashed border-slate-300 space-y-2">
                            <PackageOpen className="w-8 h-8 mx-auto text-slate-400" />
                            <p className="text-xs font-bold">Belum ada item di katalog.</p>
                            <p className="text-[11px] opacity-75">Tarik item dari palet samping untuk mengisi kanvas.</p>
                          </div>
                        ) : (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {products.map((p) => {
                              const cardVariant = activeDesign?.styleConfig?.cardVariant || 'modern-rounded';

                              if (cardVariant === 'cafe-handcrafted') {
                                return (
                                  <div
                                    key={p.id}
                                    className="p-4 rounded-2xl border-2 border-dashed shadow-sm hover:shadow-md transition flex flex-col justify-between group/card"
                                    style={{
                                      backgroundColor: activeTheme.cardBackground || '#fffbeb',
                                      borderColor: `${activeTheme.primaryColor}50`
                                    }}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span
                                          className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border border-dashed"
                                          style={{
                                            color: activeTheme.primaryColor,
                                            backgroundColor: `${activeTheme.primaryColor}15`,
                                            borderColor: `${activeTheme.primaryColor}60`
                                          }}
                                        >
                                          ☕ {p.category || 'Racikan Kedai'}
                                        </span>
                                        {isEditorMode && (
                                          <button
                                            type="button"
                                            onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                            title="Hapus Menu Ini"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                      <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', Georgia, serif` }}>
                                        {p.name}
                                      </h4>
                                    </div>
                                    <div className="mt-3 pt-2.5 border-t border-amber-900/10 flex items-center justify-between">
                                      <div className="font-extrabold text-base" style={{ color: activeTheme.primaryColor }}>
                                        Rp {p.price.toLocaleString('id-ID')}
                                      </div>
                                      <span className="text-[11px] opacity-80 px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-medium">
                                        Khas Kedai
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              if (cardVariant === 'bold-compact') {
                                return (
                                  <div
                                    key={p.id}
                                    className="p-4 rounded-xl border-2 shadow-md hover:shadow-lg transition flex flex-col justify-between group/card"
                                    style={{
                                      backgroundColor: activeTheme.cardBackground || '#ffffff',
                                      borderColor: '#ef444450'
                                    }}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-red-600 text-white flex items-center gap-1">
                                          <Flame className="w-3 h-3 fill-white text-white" /> TERLARIS
                                        </span>
                                        {isEditorMode && (
                                          <button
                                            type="button"
                                            onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                            title="Hapus Menu Ini"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                      <h4 className="font-black text-sm" style={{ color: activeTheme.headingColor }}>
                                        {p.name}
                                      </h4>
                                    </div>
                                    <div className="mt-3 pt-2 border-t border-red-100 flex items-center justify-between">
                                      <div className="font-black text-base text-red-700">
                                        Rp {p.price.toLocaleString('id-ID')}
                                      </div>
                                      <span className="text-[10px] font-black text-white px-2 py-0.5 rounded bg-amber-500 shadow-sm">
                                        Siap Saji
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              if (cardVariant === 'corporate-clean') {
                                return (
                                  <div
                                    key={p.id}
                                    className="p-4 rounded-xl border shadow-sm hover:shadow-md transition flex flex-col justify-between group/card"
                                    style={{
                                      backgroundColor: activeTheme.cardBackground || '#ffffff',
                                      borderColor: '#93c5fd'
                                    }}
                                  >
                                    <div>
                                      <div className="flex items-center justify-between mb-1.5">
                                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                                          {p.category || 'Paket Katering'}
                                        </span>
                                        {isEditorMode && (
                                          <button
                                            type="button"
                                            onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                            className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                            title="Hapus Menu Ini"
                                          >
                                            <Trash2 className="w-3.5 h-3.5" />
                                          </button>
                                        )}
                                      </div>
                                      <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', Inter, sans-serif` }}>
                                        {p.name}
                                      </h4>
                                    </div>
                                    <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between">
                                      <div className="font-extrabold text-base text-blue-800">
                                        Rp {p.price.toLocaleString('id-ID')} <span className="text-[10px] font-normal text-slate-500">/ porsi</span>
                                      </div>
                                      <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                                        Min. 10 Box
                                      </span>
                                    </div>
                                  </div>
                                );
                              }

                              // Default modern-rounded
                              return (
                                <div
                                  key={p.id}
                                  className="p-4 rounded-2xl border shadow-sm hover:shadow-md transition flex flex-col justify-between group/card"
                                  style={{
                                    backgroundColor: activeTheme.cardBackground,
                                    borderColor: `${activeTheme.primaryColor}25`
                                  }}
                                >
                                  <div>
                                    <div className="flex items-center justify-between mb-1.5">
                                      <span
                                        className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border"
                                        style={{
                                          color: activeTheme.primaryColor,
                                          backgroundColor: `${activeTheme.primaryColor}15`,
                                          borderColor: `${activeTheme.primaryColor}30`
                                        }}
                                      >
                                        {p.category || 'Menu'}
                                      </span>

                                      {isEditorMode && (
                                        <button
                                          type="button"
                                          onClick={() => setProducts(products.filter((item) => item.id !== p.id))}
                                          className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50 transition"
                                          title="Hapus Menu Ini"
                                        >
                                          <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                      )}
                                    </div>

                                    <h4 className="font-bold text-sm" style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}>
                                      {p.name}
                                    </h4>
                                  </div>

                                  <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                                    <div className="font-extrabold text-base" style={{ color: activeTheme.primaryColor }}>
                                      Rp {p.price.toLocaleString('id-ID')}
                                    </div>
                                    <span className="text-[10px] font-semibold opacity-75 px-1.5 py-0.5 rounded bg-black/5">
                                      Tersedia
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        )}

                      </div>
                    </div>
                  )}

                  {/* 5. SECTION: CONTACT (DENGAN WHATSAPP KUSTOM & PREVIEW PESAN) */}
                  {section.type === 'CONTACT' && (
                    <div id="section-contact" className="py-16 px-6 sm:px-12 border-t border-slate-200/40 text-center">
                      <div className="max-w-2xl mx-auto space-y-6">
                        <span className="text-xs font-bold uppercase tracking-wider" style={{ color: activeTheme.primaryColor }}>
                          Layanan Pelanggan
                        </span>
                        
                        <h3
                          className="text-2xl sm:text-3xl font-black"
                          style={{ color: activeTheme.headingColor, fontFamily: `'${activeTheme.headingFont}', serif` }}
                        >
                          {section.title}
                        </h3>

                        <p className="text-xs sm:text-sm opacity-85">
                          {section.subtitle}
                        </p>

                        {/* Kartu Alamat & Kontak Bersih */}
                        <div
                          className="rounded-2xl p-5 text-xs sm:text-sm leading-relaxed shadow-sm border space-y-2 text-left sm:text-center"
                          style={{
                            backgroundColor: activeTheme.cardBackground,
                            borderColor: `${activeTheme.primaryColor}30`
                          }}
                        >
                          <div className="flex items-center justify-center gap-2 font-bold" style={{ color: activeTheme.primaryColor }}>
                            <MapPin className="w-4 h-4" />
                            <span>Informasi Alamat & Jadwal:</span>
                          </div>
                          <p className="whitespace-pre-line font-medium opacity-90">
                            {(section.content || '').replace(/Pesan:[^|]+/i, '').trim() || 'WhatsApp: 0812-3456-7890 | Buka Setiap Hari'}
                          </p>
                        </div>

                        {/* Tombol WhatsApp dengan Format Pesan Otomatis */}
                        {(() => {
                          const customMsg = section.waMessage || 'Halo, saya ingin memesan menu dari website Anda.';
                          const rawPhone = ((section.content || '').match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([0-9+\-\s]+)/i)?.[1] || '0812-3456-7890').replace(/\D/g, '');
                          const cleanDigits = rawPhone.startsWith('0') ? '62' + rawPhone.slice(1) : rawPhone;
                          const waUrl = `https://wa.me/${cleanDigits}?text=${encodeURIComponent(customMsg)}`;

                          return (
                            <div className="space-y-2 pt-2">
                              <a
                                href={waUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-7 py-3.5 text-white font-extrabold rounded-2xl shadow-xl transition text-sm hover:opacity-90 transform hover:scale-105"
                                style={{ backgroundColor: activeTheme.primaryColor }}
                              >
                                <MessageCircle className="w-4 h-4 fill-white" />
                                <span>Chat Langsung via WhatsApp</span>
                              </a>
                              <div className="text-[11px] text-slate-500 font-medium">
                                Pesan otomatis: <span className="italic font-bold text-slate-700">&quot;{customMsg}&quot;</span>
                              </div>
                            </div>
                          );
                        })()}

                      </div>
                    </div>
                  )}

                  {/* 6. SECTION: FOOTER */}
                  {section.type === 'FOOTER' && (
                    <footer className="py-10 px-6 sm:px-12 bg-slate-900 text-slate-400 text-xs">
                      <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
                        <div>
                          <h4 className="font-bold text-white text-sm mb-0.5">{section.title}</h4>
                          <p className="text-[11px] text-slate-400">{section.subtitle}</p>
                          {section.content && <p className="text-[11px] text-slate-500 mt-1">{section.content}</p>}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          Website dibuat dengan <strong>NexaWeb.ai</strong>
                        </div>
                      </div>
                    </footer>
                  )}

                </div>
              );
            })}
            </div>

            {/* Drop Zone Paling Bawah Kanvas */}
            {isEditorMode && (
              <div
                onDragOver={(e) => handleSectionDragOver(e, sections.length)}
                onDragLeave={(e) => handleSectionDragLeave(e, sections.length)}
                onDrop={(e) => handleSectionDrop(e, sections.length)}
                className={`w-full py-3.5 border-2 border-dashed rounded-2xl transition flex items-center justify-center gap-2 text-xs font-bold my-3 ${
                  dragOverSectionIndex === sections.length
                    ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md ring-2 ring-blue-300'
                    : 'border-slate-300/80 text-slate-400 hover:border-slate-400 hover:bg-slate-50/50'
                }`}
              >
                <GripVertical className="w-4 h-4 text-slate-400" />
                <span>Lepas di sini untuk menempatkan bagian di paling bawah kanvas</span>
              </div>
            )}
          </div>

        </main>

        {/* PANEL KANAN: ASISTEN GEMINI AI COPILOT */}
        <AiCopilotSidebar
          isOpen={isAiChatOpen}
          onClose={() => setIsAiChatOpen(false)}
          onOpenApiKeyModal={() => setIsApiKeyModalOpen(true)}
          hasApiKey={hasApiKey}
          onExecuteAiAction={handleExecuteAiAction}
          currentContext={{
            sections,
            products,
            activeThemeId: activeTheme.id
          }}
        />

      </div>

      {/* 3. MODALS (TAMBAH BAGIAN, EDIT BAGIAN, KELOLA MENU, GAYA DESAIN, WARNA & FONT, API KEY) */}
      <SectionModals
        isAddSectionOpen={isAddSectionOpen}
        onCloseAddSection={() => setIsAddSectionOpen(false)}
        onAddSection={(newSec) => {
          setSections((prev) => [
            ...prev,
            {
              id: 'sec-' + Date.now(),
              type: newSec.type || 'HERO',
              title: newSec.title || 'Bagian Baru',
              subtitle: newSec.subtitle || '',
              content: newSec.content || '',
              waMessage: newSec.waMessage,
              orderIndex: prev.length + 1
            }
          ]);
        }}
        editingSection={editingSection}
        onCloseEditSection={() => setEditingSection(null)}
        onUpdateSection={(updated) => {
          setSections((prev) =>
            prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
          );
        }}
        isManageMenuOpen={isManageMenuOpen}
        onCloseManageMenu={() => setIsManageMenuOpen(false)}
        products={products}
        onAddProduct={(prod) => {
          addProductToCanvas({
            id: 'prod-' + Date.now(),
            ...prod
          });
        }}
        onDeleteProduct={(id) => {
          setProducts((prev) => prev.filter((p) => p.id !== id));
        }}
        isDesignModalOpen={isDesignModalOpen}
        onCloseDesignModal={() => setIsDesignModalOpen(false)}
        activeDesignId={activeDesign.id}
        onSelectDesign={(design) => {
          setActiveDesign(design);
          if (design.themeId) {
            const matchingTheme = DEFAULT_THEMES.find((t) => t.id === design.themeId);
            if (matchingTheme) {
              setActiveTheme(matchingTheme);
            }
          }
          setIsDesignModalOpen(false);
          try {
            confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
          } catch {}
        }}
        isThemeModalOpen={isThemeModalOpen}
        onCloseThemeModal={() => setIsThemeModalOpen(false)}
        activeThemeId={activeTheme.id}
        onSelectTheme={(theme) => {
          setActiveTheme(theme);
          setIsThemeModalOpen(false);
        }}
        isApiKeyModalOpen={isApiKeyModalOpen}
        onCloseApiKeyModal={() => setIsApiKeyModalOpen(false)}
        onSaveApiKey={(key) => {
          if (typeof window !== 'undefined') {
            localStorage.setItem('gemini_api_key', key);
            setHasApiKey(Boolean(key));
          }
          setIsApiKeyModalOpen(false);
        }}
        canvasSections={sections}
      />

      {/* Modal Sukses Deploy & Petunjuk Onlinekan Website */}
      <DeploySuccessModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        fileName={lastExportedFileName}
        onReDownload={handleDeployWebsite}
      />

    </div>
  );
}
