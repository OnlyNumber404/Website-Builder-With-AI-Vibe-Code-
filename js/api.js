/**
 * ======================================================================================
 * GOOGLE AI STUDIO API INTEGRATION (GEMINI FLASH FREE TIER)
 * ======================================================================================
 * Sesuai PRD Section 4:
 * AC-4.1: Google AI Studio API via endpoint gemini-1.5-flash / gemini-2.0-flash
 * AC-4.2: Payload prompt + system instruction strictly format JSON
 * AC-4.3: Mengurai respon JSON dan mengeksekusi mutasi List<Class>
 * AC-4.4: Fallback pesan jika rate-limit / gagal jaringan:
 *         "Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi."
 * AC-4.5: Pemahaman frasa kasual bahasa Indonesia sehari-hari bagi pemula tanpa koding
 * ======================================================================================
 */

/* ======================================================================================
 * >>>>>>>>>>>>>>>>>>>>> [TEMPAT TARUH API KEY GEMINI DI SINI] <<<<<<<<<<<<<<<<<<<<<<<<
 * Silakan ganti string di bawah ini dengan Google AI Studio API Key milik Anda.
 * Dapatkan API Key gratis di: https://aistudio.google.com/app/apikey
 * Catatan: Anda juga bisa memasukkan API Key secara langsung lewat tombol "Pengaturan API" di UI website!
 * ====================================================================================== */
const CONFIG_GEMINI = {
  // Masukkan API Key Anda di bawah ini, atau gunakan tombol 'API Key' di antarmuka website:
  API_KEY: '', // <-- Contoh: 'AIzaSyD-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'

  // Model utama aktif (Gemini Flash terbaru)
  MODEL_NAME: 'gemini-3.1-flash-lite',

  // Daftar urutan fallback model jika model utama sibuk / di-upgrade Google
  FALLBACK_MODELS: [
    'gemini-3.1-flash-lite',
    'gemini-flash-latest',
    'gemini-3.8-flash',
    'gemini-2.5-flash-lite',
    'gemini-2.0-flash'
  ],

  // Endpoint resmi Google AI Studio
  BASE_URL: 'https://generativelanguage.googleapis.com/v1beta/models'
};
/* ======================================================================================
 * >>>>>>>>>>>>>>>>>>>>> [AKHIR TEMPAT TARUH API KEY] <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<
 * ====================================================================================== */

/**
 * Helper untuk mengambil API Key aktif (baik dari CONFIG_GEMINI atau dari localStorage jika diinput via UI)
 */
function getActiveGeminiApiKey() {
  try {
    const storedKey = localStorage.getItem('GEMINI_API_KEY_OVERRIDE');
    if (storedKey && storedKey.trim() !== '') {
      return storedKey.trim();
    }
    return (CONFIG_GEMINI.API_KEY || '').trim();
  } catch (err) {
    console.error('Error saat mengambil API Key:', err);
    return (CONFIG_GEMINI.API_KEY || '').trim();
  }
}

/**
 * Helper untuk menyimpan API Key dari UI Settings
 */
function setActiveGeminiApiKey(key) {
  try {
    if (key && key.trim() !== '') {
      localStorage.setItem('GEMINI_API_KEY_OVERRIDE', key.trim());
      CONFIG_GEMINI.API_KEY = key.trim();
    } else {
      localStorage.removeItem('GEMINI_API_KEY_OVERRIDE');
      CONFIG_GEMINI.API_KEY = '';
    }
    return true;
  } catch (err) {
    console.error('Error saat menyimpan API Key:', err);
    return false;
  }
}

/**
 * System Instruction kalibrasi bahasa Indonesia sehari-hari untuk siapa saja yang ingin membuat website tanpa perlu tahu koding
 * Sesuai AC-4.2 & AC-4.5
 */
