import {cn} from '@/lib/utils'
import {CheckIcon} from '@radix-ui/react-icons'
import Link from 'next/link'
import React from 'react'

export interface IStep {
  id: number
  status: 'complete' | 'current' | 'upcoming'
}

interface ISteps {
  steps: IStep[]
  href?: string
  className?: string
  query?: string
}

const Steps = ({steps, href, className, query}: ISteps): React.ReactElement => {
  return (
    <nav className={className}>
      <ol role="list" className="flex items-center justify-center">
        {steps.map((step) => (
          <li key={step.id} className={cn(step.id !== steps.length ? 'pr-16 sm:pr-20' : '', 'relative')}>
            {step.status === 'complete' ? (
              <>
                <div className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-primary-600" />
                </div>

                {href ? (
                  <Link
                    href={`${href}${step.id === 1 ? '' : `/${step.id}`}${query ? `?${query}` : ''}`}
                    className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 hover:bg-primary-900"
                  >
                    <CheckIcon className="h-5 w-5 text-white" />
                  </Link>
                ) : (
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary-600">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                )}
              </>
            ) : step.status === 'current' ? (
              <>
                <div className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>

                <div className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary-600 bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-primary-600" />
                </div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 flex items-center">
                  <div className="h-0.5 w-full bg-gray-200" />
                </div>

                <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-muted-light bg-white">
                  <span className="h-2.5 w-2.5 rounded-full bg-transparent" />
                </div>
              </>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}

export default Steps
