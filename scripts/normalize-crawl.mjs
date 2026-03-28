import { parseArgs } from "node:util";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const CATEGORY_LABELS = {
  EXTRACURRICULAR: "대외활동",
  EDUCATION: "교육",
  CONTEST_HACKATHON: "공모전/해커톤",
  SEMINAR: "강연/세미나",
};

const DEFAULT_IMAGE_URL = "/imgs/default-activity.png";

const { values } = parseArgs({
  options: {
    input: { type: "string" },
    output: { type: "string" },
    source: { type: "string", default: "unknown" },
    category: { type: "string" },
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
  if (typeof value !== "string") return null;
  const normalized = value.replace(/\s+/g, " ").trim();
  return normalized || null;
}

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function parseDate(value) {
  const text = normalizeText(value);
  if (!text) return null;

  const normalized = text.replace(/\./g, "-").replace(/\//g, "-");
  const match = normalized.match(/(\d{4})-(\d{1,2})-(\d{1,2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  const iso = `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
  return Number.isNaN(Date.parse(iso)) ? null : iso;
}

function getCategoryKey(rawCategory, forcedCategory) {
  const category = normalizeText(forcedCategory) || normalizeText(rawCategory);
  if (!category) return "EXTRACURRICULAR";

  if (/(세미나|강연|컨퍼런스|설명회)/i.test(category)) return "SEMINAR";
  if (/(교육|부트캠프|아카데미|클래스|강의)/i.test(category)) return "EDUCATION";
  if (/(공모전|해커톤|competition|contest)/i.test(category)) return "CONTEST_HACKATHON";
  return "EXTRACURRICULAR";
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

function toFrontendActivity(item, index) {
  if (item && typeof item === "object" && "categoryKey" in item && "companyName" in item) {
    return item;
  }

  const title = normalizeText(item.title) || `untitled-${index + 1}`;
  const source = normalizeText(item.source) || values.source;
  const categoryKey = getCategoryKey(item.category, values.category);
  const categoryLabel = CATEGORY_LABELS[categoryKey];
  const applicationStartAt = parseDate(item.applicationStartAt);
  const applicationEndAt = parseDate(item.applicationEndAt);
  const activityStartAt = parseDate(item.activityStartAt);
  const activityEndAt = parseDate(item.activityEndAt);
  const badge = getBadge(applicationEndAt);
  const idBase = item.sourceUrl || `${source}-${title}-${index + 1}`;

  return {
    id: slugify(idBase),
    source,
    sourceUrl: normalizeText(item.sourceUrl),
    title,
    companyName: normalizeText(item.organizer) || normalizeText(item.companyName) || "주최 정보 없음",
    summary: normalizeText(item.summary),
    categoryKey,
    categoryLabel,
    imageUrl: normalizeText(item.thumbnailUrl) || DEFAULT_IMAGE_URL,
    thumbnail: normalizeText(item.thumbnailUrl) || DEFAULT_IMAGE_URL,
    startDate: applicationStartAt,
    endDate: applicationEndAt,
    activityStartDate: activityStartAt,
    activityEndDate: activityEndAt,
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

async function main() {
  const input = required("input");
  const output = required("output");
  const fileContent = await readFile(input, "utf8");
  const parsed = JSON.parse(fileContent);

  if (!Array.isArray(parsed)) {
    console.error("Input JSON must be an array.");
    process.exit(1);
  }

  const normalized = parsed.map(toFrontendActivity);
  const payload = JSON.stringify(normalized, null, 2);
  await mkdir(path.dirname(output), { recursive: true });
  await writeFile(output, payload, "utf8");
  console.log(payload);
}

main().catch((error) => {
  console.error("Normalize failed:", error);
  process.exit(1);
});
