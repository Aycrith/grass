/**
 * Container — width primitive.
 *
 * Picks a width bucket via the `size` prop. Use anywhere horizontal
 * rhythm is required; never hard-code widths in pages.
 *
 * `<Container size="prose">` for long-form (privacy, terms, FAQ).
 * `<Container size="marketing">` (default) for sections of the home page.
 * `<Container size="wide">` for full-bleed bento grids.
 */

import type { HTMLAttributes } from 'react';

import { cn } from '@/lib/cn';

import styles from './Container.module.css';

type ContainerSize = 'prose' | 'content' | 'marketing' | 'wide';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: ContainerSize;
}

export function Container({ size = 'marketing', className, children, ...rest }: ContainerProps) {
  const sizeClass =
    size === 'prose'
      ? styles.prose
      : size === 'content'
        ? styles.content
        : size === 'wide'
          ? styles.wide
          : styles.marketing;
  return (
    <div className={cn(styles.root, sizeClass, className)} {...rest}>
      {children}
    </div>
  );
}
