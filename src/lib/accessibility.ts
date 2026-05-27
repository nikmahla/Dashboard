/**
 * Accessibility utilities for WCAG 2.1 AA compliance
 */

/**
 * Generate accessible button ARIA attributes
 */
export interface AccessibleButtonProps {
  'aria-label'?: string;
  'aria-pressed'?: boolean;
  'aria-expanded'?: boolean;
  'aria-controls'?: string;
}

export function getAccessibleButtonProps(
  label?: string,
  pressed?: boolean,
  expanded?: boolean,
  controlsId?: string
): AccessibleButtonProps {
  const props: AccessibleButtonProps = {};

  if (label) props['aria-label'] = label;
  if (pressed !== undefined) props['aria-pressed'] = pressed;
  if (expanded !== undefined) props['aria-expanded'] = expanded;
  if (controlsId) props['aria-controls'] = controlsId;

  return props;
}

/**
 * Announce messages to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  if (typeof document === 'undefined') return;

  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only'; // visually hidden but readable by screen readers
  announcement.textContent = message;

  document.body.appendChild(announcement);

  // Remove after screen reader reads it
  setTimeout(() => announcement.remove(), 1000);
}

/**
 * Create accessible modals/dialogs
 */
export function setUpModalAccessibility(
  modalElement: HTMLElement,
  triggerElement?: HTMLElement
) {
  if (!modalElement) return;

  // Set focus trap
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );

  if (focusableElements.length === 0) return;

  const firstElement = focusableElements[0] as HTMLElement;
  const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeydown = (e: KeyboardEvent) => {
    if (e.key !== 'Tab') return;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  modalElement.addEventListener('keydown', handleKeydown);

  // Return cleanup function
  return () => {
    modalElement.removeEventListener('keydown', handleKeydown);
  };
}

/**
 * Skip to main content link (for keyboard navigation)
 */
export function createSkipLink() {
  const skipLink = document.createElement('a');
  skipLink.href = '#main-content';
  skipLink.textContent = 'Skip to main content';
  skipLink.className = 'sr-only focus:not-sr-only';
  skipLink.style.cssText = `
    position: absolute;
    top: -40px;
    left: 0;
    background: #000;
    color: #fff;
    padding: 8px;
    z-index: 100;
    &:focus {
      top: 0;
    }
  `;

  return skipLink;
}

/**
 * Validate color contrast ratio (WCAG AA: 4.5:1 for normal text, 3:1 for large text)
 */
export function getContrastRatio(rgb1: string, rgb2: string): number {
  const getLuminance = (rgb: string) => {
    const match = rgb.match(/\d+/g);
    if (!match || match.length < 3) return 0;

    const [r, g, b] = match.map((v) => {
      const v2 = parseInt(v) / 255;
      return v2 <= 0.03928 ? v2 / 12.92 : Math.pow((v2 + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  };

  const l1 = getLuminance(rgb1);
  const l2 = getLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);

  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Format numbers for accessibility (read naturally by screen readers)
 */
export function formatAccessibleNumber(num: number): string {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 2,
  }).format(num);
}
