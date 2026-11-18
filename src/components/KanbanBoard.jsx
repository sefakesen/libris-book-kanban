import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORY_LIST, KANBAN_COLUMNS } from '../constants/bookConstants';
import BookCard from './BookCard';

export default function KanbanBoard({
  books,
  onMoveStatus,
  onQuickProgress,
  onOpenDetail,
  onAddBookForStatus,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dragOverColumn, setDragOverColumn] = useState(null);

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();
    return books.filter((book) => {
      if (categoryFilter !== 'all' && book.category !== categoryFilter) return false;
      if (query) {
        const hay = `${book.title} ${book.author}`.toLowerCase();
        if (!hay.includes(query)) return false;
      }
      return true;
    });
  }, [books, search, categoryFilter]);

  const handleDragStart = (e, bookId) => {
    e.dataTransfer.setData('text/plain', bookId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDrop = (e, targetStatus) => {
    e.preventDefault();
    setDragOverColumn(null);
    const bookId = e.dataTransfer.getData('text/plain');
    if (bookId) {
      onMoveStatus(bookId, targetStatus);
    }
  };

  return (
    <section className="space-y-5">
      {/* Arama ve Kategori Filtre Çubuğu */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
        <div className="relative w-full lg:max-w-xs">
          <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kitap veya yazar ara..."
            className="w-full rounded-lg border border-border-subtle bg-bg-card pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-secondary/70 focus:outline-none focus:border-accent-primary"
          />
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              categoryFilter === 'all'
                ? 'border-accent-primary bg-accent-primary text-white'
                : 'border-border-subtle bg-bg-card text-text-secondary hover:text-text-primary'
            }`}
          >
            Tümü ({books.length})
          </button>
          {CATEGORY_LIST.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                categoryFilter === cat.id
                  ? 'border-accent-primary bg-accent-primary text-white'
                  : 'border-border-subtle bg-bg-card text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Üç Sütunlu Kanban Panosu */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        {KANBAN_COLUMNS.map((col) => {
          const colBooks = filteredBooks.filter((b) => b.status === col.id);
          const isDragOver = dragOverColumn === col.id;

          return (
            <div
              key={col.id}
              onDragOver={(e) => {
                e.preventDefault();
                if (dragOverColumn !== col.id) setDragOverColumn(col.id);
              }}
              onDragLeave={() => setDragOverColumn(null)}
              onDrop={(e) => handleDrop(e, col.id)}
              className={`rounded-xl border transition-colors min-h-[420px] flex flex-col ${
                isDragOver
                  ? 'border-accent-primary bg-accent-primary-soft/40'
                  : 'border-border-subtle bg-bg-secondary/45'
              }`}
            >
              {/* Sütun Başlığı */}
              <div className="px-4 py-3.5 border-b border-border-subtle flex items-center justify-between gap-2 bg-bg-card/60 rounded-t-xl">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.dotClass}`} />
                    <h3 className="font-serif text-lg font-medium text-text-primary">
                      {col.label}
                    </h3>
                    <span className="font-mono text-xs px-2 py-0.5 rounded-md border border-border-subtle bg-bg-primary text-text-primary tabular-nums">
                      {colBooks.length}
                    </span>
                  </div>
                  <p className="text-[11px] text-text-secondary mt-0.5 truncate">
                    {col.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => onAddBookForStatus(col.id)}
                  title={`${col.label} sütununa yeni kitap ekle`}
                  className="p-1.5 rounded-md border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-text-secondary hover:text-text-primary cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Kitap Kartları Listesi */}
              <div className="p-3.5 space-y-3 flex-1">
                {colBooks.length === 0 ? (
                  <div className="rounded-lg border border-dashed border-border-subtle p-8 text-center text-xs text-text-secondary paper-grain">
                    {books.length === 0
                      ? 'Bu sütunda henüz kitap yok.'
                      : 'Arama/filtre kriterine uygun kitap bulunmuyor.'}
                  </div>
                ) : (
                  colBooks.map((book) => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onMoveStatus={onMoveStatus}
                      onQuickProgress={onQuickProgress}
                      onOpenDetail={onOpenDetail}
                      onDragStart={handleDragStart}
                    />
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
