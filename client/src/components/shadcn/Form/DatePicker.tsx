'use client'

import {DEFAULT_DATE_FNS_FORMAT} from '@/helpers/constants'
import {cn} from '@/lib/utils'
import {CalendarIcon, Cross1Icon} from '@radix-ui/react-icons'
import {format} from 'date-fns'
import {Control, ControllerRenderProps} from 'react-hook-form'

import {Tooltip} from '../Layout'
import {Button} from '../ui/button'
import {Calendar} from '../ui/calendar'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'

interface IDatePicker {
  name: string
  label?: string
  required?: boolean
  helpText?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, object>
  value?: Date
  // eslint-disable-next-line no-unused-vars
  onChange?: (date: Date) => void
  horizontal?: boolean
}

const DatePicker = ({
  name,
  label,
  control,
  helpText,
  required = false,
  value,
  onChange,
  horizontal = false,
}: IDatePicker) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const popover = (field?: ControllerRenderProps<any, string>) => {
    const button = (
      <Button
        variant={'outline'}
        className={cn('w-full pl-3 text-left font-normal', !(field?.value || value) && 'text-muted-foreground')}
      >
        {field?.value || value ? format(field?.value || value, DEFAULT_DATE_FNS_FORMAT) : <span>Pick a date</span>}
        <div className="ml-auto flex items-center gap-2">
          {(field?.value || value) && (
            <Tooltip
              trigger={
                <Cross1Icon
                  className="h-4 w-4 opacity-50 hover:opacity-100 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation()
                    if (field?.onChange) {
                      field.onChange(undefined)
                    } else if (onChange) {
                      onChange(undefined)
                    }
                  }}
                />
              }
            >
              <p>Clear date</p>
            </Tooltip>
          )}
          <CalendarIcon className="h-4 w-4 opacity-50" />
        </div>
      </Button>
    )

    return (
      <Popover>
        <PopoverTrigger asChild>{field ? <FormControl>{button}</FormControl> : button}</PopoverTrigger>

        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field?.value || value}
            onSelect={field?.onChange || onChange}
            initialFocus
          />
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

          <FormDescription>{helpText}</FormDescription>

          <FormMessage />
        </FormItem>
      )}
    />
  ) : (
    popover()
  )
}

export default DatePicker
