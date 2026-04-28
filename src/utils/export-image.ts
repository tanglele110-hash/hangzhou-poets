import type { PositionedPoet } from '../types';
import {
  START_YEAR,
  SCALE,
  PERIODS,
  EVENTS,
  TAG_GROUPS,
} from '../constants';
import { getPoetColor, PAPER_BG } from '../constants/theme';
import { cardWidthForPoet } from './layout';

function vText(
  ctx: CanvasRenderingContext2D,
  text: string,
  tx: number,
  ty: number,
  size: number,
  color: string,
  weight: number | string = 900,
) {
  ctx.fillStyle = color;
  ctx.font = `${weight} ${size}px "Noto Serif SC",serif`;
  ctx.textBaseline = 'top';
  for (let i = 0; i < text.length; i++) {
    ctx.fillText(text[i], tx, ty + i * size * 1.15);
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  rx: number,
  ry: number,
  rw: number,
  rh: number,
  r: number,
) {
  ctx.beginPath();
  ctx.moveTo(rx + r, ry);
  ctx.lineTo(rx + rw - r, ry);
  ctx.arcTo(rx + rw, ry, rx + rw, ry + r, r);
  ctx.lineTo(rx + rw, ry + rh - r);
  ctx.arcTo(rx + rw, ry + rh, rx + rw - r, ry + rh, r);
  ctx.lineTo(rx + r, ry + rh);
  ctx.arcTo(rx, ry + rh, rx, ry + rh - r, r);
  ctx.lineTo(rx, ry + r);
  ctx.arcTo(rx, ry, rx + r, ry, r);
  ctx.closePath();
}

function drawDownloadIcon(
  ctx: CanvasRenderingContext2D,
  ix: number,
  iy: number,
  color: string,
) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(ix + 5, iy + 2);
  ctx.lineTo(ix + 5, iy + 10);
  ctx.moveTo(ix + 2, iy + 7);
  ctx.lineTo(ix + 5, iy + 10);
  ctx.lineTo(ix + 8, iy + 7);
  ctx.moveTo(ix + 1, iy + 13);
  ctx.lineTo(ix + 9, iy + 13);
  ctx.stroke();
  ctx.restore();
}

function drawNetworkIcon(
  ctx: CanvasRenderingContext2D,
  ix: number,
  iy: number,
  color: string,
) {
  const points = [
    { x: ix + 2, y: iy + 11 },
    { x: ix + 10, y: iy + 4 },
    { x: ix + 10, y: iy + 16 },
  ];
  ctx.save();
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[1].x, points[1].y);
  ctx.moveTo(points[0].x, points[0].y);
  ctx.lineTo(points[2].x, points[2].y);
  ctx.stroke();
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 1.9, 0, Math.PI * 2);
    ctx.fill();
  });
  ctx.restore();
}

function drawActionButton(
  ctx: CanvasRenderingContext2D,
  bx: number,
  by: number,
  label: string,
  filled: boolean,
  icon: 'download' | 'network',
): number {
  ctx.save();
  ctx.font = `700 ${filled ? 14 : 12}px "Noto Serif SC",serif`;
  const labelW = ctx.measureText(label).width;
  const bw = Math.ceil(labelW + 44);
  const bh = filled ? 34 : 28;
  roundRect(ctx, bx, by, bw, bh, 4);
  ctx.fillStyle = filled ? '#b83b3b' : PAPER_BG;
  ctx.fill();
  ctx.strokeStyle = filled ? '#b83b3b' : 'rgba(184,59,59,0.3)';
  ctx.lineWidth = 1.2;
  ctx.stroke();

  const textColor = filled ? PAPER_BG : '#b83b3b';
  if (icon === 'download') {
    drawDownloadIcon(ctx, bx + 11, by + 8, textColor);
  } else {
    drawNetworkIcon(ctx, bx + 10, by + 5, textColor);
  }

  ctx.fillStyle = textColor;
  ctx.textBaseline = 'middle';
  ctx.fillText(label, bx + 28, by + bh / 2 + 1);
  ctx.restore();

  return bw;
}

