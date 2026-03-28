import { chromium } from "playwright";
import { parseArgs } from "node:util";

const { values } = parseArgs({
  options: {
    url: { type: "string" },
    list: { type: "string" },
    title: { type: "string" },
    organizer: { type: "string" },
    summary: { type: "string" },
    link: { type: "string" },
    category: { type: "string" },
    thumbnail: { type: "string" },
    startDate: { type: "string" },
    endDate: { type: "string" },
    limit: { type: "string" },
    waitMs: { type: "string" },
    dumpPageText: { type: "boolean", default: false },
    headful: { type: "boolean", default: false },
  },
  allowPositionals: false,
});

function required(name) {
  const value = values[name];
  if (!value) {
    console.error(`Missing required option: --${name}`);
    process.exit(1);
  }
  return value;
}

function normalizeText(value) {
  if (!value) return null;
  return value.replace(/\s+/g, " ").trim() || null;
}

function normalizeUrl(rawHref, baseUrl) {
  if (!rawHref) return null;
  try {
    return new URL(rawHref, baseUrl).toString();
  } catch {
    return null;
  }
}

function normalizeDate(rawValue) {
  const value = normalizeText(rawValue);
  if (!value) return null;

  const compact = value.replace(/\./g, "-").replace(/\//g, "-");
  const match = compact.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!match) return value;

  const [, year, month, day] = match;
  const isoDate = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return Number.isNaN(Date.parse(isoDate)) ? value : isoDate;
}

async function getText(target, selector) {
  if (!selector) return null;
  const node = target.locator(selector).first();
  if ((await node.count()) === 0) return null;
  return normalizeText(await node.textContent());
}

async function getAttribute(target, selector, attribute) {
  if (!selector) return null;
  const node = target.locator(selector).first();
  if ((await node.count()) === 0) return null;
  return normalizeText(await node.getAttribute(attribute));
}

async function extractItem(element, baseUrl) {
  const title = await getText(element, values.title);
  const organizer = await getText(element, values.organizer);
  const summary = await getText(element, values.summary);
  const category = await getText(element, values.category);
  const startDate = normalizeDate(await getText(element, values.startDate));
  const endDate = normalizeDate(await getText(element, values.endDate));
  const href = await getAttribute(element, values.link, "href");
  const imageSrc = await getAttribute(element, values.thumbnail, "src");

  return {
    title,
    organizer,
    summary,
    category,
    applicationStartAt: startDate,
    applicationEndAt: endDate,
    sourceUrl: normalizeUrl(href, baseUrl),
    thumbnailUrl: normalizeUrl(imageSrc, baseUrl),
  };
}

async function main() {
  const url = required("url");
  const browser = await chromium.launch({ headless: !values.headful });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: "domcontentloaded" });

    if (values.waitMs) {
      await page.waitForTimeout(Number(values.waitMs));
    }

    if (values.dumpPageText) {
      const bodyText = normalizeText(await page.locator("body").textContent());
      console.log(JSON.stringify({ url, bodyText }, null, 2));
      return;
    }

    const listSelector = required("list");
    const limit = values.limit ? Number(values.limit) : undefined;
    const items = page.locator(listSelector);
    const count = await items.count();
    const max = limit ? Math.min(limit, count) : count;
    const results = [];

    for (let i = 0; i < max; i += 1) {
      const item = await extractItem(items.nth(i), url);
      if (item.title || item.sourceUrl) {
        results.push(item);
      }
    }

    console.log(JSON.stringify(results, null, 2));
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error("Crawler failed:", error);
  process.exit(1);
});
