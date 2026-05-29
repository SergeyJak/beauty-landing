import {
  ChangeEvent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'
import { cn } from '@/lib/utils'

const fieldClasses =
  'w-full min-h-14 border border-primary/10 bg-ivory px-4 py-4 text-base text-primary outline-none transition-all duration-300 placeholder:text-primary/30 focus:border-accent focus:bg-white dark:bg-ink dark:text-parchment dark:border-white/10 dark:placeholder:text-white/20 dark:focus:border-accent/50'

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
    <div className="group">
      <label htmlFor={id} className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-primary/60 dark:text-parchment/60 group-focus-within:text-accent transition-colors">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          className={cn(
            fieldClasses,
            error ? 'border-red-500 focus:border-red-500' : '',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          required={required}
          className={cn(
            fieldClasses,
            error ? 'border-red-500 focus:border-red-500' : '',
            className
          )}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
      )}
      {error && (
        <p id={`${id}-error`} className="mt-2 text-[0.65rem] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
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
    <div className="group">
      <label htmlFor={id} className="mb-2 block text-[0.7rem] font-bold uppercase tracking-widest text-primary/60 dark:text-parchment/60 group-focus-within:text-accent transition-colors">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <select
        id={id}
        required={required}
        className={cn(
          fieldClasses,
          'appearance-none bg-[url("data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20fill%3D%22none%22%20viewBox%3D%220%200%2020%2020%22%3E%3Cpath%20stroke%3D%22%2317130F%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20stroke-width%3D%221.5%22%20d%3D%22m6%208%204%204%204-4%22%2F%3E%3C%2Fsvg%3E")] bg-[length:1.25rem_1.25rem] bg-[right_0.75rem_center] bg-no-repeat pr-10',
          error ? 'border-red-500 focus:border-red-500' : '',
          className
        )}
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
        <p id={`${id}-error`} className="mt-2 text-[0.65rem] font-bold uppercase tracking-wider text-red-600 dark:text-red-400">
          {error}
        </p>
      )}
    </div>
  )
}

export type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
