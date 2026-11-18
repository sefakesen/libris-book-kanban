export const KANBAN_COLUMNS = [
  {
    id: 'todo',
    label: 'Okunacak',
    subtitle: 'Okuma listesi ve sıradaki eserler',
    dotClass: 'bg-accent-warm',
    badgeClass: 'bg-accent-warm-soft text-accent-warm border-accent-warm/30',
  },
  {
    id: 'reading',
    label: 'Okunuyor',
    subtitle: 'Aktif okuma masasındaki kitaplar',
    dotClass: 'bg-accent-amber',
    badgeClass: 'bg-accent-amber-soft text-accent-amber border-accent-amber/30',
  },
  {
    id: 'completed',
    label: 'Bitti',
    subtitle: 'Tamamlanan ve kütüphaneye eklenenler',
    dotClass: 'bg-accent-primary',
    badgeClass: 'bg-accent-primary-soft text-accent-primary border-accent-primary/30',
  },
];

export const CATEGORIES = {
  literature: {
    id: 'literature',
    label: 'Edebiyat & Klasik',
    badgeClass: 'bg-accent-warm-soft text-accent-warm border-accent-warm/25',
    barClass: 'bg-accent-warm',
    coverBg: '#6B3423',
  },
  software: {
    id: 'software',
    label: 'Yazılım & Mimari',
    badgeClass: 'bg-accent-primary-soft text-accent-primary border-accent-primary/25',
    barClass: 'bg-accent-primary',
    coverBg: '#1E4D3B',
  },
  science: {
    id: 'science',
    label: 'Bilim & Teknoloji',
    badgeClass: 'bg-sky-500/10 text-sky-700 dark:text-sky-300 border-sky-500/25',
    barClass: 'bg-sky-600',
    coverBg: '#1E3A5F',
  },
  philosophy: {
    id: 'philosophy',
    label: 'Felsefe & Düşünce',
    badgeClass: 'bg-accent-amber-soft text-accent-amber border-accent-amber/25',
    barClass: 'bg-accent-amber',
    coverBg: '#6E4B18',
  },
  history: {
    id: 'history',
    label: 'Tarih & Biyografi',
    badgeClass: 'bg-bg-secondary text-text-primary border-border-subtle',
    barClass: 'bg-stone-500',
    coverBg: '#4A433B',
  },
  psychology: {
    id: 'psychology',
    label: 'Psikoloji & Gelişim',
    badgeClass: 'bg-emerald-500/10 text-emerald-800 dark:text-emerald-300 border-emerald-500/25',
    barClass: 'bg-emerald-600',
    coverBg: '#274C43',
  },
};

export const CATEGORY_LIST = Object.values(CATEGORIES);

export const STATUS_LABELS = {
  todo: 'Okunacak',
  reading: 'Okunuyor',
  completed: 'Bitti',
};
