'use client'

import {Control} from 'react-hook-form'

import {FormControl, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'
import {RadioGroup as CnRadioGroup, RadioGroupItem} from '../ui/radio-group'

interface IRadioItem {
  id: string
  label: string
}

interface IRadioGroup {
  name: string
  label?: string
  required?: boolean
  radios: IRadioItem[]
  readOnly?: boolean
  onBlur?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, object>
}

const RadioGroup = ({name, label, control, radios, onBlur, readOnly = false, required = false}: IRadioGroup) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={readOnly}
      render={({field}) => (
        <FormItem className="space-y-3 relative w-full">
          {label && (
            <FormLabel>
              {label}
              {required && <span className="ml-1 text-destructive-medium">*</span>}
            </FormLabel>
          )}

          <FormControl>
            <CnRadioGroup
              onValueChange={(value) => {
                field.onChange(value)
                if (onBlur) onBlur()
              }}
              value={field.value}
              className="flex flex-col space-y-1"
            >
              {radios.map((x) => (
                <FormItem key={x.id} className="flex items-center space-x-3 space-y-0">
                  <FormControl>
                    <RadioGroupItem value={x.id} />
                  </FormControl>

                  <FormLabel className="font-normal">{x.label}</FormLabel>
                </FormItem>
              ))}
            </CnRadioGroup>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default RadioGroup
