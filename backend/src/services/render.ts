import fs from 'fs/promises';
import os from 'os';
import path from 'path';
import puppeteer from 'puppeteer';
import { ITemplate } from '../models/Template';

function esc(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' }[c] as string));
}

function photoMarkup(url: string, slot: { x: number; y: number; w: number; h: number; radius?: number }) {
  return `<img src="${esc(url)}" style="position:absolute;left:${slot.x}px;top:${slot.y}px;width:${slot.w}px;height:${slot.h}px;object-fit:cover;border-radius:${slot.radius ?? 20}px;border:7px solid rgba(255,255,255,.9);box-shadow:0 8px 25px rgba(0,0,0,.18)"/>`;
}

export async function renderPoster(params: {
  template: ITemplate;
  formData: Record<string, unknown>;
  photoUrls: string[];
  layout: { headlineScale?: number; photoScale?: number; accentPosition?: string; decoration?: string };
}) {
  const { template, formData, photoUrls, layout } = params;
  const cfg = template.layoutConfig;
  const width = cfg.width || 1200;
  const height = cfg.height || 1600;
  const slots = cfg.photoSlots || [];
  const baseUrl = process.env.PUBLIC_API_URL || `http://localhost:${process.env.PORT || 5000}`;
  const photos = photoUrls.slice(0, slots.length).map((url, i) => photoMarkup(url.startsWith('http') ? url : `${baseUrl}${url}`, { ...slots[i], w: slots[i].w * (layout.photoScale || 1), h: slots[i].h * (layout.photoScale || 1) }));
  const headline = esc(formData.headline || template.title);
  const name = esc(formData.name);
  const designation = esc(formData.designation);
  const organization = esc(formData.organization || formData.party);
  const district = esc(formData.district);
  const decoration = layout.decoration || 'floral';

  const html = `<!doctype html><html lang="bn"><head><meta charset="utf-8"><style>
  @page { size: ${width}px ${height}px; margin:0; }
  *{box-sizing:border-box} body{margin:0;background:#ddd;font-family:"Noto Sans Bengali","Noto Sans",Arial,sans-serif}
  .poster{position:relative;width:${width}px;height:${height}px;overflow:hidden;background:${cfg.background};color:#132016}
  .accent{position:absolute;left:0;right:0;height:58px;background:${cfg.accent};opacity:.95}
  .accent.top{top:0}.accent.bottom{bottom:0}
  .headline{position:absolute;left:70px;right:70px;top:560px;text-align:center;font-weight:900;font-size:${Math.round(94*(layout.headlineScale || 1))}px;line-height:1.12;color:${cfg.headlineColor};text-shadow:0 2px 0 rgba(255,255,255,.55)}
  .meta{position:absolute;left:70px;right:70px;top:720px;text-align:center;font-size:36px;font-weight:700}
  .footer{position:absolute;left:70px;right:70px;bottom:95px;text-align:center;background:rgba(255,255,255,.82);padding:24px 30px;border-radius:28px;font-size:30px;font-weight:800;color:${cfg.footerColor}}
  .district{font-size:25px;font-weight:600;opacity:.78;margin-top:8px}
  .deco{position:absolute;font-size:70px;opacity:.5}.d1{left:38px;top:420px}.d2{right:38px;top:420px}.d3{left:45px;bottom:210px}.d4{right:45px;bottom:210px}
  .brand{position:absolute;top:90px;left:0;right:0;text-align:center;font-size:28px;letter-spacing:3px;font-weight:800;opacity:.65}
</style></head><body><div class="poster">
  <div class="accent top"></div><div class="accent bottom"></div>
  <div class="brand">${esc(template.occasionType)} • POSTER MAKER</div>
  ${photos.join('')}
  <div class="deco d1">${decoration === 'dove' ? '🕊️' : decoration === 'rice-paddy' ? '🌾' : decoration === 'flag-ribbon' ? '🇧🇩' : decoration === 'none' ? '' : '❀'}</div>
  <div class="deco d2">${decoration === 'dove' ? '🕊️' : decoration === 'rice-paddy' ? '🌾' : decoration === 'flag-ribbon' ? '🇧🇩' : decoration === 'none' ? '' : '❀'}</div>
  <div class="headline">${headline}</div>
  <div class="meta">${name}${designation ? ` • ${designation}` : ''}${organization ? ` • ${organization}` : ''}<div class="district">${district}</div></div>
  <div class="footer">${name} • ${designation} • ${organization}<br><span style="font-size:22px;font-weight:600">প্রচারে: ${name}</span></div>
</div></body></html>`;

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox'] });
  try {
    const page = await browser.newPage({ viewport: { width, height }, deviceScaleFactor: 1 });
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), 'poster-'));
    const png = path.join(dir, 'poster.png');
    const pdf = path.join(dir, 'poster.pdf');
    await page.screenshot({ path: png, type: 'png' });
    await page.pdf({ path: pdf, width: `${width}px`, height: `${height}px`, printBackground: true, pageRanges: '1' });
    return { pngPath: png, pdfPath: pdf };
  } finally {
    await browser.close();
  }
}
