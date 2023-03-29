import React, {useEffect, useState} from 'react'
import {setPageState} from '../helpers'
import FormInput from './FormInput'

export interface ISearch {
  // eslint-disable-next-line no-unused-vars
  onSearch?: (value: string, reset?: boolean) => void
  resetSearch?: number
}

interface IPageState {
  searchValue?: string
  searchReset?: boolean
}

const Search = ({onSearch, resetSearch}: ISearch): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    searchValue: '',
    searchReset: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    if (onSearch) {
      onSearch(pageState.searchValue, pageState.searchReset)
    }
  }, [pageState.searchValue])

  useEffect(() => {
    setState({searchValue: '', searchReset: false})
  }, [resetSearch])

  return (
    <div className="flex items-center">
      <label htmlFor="search" className="cursor-pointer block font-bold text-muted-medium mr-4 pt-5">
        Search:
      </label>

      <FormInput
        clearable
        name="search"
        onChange={(_, value, extraProps) => {
          const stateChanges: IPageState = {
            searchValue: value.toString(),
          }

          if (extraProps) {
            stateChanges.searchReset = extraProps.reset || false
          }

          setState(stateChanges)
        }}
        staticValue={pageState.searchValue}
      />
    </div>
  )
}

export default Search
