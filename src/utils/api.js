const OPEN_LIBRARY_SEARCH_URL = 'https://openlibrary.org/search.json';

function inferCategoryFromSubjects(subjects = []) {
  const joined = subjects.slice(0, 8).join(' ').toLowerCase();
  if (/computer|programming|software|algorithm|javascript|python|architecture/.test(joined)) {
    return 'software';
  }
  if (/physics|biology|astronomy|science|mathematics|cosmos/.test(joined)) {
    return 'science';
  }
  if (/philosophy|ethics|stoic|logic/.test(joined)) {
    return 'philosophy';
  }
  if (/history|biography|civilization|war/.test(joined)) {
    return 'history';
  }
  if (/psychology|habit|mind|cognitive|self-help/.test(joined)) {
    return 'psychology';
  }
  return 'literature';
}

/**
 * Open Library Search API üzerinden kitap, yazar, kapak ve sayfa sayısı verisi çeker.
 */
export async function searchOpenLibraryBooks(query) {
  const cleanQuery = String(query || '').trim();
  if (cleanQuery.length < 2) {
    return [];
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);

  try {
    const params = new URLSearchParams({
      q: cleanQuery,
      limit: '8',
      fields: 'key,title,author_name,first_publish_year,number_of_pages_median,cover_i,subject',
    });

    const response = await fetch(`${OPEN_LIBRARY_SEARCH_URL}?${params.toString()}`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Open Library API hatası (HTTP ${response.status})`);
    }

    const data = await response.json();
    const docs = Array.isArray(data?.docs) ? data.docs : [];

    return docs.map((doc, idx) => {
      const coverId = Number(doc.cover_i);
      const coverUrl =
        Number.isInteger(coverId) && coverId > 0
          ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
          : '';
      const pages = Number(doc.number_of_pages_median);
      const totalPages =
        Number.isFinite(pages) && pages >= 10 && pages <= 5000 ? Math.round(pages) : 240;

      return {
        externalKey: doc.key || `ol_${idx}`,
        title: String(doc.title || '').trim().slice(0, 120),
        author:
          Array.isArray(doc.author_name) && doc.author_name.length > 0
            ? String(doc.author_name[0]).trim().slice(0, 80)
            : 'Bilinmeyen Yazar',
        publishedYear: Number.isInteger(doc.first_publish_year)
          ? doc.first_publish_year
          : null,
        totalPages,
        coverUrl,
        category: inferCategoryFromSubjects(doc.subject),
      };
    });
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Open Library araması zaman aşımına uğradı. Lütfen tekrar deneyin.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}