const GEMINI_SYSTEM_INSTRUCTION = `
Anda adalah AI Website Builder Engine untuk pengguna di Indonesia yang ingin membuat website praktis tanpa perlu keahlian coding dan berbicara dengan bahasa sehari-hari sederhana.
Tugas Anda: Menganalisis perintah pengguna dan mengembalikannya STRICTLY HANYA dalam format JSON valid tanpa teks pengantar, tanpa markdown codeblock ticks jika memungkinkan, dan tanpa penjelasan tambahan.

SKEMA JSON RESMI YANG HARUS DIHASILKAN (PILIH SALAH SATU ACTION):

1. UNTUK BAGIAN WEBSITE (HERO, ABOUT, CATALOG, CONTACT, FOOTER):
{
  "action": "ADD_SECTION | UPDATE_SECTION | DELETE_SECTION",
  "targetId": "string (opsional, jika diketahui)",
  "sectionData": {
    "type": "HERO | CATALOG | ABOUT | CONTACT | FOOTER",
    "title": "string judul",
    "subtitle": "string subjudul atau slogan",
    "content": "string isi penjelasan atau teks kontak/tentang kami",
    "orderIndex": 1
  }
}

2. UNTUK KELOLA ITEM / MENU / PRODUK (MANAGE_PRODUCT):
{
  "action": "MANAGE_PRODUCT",
  "productOperation": "ADD | UPDATE | DELETE",
  "targetId": "string (opsional)",
  "productData": {
    "name": "string nama item atau menu",
    "price": 25000,
    "category": "string kategori item"
  }
}

3. UNTUK KUSTOMISASI TEMA, WARNA & JENIS FONT (UPDATE_THEME):
{
  "action": "UPDATE_THEME",
  "themeData": {
    "primaryColor": "hex string (#15803d, #b91c1c, dll)",
    "backgroundColor": "hex string (#ffffff, #fefce8, dll)",
    "textColor": "hex string (#334155, dll)",
    "headingColor": "hex string (#0f172a, #fbbf24, dll)",
    "headingFont": "Playfair Display | Plus Jakarta Sans | Poppins | Merriweather | Inter | Lora | Roboto",
    "bodyFont": "Plus Jakarta Sans | Poppins | Inter | Roboto | Lora | Merriweather",
    "presetId": "nusantara-hijau | kopi-tradisional | merah-selera | biru-terpercaya | emas-mewah"
  },
  "message": "string konfirmasi perubahan tema"
}

4. UNTUK PILIHAN GAYA DESAIN TEMPLATE WEBSITE (SET_DESIGN_TEMPLATE):
{
  "action": "SET_DESIGN_TEMPLATE",
  "templateId": "modern-warung | aesthetic-cafe | bold-fastfood | corporate-catering | luxury-artisan",
  "message": "string konfirmasi perubahan gaya desain template"
}

ATURAN KALIBRASI BAHASA INDONESIA SEHARI-HARI (TANPA KODING):
- Jika pengguna meminta ganti gaya desain template (misal: "ganti desain ke warung modern", "pilih desain rekomendasi", "pakai template kafe", "ganti gaya desain jadi katering", "ubah desain jadi restoran pedas", "ganti ke desain mewah sultan"), ini adalah SET_DESIGN_TEMPLATE.
- Jika pengguna meminta ganti tema, warna web, latar belakang, warna tombol, atau jenis huruf/font (misal: "ganti warna web jadi merah", "ganti tema jadi kopi", "ubah font jadi poppins", "ganti background jadi krem", "ubah warna tombol jadi biru"), ini adalah UPDATE_THEME.
- Jika pengguna berkata: "tambah item baru...", "tambah menu...", "tambah produk...", "tambah makanan/minuman...", "jual...", atau perintah yang menyebutkan nama makanan dan harga (misal "tambah soto ayam harga 25000"), ini adalah MANAGE_PRODUCT dengan productOperation "ADD".
- Jika pengguna berkata: "ganti judul toko jadi Warung Bu Sri", "ubah nama warung jadi...", atau sejenisnya, ini adalah UPDATE_SECTION dengan type "HERO" dan perbarui title.
- Jika pengguna berkata: "ubah slogan jadi...", "ganti kata-kata di bawah judul...", ini adalah UPDATE_SECTION type "HERO" dan perbarui subtitle.
- Jika pengguna berkata: "hapus kontak", "buang bagian bawah", ini adalah DELETE_SECTION dengan type yang sesuai ("CONTACT", "FOOTER", dll).
- Jika pengguna berkata: "tambah bagian cerita kami / tentang kami...", ini adalah ADD_SECTION atau UPDATE_SECTION type "ABOUT".
- Jika pengguna berkata: "ganti no wa / nomor telepon jadi 0812...", ini adalah UPDATE_SECTION type "CONTACT" dan perbarui content.
- Selalu kembalikan HANYA JSON MURNI!
`;

