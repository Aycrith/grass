/**
 * Button — Mission 1.
 *
 * Polymorphic: renders button, anchor, or Next Link based on `as` / `href`.
 * Variants + sizes follow the design system PRD section 6.
 *
 * Accepts the standard HTML attribute spreads for each element type. Because
 * the project enables `exactOptionalPropertyTypes: true`, we strip the props
 * we handle and compact undefined values before forwarding. The `compactUndefined`
 * helper in `lib/props.ts` is shared with Card.tsx.
 */

import Link from 'next/link';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';

import { cn } from '@/lib/cn';
import { compactUndefined } from '@/lib/props';

import styles from './Button.module.css';

type ButtonVariant = 'primary' | 'sun' | 'sand' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface CommonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  inverse?: boolean;
  className?: string | undefined;
  children?: ReactNode;
  iconRight?: ReactNode;
  iconLeft?: ReactNode;
}

type ButtonElementProps = CommonProps &
  Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof CommonProps> & {
    as?: 'button';
  };

type AnchorElementProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps> & {
    as: 'a';
    href: string;
  };

type LinkElementProps = CommonProps &
  Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof CommonProps | 'href'> & {
    as: 'link';
    href: string;
  };

type ButtonProps = ButtonElementProps | AnchorElementProps | LinkElementProps;

const sizeClass: Record<ButtonSize, string> = {
  sm: styles.sm ?? '',
  md: styles.md ?? '',
  lg: styles.lg ?? '',
};

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    // Destructure the props the component handles by name. `as` and
    // `href` stay on `props` (not destructured) so TypeScript can
    // narrow the union member when checking `props.as` in the 3
    // branches below. Everything else drops into `rest` for the
    // HTML-attribute spread.
    const {
      variant,
      size,
      inverse,
      className,
      iconLeft,
      iconRight,
      children,
      ...rest
    } = props as CommonProps & Record<string, unknown>;

    const cls = cn(
      styles.root,
      styles[variant ?? 'primary'],
      sizeClass[size ?? 'md'],
      inverse && styles.inverse,
      className,
    );

    if (props.as === 'link') {
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          className={cls}
          {...compactUndefined(rest)}
        >
          {iconLeft}
          {children}
          {iconRight}
        </Link>
      );
    }

    if (props.as === 'a') {
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          className={cls}
          {...compactUndefined(rest)}
        >
          {iconLeft}
          {children}
          {iconRight}
        </a>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={cls}
        {...compactUndefined(rest)}
      >
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  },
);
