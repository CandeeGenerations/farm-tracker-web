import {cn} from '@/lib/utils'
import React from 'react'

const H1 = ({children, className, ...props}: React.HTMLAttributes<HTMLHeadingElement>): React.ReactElement => {
  return (
    <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)} {...props}>
      {children}
    </h1>
  )
}

export default H1
