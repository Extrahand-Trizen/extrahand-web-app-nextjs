/**
 * For each app folder in frontend-builds, rename the highest build-00N
 * folder to `latest`. Older build-* folders are left unchanged.
 *
 * Usage:
 *   node scripts/rename-latest-builds-in-minio.mjs
 *   node scripts/rename-latest-builds-in-minio.mjs --dry-run
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Client } from 'minio';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');

dotenv.config({ path: path.join(__dirname, '.env.minio-builds') });
dotenv.config({ path: path.join(ROOT, '.env.minio-builds') });

const BUCKET_NAME = String(process.env.MINIO_BUCKET_NAME || 'frontend-builds').trim();
const BUILD_RE = /^build-(\d+)$/i;

function requireEnv(name) {
  const value = String(process.env[name] ?? '').trim();
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

function normalizeEndpoint(raw) {
  let urlLike = String(raw || '').trim();
  if (!/^https?:\/\//i.test(urlLike)) urlLike = `https://${urlLike}`;
  const url = new URL(urlLike);
  return {
    endPoint: url.hostname,
    useSSL: url.protocol === 'https:',
    port: url.port ? Number(url.port) : url.protocol === 'https:' ? 443 : 80,
  };
}

function parseArgs(argv) {
  return { dryRun: argv.includes('--dry-run') };
}

function listObjectNames(client, bucket, prefix) {
  return new Promise((resolve, reject) => {
    const names = [];
    const stream = client.listObjectsV2(bucket, prefix, true);
    stream.on('data', (obj) => {
      if (obj?.name) names.push(obj.name);
    });
    stream.on('error', reject);
    stream.on('end', () => resolve(names));
  });
}

async function discoverAppBuilds(client, bucket) {
  const names = await listObjectNames(client, bucket, '');
  /** @type {Map<string, Set<string>>} */
  const byApp = new Map();

  for (const name of names) {
    const parts = name.split('/').filter(Boolean);
    if (parts.length < 2) continue;
    const app = parts[0];
    const build = parts[1];
    if (!byApp.has(app)) byApp.set(app, new Set());
    byApp.get(app).add(build);
  }

  return byApp;
}

function pickLatestBuildFolder(buildFolders) {
  let best = null;
  let bestNum = -1;
  for (const folder of buildFolders) {
    const match = BUILD_RE.exec(folder);
    if (!match) continue;
    const num = Number(match[1]);
    if (num > bestNum) {
      bestNum = num;
      best = folder;
    }
  }
  return best ? { folder: best, version: bestNum } : null;
}

async function renamePrefix(client, bucket, fromPrefix, toPrefix, dryRun) {
  const from = fromPrefix.endsWith('/') ? fromPrefix : `${fromPrefix}/`;
  const to = toPrefix.endsWith('/') ? toPrefix : `${toPrefix}/`;
  const objects = await listObjectNames(client, bucket, from);

  console.log(`   Objects to move: ${objects.length}`);
  let copied = 0;
  let deleted = 0;
  let failed = 0;

  for (let i = 0; i < objects.length; i += 1) {
    const objectName = objects[i];
    const relative = objectName.slice(from.length);
    const destName = `${to}${relative}`;
    try {
      if (dryRun) {
        if (i < 3 || i === objects.length - 1) {
          console.log(`   (dry-run) ${objectName} → ${destName}`);
        } else if (i === 3) {
          console.log(`   (dry-run) ... ${objects.length - 4} more ...`);
        }
      } else {
        if (objectName.endsWith('/')) {
          await client.putObject(bucket, destName.endsWith('/') ? destName : `${destName}/`, Buffer.alloc(0), 0, {
            'Content-Type': 'application/x-directory',
          });
        } else {
          await client.copyObject(bucket, destName, `/${bucket}/${objectName}`);
        }
        await client.removeObject(bucket, objectName);
        if ((i + 1) % 200 === 0 || i + 1 === objects.length) {
          console.log(`   … ${i + 1}/${objects.length}`);
        }
      }
      copied += 1;
      deleted += 1;
    } catch (err) {
      failed += 1;
      console.error(`   ❌ ${objectName}: ${err?.message || err}`);
    }
  }

  // Ensure destination folder marker exists
  if (!dryRun) {
    try {
      await client.putObject(bucket, to, Buffer.alloc(0), 0, {
        'Content-Type': 'application/x-directory',
      });
    } catch {
      // ignore
    }
  }

  return { copied, deleted, failed, total: objects.length };
}

