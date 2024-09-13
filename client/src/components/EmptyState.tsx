import * as outlineIcons from '@heroicons/react/24/outline'
import React from 'react'

import {classNames} from '../helpers'

interface IEmptyState {
  entity?: string
  icon?: string
  actions?: React.ReactElement
  success?: string
  message?: string
}

const EmptyState = ({entity, success, message, actions, icon = 'RectangleGroupIcon'}: IEmptyState) => {
  const Icon = outlineIcons[icon]

  return (
    <div className="text-center my-16">
      <Icon className={classNames(success ? 'text-success' : 'text-muted', 'mx-auto h-12 w-12')} />

      <h3 className={classNames(success ? 'text-success-medium' : 'text-muted-medium', 'mt-2 text-sm font-medium')}>
        {success || message || `There are no ${entity || 'items'}`}
      </h3>

      {actions}
    </div>
  )
}

export default EmptyState
