'use client'

import {cn} from '@/lib/utils'
import {CaretSortIcon, CheckIcon} from '@radix-ui/react-icons'
import React from 'react'
import {Control, Controller} from 'react-hook-form'

import {Button} from '../Button'
import {Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList} from '../ui/command'
import {FormControl, FormDescription, FormItem, FormLabel, FormMessage} from '../ui/form'
import {Popover, PopoverContent, PopoverTrigger} from '../ui/popover'

interface IComboBox {
  name: string
  label?: string
  value?: string
  helpText?: string
  readOnly?: boolean
  required?: boolean
  // eslint-disable-next-line no-unused-vars
  onSelect?: (name: string, value: string) => void
  onBlur?: () => void
  values: {label: string; value: string}[]
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, object>
}

const ComboBoxPopover = ({name, value, values, onSelect, onBlur}: IComboBox) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <FormControl>
          <Button
            variant="outline"
            role="combobox"
            className={cn('w-full justify-between', !value && 'text-muted-foreground')}
          >
            {value ? values.find((language) => language.value === value)?.label : 'Please select...'}
            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </FormControl>
      </PopoverTrigger>

      <PopoverContent className="p-0">
        <Command>
          <CommandInput placeholder="Search..." className="h-9 border-0 focus:ring-0" />

          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>

            <CommandGroup>
              {values.map((x) => (
                <CommandItem
                  value={x.label}
                  key={x.value}
                  onSelect={() => {
                    onSelect(name, x.value)
                    if (onBlur) onBlur()
                  }}
                >
                  {x.label}
                  <CheckIcon className={cn('ml-auto h-4 w-4', x.value === value ? 'opacity-100' : 'opacity-0')} />
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

const ComboBox = ({
  label,
  control,
  helpText,
  name,
  values,
  onSelect,
  onBlur,
  readOnly,
  value,
  required,
}: IComboBox): React.ReactElement => {
  const comboBoxProps = {
    name,
    values,
    onSelect,
    value,
    readOnly,
  }

  return (
    <FormItem className="flex flex-col w-full">
      {label && (
        <FormLabel>
          {label}
          {required && <span className="ml-1 text-destructive-medium">*</span>}
        </FormLabel>
      )}

      {control ? (
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, value: v}}) => (
            <ComboBoxPopover
              {...comboBoxProps}
              onSelect={(_, v) => {
                onChange(v)
                if (onBlur) onBlur()
              }}
              value={v}
            />
          )}
        />
      ) : (
        <ComboBoxPopover {...comboBoxProps} onBlur={onBlur} />
      )}

      {helpText && <FormDescription>{helpText}</FormDescription>}

      <FormMessage />
    </FormItem>
  )
}

export default ComboBox
