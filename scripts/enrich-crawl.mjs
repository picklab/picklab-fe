import { parseArgs } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const { values } = parseArgs({
  options: {
    input: { type: "string" },
    output: { type: "string" },
    source: { type: "string" },
    limit: { type: "string" },
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
  const text = String(value).replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim();
  return text || null;
}

function stripHtml(value) {
  return normalizeText(String(value).replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, " "));
}

function decodeHtml(value) {
  return String(value)
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"');
}

function toAbsoluteUrl(href, baseUrl) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function extractByRegex(text, regex) {
  const match = text.match(regex);
  return match?.[1] ? normalizeText(decodeHtml(match[1])) : null;
}

function parseIsoDateRange(text) {
  const source = normalizeText(text);
  if (!source) {
    return { start: null, end: null };
  }

  const matches = [...source.matchAll(/(20\d{2})[.\-/]\s*(\d{1,2})[.\-/]\s*(\d{1,2})/g)];
  if (matches.length === 0) {
    return { start: null, end: null };
  }

  const format = (match) => `${match[1]}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  return {
    start: format(matches[0]),
    end: format(matches[matches.length - 1]),
  };
}

function summarizeText(text, maxLength = 220) {
  const value = normalizeText(text);
  if (!value) return null;
  return value.length > maxLength ? `${value.slice(0, maxLength - 1)}…` : value;
}

function cleanOrganizer(value) {
  const text = normalizeText(value);
  if (!text) return null;
  return text.replace(/[\/\s]+$/g, "") || null;
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

async function enrichWevityItem(item) {
  if (!item.sourceUrl) return item;
  const html = await fetchText(item.sourceUrl);

  const organizer = cleanOrganizer(extractByRegex(html, /name="agent" value="([^"]*)"/i));
  const during = extractByRegex(html, /name="during" value="([^"]*)"/i);
  const homepage = extractByRegex(html, /name="homepage" value="([^"]*)"/i);
  const contentHtml = extractByRegex(html, /<div class="comm-desc" id="viewContents">([\s\S]*?)<\/div>\s*<\/div>/i);
  const contentText = stripHtml(contentHtml || "");

  const applyRange = parseIsoDateRange(during);
  const activityLine = extractByRegex(contentText || "", /활동기간\s*:\s*([^\n]+)/i);
  const activityRange = parseIsoDateRange(activityLine);

  return {
    ...item,
    organizer: organizer || item.organizer,
    companyName: organizer || item.companyName,
    applicationStartAt: applyRange.start || item.applicationStartAt,
    applicationEndAt: applyRange.end || item.applicationEndAt,
    activityStartAt: activityRange.start || item.activityStartAt,
    activityEndAt: activityRange.end || item.activityEndAt,
    summary: summarizeText(contentText) || item.summary,
    homepageUrl: toAbsoluteUrl(homepage, "https://www.wevity.com"),
    content: contentText,
  };
}

async function enrichAllConItem(item) {
  if (!item.sourceUrl) return item;
  const html = await fetchText(item.sourceUrl);

  const ogImage = extractByRegex(html, /<meta property="og:image" content="([^"]+)"/i);
  const keywords = extractByRegex(html, /<meta name="keywords" content="([^"]+)"/i);
  const description = extractByRegex(html, /<meta property="og:description" content="([^"]+)"/i);
  const articleHtml = extractByRegex(html, /<div class="title">상세내용<\/div>\s*<div[^>]*>\s*([\s\S]*?)\s*<\/div>\s*<\/div>\s*<\/div>/i);
  const articleText = stripHtml(articleHtml || "");
  const host = cleanOrganizer(extractByRegex(html, /<td class='desc_host'>([\s\S]*?)<\/td>/i));
  const homepage = extractByRegex(html, /<a href="([^"]+)" target="_blank" title="접수처로 이동" class="cl_web">/i);
  const dateText = extractByRegex(html, /<td class='desc_date'>([\s\S]*?)<\/td>/i);

  const applicationLine = dateText
    || extractByRegex(articleText || "", /신청기간\s*:\s*([^\n]+)/i)
    || extractByRegex(articleText || "", /기간 및 일정\s*[-:]\s*([^\n]+)/i);
  const activityLine = extractByRegex(articleText || "", /활동기간\s*:\s*([^\n]+)/i);
  const applicationRange = parseIsoDateRange(applicationLine);
  const activityRange = parseIsoDateRange(activityLine);

  return {
    ...item,
    organizer: host || item.organizer,
    companyName: host || item.companyName,
    applicationStartAt: applicationRange.start || item.applicationStartAt,
    applicationEndAt: applicationRange.end || item.applicationEndAt,
    activityStartAt: activityRange.start || item.activityStartAt,
    activityEndAt: activityRange.end || item.activityEndAt,
    thumbnailUrl: toAbsoluteUrl(ogImage, "https://www.all-con.co.kr") || item.thumbnailUrl,
    summary: summarizeText(articleText || description) || item.summary,
    tags: keywords || item.tags,
    homepageUrl: toAbsoluteUrl(homepage, "https://www.all-con.co.kr"),
    content: articleText,
  };
}

async function main() {
  const input = required("input");
  const output = required("output");
  const source = required("source");
  const fileContent = await readFile(input, "utf8");
  const items = JSON.parse(fileContent);
  const limit = values.limit ? Number(values.limit) : items.length;

  if (!Array.isArray(items)) {
    console.error("Input JSON must be an array.");
    process.exit(1);
  }

  const enriched = [];

  for (const item of items.slice(0, limit)) {
    if (source === "wevity") {
      enriched.push(await enrichWevityItem(item));
    } else if (source === "allcon" || source === "all-con") {
      enriched.push(await enrichAllConItem(item));
    } else {
      enriched.push(item);
    }
  }

  const payload = JSON.stringify(enriched, null, 2);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, payload, "utf8");
  console.log(payload);
}

main().catch((error) => {
  console.error("Enrich failed:", error);
  process.exit(1);
});
