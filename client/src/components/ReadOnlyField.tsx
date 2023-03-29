import React from 'react'
import {classNames} from '../helpers'
import FormLabel from './FormLabel'

interface IReadOnlyField {
  name: string
  label?: React.ReactNode
  value: string | number | React.ReactNode
  vertical?: boolean
}

const ReadOnlyField = ({name, vertical = false, label = undefined, value}: IReadOnlyField): React.ReactElement => {
  return (
    <div className={classNames(vertical ? '' : 'sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-2')}>
      {label && <FormLabel name={name}>{label}</FormLabel>}

      <div className={classNames(vertical ? 'mt-1' : 'sm:col-span-2 sm:mt-2.5')}>{value || <em>None</em>}</div>
    </div>
  )
}

export default ReadOnlyField
