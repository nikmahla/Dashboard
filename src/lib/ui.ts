/**
 * Shared UI tokens — keep spacing, radius, typography, and surfaces
 * consistent across dashboard and admin pages.
 */
export const ui = {
  radius: {
    sm: 'rounded-md',
    md: 'rounded-lg',
    lg: 'rounded-[0.625rem]',
    full: 'rounded-full',
  },
  shadow: {
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
    xl: 'shadow-xl',
    strong: 'shadow-2xl',
  },
  spacing: {
    pageY: 'space-y-6',
    sectionGap: 'gap-6',
    cardPadding: 'p-4 sm:p-5 md:p-6',
    stackSm: 'space-y-1',
    stackMd: 'space-y-4',
  },
  typography: {
    pageTitle: 'text-2xl font-semibold tracking-tight text-[color:var(--foreground)]',
    pageSubtitle: 'text-sm text-[color:var(--muted)]',
    sectionTitle: 'text-base font-semibold text-[color:var(--foreground)]',
    label: 'text-sm font-medium text-[color:var(--muted)]',
    value: 'text-xl font-semibold tabular-nums',
    caption: 'text-xs text-[color:var(--muted)]',
  },
  surface: {
    panel: 'rounded-[0.625rem] bg-[color:var(--card-bg)] border border-[color:var(--border-default)]',
    panelHover: 'transition-colors duration-150 hover:border-[color:var(--muted)]',
    card: 'rounded-lg bg-[color:var(--card-bg)] border border-[color:var(--border-default)]',
    cardElevated: 'rounded-lg bg-[color:var(--card-bg)] border border-[color:var(--border-default)] shadow-[var(--shadow-md)]',
  },
  layout: {
    kpiGrid: 'grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4',
    chartGrid: 'grid grid-cols-1 gap-6 xl:grid-cols-2',
    main: 'w-full max-w-7xl mx-auto',
    shell: 'min-h-screen md:flex',
    content: 'flex flex-1 flex-col min-w-0',
  },
  chart: {
    height: 'min-h-[240px] h-[clamp(240px,34vh,320px)]',
    axisTick: { fill: 'var(--muted)', fontSize: 12 },
    gridStroke: 'var(--border-muted)',
    margin: { top: 8, right: 16, left: 0, bottom: 8 },
  },
  icon: {
    sm: 16,
    md: 18,
    lg: 20,
  },
  search: {
    wrap: 'flex items-center gap-2 rounded-lg border border-[color:var(--glass-border)] bg-[color:var(--card-bg)] px-3 py-2 focus-within:border-[color:var(--primary)] focus-within:ring-2 focus-within:ring-[var(--primary-soft)] transition-[border-color,box-shadow]',
    input: 'w-full min-w-0 bg-transparent text-sm text-[color:var(--foreground)] outline-none placeholder:text-[color:var(--muted)]',
  },
  table: {
    shell: 'data-table-shell rounded-[0.625rem] overflow-hidden relative flex flex-col min-h-0',
    table: 'data-table min-w-full text-sm',
    row: 'data-table-row',
    footer: 'data-table-footer',
  },
} as const;

export type KpiColor = keyof typeof kpiColors;

export const kpiColors = {
  purple: { iconBg: 'bg-[var(--primary-soft)] text-[color:var(--primary)]', value: 'text-[color:var(--foreground)]', stroke: 'var(--primary)' },
  blue: { iconBg: 'bg-[var(--primary-soft)] text-[color:var(--primary)]', value: 'text-[color:var(--foreground)]', stroke: 'var(--primary)' },
  green: { iconBg: 'bg-[var(--success-soft)] text-[color:var(--success)]', value: 'text-[color:var(--foreground)]', stroke: 'var(--success)' },
  orange: { iconBg: 'bg-[var(--warning-soft)] text-[color:var(--warning)]', value: 'text-[color:var(--foreground)]', stroke: 'var(--warning)' },
} as const;

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
