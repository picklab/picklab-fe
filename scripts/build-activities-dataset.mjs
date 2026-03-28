import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

const USER_AGENT =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36";

const DEFAULT_IMAGE_URL = "/imgs/default-activity.png";

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

function extractByRegex(text, regex) {
  const match = text.match(regex);
  return match?.[1] ? normalizeText(decodeHtml(match[1])) : null;
}

function toAbsoluteUrl(href, baseUrl) {
  if (!href) return null;
  try {
    return new URL(href, baseUrl).toString();
  } catch {
    return null;
  }
}

function cleanOrganizer(value) {
  const text = normalizeText(value);
  if (!text) return null;
  return text.replace(/[\/\s]+$/g, "") || null;
}

function parseIsoDateRange(text) {
  const source = normalizeText(text);
  if (!source) {
    return { start: null, end: null };
  }

  const matches = [...source.matchAll(/(20\d{2}|\d{2})[.\-/]\s*(\d{1,2})[.\-/]\s*(\d{1,2})/g)];
  if (matches.length === 0) {
    return { start: null, end: null };
  }

  const format = (match) => {
    const year = match[1].length === 2 ? `20${match[1]}` : match[1];
    return `${year}-${match[2].padStart(2, "0")}-${match[3].padStart(2, "0")}`;
  };

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

function parseDate(value) {
  if (!value) return 0;
  const timestamp = new Date(value).getTime();
  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function normalizeJobs(raw) {
  if (Array.isArray(raw)) {
    const values = raw.map((item) => normalizeText(String(item))).filter(Boolean);
    return values.length > 0 ? values.slice(0, 5) : ["기타"];
  }

  const text = normalizeText(raw);
  if (!text) return ["기타"];

  const parts = text.split(/[,/;|]/).map((part) => normalizeText(part)).filter(Boolean);
  return parts.length > 0 ? parts.slice(0, 5) : ["기타"];
}

function getCategoryKey(rawCategory) {
  const category = normalizeText(rawCategory);
  if (!category) return "EXTRACURRICULAR";

  if (/(세미나|강연|컨퍼런스|설명회)/i.test(category)) return "SEMINAR";
  if (/(교육|부트캠프|아카데미|클래스|강의)/i.test(category)) return "EDUCATION";
  if (/(공모전|해커톤|competition|contest)/i.test(category)) return "CONTEST_HACKATHON";
  return "EXTRACURRICULAR";
}

function getCategoryLabel(categoryKey) {
  return {
    EXTRACURRICULAR: "대외활동",
    EDUCATION: "교육",
    CONTEST_HACKATHON: "공모전/해커톤",
    SEMINAR: "강연/세미나",
  }[categoryKey];
}

function getBadge(applicationEndAt) {
  if (!applicationEndAt) {
    return { badgeText: "모집중", badgeVariant: "default", isFinished: false };
  }

  const today = new Date();
  const end = new Date(applicationEndAt);
  const diffDays = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { badgeText: "마감", badgeVariant: "deadline", isFinished: true };
  }

  if (diffDays <= 7) {
    return { badgeText: `D-${String(diffDays).padStart(2, "0")}`, badgeVariant: "deadline", isFinished: false };
  }

  return { badgeText: "모집중", badgeVariant: "default", isFinished: false };
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
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

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: {
      "User-Agent": USER_AGENT,
      Accept: "application/json,text/plain;q=0.9,*/*;q=0.8",
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status} ${response.statusText} (${url})`);
  }

  return response.json();
}

function mapAllConListItem(row) {
  const titleHtml = row.cl_title || "";
  const hrefMatch = titleHtml.match(/href=['"]([^'"]+)['"]/i);
  const dateInfo = parseIsoDateRange(row.cl_date);

  return {
    title: stripHtml(titleHtml),
    organizer: normalizeText(row.cl_host),
    summary: stripHtml(row.cl_status),
    category: stripHtml(row.cl_cate),
    applicationStartAt: dateInfo.start,
    applicationEndAt: dateInfo.end,
    activityStartAt: null,
    activityEndAt: null,
    sourceUrl: toAbsoluteUrl(hrefMatch?.[1], "https://www.all-con.co.kr"),
    thumbnailUrl: null,
    source: "all-con",
    companyName: normalizeText(row.cl_host),
    tags: stripHtml(row.cl_cate),
  };
}

async function crawlAllConPages() {
  const first = await fetchJson("https://www.all-con.co.kr/page/ajax.contest_list.php?t=2&page=1");
  const totalPage = Number(first.totalPage || 1);
  const items = [...(first.rows || []).map(mapAllConListItem)];

  for (let page = 2; page <= totalPage; page += 1) {
    const json = await fetchJson(`https://www.all-con.co.kr/page/ajax.contest_list.php?t=2&page=${page}`);
    items.push(...(json.rows || []).map(mapAllConListItem));
  }

  return items;
}

