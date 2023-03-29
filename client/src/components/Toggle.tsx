import {Switch} from '@headlessui/react'
import React from 'react'
import {classNames} from '../helpers'

interface IToggle {
  enabled: boolean
  setEnabled: (value: boolean) => void // eslint-disable-line no-unused-vars
  onLabel?: string
  offLabel?: string
  disabled?: boolean
}

const Toggle = ({
  enabled,
  setEnabled,
  disabled = false,
  onLabel = undefined,
  offLabel = undefined,
}: IToggle): React.ReactElement => {
  return (
    <Switch.Group as="div" className="flex items-center">
      {offLabel && (
        <Switch.Label as="span" className="mr-3">
          <span className="font-medium text-muted-dark">{offLabel}</span>
        </Switch.Label>
      )}

      <Switch
        checked={enabled}
        onChange={disabled ? null : setEnabled}
        className={classNames(
          disabled
            ? 'cursor-default'
            : 'cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-medium',
          disabled
            ? enabled
              ? 'bg-primary-light'
              : 'bg-muted-light'
            : enabled
            ? 'bg-primary-medium'
            : 'bg-muted-light',
          'relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full transition-colors ease-in-out duration-200',
        )}
      >
        <span
          aria-hidden="true"
          className={classNames(
            enabled ? 'translate-x-5' : 'translate-x-0',
            'pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200',
          )}
        />
      </Switch>

      {onLabel && (
        <Switch.Label as="span" className="ml-3">
          <span className="font-medium text-muted-dark">{onLabel}</span>
        </Switch.Label>
      )}
    </Switch.Group>
  )
}

export default Toggle
