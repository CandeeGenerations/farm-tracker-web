import {classNames} from '@/helpers'
import {InformationCircleIcon} from '@heroicons/react/24/outline'
import React from 'react'

interface IAlert {
  message: React.ReactElement | string
  type?: 'danger' | 'warning' | 'primary'
  children?: React.ReactElement | string
  className?: string
  size?: 'default' | 'small'
}

const Alert = ({message, size = 'default', type = 'danger', children, className}: IAlert): React.ReactElement => {
  const css = {
    backgrounds: {
      danger: 'bg-danger-lightest',
      primary: 'bg-primary-lightest',
      warning: 'bg-warning-lightest',
    },
    borders: {
      danger: 'border-danger',
      primary: 'border-primary',
      warning: 'border-warning',
    },
    text: {
      danger: 'text-danger-dark',
      primary: 'text-primary-dark',
      warning: 'text-warning-dark',
    },
    padding: {
      default: 'p-4',
      small: 'py-1 px-2',
    },
    margin: {
      default: 'ml-3',
      small: '',
    },
  }

  return (
    <div
      className={classNames(
        className,
        'flex items-center border-l-4 mb-4 rounded',
        css.backgrounds[type],
        css.borders[type],
        css.padding[size],
      )}
      role="alert"
    >
      {size !== 'small' && (
        <div>
          <InformationCircleIcon className={classNames('w-5 h-5', css.text[type])} />
        </div>
      )}

      <div className="flex-1">
        <p className={classNames('font-medium', css.text[type], css.margin[size])}>{message}</p>

        {children && <p className={classNames('font-medium', css.text[type], css.margin[size])}>{children}</p>}
      </div>
    </div>
  )
}

export default Alert
