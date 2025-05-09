import {cn} from '@/lib/utils'
import {ViewNoneIcon} from '@radix-ui/react-icons'
import React from 'react'

import {Card} from '../Card'

interface IEmptyState {
  entity?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon?: any
  actions?: React.ReactNode
  success?: string
  message?: string
  componentIcon?: React.ReactNode
  noCard?: boolean
}

const EmptyState = ({entity, success, message, actions, icon, noCard = false}: IEmptyState) => {
  const iconWrapper = {icon: icon || ViewNoneIcon}

  const comp = (children: React.ReactNode) => {
    if (noCard) {
      return <div className="text-center space-y-6 my-4">{children}</div>
    }

    return <Card className="text-center">{children}</Card>
  }

  return comp(
    <>
      <iconWrapper.icon className={cn(success ? 'text-success' : 'text-muted-mid', 'mx-auto h-12 w-12')} />

      <h3 className={cn(success ? 'text-success-medium' : 'text-muted-medium', 'mt-2 font-medium')}>
        {success || message || `There are no ${entity || 'items'}`}
      </h3>

      {actions}
    </>,
  )
}

export default EmptyState
