import { BookOpen, Plus, Quote } from 'lucide-react';
import { useMemo } from 'react';

export default function LibraryHero({ books = [], onAddBookClick, onOpenDetail }) {
  const quoteOfTheDay = useMemo(() => {
    const allQuotes = [];
    books.forEach((book) => {
      (book.quotes || []).forEach((q) => {
        allQuotes.push({ quote: q, book });
      });
    });
    if (allQuotes.length === 0) return null;
    const dayIndex = Math.floor(Date.now() / 86400000) % allQuotes.length;
    return allQuotes[dayIndex];
  }, [books]);

  const handleScrollToDesk = () => {
    document.getElementById('reading-desk')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      aria-label="Dark Academia Kütüphane Girişi"
      style={{
        backgroundImage: "url('/images/library-hero.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center 40%',
      }}
      className="min-h-[300px] sm:min-h-[340px] rounded-xl overflow-hidden relative border border-[#C9A45C]/30 shadow-2xl flex items-center"
    >
      {/* Soldan sağa koyu mürekkep/ceviz gradyanı: sol metin okunaklı, sağ kütüphane penceresi & lamba görünür */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'linear-gradient(90deg, rgba(10, 7, 5, 0.90) 0%, rgba(10, 7, 5, 0.55) 55%, rgba(10, 7, 5, 0.15) 100%)',
        }}
        aria-hidden="true"
      />

      <div className="relative z-10 p-6 sm:p-10 max-w-xl space-y-4">
        <span className="inline-block font-mono text-[11px] uppercase tracking-[0.26em] text-[#C9A45C] font-semibold">
          EX LIBRIS · MMXXVI
        </span>

        <div>
          <h2 className="font-display text-5xl sm:text-6xl font-semibold tracking-wide gilt-text leading-none">
            LIBRIS
          </h2>
          <p className="font-serif text-base sm:text-lg text-[#E8DCC6] mt-2">
            Kişisel Kütüphane ve Okuma Odası
          </p>
        </div>

        <div className="gilt-rule w-48" aria-hidden="true" />

        {/* Günün Alıntısı */}
        <div className="pt-1">
          <div className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-[#C9A45C] mb-1.5">
            <Quote className="w-3 h-3" />
            <span>Günün Alıntısı</span>
          </div>

          {quoteOfTheDay ? (
            <button
              type="button"
              onClick={() => onOpenDetail?.(quoteOfTheDay.book)}
              className="text-left group cursor-pointer block"
              title="Kitap detayını aç"
            >
              <blockquote className="font-serif italic text-sm sm:text-[15px] text-[#F2E6D2] leading-relaxed group-hover:text-[#F3DFA8] transition-colors">
                &ldquo;{quoteOfTheDay.quote.text}&rdquo;
              </blockquote>
              <span className="inline-block text-xs text-[#B8A48C] mt-1 group-hover:text-[#E8DCC6] transition-colors">
                — {quoteOfTheDay.book.title}, {quoteOfTheDay.book.author}
              </span>
            </button>
          ) : (
            <p className="font-serif italic text-sm text-[#E8DCC6]">
              Lux in tenebris — ilk altı çizili satırınızı ekleyin.
            </p>
          )}
        </div>

        {/* Hero Eylem Butonları */}
        <div className="flex flex-wrap items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onAddBookClick}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1F4A38] hover:bg-[#265B45] border border-[#C9A45C]/60 text-[#F7EFE2] text-xs font-semibold transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4 text-[#F3DFA8]" />
            <span>Eser Ekle</span>
          </button>

          <button
            type="button"
            onClick={handleScrollToDesk}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-black/35 hover:bg-black/55 border border-[#C9A45C]/50 text-[#F2E6D2] text-xs font-medium backdrop-blur-xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-[#C9A45C]" />
            <span>Okuma Masasına Git</span>
          </button>
        </div>
      </div>
    </section>
  );
}
