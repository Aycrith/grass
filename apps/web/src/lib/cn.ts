/**
 * cn() — className composition helper.
 *
 * Combines clsx (conditional joining) with tailwind-merge (dedup conflicting
 * Tailwind utilities). Even though this codebase does not use Tailwind, the
 * twMerge pass is a cheap safety net for any third-party component that
 * injects utility classes via @apply or inline class names.
 *
 * Use everywhere a JSX `className` is built conditionally.
 */

import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
