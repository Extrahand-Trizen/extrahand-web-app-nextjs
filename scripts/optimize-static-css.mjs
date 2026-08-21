/**
 * Post-process the static export so the large Tailwind CSS file is not
 * render-blocking. Converts:
 *   <link rel="stylesheet" href="...css">
 * into a preload + print-media swap that PSI accepts.
 *
 * Runs against `out/` after `next build`. Safe for nginx / MinIO hosting.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "out");

function walkHtml(dir) {
   const results = [];
   if (!fs.existsSync(dir)) return results;
   for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) results.push(...walkHtml(full));
      else if (entry.isFile() && entry.name.endsWith(".html")) results.push(full);
   }
   return results;
}

function deferStylesheets(html) {
   return html.replace(
      /<link\b([^>]*?)\brel=(["'])stylesheet\2([^>]*)>/gi,
      (full, before, _quote, after) => {
         const attrs = `${before} ${after}`;
         const hrefMatch = attrs.match(/\bhref=(["'])([^"']+)\1/i);
         if (!hrefMatch) return full;
         const href = hrefMatch[2];
         if (!href.includes(".css")) return full;
         // Keep Google / third-party CSS as-is if any remain.
         if (/^https?:\/\//i.test(href) && !href.includes("extrahand.in")) {
            return full;
         }
         return (
            `<link rel="preload" href="${href}" as="style" />` +
            `<link rel="stylesheet" href="${href}" media="print" onload="this.media='all'" />` +
            `<noscript>${full}</noscript>`
         );
      }
   );
}

function stripLegacyPolyfillScripts(html) {
   return html.replace(
      /<script\b[^>]*\bsrc=(["'])[^"']*polyfills[^"']*\1[^>]*>\s*<\/script>/gi,
      ""
   );
}

function emptyLegacyPolyfillFiles(outDir) {
   const chunksDir = path.join(outDir, "_next", "static", "chunks");
   if (!fs.existsSync(chunksDir)) return 0;

   let count = 0;
   for (const file of fs.readdirSync(chunksDir)) {
      if (/^polyfills[-.].*\.js$/i.test(file)) {
         fs.writeFileSync(path.join(chunksDir, file), "!function(){}();\n");
         count += 1;
      }
   }
   return count;
}

function main() {
   if (!fs.existsSync(OUT_DIR)) {
      console.warn("optimize-static-css: no out/ folder, skipping");
      return;
   }

   const polyfillFiles = emptyLegacyPolyfillFiles(OUT_DIR);
   const files = walkHtml(OUT_DIR);
   let changed = 0;
   for (const file of files) {
      const isIndexHtml =
         file === path.join(OUT_DIR, "index.html") ||
         file.endsWith("/index.html") && file === path.resolve(OUT_DIR, "index.html");

      const original = fs.readFileSync(file, "utf8");
      let next = isIndexHtml ? original : deferStylesheets(original);
      next = stripLegacyPolyfillScripts(next);
      if (next !== original) {
         fs.writeFileSync(file, next);
         changed += 1;
      }
   }
   console.log(
      `optimize-static-css: updated ${changed}/${files.length} HTML files; emptied ${polyfillFiles} polyfill chunk(s)`
   );
}

main();
