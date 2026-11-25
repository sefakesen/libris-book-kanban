import {
  ArrowLeft,
  ArrowRight,
  GripVertical,
  MessageSquareQuote,
  Star,
} from 'lucide-react';
import { CATEGORIES, KANBAN_COLUMNS } from '../constants/bookConstants';
import BookCover from './BookCover';

export default function BookCard({
  book,
  onMoveStatus,
  onQuickProgress,
  onOpenDetail,
  onDragStart,
}) {
  const category = CATEGORIES[book.category] || CATEGORIES.literature;
  const pct =
    book.totalPages > 0
      ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
      : 0;

  const currentColIdx = KANBAN_COLUMNS.findIndex((c) => c.id === book.status);
  const prevColumn = currentColIdx > 0 ? KANBAN_COLUMNS[currentColIdx - 1] : null;
  const nextColumn =
    currentColIdx < KANBAN_COLUMNS.length - 1 ? KANBAN_COLUMNS[currentColIdx + 1] : null;

  return (
    <article
      draggable
      onDragStart={(e) => onDragStart(e, book.id)}
      className="group catalog-card rounded-xl p-3.5 hover:border-border-brass/70 transition-all space-y-3 relative overflow-hidden"
    >
      {/* Okunuyor kartlarında üstten sarkan kurdele ayraç */}
      {book.status === 'reading' && (
        <div
          className="ribbon-bookmark absolute top-0 right-8 w-3.5 h-6 pointer-events-none"
          aria-hidden="true"
        />
      )}

      {/* Üst Satır: 3B Kapak + Temel Bilgiler */}
      <div className="flex gap-3.5 items-start">
        <button
          type="button"
          onClick={() => onOpenDetail(book)}
          className="cursor-pointer focus:outline-none"
          title="Kitap detaylarını ve alıntıları aç"
        >
          <BookCover book={book} size="md" />
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-1.5">
            <span
              className={`inline-block px-2 py-0.5 rounded border text-[10px] font-medium ${category.badgeClass}`}
            >
              {category.label}
            </span>
            <span
              className="text-text-secondary/50 group-hover:text-text-secondary cursor-grab active:cursor-grabbing shrink-0"
              title="Sütunlar arasında sürükleyip bırakabilirsiniz"
            >
              <GripVertical className="w-4 h-4" />
            </span>
          </div>

          <button
            type="button"
            onClick={() => onOpenDetail(book)}
            className="text-left block w-full mt-1.5 cursor-pointer group/title"
          >
            <h4 className="font-display text-[17px] font-semibold text-text-primary leading-snug line-clamp-2 group-hover/title:text-accent-primary transition-colors">
              {book.title}
            </h4>
          </button>

          <p className="text-xs text-text-secondary truncate mt-0.5">{book.author}</p>

          <div className="mt-2 flex flex-wrap items-center gap-2.5 text-[11px] font-mono text-text-secondary tabular-nums">
            <span>{book.totalPages} syf</span>
            {book.publishedYear && <span>· {book.publishedYear}</span>}
            {book.quotes?.length > 0 && (
              <button
                type="button"
                onClick={() => onOpenDetail(book)}
                className="inline-flex items-center gap-1 text-accent-warm hover:underline cursor-pointer"
              >
                <MessageSquareQuote className="w-3 h-3" />
                {book.quotes.length} alıntı
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Okuma İlerlemesi (Okunuyor) */}
      {book.status === 'reading' && (
        <div className="rounded-lg border border-border-subtle bg-bg-primary/80 px-3 py-2 space-y-1.5">
          <div className="flex items-center justify-between text-[11px] font-mono tabular-nums">
            <span className="text-text-secondary">
              Sayfa <strong className="text-text-primary">{book.currentPage}</strong> /{' '}
              {book.totalPages}
            </span>
            <span className="font-semibold text-accent-amber">%{pct}</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-bg-secondary overflow-hidden">
            <div
              className="h-full bg-accent-amber transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex items-center justify-between pt-0.5">
            <button
              type="button"
              onClick={() => onQuickProgress(book.id, book.currentPage + 15)}
              className="text-[11px] font-mono font-medium text-accent-primary hover:underline cursor-pointer"
            >
              +15 sayfa ilerle
            </button>
            <button
              type="button"
              onClick={() => onOpenDetail(book)}
              className="text-[11px] text-text-secondary hover:text-text-primary cursor-pointer"
            >
              Not / Sayfa Gir
            </button>
          </div>
        </div>
      )}

      {/* Yıldız Puanı (Bitti) */}
      {book.status === 'completed' && (
        <div className="flex items-center justify-between text-xs pt-0.5">
          <div className="flex items-center gap-0.5" aria-label={`Puan: ${book.rating} / 5`}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${
                  star <= (book.rating || 0)
                    ? 'fill-accent-amber text-accent-amber'
                    : 'text-border-subtle'
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => onOpenDetail(book)}
            className="text-[11px] font-medium text-accent-primary hover:underline cursor-pointer"
          >
            Detay &amp; Alıntı Ekle
          </button>
        </div>
      )}

      {/* Durum Değiştirme Butonları */}
      <div className="pt-2.5 border-t border-border-subtle/80 flex items-center justify-between gap-2">
        {prevColumn ? (
          <button
            type="button"
            onClick={() => onMoveStatus(book.id, prevColumn.id)}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            <span>{prevColumn.label}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onOpenDetail(book)}
            className="px-2.5 py-1.5 rounded-md border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-[11px] font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Detaylar
          </button>
        )}

        {nextColumn && (
          <button
            type="button"
            onClick={() => onMoveStatus(book.id, nextColumn.id)}
            className="ml-auto inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-accent-primary/35 bg-accent-primary-soft text-accent-primary hover:opacity-90 text-[11px] font-semibold transition-opacity cursor-pointer"
          >
            <span>{nextColumn.label}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        )}
      </div>
    </article>
  );
}
