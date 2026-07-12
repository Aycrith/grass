/**
 * LogoLockup — Mission 1
 *
 * Mark + wordmark pairing. Mark scales independently of the word.
 * Used by SiteHeader (Phase B) and the Footer brand block.
 *
 * Renders as a `<Link>` when `href` is provided (browsers default to
 * underlining anchors, so the link variant carries `text-decoration:
 * none` from the CSS module). Otherwise renders a plain `<span>`.
 */

import { cn } from '@/lib/cn';

import styles from './LogoLockup.module.css';
import { LogoMark } from './LogoMark';

interface LogoLockupProps {
  /** Wordmark text. Defaults to BUSINESS.name from lib/business. */
  word?: string;
  /** Mark size in px. Defaults to 32. */
  markSize?: number;
  className?: string;
  /** Render as a link to `/`. */
  href?: string;
}

export function LogoLockup({
  word = 'Largo Lawn',
  markSize = 32,
  className,
  href,
}: LogoLockupProps) {
  const inner = (
    <>
      <LogoMark size={markSize} title={word} />
      <span className={styles.word}>{word}</span>
    </>
  );

  if (href) {
    return (
      <a href={href} className={cn(styles.root, className)}>
        {inner}
      </a>
    );
  }

  return <span className={cn(styles.root, className)}>{inner}</span>;
}
