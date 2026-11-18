import { useState } from 'react';
import AnalyticsView from './components/AnalyticsView';
import BookDetailModal from './components/BookDetailModal';
import BookFormModal from './components/BookFormModal';
import Header from './components/Header';
import KanbanBoard from './components/KanbanBoard';
import QuotesView from './components/QuotesView';
import SummaryCards from './components/SummaryCards';
import { useBooks } from './hooks/useBooks';

export default function App() {
  const {
    state,
    summary,
    storageError,
    addBook,
    updateBook,
    moveBookStatus,
    updateBookProgress,
    deleteBook,
    addQuoteToBook,
    removeQuoteFromBook,
    toggleTheme,
    updateYearlyGoal,
    resetToDemo,
    clearLibrary,
    replaceFromImport,
  } = useBooks();

  const [activeTab, setActiveTab] = useState('kanban');
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const [defaultNewStatus, setDefaultNewStatus] = useState('todo');
  const [detailBookId, setDetailBookId] = useState(null);

  const selectedDetailBook =
    detailBookId ? state.books.find((b) => b.id === detailBookId) || null : null;

  const openAddBookModal = (status = 'todo') => {
    setEditingBook(null);
    setDefaultNewStatus(status);
    setFormModalOpen(true);
  };

  const openEditBookModal = (book) => {
    setDetailBookId(null);
    setEditingBook(book);
    setFormModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col">
      <Header
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onAddBookClick={() => openAddBookModal('todo')}
        theme={state.settings.theme}
        onToggleTheme={toggleTheme}
        isDemoData={state.settings.isDemoData}
        onResetDemo={resetToDemo}
        onClearLibrary={clearLibrary}
        totalQuotes={summary.totalQuotes}
      />

      {storageError && (
        <div className="bg-danger/10 border-b border-danger/30 px-4 py-2 text-xs text-danger text-center">
          {storageError}
        </div>
      )}

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        <SummaryCards summary={summary} yearlyGoal={state.settings.yearlyGoal} />

        {activeTab === 'kanban' && (
          <KanbanBoard
            books={state.books}
            onMoveStatus={moveBookStatus}
            onQuickProgress={updateBookProgress}
            onOpenDetail={(book) => setDetailBookId(book.id)}
            onAddBookForStatus={(status) => openAddBookModal(status)}
          />
        )}

        {activeTab === 'quotes' && (
          <QuotesView
            books={state.books}
            onOpenBook={(book) => setDetailBookId(book.id)}
            onRemoveQuote={removeQuoteFromBook}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsView
            state={state}
            summary={summary}
            onUpdateYearlyGoal={updateYearlyGoal}
            onReplaceFromImport={replaceFromImport}
          />
        )}
      </main>

      <footer className="border-t border-border-subtle py-4 px-4 sm:px-8 text-center text-xs text-text-secondary">
        LIBRIS // Kişisel Kütüphane ve Okuma Panosu · Open Library API &amp; LocalStorage
      </footer>

      <BookFormModal
        isOpen={formModalOpen}
        editingBook={editingBook}
        defaultStatus={defaultNewStatus}
        onClose={() => {
          setFormModalOpen(false);
          setEditingBook(null);
        }}
        onSubmit={(values) => {
          if (editingBook) {
            updateBook(editingBook.id, values);
          } else {
            addBook(values);
          }
        }}
      />

      <BookDetailModal
        book={selectedDetailBook}
        onClose={() => setDetailBookId(null)}
        onMoveStatus={moveBookStatus}
        onUpdateProgress={updateBookProgress}
        onUpdateRating={(id, rating) => updateBook(id, { rating })}
        onAddQuote={addQuoteToBook}
        onRemoveQuote={removeQuoteFromBook}
        onEditClick={openEditBookModal}
        onDeleteBook={deleteBook}
      />
    </div>
  );
}
