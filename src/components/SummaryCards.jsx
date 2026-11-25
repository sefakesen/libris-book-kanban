import {
  BookCheck,
  BookOpenText,
  ChevronLeft,
  ChevronRight,
  Library,
  Quote,
  Sparkles,
  Target,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '../constants/bookConstants';
import BookCover from './BookCover';

export default function SummaryCards({
  books = [],
  summary,
  yearlyGoal,
  onQuickProgress,
  onOpenDetail,
}) {
  const readingBooks = useMemo(
    () => books.filter((b) => b.status === 'reading'),
    [books]
  );
  const nextUpBook = useMemo(
    () => books.find((b) => b.status === 'todo') || null,
    [books]
  );

  const [deskIndex, setDeskIndex] = useState(0);

  useEffect(() => {
    if (deskIndex >= readingBooks.length && readingBooks.length > 0) {
      setDeskIndex(0);
    }
  }, [readingBooks.length, deskIndex]);

  const featuredBook = readingBooks[deskIndex] || readingBooks[0] || nextUpBook;
  const featuredPct =
    featuredBook && featuredBook.totalPages > 0
      ? Math.min(100, Math.round((featuredBook.currentPage / featuredBook.totalPages) * 100))
      : 0;
  const featuredQuote = featuredBook?.quotes?.[0] || null;
  const featuredCategory = featuredBook
    ? CATEGORIES[featuredBook.category] || CATEGORIES.literature
    : null;

  return (
    <section
      className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch"
      aria-label="Okuma masası ve kütüphane sicili"
    >
      {/* Sol: Okuma Masası Vitrini */}
      <article className="lg:col-span-7 catalog-card rounded-xl p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between">
        {/* Sağ üstten sarkan bordo kurdele */}
        {featuredBook?.status === 'reading' && (
          <div
            className="ribbon-bookmark absolute top-0 right-6 w-5 h-10 pointer-events-none"
            aria-hidden="true"
          />
        )}

        <div className="flex items-center justify-between gap-2 border-b border-border-subtle pb-3">
          <div className="flex items-center gap-2">
            <BookOpenText className="w-4 h-4 text-accent-amber" />
            <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-warm font-semibold">
              {readingBooks.length > 0
                ? 'OKUMA MASASI · ŞU AN AÇIK ESER'
                : 'OKUMA MASASI · SIRADAKİ ÖNERİ'}
            </span>
          </div>

          {readingBooks.length > 1 && (
            <div className="flex items-center gap-1 pr-7">
              <button
                type="button"
                onClick={() =>
                  setDeskIndex((i) => (i - 1 + readingBooks.length) % readingBooks.length)
                }
                aria-label="Önceki aktif kitap"
                className="p-1 rounded border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-mono text-[10px] text-text-secondary px-1 tabular-nums">
                {deskIndex + 1}/{readingBooks.length}
              </span>
              <button
                type="button"
                onClick={() => setDeskIndex((i) => (i + 1) % readingBooks.length)}
                aria-label="Sonraki aktif kitap"
                className="p-1 rounded border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-text-secondary hover:text-text-primary cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {featuredBook ? (
          <div className="flex flex-col sm:flex-row gap-5 items-start pt-4">
            <button
              type="button"
              onClick={() => onOpenDetail?.(featuredBook)}
              className="book-3d-hover cursor-pointer focus:outline-none shrink-0"
              title="Kitabı aç ve not düş"
            >
              <BookCover book={featuredBook} size="lg" />
            </button>

            <div className="flex-1 min-w-0 space-y-3 w-full">
              <div>
                {featuredCategory && (
                  <span
                    className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${featuredCategory.badgeClass}`}
                  >
                    {featuredCategory.label}
                  </span>
                )}
                <h2 className="font-display text-2xl sm:text-[26px] font-semibold text-text-primary leading-tight mt-1.5">
                  {featuredBook.title}
                </h2>
                <p className="text-xs text-text-secondary mt-0.5">
                  {featuredBook.author}
                  {featuredBook.publishedYear ? ` · ${featuredBook.publishedYear}` : ''} ·{' '}
                  {featuredBook.totalPages} sayfa
                </p>
              </div>

              {featuredBook.status === 'reading' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums">
                    <span className="text-text-secondary">
                      Kaldığınız yer:{' '}
                      <strong className="text-text-primary">
                        {featuredBook.currentPage} / {featuredBook.totalPages}
                      </strong>
                    </span>
                    <span className="font-semibold text-accent-amber">%{featuredPct}</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-bg-secondary overflow-hidden border border-border-subtle/50">
                    <div
                      className="h-full bg-accent-amber transition-all duration-300"
                      style={{ width: `${featuredPct}%` }}
                    />
                  </div>
                </div>
              )}

              {featuredQuote ? (
                <blockquote className="rounded-lg border-l-2 border-accent-warm bg-bg-primary/80 px-3 py-2 font-serif text-xs italic text-text-primary line-clamp-2">
                  &ldquo;{featuredQuote.text}&rdquo;
                </blockquote>
              ) : (
                <p className="text-xs text-text-secondary italic">
                  Bu eserden henüz altı çizili bir satır eklenmemiş.
                </p>
              )}

              <div className="flex flex-wrap items-center gap-2 pt-1">
                {featuredBook.status === 'reading' && (
                  <button
                    type="button"
                    onClick={() =>
                      onQuickProgress?.(featuredBook.id, featuredBook.currentPage + 15)
                    }
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent-primary text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer"
                  >
                    <span>+15 Sayfa Okudum</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => onOpenDetail?.(featuredBook)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-xs font-medium text-text-primary transition-colors cursor-pointer"
                >
                  <span>Kitabı Aç &amp; Not Düş</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center space-y-2 paper-grain rounded-lg mt-3">
            <Sparkles className="w-6 h-6 text-accent-amber mx-auto" />
            <p className="font-display text-xl text-text-primary">
              Okuma masanız yeni bir eser bekliyor
            </p>
            <p className="text-xs text-text-secondary">
              Sağ üstteki &ldquo;Eser Ekle&rdquo; butonundan ilk kitabınızı kütüphanenize ekleyin.
            </p>
          </div>
        )}
      </article>

      {/* Sağ: Ex Libris Kütüphane Sicili */}
      <aside className="lg:col-span-5 catalog-card rounded-xl p-5 sm:p-6 flex flex-col justify-between paper-grain">
        <div className="flex items-center justify-between border-b border-border-subtle pb-3">
          <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-primary font-semibold">
            EX LIBRIS · KÜTÜPHANE SİCİLİ
          </span>
          <span className="font-mono text-[10px] text-text-secondary">
            {new Date().getFullYear()} DÖNEMİ
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-4">
          <div className="rounded-lg border border-border-subtle bg-bg-primary/85 p-3.5">
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <span>Toplam Eser</span>
              <Library className="w-3.5 h-3.5 text-accent-warm" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
                {summary.totalBooks}
              </span>
              <span className="text-[11px] font-mono text-text-secondary tabular-nums">
                {summary.todoCount} sırada
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border-subtle bg-bg-primary/85 p-3.5">
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <span>Masada Okunan</span>
              <BookOpenText className="w-3.5 h-3.5 text-accent-amber" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
                {summary.readingCount}
              </span>
              <span className="text-[11px] font-mono text-text-secondary tabular-nums">
                {summary.totalPagesRead.toLocaleString('tr-TR')} syf
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border-subtle bg-bg-primary/85 p-3.5">
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <span>Tamamlanan</span>
              <BookCheck className="w-3.5 h-3.5 text-accent-primary" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
                {summary.completedCount}
              </span>
              <span className="text-[11px] font-mono text-text-secondary tabular-nums">
                eser bitti
              </span>
            </div>
          </div>

          <div className="rounded-lg border border-border-subtle bg-bg-primary/85 p-3.5">
            <div className="flex items-center justify-between text-[11px] text-text-secondary">
              <span>Alıntı Defteri</span>
              <Quote className="w-3.5 h-3.5 text-accent-warm" />
            </div>
            <div className="mt-1.5 flex items-baseline gap-2">
              <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
                {summary.totalQuotes}
              </span>
              <span className="text-[11px] font-mono text-text-secondary tabular-nums">
                altı çizili
              </span>
            </div>
          </div>
        </div>

        {/* Yıllık Hedef Çubuğu */}
        <div className="mt-4 rounded-lg border border-border-subtle bg-bg-primary/85 p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="inline-flex items-center gap-1.5 font-medium text-text-primary">
              <Target className="w-3.5 h-3.5 text-accent-primary" />
              Yıllık Okuma Hedefi
            </span>
            <span className="font-mono text-xs font-semibold text-accent-primary tabular-nums">
              {summary.completedCount} / {yearlyGoal} (%{summary.goalProgress})
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-bg-secondary overflow-hidden">
            <div
              className="h-full bg-accent-primary transition-all duration-300"
              style={{ width: `${summary.goalProgress}%` }}
            />
          </div>
        </div>
      </aside>
    </section>
  );
}
