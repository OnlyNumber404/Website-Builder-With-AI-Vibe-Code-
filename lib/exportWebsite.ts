import JSZip from 'jszip';
import { SectionItem, ProductItem, DesignTheme, DesignTemplate, NavLinkItem } from '@/lib/types';

/**
 * Pembersih nomor telepon Indonesia untuk tautan wa.me
 */
function cleanPhoneNumber(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('0')) {
    return '62' + digits.slice(1);
  }
  return digits || '6281234567890';
}

/**
 * Escape karakter HTML agar teks kustom pengguna aman dirender
 */
function escapeHtml(text: string): string {
  return (text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Generate CSS Mandiri (style.css) yang valid, responsif, dan sesuai persis dengan tema Studio
 */
export function generateWebsiteCss(theme: DesignTheme, design?: DesignTemplate): string {
  const cardVariant = design?.styleConfig?.cardVariant || 'modern-rounded';
  const cardBorderRadius =
    cardVariant === 'cafe-handcrafted' ? '1.25rem' : cardVariant === 'bold-compact' ? '0.85rem' : '1rem';
  const cardBorderStyle =
    cardVariant === 'cafe-handcrafted'
      ? `2px dashed ${theme.primaryColor}55`
      : cardVariant === 'bold-compact'
      ? `2px solid rgba(239, 68, 68, 0.3)`
      : `1px solid ${theme.primaryColor}25`;

  return `/* ==========================================================================
   NexaWeb.ai - Generated Standalone Website Stylesheet
   Tema: ${theme.name}
   Font Judul: ${theme.headingFont} | Font Teks: ${theme.bodyFont}
   ========================================================================== */

@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&family=Inter:wght@400;500;600;700;800&family=Space+Grotesk:wght@600;700&family=Montserrat:wght@500;600;700;800&family=Merriweather:wght@400;700;900&display=swap');

:root {
  --primary: ${theme.primaryColor};
  --secondary: ${theme.secondaryColor};
  --bg-color: ${theme.backgroundColor};
  --text-color: ${theme.textColor};
  --heading-color: ${theme.headingColor};
  --card-bg: ${theme.cardBackground || '#ffffff'};
  --font-heading: '${theme.headingFont}', serif;
  --font-body: '${theme.bodyFont}', sans-serif;
  --card-radius: ${cardBorderRadius};
  --card-border: ${cardBorderStyle};
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  scroll-behavior: smooth;
  font-family: var(--font-body);
  background-color: var(--bg-color);
  color: var(--text-color);
  line-height: 1.6;
  overflow-x: hidden;
}

body {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-family: var(--font-body);
  overflow-x: hidden;
}

header,
section,
footer {
  display: block;
  width: 100%;
  flex-shrink: 0;
}

.container {
  width: 100%;
  max-width: 960px;
  margin-left: auto;
  margin-right: auto;
  padding-left: 1.5rem;
  padding-right: 1.5rem;
}

/* TYPOGRAPHY */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--heading-color);
  line-height: 1.2;
  font-weight: 800;
}

a {
  color: inherit;
  text-decoration: none;
}

/* BUTTONS */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.8rem 1.75rem;
  font-size: 0.9rem;
  font-weight: 800;
  border-radius: 0.85rem;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease, box-shadow 0.2s ease;
  border: 1px solid transparent;
  text-decoration: none;
  line-height: 1.2;
}

.btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 10px 22px -6px rgba(0, 0, 0, 0.16);
}

.btn-primary {
  background-color: var(--primary);
  color: #ffffff;
  box-shadow: 0 8px 18px -4px rgba(0, 0, 0, 0.18);
}

.btn-primary:hover {
  opacity: 0.92;
}

.btn-outline {
  background-color: #ffffff;
  color: var(--primary);
  border: 1.5px solid var(--primary);
}

.btn-outline:hover {
  background-color: rgba(0, 0, 0, 0.03);
}

.btn-danger {
  background-color: #dc2626;
  color: #ffffff;
  font-weight: 900;
}

.btn-danger:hover {
  background-color: #b91c1c;
}

.btn-whatsapp {
  background-color: var(--primary);
  color: #ffffff;
  padding: 0.95rem 2rem;
  border-radius: 1rem;
  font-weight: 800;
  box-shadow: 0 12px 24px -6px rgba(0, 0, 0, 0.2);
}

section[id] {
  scroll-margin-top: 76px;
}

/* 1. NAVBAR */
.navbar {
  position: sticky;
  top: 0;
  z-index: 100;
  min-height: 76px;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.94);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(15, 23, 42, 0.08);
  padding: 0.9rem 0;
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
  flex-wrap: wrap;
}

.brand-wrap {
  display: flex;
  flex-direction: column;
}

.brand-title {
  font-family: var(--font-heading);
  font-size: 1.25rem;
  font-weight: 900;
  color: var(--heading-color);
  letter-spacing: -0.02em;
}

.brand-subtitle {
  font-size: 0.75rem;
  opacity: 0.72;
  margin-top: 0.1rem;
}

.nav-links {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  list-style: none;
  flex-wrap: wrap;
}

.nav-link {
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--primary);
  transition: opacity 0.2s ease;
  white-space: nowrap;
}

.nav-link:hover {
  opacity: 0.75;
}

/* 2. HERO SECTION (FULL LAYAR DI BERANDA TANPA POTONGAN BAGIAN LAIN) */
.hero-section {
  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 3.5rem 0 4.5rem;
  text-align: center;
  background: radial-gradient(circle at 50% 0%, ${theme.primaryColor}0e 0%, transparent 70%);
}

.hero-section--bold {
  background: linear-gradient(180deg, rgba(239, 68, 68, 0.08) 0%, transparent 100%);
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.35rem 0.9rem;
  font-size: 0.72rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  border-radius: 9999px;
  background-color: ${theme.primaryColor}18;
  color: var(--primary);
  border: 1px solid ${theme.primaryColor}45;
  margin-bottom: 1.5rem;
}

.hero-badge--bold {
  background-color: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

.hero-title {
  font-size: 3.15rem;
  letter-spacing: -0.03em;
  margin-bottom: 1.15rem;
  max-width: 780px;
  margin-left: auto;
  margin-right: auto;
}

.hero-subtitle {
  font-size: 1.08rem;
  opacity: 0.88;
  max-width: 600px;
  margin: 0 auto 2.25rem;
  line-height: 1.7;
}

.hero-cta {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.85rem;
  flex-wrap: wrap;
}

.hero-split-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
  text-align: left;
}

.hero-split-grid .hero-title,
.hero-split-grid .hero-subtitle {
  margin-left: 0;
  margin-right: 0;
}

.hero-split-grid .hero-cta {
  justify-content: flex-start;
}

@media (min-width: 768px) {
  .hero-split-grid {
    grid-template-columns: 7fr 5fr;
  }
}

.hero-highlight-card {
  background-color: var(--card-bg);
  border: 2px dashed ${theme.primaryColor}45;
  border-radius: 1.5rem;
  padding: 1.75rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.hero-highlight-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background-color: var(--primary);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
}

/* 3. ABOUT SECTION */
.about-section {
  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4.5rem 0;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background-color: rgba(15, 23, 42, 0.015);
}

.about-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  align-items: center;
}

@media (min-width: 768px) {
  .about-grid {
    grid-template-columns: 5fr 7fr;
  }
}

.about-feature-card {
  background-color: var(--card-bg);
  border: var(--card-border);
  border-radius: 1.5rem;
  padding: 1.75rem;
  text-align: center;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.about-feature-icon {
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 1rem;
  background-color: var(--primary);
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.85rem;
  box-shadow: 0 6px 14px -3px rgba(0, 0, 0, 0.18);
}

.about-feature-title {
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 0.45rem;
}

.about-feature-desc {
  font-size: 0.8rem;
  opacity: 0.82;
  line-height: 1.6;
}

.section-eyebrow {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--primary);
  margin-bottom: 0.5rem;
}

.section-title {
  font-size: 1.85rem;
  margin-bottom: 0.5rem;
}

.section-subtitle {
  font-size: 0.95rem;
  font-weight: 600;
  opacity: 0.85;
  margin-bottom: 0.75rem;
}

.about-content {
  font-size: 0.92rem;
  opacity: 0.85;
  line-height: 1.75;
  white-space: pre-line;
}

/* 4. CATALOG SECTION */
.catalog-section {
  min-height: calc(100vh - 76px);
  min-height: calc(100dvh - 76px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 5rem 0;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto 2.25rem;
}

.products-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.25rem;
}

@media (min-width: 640px) {
  .products-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

.product-card {
  background-color: var(--card-bg);
  border: var(--card-border);
  border-radius: var(--card-radius);
  padding: 1.15rem 1.25rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.product-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.12);
}

.product-category {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
  background-color: ${theme.primaryColor}18;
  color: var(--primary);
  border: 1px solid ${theme.primaryColor}38;
  margin-bottom: 0.6rem;
}

.product-category--bold {
  background-color: #dc2626;
  color: #ffffff;
  border-color: #dc2626;
}

.product-name {
  font-size: 1rem;
  font-weight: 800;
  margin-bottom: 0.85rem;
  color: var(--heading-color);
}

.product-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(15, 23, 42, 0.08);
}

.product-price {
  font-size: 1.05rem;
  font-weight: 900;
  color: var(--primary);
}

.btn-buy {
  padding: 0.45rem 0.9rem;
  font-size: 0.75rem;
  font-weight: 800;
  border-radius: 9999px;
  background-color: #16a34a;
  color: #ffffff;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: background-color 0.2s ease;
  white-space: nowrap;
}

.btn-buy:hover {
  background-color: #15803d;
}

/* 5. CONTACT SECTION */
.contact-section {
  min-height: calc(100vh - 190px);
  min-height: calc(100dvh - 190px);
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 4.5rem 0;
  border-top: 1px solid rgba(15, 23, 42, 0.06);
  background-color: rgba(15, 23, 42, 0.015);
  text-align: center;
}

.contact-card {
  background-color: var(--card-bg);
  border: var(--card-border);
  border-radius: 1.25rem;
  padding: 1.75rem;
  max-width: 640px;
  margin: 0 auto 1.75rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
}

.contact-card-label {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-weight: 800;
  font-size: 0.85rem;
  color: var(--primary);
  margin-bottom: 0.6rem;
}

.contact-info {
  font-size: 0.92rem;
  line-height: 1.7;
  opacity: 0.9;
  white-space: pre-line;
}

.wa-preview-note {
  margin-top: 0.85rem;
  font-size: 0.75rem;
  color: #64748b;
}

/* 6. FOOTER */
.footer {
  margin-top: auto;
  padding: 2.5rem 0;
  background-color: #0f172a;
  color: #94a3b8;
  font-size: 0.8rem;
}

.footer-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  align-items: center;
  text-align: center;
}

@media (min-width: 640px) {
  .footer-container {
    flex-direction: row;
    justify-content: space-between;
    text-align: left;
  }
}

.footer-title {
  color: #ffffff;
  font-size: 0.95rem;
  font-weight: 800;
  margin-bottom: 0.2rem;
}

.footer-sub {
  font-size: 0.75rem;
  color: #94a3b8;
}

.footer-credit {
  font-size: 0.75rem;
  color: #64748b;
}

/* RESPONSIVE MEDIA QUERIES */
@media (max-width: 639px) {
  section[id] {
    scroll-margin-top: 108px;
  }
  .hero-section,
  .about-section,
  .catalog-section {
    min-height: calc(100vh - 108px);
    min-height: calc(100dvh - 108px);
    padding: 3rem 0;
  }
  .hero-title {
    font-size: 2.1rem;
  }
  .section-title {
    font-size: 1.55rem;
  }
  .nav-links {
    gap: 0.85rem;
  }
}
`;
}

/**
 * Generate File index.html Mandiri yang siap dijalankan di browser
 */
export function generateWebsiteHtml(
  sections: SectionItem[],
  products: ProductItem[],
  theme: DesignTheme,
  design?: DesignTemplate
): string {
  const navSection = sections.find((s) => s.type === 'NAVBAR');
  const contactSection = sections.find((s) => s.type === 'CONTACT');
  const storeName = navSection?.title || 'Toko Saya';

  const rawPhone =
    (contactSection?.content || '').match(/(?:WhatsApp|WA|Telepon|Telp|No\.?):\s*([0-9+\-\s]+)/i)?.[1] ||
    '0812-3456-7890';
  const cleanPhone = cleanPhoneNumber(rawPhone);

  const heroVariant = design?.styleConfig?.heroVariant || 'modern-centered';
  const cardVariant = design?.styleConfig?.cardVariant || 'modern-rounded';
  const catalogEyebrow = design?.styleConfig?.accentLabel || 'Pilihan Menu Favorit';

  // Melacak agar id anchor standar (#hero, #about, #catalog, #contact) dipasang di elemen pertama tiap tipe
  const assignedIds = new Set<string>();
  const getAnchorId = (type: string, fallbackId: string) => {
    const key = type.toLowerCase();
    if (!assignedIds.has(key)) {
      assignedIds.add(key);
      return key;
    }
    return fallbackId;
  };

  const renderedSectionsHtml = sections
    .map((section) => {
      switch (section.type) {
        case 'NAVBAR': {
          let links: NavLinkItem[] = [];
          try {
            const parsed = JSON.parse(section.content);
            if (Array.isArray(parsed)) links = parsed;
          } catch {}

          if (links.length === 0) {
            links = [
              { label: 'Beranda', target: '#hero' },
              { label: 'Tentang Kami', target: '#about' },
              { label: 'Daftar Menu', target: '#catalog' },
              { label: 'Kontak', target: '#contact' }
            ];
          }

          return `
  <!-- NAVBAR -->
  <header class="navbar">
    <div class="container nav-container">
      <div class="brand-wrap">
        <a href="#hero" class="brand-title">${escapeHtml(section.title || storeName)}</a>
        ${section.subtitle ? `<span class="brand-subtitle">${escapeHtml(section.subtitle)}</span>` : ''}
      </div>
      <nav aria-label="Navigasi Utama">
        <ul class="nav-links">
          ${links
            .map(
              (l) =>
                `<li><a href="${escapeHtml(l.target || '#hero')}" class="nav-link">${escapeHtml(l.label)}</a></li>`
            )
            .join('\n          ')}
        </ul>
      </nav>
    </div>
  </header>`;
        }

        case 'HERO': {
          const secId = getAnchorId('hero', section.id);
          const badgeText = escapeHtml(theme.accentBadge || 'Pilihan Utama UMKM');
          const title = escapeHtml(section.title || 'Selamat Datang di Toko Kami');
          const subtitle = escapeHtml(
            section.subtitle || 'Kami menyajikan produk & layanan terbaik untuk kepuasan Anda.'
          );

          if (heroVariant === 'split-classic') {
            return `
  <!-- HERO SECTION (SPLIT CLASSIC) -->
  <section id="${secId}" class="hero-section">
    <div class="container">
      <div class="hero-split-grid">
        <div>
          <span class="hero-badge">☕ ${badgeText}</span>
          <h1 class="hero-title">${title}</h1>
          <p class="hero-subtitle">${subtitle}</p>
          <div class="hero-cta">
            <a href="#catalog" class="btn btn-primary">Lihat Racikan Menu</a>
            <a href="#contact" class="btn btn-outline">Reservasi &amp; Kontak</a>
          </div>
        </div>
        <div class="hero-highlight-card">
          <div class="hero-highlight-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" x2="6" y1="2" y2="4"/><line x1="10" x2="10" y1="2" y2="4"/><line x1="14" x2="14" y1="2" y2="4"/></svg>
          </div>
          <h3 style="font-size: 1.05rem; margin-bottom: 0.45rem;">Seduh Hangat Setiap Hari</h3>
          <p style="font-size: 0.82rem; opacity: 0.8;">Pilihan terbaik dan sajian racikan istimewa untuk menemani hari santai Anda.</p>
        </div>
      </div>
    </div>
  </section>`;
          }

          if (heroVariant === 'bold-impact') {
            return `
  <!-- HERO SECTION (BOLD IMPACT) -->
  <section id="${secId}" class="hero-section hero-section--bold">
    <div class="container">
      <span class="hero-badge hero-badge--bold">🔥 ${badgeText}</span>
      <h1 class="hero-title">${title}</h1>
      <p class="hero-subtitle">${subtitle}</p>
      <div class="hero-cta">
        <a href="#catalog" class="btn btn-danger">PESAN SEKARANG</a>
        <a href="#contact" class="btn btn-outline">WhatsApp Kasir</a>
      </div>
    </div>
  </section>`;
          }

          return `
  <!-- HERO SECTION -->
  <section id="${secId}" class="hero-section">
    <div class="container">
      <span class="hero-badge">${badgeText}</span>
      <h1 class="hero-title">${title}</h1>
      <p class="hero-subtitle">${subtitle}</p>
      <div class="hero-cta">
        <a href="#catalog" class="btn btn-primary">Lihat Menu Pilihan</a>
        <a href="#contact" class="btn btn-outline">Hubungi Pemesanan</a>
      </div>
    </div>
  </section>`;
        }

        case 'ABOUT': {
          const secId = getAnchorId('about', section.id);
          return `
  <!-- ABOUT SECTION -->
  <section id="${secId}" class="about-section">
    <div class="container">
      <div class="about-grid">
        <div class="about-feature-card">
          <div class="about-feature-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/></svg>
          </div>
          <h4 class="about-feature-title">Resep Khas &amp; Higienis</h4>
          <p class="about-feature-desc">Diolah setiap hari dengan bahan pilihan segar dan kualitas terbaik untuk kepuasan pelanggan.</p>
        </div>

        <div>
          <span class="section-eyebrow">Cerita Kami</span>
          <h2 class="section-title">${escapeHtml(section.title || 'Tentang Usaha Kami')}</h2>
          ${section.subtitle ? `<p class="section-subtitle">${escapeHtml(section.subtitle)}</p>` : ''}
          <p class="about-content">${escapeHtml(
            section.content ||
              'Kami berdedikasi menghadirkan produk berkualitas tinggi yang dibuat dengan bahan-bahan pilihan dan penuh cinta.'
          )}</p>
        </div>
      </div>
    </div>
  </section>`;
        }

        case 'CATALOG': {
          const secId = getAnchorId('catalog', section.id);
          return `
  <!-- CATALOG SECTION -->
  <section id="${secId}" class="catalog-section">
    <div class="container">
      <div class="section-header">
        <span class="section-eyebrow" style="color: var(--secondary);">${escapeHtml(catalogEyebrow)}</span>
        <h2 class="section-title">${escapeHtml(section.title || 'Daftar Menu & Produk')}</h2>
        <p class="section-subtitle">${escapeHtml(
          section.subtitle || 'Pilihan terfavorit yang siap diantar langsung ke rumah Anda'
        )}</p>
      </div>
      <div class="products-grid">
        ${products
          .map((prod) => {
            const waOrderMsg = `Halo ${storeName}, saya ingin memesan menu *${prod.name}* (Rp ${prod.price.toLocaleString(
              'id-ID'
            )}). Mohon infonya, terima kasih!`;
            const waOrderUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(waOrderMsg)}`;
            const catClass = cardVariant === 'bold-compact' ? 'product-category product-category--bold' : 'product-category';
            const catLabel =
              cardVariant === 'bold-compact'
                ? '🔥 TERLARIS'
                : cardVariant === 'cafe-handcrafted'
                ? `☕ ${prod.category || 'Racikan Kedai'}`
                : prod.category || 'Menu';

            return `
        <article class="product-card">
          <div>
            <span class="${catClass}">${escapeHtml(catLabel)}</span>
            <h3 class="product-name">${escapeHtml(prod.name)}</h3>
          </div>
          <div class="product-bottom">
            <div class="product-price">Rp ${prod.price.toLocaleString('id-ID')}</div>
            <a href="${waOrderUrl}" target="_blank" rel="noopener noreferrer" class="btn-buy" title="Pesan langsung via WhatsApp">
              <span>Pesan WA</span>
            </a>
          </div>
        </article>`;
          })
          .join('')}
      </div>
    </div>
  </section>`;
        }

        case 'CONTACT': {
          const secId = getAnchorId('contact', section.id);
          const customMsg =
            section.waMessage || `Halo ${storeName}, saya ingin memesan produk dari website Anda.`;
          const waUrl = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(customMsg)}`;
          const cleanInfo = (section.content || '').replace(/Pesan:[^|]+/i, '').trim();
          const infoParts = (cleanInfo || `WhatsApp: ${rawPhone} | Buka Setiap Hari (08.00 - 20.00 WIB)`)
            .split('|')
            .map((part) => part.trim())
            .filter(Boolean);

          return `
  <!-- CONTACT SECTION -->
  <section id="${secId}" class="contact-section">
    <div class="container">
      <div class="section-header" style="margin-bottom: 1.5rem;">
        <span class="section-eyebrow">Layanan Pelanggan</span>
        <h2 class="section-title">${escapeHtml(section.title || 'Pemesanan & Lokasi Toko')}</h2>
        <p class="section-subtitle">${escapeHtml(
          section.subtitle || 'Hubungi kami langsung untuk pemesanan cepat via WhatsApp'
        )}</p>
      </div>
      <div class="contact-card">
        <div class="contact-card-label">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
          <span>Informasi Alamat &amp; Jadwal:</span>
        </div>
        <div class="contact-info">
          ${infoParts.map((part) => `<p style="margin-bottom: 0.35rem;">${escapeHtml(part)}</p>`).join('\n          ')}
        </div>
      </div>
      <a href="${waUrl}" target="_blank" rel="noopener noreferrer" class="btn btn-whatsapp">
        <span>💬 Chat Langsung via WhatsApp</span>
      </a>
      <p class="wa-preview-note">
        Pesan otomatis: &ldquo;<em>${escapeHtml(customMsg)}</em>&rdquo;
      </p>
    </div>
  </section>`;
        }

        case 'FOOTER': {
          return `
  <!-- FOOTER -->
  <footer class="footer">
    <div class="container footer-container">
      <div>
        <h4 class="footer-title">${escapeHtml(section.title || storeName)}</h4>
        <p class="footer-sub">${escapeHtml(
          section.subtitle || `Hak Cipta © ${new Date().getFullYear()} ${storeName}. Seluruh hak cipta dilindungi.`
        )}</p>
      </div>
      <div class="footer-credit">
        <p>${escapeHtml(section.content || 'Website dibuat praktis dengan NexaWeb.ai')}</p>
      </div>
    </div>
  </footer>`;
        }

        default:
          return '';
      }
    })
    .filter(Boolean)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="Website resmi ${escapeHtml(storeName)} - Pesan langsung via WhatsApp">
  <title>${escapeHtml(storeName)} - Website Resmi</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
