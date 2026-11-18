import { Edit3, Plus, Quote, Star, Trash2, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CATEGORIES, KANBAN_COLUMNS } from '../constants/bookConstants';
import BookCover from './BookCover';

export default function BookDetailModal({
  book,
  onClose,
  onMoveStatus,
  onUpdateProgress,
  onUpdateRating,
  onAddQuote,
  onRemoveQuote,
  onEditClick,
  onDeleteBook,
}) {
  const [quotePage, setQuotePage] = useState('');
  const [quoteText, setQuoteText] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    setConfirmDelete(false);
    setQuotePage('');
    setQuoteText('');
  }, [book?.id]);

  useEffect(() => {
    if (!book) return undefined;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [book, onClose]);

  if (!book) return null;

  const category = CATEGORIES[book.category] || CATEGORIES.literature;
  const pct =
    book.totalPages > 0
      ? Math.min(100, Math.round((book.currentPage / book.totalPages) * 100))
      : 0;

  const handleAddQuoteSubmit = (e) => {
    e.preventDefault();
    if (!quoteText.trim()) return;
    onAddQuote(book.id, {
      page: quotePage ? Number(quotePage) : null,
      text: quoteText,
    });
    setQuotePage('');
    setQuoteText('');
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-detail-title"
    >
      <div className="w-full max-w-2xl rounded-xl border border-border-subtle bg-bg-card shadow-xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-secondary/50">
          <span
            className={`px-2.5 py-0.5 rounded border text-[11px] font-medium ${category.badgeClass}`}
          >
            {category.label}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onEditClick(book)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-border-subtle bg-bg-card hover:bg-bg-secondary text-xs text-text-primary cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Düzenle</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Kapat"
              className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-secondary cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Kitap Üst Bilgisi */}
          <div className="flex flex-col sm:flex-row gap-5">
            <BookCover book={book} size="lg" />

            <div className="flex-1 space-y-4">
              <div>
                <h2
                  id="book-detail-title"
                  className="font-serif text-2xl font-medium text-text-primary leading-snug"
                >
                  {book.title}
                </h2>
                <p className="text-sm text-text-secondary mt-1">
                  {book.author}
                  {book.publishedYear ? ` · ${book.publishedYear}` : ''} · {book.totalPages} sayfa
                </p>
              </div>

              {/* Durum Geçişi */}
              <div>
                <span className="block text-[11px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  Okuma Durumu
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {KANBAN_COLUMNS.map((col) => {
                    const active = book.status === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => onMoveStatus(book.id, col.id)}
                        className={`py-2 px-2.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                          active
                            ? 'border-accent-primary bg-accent-primary text-white'
                            : 'border-border-subtle bg-bg-primary text-text-secondary hover:text-text-primary'
                        }`}
                      >
                        {col.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Yıldız Puanı */}
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-semibold text-text-primary">Değerlendirme</span>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        onUpdateRating(book.id, book.rating === star ? 0 : star)
                      }
                      aria-label={`${star} yıldız ver`}
                      className="p-0.5 cursor-pointer"
                    >
                      <Star
                        className={`w-5 h-5 transition-colors ${
                          star <= (book.rating || 0)
                            ? 'fill-accent-amber text-accent-amber'
                            : 'text-border-subtle hover:text-accent-amber/60'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sayfa İlerlemesi */}
          <div className="rounded-xl border border-border-subtle bg-bg-primary p-4 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-semibold text-text-primary">Okuma İlerlemesi</span>
              <span className="font-mono text-accent-primary font-semibold tabular-nums">
                {book.currentPage} / {book.totalPages} sayfa (%{pct})
              </span>
            </div>

            <input
              type="range"
              min={0}
              max={book.totalPages}
              value={book.currentPage}
              onChange={(e) => onUpdateProgress(book.id, Number(e.target.value))}
              className="w-full accent-accent-primary cursor-pointer"
            />

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  min={0}
                  max={book.totalPages}
                  value={book.currentPage}
                  onChange={(e) => onUpdateProgress(book.id, Number(e.target.value))}
                  aria-label="Mevcut sayfa"
                  className="w-20 rounded-md border border-border-subtle bg-bg-card px-2.5 py-1 font-mono text-xs text-text-primary"
                />
                <span className="text-xs text-text-secondary">sayfadayım</span>
              </div>

              <div className="flex gap-1.5">
                {[10, 25, 50].map((inc) => (
                  <button
                    key={inc}
                    type="button"
                    onClick={() => onUpdateProgress(book.id, book.currentPage + inc)}
                    className="px-2.5 py-1 rounded-md border border-border-subtle bg-bg-card hover:bg-bg-secondary font-mono text-[11px] text-text-primary cursor-pointer"
                  >
                    +{inc}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Alıntı ve Not Defteri */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Quote className="w-4 h-4 text-accent-warm" />
              <h3 className="font-serif text-lg font-medium text-text-primary">
                Kitaptan Alıntılar & Notlar ({book.quotes?.length || 0})
              </h3>
            </div>

            <form
              onSubmit={handleAddQuoteSubmit}
              className="rounded-xl border border-border-subtle bg-bg-secondary/40 p-3.5 space-y-2.5"
            >
              <textarea
                rows={2}
                maxLength={600}
                value={quoteText}
                onChange={(e) => setQuoteText(e.target.value)}
                placeholder="Altını çizdiğiniz bir cümle veya okuma notunuzu yazın..."
                className="w-full rounded-lg border border-border-subtle bg-bg-card p-2.5 text-xs text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-accent-primary resize-none"
              />
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <label htmlFor="quote-page-input" className="text-xs text-text-secondary">
                    Sayfa No:
                  </label>
                  <input
                    id="quote-page-input"
                    type="number"
                    min={1}
                    max={book.totalPages}
                    value={quotePage}
                    onChange={(e) => setQuotePage(e.target.value)}
                    placeholder="İsteğe bağlı"
                    className="w-24 rounded-md border border-border-subtle bg-bg-card px-2 py-1 font-mono text-xs text-text-primary"
                  />
                </div>
                <button
                  type="submit"
                  disabled={!quoteText.trim()}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-primary text-white text-xs font-semibold disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Alıntı Ekle</span>
                </button>
              </div>
            </form>

            {book.quotes && book.quotes.length > 0 ? (
              <div className="space-y-2.5">
                {book.quotes.map((q) => (
                  <div
                    key={q.id}
                    className="rounded-lg border border-border-subtle bg-bg-primary p-3.5 flex items-start justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <p className="text-xs text-text-primary leading-relaxed italic">
                        &ldquo;{q.text}&rdquo;
                      </p>
                      {q.page && (
                        <span className="inline-block font-mono text-[10px] text-accent-warm">
                          Sayfa {q.page}
                        </span>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemoveQuote(book.id, q.id)}
                      title="Alıntıyı sil"
                      className="p-1 text-text-secondary hover:text-danger cursor-pointer shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-text-secondary">
                Bu kitap için henüz alıntı veya okuma notu eklenmemiş.
              </p>
            )}
          </div>

          {/* Alt Silme Çubuğu */}
          <div className="pt-4 border-t border-border-subtle flex items-center justify-between">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <span className="text-xs text-danger font-medium">
                  Bu kitabı kütüphaneden kalıcı olarak silmek istiyor musunuz?
                </span>
                <button
                  type="button"
                  onClick={() => {
                    onDeleteBook(book.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-md bg-danger text-white text-xs font-semibold cursor-pointer"
                >
                  Evet, Sil
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-md border border-border-subtle text-xs text-text-secondary cursor-pointer"
                >
                  İptal
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="inline-flex items-center gap-1.5 text-xs text-danger hover:underline cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Kitabı Kütüphaneden Sil</span>
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-1.5 rounded-lg border border-border-subtle bg-bg-primary text-xs font-medium text-text-primary cursor-pointer"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
