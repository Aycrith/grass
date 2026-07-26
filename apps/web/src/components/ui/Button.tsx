/**
 * Button — Mission 1.
 *
 * Polymorphic: renders button, anchor, or Next Link based on `as` / `href`.
 * Variants + sizes follow the design system PRD section 6.
 *
 * Accepts the standard HTML attribute spreads for each element type. Because
 * the project enables `exactOptionalPropertyTypes: true`, we strip the props
 * we handle and compact undefined values before forwarding.
 */

import Link from 'next/link';
import {
  type AnchorHTMLAttributes,
  type ButtonHTMLAttributes,
  type ReactNode,
  forwardRef,
} from 'react';

import { cn } from '@/lib/cn';

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

function compactUndefined<T extends Record<string, unknown>>(obj: T): Partial<T> {
  const out: Partial<T> = {};
  for (const k of Object.keys(obj) as Array<keyof T>) {
    const v = obj[k];
    if (v === undefined) continue;
    out[k] = v;
  }
  return out;
}

export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  function Button(props, ref) {
    const cls = cn(
      styles.root,
      styles[props.variant ?? 'primary'],
      sizeClass[props.size ?? 'md'],
      props.inverse && styles.inverse,
      props.className,
    );

    const {
      as: _as,
      variant: _v,
      size: _s,
      inverse: _i,
      className: _c,
      iconLeft,
      iconRight,
      children,
      ...rest
    } = props as CommonProps & { as?: string } & Record<string, unknown>;
    void _as;
    void _v;
    void _s;
    void _i;
    void _c;

    if (props.as === 'link') {
      const linkRest = compactUndefined(rest);
      return (
        <Link
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          className={cls}
          {...linkRest}
        >
          {iconLeft}
          {children}
          {iconRight}
        </Link>
      );
    }

    if (props.as === 'a') {
      const anchorRest = compactUndefined(rest);
      return (
        <a
          ref={ref as React.Ref<HTMLAnchorElement>}
          href={props.href}
          className={cls}
          {...anchorRest}
        >
          {iconLeft}
          {children}
          {iconRight}
        </a>
      );
    }

    const buttonRest = compactUndefined(rest);
    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        type="button"
        className={cls}
        {...buttonRest}
      >
        {iconLeft}
        {children}
        {iconRight}
      </button>
    );
  },
);
