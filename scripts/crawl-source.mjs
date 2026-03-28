import { parseArgs } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const { values } = parseArgs({
  options: {
    source: { type: "string" },
    page: { type: "string", default: "1" },
    limit: { type: "string", default: "20" },
    output: { type: "string" },
  },
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
  if (value == null) return null;
  const text = String(value).replace(/\s+/g, " ").trim();
  return text || null;
}

function stripHtml(value) {
  return normalizeText(String(value).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " "));
}

function toAbsoluteUrl(href, baseUrl) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function parseAllConDateRange(value) {
  const text = normalizeText(value);
  if (!text) {
    return { applicationStartAt: null, applicationEndAt: null };
  }

  const match = text.match(/(\d{2})\.(\d{2})\.(\d{2})~(\d{2})\.(\d{2})\.(\d{2})/);
  if (!match) {
    return { applicationStartAt: null, applicationEndAt: null };
  }

  const [, startYear, startMonth, startDay, endYear, endMonth, endDay] = match;
  return {
    applicationStartAt: `20${startYear}-${startMonth}-${startDay}`,
    applicationEndAt: `20${endYear}-${endMonth}-${endDay}`,
  };
}

async function loadSources() {
  const content = await readFile(new URL("../crawler/sources.json", import.meta.url), "utf8");
  return JSON.parse(content);
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "text/html,application/json;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText} (${url})`);
  }

  return response.text();
}

async function crawlAllCon(config, page, limit) {
  const url = config.listUrl.replace("{page}", String(page));
  const body = await fetchText(url);
  const parsed = JSON.parse(body);

  return (parsed.rows || []).slice(0, limit).map((row) => {
    const titleHtml = row.cl_title || "";
    const hrefMatch = titleHtml.match(/href=['"]([^'"]+)['"]/i);
    const dateInfo = parseAllConDateRange(row.cl_date);

    return {
      title: stripHtml(titleHtml),
      organizer: normalizeText(row.cl_host),
      summary: stripHtml(row.cl_status),
      category: stripHtml(row.cl_cate),
      applicationStartAt: dateInfo.applicationStartAt,
      applicationEndAt: dateInfo.applicationEndAt,
      activityStartAt: null,
      activityEndAt: null,
      sourceUrl: toAbsoluteUrl(hrefMatch?.[1], "https://www.all-con.co.kr"),
      thumbnailUrl: null,
      source: config.source,
      companyName: normalizeText(row.cl_host),
      tags: stripHtml(row.cl_cate),
    };
  });
}

async function crawlWevity(config, page, limit) {
  const url = config.listUrl.replace("{page}", String(page));
  const html = await fetchText(url);

  const itemRegex =
    /<li>\s*<a href="([^"]+)"><img src="([^"]+)" alt="([^"]*)"><\/a>\s*<div class="hide-info">\s*<div class="hide-dday">([^<]*)<\/div>\s*<div class="hide-tit">\s*<a href="[^"]+">([^<]*)<\/a>\s*<\/div>\s*<div class="hide-cat">\s*([\s\S]*?)<\/div>/g;

  const results = [];
  let match;

  while ((match = itemRegex.exec(html)) !== null && results.length < limit) {
    const [, href, imageSrc, imageAlt, dday, title, category] = match;

    results.push({
      title: normalizeText(title || imageAlt),
      organizer: null,
      summary: normalizeText(dday),
      category: stripHtml(category),
      applicationStartAt: null,
      applicationEndAt: null,
      activityStartAt: null,
      activityEndAt: null,
      sourceUrl: toAbsoluteUrl(href, "https://www.wevity.com"),
      thumbnailUrl: toAbsoluteUrl(imageSrc, "https://www.wevity.com"),
      source: config.source,
      companyName: null,
      tags: stripHtml(category),
    });
  }

  return results;
}

async function main() {
  const sourceName = required("source");
  const page = Number(values.page);
  const limit = Number(values.limit);
  const sources = await loadSources();
  const config = sources[sourceName];

  if (!config) {
    console.error(`Unknown source: ${sourceName}`);
    process.exit(1);
  }

  if (!config.enabled) {
    console.error(config.reason || `${sourceName} is disabled.`);
    process.exit(1);
  }

  let results;
  if (config.mode === "json-endpoint") {
    results = await crawlAllCon(config, page, limit);
  } else if (config.mode === "html-list") {
    results = await crawlWevity(config, page, limit);
  } else {
    console.error(`Unsupported mode: ${config.mode}`);
    process.exit(1);
  }

  const payload = JSON.stringify(results, null, 2);
  if (values.output) {
    await mkdir(path.dirname(values.output), { recursive: true });
    await writeFile(values.output, payload, "utf8");
  }
  console.log(payload);
}

main().catch((error) => {
  console.error("Source crawl failed:", error);
  process.exit(1);
});
