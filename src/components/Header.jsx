import {
  BarChart3,
  BookOpen,
  Kanban,
  Moon,
  Plus,
  Quote,
  RotateCcw,
  Sun,
  Trash2,
} from 'lucide-react';

const TABS = [
  { id: 'kanban', label: 'Okuma Panosu', icon: Kanban },
  { id: 'quotes', label: 'Alıntılar & Notlar', icon: Quote },
  { id: 'analytics', label: 'Hedef & Analiz', icon: BarChart3 },
];

export default function Header({
  activeTab,
  onTabChange,
  onAddBookClick,
  theme,
  onToggleTheme,
  isDemoData,
  onResetDemo,
  onClearLibrary,
  totalQuotes,
}) {
  const isDark = theme === 'dark';

  return (
    <header className="sticky top-0 z-30 border-b border-border-subtle bg-bg-primary/95 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 flex items-center justify-between gap-4">
          {/* Sol: Marka */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg border border-border-subtle bg-accent-primary text-white flex items-center justify-center shrink-0">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2">
                <h1 className="font-serif text-2xl font-medium tracking-tight text-text-primary leading-none">
                  LIBRIS
                </h1>
                <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.18em] text-text-secondary">
                  Kişisel Kütüphane
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-text-secondary truncate mt-0.5">
                Okuma Kanban Panosu, Alıntı Defteri ve Open Library Kataloğu
              </p>
            </div>
          </div>

          {/* Orta: Masaüstü Sekmeler */}
          <nav
            className="hidden md:flex items-center rounded-lg border border-border-subtle bg-bg-secondary/60 p-1 gap-1"
            aria-label="Görünüm seçimi"
          >
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => onTabChange(id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-md text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? 'bg-bg-card text-text-primary shadow-xs border border-border-subtle/70'
                      : 'text-text-secondary hover:text-text-primary border border-transparent'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${active ? 'text-accent-primary' : ''}`} />
                  <span>{label}</span>
                  {id === 'quotes' && totalQuotes > 0 && (
                    <span className="font-mono text-[10px] px-1.5 py-0.2 rounded bg-bg-secondary text-text-secondary tabular-nums">
                      {totalQuotes}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sağ: Aksiyonlar */}
          <div className="flex items-center gap-2 shrink-0">
            {isDemoData ? (
              <button
                type="button"
                onClick={onClearLibrary}
                title="Örnek kitapları temizle ve kendi kütüphaneni sıfırdan kur"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-border-subtle bg-bg-card hover:bg-bg-secondary text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onResetDemo}
                title="Örnek kütüphane verisini yükle"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-border-subtle bg-bg-card hover:bg-bg-secondary text-xs font-medium text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Örnek Veri</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Açık temaya geç' : 'Koyu temaya geç'}
              className="p-2 rounded-lg border border-border-subtle bg-bg-card hover:bg-bg-secondary text-text-primary transition-colors cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-accent-amber" />
              ) : (
                <Moon className="w-4 h-4 text-text-secondary" />
              )}
            </button>

            <button
              type="button"
              onClick={onAddBookClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-accent-primary text-white text-xs font-semibold hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Kitap Ekle</span>
            </button>
          </div>
        </div>

        {/* Mobil Sekme Barı */}
        <nav
          className="md:hidden flex items-center gap-1 pb-2.5 overflow-x-auto"
          aria-label="Mobil görünüm seçimi"
        >
          {TABS.map(({ id, label, icon: Icon }) => {
            const active = activeTab === id;
            return (
              <button
                key={id}
                type="button"
                onClick={() => onTabChange(id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-medium shrink-0 cursor-pointer ${
                  active
                    ? 'border-accent-primary bg-accent-primary-soft text-accent-primary'
                    : 'border-border-subtle bg-bg-card text-text-secondary'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
