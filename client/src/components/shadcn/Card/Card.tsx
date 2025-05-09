import {cn} from '@/lib/utils'
import React from 'react'
import {match} from 'ts-pattern'

import Button, {IButton} from '../Button/Button'
import {ConfirmDialog} from '../Dialog'
import {CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Card as CnCard} from '../ui/card'

export interface ICard extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  contentClassName?: string
  description?: string
  noPadding?: boolean
  submitProps?: {text?: string} & IButton
  onBack?: () => void
  deleteProps?: {
    onDelete: () => Promise<boolean>
    type?: string
    loading: boolean
  }
  header?: {
    type?: string
    text: string
  }
}

const Card = React.forwardRef<HTMLDivElement, ICard>(
  (
    {title, description, children, noPadding, submitProps, deleteProps, header, contentClassName, onBack, ...props},
    ref,
  ) => {
    const {text: submitText, ...submitButtonProps} = submitProps || {}

    return (
      <>
        <CnCard ref={ref} {...props}>
          {header && header.text && (
            <div
              className={cn(
                'border-b-2 rounded-tl-md rounded-tr-md p-4 font-medium text-white',
                match(header.type)
                  .with('warning', () => 'bg-warning border-warning-medium')
                  .with('success', () => 'bg-success border-success-medium')
                  .with('danger', () => 'bg-destructive border-destructive-medium')
                  .otherwise(() => 'bg-secondary border-secondary-600'),
              )}
            >
              {header.text}
            </div>
          )}

          {title && (
            <CardHeader>
              <CardTitle>{title}</CardTitle>
              {description && <CardDescription>{description}</CardDescription>}
            </CardHeader>
          )}

          {noPadding ? (
            children
          ) : (
            <CardContent className={cn(!title && 'pt-6', contentClassName)}>{children}</CardContent>
          )}

          {(submitProps?.onSubmit || deleteProps?.onDelete) && (
            <CardFooter className="border-t px-6 py-4 flex">
              <div className="sm:flex-1">
                {onBack && <Button onClick={onBack}>Back</Button>}

                {deleteProps?.onDelete && (
                  <ConfirmDialog
                    confirmProps={{onConfirm: deleteProps.onDelete, confirmText: 'Delete', confirmType: 'destructive'}}
                    loadingProps={{loading: deleteProps.loading, loadingText: 'Deleting...'}}
                    title={`Delete ${deleteProps.type}?`}
                    trigger={
                      <Button variant="destructive" outline>
                        Delete
                      </Button>
                    }
                  >
                    This action cannot be undone.
                  </ConfirmDialog>
                )}
              </div>

              <div className="flex-1 sm:flex-none">
                {submitProps && <Button {...submitButtonProps}>{submitText || 'Save'}</Button>}
              </div>
            </CardFooter>
          )}
        </CnCard>
      </>
    )
  },
)

export default Card
