import {isStringArray} from '@/helpers'
import {cn} from '@/lib/utils'
import React from 'react'

import {Label} from '../ui/label'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '../ui/select'

export interface ISelectBoxValues {
  label: string
  value: string
}

interface ISelectBox {
  value: string
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void
  onBlur?: () => void
  values: (string | ISelectBoxValues)[]
  label?: string
  horizontal?: boolean
  readOnly?: boolean
  defaultValue?: string
  placeholder?: string
  className?: string
  // eslint-disable-next-line no-unused-vars
  renderValue?: (value: ISelectBoxValues) => React.ReactNode
}

const SelectBox = ({
  value,
  onChange,
  onBlur,
  readOnly,
  values,
  label,
  defaultValue,
  placeholder,
  className,
  horizontal = false,
  renderValue,
}: ISelectBox): React.ReactElement => {
  const valuesArray: ISelectBoxValues[] = isStringArray(values)
    ? values.map((x) => ({label: x, value: x}))
    : (values as ISelectBoxValues[])

  return (
    <div
      className={cn(
        className,
        horizontal ? 'sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 space-x-2' : 'space-y-2',
        'flex flex-col w-full',
      )}
    >
      {label && <Label className={cn(horizontal ? 'sm:mt-px sm:pt-2' : '')}>{label}</Label>}

      <Select
        defaultValue={value ?? defaultValue}
        disabled={readOnly}
        onValueChange={(value) => {
          onChange(value)
          if (onBlur) onBlur()
        }}
      >
        <SelectTrigger className={cn(horizontal ? 'sm:col-span-2 sm:mt-0 sm:relative' : 'relative')}>
          <SelectValue placeholder={placeholder ?? 'Please select...'} />
        </SelectTrigger>

        <SelectContent>
          {valuesArray.map((x) => (
            <SelectItem key={x.value} value={x.value}>
              {renderValue ? renderValue(x) : x.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

export default SelectBox
