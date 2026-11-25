import { Quote, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORIES, CATEGORY_LIST } from '../constants/bookConstants';
import BookCover from './BookCover';

export default function QuotesView({ books, onOpenBook, onRemoveQuote }) {
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const allQuotes = useMemo(() => {
    const qLower = query.trim().toLowerCase();
    const list = [];

    books.forEach((book) => {
      if (categoryFilter !== 'all' && book.category !== categoryFilter) return;
      (book.quotes || []).forEach((q) => {
        if (qLower) {
          const hay = `${q.text} ${book.title} ${book.author}`.toLowerCase();
          if (!hay.includes(qLower)) return;
        }
        list.push({
          ...q,
          book,
        });
      });
    });

    return list;
  }, [books, query, categoryFilter]);

  return (
    <section className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-warm font-semibold">
            OKUR DEFTERİ &amp; KENAR NOTLARI
          </span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary mt-1">
            Altı Çizili Satırlar
          </h2>
          <p className="text-sm text-text-secondary mt-1">
            Okuduğunuz kitaplardan kaydettiğiniz tüm cümleler çizgili okuma defterinizde toplanır.
          </p>
        </div>
        <span className="font-mono text-xs px-3 py-1 rounded-md border border-border-subtle bg-bg-card text-text-secondary tabular-nums">
          Toplam {allQuotes.length} kayıt
        </span>
      </div>

      {/* Arama ve Kategori */}
      <div className="catalog-card rounded-xl p-3.5 flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Alıntı metni, kitap veya yazar ara..."
            className="w-full rounded-lg border border-border-subtle bg-bg-primary pl-9 pr-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
          />
        </div>

        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-xs text-text-primary focus:outline-none focus:border-accent-primary"
        >
          <option value="all">Tüm Kategoriler</option>
          {CATEGORY_LIST.map((c) => (
            <option key={c.id} value={c.id}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      {allQuotes.length === 0 ? (
        <div className="catalog-card rounded-xl p-12 text-center ruled-paper">
          <Quote className="w-7 h-7 text-accent-warm mx-auto mb-3" />
          <h3 className="font-display text-2xl font-semibold text-text-primary">
            Defterde henüz alıntı bulunmuyor
          </h3>
          <p className="text-xs text-text-secondary mt-1 max-w-md mx-auto">
            Okuma odasından herhangi bir kitabın kapağına tıklayarak yeni alıntılar ve sayfa
            notları ekleyebilirsiniz.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {allQuotes.map((item) => {
            const cat = CATEGORIES[item.book.category] || CATEGORIES.literature;
            return (
              <article
                key={item.id}
                className="catalog-card rounded-xl p-5 flex flex-col justify-between gap-4 ruled-paper"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span
                      className={`px-2 py-0.5 rounded border text-[10px] font-medium ${cat.badgeClass}`}
                    >
                      {cat.label}
                    </span>
                    {item.page && (
                      <span className="font-mono text-[11px] text-accent-warm tabular-nums">
                        Sayfa {item.page}
                      </span>
                    )}
                  </div>
                  <blockquote className="font-serif text-[16px] text-text-primary leading-relaxed italic border-l-2 border-accent-warm/60 pl-3.5">
                    &ldquo;{item.text}&rdquo;
                  </blockquote>
                </div>

                <div className="pt-3 border-t border-border-subtle flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => onOpenBook(item.book)}
                    className="flex items-center gap-3 text-left min-w-0 cursor-pointer group"
                  >
                    <BookCover book={item.book} size="sm" />
                    <div className="min-w-0">
                      <div className="font-display text-base font-semibold text-text-primary group-hover:text-accent-primary truncate">
                        {item.book.title}
                      </div>
                      <div className="text-[11px] text-text-secondary truncate">
                        {item.book.author}
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => onRemoveQuote(item.book.id, item.id)}
                    title="Alıntıyı sil"
                    className="p-1.5 rounded-md text-text-secondary hover:text-danger hover:bg-bg-secondary cursor-pointer shrink-0"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
