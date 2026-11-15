import { URLS } from "@/config";
import axios from "axios";
import { promises as fs } from "fs";
import path from "path";

/**
 * Surah fetching for the static export.
 *
 * Every Quran page is prerendered at build time, and each of the 6,236 ayat
 * pages needs its surah's JSON (in generateStaticParams, generateMetadata and
 * the page itself). To keep this at 114 API calls total we cache in two layers:
 *
 *  1. an in-process Map of promises keyed by surah number (shared by everything
 *     running in the same build worker), and
 *  2. a disk cache in `.cache/quran/<n>.json` shared across build workers and
 *     across repeated builds (delete the folder to refetch).
 *
 * Failed API calls are retried with exponential backoff.
 */

const CACHE_DIR = path.join(process.cwd(), ".cache", "quran");
const MAX_ATTEMPTS = 5;

const inflight = new Map<number, Promise<SurahDetailResponse>>();

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function readDiskCache(number: number): Promise<SurahDetailResponse | null> {
  try {
    const raw = await fs.readFile(path.join(CACHE_DIR, `${number}.json`), "utf8");
    return JSON.parse(raw) as SurahDetailResponse;
  } catch {
    return null;
  }
}

async function writeDiskCache(number: number, data: SurahDetailResponse) {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
    const file = path.join(CACHE_DIR, `${number}.json`);
    // Write to a temp file then rename so concurrent workers never read a
    // partially written file.
    const tmp = `${file}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
    await fs.writeFile(tmp, JSON.stringify(data));
    await fs.rename(tmp, file);
  } catch (error) {
    console.warn("Could not write Quran cache", error);
  }
}

async function fetchFromApi(number: number): Promise<SurahDetailResponse> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await axios.get(`${URLS.quranApi}/surah/${number}`, {
        timeout: 30000,
      });
      return response.data as SurahDetailResponse;
    } catch (error) {
      lastError = error;
      if (attempt < MAX_ATTEMPTS) {
        await sleep(500 * 2 ** (attempt - 1));
      }
    }
  }
  console.error(`Failed to fetch Quran surah ${number}`, lastError);
  throw lastError;
}

export const fetchQuranSuratByNumber = (
  number: number
): Promise<SurahDetailResponse> => {
  if (!Number.isInteger(number) || number < 1 || number > 114) {
    return Promise.reject(new Error("Invalid surah number"));
  }

  const existing = inflight.get(number);
  if (existing) return existing;

  const promise = (async () => {
    const cached = await readDiskCache(number);
    if (cached) return cached;
    const data = await fetchFromApi(number);
    await writeDiskCache(number, data);
    return data;
  })();

  // Don't memoize failures, so a later caller can retry.
  promise.catch(() => inflight.delete(number));
  inflight.set(number, promise);
  return promise;
};

/**
 * Warm the cache for all 114 surahs with limited concurrency. Returns the
 * surahs keyed by number.
 */
export async function fetchAllQuranSurahs(
  concurrency = 6
): Promise<Map<number, SurahDetailResponse>> {
  const result = new Map<number, SurahDetailResponse>();
  const queue = Array.from({ length: 114 }, (_, i) => i + 1);

  await Promise.all(
    Array.from({ length: concurrency }, async () => {
      for (let n = queue.shift(); n !== undefined; n = queue.shift()) {
        result.set(n, await fetchQuranSuratByNumber(n));
      }
    })
  );
  return result;
}
