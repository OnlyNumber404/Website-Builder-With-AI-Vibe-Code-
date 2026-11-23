import JSZip from 'jszip';
import { AdvanceCanvas, CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT } from './advanceTypes';

export async function exportAdvanceWebsiteZip(canvases: AdvanceCanvas[]): Promise<void> {
  const zip = new JSZip();

  // Generate CSS
  const cssContent = `
/* NexaWeb Advance Designer Exported Stylesheet */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  background-color: #0f172a;
  color: #1e293b;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 100vh;
  padding: 0;
}

.canvas-viewport {
  width: 100%;
  max-width: ${CANVAS_DEFAULT_WIDTH}px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 0;
}

.canvas-page {
  position: relative;
  width: ${CANVAS_DEFAULT_WIDTH}px;
  height: auto;
  min-height: ${CANVAS_DEFAULT_HEIGHT}px;
  overflow: hidden;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
}

.canvas-element {
  position: absolute;
  box-sizing: border-box;
}

.btn-element {
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  text-decoration: none;
  font-weight: 700;
  transition: transform 0.15s ease, filter 0.15s ease;
}

.btn-element:hover {
  transform: translateY(-2px);
  filter: brightness(1.05);
}

.product-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
  border-radius: 1rem;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1.5rem;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
}

.nav-links {
  display: flex;
  gap: 1.25rem;
}

.nav-link {
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  color: inherit;
  transition: color 0.15s ease;
}

.nav-link:hover {
  color: #7c3aed;
}

@media (max-width: 1024px) {
  .canvas-viewport {
    transform: scale(0.85);
    transform-origin: top center;
  }
}

@media (max-width: 768px) {
  .canvas-viewport {
    transform: scale(0.55);
    transform-origin: top center;
  }
}
`;

  // Generate HTML
  let pagesHtml = '';

  canvases.forEach((canvas) => {
    let elementsHtml = '';

    canvas.elements.forEach((el) => {
      const { category, properties, color, posX, posY, width, height } = el;

      if (category === 'TEXT') {
        elementsHtml += `
          <div class="canvas-element" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; font-family: ${properties.font || 'inherit'}; font-size: ${properties.fontSize || 16}px; font-weight: ${properties.fontWeight || 'normal'}; text-align: ${properties.textAlign || 'center'}; color: ${color || '#000000'}; display: flex; align-items: center; justify-content: center; word-break: break-word;">
            ${properties.text || ''}
          </div>
        `;
      } else if (category === 'IMAGE') {
        elementsHtml += `
          <div class="canvas-element" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; border-radius: ${properties.borderRadius || 12}px; overflow: hidden;">
            <img src="${properties.imageUrl || ''}" alt="Gambar" style="width: 100%; height: 100%; object-fit: ${properties.objectFit || 'cover'};" />
          </div>
        `;
      } else if (category === 'PRODUCT' && properties.cardData) {
        const c = properties.cardData;
        elementsHtml += `
          <div class="canvas-element product-card" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; background-color: ${color || '#ffffff'};">
            <div style="width: 100%; height: 52%; border-radius: 0.75rem; overflow: hidden; background-color: #f1f5f9;">
              <img src="${c.image}" alt="${c.title}" style="width: 100%; height: 100%; object-fit: cover;" />
            </div>
            <div style="padding-top: 0.5rem; flex: 1; display: flex; flex-direction: column; justify-content: space-between;">
              <div>
                <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 0.5rem;">
                  <h4 style="font-size: 0.875rem; font-weight: 800; color: #0f172a; margin: 0;">${c.title}</h4>
                  <span style="font-size: 0.75rem; font-weight: 800; color: #047857; background: #ecfdf5; padding: 0.125rem 0.5rem; border-radius: 0.25rem;">${c.price || ''}</span>
                </div>
                <p style="font-size: 0.6875rem; color: #64748b; margin-top: 0.25rem; line-height: 1.3;">${c.description}</p>
              </div>
              <a href="${c.buttonLink || '#'}" target="_blank" style="display: block; width: 100%; padding: 0.5rem; text-align: center; border-radius: 0.75rem; background-color: #2563eb; color: #ffffff; font-size: 0.75rem; font-weight: 800; text-decoration: none;">
                ${c.buttonText || 'Pesan Sekarang'} &rarr;
              </a>
            </div>
          </div>
        `;
      } else if (category === 'BUTTON') {
        let href = '#';
        if (properties.linkType === 'canvas' && properties.targetCanvasId) {
          href = `#canvas-${properties.targetCanvasId}`;
        } else if (properties.linkType === 'wa' && properties.waNumber) {
          const cleanPhone = properties.waNumber.replace(/[^0-9]/g, '');
          const formattedPhone = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;
          href = `https://wa.me/${formattedPhone}?text=${encodeURIComponent(properties.waMessage || 'Halo, saya ingin memesan.')}`;
        } else if (properties.linkUrl) {
          href = properties.linkUrl;
        }

        let radius = '0.5rem';
        if (properties.buttonVariant === 'pill') radius = '9999px';
        else if (properties.buttonVariant === 'rounded') radius = '0.75rem';

        elementsHtml += `
          <a href="${href}" class="canvas-element btn-element" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; background-color: ${properties.buttonVariant === 'outline' ? 'transparent' : color || '#2563eb'}; color: ${properties.buttonTextColor || '#ffffff'}; border: ${properties.buttonVariant === 'outline' ? `2px solid ${color || '#0f172a'}` : 'none'}; border-radius: ${radius}; font-size: 0.875rem;">
            ${properties.text || 'Tombol'}
          </a>
        `;
      } else if (category === 'NAV') {
        const navLinks = (properties.navItems || [])
          .map(
            (item) =>
              `<a href="#canvas-${item.targetCanvasId || ''}" class="nav-link">${item.label}</a>`
          )
          .join('\n');

        let radius = '0.75rem';
        if (properties.navVariant === 'floating') radius = '9999px';

        elementsHtml += `
          <nav class="canvas-element navbar-container" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; background-color: ${color || '#ffffff'}; color: ${properties.color || '#0f172a'}; border-radius: ${radius};">
            <span style="font-weight: 800; font-size: 0.95rem;">${properties.navBrand || 'Toko Saya'}</span>
            <div class="nav-links">
              ${navLinks}
            </div>
          </nav>
        `;
      }
    });

    pagesHtml += `
      <!-- Kanvas ${canvas.pageIndex}: ${canvas.title || ''} -->
      <section id="canvas-${canvas.id}" class="canvas-page" style="background-color: ${canvas.backgroundColor || '#ffffff'}; ${canvas.backgroundImage ? `background-image: url('${canvas.backgroundImage}'); background-size: cover; background-position: center;` : ''}">
        ${elementsHtml}
      </section>
    `;
  });

  const fullHtml = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Website Resmi Toko</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
  <div class="canvas-viewport">
    ${pagesHtml}
  </div>
</body>
</html>`;

  zip.file('index.html', fullHtml);
  zip.file('styles.css', cssContent);

  const zipBlob = await zip.generateAsync({ type: 'blob' });
  const downloadUrl = URL.createObjectURL(zipBlob);
  const link = document.createElement('a');
  link.href = downloadUrl;
  link.download = `nexaweb-advance-website-${Date.now()}.zip`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(downloadUrl);
}
