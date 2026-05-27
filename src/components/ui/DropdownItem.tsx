'use client';

import Link from 'next/link';
import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/ui';

const itemClass =
  'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm text-[color:var(--foreground)] transition-colors hover:bg-[var(--primary-soft)] focus:outline-none focus-visible:bg-[var(--primary-soft)]';

type DropdownItemProps = {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  href?: string;
  destructive?: boolean;
};

export function DropdownLink({ icon: Icon, label, href, onClick }: DropdownItemProps) {
  return (
    <Link href={href!} onClick={onClick} className={itemClass}>
      <Icon size={16} strokeWidth={1.75} aria-hidden />
      {label}
    </Link>
  );
}

export function DropdownButton({
  icon: Icon,
  label,
  onClick,
  destructive,
}: Omit<DropdownItemProps, 'href'>) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(itemClass, 'text-left', destructive && 'text-[color:var(--danger)]')}
    >
      <Icon size={16} strokeWidth={1.75} aria-hidden />
      {label}
    </button>
  );
}
