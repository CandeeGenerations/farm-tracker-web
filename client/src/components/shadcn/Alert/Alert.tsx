import {cn} from '@/lib/utils'
import {ExclamationTriangleIcon, RocketIcon} from '@radix-ui/react-icons'
import React from 'react'
import {VariantProps} from 'tailwind-variants'

import {AlertDescription, AlertTitle, Alert as CnAlert, alertVariants} from '../ui/alert'

interface IAlert {
  title: string
  message: React.ReactElement | string
}

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants> & IAlert
>(({title, message, ...props}, ref) => {
  props.className =
    props.variant === 'default' || !props.variant ? cn(props.className, 'border-secondary') : props.className

  return (
    <CnAlert ref={ref} {...props}>
      {props.variant === 'destructive' ? (
        <ExclamationTriangleIcon className="h-4 w-4" />
      ) : (
        <RocketIcon className="h-4 w-4" />
      )}
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </CnAlert>
  )
})

export default Alert
