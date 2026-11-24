import JSZip from 'jszip';
import { AdvanceCanvas, CANVAS_DEFAULT_WIDTH, CANVAS_DEFAULT_HEIGHT } from './advanceTypes';
import { getShapeClipPath, HEART_CLIP_PATH_D } from './advanceMaskUtils';

export async function exportAdvanceWebsiteZip(canvases: AdvanceCanvas[]): Promise<void> {
  const zip = new JSZip();

  // Generate CSS
  const cssContent = `
/* NexaWeb Advance Designer Exported Stylesheet */
html {
  scroll-behavior: smooth;
}
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
        const alignVal = properties.textAlign || 'center';
        const justifyVal = alignVal === 'left' ? 'flex-start' : alignVal === 'right' ? 'flex-end' : 'center';
        elementsHtml += `
          <div class="canvas-element" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; opacity: ${properties.opacity !== undefined ? properties.opacity : 1}; font-family: ${properties.font || 'inherit'}; font-size: ${properties.fontSize || 16}px; font-weight: ${properties.fontWeight || 'normal'}; text-align: ${alignVal}; color: ${color || '#000000'}; display: flex; align-items: center; justify-content: ${justifyVal}; word-break: break-word; line-height: 1.35;">
            <span style="width: 100%;">${properties.text || ''}</span>
          </div>
        `;
      } else if (category === 'SHAPE') {
        const shapeType = properties.shapeType || 'rectangle';
        const fillColor = color || '#2563eb';
        const borderColor = properties.borderWidth ? (properties.borderColor || '#0f172a') : 'transparent';
        const borderWidth = properties.borderWidth || 0;
        const borderStyle = properties.borderStyle || 'solid';
        const opacity = properties.opacity !== undefined ? properties.opacity : 1;
        const shadowFilter = properties.shadow === 'sm' ? 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))' : properties.shadow === 'md' ? 'drop-shadow(0 6px 14px rgba(0,0,0,0.16))' : properties.shadow === 'lg' ? 'drop-shadow(0 14px 26px rgba(0,0,0,0.24))' : 'none';

        let shapeInnerHtml = '';
        if (shapeType === 'circle') {
          shapeInnerHtml = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;"><ellipse cx="50" cy="50" rx="48" ry="48" fill="${fillColor}" stroke="${borderColor}" stroke-width="${borderWidth}" vector-effect="non-scaling-stroke" /></svg>`;
        } else if (shapeType === 'triangle') {
          shapeInnerHtml = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;"><polygon points="50,4 98,96 2,96" fill="${fillColor}" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke" /></svg>`;
        } else if (shapeType === 'star') {
          shapeInnerHtml = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;"><polygon points="50,3 63,36 98,36 70,58 81,93 50,72 19,93 30,58 2,36 37,36" fill="${fillColor}" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke" /></svg>`;
        } else if (shapeType === 'heart') {
          shapeInnerHtml = `<svg viewBox="0 0 24 24" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="${fillColor}" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke" /></svg>`;
        } else if (shapeType === 'arrow-right') {
          shapeInnerHtml = `<svg viewBox="0 0 100 60" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;"><polygon points="0,20 60,20 60,4 98,30 60,56 60,40 0,40" fill="${fillColor}" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke" /></svg>`;
        } else if (shapeType === 'hexagon') {
          shapeInnerHtml = `<svg viewBox="0 0 100 100" preserveAspectRatio="none" style="width: 100%; height: 100%; display: block;"><polygon points="25,4 75,4 98,50 75,96 25,96 2,50" fill="${fillColor}" stroke="${borderColor}" stroke-width="${borderWidth}" stroke-linejoin="round" vector-effect="non-scaling-stroke" /></svg>`;
        } else if (shapeType === 'line') {
          shapeInnerHtml = `<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;"><div style="width: 100%; height: ${Math.max(2, borderWidth || 4)}px; background-color: ${fillColor}; border-radius: 9999px;"></div></div>`;
        } else {
          const radius = shapeType === 'rounded-rect' ? (properties.borderRadius ?? 24) : (properties.borderRadius || 0);
          shapeInnerHtml = `<div style="width: 100%; height: 100%; background-color: ${fillColor}; border-radius: ${radius}px; border: ${borderWidth}px ${borderStyle} ${borderColor}; box-sizing: border-box;"></div>`;
        }

        let maskedHtml = '';
        if (properties.maskedLayers && properties.maskedLayers.length > 0) {
          const clipVal = getShapeClipPath(shapeType, properties.borderRadius);
          const layersHtml = properties.maskedLayers
            .map((layer) => {
              const lOp = layer.properties.opacity !== undefined ? layer.properties.opacity : 1;
              if (layer.category === 'IMAGE') {
                return `<div style="position: absolute; left: ${layer.posX}px; top: ${layer.posY}px; width: ${layer.width}px; height: ${layer.height}px; opacity: ${lOp};"><img src="${layer.properties.imageUrl || ''}" alt="Masked" style="width: 100%; height: 100%; object-fit: ${layer.properties.objectFit || 'cover'};" /></div>`;
              }
              const lType = layer.properties.shapeType || 'rectangle';
              const lFill = layer.color || '#f59e0b';
              const lClip = getShapeClipPath(lType, layer.properties.borderRadius);
              return `<div style="position: absolute; left: ${layer.posX}px; top: ${layer.posY}px; width: ${layer.width}px; height: ${layer.height}px; opacity: ${lOp}; background-color: ${lFill}; ${lClip ? `clip-path: ${lClip};` : ''}"></div>`;
            })
            .join('');
          maskedHtml = `<div style="position: absolute; inset: 0; overflow: hidden; ${clipVal ? `clip-path: ${clipVal};` : ''}">${layersHtml}</div>`;
        }

        elementsHtml += `
          <div class="canvas-element" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; opacity: ${opacity}; filter: ${shadowFilter};">
            ${shapeInnerHtml}
            ${maskedHtml}
          </div>
        `;
      } else if (category === 'IMAGE') {
        const imgClip = getShapeClipPath(properties.maskShape, properties.borderRadius);
        elementsHtml += `
          <div class="canvas-element" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; opacity: ${properties.opacity !== undefined ? properties.opacity : 1}; ${imgClip ? `clip-path: ${imgClip};` : `border-radius: ${properties.borderRadius || 12}px;`} overflow: hidden;">
            <img src="${properties.imageUrl || ''}" alt="Gambar" style="width: 100%; height: 100%; object-fit: ${properties.objectFit || 'cover'};" />
          </div>
        `;
      } else if (category === 'PRODUCT' && properties.cardData) {
        const c = properties.cardData;
        elementsHtml += `
          <div class="canvas-element product-card" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; opacity: ${properties.opacity !== undefined ? properties.opacity : 1}; background-color: ${color || '#ffffff'};">
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
          <a href="${href}" class="canvas-element btn-element" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; opacity: ${properties.opacity !== undefined ? properties.opacity : 1}; background-color: ${properties.buttonVariant === 'outline' ? 'transparent' : color || '#2563eb'}; color: ${properties.buttonTextColor || '#ffffff'}; border: ${properties.buttonVariant === 'outline' ? `2px solid ${color || '#0f172a'}` : 'none'}; border-radius: ${radius}; font-size: 0.875rem;">
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

        const navLogoHtml = properties.navLogoUrl
          ? `<img src="${properties.navLogoUrl}" alt="${properties.navBrand || 'Logo'}" style="height: 36px; max-width: 160px; object-fit: contain; border-radius: 6px;" />`
          : '';
        const navBrandHtml =
          properties.navBrand || !properties.navLogoUrl
            ? `<span style="font-weight: 800; font-size: 0.95rem;">${properties.navBrand || 'Logo'}</span>`
            : '';

        elementsHtml += `
          <nav class="canvas-element navbar-container" style="left: ${posX}px; top: ${posY}px; width: ${width}px; height: ${height}px; opacity: ${properties.opacity !== undefined ? properties.opacity : 1}; background-color: ${color || '#ffffff'}; color: ${properties.color || '#0f172a'}; border-radius: ${radius};">
            <div style="display: flex; align-items: center; gap: 0.625rem;">
              ${navLogoHtml}
              ${navBrandHtml}
            </div>
            <div class="nav-links">
              ${navLinks}
            </div>
          </nav>
        `;
      }
    });

    pagesHtml += `
      <!-- Kanvas ${canvas.pageIndex}: ${canvas.title || ''} -->
      <section id="canvas-${canvas.id}" class="canvas-page" style="height: ${canvas.height || 650}px; background-color: ${canvas.backgroundColor || '#ffffff'}; ${canvas.backgroundImage ? `background-image: url('${canvas.backgroundImage}'); background-size: cover; background-position: center;` : ''}">
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
  <svg width="0" height="0" style="position: absolute; pointer-events: none;" aria-hidden="true">
    <defs>
      <clipPath id="nexa-clip-heart" clipPathUnits="objectBoundingBox">
        <path d="${HEART_CLIP_PATH_D}" />
      </clipPath>
    </defs>
  </svg>
  <div class="canvas-viewport">
    ${pagesHtml}
  </div>
  <script>
    // Ultra-Smooth Cubic Ease-In-Out Scroll Navigation
    (function () {
      function easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
      }
      function smoothScrollTo(targetY, duration) {
        var startY = window.pageYOffset || document.documentElement.scrollTop;
        var distance = targetY - startY;
        var startTime = null;
        function step(timestamp) {
          if (!startTime) startTime = timestamp;
          var elapsed = timestamp - startTime;
          var progress = Math.min(elapsed / duration, 1);
          window.scrollTo(0, startY + distance * easeInOutCubic(progress));
          if (elapsed < duration) {
            window.requestAnimationFrame(step);
          }
        }
        window.requestAnimationFrame(step);
      }
      document.addEventListener('click', function (e) {
        var link = e.target.closest('a[href^="#canvas-"]');
        if (!link) return;
        var targetId = link.getAttribute('href').slice(1);
        var targetEl = document.getElementById(targetId);
        if (!targetEl) return;
        e.preventDefault();
        var rect = targetEl.getBoundingClientRect();
        var targetY = rect.top + (window.pageYOffset || document.documentElement.scrollTop) - 16;
        smoothScrollTo(Math.max(0, targetY), 680);
      });
    })();
  </script>
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
