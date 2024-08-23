import {InformationCircleIcon} from '@heroicons/react/24/outline'
import React from 'react'
import {classNames} from '../helpers'
import Tooltip from './Tooltip'

interface IFormLabel {
  name?: string
  hasError?: boolean
  children: React.ReactNode
  required?: boolean
  noTopPadding?: boolean
  className?: string
  tooltip?: React.ReactNode
}

const FormLabel = ({
  name,
  children,
  className,
  tooltip,
  hasError = false,
  required = false,
  noTopPadding = false,
}: IFormLabel): React.ReactElement => {
  const htmlFor = name ? {htmlFor: name} : {}

  return (
    <label
      {...htmlFor}
      className={classNames(
        hasError ? 'text-danger-medium' : 'text-muted-medium',
        noTopPadding ? '' : 'sm:mt-px sm:pt-2',
        'cursor-pointer block font-bold',
        className,
        'flex flex-row items-center',
      )}
    >
      {children}

      {required && <span className="ml-1 text-danger-medium">*</span>}

      {tooltip && (
        <Tooltip tooltipText={tooltip}>
          <InformationCircleIcon className="h-4 w-4 text-muted ml-2 cursor-help" />
        </Tooltip>
      )}
    </label>
  )
}

export default FormLabel
