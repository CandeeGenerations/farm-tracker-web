import {classNames} from '@/helpers'
import dayjs from 'dayjs'
import React from 'react'
import {Control, Controller, FieldError} from 'react-hook-form'

import {RawDatePicker} from './TremorRaw/RawDatePicker'

interface IDatePickerRaw {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, object>
  name: string
  label?: string
  required?: boolean
  error?: FieldError
  disabled?: boolean
  helpText?: string
  vertical?: boolean
}

const DatePicker = ({
  control,
  name,
  label,
  error,
  helpText,
  vertical = false,
  disabled = false,
  required = false,
}: IDatePickerRaw): React.ReactElement => {
  console.log('vertical :', vertical)
  return (
    <div
      className={classNames(
        vertical ? '' : 'grid grid-cols-1 sm:grid-cols-3 sm:items-start sm:gap-4 gap-2 pt-5',
        'w-full',
      )}
    >
      <div>
        {label && (
          <label
            htmlFor={name}
            className={classNames(error ? 'text-danger-medium' : 'text-muted-medium', 'cursor-pointer block font-bold')}
          >
            {label}
            {required && <span className="ml-1 text-danger-medium">*</span>}
          </label>
        )}
      </div>

      <div className={classNames(vertical ? '' : 'sm:max-w-xs sm:col-span-2 sm:mt-0')}>
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, value}}) => (
            <div className="relative mt-1">
              <RawDatePicker
                value={value ? new Date(value) : undefined}
                disabled={disabled}
                onChange={(date) => onChange(date ? dayjs(date).format() : undefined)}
              />
            </div>
          )}
        />

        {helpText && <p className="mt-2 text-muted text-left">{helpText}</p>}
      </div>
    </div>
  )
}

export default DatePicker