export async function exportTimelineAsImage(
  positionedPoets: PositionedPoet[],
  timelineWidth: number,
  totalHeight: number,
): Promise<void> {
  await document.fonts.ready;

  const HEADER_H = 220;
  const W = timelineWidth;
  const H = HEADER_H + totalHeight;
  const OY = HEADER_H;
  const LEFT_MARGIN = 48;
  const RIGHT_MARGIN = 48;

  const c = document.createElement('canvas');
  c.width = W;
  c.height = H;
  const x = c.getContext('2d')!;

  // Background
  x.fillStyle = PAPER_BG;
  x.fillRect(0, 0, W, H);

  // Header
  x.textBaseline = 'top';
  x.fillStyle = '#b83b3b';
  x.font = '900 58px "Noto Serif SC",serif';
  const title = '杭州唐宋诗词名家图鉴';
  x.fillText(title, LEFT_MARGIN, 26);
  const titleW = x.measureText(title).width;
  const buttonX = LEFT_MARGIN + titleW + 30;
  drawActionButton(x, buttonX, 34, '生成长图', true, 'download');
  drawActionButton(x, buttonX, 76, '全景关系图谱', false, 'network');
  x.fillStyle = '#555';
  x.font = '800 30px "Noto Serif SC",serif';
  x.fillText('钱塘自古繁华，文人墨客荟萃', LEFT_MARGIN, 108);

  // Legend
  const legendItems = [
    { label: '核心代表', bg: '#b83b3b' },
    { label: '重要名家', bg: '#4a6b8c' },
    { label: '知名文人', bg: '#5c7a6b' },
  ];
  x.font = '700 14px "Noto Serif SC",serif';
  const legendGap = 22;
  const legendRowW = legendItems.reduce((sum, { label }, index) => {
    const itemW = 14 + 8 + x.measureText(label).width;
    return sum + itemW + (index === 0 ? 0 : legendGap);
  }, 0);
  let lx = W - RIGHT_MARGIN - legendRowW;
  legendItems.forEach(({ label, bg }) => {
    x.fillStyle = bg;
    x.fillRect(lx, 35, 14, 14);
    x.fillStyle = '#444';
    x.fillText(label, lx + 20, 35);
    lx += 14 + 8 + x.measureText(label).width + legendGap;
  });

  // Tag groups
  const tagGroups = TAG_GROUPS.map((g) => ({
    prefix: `${g.prefix}：`,
    tags: g.tags,
  }));
  let tgy = 72;
  tagGroups.forEach(({ prefix, tags }) => {
    x.font = '700 11px "Noto Serif SC",serif';
    const prefixW = x.measureText(prefix).width;
    x.font = '800 11px "Noto Serif SC",serif';
    const tagWidths = tags.map((tag) => x.measureText(tag).width + 10);
    const rowW =
      prefixW +
      6 +
      tagWidths.reduce(
        (sum, width, index) => sum + width + (index === 0 ? 0 : 5),
        0,
      );
    let tgx = W - RIGHT_MARGIN - rowW;
    x.font = '700 11px "Noto Serif SC",serif';
    x.fillStyle = '#888';
    x.fillText(prefix, tgx, tgy);
    tgx += prefixW + 6;
    x.font = '800 11px "Noto Serif SC",serif';
    tags.forEach((tag, index) => {
      const tw = tagWidths[index];
      x.fillStyle = '#fff';
      x.fillRect(tgx, tgy - 2, tw, 18);
      x.strokeStyle = '#bbb';
      x.lineWidth = 1.5;
      x.strokeRect(tgx, tgy - 2, tw, 18);
      x.fillStyle = '#666';
      x.fillText(tag, tgx + 5, tgy);
      tgx += tw + 5;
    });
    tgy += 24;
  });

  // Divider
  x.strokeStyle = 'rgba(180,170,160,0.5)';
  x.lineWidth = 2;
  x.beginPath();
  x.moveTo(0, HEADER_H - 1);
  x.lineTo(W, HEADER_H - 1);
  x.stroke();

  // Period bands
  const decades =
    Array.from(
      { length: Math.floor(totalHeight / SCALE / 10) + 1 },
      (_, i) => START_YEAR + i * 10,
    );

  PERIODS.forEach((p) => {
    const py = (p.start - START_YEAR) * SCALE + OY;
    const ph = (p.end - p.start) * SCALE;
    x.save();
    x.globalAlpha = 0.9;
    x.fillStyle = p.color;
    x.fillRect(W - 240, py, 80, ph);
    x.restore();
    x.strokeStyle = 'rgba(200,200,200,0.3)';
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(W - 240, py + ph);
    x.lineTo(W - 160, py + ph);
    x.stroke();
    x.fillStyle = 'rgba(31,31,31,0.5)';
    x.font = '900 32px "Noto Serif SC",serif';
    x.textBaseline = 'top';
    const chars = p.name.split('');
    const txtH = chars.length * 38;
    const sy = py + (ph - txtH) / 2;
    chars.forEach((ch, i) => x.fillText(ch, W - 240 + 22, sy + i * 38));
  });
  x.strokeStyle = 'rgba(200,200,200,0.5)';
  x.lineWidth = 1;
  x.beginPath();
  x.moveTo(W - 240, OY);
  x.lineTo(W - 240, OY + totalHeight);
  x.stroke();

  // Decade marks
  x.font = '700 11px monospace';
  x.textBaseline = 'middle';
  decades.forEach((yr) => {
    const dy = (yr - START_YEAR) * SCALE + OY;
    x.strokeStyle = 'rgba(200,200,200,0.5)';
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(W - 300, dy);
    x.lineTo(W - 240, dy);
    x.stroke();
    x.fillStyle = '#888';
    x.textAlign = 'right';
    x.fillText(String(yr), W - 244, dy);
  });
  x.textAlign = 'left';

  // Events
  EVENTS.forEach((ev) => {
    const ey = (ev.start - START_YEAR) * SCALE + OY + (ev.yOffset ?? 0);
    const yearStr = `${ev.start}年${ev.start !== ev.end ? `-${ev.end}年` : ''}`;
    x.font = '700 11px monospace';
    const yw = x.measureText(yearStr).width;
    x.font = '700 12px "Noto Serif SC",serif';
    const nw = x.measureText(ev.name).width;
    const pw = yw + 10 + nw + 20;
    const ph = 26;
    const px = W - 160 + 16;
    x.fillStyle = 'rgba(244,241,232,0.95)';
    roundRect(x, px, ey - ph / 2, pw, ph, 4);
    x.fill();
    x.strokeStyle = 'rgba(200,200,200,0.8)';
    x.lineWidth = 1;
    x.stroke();
    x.textBaseline = 'middle';
    x.font = '700 11px monospace';
    x.fillStyle = 'rgba(184,59,59,0.8)';
    x.fillText(yearStr, px + 10, ey);
    x.font = '700 12px "Noto Serif SC",serif';
    x.fillStyle = '#333';
    x.fillText(ev.name, px + 10 + yw + 8, ey);
  });

  // Poet cards
  positionedPoets.forEach((poet) => {
    const cardTop = (poet.birth_year - START_YEAR) * SCALE + OY;
    const cardH = (poet.death_year - poet.birth_year) * SCALE;
    const cardW = cardWidthForPoet(poet);
    const cardRight = W - 320 - poet.columnRightOffset;
    const cardLeft = cardRight - cardW;

    const color = getPoetColor(poet.weight);
    const fontSize = poet.weight === 3 ? 42 : poet.weight === 2 ? 28 : 18;

    x.save();
    x.globalAlpha = 0.1;
    x.fillStyle = color;
    x.fillRect(cardLeft, cardTop, cardW, cardH);
    x.restore();

    x.strokeStyle = color + '40';
    x.lineWidth = 1;
    x.beginPath();
    x.moveTo(cardLeft, cardTop);
    x.lineTo(cardRight, cardTop);
    x.moveTo(cardLeft, cardTop + cardH);
    x.lineTo(cardRight, cardTop + cardH);
    x.stroke();

    x.fillStyle = color + '60';
    x.fillRect(cardRight - 1, cardTop, 1, cardH);
    x.fillStyle = color;
    x.fillRect(cardRight - 3, cardTop, 5, 1);
    x.fillRect(cardRight - 3, cardTop + cardH - 1, 5, 1);

    x.font = '700 10px monospace';
    x.textBaseline = 'bottom';
    x.fillStyle = color;
    if (poet.unknown_dates) {
      x.fillText('生卒年不详', cardRight - 30, cardTop - 3);
    } else {
      x.fillText(String(poet.birth_year), cardRight - 20, cardTop - 3);
      x.textBaseline = 'top';
      x.fillText(String(poet.death_year), cardRight - 20, cardTop + cardH + 3);
    }

    const nameX = cardRight - 10 - fontSize * 0.85;
    vText(x, poet.name, nameX, cardTop + 10, fontSize, color);

    x.font = '700 11px "Noto Serif SC",serif';
    x.textBaseline = 'top';
    let tagY = cardTop + 10;
    const tagRight = nameX - 6;
    poet.tags.forEach((tag) => {
      const m = x.measureText(tag);
      const tw = Math.min(m.width + 8, 78);
      x.fillStyle = 'rgba(255,255,255,0.9)';
      x.fillRect(tagRight - tw, tagY, tw, 17);
      x.strokeStyle = color + '60';
      x.lineWidth = 1.5;
      x.strokeRect(tagRight - tw, tagY, tw, 17);
      x.fillStyle = color;
      x.fillText(tag, tagRight - tw + 4, tagY + 2);
      tagY += 21;
    });

    if (poet.short_desc) {
      vText(x, poet.short_desc, tagRight - 22, tagY + 6, 14, '#222', 700);
    }
    if (poet.works_short) {
      const wt = `︽${poet.works_short}︾`;
      vText(x, wt, tagRight - 38, tagY + 6, 12, '#666', 700);
    }
  });

  // Download
  c.toBlob((blob) => {
    if (!blob) return;
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = '杭州唐宋诗词名家图鉴.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
  }, 'image/png');
}
