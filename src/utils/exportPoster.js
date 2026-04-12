import { getExportDimensions } from './posterSizes';

const MARGIN_RATIO = 0.039; // margin as fraction of width

export async function exportPoster({ mapRef, theme, title, locations, yearFrom, yearTo, sizeId, orientation }) {
  await document.fonts.ready;

  const { w: W, h: H } = getExportDimensions(sizeId, orientation);
  const MARGIN = Math.round(W * MARGIN_RATIO);

  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = theme.posterBg;
  ctx.fillRect(0, 0, W, H);

  // Outer border
  ctx.strokeStyle = theme.posterBorder;
  ctx.lineWidth = 3;
  ctx.strokeRect(MARGIN, MARGIN, W - MARGIN * 2, H - MARGIN * 2);

  // Inner border
  // Scale based on the short side so text/margins stay proportional in both orientations
  const S = Math.min(W, H) / 1800;

  const ins = MARGIN + Math.round(12 * S);
  ctx.lineWidth = 1;
  ctx.strokeRect(ins, ins, W - ins * 2, H - ins * 2);

  const headerTop = ins + Math.round(40 * S);

  // Decorative rule
  drawDecorativeLine(ctx, ins + Math.round(60 * S), headerTop + Math.round(10 * S), W - ins - Math.round(60 * S), headerTop + Math.round(10 * S), theme);

  // Title
  ctx.fillStyle = theme.posterText;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const titleFontSize = Math.round((title.length > 22 ? 82 : 96) * S);
  ctx.font = `700 ${titleFontSize}px "${theme.titleFont}"`;
  wrapText(ctx, title.toUpperCase(), W / 2, headerTop + Math.round(80 * S), W - ins * 2 - Math.round(120 * S), titleFontSize * 1.2);

  ctx.fillStyle = theme.posterAccent;
  ctx.font = `400 ${Math.round(32 * S)}px "${theme.bodyFont}"`;
  ctx.fillText('TRAVEL JOURNAL', W / 2, headerTop + Math.round(185 * S));

  drawDecorativeLine(ctx, ins + Math.round(60 * S), headerTop + Math.round(215 * S), W - ins - Math.round(60 * S), headerTop + Math.round(215 * S), theme);

  // Map area — height is proportional to poster height minus header/footer space
  const mapTop = headerTop + Math.round(240 * S);
  const mapLeft = ins + Math.round(40 * S);
  const mapRight = W - ins - Math.round(40 * S);
  const mapW = mapRight - mapLeft;
  const mapH = H - mapTop - Math.round(340 * S); // leave room for locations + stats + footer

  // Draw SVG map
  const svgEl = mapRef?.current?.getSvgElement?.();
  if (svgEl) {
    try {
      // Clone and fix dimensions for export
      const clone = svgEl.cloneNode(true);
      clone.setAttribute('width', String(mapW));
      clone.setAttribute('height', String(mapH));
      clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');

      const svgData = new XMLSerializer().serializeToString(clone);
      const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);

      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      ctx.drawImage(img, mapLeft, mapTop, mapW, mapH);
      URL.revokeObjectURL(url);
    } catch (e) {
      ctx.fillStyle = theme.posterBorder;
      ctx.fillRect(mapLeft, mapTop, mapW, mapH);
    }
  } else {
    ctx.fillStyle = theme.posterBorder;
    ctx.fillRect(mapLeft, mapTop, mapW, mapH);
  }

  // Map border
  ctx.strokeStyle = theme.posterBorder;
  ctx.lineWidth = 2;
  ctx.strokeRect(mapLeft, mapTop, mapW, mapH);

  // Location names
  const listTop = mapTop + mapH + Math.round(55 * S);
  drawLine(ctx, ins + Math.round(60 * S), listTop - Math.round(20 * S), W - ins - Math.round(60 * S), theme.posterDivider);

  if (locations.length > 0) {
    const sep = `  ${theme.separator}  `;
    const joined = locations.map(l => l.shortName).join(sep);
    ctx.fillStyle = theme.posterSubtext;
    ctx.font = `300 ${Math.round(28 * S)}px "${theme.bodyFont}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    wrapText(ctx, joined, W / 2, listTop + Math.round(30 * S), W - ins * 2 - Math.round(80 * S), Math.round(38 * S));
  }

  // Stats bar
  const statsTop = listTop + Math.round(95 * S);
  drawLine(ctx, ins + Math.round(60 * S), statsTop - Math.round(15 * S), W - ins - Math.round(60 * S), theme.posterDivider);

  const uniqueCountries = new Set(locations.map(l => l.country).filter(Boolean)).size;
  const uniqueContinents = new Set(locations.map(l => l.continent).filter(Boolean)).size;

  const stats = [
    { value: uniqueCountries || '—', label: 'COUNTRIES' },
    { value: uniqueContinents || '—', label: 'CONTINENTS' },
    { value: yearFrom && yearTo ? `${yearFrom} – ${yearTo}` : '—', label: 'YEARS' },
  ];

  const colW = (W - ins * 2 - Math.round(80 * S)) / 3;
  const colStartX = ins + Math.round(40 * S);

  stats.forEach((stat, i) => {
    const cx = colStartX + colW * i + colW / 2;
    ctx.fillStyle = theme.posterText;
    ctx.font = `700 ${Math.round(64 * S)}px "${theme.titleFont}"`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(String(stat.value), cx, statsTop + Math.round(42 * S));
    ctx.fillStyle = theme.posterSubtext;
    ctx.font = `400 ${Math.round(22 * S)}px "${theme.bodyFont}"`;
    ctx.fillText(stat.label, cx, statsTop + Math.round(90 * S));
  });

  ctx.strokeStyle = theme.posterDivider;
  ctx.lineWidth = 1;
  [1, 2].forEach(i => {
    const x = colStartX + colW * i;
    ctx.beginPath();
    ctx.moveTo(x, statsTop + Math.round(10 * S));
    ctx.lineTo(x, statsTop + Math.round(110 * S));
    ctx.stroke();
  });

  // Footer
  const footerTop = H - ins - Math.round(70 * S);
  drawLine(ctx, ins + Math.round(60 * S), footerTop - Math.round(20 * S), W - ins - Math.round(60 * S), theme.posterDivider);
  ctx.fillStyle = theme.posterSubtext;
  ctx.font = `300 ${Math.round(22 * S)}px "${theme.bodyFont}"`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('MERIDIAN', W / 2, footerTop + Math.round(12 * S));

  // Download
  const link = document.createElement('a');
  link.download = `meridian-${title.toLowerCase().replace(/\s+/g, '-')}-${sizeId ?? '18x24'}.png`;
  link.href = canvas.toDataURL('image/png', 1.0);
  link.click();
}

function drawDecorativeLine(ctx, x1, y, x2, _y2, theme) {
  const midX = (x1 + x2) / 2;
  ctx.strokeStyle = theme.posterAccent;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(midX - 30, y); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(midX + 30, y); ctx.lineTo(x2, y); ctx.stroke();
  ctx.fillStyle = theme.posterAccent;
  ctx.save();
  ctx.translate(midX, y);
  ctx.rotate(Math.PI / 4);
  ctx.fillRect(-5, -5, 10, 10);
  ctx.restore();
}

function drawLine(ctx, x1, y, x2, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(x1, y); ctx.lineTo(x2, y); ctx.stroke();
}

function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;
  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    if (ctx.measureText(testLine).width > maxWidth && n > 0) {
      ctx.fillText(line.trim(), x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line.trim(), x, currentY);
}
