import {classNames} from '@/helpers'
import React from 'react'

interface IFormLabel {
  name: string
  hasError?: boolean
  children: React.ReactNode
  required?: boolean
  noTopPadding?: boolean
}

const FormLabel = ({
  name,
  children,
  hasError = false,
  required = false,
  noTopPadding = false,
}: IFormLabel): React.ReactElement => {
  return (
    <label
      htmlFor={name}
      className={classNames(
        hasError ? 'text-danger-medium' : 'text-muted-medium',
        noTopPadding ? '' : 'sm:mt-px sm:pt-2',
        'cursor-pointer block font-bold',
      )}
    >
      {children}
      {required && <span className="ml-1 text-danger-medium">*</span>}
    </label>
  )
}

export default FormLabel
