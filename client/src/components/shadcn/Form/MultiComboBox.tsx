'use client'

import {isStringArray} from '@/helpers'
import {DropdownMenuCheckboxItemProps} from '@radix-ui/react-dropdown-menu'

import {Button} from '../Button'
import {DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger} from '../ui/dropdown-menu'
import {ISelectBoxValues} from './SelectBox'

type Checked = DropdownMenuCheckboxItemProps['checked']

interface IMultiComboBoxProps {
  className?: string
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string[]) => void
  selectedValues: string[]
  values: (string | ISelectBoxValues)[]
  label?: string
}

const MultiComboBox = ({className, onChange, selectedValues, values, label}: IMultiComboBoxProps) => {
  const valuesArray: ISelectBoxValues[] = isStringArray(values)
    ? values.map((x) => ({label: x, value: x}))
    : (values as ISelectBoxValues[])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline">
          {label}
          {selectedValues.length > 0 ? ` (${selectedValues.length})` : ''}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent className={className}>
        {valuesArray.map((x) => (
          <DropdownMenuCheckboxItem
            key={x.value}
            checked={selectedValues.includes(x.value)}
            onCheckedChange={(checked: Checked) => {
              if (checked) {
                onChange([...selectedValues, x.value])
              } else {
                onChange(selectedValues.filter((value) => value !== x.value))
              }
            }}
          >
            {x.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default MultiComboBox
