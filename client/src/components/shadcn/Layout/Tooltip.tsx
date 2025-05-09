import * as TooltipPrimitive from '@radix-ui/react-tooltip'
import React from 'react'

import {Tooltip as CnTooltip, TooltipContent, TooltipTrigger} from '../ui/tooltip'

export interface IToolTip {
  trigger: React.ReactNode
  children: React.ReactNode
  contentProps?: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
}

const Tooltip = ({trigger, children, contentProps}: IToolTip) => {
  return (
    <CnTooltip>
      <TooltipTrigger asChild>{trigger}</TooltipTrigger>

      <TooltipContent {...contentProps}>{children}</TooltipContent>
    </CnTooltip>
  )
}

export default Tooltip
