import { ArrowLeft, ArrowRight, Plus, Star } from 'lucide-react';
import { CATEGORIES, KANBAN_COLUMNS } from '../constants/bookConstants';
import BookCover from './BookCover';

const SHELF_ORDER = [
  { id: 'reading', title: 'Okuma Masası Rafı — Şu An Okunuyor' },
  { id: 'todo', title: 'Sıradaki Eserler Rafı — Okunacak' },
  { id: 'completed', title: 'Koleksiyon Rafı — Tamamlananlar' },
];

export default function BookshelfView({
  books,
  onMoveStatus,
  onOpenDetail,
  onAddBookForStatus,
}) {
  return (
    <div className="space-y-8">
      {SHELF_ORDER.map((shelf) => {
        const shelfBooks = books.filter((b) => b.status === shelf.id);
        const colMeta = KANBAN_COLUMNS.find((c) => c.id === shelf.id);

        return (
          <section
            key={shelf.id}
            className="rounded-xl border border-border-subtle bg-bg-secondary/40 overflow-hidden shadow-sm"
          >
            {/* Raf Üst Pirinç Plaketi */}
            <div className="px-5 py-3 border-b border-border-subtle bg-bg-card/85 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${colMeta?.dotClass}`} />
                <h3 className="font-display text-xl font-semibold text-text-primary">
                  {shelf.title}
                </h3>
                <span className="font-mono text-xs px-2 py-0.5 rounded border border-border-subtle bg-bg-primary text-text-secondary tabular-nums">
                  {shelfBooks.length} eser
                </span>
              </div>

              <button
                type="button"
                onClick={() => onAddBookForStatus(shelf.id)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-xs font-medium text-text-primary cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-accent-primary" />
                <span>Rafa Ekle</span>
              </button>
            </div>

            {/* Kitaplık İçi & Ahşap Raf Tablası */}
            <div className="px-5 pt-7 pb-0">
              {shelfBooks.length === 0 ? (
                <div className="py-10 text-center text-xs text-text-secondary paper-grain rounded-lg mb-4 border border-dashed border-border-subtle">
                  Bu rafta henüz kitap bulunmuyor.
                </div>
              ) : (
                <div className="flex flex-wrap items-end gap-x-7 gap-y-6 pb-2">
                  {shelfBooks.map((book) => {
                    const colIdx = KANBAN_COLUMNS.findIndex((c) => c.id === book.status);
                    const prevCol = colIdx > 0 ? KANBAN_COLUMNS[colIdx - 1] : null;
                    const nextCol =
                      colIdx < KANBAN_COLUMNS.length - 1 ? KANBAN_COLUMNS[colIdx + 1] : null;
                    const cat = CATEGORIES[book.category] || CATEGORIES.literature;
                    const pct =
                      book.totalPages > 0
                        ? Math.round((book.currentPage / book.totalPages) * 100)
                        : 0;

                    return (
                      <div
                        key={book.id}
                        className="group w-34 flex flex-col items-center text-center relative"
                      >
                        {/* Okunuyor kurdele ayracı */}
                        {book.status === 'reading' && (
                          <div
                            className="ribbon-bookmark absolute -top-2 right-4 w-4 h-8 z-10 pointer-events-none"
                            aria-hidden="true"
                          />
                        )}

                        <button
                          type="button"
                          onClick={() => onOpenDetail(book)}
                          className="book-3d-hover cursor-pointer focus:outline-none"
                          title={`${book.title} — Detayları aç`}
                        >
                          <BookCover book={book} size="lg" />
                        </button>

                        {/* Raf Etiketi */}
                        <div className="mt-2.5 w-full space-y-1">
                          <span
                            className={`inline-block px-1.5 py-0.5 rounded border text-[9px] font-medium ${cat.badgeClass}`}
                          >
                            {cat.label.split(' ')[0]}
                          </span>
                          <button
                            type="button"
                            onClick={() => onOpenDetail(book)}
                            className="block w-full font-display text-sm font-semibold text-text-primary leading-tight line-clamp-1 hover:text-accent-primary cursor-pointer"
                          >
                            {book.title}
                          </button>
                          <p className="text-[11px] text-text-secondary truncate">{book.author}</p>

                          {book.status === 'reading' && (
                            <div className="font-mono text-[10px] text-accent-amber font-semibold tabular-nums">
                              %{pct} okundu
                            </div>
                          )}

                          {book.status === 'completed' && book.rating > 0 && (
                            <div className="flex items-center justify-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  className={`w-2.5 h-2.5 ${
                                    s <= book.rating
                                      ? 'fill-accent-amber text-accent-amber'
                                      : 'text-border-subtle'
                                  }`}
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        {/* Hızlı Raf Değiştirme Butonları */}
                        <div className="mt-2 flex items-center justify-center gap-1.5 pb-1">
                          {prevCol && (
                            <button
                              type="button"
                              onClick={() => onMoveStatus(book.id, prevCol.id)}
                              title={`${prevCol.label} rafına taşı`}
                              className="p-1 rounded border border-border-subtle bg-bg-card hover:bg-bg-secondary text-text-secondary hover:text-text-primary cursor-pointer"
                            >
                              <ArrowLeft className="w-3 h-3" />
                            </button>
                          )}
                          {nextCol && (
                            <button
                              type="button"
                              onClick={() => onMoveStatus(book.id, nextCol.id)}
                              title={`${nextCol.label} rafına taşı`}
                              className="p-1 rounded border border-accent-primary/35 bg-accent-primary-soft text-accent-primary hover:opacity-90 cursor-pointer"
                            >
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* 3B Ceviz Raf Tablası */}
            <div className="wood-shelf-plank mx-2 mb-3" aria-hidden="true" />
          </section>
        );
      })}
    </div>
  );
}
