'use client'

import {Control} from 'react-hook-form'

import {Checkbox} from '../ui/checkbox'
import {FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage} from '../ui/form'

interface ICheckboxItem {
  id: string
  label: string
}

interface ICheckboxGroup {
  name: string
  label?: string
  required?: boolean
  checkboxes: ICheckboxItem[]
  readonly?: boolean
  helpText?: string
  onBlur?: () => void
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, object>
}

const CheckboxGroup = ({
  name,
  label,
  control,
  helpText,
  checkboxes,
  onBlur,
  readonly = false,
  required = false,
}: ICheckboxGroup) => {
  return (
    <FormField
      control={control}
      name={name}
      disabled={readonly}
      render={() => (
        <FormItem className="space-y-3 relative w-full">
          <div className="mb-4">
            {label && (
              <FormLabel className="text-base">
                {label}
                {required && <span className="ml-1 text-destructive-medium">*</span>}
              </FormLabel>
            )}

            {helpText && <FormDescription className="text-sm text-muted-mid">{helpText}</FormDescription>}
          </div>

          {checkboxes.map((x) => (
            <FormField
              key={x.id}
              control={control}
              name={name}
              render={({field}) => {
                return (
                  <FormItem key={x.id} className="flex flex-row items-center space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(x.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            field.onChange([...field.value, x.id])
                          } else {
                            field.onChange(field.value?.filter((value) => value !== x.id))
                          }
                          if (onBlur) onBlur()
                        }}
                      />
                    </FormControl>

                    <FormLabel className="text-sm font-normal">{x.label}</FormLabel>
                  </FormItem>
                )
              }}
            />
          ))}
          <FormMessage />
        </FormItem>
      )}
    />
  )
}

export default CheckboxGroup