function mapWevityListHtml(html) {
  const itemRegex =
    /<li>\s*<a href="([^"]+)"><img src="([^"]+)" alt="([^"]*)"><\/a>\s*<div class="hide-info">\s*<div class="hide-dday">([^<]*)<\/div>\s*<div class="hide-tit">\s*<a href="[^"]+">([^<]*)<\/a>\s*<\/div>\s*<div class="hide-cat">\s*([\s\S]*?)<\/div>/g;

  const results = [];
  let match;
  while ((match = itemRegex.exec(html)) !== null) {
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
      source: "wevity",
      companyName: null,
      tags: stripHtml(category),
    });
  }
  return results;
}

async function crawlWevityPages() {
  const firstHtml = await fetchText("https://www.wevity.com/?c=active&s=1&gub=1&gp=1");
  const pageNumbers = [...firstHtml.matchAll(/\?c=active&s=1&gub=1&gp=(\d+)/g)].map((match) => Number(match[1]));
  const totalPage = Math.max(...pageNumbers);
  const items = [...mapWevityListHtml(firstHtml)];

  for (let page = 2; page <= totalPage; page += 1) {
    const html = await fetchText(`https://www.wevity.com/?c=active&s=1&gub=1&gp=${page}`);
    items.push(...mapWevityListHtml(html));
  }

  return items;
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

async function enrichInBatches(items, enrichFn, concurrency = 4) {
  const results = [];
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    const enriched = await Promise.all(batch.map((item) => enrichFn(item).catch(() => item)));
    results.push(...enriched);
  }
  return results;
}

function dedupeBySourceUrl(items) {
  const seen = new Set();
  return items.filter((item) => {
    const key = item.sourceUrl || `${item.source}:${item.title}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function toFrontendActivity(item) {
  const title = normalizeText(item.title) || "untitled";
  const categoryKey = getCategoryKey(item.category);
  const categoryLabel = getCategoryLabel(categoryKey);
  const badge = getBadge(item.applicationEndAt);
  const idBase = item.sourceUrl || `${item.source}-${title}`;

  return {
    id: slugify(idBase),
    source: item.source,
    sourceUrl: normalizeText(item.sourceUrl),
    title,
    companyName: normalizeText(item.organizer) || normalizeText(item.companyName) || "주최 정보 없음",
    summary: normalizeText(item.summary),
    categoryKey,
    categoryLabel,
    imageUrl: normalizeText(item.thumbnailUrl) || DEFAULT_IMAGE_URL,
    thumbnail: normalizeText(item.thumbnailUrl) || DEFAULT_IMAGE_URL,
    startDate: item.applicationStartAt || null,
    endDate: item.applicationEndAt || null,
    activityStartDate: item.activityStartAt || null,
    activityEndDate: item.activityEndAt || null,
    badgeText: badge.badgeText,
    badgeVariant: badge.badgeVariant,
    isFinished: badge.isFinished,
    isBookmarked: false,
    label: categoryLabel,
    organization: normalizeText(item.organizer) || normalizeText(item.companyName) || "주최 정보 없음",
    jobs: normalizeJobs(item.tags || item.category),
    saveCount: 0,
    viewCount: 0,
    raw: item,
  };
}

async function writeJson(relativePath, data) {
  const outputPath = new URL(`../${relativePath}`, import.meta.url);
  await mkdir(path.dirname(outputPath.pathname), { recursive: true });
  await writeFile(outputPath, JSON.stringify(data, null, 2), "utf8");
}

async function main() {
  const [allConRaw, wevityRaw] = await Promise.all([crawlAllConPages(), crawlWevityPages()]);
  const dedupedAllConRaw = dedupeBySourceUrl(allConRaw);
  const dedupedWevityRaw = dedupeBySourceUrl(wevityRaw);

  const [allConEnriched, wevityEnriched] = await Promise.all([
    enrichInBatches(dedupedAllConRaw, enrichAllConItem),
    enrichInBatches(dedupedWevityRaw, enrichWevityItem),
  ]);

  const allConNormalized = dedupeBySourceUrl(allConEnriched).map(toFrontendActivity);
  const wevityNormalized = dedupeBySourceUrl(wevityEnriched).map(toFrontendActivity);
  const merged = [...allConNormalized, ...wevityNormalized].sort((a, b) => {
    const aDate = parseDate(a.startDate);
    const bDate = parseDate(b.startDate);
    return bDate - aDate;
  });

  await writeJson("data/raw/allcon.all.json", dedupedAllConRaw);
  await writeJson("data/raw/wevity.all.json", dedupedWevityRaw);
  await writeJson("data/raw/allcon.all.enriched.json", allConEnriched);
  await writeJson("data/raw/wevity.all.enriched.json", wevityEnriched);
  await writeJson("data/allcon.normalized.json", allConNormalized);
  await writeJson("data/wevity.normalized.json", wevityNormalized);
  await writeJson("data/activities.latest.json", merged);

  console.log(JSON.stringify({
    allcon: allConNormalized.length,
    wevity: wevityNormalized.length,
    total: merged.length,
  }, null, 2));
}

main().catch((error) => {
  console.error("Build dataset failed:", error);
  process.exit(1);
});
