import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const errors = [];

function fail(message) {
  errors.push(message);
}

function read(file) {
  return fs.readFileSync(file, "utf8");
}

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else acc.push(full);
  }
  return acc;
}

const siteSrc = read(path.join(root, "src/config/site.ts"));
function readConst(name) {
  const match = siteSrc.match(new RegExp(`${name}:\\s*"([^"]+)"`));
  if (!match) fail(`Missing ${name} in site.ts`);
  return match ? match[1] : "";
}

const brand = readConst("brand");
const documentTitle = readConst("documentTitle");
const quickExitUrl = readConst("quickExitUrl");
const verifiedOnLabel = readConst("verifiedOnLabel");

if (/насил|помош|sos|abuse|violence/i.test(documentTitle)) {
  fail(`documentTitle is not discreet: ${documentTitle}`);
}
if (!quickExitUrl.startsWith("https://")) fail("quickExitUrl must be https");

const verified = [
  { display: "141 700", kind: "short" },
  { display: "15 315", kind: "short" },
  { display: "192", kind: "short" },
  { display: "075 255 154", kind: "local" },
  { display: "075 344 770", kind: "local" },
  { display: "02 609 0066", kind: "local" },
  { display: "02 3200 007", kind: "local" },
  { display: "070 249 596", kind: "local" },
  { display: "02 3117 866", kind: "local" },
  { display: "071 266 101", kind: "local" },
  { display: "0800 44 222", kind: "freephone" },
  { display: "02 3220 870", kind: "local" },
  { display: "0800 11111", kind: "freephone" },
  { display: "070 390 632", kind: "local" },
];

function expectedTel(item) {
  const digits = item.display.replace(/\s+/g, "");
  if (!/^\d+$/.test(digits)) fail(`Bad display ${item.display}`);
  if (item.kind === "local") {
    if (!digits.startsWith("0") || digits.startsWith("0800")) fail(`Bad local ${item.display}`);
    return `tel:+389${digits.slice(1)}`;
  }
  return `tel:${digits}`;
}

const telSet = new Set(verified.map(expectedTel));
const orgUrls = [
  "https://krizencentar.org.mk/",
  "https://www.glasprotivnasilstvo.org.mk/",
  "https://hera.org.mk/",
  "https://esem.org.mk/",
  "https://mhc.org.mk/",
  "https://myla.org.mk/",
  "https://lastrada.org.mk/",
  "https://childrensembassy.org.mk/",
];
const allowedHttp = new Set([
  ...orgUrls,
  quickExitUrl,
  "http://www.w3.org/2000/svg",
  "http://www.w3.org/1999/xlink",
]);

const contactsSrc = read(path.join(root, "src/i18n/mk/contacts.ts"));
for (const item of verified) {
  if (!contactsSrc.includes(item.display)) fail(`Source contacts missing ${item.display}`);
}
for (const url of orgUrls) {
  if (!contactsSrc.includes(url)) fail(`Source contacts missing ${url}`);
}

const requiredPhrases = [
  "Национален совет за родова еднаквост",
  "Кризен центар „Надеж“",
  "Глас против насилство",
  "Скопје",
  "Тетово",
  "Канцеларија",
  "ХЕРА",
  "ЕСЕ",
  "Хелсиншки комитет",
  "МЗМП / MYLA",
  "Ла Страда",
  "Ало Бушавко",
  "Бесплатна SOS линија",
  `последна проверка: ${verifiedOnLabel}`,
];

if (!fs.existsSync(dist)) fail("dist/ is missing");

const files = fs.existsSync(dist) ? walk(dist) : [];
const htmlFiles = files.filter((file) => file.endsWith(".html"));
const textFiles = files.filter((file) => /\.(html|css|js|svg)$/.test(file));

const expectedPages = [
  "index.html",
  "404.html",
  "komu-da-se-javam/index.html",
  "sokrij-gi-tragite/index.html",
  "statii/index.html",
  "statii/komu-da-se-javis/index.html",
  "statii/ljubov-ili-kontrola/index.html",
  "statii/znaci-na-opasnost/index.html",
  "statii/plan-za-bezbednost/index.html",
  "statii/kako-da-pomognes/index.html",
];

for (const rel of expectedPages) {
  if (!fs.existsSync(path.join(dist, rel))) fail(`Missing page ${rel}`);
}

const fontPath = path.join(dist, "fonts/nunito-mk.woff2");
if (!fs.existsSync(fontPath) || fs.statSync(fontPath).size < 20000) {
  fail("Self-hosted Nunito subset is missing or too small");
}
if (!fs.existsSync(path.join(dist, "fonts/OFL.txt"))) fail("Nunito OFL license missing");
if (!read(path.join(dist, "safety.js")).includes("location.replace")) {
  fail("safety.js must use location.replace");
}

