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
 * 2026-07-26 (second pass): destructure ONCE at the top of the
 * component (label, helper, error, required, className, placeholder,
 * type, options) using the `_rename` convention; the `void _x;`
 * boilerplate is gone because the renamed locals are used in the
 * JSX (labelEl, FieldExtras, the per-element spreads). The `rest`
 * spread is cast to the specific element type after the
 * discriminant check — TS can't infer the right element's
 * attribute type from the union without the cast, because the
 * `type` discriminant narrows `props` but the destructured `rest`
 * has already been widened by the `Omit<...>` in the union
 * members' interface declarations.
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

  // Destructure every prop the JSX consumes by name. The discriminant
  // `type` is forwarded to the underlying input element (default
  // 'text'); `options` is consumed only by the select branch;
  // everything else drops into `rest` for the HTML-attribute spread.
  // The `rest` is cast to the specific element type after the
  // discriminant check below — TS can't infer the right element's
  // attribute type from the union without the cast, because the
  // `type` discriminant narrows `props` but the destructured `rest`
  // is typed as the union of the 3 element attribute types.
  const {
    label: _label,
    helper: _helper,
    error: _error,
    required: _required,
    className: _className,
    placeholder: _placeholder,
    type: _type,
    options: _options,
    ...rest
  } = props;

  const labelEl = (
    <label className={styles.label} htmlFor={id}>
      {_label}
      {_required ? (
        <span className={styles.required} aria-hidden="true">
          *
        </span>
      ) : null}
    </label>
  );

  const ariaDescribedBy = [
    _helper ? `${id}-helper` : undefined,
    _error ? `${id}-error` : undefined,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  if (_type === 'textarea') {
    return (
      <div className={cn(styles.field, _error ? styles.error : undefined, _className)}>
        {labelEl}
        <textarea
          id={id}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          className={styles.textarea}
          required={_required}
          placeholder={_placeholder}
          aria-invalid={_error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...(rest as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
        <FieldExtras id={id} helper={_helper} error={_error} />
      </div>
    );
  }

  if (_type === 'select') {
    return (
      <div className={cn(styles.field, _error ? styles.error : undefined, _className)}>
        {labelEl}
        <select
          id={id}
          ref={ref as React.Ref<HTMLSelectElement>}
          className={styles.select}
          required={_required}
          aria-invalid={_error ? 'true' : undefined}
          aria-describedby={ariaDescribedBy}
          {...(rest as React.SelectHTMLAttributes<HTMLSelectElement>)}
        >
          {_placeholder ? (
            <option value="" disabled>
              {_placeholder}
            </option>
          ) : null}
          {_options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <FieldExtras id={id} helper={_helper} error={_error} />
      </div>
    );
  }

  // text | email | tel — the default branch.
  return (
    <div className={cn(styles.field, _error ? styles.error : undefined, _className)}>
      {labelEl}
      <input
        id={id}
        ref={ref as React.Ref<HTMLInputElement>}
        className={styles.control}
        type={_type ?? 'text'}
        required={_required}
        placeholder={_placeholder}
        aria-invalid={_error ? 'true' : undefined}
        aria-describedby={ariaDescribedBy}
        {...(rest as React.InputHTMLAttributes<HTMLInputElement>)}
      />
      <FieldExtras id={id} helper={_helper} error={_error} />
    </div>
  );
});
