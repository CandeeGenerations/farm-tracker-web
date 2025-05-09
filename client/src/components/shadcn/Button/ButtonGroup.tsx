import {cn} from '@/lib/utils'
import React from 'react'
import {match} from 'ts-pattern'

import Tooltip, {IToolTip} from '../Layout/Tooltip'
import Button, {IButton} from './Button'

interface IButtonGroupButton extends IButton {
  icon: React.ReactNode
  tooltip?: Omit<IToolTip, 'trigger'>
}

interface IButtonGroup {
  buttons: IButtonGroupButton[]
}

const ButtonGroup = ({buttons}: IButtonGroup): React.ReactElement => {
  return (
    <span className="isolate inline-flex rounded shadow-sm">
      {buttons.map(({icon, tooltip, ...props}, index) => {
        props.children = icon
        props.className = cn(
          props.className,
          buttons.length > 1
            ? match(index)
                .with(0, () => '!rounded-l-md !rounded-r-none !border-r-0')
                .with(buttons.length - 1, () => '!rounded-r-md !rounded-l-none')
                .otherwise(() => '')
            : 'rounded',
        )
        const buttonElement = <Button {...props} key={index} hideLoadingText outline />

        return tooltip ? <Tooltip trigger={buttonElement} {...tooltip} /> : buttonElement
      })}
    </span>
  )
}

export default ButtonGroup
