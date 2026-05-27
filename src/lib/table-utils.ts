const NUMERIC_KEY_PATTERN =
  /^(id|price|total|amount|qty|quantity|orders|count|stock|sold|revenue|number|#)$/i;

type ColumnLike = {
  key: string | number | symbol;
  align?: 'left' | 'right';
  numeric?: boolean;
};

export function getColumnAlign<T>(
  col: ColumnLike & { key: keyof T },
  value: unknown
): 'left' | 'right' {
  if (col.align) return col.align;
  if (col.numeric) return 'right';
  if (typeof value === 'number') return 'right';
  if (NUMERIC_KEY_PATTERN.test(String(col.key))) return 'right';
  return 'left';
}

export function headerAlignClass(align: 'left' | 'right') {
  return align === 'right' ? 'text-right' : 'text-left';
}

export function headerFlexClass(align: 'left' | 'right') {
  return align === 'right' ? 'justify-end' : 'justify-start';
}

export type ColumnWidthKind = 'index' | 'primary' | 'text' | 'numeric' | 'actions';

export function getColumnWidthKind<T>(
  col: ColumnLike & { key: keyof T },
  columnIndex: number,
  align: 'left' | 'right'
): ColumnWidthKind {
  if (align === 'right' || col.numeric) return 'numeric';
  if (columnIndex === 0) return 'primary';
  return 'text';
}

export function columnWidthClass(kind: ColumnWidthKind): string {
  const map: Record<ColumnWidthKind, string> = {
    index: 'data-table-col-index',
    primary: 'data-table-col-primary',
    text: 'data-table-col-text',
    numeric: 'data-table-col-numeric',
    actions: 'data-table-col-actions',
  };
  return map[kind];
}