${renderedSectionsHtml}

  <script>
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var targetId = this.getAttribute('href');
        if (!targetId || targetId === '#') return;
        var targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          targetEl.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  </script>
</body>
</html>`;
}

/**
 * Generate README.txt yang informatif dan ramah pengguna
 */
export function generateReadmeText(storeName: string): string {
  return `================================================================================
WEBSITE TOKO RESMI: ${storeName.toUpperCase()}
Dibuat secara otomatis dengan NexaWeb.ai - Solusi Website Praktis UMKM
================================================================================

Terima kasih telah menggunakan NexaWeb.ai!
Paket file ini berisi kode website utuh yang siap Anda gunakan atau pasang online.

DAFTAR FILE:
1. index.html   : Berkas utama halaman website toko Anda.
2. style.css    : Gaya tata letak, warna palet tema, dan tipografi responsif.
3. README.txt   : Petunjuk pemakaian ini.

CARA MEMBUKA / MENGECEK WEBSITE SECARA LOKAL:
- Ekstrak semua file dari ZIP ke dalam 1 folder yang sama.
- Klik dua kali (double click) pada file "index.html".
- Website toko Anda akan langsung terbuka di browser (Chrome, Edge, Safari, dll.)
- Seluruh tombol WhatsApp sudah otomatis terhubung ke nomor toko Anda!

