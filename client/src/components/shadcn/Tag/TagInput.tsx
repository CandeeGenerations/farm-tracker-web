import React, {useEffect, useRef, useState} from 'react'

import {Input} from '../ui/input'

interface ITagInput {
  value: string
  // eslint-disable-next-line no-unused-vars
  onChange: (value: string) => void
}

const TagInput = ({value, onChange}: ITagInput): React.ReactElement => {
  const [inputValue, setInputValue] = useState(value)
  const ref = useRef()

  useEffect(() => {
    if (ref.current) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const input = ref.current as any
      input.focus()
    }
  }, [])

  return (
    <Input
      ref={ref}
      value={inputValue}
      onFocus={(e) => e.target.select()}
      onChange={(e) => setInputValue(e.target.value)}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          onChange(inputValue)
        }
      }}
      onBlur={() => onChange(inputValue)}
    />
    // <input
    //   ref={ref}
    //   type="text"
    //   className="inline-flex items-center rounded bg-secondary-400 py-1 pl-2.5 text-muted-lightest focus:ring-secondary focus:border-secondary-500 border-secondary-500 shadow-sm"
    //   value={inputValue}
    //   onFocus={(e) => e.target.select()}
    //   onChange={(e) => setInputValue(e.target.value)}
    //   onKeyDown={(e) => {
    //     if (e.key === 'Enter') {
    //       onChange(inputValue)
    //     }
    //   }}
    //   onBlur={() => onChange(inputValue)}
    // />
  )
}

export default TagInput
