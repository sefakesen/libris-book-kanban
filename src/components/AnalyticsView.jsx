import {
  CheckCircle2,
  Download,
  FileCode2,
  Target,
  Upload,
} from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import { CATEGORY_LIST, KANBAN_COLUMNS } from '../constants/bookConstants';
import { exportLibraryJson, importLibraryJsonFile } from '../utils/storage';

export default function AnalyticsView({
  state,
  summary,
  onUpdateYearlyGoal,
  onReplaceFromImport,
}) {
  const fileInputRef = useRef(null);
  const [importStatus, setImportStatus] = useState(null);

  const categoryBreakdown = useMemo(() => {
    const total = Math.max(1, state.books.length);
    return CATEGORY_LIST.map((cat) => {
      const catBooks = state.books.filter((b) => b.category === cat.id);
      const completed = catBooks.filter((b) => b.status === 'completed').length;
      const pagesRead = catBooks.reduce((s, b) => s + (b.currentPage || 0), 0);
      return {
        ...cat,
        count: catBooks.length,
        completed,
        pagesRead,
        sharePct: Math.round((catBooks.length / total) * 100),
      };
    }).filter((c) => c.count > 0);
  }, [state.books]);

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportStatus(null);
    try {
      const clean = await importLibraryJsonFile(file);
      onReplaceFromImport(clean);
      setImportStatus({
        type: 'success',
        text: `${clean.books.length} kitap içeren kütüphane yedeği doğrulandı ve yüklendi.`,
      });
    } catch (err) {
      setImportStatus({
        type: 'error',
        text: err.message || 'Yedek dosyası okunamadı.',
      });
    } finally {
      e.target.value = '';
    }
  };

  return (
    <section className="space-y-8">
      <div>
        <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-accent-primary font-semibold">
          KÜTÜPHANE SİCİLİ &amp; VERİ SANDIĞI
        </span>
        <h2 className="font-display text-3xl sm:text-4xl font-semibold text-text-primary mt-1">
          Hedef ve Kütüphane Analizi
        </h2>
        <p className="text-sm text-text-secondary mt-1">
          Kategori dağılımlarınız, yıllık okuma hedefiniz ve taşınabilir JSON yedekleme araçları.
        </p>
      </div>

      {importStatus && (
        <div
          className={`rounded-xl border px-4 py-3 text-xs font-medium flex items-center gap-2 ${
            importStatus.type === 'success'
              ? 'border-accent-primary/40 bg-accent-primary-soft text-accent-primary'
              : 'border-danger/40 bg-danger/10 text-danger'
          }`}
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{importStatus.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Kategori Dağılımı */}
        <div className="lg:col-span-7 catalog-card rounded-xl overflow-hidden">
          <div className="wood-beam px-6 py-3.5 flex items-center justify-between text-[#F5EBDD]">
            <h3 className="font-display text-xl font-semibold text-[#F7EFE2]">
              Kategori Bazlı Kütüphane Dağılımı
            </h3>
            <span className="font-mono text-xs text-[#D8B46A] tabular-nums">
              {state.books.length} kitap
            </span>
          </div>

          <div className="p-6 space-y-5">
            {categoryBreakdown.length === 0 ? (
              <p className="text-xs text-text-secondary">Henüz kitap bulunmuyor.</p>
            ) : (
              <div className="space-y-4">
                {categoryBreakdown.map((cat) => (
                  <div key={cat.id} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-text-primary">{cat.label}</span>
                      <span className="font-mono text-text-secondary tabular-nums">
                        {cat.count} kitap ({cat.completed} bitti) ·{' '}
                        {cat.pagesRead.toLocaleString('tr-TR')} syf
                      </span>
                    </div>
                    <div className="h-2.5 w-full rounded-full bg-bg-secondary overflow-hidden">
                      <div
                        className={`h-full transition-all duration-300 ${cat.barClass}`}
                        style={{ width: `${cat.sharePct}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Kanban Durum Dağılım Özeti */}
            <div className="pt-4 border-t border-border-subtle grid grid-cols-3 gap-3">
              {KANBAN_COLUMNS.map((col) => {
                const count = state.books.filter((b) => b.status === col.id).length;
                return (
                  <div
                    key={col.id}
                    className="rounded-lg border border-border-subtle bg-bg-primary p-3"
                  >
                    <div className="flex items-center gap-1.5 text-xs text-text-secondary">
                      <span className={`w-2 h-2 rounded-full ${col.dotClass}`} />
                      <span>{col.label}</span>
                    </div>
                    <div className="font-mono text-xl font-semibold text-text-primary tabular-nums mt-1">
                      {count}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Yıllık Hedef & JSON Yedekleme */}
        <div className="lg:col-span-5 space-y-6">
          <div className="catalog-card rounded-xl overflow-hidden">
            <div className="wood-beam px-6 py-3.5 flex items-center gap-2 text-[#F5EBDD]">
              <Target className="w-4 h-4 text-[#D8B46A]" />
              <h3 className="font-display text-xl font-semibold text-[#F7EFE2]">
                Yıllık Okuma Hedefi
              </h3>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-text-secondary">Tamamlanan / Hedef</div>
                  <div className="font-mono text-2xl font-semibold text-text-primary tabular-nums mt-0.5">
                    {summary.completedCount} / {state.settings.yearlyGoal} kitap
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="yearly-goal-input" className="text-xs text-text-secondary">
                    Hedef:
                  </label>
                  <input
                    id="yearly-goal-input"
                    type="number"
                    min={1}
                    max={500}
                    value={state.settings.yearlyGoal}
                    onChange={(e) => onUpdateYearlyGoal(e.target.value)}
                    className="w-20 rounded-lg border border-border-subtle bg-bg-primary px-2.5 py-1.5 font-mono text-sm text-text-primary"
                  />
                </div>
              </div>

              <div className="h-2.5 w-full rounded-full bg-bg-secondary overflow-hidden">
                <div
                  className="h-full bg-accent-primary transition-all duration-300"
                  style={{ width: `${summary.goalProgress}%` }}
                />
              </div>
            </div>
          </div>

          <div className="catalog-card rounded-xl p-6 space-y-4 paper-grain">
            <h3 className="font-display text-xl font-semibold text-text-primary border-b border-border-subtle pb-3">
              LocalStorage Yedekleme (JSON)
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Tüm kitaplarınızı, sayfa ilerlemenizi ve alıntılarınızı JSON dosyası olarak dışa
              aktarabilir veya başka bir tarayıcıya güvenli şema doğrulamasıyla aktarabilirsiniz.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => exportLibraryJson(state)}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-xs font-semibold text-text-primary cursor-pointer"
              >
                <Download className="w-4 h-4 text-accent-primary" />
                <span>JSON İndir</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-border-subtle bg-bg-primary hover:bg-bg-secondary text-xs font-semibold text-text-primary cursor-pointer"
              >
                <Upload className="w-4 h-4 text-accent-warm" />
                <span>JSON Yükle</span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Yönerge Uyumluluk Kartı */}
      <div className="catalog-card rounded-xl p-6 space-y-4 paper-grain">
        <div className="flex items-center gap-2">
          <FileCode2 className="w-5 h-5 text-accent-primary" />
          <h3 className="font-display text-xl font-semibold text-text-primary">
            Web Geliştirme Proje Yönergesi Mimarisi
          </h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 text-xs">
          <div className="rounded-lg border border-border-subtle bg-bg-primary p-4 space-y-1">
            <span className="font-mono text-[10px] text-accent-primary font-semibold">
              TEKNOLOJİ &amp; API
            </span>
            <p className="text-text-secondary leading-relaxed">
              React 19, Vite 6, Tailwind CSS v4, LocalStorage kalıcılığı ve canlı Open Library
              Search API entegrasyonu.
            </p>
          </div>
          <div className="rounded-lg border border-border-subtle bg-bg-primary p-4 space-y-1">
            <span className="font-mono text-[10px] text-accent-primary font-semibold">
              MODÜLER YAPI
            </span>
            <p className="text-text-secondary leading-relaxed">
              Custom hook (`useBooks.js`), API/Depolama yardımcıları (`utils/api.js`, `storage.js`)
              ve tek sorumluluklu bileşenler.
            </p>
          </div>
          <div className="rounded-lg border border-border-subtle bg-bg-primary p-4 space-y-1">
            <span className="font-mono text-[10px] text-accent-primary font-semibold">
              GÜVENLİK
            </span>
            <p className="text-text-secondary leading-relaxed">
              HTTP/HTTPS URL doğrulama, 2 MB import sınırı, Prototype Pollution koruması ve API
              zaman aşımı kontrolü.
            </p>
          </div>
          <div className="rounded-lg border border-border-subtle bg-bg-primary p-4 space-y-1">
            <span className="font-mono text-[10px] text-accent-primary font-semibold">
              DAĞITIM
            </span>
            <p className="text-text-secondary leading-relaxed">
              Vercel (`vercel.json`) ve Netlify (`netlify.toml`) için hazır yapılandırma ile tek
              tıkla canlıya alınabilir.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
