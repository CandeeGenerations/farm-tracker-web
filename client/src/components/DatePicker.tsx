import {ChevronLeftIcon, ChevronRightIcon} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import React, {forwardRef, MouseEventHandler} from 'react'
import ReactDatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import {Control, Controller, FieldError} from 'react-hook-form'
import {classNames} from '../helpers'
import Button from './Button'
import FormLabel from './FormLabel'

interface IDatePicker {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, Object>
  name: string
  label?: string
  required?: boolean
  error?: FieldError
  disabled?: boolean
  helpText?: string
  vertical?: boolean
}

const ButtonInput = forwardRef<HTMLButtonElement>(
  (
    {
      value,
      onClick,
      disabled = false,
    }: {
      value?: string
      onClick: MouseEventHandler<HTMLButtonElement>
      disabled?: boolean
    },
    ref,
  ) => (
    <button
      onClick={onClick}
      ref={ref}
      type="button"
      disabled={disabled}
      className={classNames(
        'mt-1 inline-flex justify-start w-full sm:text-sm px-3 py-2 text-sm text-base font-medium bg-white border rounded',
        disabled
          ? 'text-muted-light'
          : 'text-muted-medium border-muted-light shadow-sm focus:ring-primary-medium focus:border-primary-medium focus:ring-2 focus:ring-offset-2',
      )}
    >
      {value ? dayjs(value).format('MM / DD / YYYY') : 'mm / dd / yyyy'}
    </button>
  ),
)

const DatePicker = ({
  control,
  name,
  label,
  error,
  helpText,
  disabled = false,
  required = false,
  vertical = false,
}: IDatePicker): React.ReactElement => {
  return (
    <div className={classNames(vertical ? '' : 'sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5', 'w-full')}>
      <div>
        {label && (
          <FormLabel name={name} hasError={!!error} required={required}>
            {label}
          </FormLabel>
        )}
      </div>

      <div className={classNames(vertical ? '' : 'sm:max-w-xs sm:col-span-2 sm:mt-0')}>
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, value}}) => (
            <div className="relative">
              <ReactDatePicker
                disabled={disabled}
                selected={value ? new Date(value) : null}
                onChange={date => onChange(date)}
                nextMonthButtonLabel=">"
                previousMonthButtonLabel="<"
                popperClassName="react-datepicker-left"
                customInput={<ButtonInput />}
                renderCustomHeader={({
                  date,
                  decreaseMonth,
                  increaseMonth,
                  prevMonthButtonDisabled,
                  nextMonthButtonDisabled,
                }) => (
                  <div className="flex items-center justify-between px-2 py-2">
                    <span className="text-lg text-muted-medium">{dayjs(date).format('MMMM YYYY')}</span>

                    <div className="space-x-2">
                      <Button size="xs" type="secondary" onClick={decreaseMonth} disabled={prevMonthButtonDisabled}>
                        <ChevronLeftIcon className="w-5 h-5 text-muted" />
                      </Button>

                      <Button size="xs" type="secondary" onClick={increaseMonth} disabled={nextMonthButtonDisabled}>
                        <ChevronRightIcon className="w-5 h-5 text-muted" />
                      </Button>
                    </div>
                  </div>
                )}
              />
            </div>
          )}
        />

        {helpText && <p className="mt-2 text-muted">{helpText}</p>}
      </div>
    </div>
  )
}

export default DatePicker
