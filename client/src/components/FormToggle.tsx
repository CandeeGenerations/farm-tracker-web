import React from 'react'
import {Control, Controller} from 'react-hook-form'
import FormLabel from './FormLabel'
import Toggle from './Toggle'

interface IFormToggle {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, Object>
  name: string
  label?: string
  onLabel?: string
  offLabel?: string
  disabled?: boolean
}

const FormToggle = ({
  control,
  name,
  label,
  onLabel = undefined,
  offLabel = undefined,
  disabled = false,
}: IFormToggle): React.ReactElement => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 sm:items-start sm:gap-4 gap-2 pt-5 w-full">
      <FormLabel noTopPadding name={name}>
        {label}
      </FormLabel>

      <div className="sm:col-span-2 sm:mt-0">
        <Controller
          control={control}
          name={name}
          render={({field: {onChange, value}}) => (
            <Toggle disabled={disabled} enabled={value} setEnabled={onChange} onLabel={onLabel} offLabel={offLabel} />
          )}
        />
      </div>
    </div>
  )
}

export default FormToggle
