import React from 'react'
import {classNames} from '../../helpers'

interface IModalBody {
  col?: boolean
  notFlex?: boolean
  className?: string
  children: React.ReactNode
}

const ModalBody = ({col = false, notFlex = false, className, children}: IModalBody): React.ReactElement => {
  return (
    <div
      className={classNames(
        col ? 'sm:flex-col' : 'sm:items-start',
        'sm:mb-8 sm:px-6 mx-4 px-4',
        notFlex ? '' : 'sm:flex',
        className,
      )}
    >
      {children}
    </div>
  )
}

export default ModalBody
