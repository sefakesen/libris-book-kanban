import {
  BarChart3,
  BookOpen,
  Clock,
  CloudRain,
  Flame,
  Kanban,
  LampDesk,
  Moon,
  Pause,
  Play,
  Plus,
  Quote,
  RotateCcw,
  Sun,
  Trash2,
  VolumeX,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { ambienceAudio } from '../utils/ambienceAudio';

const TABS = [
  { id: 'kanban', label: 'Okuma Odası', icon: Kanban },
  { id: 'quotes', label: 'Altı Çizili Satırlar', icon: Quote },
  { id: 'analytics', label: 'Sicil & Analiz', icon: BarChart3 },
];

export default function Header({
  activeTab,
  onTabChange,
  onAddBookClick,
  theme,
  onToggleTheme,
  lampBoost,
  onToggleLampBoost,
  isDemoData,
  onResetDemo,
  onClearLibrary,
  totalQuotes,
}) {
  const isDark = theme === 'dark';
  const [ambienceMode, setAmbienceMode] = useState('off');
  const [sessionRunning, setSessionRunning] = useState(false);
  const [sessionSeconds, setSessionSeconds] = useState(0);

  useEffect(() => {
    if (!sessionRunning) return undefined;
    const id = setInterval(() => {
      setSessionSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(id);
  }, [sessionRunning]);

  useEffect(() => () => ambienceAudio.stop(), []);

  const handleAmbienceChange = (mode) => {
    const applied = ambienceAudio.setMode(mode);
    setAmbienceMode(applied);
  };

  const mins = String(Math.floor(sessionSeconds / 60)).padStart(2, '0');
  const secs = String(sessionSeconds % 60).padStart(2, '0');

  return (
    <header className="sticky top-0 z-30 wood-beam text-[#F5EBDD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Ana Kütüphane Alınlığı */}
        <div className="h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg border border-[#D8B46A]/50 bg-[#1F4A38] text-[#F5EBDD] flex items-center justify-center shrink-0 shadow-inner">
              <BookOpen className="w-4.5 h-4.5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-baseline gap-2.5">
                <h1 className="font-display text-2xl sm:text-[26px] font-semibold tracking-wide text-[#F7EFE2] leading-none">
                  LIBRIS
                </h1>
                <span className="hidden sm:inline-block font-mono text-[10px] uppercase tracking-[0.2em] text-[#D8B46A]">
                  EX LIBRIS · OKUMA ODASI
                </span>
              </div>
              <p className="hidden lg:block text-[11px] text-[#D8C3A5]/85 truncate mt-0.5">
                Kişisel Kütüphane, Ahşap Raf Vitrini ve Altı Çizili Satırlar Defteri
              </p>
            </div>
          </div>

          {/* Masaüstü Sekmeler */}
          <nav
            className="hidden md:flex items-center rounded-lg border border-white/12 bg-black/25 p-1 gap-1"
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
                      ? 'bg-[#FAF4EA] text-[#231912] shadow-xs'
                      : 'text-[#E5D7C3] hover:text-white hover:bg-white/8'
                  }`}
                >
                  <Icon
                    className={`w-3.5 h-3.5 ${active ? 'text-[#1F4A38]' : 'text-[#D8B46A]'}`}
                  />
                  <span>{label}</span>
                  {id === 'quotes' && totalQuotes > 0 && (
                    <span
                      className={`font-mono text-[10px] px-1.5 rounded tabular-nums ${
                        active
                          ? 'bg-[#E6D7C3] text-[#231912]'
                          : 'bg-white/12 text-[#F5EBDD]'
                      }`}
                    >
                      {totalQuotes}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Sağ Aksiyonlar */}
          <div className="flex items-center gap-2 shrink-0">
            {isDemoData ? (
              <button
                type="button"
                onClick={onClearLibrary}
                title="Örnek kitapları temizle ve kendi kütüphaneni sıfırdan kur"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-white/15 bg-black/20 hover:bg-black/35 text-xs font-medium text-[#E5D7C3] hover:text-white transition-colors cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Temizle</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onResetDemo}
                title="Örnek kütüphane verisini yükle"
                className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-2 rounded-lg border border-white/15 bg-black/20 hover:bg-black/35 text-xs font-medium text-[#E5D7C3] hover:text-white transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Örnek Veri</span>
              </button>
            )}

            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={isDark ? 'Gündüz okuma moduna geç' : 'Gece masa lambası moduna geç'}
              title={isDark ? 'Gündüz Parşömen Modu' : 'Gece Masa Lambası Modu'}
              className="p-2 rounded-lg border border-white/15 bg-black/20 hover:bg-black/35 text-[#F5EBDD] transition-colors cursor-pointer"
            >
              {isDark ? (
                <Sun className="w-4 h-4 text-[#E0A343]" />
              ) : (
                <Moon className="w-4 h-4 text-[#E5D7C3]" />
              )}
            </button>

            <button
              type="button"
              onClick={onAddBookClick}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#D8B46A]/55 bg-[#1F4A38] hover:bg-[#265B45] text-[#F7EFE2] text-xs font-semibold transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Eser Ekle</span>
            </button>
          </div>
        </div>

        {/* Cozy Okuma Köşesi Kontrol Şeridi */}
        <div className="border-t border-white/10 py-2 flex flex-wrap items-center justify-between gap-2 text-[11px]">
          {/* Sol: Ambiyans Ses Seçici */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="font-mono uppercase tracking-wider text-[10px] text-[#D8B46A] mr-1">
              Ambiyans:
            </span>
            {[
              { id: 'off', label: 'Sessiz', icon: VolumeX },
              { id: 'rain', label: 'Yağmur', icon: CloudRain },
              { id: 'fireplace', label: 'Şömine', icon: Flame },
            ].map(({ id, label, icon: Icon }) => {
              const active = ambienceMode === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => handleAmbienceChange(id)}
                  className={`inline-flex items-center gap-1 px-2 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                    active
                      ? 'border-[#D8B46A] bg-[#D8B46A]/20 text-[#FFF6E5]'
                      : 'border-white/10 bg-black/15 text-[#D8C3A5] hover:text-white'
                  }`}
                >
                  <Icon className="w-3 h-3" />
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* Sağ: Masa Lambası + Okuma Seansı Sayacı */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              type="button"
              onClick={onToggleLampBoost}
              aria-pressed={lampBoost}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] transition-colors cursor-pointer ${
                lampBoost
                  ? 'border-[#E0A343] bg-[#E0A343]/20 text-[#FFF4DC]'
                  : 'border-white/10 bg-black/15 text-[#D8C3A5] hover:text-white'
              }`}
            >
              <LampDesk className="w-3.5 h-3.5 text-[#E0A343]" />
              <span>{lampBoost ? 'Masa Lambası Açık' : 'Masa Lambası'}</span>
            </button>

            <div className="flex items-center gap-1.5 rounded border border-white/12 bg-black/25 px-2.5 py-1">
              <Clock className="w-3 h-3 text-[#D8B46A]" />
              <span className="font-mono text-[11px] text-[#F7EFE2] tabular-nums">
                {mins}:{secs}
              </span>
              <button
                type="button"
                onClick={() => setSessionRunning((r) => !r)}
                aria-label={sessionRunning ? 'Okuma seansını duraklat' : 'Okuma seansını başlat'}
                className="p-0.5 text-[#D8C3A5] hover:text-white cursor-pointer"
              >
                {sessionRunning ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
              </button>
              {sessionSeconds > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setSessionRunning(false);
                    setSessionSeconds(0);
                  }}
                  aria-label="Seansı sıfırla"
                  className="p-0.5 text-[#D8C3A5] hover:text-white cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobil Sekme Barı */}
        <nav
          className="md:hidden flex items-center gap-1 pb-2.5 pt-1 overflow-x-auto"
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
                    ? 'border-[#D8B46A] bg-[#FAF4EA] text-[#231912]'
                    : 'border-white/15 bg-black/20 text-[#E5D7C3]'
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
