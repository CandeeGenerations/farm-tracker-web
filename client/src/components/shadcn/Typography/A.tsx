import {cn} from '@/lib/utils'
import React from 'react'

const A = ({
  children,
  className,
  onClick,
  ...props
}: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>): React.ReactElement => {
  return (
    <a
      onClick={onClick}
      className={cn('underline underline-offset-4 text-secondary hover:text-secondary-800', className)}
      {...props}
    >
      {children}
    </a>
  )
}

export const ExternalA = ({
  children,
  className,
  ...props
}: React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement>): React.ReactElement => (
  <A
    className={cn('underline underline-offset-4 text-secondary hover:text-secondary-800', className)}
    rel="noopener noreferrer"
    target="_blank"
    {...props}
  >
    {children}
  </A>
)

export default A
