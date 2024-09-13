import {Dialog} from '@headlessui/react'
import {ExclamationTriangleIcon} from '@heroicons/react/24/outline'
import React from 'react'

import Button from './Button'
import {Modal, ModalBody, ModalFooter} from './Modal'

interface IConfirmDeleteModal {
  type: string
  open: boolean
  loading: boolean
  onClose: () => void
  onDelete: () => void
}

const ConfirmDeleteModal = ({
  open,
  type,
  loading = false,
  onClose,
  onDelete,
}: IConfirmDeleteModal): React.ReactElement => {
  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody className="sm:my-8 px-4 pt-5 pb-4 mx-4">
        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-14 w-14 rounded-full bg-danger-lightest sm:mx-0">
          <ExclamationTriangleIcon className="h-10 w-10 text-danger" aria-hidden="true" />
        </div>

        <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
          <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark">
            Delete {type}
          </Dialog.Title>

          <div className="mt-2">
            <p className="text-muted">Are you sure you want to this {type}? This action cannot be undone.</p>
          </div>
        </div>
      </ModalBody>

      <ModalFooter loading={loading} onClose={onClose}>
        <Button loading={loading} loadingText="Deleting..." onClick={onDelete} type="danger">
          Delete
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ConfirmDeleteModal
