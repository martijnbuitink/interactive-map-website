import { mapPoints } from './data/cities/amsterdam/index.js';

const TIMEOUT_MS = 12000;

function withTimeout(promise, ms) {
  return Promise.race([
    promise,
    new Promise((_, reject) => {
      setTimeout(() => reject(new Error('timeout')), ms);
    })
  ]);
}

async function checkUrl(url) {
  try {
    const headResponse = await withTimeout(
      fetch(url, { method: 'HEAD', redirect: 'follow' }),
      TIMEOUT_MS
    );

    if (headResponse.ok) {
      return { ok: true, status: headResponse.status, method: 'HEAD' };
    }

    const getResponse = await withTimeout(
      fetch(url, { method: 'GET', redirect: 'follow' }),
      TIMEOUT_MS
    );

    return { ok: getResponse.ok, status: getResponse.status, method: 'GET' };
  } catch (error) {
    return { ok: false, status: null, method: 'ERROR', error: error.message };
  }
}

async function run() {
  const results = [];

  for (let i = 0; i < mapPoints.length; i += 1) {
    const point = mapPoints[i];
    const result = await checkUrl(point.image);
    results.push({ index: i, title: point.title, url: point.image, ...result });
  }

  const okResults = results.filter((entry) => entry.ok);
  const failedResults = results.filter((entry) => !entry.ok);

  console.log(`Totaal gecontroleerd: ${results.length}`);
  console.log(`OK: ${okResults.length}`);
  console.log(`FOUT: ${failedResults.length}`);

  if (failedResults.length > 0) {
    console.log('\nNiet-bereikbare afbeeldingen:');
    failedResults.forEach((entry) => {
      const reason = entry.status ? `HTTP ${entry.status}` : entry.error;
      console.log(`- [${entry.index}] ${entry.title} -> ${reason}`);
      console.log(`  ${entry.url}`);
    });
    process.exitCode = 1;
  }
}

run();
