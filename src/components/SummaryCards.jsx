import { BookCheck, BookOpenText, Library, Quote, Target } from 'lucide-react';

export default function SummaryCards({ summary, yearlyGoal }) {
  return (
    <section
      className="grid grid-cols-2 lg:grid-cols-4 gap-3.5"
      aria-label="Kütüphane özet metrikleri"
    >
      <article className="rounded-xl border border-border-subtle bg-bg-card p-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Toplam Kitap</span>
          <Library className="w-4 h-4 text-accent-warm" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
            {summary.totalBooks}
          </span>
          <span className="text-[11px] font-mono text-text-secondary tabular-nums">
            {summary.todoCount} sırada
          </span>
        </div>
      </article>

      <article className="rounded-xl border border-border-subtle bg-bg-card p-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Şu An Okunuyor</span>
          <BookOpenText className="w-4 h-4 text-accent-amber" />
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
            {summary.readingCount}
          </span>
          <span className="text-[11px] font-mono text-text-secondary tabular-nums">
            {summary.totalPagesRead.toLocaleString('tr-TR')} syf okundu
          </span>
        </div>
      </article>

      <article className="rounded-xl border border-border-subtle bg-bg-card p-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Yıllık Okuma Hedefi</span>
          <Target className="w-4 h-4 text-accent-primary" />
        </div>
        <div className="mt-2 flex items-baseline justify-between gap-2">
          <span className="font-mono text-2xl font-semibold text-text-primary tabular-nums">
            {summary.completedCount}
            <span className="text-sm font-normal text-text-secondary"> / {yearlyGoal}</span>
          </span>
          <span className="font-mono text-xs font-semibold text-accent-primary tabular-nums">
            %{summary.goalProgress}
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full rounded-full bg-bg-secondary overflow-hidden">
          <div
            className="h-full bg-accent-primary transition-all duration-300"
            style={{ width: `${summary.goalProgress}%` }}
          />
        </div>
      </article>

      <article className="rounded-xl border border-border-subtle bg-bg-card p-4">
        <div className="flex items-center justify-between text-xs text-text-secondary">
          <span>Biten & Alıntılar</span>
          <Quote className="w-4 h-4 text-accent-warm" />
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="inline-flex items-center gap-1 font-mono text-2xl font-semibold text-text-primary tabular-nums">
            <BookCheck className="w-4 h-4 text-accent-primary" />
            {summary.completedCount}
          </span>
          <span className="text-[11px] font-mono text-text-secondary tabular-nums">
            {summary.totalQuotes} alıntı notu
          </span>
        </div>
      </article>
    </section>
  );
}
