'use client'

import React from 'react'
import {Control} from 'react-hook-form'

import {FormControl, FormDescription, FormField, FormItem, FormLabel} from '../ui/form'
import {Switch as CnSwitch} from '../ui/switch'

interface ISwitch {
  name: string
  label?: string
  description?: string
  value?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, object>
  // eslint-disable-next-line no-unused-vars
  onChange?: (value: boolean) => void
  children?: React.ReactNode
}

const Switch = ({control, name, label, description, value, onChange, children}: ISwitch) => {
  return control ? (
    <FormField
      control={control}
      name={name}
      render={({field}) => (
        <FormItem className="rounded-lg border p-3 shadow-sm space-y-4">
          <div className="flex flex-row items-center justify-between">
            <div className="space-y-0.5">
              {label && <FormLabel>{label}</FormLabel>}

              {description && <FormDescription>{description}</FormDescription>}
            </div>

            <FormControl>
              <CnSwitch checked={field.value} onCheckedChange={field.onChange} />
            </FormControl>
          </div>

          {children}
        </FormItem>
      )}
    />
  ) : (
    <div className="rounded-lg border p-3 shadow-sm space-y-4">
      <div className="flex flex-row items-center justify-between">
        <div className="space-y-0.5">
          {label && <div>{label}</div>}

          {description && <div>{description}</div>}
        </div>

        <div>
          <CnSwitch checked={value} onCheckedChange={onChange} />
        </div>
      </div>

      {children}
    </div>
  )
}

export default Switch
