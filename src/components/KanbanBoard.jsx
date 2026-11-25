import { Columns3, LibraryBig, Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { CATEGORY_LIST, KANBAN_COLUMNS } from '../constants/bookConstants';
import BookCard from './BookCard';
import BookshelfView from './BookshelfView';

export default function KanbanBoard({
  books,
  onMoveStatus,
  onQuickProgress,
  onOpenDetail,
  onAddBookForStatus,
}) {
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [boardLayout, setBoardLayout] = useState('kanban'); // 'kanban' | 'shelf'
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
      {/* Arama, Kategori Filtresi ve Görünüm Geçişi */}
      <div className="catalog-card rounded-xl p-3.5 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="relative w-full md:max-w-xs">
            <Search className="w-4 h-4 text-text-secondary absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Katalogda kitap veya yazar ara..."
              className="w-full rounded-lg border border-border-subtle bg-bg-primary pl-9 pr-3 py-2 text-xs text-text-primary placeholder:text-text-secondary/75 focus:outline-none focus:border-accent-primary"
            />
          </div>

          {/* Kütüphane Panosu vs Ahşap Raf Geçişi */}
          <div className="inline-flex items-center rounded-lg border border-border-subtle bg-bg-secondary p-1 gap-1 self-start md:self-auto">
            <button
              type="button"
              onClick={() => setBoardLayout('kanban')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                boardLayout === 'kanban'
                  ? 'bg-bg-card text-text-primary shadow-xs border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <Columns3 className="w-3.5 h-3.5 text-accent-primary" />
              <span>Kütüphane Panosu</span>
            </button>
            <button
              type="button"
              onClick={() => setBoardLayout('shelf')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                boardLayout === 'shelf'
                  ? 'bg-bg-card text-text-primary shadow-xs border border-border-subtle'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              <LibraryBig className="w-3.5 h-3.5 text-accent-warm" />
              <span>Ahşap Kitaplık Rafı</span>
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-border-subtle/70">
          <button
            type="button"
            onClick={() => setCategoryFilter('all')}
            className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
              categoryFilter === 'all'
                ? 'border-accent-primary bg-accent-primary text-white'
                : 'border-border-subtle bg-bg-primary text-text-secondary hover:text-text-primary'
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
                  : 'border-border-subtle bg-bg-primary text-text-secondary hover:text-text-primary'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {boardLayout === 'shelf' ? (
        <BookshelfView
          books={filteredBooks}
          onMoveStatus={onMoveStatus}
          onOpenDetail={onOpenDetail}
          onAddBookForStatus={onAddBookForStatus}
        />
      ) : (
        /* Üç Sütunlu Ceviz Başlıklı Kanban Panosu */
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
                className={`rounded-xl border transition-colors min-h-[430px] flex flex-col overflow-hidden ${
                  isDragOver
                    ? 'border-accent-primary bg-accent-primary-soft/45'
                    : 'border-border-subtle bg-bg-secondary/60 backdrop-blur-sm'
                }`}
              >
                {/* Ceviz Ahşap Sütun Başlığı */}
                <div className="wood-beam px-4 py-3.5 flex items-center justify-between gap-2 text-[#F5EBDD]">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${col.dotClass}`} />
                      <h3 className="font-display text-xl font-semibold text-[#F7EFE2]">
                        {col.label}
                      </h3>
                      <span className="font-mono text-xs px-2 py-0.5 rounded border border-[#D8B46A]/40 bg-black/25 text-[#F5EBDD] tabular-nums">
                        {colBooks.length}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#D8C3A5]/85 mt-0.5 truncate">
                      {col.subtitle}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => onAddBookForStatus(col.id)}
                    title={`${col.label} sütununa yeni kitap ekle`}
                    className="p-1.5 rounded-md border border-white/15 bg-black/25 hover:bg-black/40 text-[#F5EBDD] cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Kitap Kartları Listesi */}
                <div className="p-3.5 space-y-3 flex-1">
                  {colBooks.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-border-subtle p-8 text-center text-xs text-text-secondary paper-grain">
                      {books.length === 0
                        ? 'Bu rafta henüz kitap yok.'
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
      )}
    </section>
  );
}
