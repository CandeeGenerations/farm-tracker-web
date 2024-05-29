import React from 'react'
import Button from '../Button'

interface IModalFooter {
  children?: React.ReactNode
  loading?: boolean
  onClose?: () => void
  onDelete?: () => void
  closeText?: string
  successText?: React.ReactNode
}

const ModalFooter = ({
  children,
  loading = false,
  onClose,
  onDelete,
  closeText,
  successText,
}: IModalFooter): React.ReactElement => {
  return (
    <div className="mt-4 px-4 py-6 bg-muted-lightest sm:px-10 flex flex-col sm:flex-row sm:items-center border-t border-muted-light">
      <div className="flex-1 order-2 sm:order-1">
        {onDelete && (
          <Button disabled={loading} type="danger" onClick={onDelete} className="mr-4">
            Delete
          </Button>
        )}

        {successText}
      </div>

      <div className="order-1 sm:order-2 flex flex-col sm:flex-row">
        {onClose && (
          <Button disabled={loading} type="secondary" onClick={onClose} className="mr-4 order-2 sm:order-1">
            {closeText || 'Cancel'}
          </Button>
        )}

        <div className="order-1 sm:order-2">{children}</div>
      </div>
    </div>
  )
}

export default ModalFooter
