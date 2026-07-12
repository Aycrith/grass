'use client';

/**
 * SiteHeader — sticky brand header.
 *
 * Behavior:
 *   - Transparent over hero (initial state)
 *   - Gains a sand-bleached backdrop-blur + 1px border + shadow after 80px
 *   - Center nav (Services, Areas, Pricing, About). Right: 'Get a quote'
 *     pill linking to `/quote`.
 *   - On mobile (≤900px): nav collapses, a Radix-Dialog-backed drawer
 *     opens from the right when the hamburger is tapped.
 *   - Active route gets a clay 2px underline (`data-active="true"`).
 *
 * Reduced motion: blur is bypassed when `prefers-reduced-motion: reduce`.
 * Lenis-coupled: scroll handler uses a passive listener; the threshold
 * lives in CSS via the `.scrolled` class.
 */

import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Menu, X } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { type ReactNode, useEffect, useRef, useState } from 'react';

import { BUSINESS } from '@/lib/business';
import { cn } from '@/lib/cn';

import { Button, LogoLockup } from '@/components/ui';

import styles from './SiteHeader.module.css';

const NAV_ITEMS = [
  { href: '/services', label: 'Services' },
  { href: '/areas', label: 'Service Areas' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/about', label: 'About' },
] as const;

const SCROLL_THRESHOLD = 80;

interface SiteHeaderProps {
  className?: string;
}

function isActiveRoute(pathname: string | null, href: string): boolean {
  if (!pathname) return false;
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function MobileDrawer({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (next: boolean) => void;
}) {
  const pathname = usePathname();

  // Auto-close the drawer when navigation happens. We track `open`
  // via a ref so the effect runs only on route change, never on
  // toggle — otherwise opening the drawer would immediately close it.
  const openRef = useRef(open);
  useEffect(() => {
    openRef.current = open;
  }, [open]);
  useEffect(() => {
    if (pathname !== null && openRef.current) onOpenChange(false);
  }, [pathname, onOpenChange]);

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className={styles.dialogOverlay} />
        <DialogPrimitive.Content className={styles.dialogContent} aria-describedby={undefined}>
          <div className={styles.dialogHeader}>
            <DialogPrimitive.Title className={styles.dialogTitle}>Menu</DialogPrimitive.Title>
            <DialogPrimitive.Close className={styles.dialogClose} aria-label="Close menu">
              <X size={22} aria-hidden="true" />
            </DialogPrimitive.Close>
          </div>

          <nav aria-label="Mobile primary">
            <ul className={styles.dialogNav}>
              <li>
                <Link
                  href="/"
                  className={styles.dialogLink}
                  data-active={pathname === '/' ? 'true' : undefined}
                >
                  Home
                </Link>
              </li>
              {NAV_ITEMS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={styles.dialogLink}
                    data-active={isActiveRoute(pathname, item.href) ? 'true' : undefined}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <Button as="link" href="/quote" variant="sun" size="lg">
            Get a free quote
          </Button>

          <div className={styles.dialogFooter}>
            <p>
              <a href={`tel:${BUSINESS.phone}`}>{BUSINESS.phone}</a>
              <br />
              <a href={`mailto:${BUSINESS.email}`}>{BUSINESS.email}</a>
            </p>
            <p className={styles.dialogFooterGap}>
              {BUSINESS.address.line1}, {BUSINESS.address.city}, {BUSINESS.address.state}{' '}
              {BUSINESS.address.zip}
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export function SiteHeader({ className }: SiteHeaderProps): ReactNode {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <header className={cn(styles.root, scrolled && styles.scrolled, className)}>
        <div className="container">
          <div className={styles.inner}>
            <Link href="/" className={styles.brand} aria-label={`${BUSINESS.name} home`}>
              <LogoLockup word={BUSINESS.name} markSize={32} />
            </Link>

            <div className={styles.nav}>
              <nav aria-label="Primary">
                <ul className={styles.navList}>
                  {NAV_ITEMS.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={styles.navLink}
                        data-active={isActiveRoute(pathname, item.href) ? 'true' : undefined}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
              <Button as="link" href="/quote" variant="sun" size="md" className={styles.cta}>
                Free quote
              </Button>
              <button
                type="button"
                className={styles.hamburger}
                aria-label="Open menu"
                aria-expanded={drawerOpen}
                onClick={() => setDrawerOpen(true)}
              >
                <Menu size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <MobileDrawer open={drawerOpen} onOpenChange={setDrawerOpen} />
    </>
  );
}
