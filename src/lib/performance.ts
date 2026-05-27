/**
 * Performance monitoring utilities for Next.js applications
 * Tracks Core Web Vitals and custom metrics
 */

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
}

/**
 * Report Web Vitals (LCP, FID, CLS)
 */
export function reportWebVitals(metric: {
  name: string;
  value: number;
  id: string;
  label: string;
  delta: number;
  rating: string;
}) {
  // Send to analytics service
  if (typeof window !== 'undefined') {
    console.log('[Web Vitals]', {
      metric: metric.name,
      value: metric.value.toFixed(2),
      rating: metric.rating,
    });

    // Example: Send to Analytics
    if (window.gtag) {
      window.gtag('event', metric.name, {
        value: Math.round(metric.value),
        event_category: 'web_vitals',
        event_label: metric.id,
        non_interaction: true,
      });
    }
  }
}

/**
 * Performance observer for monitoring Long Tasks
 */
export function observeLongTasks(callback?: (duration: number) => void) {
  if (typeof window === 'undefined') return;

  if ('PerformanceObserver' in window) {
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = entry.duration;
          console.warn('[Long Task]', {
            duration: `${duration.toFixed(0)}ms`,
            startTime: entry.startTime,
          });
          callback?.(duration);
        }
      });

      observer.observe({ entryTypes: ['longtask'] });
      return observer;
    } catch (e) {
      console.debug('Long Tasks not supported');
    }
  }
}

/**
 * Measure component render performance
 */
export function measureRender(componentName: string, startMark: string) {
  if (typeof window === 'undefined') return;

  try {
    const endMark = `${startMark}-end`;
    performance.mark(endMark);
    performance.measure(componentName, startMark, endMark);

    const measure = performance.getEntriesByName(componentName)[0];
    if (measure) {
      console.debug(`[Render] ${componentName}: ${measure.duration.toFixed(2)}ms`);
    }
  } catch (e) {
    // ignore
  }
}

/**
 * Debounce heavy computations
 */
export function debounceTask(fn: () => void, delay = 300) {
  let timeoutId: NodeJS.Timeout;
  return () => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(fn, delay);
  };
}

/**
 * Request Idle Callback polyfill wrapper
 */
export function scheduleIdleTask(callback: () => void) {
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    requestIdleCallback(callback);
  } else {
    setTimeout(callback, 0);
  }
}
