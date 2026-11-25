import { CATEGORIES } from '../constants/bookConstants';
import { createSeedLibrary } from './seedData';

export const STORAGE_KEY = 'libris_library_state_v1';
const MAX_IMPORT_BYTES = 2 * 1024 * 1024;
const FORBIDDEN_KEYS = new Set(['__proto__', 'constructor', 'prototype']);
const ALLOWED_STATUSES = new Set(['todo', 'reading', 'completed']);

function isPlainObject(val) {
  return Boolean(val) && typeof val === 'object' && !Array.isArray(val);
}

function clampString(val, maxLen, fallback = '') {
  if (typeof val !== 'string') return fallback;
  return val.trim().slice(0, maxLen);
}

/**
 * Yalnızca http: ve https: protokollerine izin vererek javascript:/data: XSS saldırılarını önler.
 */
export function sanitizeHttpUrl(rawUrl) {
  if (typeof rawUrl !== 'string' || !rawUrl.trim()) return '';
  try {
    const parsed = new URL(rawUrl.trim());
    if (parsed.protocol === 'https:' || parsed.protocol === 'http:') {
      return parsed.toString().slice(0, 500);
    }
    return '';
  } catch {
    return '';
  }
}

function sanitizeQuotes(rawQuotes) {
  if (!Array.isArray(rawQuotes)) return [];
  const cleaned = [];
  for (const item of rawQuotes.slice(0, 100)) {
    if (!isPlainObject(item)) continue;
    const text = clampString(item.text, 600);
    if (!text) continue;
    const id = clampString(item.id, 64) || `q_${Date.now()}_${cleaned.length}`;
    if (FORBIDDEN_KEYS.has(id)) continue;

    let page = null;
    if (item.page !== null && item.page !== undefined && item.page !== '') {
      const pNum = Number(item.page);
      if (Number.isInteger(pNum) && pNum >= 1 && pNum <= 10000) {
        page = pNum;
      }
    }

    cleaned.push({
      id,
      page,
      text,
      createdAt:
        typeof item.createdAt === 'string'
          ? item.createdAt.slice(0, 40)
          : new Date().toISOString(),
    });
  }
  return cleaned;
}

function sanitizeBook(raw, index) {
  if (!isPlainObject(raw)) return null;
  const title = clampString(raw.title, 120);
  const author = clampString(raw.author, 80) || 'Bilinmeyen Yazar';
  if (!title) return null;

  const id = clampString(raw.id, 64) || `book_${Date.now()}_${index}`;
  if (FORBIDDEN_KEYS.has(id)) return null;

  const category = CATEGORIES[raw.category] ? raw.category : 'literature';
  const status = ALLOWED_STATUSES.has(raw.status) ? raw.status : 'todo';

  const rawTotal = Number(raw.totalPages);
  const totalPages =
    Number.isFinite(rawTotal) && rawTotal >= 1 ? Math.min(10000, Math.round(rawTotal)) : 200;

  let currentPage = 0;
  if (status === 'completed') {
    currentPage = totalPages;
  } else if (status === 'reading') {
    const rawCurrent = Number(raw.currentPage);
    currentPage = Number.isFinite(rawCurrent)
      ? Math.max(0, Math.min(totalPages, Math.round(rawCurrent)))
      : 0;
  }

  const rawYear = Number(raw.publishedYear);
  const publishedYear =
    Number.isInteger(rawYear) && rawYear >= 100 && rawYear <= 2100 ? rawYear : null;

  const rawRating = Number(raw.rating);
  const rating =
    Number.isInteger(rawRating) && rawRating >= 0 && rawRating <= 5 ? rawRating : 0;

  return {
    id,
    title,
    author,
    category,
    status,
    totalPages,
    currentPage,
    coverUrl: sanitizeHttpUrl(raw.coverUrl),
    publishedYear,
    rating,
    quotes: sanitizeQuotes(raw.quotes),
    createdAt:
      typeof raw.createdAt === 'string'
        ? raw.createdAt.slice(0, 40)
        : new Date().toISOString(),
    updatedAt:
      typeof raw.updatedAt === 'string'
        ? raw.updatedAt.slice(0, 40)
        : new Date().toISOString(),
  };
}

export function validateAndSanitizeLibrary(raw) {
  if (!isPlainObject(raw)) {
    throw new Error('Geçersiz yedek formatı: Kök yapı JSON nesnesi olmalıdır.');
  }

  const rawBooks = Array.isArray(raw.books) ? raw.books.slice(0, 500) : [];
  const books = [];
  const seenIds = new Set();

  rawBooks.forEach((item, idx) => {
    const book = sanitizeBook(item, idx);
    if (book && !seenIds.has(book.id)) {
      seenIds.add(book.id);
      books.push(book);
    }
  });

  const rawSettings = isPlainObject(raw.settings) ? raw.settings : {};
  const goalNum = Number(rawSettings.yearlyGoal);
  const yearlyGoal =
    Number.isInteger(goalNum) && goalNum >= 1 && goalNum <= 500 ? goalNum : 20;

  return {
    version: 1,
    books,
    settings: {
      yearlyGoal,
      theme: rawSettings.theme === 'light' ? 'light' : 'dark',
      isDemoData: Boolean(rawSettings.isDemoData),
    },
  };
}

function safeJsonParse(text) {
  return JSON.parse(text, (key, value) => {
    if (FORBIDDEN_KEYS.has(key)) {
      return undefined;
    }
    return value;
  });
}

export function loadLibraryState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const seed = createSeedLibrary();
      saveLibraryState(seed);
      return seed;
    }
    const parsed = safeJsonParse(raw);
    return validateAndSanitizeLibrary(parsed);
  } catch {
    const seed = createSeedLibrary();
    saveLibraryState(seed);
    return seed;
  }
}

export function saveLibraryState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    return { ok: true };
  } catch (err) {
    return {
      ok: false,
      error:
        err?.name === 'QuotaExceededError'
          ? 'Tarayıcı depolama alanı doldu.'
          : 'Veriler tarayıcıya kaydedilemedi.',
    };
  }
}

export function exportLibraryJson(state) {
  const payload = {
    app: 'LIBRIS Book Kanban',
    exportedAt: new Date().toISOString(),
    ...state,
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `libris-kutuphane-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function importLibraryJsonFile(file) {
  if (!file) throw new Error('Lütfen bir JSON yedek dosyası seçin.');
  if (file.size > MAX_IMPORT_BYTES) {
    throw new Error('Dosya boyutu 2 MB güvenlik sınırını aşıyor.');
  }
  if (file.name && !file.name.toLowerCase().endsWith('.json')) {
    throw new Error('Yalnızca .json uzantılı yedek dosyaları kabul edilir.');
  }

  const text = await file.text();
  let parsed;
  try {
    parsed = safeJsonParse(text);
  } catch {
    throw new Error('Seçilen dosya geçerli bir JSON yapısında değil.');
  }

  const clean = validateAndSanitizeLibrary(parsed);
  clean.settings.isDemoData = false;
  return clean;
}
