import Link from 'next/link'
import React from 'react'

import {Button} from '../Button'
import {IButton} from '../Button/Button'
import {Card} from '../Card'
import ConfirmDialog, {IConfirmDialog} from '../Dialog/ConfirmDialog'

export interface IAction {
  id: number
  title: string
  description: string
  link?: string
  buttonProps?: {text: string} & IButton
  confirmProps?: IConfirmDialog
}

interface IActions {
  noTitle?: boolean
  noCard?: boolean
  actions: IAction[]
}

const Actions = ({actions, noTitle = false, noCard = false}: IActions): React.ReactElement => {
  const content = (
    <div className="overflow-hidden">
      <ul role="list" className="divide-y divide-border">
        {actions.map((item) => {
          const {text, ...buttonProps} = item.buttonProps || {}
          const button = (
            <Button block {...buttonProps}>
              {text}
            </Button>
          )

          return (
            <li key={item.id}>
              <div className="px-4 py-4 flex sm:flex-row flex-col sm:items-center sm:px-6">
                <div className="flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-muted-dark font-bold">{item.title}</p>

                    <p className="text-muted-mid">{item.description}</p>
                  </div>
                </div>

                <div className="sm:ml-5 flex-1 w-full sm:w-auto sm:flex-none flex-shrink-0">
                  {text ? (
                    item.link ? (
                      <Link href={item.link}>{button}</Link>
                    ) : (
                      button
                    )
                  ) : item.confirmProps?.trigger ? (
                    <ConfirmDialog {...item.confirmProps} />
                  ) : undefined}
                </div>
              </div>
            </li>
          )
        })}
      </ul>
    </div>
  )

  return noCard ? content : <Card title={noTitle ? undefined : 'Actions'}>{content}</Card>
}

export default Actions
