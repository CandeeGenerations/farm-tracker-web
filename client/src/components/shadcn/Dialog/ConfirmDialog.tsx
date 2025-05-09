import React from 'react'

import {Button} from '../Button'
import {ButtonType} from '../Button/Button'
import Dialog from './Dialog'

export interface IConfirmDialog {
  trigger?: React.ReactNode
  children?: React.ReactNode
  title?: string
  description?: string
  loadingProps?: {
    loading?: boolean
    loadingText?: string
  }
  confirmProps?: {
    onConfirm: () => Promise<boolean | void>
    confirmText?: string
    confirmType?: ButtonType
  }
  open?: boolean
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void
  additionalActions?: React.ReactNode
}

const ConfirmDialog = ({
  trigger,
  children,
  title,
  description,
  loadingProps,
  confirmProps,
  open,
  onOpenChange,
  additionalActions,
}: IConfirmDialog): React.ReactElement => {
  return (
    <Dialog
      title={title || 'Change settings?'}
      description={description}
      trigger={trigger}
      loading={loadingProps?.loading}
      open={open}
      onOpenChange={onOpenChange}
      actions={
        confirmProps &&
        ((setOpen) => (
          <>
            <Button
              variant={confirmProps.confirmType || 'default'}
              onClick={async () => {
                const result = await confirmProps.onConfirm()

                if (result) {
                  setOpen(false)
                }
              }}
              disabled={loadingProps?.loading}
              loading={loadingProps?.loading}
              loadingText={loadingProps?.loadingText || 'Saving...'}
            >
              {confirmProps.confirmText || 'Confirm'}
            </Button>
            {additionalActions}
          </>
        ))
      }
    >
      {children}
    </Dialog>
  )
}

export default ConfirmDialog
