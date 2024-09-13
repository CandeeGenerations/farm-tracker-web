import {ChevronUpDownIcon, XMarkIcon} from '@heroicons/react/24/outline'
import {sentenceCase} from 'change-case-all'
import React from 'react'
import {Control, Controller, FieldError, UseFormRegister} from 'react-hook-form'

import {classNames, formatDate, formatInputDate} from '../helpers'
import FormLabel from './FormLabel'
import ReadOnlyField from './ReadOnlyField'

interface IFormInput {
  name: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  register?: UseFormRegister<any>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, object>
  staticValue?: string | number
  // eslint-disable-next-line no-unused-vars
  onChange?: (name: string, value: string | number, extraProps?: {reset?: boolean}) => void
  onBlur?: () => void
  onFocus?: () => void
  onDropdownClick?: () => void
  label?: string
  required?: boolean
  helpText?: string
  error?: FieldError
  type?: string
  dropdown?: boolean
  placeholder?: string
  vertical?: boolean
  clearable?: boolean
  pre?: string
  post?: string
  readOnly?: boolean
}

const FormInput = ({
  name,
  register,
  control,
  label,
  helpText,
  error,
  type,
  staticValue,
  placeholder,
  onBlur,
  onFocus,
  onDropdownClick,
  onChange,
  pre,
  post,
  clearable = false,
  vertical = false,
  required = false,
  dropdown = false,
  readOnly = false,
}: IFormInput): React.ReactElement => {
  let extraProps = {}

  if (typeof onChange === 'function') {
    extraProps = {onChange: ({target: {value}}) => onChange(name, value), value: staticValue}
  } else if (register !== undefined) {
    extraProps = {...register(name, typeof onBlur === 'function' ? {onBlur} : {})}
  }

  const inputProps = {
    name,
    type,
    id: name,
    required,
    placeholder,
    onBlur,
    onFocus,
    className: classNames(
      error
        ? 'bg-danger-lightest border-danger text-danger-dark placeholder-danger-medium focus:ring-danger focus:border-danger'
        : 'focus:ring-2 focus:ring-offset-2 focus:ring-primary-medium focus:border-primary-medium border-muted-light',
      pre ? 'rounded-r' : post ? 'rounded-l' : 'rounded',
      vertical ? '' : 'sm:max-w-xs',
      'shadow-sm block w-full border py-2 px-4 sm:text-sm outline-0',
    ),
    ...extraProps,
  }

  const input = clearable ? (
    <div className="relative">
      <input type={type} {...inputProps} />

      {staticValue && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 cursor-pointer">
          <XMarkIcon
            className="h-5 text-muted-light hover:text-muted"
            onClick={() => onChange(name, '', {reset: true})}
          />
        </div>
      )}
    </div>
  ) : dropdown ? (
    <div className="relative">
      <input type={type} {...inputProps} />

      <div className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 cursor-pointer">
        <ChevronUpDownIcon className="h-5 text-muted-light hover:text-muted" onClick={onDropdownClick} />
      </div>
    </div>
  ) : control && type === 'date' ? (
    <Controller
      control={control}
      name={name}
      render={({field: {value}}) => <input type={type} {...inputProps} value={formatInputDate(value)} />}
    />
  ) : (
    <input {...inputProps} />
  )

  return readOnly ? (
    control ? (
      <Controller
        control={control}
        name={name}
        render={({field: {value}}) => (
          <ReadOnlyField name={name} label={label} value={type === 'date' ? formatDate(value) : value} />
        )}
      />
    ) : (
      <ReadOnlyField
        name={name}
        label={label}
        value={type === 'date' ? formatDate(staticValue as string) : staticValue}
      />
    )
  ) : (
    <div
      className={classNames(
        vertical ? '' : 'grid grid-cols-1 sm:grid-cols-3 items-start sm:gap-4 gap-2 pt-5',
        'w-full',
      )}
    >
      {label && (
        <div>
          <FormLabel name={name} hasError={!!error} required={required} noTopPadding={vertical}>
            {label}
          </FormLabel>

          {error && !vertical && <p className="mt-2 text-danger-dark">{sentenceCase(error.message)}</p>}
        </div>
      )}

      <div className={classNames(vertical ? '' : 'sm:col-span-2 sm:mt-0', 'mt-1')}>
        {pre ? (
          <div className="flex">
            <span
              className={classNames(
                error
                  ? 'border-danger bg-danger-lightest text-danger'
                  : 'border-muted-light bg-muted-lightest text-muted',
                'inline-flex items-center px-3 rounded-l shadow-sm border border-r-0',
              )}
            >
              {pre}
            </span>

            {input}
          </div>
        ) : post ? (
          <div className="flex">
            {input}

            <span
              className={classNames(
                error
                  ? 'border-danger bg-danger-lightest text-danger'
                  : 'border-muted-light bg-muted-lightest text-muted',
                'inline-flex items-center px-3 rounded-r shadow-sm border border-l-0',
              )}
            >
              {post}
            </span>
          </div>
        ) : type === 'textarea' ? (
          <textarea {...inputProps} rows={4} />
        ) : (
          input
        )}

        {helpText && <p className="mt-2 text-muted text-left">{helpText}</p>}

        {error && vertical && <p className="mt-2 text-danger-dark">{sentenceCase(error.message)}</p>}
      </div>
    </div>
  )
}

export default FormInput
