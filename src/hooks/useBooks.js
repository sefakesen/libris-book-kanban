import { useCallback, useEffect, useMemo, useState } from 'react';
import { CATEGORIES } from '../constants/bookConstants';
import { createEmptyLibrary, createSeedLibrary } from '../utils/seedData';
import {
  loadLibraryState,
  sanitizeHttpUrl,
  saveLibraryState,
} from '../utils/storage';

export function useBooks() {
  const [state, setState] = useState(() => loadLibraryState());
  const [storageError, setStorageError] = useState('');

  useEffect(() => {
    const theme = state.settings?.theme === 'dark' ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
  }, [state.settings?.theme]);

  useEffect(() => {
    const res = saveLibraryState(state);
    if (!res.ok) {
      setStorageError(res.error || 'Depolama hatası oluştu.');
    } else if (storageError) {
      setStorageError('');
    }
  }, [state]);

  const addBook = useCallback((formData) => {
    const title = String(formData.title || '').trim().slice(0, 120);
    const author = String(formData.author || '').trim().slice(0, 80) || 'Bilinmeyen Yazar';
    if (!title) return;

    const status = ['todo', 'reading', 'completed'].includes(formData.status)
      ? formData.status
      : 'todo';
    const rawTotal = Number(formData.totalPages);
    const totalPages =
      Number.isFinite(rawTotal) && rawTotal >= 1 ? Math.min(10000, Math.round(rawTotal)) : 200;

    let currentPage = 0;
    if (status === 'completed') currentPage = totalPages;
    else if (status === 'reading') {
      const rawCurrent = Number(formData.currentPage);
      currentPage = Number.isFinite(rawCurrent)
        ? Math.max(0, Math.min(totalPages, Math.round(rawCurrent)))
        : 0;
    }

    const rawYear = Number(formData.publishedYear);
    const publishedYear =
      Number.isInteger(rawYear) && rawYear >= 100 && rawYear <= 2100 ? rawYear : null;

    const now = new Date().toISOString();
    const newBook = {
      id: `book_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      title,
      author,
      category: CATEGORIES[formData.category] ? formData.category : 'literature',
      status,
      totalPages,
      currentPage,
      coverUrl: sanitizeHttpUrl(formData.coverUrl),
      publishedYear,
      rating: status === 'completed' ? Number(formData.rating) || 0 : 0,
      quotes: [],
      createdAt: now,
      updatedAt: now,
    };

    setState((prev) => ({
      ...prev,
      books: [newBook, ...prev.books],
    }));
  }, []);

  const updateBook = useCallback((bookId, updates) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((book) => {
        if (book.id !== bookId) return book;
        const nextTotal =
          updates.totalPages !== undefined
            ? Math.max(1, Math.min(10000, Math.round(Number(updates.totalPages) || book.totalPages)))
            : book.totalPages;
        const nextStatus = ['todo', 'reading', 'completed'].includes(updates.status)
          ? updates.status
          : book.status;

        let nextCurrent =
          updates.currentPage !== undefined
            ? Math.max(0, Math.min(nextTotal, Math.round(Number(updates.currentPage) || 0)))
            : Math.min(book.currentPage, nextTotal);

        if (nextStatus === 'completed') nextCurrent = nextTotal;
        if (nextStatus === 'todo' && updates.status === 'todo') nextCurrent = 0;

        return {
          ...book,
          title:
            updates.title !== undefined
              ? String(updates.title).trim().slice(0, 120) || book.title
              : book.title,
          author:
            updates.author !== undefined
              ? String(updates.author).trim().slice(0, 80) || book.author
              : book.author,
          category:
            updates.category && CATEGORIES[updates.category]
              ? updates.category
              : book.category,
          status: nextStatus,
          totalPages: nextTotal,
          currentPage: nextCurrent,
          coverUrl:
            updates.coverUrl !== undefined
              ? sanitizeHttpUrl(updates.coverUrl)
              : book.coverUrl,
          publishedYear:
            updates.publishedYear !== undefined ? updates.publishedYear : book.publishedYear,
          rating:
            updates.rating !== undefined
              ? Math.max(0, Math.min(5, Math.round(Number(updates.rating) || 0)))
              : book.rating,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const moveBookStatus = useCallback((bookId, nextStatus) => {
    if (!['todo', 'reading', 'completed'].includes(nextStatus)) return;
    setState((prev) => ({
      ...prev,
      books: prev.books.map((book) => {
        if (book.id !== bookId) return book;
        let currentPage = book.currentPage;
        if (nextStatus === 'todo') currentPage = 0;
        else if (nextStatus === 'completed') currentPage = book.totalPages;
        else if (nextStatus === 'reading' && currentPage === book.totalPages) {
          currentPage = Math.max(1, Math.floor(book.totalPages * 0.5));
        }

        return {
          ...book,
          status: nextStatus,
          currentPage,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const updateBookProgress = useCallback((bookId, pageValue) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((book) => {
        if (book.id !== bookId) return book;
        const parsed = Math.round(Number(pageValue) || 0);
        const safePage = Math.max(0, Math.min(book.totalPages, parsed));
        const nextStatus =
          safePage >= book.totalPages
            ? 'completed'
            : safePage > 0
            ? 'reading'
            : book.status === 'completed'
            ? 'reading'
            : book.status;

        return {
          ...book,
          currentPage: safePage,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }),
    }));
  }, []);

  const deleteBook = useCallback((bookId) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.filter((b) => b.id !== bookId),
    }));
  }, []);

  const addQuoteToBook = useCallback((bookId, { page, text }) => {
    const cleanText = String(text || '').trim().slice(0, 600);
    if (!cleanText) return;

    const pNum = Number(page);
    const safePage = Number.isInteger(pNum) && pNum >= 1 && pNum <= 10000 ? pNum : null;

    const newQuote = {
      id: `q_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      page: safePage,
      text: cleanText,
      createdAt: new Date().toISOString(),
    };

    setState((prev) => ({
      ...prev,
      books: prev.books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              quotes: [newQuote, ...(book.quotes || [])],
              updatedAt: new Date().toISOString(),
            }
          : book
      ),
    }));
  }, []);

  const removeQuoteFromBook = useCallback((bookId, quoteId) => {
    setState((prev) => ({
      ...prev,
      books: prev.books.map((book) =>
        book.id === bookId
          ? {
              ...book,
              quotes: (book.quotes || []).filter((q) => q.id !== quoteId),
              updatedAt: new Date().toISOString(),
            }
          : book
      ),
    }));
  }, []);

  const toggleTheme = useCallback(() => {
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        theme: prev.settings.theme === 'dark' ? 'light' : 'dark',
      },
    }));
  }, []);

  const updateYearlyGoal = useCallback((goal) => {
    const num = Math.round(Number(goal) || 20);
    const safeGoal = Math.max(1, Math.min(500, num));
    setState((prev) => ({
      ...prev,
      settings: {
        ...prev.settings,
        yearlyGoal: safeGoal,
      },
    }));
  }, []);

  const resetToDemo = useCallback(() => {
    setState((prev) => {
      const seed = createSeedLibrary();
      return {
        ...seed,
        settings: {
          ...seed.settings,
          theme: prev.settings.theme,
        },
      };
    });
  }, []);

  const clearLibrary = useCallback(() => {
    setState((prev) =>
      createEmptyLibrary(prev.settings.theme, prev.settings.yearlyGoal)
    );
  }, []);

  const replaceFromImport = useCallback((importedState) => {
    setState(importedState);
  }, []);

  const summary = useMemo(() => {
    const totalBooks = state.books.length;
    const todoCount = state.books.filter((b) => b.status === 'todo').length;
    const readingCount = state.books.filter((b) => b.status === 'reading').length;
    const completedCount = state.books.filter((b) => b.status === 'completed').length;
    const totalPagesRead = state.books.reduce((sum, b) => sum + (b.currentPage || 0), 0);
    const totalQuotes = state.books.reduce((sum, b) => sum + (b.quotes?.length || 0), 0);
    const goalProgress = Math.min(
      100,
      Math.round((completedCount / Math.max(1, state.settings.yearlyGoal)) * 100)
    );

    return {
      totalBooks,
      todoCount,
      readingCount,
      completedCount,
      totalPagesRead,
      totalQuotes,
      goalProgress,
    };
  }, [state.books, state.settings.yearlyGoal]);

  return {
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
  };
}
