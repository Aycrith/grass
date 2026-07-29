/**
 * Checkbox — Mission 1
 *
 * Simple checkbox + label primitive. Used by contact/quote/pet-waste
 * forms for the TCPA consent checkbox (per D-0066). Matches the styling
 * of the design-system Input family: label + control + optional helper,
 * nested inside a `.field` container.
 *
 * The `ConsentCheckbox` wrapper below composes this with the canonical
 * D-0066 consent language so each form stays a one-line drop-in.
 */

import { type ComponentPropsWithoutRef, type ReactNode, forwardRef, useId } from 'react';

import { cn } from '@/lib/cn';

import styles from './Checkbox.module.css';

interface CheckboxProps {
  label: ReactNode;
  helper?: ReactNode;
  error?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

export const Checkbox = forwardRef<
  HTMLInputElement,
  CheckboxProps &
    Omit<
      ComponentPropsWithoutRef<'input'>,
      'type' | 'className' | 'checked' | 'onChange' | 'children'
    >
>(function Checkbox(props, ref) {
  const { label, helper, error, checked, onChange, required, className, disabled, ...rest } = props;
  const reactId = useId();
  const id = `field-${reactId}`;
  const descriptionId = helper || error ? `${id}-helper` : undefined;

  return (
    <div className={cn(styles.field, error ? styles.error : undefined, className)}>
      <label
        className={styles.label}
        htmlFor={id}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <input
          id={id}
          ref={ref}
          type="checkbox"
          className={styles.control}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          required={required}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={descriptionId}
          {...rest}
        />
        <span className={styles.text}>
          {label}
          {required ? (
            <span className={styles.required} aria-hidden="true">
              {' *'}
            </span>
          ) : null}
        </span>
      </label>
      {helper ? (
        <p id={descriptionId} className={styles.helper}>
          {helper}
        </p>
      ) : null}
      {error ? (
        <p id={descriptionId} className={styles.errorText} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
});
