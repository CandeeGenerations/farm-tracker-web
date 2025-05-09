import {cn} from '@/lib/utils'
import {ReloadIcon} from '@radix-ui/react-icons'
import React from 'react'
import {VariantProps} from 'tailwind-variants'
import {match} from 'ts-pattern'

import {ButtonProps, Button as CnButton, buttonVariants} from '../ui/button'

export type ButtonType = VariantProps<typeof buttonVariants>['variant']
export interface IButton extends ButtonProps {
  loading?: boolean
  loadingText?: string
  hideLoadingText?: boolean
  block?: boolean
  outline?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, IButton>(
  ({loading, hideLoadingText, loadingText = 'Please wait', block, outline, ...props}, ref) => {
    // support block buttons
    props.className = block ? cn(props.className, 'w-full') : props.className

    // support outline with variant buttons
    props.className = outline
      ? cn(
          props.className,
          match(props.variant)
            .with('secondary', () => 'border-secondary text-secondary')
            .with('destructive', () => 'border-destructive text-destructive')
            .with('ghost', () => 'border-transparent text-accent-foreground')
            .with('outline', () => 'border-input text-accent-foreground')
            .otherwise(() => 'border-primary text-primary'),
          'border bg-background shadow-sm hover:bg-accent',
        )
      : props.className

    // support loading buttons
    props.disabled = props.disabled || loading
    props.children = loading ? (
      <>
        <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
        {!hideLoadingText && loadingText}
      </>
    ) : (
      props.children
    )

    return <CnButton ref={ref} {...props} />
  },
)

export default Button
