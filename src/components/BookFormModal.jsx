import { Globe, Loader2, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { CATEGORY_LIST, KANBAN_COLUMNS } from '../constants/bookConstants';
import { searchOpenLibraryBooks } from '../utils/api';
import BookCover from './BookCover';

const DEFAULT_FORM = {
  title: '',
  author: '',
  category: 'literature',
  status: 'todo',
  totalPages: 250,
  currentPage: 0,
  publishedYear: '',
  coverUrl: '',
};

export default function BookFormModal({
  isOpen,
  onClose,
  onSubmit,
  editingBook,
  defaultStatus = 'todo',
}) {
  const [form, setForm] = useState(DEFAULT_FORM);
  const [formError, setFormError] = useState('');
  const [apiQuery, setApiQuery] = useState('');
  const [apiResults, setApiResults] = useState([]);
  const [apiLoading, setApiLoading] = useState(false);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (!isOpen) return;
    setFormError('');
    setApiError('');
    setApiResults([]);
    setApiQuery('');

    if (editingBook) {
      setForm({
        title: editingBook.title || '',
        author: editingBook.author || '',
        category: editingBook.category || 'literature',
        status: editingBook.status || 'todo',
        totalPages: editingBook.totalPages || 250,
        currentPage: editingBook.currentPage || 0,
        publishedYear: editingBook.publishedYear || '',
        coverUrl: editingBook.coverUrl || '',
      });
    } else {
      setForm({ ...DEFAULT_FORM, status: defaultStatus || 'todo' });
    }
  }, [isOpen, editingBook, defaultStatus]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleApiSearch = async (e) => {
    e?.preventDefault();
    if (apiQuery.trim().length < 2) {
      setApiError('Arama yapmak için en az 2 karakter girin.');
      return;
    }
    setApiError('');
    setApiLoading(true);
    try {
      const results = await searchOpenLibraryBooks(apiQuery);
      setApiResults(results);
      if (results.length === 0) {
        setApiError('Open Library kataloğunda eşleşen kitap bulunamadı.');
      }
    } catch (err) {
      setApiError(err.message || 'API araması sırasında bir hata oluştu.');
    } finally {
      setApiLoading(false);
    }
  };

  const applyApiBook = (item) => {
    setForm((prev) => ({
      ...prev,
      title: item.title,
      author: item.author,
      category: item.category,
      totalPages: item.totalPages,
      publishedYear: item.publishedYear || '',
      coverUrl: item.coverUrl || '',
    }));
    setApiResults([]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim()) {
      setFormError('Lütfen kitap adını girin.');
      return;
    }
    if (!form.author.trim()) {
      setFormError('Lütfen yazar adını girin.');
      return;
    }
    const total = Number(form.totalPages);
    if (!Number.isFinite(total) || total < 1 || total > 10000) {
      setFormError('Sayfa sayısı 1 ile 10.000 arasında geçerli bir değer olmalıdır.');
      return;
    }
    if (form.status === 'reading') {
      const current = Number(form.currentPage);
      if (!Number.isFinite(current) || current < 0 || current > total) {
        setFormError(`Mevcut sayfa 0 ile ${total} arasında geçerli bir değer olmalıdır.`);
        return;
      }
    }
    onSubmit(form);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-form-modal-title"
    >
      <div className="w-full max-w-2xl rounded-xl border border-border-subtle bg-bg-card shadow-xl overflow-hidden my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-bg-secondary/50">
          <h2 id="book-form-modal-title" className="font-serif text-xl font-medium text-text-primary">
            {editingBook ? 'Kitap Bilgilerini Düzenle' : 'Kütüphaneye Kitap Ekle'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-md text-text-secondary hover:text-text-primary hover:bg-bg-secondary cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {/* Open Library API Arama Bloğu */}
          {!editingBook && (
            <div className="rounded-xl border border-border-subtle bg-bg-secondary/45 p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-accent-primary">
                  <Globe className="w-4 h-4" />
                  <span>Open Library API ile Otomatik Doldur</span>
                </div>
                <span className="font-mono text-[10px] text-text-secondary">
                  openlibrary.org/search.json
                </span>
              </div>

              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={apiQuery}
                    onChange={(e) => setApiQuery(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleApiSearch();
                      }
                    }}
                    placeholder="Örn: Dune, Stefan Zweig, Clean Architecture..."
                    className="w-full rounded-lg border border-border-subtle bg-bg-card pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-accent-primary"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApiSearch}
                  disabled={apiLoading}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-accent-primary text-white text-xs font-semibold hover:opacity-95 disabled:opacity-60 cursor-pointer shrink-0"
                >
                  {apiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : null}
                  <span>API&apos;de Ara</span>
                </button>
              </div>

              {apiError && <p className="text-xs text-danger">{apiError}</p>}

              {apiResults.length > 0 && (
                <div className="max-h-56 overflow-y-auto divide-y divide-border-subtle rounded-lg border border-border-subtle bg-bg-card">
                  {apiResults.map((item) => (
                    <button
                      key={item.externalKey}
                      type="button"
                      onClick={() => applyApiBook(item)}
                      className="w-full flex items-center gap-3 p-2.5 text-left hover:bg-bg-secondary/60 transition-colors cursor-pointer"
                    >
                      <BookCover book={item} size="sm" />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-text-primary truncate">
                          {item.title}
                        </div>
                        <div className="text-[11px] text-text-secondary truncate">
                          {item.author}
                          {item.publishedYear ? ` · ${item.publishedYear}` : ''} · {item.totalPages} syf
                        </div>
                      </div>
                      <span className="font-mono text-[10px] px-2 py-1 rounded border border-accent-primary/30 bg-accent-primary-soft text-accent-primary shrink-0">
                        Seç
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Manuel / Düzenleme Formu */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="rounded-lg border border-danger/30 bg-danger/10 px-3.5 py-2.5 text-xs text-danger">
                {formError}
              </div>
            )}

            <div className="flex gap-4 items-start">
              <div className="hidden sm:block pt-5">
                <BookCover
                  book={{
                    title: form.title || 'Kitap Adı',
                    author: form.author || 'Yazar',
                    category: form.category,
                    coverUrl: form.coverUrl,
                  }}
                  size="md"
                />
              </div>

              <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Kitap Adı *
                  </label>
                  <input
                    type="text"
                    maxLength={120}
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="Örn: İnce Memed"
                    className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Yazar Adı *
                  </label>
                  <input
                    type="text"
                    maxLength={80}
                    value={form.author}
                    onChange={(e) => setForm({ ...form, author: e.target.value })}
                    placeholder="Örn: Yaşar Kemal"
                    className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Kategori
                  </label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  >
                    {CATEGORY_LIST.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Kanban Sütunu (Durum)
                  </label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  >
                    {KANBAN_COLUMNS.map((col) => (
                      <option key={col.id} value={col.id}>
                        {col.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Toplam Sayfa *
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10000}
                    value={form.totalPages}
                    onChange={(e) => setForm({ ...form, totalPages: e.target.value })}
                    className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>

                {form.status === 'reading' && (
                  <div>
                    <label className="block text-xs font-semibold text-text-primary mb-1">
                      Mevcut Sayfa
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={form.totalPages}
                      value={form.currentPage}
                      onChange={(e) => setForm({ ...form, currentPage: e.target.value })}
                      className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Yayın Yılı (İsteğe bağlı)
                  </label>
                  <input
                    type="number"
                    min={100}
                    max={2100}
                    value={form.publishedYear}
                    onChange={(e) => setForm({ ...form, publishedYear: e.target.value })}
                    placeholder="Örn: 1955"
                    className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 font-mono text-sm text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-text-primary mb-1">
                    Kapak Görsel URL (Boş bırakılırsa tipografik kapak oluşturulur)
                  </label>
                  <input
                    type="url"
                    maxLength={500}
                    value={form.coverUrl}
                    onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
                    placeholder="https://covers.openlibrary.org/..."
                    className="w-full rounded-lg border border-border-subtle bg-bg-primary px-3 py-2 font-mono text-xs text-text-primary focus:outline-none focus:border-accent-primary"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-border-subtle flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-lg border border-border-subtle bg-bg-primary text-xs font-medium text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-lg bg-accent-primary text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer"
              >
                {editingBook ? 'Değişiklikleri Kaydet' : 'Kitabı Kütüphaneye Ekle'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
