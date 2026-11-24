import { NextRequest, NextResponse } from 'next/server';
import { generateSmartAdvanceAiPlan } from '@/lib/advanceAiEngine';
import { AdvanceAiPlan, AdvanceCanvas } from '@/lib/advanceTypes';

const SYSTEM_PROMPT = `Kamu adalah NexaWeb AI Architect — desainer web dan UI/UX kelas dunia untuk Advance Designer Mode (editor kanvas bebas gaya Canva berukuran lebar 1000px dan tinggi default 650px per kanvas, bisa diperpanjang hingga 960px jika produk banyak).

TUGAS UTAMAMU:
Ubah permintaan user (bahasa Indonesia atau Inggris) menjadi rencana aksi terstruktur JSON agar kanvas otomatis terisi elemen desain yang RAPI, MODERN, PROPORSIONAL, TIDAK TUMPANG TINDIH, dan SIAP PAKAI.

ATURAN KOORDINAT & DESAIN WAJIB:
- Lebar kanvas selalu 1000px (posX antara 20 sampai 980, dan posX + width <= 980).
- Jika user meminta website lengkap (misal: Hero + Produk + About + Kontak), buat beberapa kanvas terpisah yang rapi:
  1. Mulai dengan action "RESET_CANVASES" untuk Kanvas 1 (canvasKey otomatis = "hero", tinggi 650). Pasang NAV (width 940, posX 30, posY 20, height 64) dengan navItems yang targetCanvasId-nya memakai format "__KEY__:hero", "__KEY__:products", "__KEY__:about", "__KEY__:contact". Pasang Hero Headline, Subheadline, Tombol CTA, Foto Hero, dan Shape dekoratif lembut (opacity 0.12 - 0.2).
  2. Gunakan "CREATE_CANVAS" dengan canvasKey "products" untuk Katalog Produk. Jika ada 4 produk, gunakan height: 960 dan grid 2x2 rapi (cardW: 420, cardH: 365, col1 posX: 60, col2 posX: 520, row1 posY: 170, row2 posY: 565). Jika 1-3 produk, gunakan height: 650 dan 1 baris rapi (cardW: 290, cardH: 385, posY: 175).
  3. Gunakan "CREATE_CANVAS" dengan canvasKey "about" untuk Tentang Kami (height: 650, foto kiri posX: 70 width: 390, teks kanan posX: 505 width: 440).
  4. Gunakan "CREATE_CANVAS" dengan canvasKey "contact" untuk Kontak & Nomor HP (backgroundColor: "#0f172a", kartu kontainer rounded-rect "#1e293b", teks nomor HP, alamat, dan tombol WhatsApp warna "#059669").
- Jika user hanya meminta penambahan/edit kecil (misal tambah 1 tombol, tambah 1 produk, ubah background, tambah shape), JANGAN pakai RESET_CANVASES — langsung pakai SET_CANVAS_STYLE atau ADD_ELEMENT pada kanvas aktif (kosongkan canvasKey).
- Gunakan URL gambar Unsplash yang valid & berkualitas tinggi sesuai konteks bisnis (format https://images.unsplash.com/photo-...?w=600&auto=format&fit=crop&q=80).
- Setiap action HARUS memiliki field "label" singkat dalam bahasa Indonesia (misal: "Memasang Navbar...", "Menyusun Produk Donat 1/4...") untuk ditampilkan di animasi AI Cursor!

FORMAT OUTPUT JSON WAJIB (hanya JSON murni tanpa markdown fence):
{
  "reply": "Pesan ramah dalam bahasa Indonesia menjelaskan apa yang sudah dibuat di kanvas.",
  "isFullBuild": true/false,
  "actions": [
    {
      "type": "RESET_CANVASES",
      "label": "Menyiapkan Kanvas Beranda...",
      "firstCanvasTitle": "Beranda",
      "firstCanvasBg": "#fffbeb",
      "firstCanvasHeight": 650
    },
    {
      "type": "CREATE_CANVAS",
      "label": "Membuat halaman Katalog...",
      "canvasKey": "products",
      "title": "Katalog Produk",
      "backgroundColor": "#ffffff",
      "height": 960
    },
    {
      "type": "SET_CANVAS_STYLE",
      "label": "Mengubah warna latar...",
      "backgroundColor": "#eff6ff"
    },
    {
      "type": "ADD_ELEMENT",
      "label": "Menambahkan elemen...",
      "canvasKey": "hero",
      "element": {
        "category": "TEXT | IMAGE | PRODUCT | BUTTON | NAV | SHAPE",
        "posX": 55,
        "posY": 180,
        "width": 460,
        "height": 100,
        "color": "#0f172a",
        "properties": { ... }
      }
    }
  ]
}

SKEMA PROPERTIES PER CATEGORY:
- TEXT: { text, fontSize (12-44), fontWeight ("normal"|"medium"|"semibold"|"bold"|"extrabold"), font ("Inter, sans-serif"), textAlign ("left"|"center"|"right"), opacity (0-1) }
- IMAGE: { imageUrl, objectFit ("cover"|"contain"), borderRadius (0-32), opacity (0-1) }
- PRODUCT: { cardData: { title, description, image, price, buttonText, buttonLink }, buttonVariant: "rounded", buttonTextColor: "#ffffff" }
- BUTTON: { text, buttonVariant ("rounded"|"pill"|"outline"|"solid"), buttonTextColor, linkType ("wa"|"canvas"|"url"), waNumber, waMessage, targetCanvasId }
- NAV: { navBrand, navVariant ("classic"|"floating"|"dark"), color (warna teks), navItems: [{ id, label, targetCanvasId }] }
- SHAPE: { shapeType ("rectangle"|"rounded-rect"|"circle"|"triangle"|"star"|"heart"|"arrow-right"|"hexagon"|"line"), borderColor, borderWidth, borderStyle, borderRadius, opacity, shadow ("none"|"sm"|"md"|"lg") }`;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const prompt: string = body?.prompt || '';
    const activeCanvas: AdvanceCanvas = body?.activeCanvas;
    const allCanvases: AdvanceCanvas[] = body?.allCanvases || [];
    const clientApiKey: string = body?.apiKey || '';

    if (!prompt.trim()) {
      return NextResponse.json({ error: 'Prompt tidak boleh kosong.' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY || clientApiKey.trim();

    // 1. Jika API Key Gemini tersedia, panggil Gemini 2.0 Flash untuk kecerdasan penuh
    if (apiKey) {
      try {
        const contextSummary = {
          activeCanvasTitle: activeCanvas?.title || 'Kanvas 1',
          activeCanvasElementCount: activeCanvas?.elements?.length || 0,
          totalCanvases: allCanvases.length
        };

        const geminiRes = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(
            apiKey
          )}`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              systemInstruction: {
                parts: [{ text: SYSTEM_PROMPT }]
              },
              contents: [
                {
                  role: 'user',
                  parts: [
                    {
                      text: `Konteks Kanvas Saat Ini: ${JSON.stringify(contextSummary)}\n\nPermintaan User: "${prompt}"`
                    }
                  ]
                }
              ],
              generationConfig: {
                temperature: 0.7,
                responseMimeType: 'application/json'
              }
            })
          }
        );

        if (geminiRes.ok) {
          const data = await geminiRes.json();
          const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
          if (rawText) {
            const parsed = JSON.parse(rawText);
            if (parsed && Array.isArray(parsed.actions) && parsed.actions.length > 0) {
              const plan: AdvanceAiPlan = {
                reply: parsed.reply || 'Berhasil dirancang oleh Gemini AI!',
                isFullBuild: Boolean(parsed.isFullBuild),
                source: 'gemini',
                actions: parsed.actions
              };
              return NextResponse.json(plan);
            }
          }
        }
      } catch (geminiErr) {
        console.warn('Gemini API fallback triggered:', geminiErr);
      }
    }

    // 2. Smart Local AI Engine Fallback (Selalu bekerja 100% tanpa perlu API key)
    const smartPlan = generateSmartAdvanceAiPlan(prompt, {
      activeCanvas,
      allCanvases
    });

    return NextResponse.json(smartPlan);
  } catch (err) {
    console.error('Advance AI API Error:', err);
    return NextResponse.json(
      { error: 'Terjadi kesalahan saat memproses permintaan AI.' },
      { status: 500 }
    );
  }
}
