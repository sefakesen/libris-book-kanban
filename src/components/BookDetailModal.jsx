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
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-[2px] p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-detail-title"
    >
      {/* Dış Deri / Ceviz Cilt Çerçevesi */}
      <div className="w-full max-w-4xl rounded-xl border-2 border-bg-wood bg-bg-wood p-2 shadow-2xl my-6">
        <div className="rounded-lg border border-border-subtle bg-bg-card overflow-hidden">
          {/* Üst Ceviz Kitap Başlığı */}
          <div className="wood-beam px-6 py-3.5 flex items-center justify-between gap-3 text-[#F5EBDD]">
            <div className="flex items-center gap-2.5 min-w-0">
              <span
                className={`px-2.5 py-0.5 rounded border text-[10px] font-medium ${category.badgeClass}`}
              >
                {category.label}
              </span>
              <span className="font-mono text-[10px] uppercase tracking-wider text-[#D8B46A] hidden sm:inline">
                AÇIK KİTAP DEFTERİ
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => onEditClick(book)}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-md border border-white/15 bg-black/25 hover:bg-black/40 text-xs text-[#F5EBDD] cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Düzenle</span>
              </button>
              <button
                type="button"
                onClick={onClose}
                aria-label="Kapat"
                className="p-1.5 rounded-md text-[#E5D7C3] hover:text-white hover:bg-black/30 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* İki Sayfalı Açık Kitap İçeriği */}
          <div className="grid grid-cols-1 md:grid-cols-12 max-h-[78vh] overflow-y-auto">
            {/* Sol Sayfa: Kitap Künyesi & İlerleme */}
            <div className="md:col-span-5 p-6 space-y-5 border-b md:border-b-0 md:border-r border-border-subtle bg-bg-card relative">
              <div className="flex gap-4 items-start">
                <BookCover book={book} size="lg" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <h2
                    id="book-detail-title"
                    className="font-display text-2xl font-semibold text-text-primary leading-tight"
                  >
                    {book.title}
                  </h2>
                  <p className="text-xs text-text-secondary">{book.author}</p>
                  <p className="font-mono text-[11px] text-text-secondary tabular-nums">
                    {book.totalPages} sayfa
                    {book.publishedYear ? ` · ${book.publishedYear}` : ''}
                  </p>
                </div>
              </div>

              {/* Durum Geçişi */}
              <div>
                <span className="block text-[10px] font-mono uppercase tracking-wider text-text-secondary mb-1.5">
                  Raf / Durum
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  {KANBAN_COLUMNS.map((col) => {
                    const active = book.status === col.id;
                    return (
                      <button
                        key={col.id}
                        type="button"
                        onClick={() => onMoveStatus(book.id, col.id)}
                        className={`py-2 px-2 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
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

              {/* Yıldız Değerlendirmesi */}
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

              {/* Sayfa İlerlemesi */}
              <div className="rounded-xl border border-border-subtle bg-bg-primary/85 p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-text-primary">Sayfa İlerlemesi</span>
                  <span className="font-mono text-accent-primary font-semibold tabular-nums">
                    {book.currentPage} / {book.totalPages} (%{pct})
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
                  <div className="flex items-center gap-1.5">
                    <input
                      type="number"
                      min={0}
                      max={book.totalPages}
                      value={book.currentPage}
                      onChange={(e) => onUpdateProgress(book.id, Number(e.target.value))}
                      aria-label="Mevcut sayfa"
                      className="w-18 rounded-md border border-border-subtle bg-bg-card px-2 py-1 font-mono text-xs text-text-primary"
                    />
                    <span className="text-[11px] text-text-secondary">sayfa</span>
                  </div>

                  <div className="flex gap-1">
                    {[10, 25, 50].map((inc) => (
                      <button
                        key={inc}
                        type="button"
                        onClick={() => onUpdateProgress(book.id, book.currentPage + inc)}
                        className="px-2 py-1 rounded-md border border-border-subtle bg-bg-card hover:bg-bg-secondary font-mono text-[11px] text-text-primary cursor-pointer"
                      >
                        +{inc}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kitap Silme Alanı */}
              <div className="pt-3 border-t border-border-subtle">
                {confirmDelete ? (
                  <div className="space-y-2">
                    <p className="text-xs text-danger font-medium">
                      Bu kitabı kütüphaneden kalıcı olarak silmek istiyor musunuz?
                    </p>
                    <div className="flex gap-2">
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
              </div>
            </div>

            {/* Sağ Sayfa: Çizgili Okur Not Defteri (Alıntılar) */}
            <div className="md:col-span-7 p-6 ruled-paper flex flex-col justify-between gap-5">
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-border-subtle pb-2.5">
                  <div className="flex items-center gap-2">
                    <Quote className="w-4 h-4 text-accent-warm" />
                    <h3 className="font-display text-xl font-semibold text-text-primary">
                      Kenar Notları &amp; Altı Çizili Satırlar
                    </h3>
                  </div>
                  <span className="font-mono text-xs text-text-secondary tabular-nums">
                    {book.quotes?.length || 0} kayıt
                  </span>
                </div>

                <form
                  onSubmit={handleAddQuoteSubmit}
                  className="rounded-xl border border-border-subtle bg-bg-primary/90 p-3.5 space-y-2.5 shadow-xs"
                >
                  <textarea
                    rows={2}
                    maxLength={600}
                    value={quoteText}
                    onChange={(e) => setQuoteText(e.target.value)}
                    placeholder="Altını çizdiğiniz bir cümle veya okuma notunuzu deftere işleyin..."
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
                      <span>Deftere Ekle</span>
                    </button>
                  </div>
                </form>

                {book.quotes && book.quotes.length > 0 ? (
                  <div className="space-y-3">
                    {book.quotes.map((q) => (
                      <div
                        key={q.id}
                        className="rounded-lg border border-border-subtle bg-bg-card/95 p-3.5 flex items-start justify-between gap-3 shadow-xs"
                      >
                        <div className="space-y-1">
                          <p className="font-serif text-sm text-text-primary leading-relaxed italic">
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
                  <p className="text-xs text-text-secondary italic py-4">
                    Bu eser için henüz kenar notu düşülmemiş. Yukarıdaki alandan ilk alıntınızı
                    ekleyebilirsiniz.
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-border-subtle flex justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-1.5 rounded-lg border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-xs font-medium text-text-primary cursor-pointer"
                >
                  Kitabı Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
