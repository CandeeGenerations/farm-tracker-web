import React from 'react'
import {classNames} from '../helpers'

interface IFormLabel {
  name: string
  hasError?: boolean
  children: React.ReactNode
  required?: boolean
  noTopPadding?: boolean
  className?: string
}

const FormLabel = ({
  name,
  children,
  className,
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
        name ? 'cursor-pointer' : '',
        'block font-bold',
        className,
        'flex flex-row items-center',
      )}
    >
      {children}
      {required && <span className="ml-1 text-danger-medium">*</span>}
    </label>
  )
}

export default FormLabel
