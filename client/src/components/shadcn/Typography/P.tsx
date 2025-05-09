import {cn} from '@/lib/utils'
import React from 'react'

const P = ({children, className}: React.HTMLAttributes<HTMLParagraphElement>): React.ReactElement => {
  return <p className={cn('text-muted-medium leading-5 [&:not(:last-child)]:mb-4', className)}>{children}</p>
}

export default P
