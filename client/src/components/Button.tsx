import React from 'react'
import {classNames} from '../helpers'
import SmallLoader from './SmallLoader'

export type ButtonType = 'default' | 'primary' | 'danger' | 'secondary'
export type ButtonSize = 'xs' | 'sm' | 'md' | 'lg' | 'xlg'

interface IButtonStyle {
  disabled: string
  enabled: string
  common?: string
}

interface IButtonStyles {
  primary: IButtonStyle
  secondary: IButtonStyle
  danger: IButtonStyle
  default: IButtonStyle
}

interface IButton {
  className?: string
  loading?: boolean
  loadingText?: string
  disabled?: boolean
  children: React.ReactNode
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClick?: any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ref?: React.MutableRefObject<any>
  type?: ButtonType
  size?: ButtonSize
  block?: boolean
  outline?: boolean
  noTopPadding?: boolean
}

const Button = ({
  className = undefined,
  loading = false,
  loadingText = undefined,
  disabled = false,
  children,
  onClick = undefined,
  ref = undefined,
  type = 'default',
  size = 'md',
  block = false,
  outline = false,
  noTopPadding = false,
}: IButton): React.ReactElement => {
  if (loading) {
    disabled = true
  }

  const styles: IButtonStyles = {
    primary: {
      disabled: 'bg-muted-light text-muted border-muted',
      enabled: 'bg-primary-medium text-white hover:bg-primary-dark focus:ring-primary-medium',
      common: 'border-transparent',
    },
    secondary: {
      disabled: 'bg-muted-light text-muted border-muted',
      enabled:
        'border-primary-dark bg-muted-lightest text-primary-medium focus:ring-primary-medium hover:bg-muted-light-medium hover:text-primary-dark',
    },
    default: {
      disabled: 'bg-muted-lightest text-muted',
      enabled: 'bg-white text-muted-medium hover:bg-muted-lightest focus:ring-primary-medium',
      common: 'border-muted-light',
    },
    danger: {
      disabled: 'bg-muted-lightest text-danger-light border-danger-lightest',
      enabled: classNames(
        outline
          ? 'text-danger-medium bg-muted-lightest hover:bg-danger-lightest hover:text-danger-dark'
          : 'bg-danger-medium text-white hover:bg-danger-medium',
        'focus:ring-danger',
      ),
      common: outline ? 'border-danger-medium' : 'border-transparent',
    },
  }
  const sizes = {
    xs: 'text-sm sm:px-2 py-1.5 override',
    sm: 'sm:px-3 py-2',
    md: 'px-4 py-2',
    lg: 'text-lg px-5 py-3 override',
    xlg: 'text-xl px-6 py-3.5 override',
  }

  return (
    <button
      type="button"
      disabled={disabled}
      className={classNames(
        disabled
          ? classNames(styles[type].disabled, 'cursor-default')
          : classNames(styles[type].enabled, 'focus:ring-2 focus:ring-offset-2'),
        classNames(
          styles[type].common || '',
          sizes[size],
          block ? '' : 'sm:w-auto',
          noTopPadding ? '' : 'mt-3',
          'focus:outline-none sm:mt-0 w-full inline-flex justify-center rounded border shadow-sm font-medium transition-all',
        ),
        className,
      )}
      onClick={loading ? null : onClick}
      ref={ref}
    >
      {(loading && (
        <>
          {loadingText || children} <SmallLoader className="ml-2" />
        </>
      )) ||
        children}
    </button>
  )
}

export default Button
