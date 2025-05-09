import {cn} from '@/lib/utils'
import React from 'react'

const H4 = ({children, className, ...props}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement => {
  return (
    <h4 className={cn('scroll-m-20 text-xl font-semibold tracking-tight', className)} {...props}>
      {children}
    </h4>
  )
}

export default H4
