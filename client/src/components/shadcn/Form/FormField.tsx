import {cn} from '@/lib/utils'
import {Cross1Icon, EyeNoneIcon, EyeOpenIcon} from '@radix-ui/react-icons'
import React, {cloneElement, useState} from 'react'
import {Control, FieldError} from 'react-hook-form'
import ReactMarkdown from 'react-markdown'

import {SmallLoader} from '../Loader'
import {ExternalA} from '../Typography/A'
import {FormField as CnFormField, FormControl, FormDescription, FormItem, FormLabel, FormMessage} from '../ui/form'
import {Input} from '../ui/input'
import {Textarea} from '../ui/textarea'

interface IFormField {
  name: string
  label?: string
  readOnly?: boolean
  required?: boolean
  pre?: React.ReactNode
  loadingProps?: {
    active: boolean
    text?: string
  }
  placeholder?: string
  helpText?: string
  hideable?: boolean
  clearable?: boolean
  type?: string
  rows?: number
  error?: FieldError
  staticValue?: string | number
  onBlur?: () => void
  // eslint-disable-next-line no-unused-vars
  onChange?: (name: string, value: string | number, extraProps?: {reset?: boolean}) => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, object>
}

const FormField = ({
  control,
  name,
  label,
  pre,
  error,
  helpText,
  placeholder,
  staticValue,
  onChange,
  onBlur,
  hideable = false,
  readOnly = false,
  required = false,
  clearable = false,
  type = 'text',
  rows = 4,
  loadingProps = {active: false, text: 'Loading...'},
}: IFormField) => {
  const [valueHidden, setValueHidden] = useState(true)
  let extraProps = {}

  if (typeof onChange === 'function') {
    extraProps = {onChange: ({target: {value}}) => onChange(name, value), value: staticValue}
  }

  return (
    <CnFormField
      control={control}
      name={name}
      render={({field}) => {
        const inputProps = {
          placeholder,
          readOnly,
          className: cn(
            error &&
              'bg-destructive-lightest border-destructive text-destructive-dark placeholder-destructive-medium focus:ring-destructive-lightest focus:border-destructive',
            pre && 'rounded-l-none',
          ),
          onBlur,
          ...extraProps,
        }
        const hideableProps = {
          onClick: () => setValueHidden(!valueHidden),
          className: 'h-5 text-muted-light hover:text-muted-mid',
        }

        const input = <Input {...field} {...inputProps} />

        return (
          <FormItem className="flex flex-col w-full">
            {label && (
              <FormLabel>
                {label}
                {required && <span className="ml-1 text-destructive-medium">*</span>}
              </FormLabel>
            )}

            <FormControl>
              <div className="relative">
                {hideable ? (
                  <div className="relative">
                    {cloneElement(input, {type: valueHidden ? 'password' : type})}

                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 cursor-pointer">
                      {valueHidden ? <EyeOpenIcon {...hideableProps} /> : <EyeNoneIcon {...hideableProps} />}
                    </div>
                  </div>
                ) : clearable ? (
                  <div className="relative">
                    {input}

                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center leading-5 cursor-pointer">
                      <Cross1Icon
                        className="h-5 text-muted-light hover:text-muted-mid"
                        onClick={() => field.onChange('')}
                      />
                    </div>
                  </div>
                ) : pre ? (
                  <div className="flex">
                    <span
                      className={cn(
                        error
                          ? '!border-destructive bg-destructive-lightest text-destructive'
                          : readOnly
                            ? 'bg-muted-lightest'
                            : 'bg-muted-lightest text-muted-mid',
                        'inline-flex items-center px-3 rounded-l shadow-sm border border-r-0 border-input',
                      )}
                    >
                      {pre}
                    </span>

                    <div className="flex-1">{input}</div>
                  </div>
                ) : type === 'textarea' ? (
                  <Textarea {...field} {...inputProps} rows={rows} />
                ) : (
                  input
                )}

                {loadingProps.active && (
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-muted-mid">{loadingProps.text}</span> <SmallLoader className="ml-2" />
                  </div>
                )}
              </div>
            </FormControl>

            {helpText && (
              <FormDescription>
                <ReactMarkdown components={{a: ExternalA}}>{helpText}</ReactMarkdown>
              </FormDescription>
            )}

            <FormMessage />
          </FormItem>
        )
      }}
    />
  )
}

export default FormField
