import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = path.join(projectRoot, "sitemap.xml");
const outputPath = path.join(projectRoot, "public", "sitemap.xml");
const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || "https://extrahand.in").replace(/\/+$/, "");
const backendUrl = (
  process.env.CONTENT_ADMIN_URL ||
  process.env.NEXT_PUBLIC_CONTENT_ADMIN_URL ||
  "https://extrahand-content-admin-backend.backend.extrahand.in"
).replace(/\/+$/, "");

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function normalizeUrl(value) {
  return value.endsWith("/") ? value.slice(0, -1) : value;
}

async function getPublishedPages() {
  const response = await fetch(`${backendUrl}/api/seo-pages/published/slugs`);
  if (!response.ok) {
    throw new Error(`Published SEO pages request failed with HTTP ${response.status}`);
  }
  const pages = await response.json();
  if (!Array.isArray(pages)) {
    throw new Error("Published SEO pages response was not an array");
  }
  return pages;
}

async function readExistingEntries() {
  try {
    const xml = await readFile(sourcePath, "utf8");
    return [...xml.matchAll(/<url>[\s\S]*?<loc>([^<]+)<\/loc>[\s\S]*?<\/url>/g)].map((match) => ({
      url: match[1],
      xml: match[0],
    }));
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

const existingEntries = await readExistingEntries();
const entriesByUrl = new Map(existingEntries.map((entry) => [normalizeUrl(entry.url), entry.xml]));

for (const page of await getPublishedPages()) {
  const url = page.canonicalUrl?.trim() || `${baseUrl}/${page.slug}`;
  const normalizedUrl = normalizeUrl(url);
  const lastmod = page.updatedAt
    ? new Date(page.updatedAt).toISOString().slice(0, 10)
    : new Date().toISOString().slice(0, 10);
  entriesByUrl.set(normalizedUrl, `  <url>\n    <loc>${escapeXml(url)}</loc>\n    <lastmod>${lastmod}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>`);
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${[...entriesByUrl.values()].join("\n")}\n</urlset>\n`;

await mkdir(path.dirname(outputPath), { recursive: true });
await writeFile(outputPath, xml, "utf8");
console.log(`Generated ${outputPath} with ${entriesByUrl.size} URLs.`);