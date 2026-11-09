'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';
import { DEFAULT_RANGE, type RangeDays } from '@/lib/dashboard-summary';

type Ctx = { days: RangeDays; setDays: (d: RangeDays) => void };

const RangeContext = createContext<Ctx>({ days: DEFAULT_RANGE, setDays: () => {} });

/** One date range shared by every widget on the dashboard. */
export function RangeProvider({ children }: { children: ReactNode }) {
  const [days, setDays] = useState<RangeDays>(DEFAULT_RANGE);
  return <RangeContext.Provider value={{ days, setDays }}>{children}</RangeContext.Provider>;
}

export const useRange = () => useContext(RangeContext);