/**
 * Mengirimkan prompt pengguna ke Google AI Studio Gemini API
 * Dilengkapi try...catch komprehensif sesuai permintaan & AC-4.4
 */


/**
 * Mengirimkan prompt pengguna ke Google AI Studio Gemini API
 * Dilengkapi multi-model fallback & graceful offline fallback
 */
async function sendPromptToGemini(userPrompt, currentContext = {}) {
  try {
    const apiKey = getActiveGeminiApiKey();

    // Validasi apakah API key sudah diisi atau belum
    if (!apiKey || apiKey === '' || apiKey.includes('MASUKKAN_GEMINI_API_KEY')) {
      console.warn('API Key belum diisi. Menggunakan Offline Mock Interpreter bawaan.');
      return fallbackOfflineInterpreter(userPrompt, currentContext);
    }

    // Daftar model yang akan dicoba secara berurutan
    const modelCandidates = [
      CONFIG_GEMINI.MODEL_NAME || 'gemini-3.1-flash-lite',
      ...(CONFIG_GEMINI.FALLBACK_MODELS || []).filter(m => m !== CONFIG_GEMINI.MODEL_NAME)
    ];

    // Payload sesuai format JSON terstruktur
    const requestPayload = {
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: `Status website saat ini:
- Bagian aktif: ${JSON.stringify(currentContext.sectionsSummary || [])}
- Item produk aktif: ${JSON.stringify(currentContext.productsSummary || [])}

Instruksi pengguna:
"${userPrompt}"`
            }
          ]
        }
      ],
      systemInstruction: {
        role: 'system',
        parts: [
          {
            text: GEMINI_SYSTEM_INSTRUCTION
          }
        ]
      },
      generationConfig: {
        temperature: 0.1,
        topP: 0.8,
        responseMimeType: 'application/json'
      }
    };

    let lastError = null;

    for (const model of modelCandidates) {
      try {
        const endpoint = `${CONFIG_GEMINI.BASE_URL}/${model}:generateContent?key=${apiKey}`;
        const response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestPayload)
        });

        if (!response.ok) {
          const errText = await response.text();
          console.warn(`Gemini API [${model}] status [${response.status}]:`, errText);

          // Jika 404 (model dipensiunkan/ganti nama) atau 503 (server Google overload), coba model berikutnya
          if (response.status === 404 || response.status === 503) {
            lastError = new Error(`Model ${model} tidak tersedia (${response.status}). Mencoba model cadangan...`);
            continue;
          }

          if (response.status === 400 || response.status === 403) {
            lastError = new Error('API Key Google AI Studio tidak valid atau belum diaktifkan. Silakan periksa kembali API Key Anda.');
            break;
          }

          if (response.status === 429) {
            lastError = new Error('Batas kuota harian Gemini API tercapai.');
            continue;
          }

          lastError = new Error(`Layanan AI memberikan respon HTTP ${response.status}`);
          continue;
        }

        const data = await response.json();
        const parts = data?.candidates?.[0]?.content?.parts || [];
        const textPart = parts.find(p => p.text && !p.thought) || parts[0];
        const rawText = textPart?.text;

        if (!rawText) {
          lastError = new Error(`Respon dari ${model} kosong.`);
          continue;
        }

        const parsedResult = cleanAndParseJSON(rawText);
        return {
          success: true,
          data: parsedResult,
          raw: rawText,
          source: 'GEMINI_API',
          modelUsed: model
        };

      } catch (reqError) {
        console.warn(`Error koneksi ke model ${model}:`, reqError.message);
        lastError = reqError;
      }
    }

    // JIKA SEMUA MODEL GAGAL ATAU RATE LIMIT: Fallback mulus ke Offline Interpreter
    // agar pengguna tidak mandek dengan pesan error
    console.warn('Semua endpoint Gemini gagal atau kuota habis. Mengaktifkan Smart Assistant Fallback:', lastError?.message);
    const fallbackRes = fallbackOfflineInterpreter(userPrompt, currentContext);
    if (fallbackRes && fallbackRes.success) {
      fallbackRes.source = 'OFFLINE_FALLBACK';
      fallbackRes.originalError = lastError?.message;
      return fallbackRes;
    }

    throw lastError || new Error('Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi.');

  } catch (error) {
    console.error('Error di dalam sendPromptToGemini:', error);
    return {
      success: false,
      error: error.message || 'Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi.',
      source: 'ERROR'
    };
  }
}


