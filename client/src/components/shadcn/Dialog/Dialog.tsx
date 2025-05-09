import {cn} from '@/lib/utils'
import React from 'react'

import {Button} from '../Button'
import {
  Dialog as CnDialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog'

export interface IDialog {
  children?: React.ReactNode
  trigger?: React.ReactNode
  // eslint-disable-next-line no-unused-vars
  actions?: (setOpen: (open: boolean) => void) => React.ReactNode
  title: string
  description?: string
  loading?: boolean
  closeText?: string
  size?: 'default' | 'medium' | 'large'
  open?: boolean
  // eslint-disable-next-line no-unused-vars
  onOpenChange?: (open: boolean) => void
}

const Dialog = ({
  children,
  trigger,
  actions,
  title,
  description,
  loading,
  closeText,
  size = 'default',
  open,
  onOpenChange,
}: IDialog) => {
  const [internalOpen, setInternalOpen] = React.useState(false)

  const isControlled = open !== undefined
  const isOpen = isControlled ? open : internalOpen
  const setOpen = (newOpen: boolean) => {
    if (!isControlled) {
      setInternalOpen(newOpen)
    }
    onOpenChange?.(newOpen)
  }

  return (
    <CnDialog open={isOpen} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>

      <DialogContent
        className={cn(
          size === 'medium' ? 'sm:max-w-[800px]' : size === 'large' ? 'sm:max-w-[1200px]' : 'sm:max-w-[425px]',
        )}
      >
        <DialogHeader className="mb-4">
          <DialogTitle>{title}</DialogTitle>

          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>

        {children}

        <DialogFooter className={children && 'mt-4'}>
          <DialogClose asChild>
            <Button variant="outline" disabled={loading}>
              {closeText || 'Cancel'}
            </Button>
          </DialogClose>

          {actions && actions(setOpen)}
        </DialogFooter>
      </DialogContent>
    </CnDialog>
  )
}

export default Dialog
