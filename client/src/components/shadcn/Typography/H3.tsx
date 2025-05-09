import {cn} from '@/lib/utils'
import React from 'react'

const H3 = ({children, className, ...props}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement => {
  return (
    <h3 className={cn('scroll-m-20 text-2xl font-semibold tracking-tight', className)} {...props}>
      {children}
    </h3>
  )
}

export default H3
