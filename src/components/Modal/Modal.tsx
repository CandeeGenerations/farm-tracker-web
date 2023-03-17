import {classNames} from '@/helpers'
import {Dialog, Transition} from '@headlessui/react'
import {XMarkIcon} from '@heroicons/react/24/outline'
import React, {Fragment} from 'react'

interface IModal {
  open: boolean
  onClose: () => void
  children: React.ReactNode
  size?: 'default' | 'large'
}

const Modal = ({open, onClose, children, size = 'default'}: IModal): React.ReactElement => {
  const css = {
    maxWidth: {
      default: 'sm:max-w-lg',
      large: 'sm:max-w-7xl',
    },
  }

  return (
    <Transition.Root show={open || false} as={Fragment}>
      <Dialog as="div" static className="fixed z-10 inset-0 overflow-y-auto" open={open} onClose={onClose}>
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Dialog.Overlay className="fixed inset-0 bg-muted bg-opacity-75 transition-opacity" />
          </Transition.Child>

          {/* This element is to trick the browser into centering the modal contents. */}
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
            &#8203;
          </span>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            enterTo="opacity-100 translate-y-0 sm:scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
            leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
          >
            <div
              className={classNames(
                'inline-block align-bottom bg-white rounded text-left overflow-hidden shadow-xl transform transition-all sm:align-middle sm:w-full',
                css.maxWidth[size],
              )}
            >
              <div className="hidden sm:block absolute top-0 right-0 pt-10 pr-10">
                <button
                  type="button"
                  className="bg-white rounded text-muted hover:bg-muted-lightest p-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                  onClick={onClose}
                >
                  <span className="sr-only">Close</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              {children}
            </div>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  )
}

export default Modal
