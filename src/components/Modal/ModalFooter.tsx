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
    <div className="mt-4 px-4 py-6 bg-muted-lightest sm:px-10 sm:flex sm:items-center border-t border-muted-light">
      <div className="flex-1">
        {onDelete && (
          <Button disabled={loading} type="danger" onClick={onDelete} className="mr-4">
            Delete
          </Button>
        )}

        {successText}
      </div>

      <div>
        {onClose && (
          <Button disabled={loading} type="secondary" onClick={onClose} className="mr-4">
            {closeText || 'Cancel'}
          </Button>
        )}

        {children}
      </div>
    </div>
  )
}

export default ModalFooter
