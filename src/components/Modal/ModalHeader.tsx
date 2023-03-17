import {Dialog} from '@headlessui/react'
import React from 'react'

interface IModalHeader {
  children: React.ReactNode
}

const ModalHeader = ({children}: IModalHeader): React.ReactElement => {
  return (
    <div className="mt-8 sm:px-6 sm:py-2 sm:flex mx-4 sm:items-start">
      <div className="mt-3 text-center sm:mt-0 sm:text-left">
        <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark">
          {children}
        </Dialog.Title>
      </div>
    </div>
  )
}

export default ModalHeader
