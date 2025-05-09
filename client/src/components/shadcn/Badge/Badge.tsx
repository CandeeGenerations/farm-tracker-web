import {cn} from '@/lib/utils'
import React from 'react'
import {match} from 'ts-pattern'

import {BadgeProps, Badge as CnBadge} from '../ui/badge'

interface IBadge extends BadgeProps {
  typeOverride?: 'warning' | 'success'
  children: React.ReactNode
}

const Badge = ({typeOverride, children, ...props}: IBadge): React.ReactElement => {
  props.className = typeOverride
    ? cn(
        props.className,
        match(typeOverride)
          .with('warning', () => 'bg-warning text-white shadow hover:bg-warning/80')
          .with('success', () => 'bg-success text-white shadow hover:bg-success/80')
          .otherwise(() => ''),
      )
    : props.className

  return (
    <CnBadge variant="destructive" {...props}>
      {children}
    </CnBadge>
  )
}

export default Badge
