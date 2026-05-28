import {
  ChangeEvent,
  InputHTMLAttributes,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react'

const fieldClasses =
  'w-full min-h-14 border border-primary/15 bg-ivory px-4 py-4 text-base text-primary outline-none transition-colors placeholder:text-primary/35 focus:border-accent focus:ring-2 focus:ring-accent/20'

interface BaseFieldProps {
  label: string
  id: string
  required?: boolean
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

export function TextField({ label, id, required, multiline, className = '', ...props }: TextFieldProps | TextareaFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primary">
        {label} {required ? '*' : ''}
      </label>
      {multiline ? (
        <textarea
          id={id}
          required={required}
          className={`${fieldClasses} resize-none ${className}`}
          {...(props as TextareaHTMLAttributes<HTMLTextAreaElement>)}
        />
      ) : (
        <input
          id={id}
          required={required}
          className={`${fieldClasses} ${className}`}
          {...(props as InputHTMLAttributes<HTMLInputElement>)}
        />
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
  className = '',
  ...props
}: SelectFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-primary">
        {label} {required ? '*' : ''}
      </label>
      <select
        id={id}
        required={required}
        className={`${fieldClasses} ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
