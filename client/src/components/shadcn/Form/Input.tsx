import {cn} from '@/lib/utils'
import {Cross1Icon, EyeNoneIcon, EyeOpenIcon} from '@radix-ui/react-icons'
import React, {cloneElement, useState} from 'react'
import ReactMarkdown from 'react-markdown'

import {SmallLoader} from '../Loader'
import {ExternalA} from '../Typography/A'
import {Input as CnInput} from '../ui/input'
import {Textarea} from '../ui/textarea'

interface IInput extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string
  label?: string
  readOnly?: boolean
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
  value?: string | number
  onBlur?: () => void
  // eslint-disable-next-line no-unused-vars
  onFieldChange?: (name: string, value: string | number, extraProps?: {reset?: boolean}) => void
}

const Input = ({
  name,
  label,
  pre,
  placeholder,
  value,
  onFieldChange,
  onBlur,
  helpText,
  hideable = false,
  readOnly = false,
  clearable = false,
  type = 'text',
  rows = 4,
  loadingProps = {active: false, text: 'Loading...'},
}: IInput) => {
  const [valueHidden, setValueHidden] = useState(true)
  let extraProps = {}

  if (typeof onFieldChange === 'function') {
    extraProps = {onFieldChange: ({target: {value}}) => onFieldChange(name, value), value}
  }

  const inputProps = {
    placeholder,
    readOnly,
    className: cn(pre && 'rounded-l-none'),
    onBlur,
    ...extraProps,
  }
  const hideableProps = {
    onClick: () => setValueHidden(!valueHidden),
    className: 'h-5 text-muted-light hover:text-muted-mid',
  }

  const input = <CnInput {...inputProps} />

  return (
    <div className="flex flex-col w-full">
      {label && <div>{label}</div>}

      <div>
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
                  onClick={() => onFieldChange(name, '', {reset: true})}
                />
              </div>
            </div>
          ) : pre ? (
            <div className="flex">
              <span
                className={cn(
                  readOnly ? 'bg-muted-lightest' : 'bg-muted-lightest text-muted-mid',
                  'inline-flex items-center px-3 rounded-l shadow-sm border border-r-0 border-input',
                )}
              >
                {pre}
              </span>

              <div className="flex-1">{input}</div>
            </div>
          ) : type === 'textarea' ? (
            <Textarea {...inputProps} rows={rows} />
          ) : (
            input
          )}

          {loadingProps.active && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <span className="text-muted-mid">{loadingProps.text}</span> <SmallLoader className="ml-2" />
            </div>
          )}
        </div>
      </div>

      {helpText && (
        <div>
          <ReactMarkdown components={{a: ExternalA}}>{helpText}</ReactMarkdown>
        </div>
      )}
    </div>
  )
}

export default Input
