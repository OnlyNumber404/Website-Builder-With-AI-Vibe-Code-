import { SectionItem, ProductItem, SectionType, NavLinkItem } from './types';

export interface GeminiExecutionResult {
  reply: string;
  action?: {
    type:
      | 'ADD_PRODUCT'
      | 'DELETE_PRODUCT'
      | 'SET_THEME'
      | 'SET_DESIGN'
      | 'UPDATE_SECTION'
      | 'DELETE_SECTION'
      | 'ADD_SECTION'
      | 'UPDATE_NAV_LINKS'
      | 'RESET_CANVAS';
    payload?: any;
  };
}

export async function processAiPrompt(
  prompt: string,
  currentContext: {
    sections: SectionItem[];
    products: ProductItem[];
    activeThemeId: string;
  }
): Promise<GeminiExecutionResult> {
  const apiKey = typeof window !== 'undefined' ? localStorage.getItem('gemini_api_key') || '' : '';
  const lower = prompt.toLowerCase().trim();

  // =========================================================================
  // 1. DETERMINISTIC PRE-FLIGHT (GARANSI 100% BEKERJA CEPAT & AKURAT)
  // =========================================================================

  // A. KEMBALIKAN KE AWAL / RESET KANVAS
  const isResetCanvas =
    lower === 'kembalikan ke awal' ||
    lower === 'kembali ke awal' ||
    lower === 'reset' ||
    lower === 'reset toko' ||
    lower === 'ulang' ||
    lower === 'ulang dari awal' ||
    lower.includes('kembalikan ke awal') ||
    lower.includes('kembali ke awal') ||
    lower.includes('reset ke awal') ||
    lower.includes('reset kanvas') ||
    lower.includes('reset toko') ||
    lower.includes('reset website') ||
    lower.includes('ulang dari awal') ||
    lower.includes('reset default') ||
    lower.includes('toko awal');

  if (isResetCanvas) {
    return {
      reply: 'Siap! Seluruh kanvas website toko telah berhasil dikembalikan ke susunan awal default (tema, menu, dan bagian awal).',
      action: {
        type: 'RESET_CANVAS'
      }
    };
  }

  // B. UBAH NOMOR WHATSAPP / TELEPON
  const isPhoneChange =
    (lower.includes('nomor wa') ||
      lower.includes('no wa') ||
      lower.includes('nomor whatsapp') ||
      lower.includes('no whatsapp') ||
      lower.includes('nomor telepon') ||
      lower.includes('no telp') ||
      lower.includes('ganti wa') ||
      lower.includes('ubah wa') ||
      lower.includes('nomor baru') ||
      lower.includes('no hp') ||
      lower.includes('nomor hp')) &&
    (lower.includes('ubah') || lower.includes('ganti') || lower.includes('set') || lower.includes('jadi') || lower.includes('menjadi') || lower.includes('='));

  if (isPhoneChange) {
    // Cari digit nomor telepon
    const phoneMatch = prompt.match(/(?:(?:\+?62|0)8[0-9\-\s]{7,16})/);
    let cleanPhone = '';
    if (phoneMatch) {
      cleanPhone = phoneMatch[0].trim();
    } else {
      const anyNum = prompt.match(/(\d[\d\-\s]{8,16})/);
      if (anyNum) cleanPhone = anyNum[0].trim();
    }

    if (!cleanPhone) cleanPhone = '0812-9999-8888';

    return {
      reply: `Beres! Nomor WhatsApp toko telah berhasil diubah menjadi "${cleanPhone}". Tombol pemesanan di website sekarang otomatis terhubung ke nomor baru ini.`,
      action: {
        type: 'UPDATE_SECTION',
        payload: {
          sectionType: 'CONTACT',
          phone: cleanPhone
        }
      }
    };
  }

  // C. UBAH ALAMAT FISIK TOKO
  if (
    (lower.includes('alamat') || lower.includes('lokasi toko') || lower.includes('tempat toko')) &&
    (lower.includes('ubah') || lower.includes('ganti') || lower.includes('set') || lower.includes('jadi'))
  ) {
    let newAddress = '';
    const splitMatch = prompt.match(/(?:jadi|menjadi|ke|=|:\s*)\s+["'“”]?([^"'“”]+)["'“”]?$/i);
    if (splitMatch) {
      newAddress = splitMatch[1].trim();
    } else {
      newAddress = prompt.replace(/(?:tolong|coba|bisa)?\s*(?:ubah|ganti|set)\s*(?:alamat(?:\s*toko)?|lokasi(?:\s*toko)?)/gi, '').replace(/^[:=\-\s]+/, '').trim();
    }
    newAddress = newAddress.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();

    return {
      reply: `Alamat fisik toko telah berhasil diperbarui menjadi: "${newAddress}".`,
      action: {
        type: 'UPDATE_SECTION',
        payload: {
          sectionType: 'CONTACT',
          address: newAddress
        }
      }
    };
  }

  // D. UBAH JAM OPERASIONAL TOKO
  if (
    (lower.includes('jam buka') || lower.includes('jam operasional') || lower.includes('jadwal buka') || lower.includes('jam kerja')) &&
    (lower.includes('ubah') || lower.includes('ganti') || lower.includes('set') || lower.includes('jadi'))
  ) {
    let newHours = '';
    const splitMatch = prompt.match(/(?:jadi|menjadi|ke|=|:\s*)\s+["'“”]?([^"'“”]+)["'“”]?$/i);
    if (splitMatch) {
      newHours = splitMatch[1].trim();
    } else {
      newHours = prompt.replace(/(?:tolong|coba|bisa)?\s*(?:ubah|ganti|set)\s*(?:jam(?:\s*buka|\s*operasional)?|jadwal(?:\s*buka)?)/gi, '').replace(/^[:=\-\s]+/, '').trim();
    }
    newHours = newHours.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();

    return {
      reply: `Jadwal operasional toko telah berhasil diperbarui menjadi: "${newHours}".`,
      action: {
        type: 'UPDATE_SECTION',
        payload: {
          sectionType: 'CONTACT',
          hours: newHours
        }
      }
    };
  }

  // E. HAPUS MENU / PRODUK
  if (
    (lower.includes('hapus menu') || lower.includes('hapus produk') || lower.includes('buang menu') || lower.includes('hilangkan menu')) &&
    !lower.includes('navigasi')
  ) {
    const prodName = prompt
      .replace(/(?:tolong|coba|bisa)?\s*(?:hapus|buang|hilangkan)\s*(?:menu|produk|item)?/gi, '')
      .replace(/^[:=\-\s]+/, '')
      .trim()
      .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '');

    return {
      reply: `Menu "${prodName}" telah berhasil dihapus dari katalog kanvas website Anda.`,
      action: {
        type: 'DELETE_PRODUCT',
        payload: {
          query: prodName
        }
      }
    };
  }

  // F. GANTI GAYA DESAIN / TEMPLATE
  if (
    (lower.includes('gaya desain') || lower.includes('template')) &&
    (lower.includes('ganti') || lower.includes('ubah') || lower.includes('pilih') || lower.includes('terapkan'))
  ) {
    let templateId = 'modern-warung';
    let templateName = 'Warung & Resto Modern';

    if (lower.includes('kopi') || lower.includes('cafe') || lower.includes('racikan') || lower.includes('santai')) {
      templateId = 'cafe-handcrafted';
      templateName = 'Kedai Racikan Santai';
    } else if (lower.includes('pedas') || lower.includes('merah') || lower.includes('berani')) {
      templateId = 'bold-pedas';
      templateName = 'Spesial Pedas Berani';
    } else if (lower.includes('resmi') || lower.includes('katering') || lower.includes('kantor') || lower.includes('corporate')) {
      templateId = 'corporate-clean';
      templateName = 'Katering & Jasa Resmi';
    }

    return {
      reply: `Gaya desain website telah diubah menjadi template "${templateName}"!`,
      action: {
        type: 'SET_DESIGN',
        payload: {
          templateId
        }
      }
    };
  }

  // G. PENGUBAHAN JUDUL & NAMA TOKO (Contoh: "Ubah Judul Hero jadi Nasi Padang Pak Udin", "gantikan about jadi Cerita Dapoer Pak Udin")
  const isTitleChange =
    (lower.includes('judul') ||
      lower.includes('nama toko') ||
      lower.includes('nama warung') ||
      lower.includes('nama brand') ||
      lower.includes('headline')) &&
    (lower.includes('ubah') ||
      lower.includes('ganti') ||
      lower.includes('edit') ||
      lower.includes('set') ||
      lower.includes('jadikan') ||
      lower.includes('jadi'));

  // Kasus khusus: "gantikan about jadi [Judul Singkat]" atau "ubah hero jadi [Judul Singkat]"
  const isDirectSectionChange =
    (lower.startsWith('gantikan about') ||
      lower.startsWith('ganti about') ||
      lower.startsWith('ubah about') ||
      lower.startsWith('gantikan hero') ||
      lower.startsWith('ganti hero') ||
      lower.startsWith('ubah hero')) &&
    (lower.includes('jadi') || lower.includes('menjadi') || lower.includes('='));

  if (isTitleChange || isDirectSectionChange) {
    let targetSection: SectionType = 'HERO';
    let targetLabel = 'Hero';

    if (
      lower.includes('navbar') ||
      lower.includes('navigasi') ||
      lower.includes('header') ||
      lower.includes('nama toko') ||
      lower.includes('nama warung')
    ) {
      targetSection = 'NAVBAR';
      targetLabel = 'Navbar / Nama Toko';
    } else if (lower.includes('about') || lower.includes('tentang')) {
      targetSection = 'ABOUT';
      targetLabel = 'Tentang Usaha (About)';
    } else if (lower.includes('katalog') || lower.includes('catalog') || lower.includes('menu')) {
      targetSection = 'CATALOG';
      targetLabel = 'Katalog Menu';
    } else if (lower.includes('kontak') || lower.includes('contact') || lower.includes('wa') || lower.includes('whatsapp')) {
      targetSection = 'CONTACT';
      targetLabel = 'Kontak WhatsApp';
    } else if (lower.includes('footer')) {
      targetSection = 'FOOTER';
      targetLabel = 'Footer';
    } else {
      targetSection = 'HERO';
      targetLabel = 'Hero Banner';
    }

    let newTitle = '';
    const splitMatch = prompt.match(/(?:jadi|menjadi|ke|=|:\s*|bernama)\s+["'“”]?([^"'“”]+)["'“”]?$/i);
    if (splitMatch) {
      newTitle = splitMatch[1].trim();
    } else {
      newTitle = prompt
        .replace(
          /(?:tolong|coba|bisa|mohon)?\s*(?:ubah|ganti|edit|set|jadikan|gantikan)\s*(?:judul|headline|nama toko|nama warung)?\s*(?:hero|banner|about|tentang(?: usaha| kami)?|katalog|menu|kontak|navbar|footer)?/gi,
          ''
        )
        .replace(/^[:=\-\s]+/, '')
        .trim();
    }
    newTitle = newTitle.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();

    if (!newTitle) newTitle = 'Nasi Padang Pak Udin';

    // Jika teks pendek (< 45 karakter), kita update judul utama sekaligus sub-keterangannya agar kanvas langsung tampak berubah jelas
    return {
      reply: `Siap! Bagian ${targetLabel} telah berhasil diubah dengan judul: "${newTitle}".`,
      action: {
        type: 'UPDATE_SECTION',
        payload: {
          sectionType: targetSection,
          title: newTitle,
          subtitle: newTitle.length < 35 ? `Sajian khas terbaik dari ${newTitle}` : undefined
        }
      }
    };
  }

  // =========================================================================
  // 2. JIKA ADA API KEY GEMINI, PANGGIL GOOGLE AI STUDIO (GEMINI 1.5 FLASH)
  // =========================================================================
  if (apiKey) {
    try {
      const systemInstruction = `
Anda adalah Asisten AI Copilot untuk NexaWeb.ai Website Builder khusus UMKM Indonesia.
Tugas Anda: Membantu pemilik UMKM mengedit website mereka secara otomatis berdasarkan instruksi bahasa sehari-hari.

Format output JSON yang WAJIB Anda kembalikan (tanpa markdown backtick):
{
  "reply": "Pesan ramah dalam Bahasa Indonesia yang menjelaskan apa yang baru saja diubah.",
  "action": {
    "type": "ADD_PRODUCT" | "DELETE_PRODUCT" | "SET_THEME" | "SET_DESIGN" | "UPDATE_SECTION" | "DELETE_SECTION" | "ADD_SECTION" | "UPDATE_NAV_LINKS" | "RESET_CANVAS" | "NONE",
    "payload": { ... }
  }
}

Aturan Tindakan (Action):
1. Mengembalikan ke Awal / Reset Toko:
   "action": { "type": "RESET_CANVAS" }
2. Mengubah Nomor WhatsApp / Alamat / Jam Buka:
   Contoh: "Ubah nomor WA jadi 0812-9999-8888"
   "action": { "type": "UPDATE_SECTION", "payload": { "sectionType": "CONTACT", "phone": "0812-9999-8888" } }
   Contoh: "Ganti alamat jadi Jl. Merdeka No. 12"
   "action": { "type": "UPDATE_SECTION", "payload": { "sectionType": "CONTACT", "address": "Jl. Merdeka No. 12" } }
3. Mengubah Judul / Isi / Subjudul:
   Contoh: "Ubah Judul Hero jadi Nasi Padang Pak Udin"
   "action": { "type": "UPDATE_SECTION", "payload": { "sectionType": "HERO", "title": "Nasi Padang Pak Udin" } }
4. Mengubah atau Menambah Tautan Navigasi (Navbar):
   "action": { "type": "UPDATE_NAV_LINKS", "payload": { "links": [ { "label": "...", "target": "#hero" | "#about" | "#catalog" | "#contact" } ] } }
5. Menambah Produk Baru:
   "action": { "type": "ADD_PRODUCT", "payload": { "name": "...", "price": 15000, "category": "Makanan Utama" | "Minuman" | "Camilan" | "Paket Spesial" } }
6. Menghapus Produk:
   "action": { "type": "DELETE_PRODUCT", "payload": { "query": "..." } }
7. Mengganti Tema / Warna:
   "action": { "type": "SET_THEME", "payload": { "themeId": "cafe-aesthetic" | "ocean-clean" | "bold-impact" | "warm-traditional" | "modern-warung" } }
8. Mengganti Gaya Desain / Template:
   "action": { "type": "SET_DESIGN", "payload": { "templateId": "modern-warung" | "cafe-handcrafted" | "bold-pedas" | "corporate-clean" } }
Kembalikan HANYA JSON murni tanpa pembungkus \`\`\`json.
      `;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  { text: systemInstruction },
                  {
                    text: `Data Kanvas Sekarang:\nBagian: ${JSON.stringify(
                      currentContext.sections?.map((s) => ({ id: s.id, type: s.type, title: s.title }))
                    )}\nProduk: ${JSON.stringify(currentContext.products)}\nTema: ${
                      currentContext.activeThemeId
                    }\n\nPerintah Pengguna: "${prompt}"`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.2,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        try {
          const parsed = JSON.parse(rawText);
          if (parsed.action?.type && parsed.action.type !== 'NONE') {
            return {
              reply: parsed.reply || 'Perubahan berhasil diterapkan ke kanvas website Anda!',
              action: parsed.action
            };
          }
        } catch {
          // Fallback to local parsing below
        }
      }
    } catch (err) {
      console.warn('Gagal memanggil API Gemini, beralih ke Smart Engine lokal:', err);
    }
  }

  // =========================================================================
  // 3. SMART ENGINE OFFLINE TAMBAHAN (UNTUK FITUR-FITUR LAINNYA)
  // =========================================================================

  // H. PENGUBAHAN PESAN WHATSAPP
  if (
    (lower.includes('pesan whatsapp') || lower.includes('pesan wa') || lower.includes('template wa') || lower.includes('chat wa')) &&
    (lower.includes('ubah') || lower.includes('ganti') || lower.includes('set') || lower.includes('edit'))
  ) {
    let newMsg = '';
    const splitMatch = prompt.match(/(?:jadi|menjadi|ke|=|:\s*)\s+["'“”]?([^"'“”]+)["'“”]?$/i);
    if (splitMatch) {
      newMsg = splitMatch[1].trim();
    } else {
      newMsg = prompt.replace(/(?:ubah|ganti|set|edit)\s*(?:pesan(?:\s*otomatis)?\s*(?:whatsapp|wa)|template\s*wa)/gi, '').replace(/^[:=\-\s]+/, '').trim();
    }
    newMsg = newMsg.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();

    return {
      reply: `Pesan otomatis WhatsApp pembeli telah berhasil diubah menjadi: "${newMsg}"`,
      action: {
        type: 'UPDATE_SECTION',
        payload: {
          sectionType: 'CONTACT',
          waMessage: newMsg
        }
      }
    };
  }

  // I. PENGUBAHAN ISI / KONTEN / CERITA
  const isContentChange =
    (lower.includes('isi') ||
      lower.includes('konten') ||
      lower.includes('deskripsi') ||
      lower.includes('subjudul') ||
      lower.includes('sub-judul') ||
      lower.includes('subtitle') ||
      lower.includes('keterangan') ||
      lower.includes('cerita')) &&
    (lower.includes('ubah') ||
      lower.includes('ganti') ||
      lower.includes('edit') ||
      lower.includes('set') ||
      lower.includes('jadikan') ||
      lower.includes('gantikan'));

  if (isContentChange) {
    let targetSection: SectionType = 'ABOUT';
    let targetLabel = 'Tentang Usaha (About)';

    if (lower.includes('hero') || lower.includes('banner')) {
      targetSection = 'HERO';
      targetLabel = 'Hero Banner';
    } else if (lower.includes('kontak') || lower.includes('contact') || lower.includes('whatsapp') || lower.includes('wa')) {
      targetSection = 'CONTACT';
      targetLabel = 'Kontak WhatsApp';
    } else if (lower.includes('katalog') || lower.includes('catalog') || lower.includes('menu')) {
      targetSection = 'CATALOG';
      targetLabel = 'Katalog Menu';
    } else if (lower.includes('footer')) {
      targetSection = 'FOOTER';
      targetLabel = 'Footer';
    }

    let newContent = '';
    const splitMatch = prompt.match(/(?:jadi|menjadi|ke|=|:\s*)\s+["'“”]?([^"'“”]+)["'“”]?$/i);
    if (splitMatch) {
      newContent = splitMatch[1].trim();
    } else {
      newContent = prompt
        .replace(
          /(?:tolong|coba|bisa|mohon)?\s*(?:ubah|ganti|edit|set|jadikan|gantikan)\s*(?:isi|konten|deskripsi|subjudul|sub-judul|subtitle|keterangan|cerita)?\s*(?:hero|banner|about|tentang(?: usaha| kami)?|katalog|menu|kontak|footer)?/gi,
          ''
        )
        .replace(/^[:=\-\s]+/, '')
        .trim();
    }
    newContent = newContent.replace(/^["'“”‘’]+|["'“”‘’]+$/g, '').trim();

    const isSub = lower.includes('subjudul') || lower.includes('sub-judul') || lower.includes('subtitle');

    return {
      reply: `Beres! ${isSub ? 'Sub-judul' : 'Isi konten'} bagian ${targetLabel} telah berhasil diperbarui.`,
      action: {
        type: 'UPDATE_SECTION',
        payload: {
          sectionType: targetSection,
          ...(isSub
            ? { subtitle: newContent }
            : {
                content: newContent,
                subtitle: newContent.length < 90 ? newContent : undefined
              })
        }
      }
    };
  }

  // J. EDIT / TAMBAH TAUTAN NAVIGASI
  if (
    lower.includes('navigasi') ||
    lower.includes('navbar') ||
    lower.includes('tautan menu') ||
    lower.includes('link menu')
  ) {
    const navSec = currentContext.sections?.find((s) => s.type === 'NAVBAR');
    let existingLinks: NavLinkItem[] = [];
    if (navSec) {
      try {
        const parsed = JSON.parse(navSec.content);
        if (Array.isArray(parsed)) existingLinks = [...parsed];
      } catch {}
    }
    if (existingLinks.length === 0) {
      existingLinks = [
        { label: 'Beranda', target: '#hero' },
        { label: 'Tentang Kami', target: '#about' },
        { label: 'Daftar Menu', target: '#catalog' },
        { label: 'Kontak', target: '#contact' }
      ];
    }

    if (lower.includes('jadi') || lower.includes('menjadi') || lower.includes('=')) {
      const splitMatch = prompt.match(/(?:jadi|menjadi|=|:\s*)\s+["'“”]?([^"'“”]+)["'“”]?$/i);
      if (splitMatch) {
        const rawList = splitMatch[1];
        const rawItems = rawList.split(/[,;\n]+/).map((s) => s.trim().replace(/^["'“”‘’]+|["'“”‘’]+$/g, '')).filter(Boolean);
        if (rawItems.length > 0) {
          const newLinks: NavLinkItem[] = rawItems.map((item) => {
            const lowItem = item.toLowerCase();
            let target = '#hero';
            if (lowItem.includes('menu') || lowItem.includes('katalog') || lowItem.includes('produk')) target = '#catalog';
            else if (lowItem.includes('tentang') || lowItem.includes('about') || lowItem.includes('profil')) target = '#about';
            else if (lowItem.includes('kontak') || lowItem.includes('wa') || lowItem.includes('hubungi') || lowItem.includes('lokasi')) target = '#contact';
            return { label: item, target };
          });

          return {
            reply: `Menu navigasi atas berhasil diperbarui dengan daftar tautan: ${newLinks.map((l) => l.label).join(', ')}.`,
            action: {
              type: 'UPDATE_NAV_LINKS',
              payload: { links: newLinks }
            }
          };
        }
      }
    }

    let newLinkLabel = prompt
      .replace(/(?:tolong|coba|bisa|mohon)?\s*(?:edit|tambah(?:kan)?|masukkan|buatkan)\s*(?:menu|tautan)?\s*(?:navigasi|navbar)?\s*(?:tambah(?:kan)?)?/gi, '')
      .replace(/^[:=\-\s]+/, '')
      .trim()
      .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '');

    if (!newLinkLabel || newLinkLabel.length < 2) newLinkLabel = 'Promo Spesial';

    let linkTarget = '#hero';
    const lowLabel = newLinkLabel.toLowerCase();
    if (lowLabel.includes('menu') || lowLabel.includes('katalog') || lowLabel.includes('produk')) linkTarget = '#catalog';
    else if (lowLabel.includes('tentang') || lowLabel.includes('about')) linkTarget = '#about';
    else if (lowLabel.includes('kontak') || lowLabel.includes('wa') || lowLabel.includes('lokasi')) linkTarget = '#contact';

    const updatedLinks = [...existingLinks, { label: newLinkLabel, target: linkTarget }];

    return {
      reply: `Tautan navigasi "${newLinkLabel}" berhasil ditambahkan ke menu atas website Anda!`,
      action: {
        type: 'UPDATE_NAV_LINKS',
        payload: { links: updatedLinks }
      }
    };
  }

  // K. TAMBAH PRODUK / MENU BARU
  if (
    lower.includes('tambah') ||
    lower.includes('masukkan') ||
    lower.includes('buat menu') ||
    lower.includes('menu baru') ||
    lower.includes('tambahkan menu')
  ) {
    let price = 15000;
    const rbMatch = lower.match(/(\d+)\s*(?:rb|k)\b/i);
    if (rbMatch) {
      price = parseInt(rbMatch[1], 10) * 1000;
    } else {
      const priceMatch = lower.match(/(?:harga|rp\.?|sebesar)?\s*(\d+[\d.,]*)/i);
      if (priceMatch) {
        const rawNum = priceMatch[1].replace(/[.,]/g, '');
        const parsed = parseInt(rawNum, 10);
        if (!isNaN(parsed) && parsed > 0) price = parsed;
      }
    }

    let name = prompt
      .replace(/(?:tolong|coba|bisa|mohon)?\s*(?:tambah(?:kan)?|masukkan|buatkan|bikin)\s*(?:menu|item|produk)?\s*(?:ini\s*:?)?/gi, '')
      .replace(/(?:harga|rp\.?|sebesar)?\s*(\d+[\d.,]*)/gi, '')
      .replace(/(\d+)\s*(?:rb|k)\b/gi, '')
      .replace(/ke\s*(?:dalam)?\s*(?:kanvas|daftar|menu|katalog)/gi, '')
      .replace(/^[:=\-\s]+/, '')
      .trim()
      .replace(/^["'“”‘’]+|["'“”‘’]+$/g, '');

    if (!name) name = 'Menu Spesial Baru';

    let category = 'Makanan Utama';
    if (
      lower.includes('es') ||
      lower.includes('teh') ||
      lower.includes('kopi') ||
      lower.includes('jus') ||
      lower.includes('minum') ||
      lower.includes('jeruk') ||
      lower.includes('soda') ||
      lower.includes('boba') ||
      lower.includes('wedang')
    ) {
      category = 'Minuman';
    } else if (
      lower.includes('gorengan') ||
      lower.includes('roti') ||
      lower.includes('keripik') ||
      lower.includes('pisang') ||
      lower.includes('camilan') ||
      lower.includes('snack') ||
      lower.includes('tahu') ||
      lower.includes('tempe') ||
      lower.includes('kentang')
    ) {
      category = 'Camilan';
    } else if (
      lower.includes('paket') ||
      lower.includes('box') ||
      lower.includes('prasmanan') ||
      lower.includes('syukuran') ||
      lower.includes('katering')
    ) {
      category = 'Paket Spesial';
    }

    return {
      reply: `Sip! Menu "${name}" dengan harga Rp ${price.toLocaleString('id-ID')} (${category}) telah berhasil ditambahkan ke katalog kanvas website Anda.`,
      action: {
        type: 'ADD_PRODUCT',
        payload: {
          name,
          price,
          category
        }
      }
    };
  }

  // L. GANTI TEMA / WARNA WEBSITE
  if (lower.includes('tema') || lower.includes('warna') || lower.includes('ganti tampilan') || lower.includes('ubah gaya')) {
    if (lower.includes('kopi') || lower.includes('cafe') || lower.includes('kafe') || lower.includes('cokelat') || lower.includes('santai')) {
      return {
        reply: 'Gaya desain website telah diubah menjadi tema "Kedai Kopi & Cafe Santai" dengan nuansa hangat bersahabat.',
        action: {
          type: 'SET_THEME',
          payload: { themeId: 'cafe-aesthetic' }
        }
      };
    } else if (lower.includes('biru') || lower.includes('jasa') || lower.includes('profesional') || lower.includes('bersih')) {
      return {
        reply: 'Gaya desain website telah diubah menjadi tema "Biru Profesional & Jasa" yang modern dan terpercaya.',
        action: {
          type: 'SET_THEME',
          payload: { themeId: 'ocean-clean' }
        }
      };
    } else if (lower.includes('pedas') || lower.includes('merah') || lower.includes('berani') || lower.includes('fast food')) {
      return {
        reply: 'Gaya desain website telah diubah menjadi tema "Merah Berani & Pedas" yang menggugah selera pelanggan.',
        action: {
          type: 'SET_THEME',
          payload: { themeId: 'bold-impact' }
        }
      };
    } else if (lower.includes('tradisional') || lower.includes('rempah') || lower.includes('hangat') || lower.includes('jawa')) {
      return {
        reply: 'Gaya desain website telah diubah menjadi tema "Tradisional Hangat & Rempah" bernuansa warisan nusantara.',
        action: {
          type: 'SET_THEME',
          payload: { themeId: 'warm-traditional' }
        }
      };
    } else {
      return {
        reply: 'Gaya desain website telah dikembalikan ke tema "Modern Warung (Rekomendasi)" dengan warna hijau segar yang ramah pengunjung.',
        action: {
          type: 'SET_THEME',
          payload: { themeId: 'modern-warung' }
        }
      };
    }
  }

  // M. TAMBAH BAGIAN BARU
  if (lower.includes('tambah hero') || lower.includes('tambah promo')) {
    return {
      reply: 'Bagian Banner Hero baru berhasil ditambahkan ke kanvas website Anda!',
      action: {
        type: 'ADD_SECTION',
        payload: {
          type: 'HERO',
          title: 'Promo Spesial Bulan Ini!',
          subtitle: 'Diskon hemat untuk pelanggan setia dan pemesanan partai besar',
          content: 'Pesan Sekarang Sebelum Kehabisan | Hubungi WhatsApp Toko'
        }
      }
    };
  } else if (lower.includes('tambah kontak') || lower.includes('tambah wa')) {
    return {
      reply: 'Bagian Kontak WhatsApp baru berhasil ditambahkan ke kanvas website Anda!',
      action: {
        type: 'ADD_SECTION',
        payload: {
          type: 'CONTACT',
          title: 'Hubungi Kami & Pemesanan Cepat',
          subtitle: 'Layanan pelanggan siap sedia setiap hari',
          content: 'WhatsApp: 0812-3456-7890 | Buka: 08.00 - 20.00 WIB'
        }
      }
    };
  } else if (lower.includes('tambah tentang') || lower.includes('tambah about')) {
    return {
      reply: 'Bagian Tentang Usaha baru berhasil ditambahkan ke kanvas website Anda!',
      action: {
        type: 'ADD_SECTION',
        payload: {
          type: 'ABOUT',
          title: 'Cerita Usaha Kami',
          subtitle: 'Komitmen memberikan produk dan pelayanan terbaik',
          content: 'Kami mengutamakan kualitas bahan terbaik dan kepuasan pelanggan setia kami.'
        }
      }
    };
  }

  // DEFAULT FALLBACK RESPONSE
  return {
    reply: `Halo! Saya Asisten AI NexaWeb dengan akses penuh untuk mengedit kanvas. Anda bisa meminta saya:
• "Kembalikan ke awal" (reset ke default)
• "Ubah nomor WA jadi 0812-9999-8888"
• "Ubah Judul Hero jadi Nasi Padang Pak Udin"
• "Gantikan about jadi Cerita Dapoer Pak Udin"
• "Tambah menu Rendang Sapi harga 35000"
• "Edit navigasi tambahkan Promo"`
  };
}
