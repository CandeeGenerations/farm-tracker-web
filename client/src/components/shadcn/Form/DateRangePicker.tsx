import {DEFAULT_DATE_FORMAT} from '@/helpers/constants'
import {cn} from '@/lib/utils'
import {CalendarIcon, Cross1Icon} from '@radix-ui/react-icons'
import {format, isSameMonth, isSameYear} from 'date-fns'
import React from 'react'
import {Control, ControllerRenderProps} from 'react-hook-form'

import {Button} from '../Button'
import {Tooltip} from '../Layout'
import {Calendar} from '../ui/calendar'
import {FormControl, FormField, FormItem, FormLabel} from '../ui/form'
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'

export interface DateRange {
  from: Date
  to: Date
}

export interface PredefinedRange {
  label: string
  value: string
  // Function that returns a DateRange based on current date
  // eslint-disable-next-line no-unused-vars
  getRangeFor: (now: Date) => DateRange
}

interface IDateRangePicker {
  name: string
  label?: string
  required?: boolean
  className?: string
  align?: 'start' | 'center' | 'end'
  placeholder?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, object>
  value?: DateRange
  // eslint-disable-next-line no-unused-vars
  onChange?: (range: DateRange) => void
  predefinedRanges?: PredefinedRange[]
}

const DateRangePicker = ({
  name,
  label,
  control,
  required = false,
  value,
  onChange,
  className,
  align = 'start',
  placeholder,
  predefinedRanges,
}: IDateRangePicker) => {
  const [isCalendarOpen, setIsCalendarOpen] = React.useState(false)

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const popover = (field?: ControllerRenderProps<any, string>) => {
    const currentValue = field?.value || value
    const handleChange = field?.onChange || onChange

    const handlePredefinedRangeChange = (rangeValue: string) => {
      const range = predefinedRanges.find((r) => r.value === rangeValue)
      if (range) {
        const now = new Date()
        handleChange?.(range.getRangeFor(now))
      }
    }

    const button = (
      <Button
        variant={'outline'}
        className={cn('w-full pl-3 text-left font-normal', !currentValue && 'text-muted-foreground', className)}
        onClick={() => setIsCalendarOpen(true)}
      >
        {currentValue?.from ? (
          <>
            {(() => {
              const from = currentValue.from
              const to = currentValue.to

              if (from.getTime() === to.getTime()) {
                return format(from, DEFAULT_DATE_FORMAT)
              }

              if (isSameMonth(from, to) && isSameYear(from, to)) {
                return `${format(from, 'MMM d')} - ${format(to, 'd, yyyy')}`
              }

              if (isSameYear(from, to)) {
                return `${format(from, 'MMM d')} - ${format(to, DEFAULT_DATE_FORMAT)}`
              }

              return `${format(from, DEFAULT_DATE_FORMAT)} - ${format(to, DEFAULT_DATE_FORMAT)}`
            })()}
          </>
        ) : (
          <span>{placeholder || 'Pick a date range'}</span>
        )}

        <div className="ml-auto flex items-center gap-2">
          {currentValue?.from && (
            <Tooltip
              trigger={
                <Cross1Icon
                  className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleChange?.(undefined)
                  }}
                />
              }
            >
              <p>Clear date range</p>
            </Tooltip>
          )}

          <CalendarIcon className="h-4 w-4 opacity-50" />
        </div>
      </Button>
    )

    return (
      <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
        <PopoverTrigger asChild className={className}>
          {field ? <FormControl>{button}</FormControl> : button}
        </PopoverTrigger>

        <PopoverContent className="w-auto flex flex-col gap-4 p-0" align={align}>
          {predefinedRanges && (
            <div className="border-b p-4">
              <Select onValueChange={handlePredefinedRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a predefined range" />
                </SelectTrigger>

                <SelectContent>
                  {predefinedRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Calendar mode="range" selected={currentValue} onSelect={handleChange} numberOfMonths={2} initialFocus />
        </PopoverContent>
      </Popover>
    )
  }

  return control ? (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className="flex flex-col w-full">
          {label && (
            <FormLabel>
              {label}
              {required && <span className="ml-1 text-destructive-medium">*</span>}
            </FormLabel>
          )}
          {popover(field)}
        </FormItem>
      )}
    />
  ) : (
    popover()
  )
}

export default DateRangePicker