/**
 * Membersihkan format teks markdown ```json ... ``` bila model menyertakannya
 */
function cleanAndParseJSON(rawText) {
  try {
    let cleaned = rawText.trim();
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json/, '').replace(/```$/, '').trim();
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```/, '').replace(/```$/, '').trim();
    }
    return JSON.parse(cleaned);
  } catch (parseError) {
    console.error('Gagal parse JSON dari Gemini:', parseError, 'Raw Text:', rawText);
    try {
      const startIdx = rawText.indexOf('{');
      const endIdx = rawText.lastIndexOf('}');
      if (startIdx !== -1 && endIdx !== -1) {
        const extracted = rawText.substring(startIdx, endIdx + 1);
        return JSON.parse(extracted);
      }
    } catch (e2) {
      console.error('Ekstraksi JSON kedua juga gagal:', e2);
    }
    throw new Error('Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi.');
  }
}

/**
 * FALLBACK OFFLINE INTENT INTERPRETER
 * Mengenali bahasa sehari-hari secara akurat saat API Key belum diisi
 */
function fallbackOfflineInterpreter(prompt, context) {
  try {
    const text = (prompt || '').toLowerCase().trim();

    // 0A. PILIHAN GAYA DESAIN TEMPLATE WEBSITE (SET_DESIGN_TEMPLATE)
    const isDesignTemplatePrompt = text.includes('desain') || text.includes('design') || text.includes('template') || 
                                   text.includes('tata letak') || text.includes('rekomendasi') || text.includes('layout');

    if (isDesignTemplatePrompt) {
      let targetId = 'modern-warung';
      let msg = 'Gaya desain diterapkan: Warung Modern & Bersih (⭐ Paling Direkomendasikan).';

      if (text.includes('kafe') || text.includes('cafe') || text.includes('kedai') || text.includes('kopi')) {
        targetId = 'aesthetic-cafe';
        msg = 'Gaya desain diterapkan: Kafe & Kedai Estetik.';
      } else if (text.includes('resto') || text.includes('cepat saji') || text.includes('pedas') || text.includes('fastfood') || text.includes('geprek')) {
        targetId = 'bold-fastfood';
        msg = 'Gaya desain diterapkan: Resto Mantap & Cepat Saji (Menggugah Selera).';
      } else if (text.includes('katering') || text.includes('catering') || text.includes('kantor') || text.includes('resmi') || text.includes('halal')) {
        targetId = 'corporate-catering';
        msg = 'Gaya desain diterapkan: Katering & Usaha Resmi (Berstandar Halal).';
      } else if (text.includes('mewah') || text.includes('sultan') || text.includes('hampers') || text.includes('artisan') || text.includes('eksklusif')) {
        targetId = 'luxury-artisan';
        msg = 'Gaya desain diterapkan: Kuliner Mewah & Hampers Sultan.';
      } else if (text.includes('warung') || text.includes('rekomendasi') || text.includes('nusantara')) {
        targetId = 'modern-warung';
        msg = 'Gaya desain diterapkan: Warung Modern & Bersih (★ Paling Direkomendasikan).';
      }

      return {
        success: true,
        data: {
          action: 'SET_DESIGN_TEMPLATE',
          templateId: targetId,
          message: msg
        },
        source: 'FALLBACK_OFFLINE'
      };
    }

    // 0B. KUSTOMISASI TEMA, WARNA & JENIS FONT (UPDATE_THEME)
    const isThemePrompt = text.includes('warna') || text.includes('tema') || text.includes('font') || text.includes('huruf') || 
                          text.includes('background') || text.includes('latar') || text.includes('krem') || text.includes('cokelat') ||
                          text.includes('poppins') || text.includes('playfair') || text.includes('inter') || text.includes('lora');

    if (isThemePrompt) {
      const themeData = {};
      let msg = 'Gaya desain website berhasil diubah.';

      if (text.includes('kopi') || text.includes('cokelat') || text.includes('coklat')) {
        Object.assign(themeData, {
          presetId: 'kopi-tradisional',
          primaryColor: '#78350f',
          secondaryColor: '#b45309',
          backgroundColor: '#fefce8',
          cardBackground: '#fffbeb',
          headingColor: '#361605',
          textColor: '#451a03',
          headingFont: 'Playfair Display',
          bodyFont: 'Lora'
        });
        msg = 'Tema berhasil diubah ke: Kopi & Cokelat Klasik (Hangat & Elegan).';
      } else if (text.includes('merah') || text.includes('pedas') || text.includes('resto')) {
        Object.assign(themeData, {
          presetId: 'merah-selera',
          primaryColor: '#b91c1c',
          secondaryColor: '#ea580c',
          backgroundColor: '#fff7ed',
          cardBackground: '#ffffff',
          headingColor: '#7f1d1d',
          textColor: '#374151',
          headingFont: 'Poppins',
          bodyFont: 'Plus Jakarta Sans'
        });
        msg = 'Tema berhasil diubah ke: Merah Berani & Berselera.';
      } else if (text.includes('biru') || text.includes('modern') || text.includes('laut')) {
        Object.assign(themeData, {
          presetId: 'biru-terpercaya',
          primaryColor: '#1d4ed8',
          secondaryColor: '#0284c7',
          backgroundColor: '#f8fafc',
          cardBackground: '#ffffff',
          headingColor: '#0f172a',
          textColor: '#334155',
          headingFont: 'Inter',
          bodyFont: 'Inter'
        });
        msg = 'Tema berhasil diubah ke: Biru Modern & Elegan.';
      } else if (text.includes('emas') || text.includes('mewah') || text.includes('hitam') || text.includes('gelap')) {
        Object.assign(themeData, {
          presetId: 'emas-mewah',
          primaryColor: '#d97706',
          secondaryColor: '#f59e0b',
          backgroundColor: '#0f172a',
          cardBackground: '#1e293b',
          headingColor: '#fbbf24',
          textColor: '#cbd5e1',
          headingFont: 'Playfair Display',
          bodyFont: 'Plus Jakarta Sans'
        });
        msg = 'Tema berhasil diubah ke: Hitam & Emas Eksklusif.';
      } else if (text.includes('hijau') || text.includes('nusantara') || text.includes('alami') || text.includes('segar')) {
        Object.assign(themeData, {
          presetId: 'nusantara-hijau',
          primaryColor: '#15803d',
          secondaryColor: '#d97706',
          backgroundColor: '#ffffff',
          cardBackground: '#f0fdf4',
          headingColor: '#0f172a',
          textColor: '#334155',
          headingFont: 'Playfair Display',
          bodyFont: 'Plus Jakarta Sans'
        });
        msg = 'Tema berhasil diubah ke: Hijau Daun Nusantara.';
      }

      // Deteksi Warna Latar (Background)
      if (text.includes('latar') || text.includes('background')) {
        if (text.includes('krem') || text.includes('kuning')) {
          themeData.backgroundColor = '#fefce8';
          msg = 'Warna latar website diubah menjadi krem hangat.';
        } else if (text.includes('putih')) {
          themeData.backgroundColor = '#ffffff';
          msg = 'Warna latar website diubah menjadi putih bersih.';
        } else if (text.includes('abu') || text.includes('terang')) {
          themeData.backgroundColor = '#f8fafc';
          msg = 'Warna latar website diubah menjadi abu-abu modern.';
        } else if (text.includes('hitam') || text.includes('gelap')) {
          themeData.backgroundColor = '#0f172a';
          themeData.headingColor = '#fbbf24';
          themeData.textColor = '#cbd5e1';
          msg = 'Warna latar website diubah menjadi gelap eksklusif.';
        }
      }

      // Deteksi Font
      if (text.includes('font') || text.includes('huruf')) {
        if (text.includes('poppins')) {
          themeData.headingFont = 'Poppins';
          themeData.bodyFont = 'Poppins';
          msg = 'Jenis font website diubah menjadi Poppins (Modern & Rapi).';
        } else if (text.includes('playfair')) {
          themeData.headingFont = 'Playfair Display';
          msg = 'Jenis font judul diubah menjadi Playfair Display (Elegan).';
        } else if (text.includes('inter')) {
          themeData.headingFont = 'Inter';
          themeData.bodyFont = 'Inter';
          msg = 'Jenis font website diubah menjadi Inter (Minimalis).';
        } else if (text.includes('lora')) {
          themeData.headingFont = 'Lora';
          themeData.bodyFont = 'Lora';
          msg = 'Jenis font website diubah menjadi Lora (Serif Anggun).';
        } else if (text.includes('jakarta')) {
          themeData.headingFont = 'Plus Jakarta Sans';
          themeData.bodyFont = 'Plus Jakarta Sans';
          msg = 'Jenis font website diubah menjadi Plus Jakarta Sans.';
        }
      }

      if (Object.keys(themeData).length > 0) {
        return {
          success: true,
          data: {
            action: 'UPDATE_THEME',
            themeData: themeData,
            message: msg
          },
          source: 'OFFLINE_MOCK'
        };
      }
    }

    // 1. TAMBAH ITEM / PRODUK / MENU
    const isAddItem = 
      text.includes('tambah item') || 
      text.includes('item baru') || 
      text.includes('tambah menu') || 
      text.includes('tambah produk') || 
      text.includes('tambah makanan') || 
      text.includes('tambah minuman') || 
      text.includes('tambah barang') || 
      (text.includes('tambah') && (text.includes('harga') || text.includes('seharga') || text.includes('rp')));

    if (isAddItem) {
      // Ekstrak angka harga jika ada
      const numbers = text.match(/\d+[\d.]*/g);
      let price = 25000;
      if (numbers && numbers.length > 0) {
        price = parseInt(numbers[0].replace(/\./g, ''), 10);
      }

      // Bersihkan nama item dari frasa trigger
      let rawName = prompt
        .replace(/tambah\s+(?:item\s+baru|item|menu\s+baru|menu|produk\s+baru|produk|barang|makanan|minuman)?/i, '')
        .split(/(?:harga|seharga|rp|\d)/i)[0]
        .replace(/['":]/g, '')
        .trim();

      if (!rawName) rawName = 'Menu Baru Spesial';

      const isDrink = text.includes('minum') || text.includes('es') || text.includes('jus') || text.includes('teh') || text.includes('kopi');

      return {
        success: true,
        data: {
          action: 'MANAGE_PRODUCT',
          productOperation: 'ADD',
          productData: {
            name: rawName,
            price: price,
            category: isDrink ? 'Minuman Segar' : 'Makanan Utama'
          }
        },
        source: 'OFFLINE_MOCK'
      };
    }

    // 2. Ganti judul / nama toko (UPDATE HERO)
    if (text.includes('ganti judul') || text.includes('ubah nama toko') || text.includes('ubah judul') || text.includes('nama warung') || text.includes('ganti nama usaha')) {
      const parts = prompt.split(/(?:jadi|ke|menjadi)\s+/i);
      const newTitle = parts.length > 1 ? parts[1].trim().replace(/['"]/g, '') : prompt;
      return {
        success: true,
        data: {
          action: 'UPDATE_SECTION',
          targetId: '',
          sectionData: {
            type: 'HERO',
            title: newTitle,
            subtitle: 'Pilihan Rasa Terbaik untuk Keluarga',
            content: '',
            orderIndex: 1
          }
        },
        source: 'OFFLINE_MOCK'
      };
    }

    // 3. Ubah slogan / subjudul
    if (text.includes('slogan') || text.includes('subjudul') || text.includes('moto') || text.includes('semboyan')) {
      const parts = prompt.split(/(?:jadi|ke|menjadi)\s+/i);
      const newSub = parts.length > 1 ? parts[1].trim().replace(/['"]/g, '') : 'Rasa Nikmat, Harga Pas di Kantong';
      return {
        success: true,
        data: {
          action: 'UPDATE_SECTION',
          targetId: '',
          sectionData: {
            type: 'HERO',
            subtitle: newSub
          }
        },
        source: 'OFFLINE_MOCK'
      };
    }

    // 4. Hapus bagian (DELETE_SECTION)
    if (text.includes('hapus') || text.includes('buang') || text.includes('hilangkan')) {
      let typeToDelete = 'CONTACT';
      if (text.includes('kontak') || text.includes('hubungi') || text.includes('alamat')) typeToDelete = 'CONTACT';
      else if (text.includes('tentang') || text.includes('about') || text.includes('profil')) typeToDelete = 'ABOUT';
      else if (text.includes('katalog') || text.includes('menu') || text.includes('produk') || text.includes('item')) typeToDelete = 'CATALOG';
      else if (text.includes('footer') || text.includes('bawah')) typeToDelete = 'FOOTER';
      else if (text.includes('hero') || text.includes('atas')) typeToDelete = 'HERO';

      return {
        success: true,
        data: {
          action: 'DELETE_SECTION',
          targetId: '',
          sectionData: {
            type: typeToDelete
          }
        },
        source: 'OFFLINE_MOCK'
      };
    }

    // 5. Tambah bagian baru (ADD_SECTION)
    if (text.includes('tambah') || text.includes('buatkan bagian') || text.includes('pasang')) {
      let newType = 'ABOUT';
      let title = 'Informasi Tambahan';
      let content = prompt;

      if (text.includes('tentang') || text.includes('sejarah') || text.includes('profil')) {
        newType = 'ABOUT';
        title = 'Tentang Usaha Kami';
      } else if (text.includes('kontak') || text.includes('lokasi') || text.includes('wa')) {
        newType = 'CONTACT';
        title = 'Hubungi Warung Kami';
      } else if (text.includes('katalog') || text.includes('daftar')) {
        newType = 'CATALOG';
        title = 'Daftar Menu & Produk';
      }

      return {
        success: true,
        data: {
          action: 'ADD_SECTION',
          sectionData: {
            type: newType,
            title: title,
            subtitle: 'Pelayanan terbaik untuk pelanggan',
            content: content
          }
        },
        source: 'OFFLINE_MOCK'
      };
    }

    // Default update HERO dengan teks dari prompt
    return {
      success: true,
      data: {
        action: 'UPDATE_SECTION',
        sectionData: {
          type: 'HERO',
          content: prompt
        }
      },
      source: 'OFFLINE_MOCK'
    };

  } catch (err) {
    console.error('Error di fallbackOfflineInterpreter:', err);
    return {
      success: false,
      error: 'Layanan AI sedang sibuk. Silakan coba perintah Anda beberapa saat lagi.',
      source: 'ERROR'
    };
  }
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    CONFIG_GEMINI,
    sendPromptToGemini,
    fallbackOfflineInterpreter,
    getActiveGeminiApiKey,
    setActiveGeminiApiKey
  };
}