async function main() {
  const { dryRun } = parseArgs(process.argv);
  const endpointRaw = requireEnv('MINIO_SERVER_URL');
  const { endPoint, useSSL, port } = normalizeEndpoint(endpointRaw);
  const accessKey = requireEnv('MINIO_ROOT_USER');
  const secretKey = requireEnv('MINIO_ROOT_PASSWORD');
  const region = String(process.env.MINIO_REGION_NAME || '').trim() || undefined;

  console.log('══════════════════════════════════════════════════');
  console.log(' Rename highest build-* → latest (per app)');
  console.log('══════════════════════════════════════════════════');
  console.log(`Endpoint: ${endPoint}:${port} (ssl=${useSSL})`);
  console.log(`Bucket:   ${BUCKET_NAME}`);
  console.log(`Mode:     ${dryRun ? 'DRY RUN' : 'RENAME'}`);
  console.log('══════════════════════════════════════════════════\n');

  const client = new Client({
    endPoint,
    port,
    useSSL,
    accessKey,
    secretKey,
    region,
  });

  const byApp = await discoverAppBuilds(client, BUCKET_NAME);
  const apps = [...byApp.keys()].sort();
  const serverUrl = String(process.env.MINIO_SERVER_URL || '').replace(/\/+$/, '');

  const results = [];

  for (const app of apps) {
    const folders = [...byApp.get(app)];
    const latest = pickLatestBuildFolder(folders);
    console.log(`\n📦 ${app}/`);
    console.log(`   Folders: ${folders.sort().join(', ') || '(none)'}`);

    if (!latest) {
      console.log('   ⏭  No build-00N folder to rename');
      results.push({ app, skipped: true, reason: 'no build folder' });
      continue;
    }

    if (folders.includes('latest')) {
      console.log(`   ⏭  "latest" already exists — leave ${latest.folder} as-is`);
      results.push({ app, skipped: true, reason: 'latest already exists', from: latest.folder });
      continue;
    }

    const fromPrefix = `${app}/${latest.folder}`;
    const toPrefix = `${app}/latest`;
    console.log(`   ✎  ${latest.folder}/ → latest/`);

    const stats = await renamePrefix(client, BUCKET_NAME, fromPrefix, toPrefix, dryRun);
    results.push({
      app,
      skipped: false,
      from: latest.folder,
      ...stats,
      url: `${serverUrl}/${BUCKET_NAME}/${toPrefix}/index.html`,
    });
    console.log(`   ✅ Done (${stats.copied} moved, ${stats.failed} failed)`);
  }

  console.log('\n══════════════════════════════════════════════════');
  console.log(' Summary');
  console.log('══════════════════════════════════════════════════');
  for (const r of results) {
    if (r.skipped) {
      console.log(`- ${r.app}: skipped (${r.reason}${r.from ? `, kept ${r.from}` : ''})`);
    } else {
      console.log(`- ${r.app}: ${r.from} → latest (${r.copied}/${r.total} objects)`);
      if (r.url) console.log(`  Open: ${r.url}`);
    }
  }
  console.log('══════════════════════════════════════════════════');

  if (results.some((r) => !r.skipped && r.failed > 0)) process.exitCode = 1;
}

main().catch((err) => {
  console.error('\nFatal:', err?.message || err);
  process.exitCode = 1;
});
