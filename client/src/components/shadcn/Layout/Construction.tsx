import {ExclamationTriangleIcon} from '@radix-ui/react-icons'
import React from 'react'

import {H1, P} from '../Typography'

const Construction = (): React.ReactElement => {
  return (
    <div className="flex flex-col items-center py-10">
      <ExclamationTriangleIcon className="w-24 h-24 text-warning mb-5" />

      <H1 className="mb-6">Under construction</H1>

      <P className="text-center">
        We are still working on this page.
        <br />
        Check back later when this page is complete.
      </P>
    </div>
  )
}

export default Construction
