import {cn} from '@/lib/utils'
import React from 'react'
import {match} from 'ts-pattern'

import {Progress} from '../ui/progress'

interface IProgressBar {
  progress: number
  activeStep: number
  title: string
  completeTitle: string
  steps: string[]
}

const ProgressBar = ({progress, activeStep, title, completeTitle, steps}: IProgressBar): React.ReactElement => {
  return (
    <div>
      <p className="font-bold text-muted-medium">{progress === 100 ? completeTitle : title}</p>

      <div className="mt-6">
        <Progress value={progress} />

        <div
          className={cn('mt-6 text-sm font-medium text-muted-medium grid grid-cols-1', `sm:grid-cols-${steps.length}`)}
        >
          {steps.map((x, i) => (
            <div
              key={i}
              className={cn(
                'text-left mb-2 sm:mb-0',
                match(i)
                  .with(0, () => 'sm:text-left')
                  .with(steps.length - 1, () => 'sm:text-right')
                  .otherwise(() => 'sm:text-center'),
                progress === 100 ? 'text-success-medium' : activeStep >= i && 'text-secondary-600',
              )}
            >
              {x}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProgressBar
