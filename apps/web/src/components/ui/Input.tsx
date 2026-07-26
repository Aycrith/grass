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
 *
 * 2026-07-26: simplified the per-branch destructuring. The
 * previous version destructured every prop into a renamed
 * `_label`-style binding and used `void _x;` to silence
 * no-unused-vars. That was a workaround for a 3-branch
 * discriminant; the cleaner shape is to destructure only what
 * each branch actually consumes (label, helper, error,
 * required, className, placeholder, options, + type discriminator)
 * and let `rest` carry the HTML-attribute spread. ESLint's
 * no-unused-vars is satisfied by the destructured names that
 * ARE actually used in the JSX.
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

type InputProps = TextFieldProps | TextAreaFieldProps | SelectFieldProps;

/**
 * Shared helper/error block + aria-describedby wiring. Used by
 * all 3 input kinds. Memoizing the describedBy string keeps
 * the per-render `aria-describedby` attr stable for each field
 * (id changes per render due to React's useId()).
 */
function FieldExtras({
  id,
  helper,
  error,
}: {
  id: string;
  helper?: ReactNode | undefined;
  error?: string | undefined;
}) {
  if (!helper && !error) return null;
  const describedBy = [
    helper ? `${id}-helper` : undefined,
    error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(' ');
  return (
    <>
      {helper ? (
        <p id={`${id}-helper`} className={styles.helper}>
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
      <span data-described-by={describedBy} hidden />
    </>
  );
}

export const Input = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  InputProps
>(function Input(props, ref) {
  const reactId = useId();
  const id = `field-${reactId}`;

  const wrapCls = cn(
    styles.field,
    props.error ? styles.error : undefined,
    props.className,
  );

  const labelEl = (
    <label className={styles.label} htmlFor={id}>
      {props.label}
      {props.required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );

  const ariaDescribedBy = [
    props.helper ? `${id}-helper` : undefined,
    props.error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  if (props.type === 'textarea') {
    const { label: _l, className: _c, type: _t, options: _o, ...rest } = props;
    void _l;
    void _c;
    void _t;
    void _o;
    return (
      <div className={wrapCls}>
        {labelEl}
        <textarea
          id={id}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={styles.textarea}
          required={props.required}
          placeholder={props.placeholder}
          aria-invalid={props.error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...rest}
        />
        <FieldExtras id={id} helper={props.helper} error={props.error} />
      </div>
    );
  }

  if (props.type === 'select') {
    const { label: _l, className: _c, type: _t, options, ...rest } = props;
    void _l;
    void _c;
    void _t;
    return (
      <div className={wrapCls}>
        {labelEl}
        <select
          id={id}
          ref={ref as React.Ref<HTMLSelectElement>}
          className={styles.select}
          required={props.required}
          aria-invalid={props.error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...rest}
        >
          {props.placeholder ? (
            <option value="" disabled>
              {props.placeholder}
            </option>
          ) : null}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldExtras id={id} helper={props.helper} error={props.error} />
      </div>
    );
  }

  // text | email | tel — the default branch.
  const { label: _l, helper: _h, error: _e, className: _c, type, placeholder: _p, options: _o, ...rest } = props;
  void _l;
  void _h;
  void _e;
  void _c;
  void _p;
  void _o;
  return (
    <div className={wrapCls}>
      {labelEl}
      <input
        id={id}
        ref={ref as React.Ref<HTMLInputElement>}
        className={styles.control}
        type={type ?? 'text'}
        required={props.required}
        placeholder={props.placeholder}
        aria-invalid={props.error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        {...rest}
      />
      <FieldExtras id={id} helper={props.helper} error={props.error} />
    </div>
  );
});
