import {
  ChangeEvent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const fieldClasses =
  'w-full min-h-14 border border-primary/15 bg-ivory px-4 py-4 text-base text-primary outline-none transition-all placeholder:text-primary/35 focus:border-accent focus:ring-2 focus:ring-accent/20 dark:bg-primary dark:text-ivory dark:border-primary/30 dark:placeholder:text-ivory/40 dark:focus:ring-accent/30'

interface BaseFieldProps {
  label: string
  id: string
  required?: boolean
  error?: string
}

type TextFieldProps = BaseFieldProps &
  InputHTMLAttributes<HTMLInputElement> & {
    multiline?: false
  }

type TextareaFieldProps = BaseFieldProps &
  TextareaHTMLAttributes<HTMLTextAreaElement> & {
    multiline: true
  }

type SelectFieldProps = BaseFieldProps &
  SelectHTMLAttributes<HTMLSelectElement> & {
    options: string[]
    placeholder: string
  }

export function TextField({ label, id, required, multiline, error, className = '', ...props }: TextFieldProps | TextareaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primary dark:text-ivory">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          className={`${fieldClasses} ${error ? 'border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          required={required}
          className={`${fieldClasses} ${error ? 'border-red-500 focus:ring-red-500/20' : ''} ${className}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export function SelectField({
  label,
  id,
  required,
  options,
  placeholder,
  error,
  className = '',
  ...props
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primary dark:text-ivory">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <select
        id={id}
        required={required}
        className={`${fieldClasses} ${error ? 'border-red-500 focus:ring-red-500/20' : ''} ${className}`}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {error && (
        <p id={`${id}-error`} className="mt-2 text-sm text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
