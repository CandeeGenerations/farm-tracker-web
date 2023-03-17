import {ArrowLongLeftIcon} from '@heroicons/react/24/outline'
import Link from 'next/link'
import React from 'react'

interface IBackLink {
  href: string
  children: React.ReactNode
}

const BackLink = ({href, children}: IBackLink): React.ReactElement => {
  return (
    <Link className="inline-block" href={href}>
      <div className="flex items-center text-primary-medium hover:text-primary">
        <ArrowLongLeftIcon className="h-4 w-4 mr-1.5" />
        {children}
      </div>
    </Link>
  )
}

export default BackLink
