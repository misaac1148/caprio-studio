import fs from 'node:fs';
const base = (process.env.SITE_URL || 'https://capriostudio.com').replace(/\/$/, '');
const routes = ['', '/laser-engraving', '/3d-printing', '/eugene-oregon', '/about', '/contact', '/privacy'];
if (base && !/^https:\/\/[a-z0-9.-]+(?::\d+)?$/i.test(base)) throw new Error('SITE_URL must be a full https:// URL without a path');
if (base) {
  for (const route of routes) {
    const path = `public${route || '/index'}.html`;
    const html = fs.readFileSync(path, 'utf8');
    const canonical = `<link rel="canonical" href="${base}${route || '/'}">`;
    const updated = html.replace(/(?:<!-- CANONICAL -->|<link rel="canonical" href="[^"]*">)/, canonical).replaceAll('https://YOUR-LIVE-DOMAIN.example', base);
    fs.writeFileSync(path, updated);
  }
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map(r=>`  <url><loc>${base}${r || '/'}</loc></url>`).join('\n')}\n</urlset>\n`;
  fs.writeFileSync('public/sitemap.xml',xml);
  fs.writeFileSync('public/robots.txt',`User-agent: *\nAllow: /\nSitemap: ${base}/sitemap.xml\n`);
  console.log(`Created SEO files for ${base}`);
} else {
  // No invented canonical URL or misleading sitemap before a domain is assigned.
  fs.writeFileSync('public/robots.txt','User-agent: *\nAllow: /\n');
  console.log('SITE_URL not set; skipping canonical links and sitemap. Set SITE_URL in Vercel once domain is known.');
}
