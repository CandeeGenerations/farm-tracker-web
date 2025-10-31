// Tremor Raw Button [v0.0.0]
import {cx, focusRing} from '@/helpers/utils'
import {Slot} from '@radix-ui/react-slot'
import {RiLoader2Fill} from '@remixicon/react'
import React from 'react'
import {type VariantProps, tv} from 'tailwind-variants'

const buttonVariants = tv({
  base: [
    // base
    'relative inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-center text-sm font-medium shadow-sm transition-all duration-100 ease-in-out',
    // disabled
    'disabled:pointer-events-none disabled:shadow-none',
    // focus
    focusRing,
  ],
  variants: {
    variant: {
      primary: [
        // border
        'border-transparent',
        // text color
        'text-white',
        // background color
        'bg-gray-900',
        // hover color
        'hover:bg-gray-800',
        // disabled
        'disabled:bg-gray-100 disabled:text-gray-400',
      ],
      secondary: [
        // border
        'border-gray-300',
        // text color
        'text-gray-900',
        // background color
        ' bg-white',
        //hover color
        'hover:bg-gray-50',
        // disabled
        'disabled:text-gray-400',
      ],
      light: [
        // base
        'shadow-none',
        // border
        'border-transparent',
        // text color
        'text-gray-900',
        // background color
        'bg-gray-200',
        // hover color
        'hover:bg-gray-300/70',
        // disabled
        'disabled:bg-gray-100 disabled:text-gray-400',
      ],
      destructive: [
        // text color
        'text-white',
        // border
        'border-transparent',
        // background color
        'bg-red-600',
        // hover color
        'hover:bg-red-700',
        // disabled
        'disabled:bg-red-300 disabled:text-white',
      ],
    },
  },
  defaultVariants: {
    variant: 'primary',
  },
})

interface ButtonProps extends React.ComponentPropsWithoutRef<'button'>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
  loadingText?: string
}

const RawButton = ({
  asChild,
  isLoading = false,
  loadingText,
  className,
  disabled,
  variant,
  children,
  ref,
  ...props
}: ButtonProps & {ref?: React.Ref<HTMLButtonElement>}) => {
  const Component = asChild ? Slot : 'button'
  return (
    <Component
      ref={ref}
      className={cx(buttonVariants({variant}), className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="pointer-events-none flex shrink-0 items-center justify-center gap-1.5">
          <RiLoader2Fill className="size-4 shrink-0 animate-spin" aria-hidden="true" />
          <span className="sr-only">{loadingText ? loadingText : 'Loading'}</span>
          {loadingText ? loadingText : children}
        </span>
      ) : (
        children
      )}
    </Component>
  )
}

RawButton.displayName = 'Button'

export {RawButton, buttonVariants, type ButtonProps}