const forbidden = [
  "fonts.googleapis",
  "fonts.gstatic",
  "google-analytics",
  "googletagmanager",
  "cloudflareinsights",
  "facebook.net",
  "doubleclick",
  "hotjar",
  "segment.io",
  "sentry.io",
  "cdn.jsdelivr",
  "unpkg.com",
  "polyfill.io",
  "document.cookie",
  "gtag(",
  "<form",
  "<iframe",
  "<input",
  "<textarea",
];

const draftPages = expectedPages.filter((rel) => rel.startsWith("statii/") && rel !== "statii/index.html");

for (const file of textFiles) {
  const text = read(file);
  const rel = path.relative(dist, file);
  for (const needle of forbidden) {
    if (text.toLowerCase().includes(needle)) fail(`${rel} contains ${needle}`);
  }
  const urls = text.match(/https?:\/\/[^\s"'<>)]+/g) || [];
  for (const url of urls) {
    const clean = url.replace(/[.,;]+$/, "");
    if (!allowedHttp.has(clean)) fail(`${rel} has unexpected URL ${clean}`);
  }
}

const foundTels = new Set();
for (const file of htmlFiles) {
  const text = read(file);
  const rel = path.relative(dist, file);
  const title = text.match(/<title>([^<]*)<\/title>/);
  if (!title || title[1] !== documentTitle) fail(`${rel} title is not the discreet document title`);
  if (!text.includes(`lang="${"mk"}"`) && !text.includes("lang='mk'")) fail(`${rel} missing lang=mk`);
  if (!text.includes(`data-exit-url="${quickExitUrl}"`)) fail(`${rel} missing exit url`);
  if (!text.includes("data-quick-exit")) fail(`${rel} missing quick exit`);
  if (!text.includes('src="/safety.js"')) fail(`${rel} missing local safety script`);
  if (!text.includes('href="/sokrij-gi-tragite"')) fail(`${rel} missing cover-tracks link`);
  if (!text.includes("Информации, не правен совет")) fail(`${rel} missing disclaimer`);
  if (!text.includes(brand)) fail(`${rel} missing brand`);
  if (!text.includes("15 315") || !text.includes("141 700") || !text.includes("192")) {
    fail(`${rel} missing help-bar numbers`);
  }
  for (const match of text.matchAll(/tel:\+?\d+/g)) foundTels.add(match[0]);
  for (const match of text.matchAll(/\shref="([^"]+)"/g)) {
    const href = match[1];
    if (href.startsWith("#")) {
      const id = href.slice(1);
      if (!text.includes(`id="${id}"`)) fail(`${rel} missing id ${id}`);
      continue;
    }
    if (href.startsWith("tel:") || href.startsWith("https://") || href.startsWith("http://")) continue;
    const clean = href.split("#")[0].split("?")[0];
    const asFile = clean.replace(/^\//, "");
    const asIndex = clean === "/" ? "index.html" : `${asFile.replace(/\/$/, "")}/index.html`;
    if (!fs.existsSync(path.join(dist, asFile)) && !fs.existsSync(path.join(dist, asIndex))) {
      fail(`${rel} links to missing ${href}`);
    }
  }
  const scripts = [...text.matchAll(/<script[^>]*src="([^"]+)"/g)].map((match) => match[1]);
  if (scripts.some((src) => src !== "/safety.js")) fail(`${rel} has an unexpected script`);
  if (/<script(?![^>]*src=)[^>]*>/.test(text)) fail(`${rel} has an inline script`);
}

for (const tel of telSet) {
  if (!foundTels.has(tel)) fail(`Missing phone link ${tel}`);
}
for (const tel of foundTels) {
  if (!telSet.has(tel)) fail(`Unexpected phone link ${tel}`);
}

const contactsHtml = read(path.join(dist, "komu-da-se-javam/index.html"));
for (const item of verified) {
  if (!contactsHtml.includes(item.display)) fail(`Contacts page missing ${item.display}`);
  if (!contactsHtml.includes(expectedTel(item))) fail(`Contacts page missing ${expectedTel(item)}`);
}
for (const phrase of requiredPhrases) {
  if (!contactsHtml.includes(phrase)) fail(`Contacts page missing phrase: ${phrase}`);
}
for (const url of orgUrls) {
  if (!contactsHtml.includes(url)) fail(`Contacts page missing ${url}`);
}

for (const rel of draftPages) {
  const text = read(path.join(dist, rel));
  if (!text.includes("Наскоро")) fail(`${rel} is not marked Наскоро`);
  if (!text.includes("noindex")) fail(`${rel} draft is indexable`);
}

const home = read(path.join(dist, "index.html"));
const firstSos = home.indexOf("15 315");
const firstFree = home.indexOf("141 700");
const firstPolice = home.indexOf("192");
if (!(firstSos !== -1 && firstSos < firstFree && firstFree < firstPolice)) {
  fail("Homepage help bar is not in the order 15 315, 141 700, 192");
}

if (errors.length) {
  console.error(`Privacy and content check failed (${errors.length}):`);
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`Checked ${htmlFiles.length} pages, ${telSet.size} phone links, no third-party requests.`);
