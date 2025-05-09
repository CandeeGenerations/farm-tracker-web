import {cn} from '@/lib/utils'
import {Cross1Icon} from '@radix-ui/react-icons'
import React from 'react'

interface ITag {
  children: React.ReactNode
  onRemove?: () => void
  onClick?: () => void
}

const Tag = ({children, onRemove, onClick}: ITag): React.ReactElement => {
  return (
    <span
      className={cn(
        onClick && 'cursor-pointer',
        'inline-flex items-center rounded bg-secondary py-1 pl-2.5 text-muted-lightest',
      )}
      onClick={onClick}
    >
      {children}

      {onRemove && (
        <button
          type="button"
          className="mx-2 inline-flex h-4 w-4 flex-shrink-0 items-center rounded justify-center text-white hover:bg-secondary-800 hover:text-muted-lightest focus:bg-primary focus:text-muted-lightest focus:outline-none"
          onClick={onRemove}
        >
          <span className="sr-only">Remove tag</span>
          <Cross1Icon className="h-5 w-5" />
        </button>
      )}
    </span>
  )
}

export default Tag
