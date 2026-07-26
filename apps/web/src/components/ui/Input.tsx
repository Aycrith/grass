/**
 * Input — Mission 1
 *
 * Field primitives for forms: text, email, tel, textarea, select.
 * Wraps label + control + optional helper/error text. Error state
 * is set by passing `error` prop.
 *
 * Used by ContactForm + QuoteCalculator (refactored in Phase F).
 *
 * 2026-07-25: trimmed the FieldType union. The legacy 'url' and
 * 'number' variants had no live callers (verified with rg); the
 * current form surface only needs text, email, tel, textarea,
 * and select. If a future form needs URL or number input, add
 * the variant back — the field is well-factored to slot it in.
 */

import { type ComponentPropsWithoutRef, type ReactNode, forwardRef, useId } from 'react';

import { cn } from '@/lib/cn';

import styles from './Input.module.css';

type FieldType = 'text' | 'email' | 'tel' | 'textarea' | 'select';

interface BaseFieldProps {
  label: string;
  helper?: ReactNode;
  error?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
  options?: ReadonlyArray<{ value: string; label: string }>;
}

type TextFieldProps = BaseFieldProps & {
  type?: Exclude<FieldType, 'textarea' | 'select'>;
} & Omit<ComponentPropsWithoutRef<'input'>, 'type' | 'className'>;

type TextAreaFieldProps = BaseFieldProps & {
  type: 'textarea';
} & Omit<ComponentPropsWithoutRef<'textarea'>, 'className'>;

type SelectFieldProps = BaseFieldProps & {
  type: 'select';
  options: ReadonlyArray<{ value: string; label: string }>;
} & Omit<ComponentPropsWithoutRef<'select'>, 'className' | 'children'>;

export type InputProps = TextFieldProps | TextAreaFieldProps | SelectFieldProps;

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(function Input(props, ref) {
  const reactId = useId();
  const {
    label,
    helper,
    error,
    required = false,
    className,
    type = 'text',
    placeholder,
  } = props as BaseFieldProps & { type?: FieldType };
  const id = `field-${reactId}`;
  const helperId = helper ? `${id}-helper` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const describedBy = [helperId, errorId].filter(Boolean).join(' ') || undefined;

  const wrapCls = cn(styles.field, error && styles.error, className);

  const labelEl = (
    <label className={styles.label} htmlFor={id}>
      {label}
      {required && (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      )}
    </label>
  );

  if (type === 'textarea') {
    const {
      label: _l,
      helper: _h,
      error: _e,
      required: _r,
      className: _c,
      type: _t,
      placeholder: _p,
      options: _o,
      ...rest
    } = props as TextAreaFieldProps;
    void _l;
    void _h;
    void _e;
    void _r;
    void _c;
    void _t;
    void _p;
    void _o;
    return (
      <div className={wrapCls}>
        {labelEl}
        <textarea
          id={id}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={styles.textarea}
          required={required}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
        {helper && (
          <p id={helperId} className={styles.helper}>
            {helper}
          </p>
        )}
        {error && (
          <p id={errorId} className={styles.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  if (type === 'select') {
    const {
      label: _l,
      helper: _h,
      error: _e,
      required: _r,
      className: _c,
      type: _t,
      placeholder: _p,
      options,
      ...rest
    } = props as SelectFieldProps;
    void _l;
    void _h;
    void _e;
    void _r;
    void _c;
    void _t;
    void _p;
    return (
      <div className={wrapCls}>
        {labelEl}
        <select
          id={id}
          ref={ref as React.Ref<HTMLSelectElement>}
          className={styles.select}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {helper && (
          <p id={helperId} className={styles.helper}>
            {helper}
          </p>
        )}
        {error && (
          <p id={errorId} className={styles.errorText} role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }

  const {
    label: _l,
    helper: _h,
    error: _e,
    required: _r,
    className: _c,
    type: _t,
    placeholder: _p,
    options: _o,
    ...rest
  } = props as TextFieldProps;
  void _l;
  void _h;
  void _e;
  void _r;
  void _c;
  void _t;
  void _p;
  void _o;
  return (
    <div className={wrapCls}>
      {labelEl}
      <input
        id={id}
        ref={ref as React.Ref<HTMLInputElement>}
        className={styles.control}
        type={type}
        required={required}
        placeholder={placeholder}
        aria-invalid={error ? 'true' : undefined}
        aria-describedby={describedBy}
        {...rest}
      />
      {helper && (
        <p id={helperId} className={styles.helper}>
          {helper}
        </p>
      )}
      {error && (
        <p id={errorId} className={styles.errorText} role="alert">
          {error}
        </p>
      )}
    </div>
  );
});