CARA MENERBITKAN (DEPLOY) KE INTERNET SECARA GRATIS:
Opsi 1: Netlify Drop (Paling Mudah, Gratis & Instan)
  1. Buka browser dan pergi ke https://app.netlify.com/drop
  2. Seret (drag & drop) folder hasil extract zip ini ke kotak Netlify.
  3. Dalam 5 detik, website toko Anda langsung live dan memiliki link URL online!

Opsi 2: Vercel / GitHub Pages / Hosting Sendiri
  - Unggah file index.html dan style.css ke hosting cPanel, Vercel,
    GitHub Pages, atau shared hosting pilihan Anda.

Salam sukses untuk usaha Anda!
Tim NexaWeb.ai
`;
}

/**
 * Fungsi utama: Membuat ZIP dan otomatis mengunduhnya ke perangkat pengguna
 */
export async function downloadWebsiteZip(
  sections: SectionItem[],
  products: ProductItem[],
  theme: DesignTheme,
  design?: DesignTemplate
): Promise<string> {
  const navSection = sections.find((s) => s.type === 'NAVBAR');
  const storeName = navSection?.title || 'Toko-UMKM';
  const cleanFileName =
    storeName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '') || 'website-toko';

  const htmlContent = generateWebsiteHtml(sections, products, theme, design);
  const cssContent = generateWebsiteCss(theme, design);
  const readmeContent = generateReadmeText(storeName);

  const zip = new JSZip();
  zip.file('index.html', htmlContent);
  zip.file('style.css', cssContent);
  zip.file('README.txt', readmeContent);

  const blob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 9 }
  });

  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = `${cleanFileName}-website.zip`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);

  return `${cleanFileName}-website.zip`;
}
