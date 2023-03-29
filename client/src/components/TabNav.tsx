import React, {useEffect, useState} from 'react'
import {classNames, setPageState} from '../helpers'
import FormSelect from './FormSelect'

export interface ITab {
  id: number
  name: string
  current?: boolean
  danger?: boolean
}

interface ITabNav {
  tabs: ITab[]
  currentTab: number
  // eslint-disable-next-line no-unused-vars
  onChange: (tab: number) => void
}

interface IPageState {
  tabs: ITab[]
}

const TabNav = ({tabs, currentTab, onChange}: ITabNav): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    tabs: [],
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    setState({
      tabs: tabs.map(tab => ({
        ...tab,
        current: tab.id === currentTab,
      })),
    })
  }, [tabs])

  return (
    pageState.tabs.length > 0 && (
      <div>
        <div className="sm:hidden">
          <FormSelect
            items={pageState.tabs}
            name="tabs"
            staticSelected={{id: currentTab, name: tabs.find(x => x.id === currentTab).name}}
            onSelected={item => onChange(Number(item.id))}
          />
        </div>

        <div className="hidden sm:block">
          <div className="border-b border-muted-light">
            <nav className="-mb-px flex space-x-8">
              {pageState.tabs.map(tab => (
                <span
                  key={tab.id}
                  onClick={() => onChange(tab.id)}
                  className={classNames(
                    tab.current
                      ? tab.danger
                        ? 'border-danger text-danger'
                        : 'border-primary-medium text-primary-medium'
                      : classNames(
                          tab.danger
                            ? 'text-danger-dark hover:text-danger hover:border-danger-dark'
                            : 'text-muted hover:text-muted-medium hover:border-muted-light',
                          'border-transparent',
                        ),
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm cursor-pointer',
                  )}
                >
                  {tab.name}
                </span>
              ))}
            </nav>
          </div>
        </div>
      </div>
    )
  )
}

export default TabNav
