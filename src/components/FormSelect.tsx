import {classNames, setPageState} from '@/helpers'
import {Listbox, Transition} from '@headlessui/react'
import {CheckIcon, ChevronUpDownIcon, PlusCircleIcon} from '@heroicons/react/24/outline'
import _sortBy from 'lodash/sortBy'
import React, {Fragment, useEffect, useState} from 'react'
import {Control, Controller, FieldError} from 'react-hook-form'
import FormInput from './FormInput'
import ReadOnlyField from './ReadOnlyField'
import SmallLoader from './SmallLoader'

export interface IFormSelectItem {
  id: string | number
  name: string
}

interface IListBoxControl {
  items: IFormSelectItem[]
  value: IFormSelectItem | IFormSelectItem[]
  // eslint-disable-next-line no-unused-vars
  onChange: (item: IFormSelectItem) => void
  label?: React.ReactNode
  error?: FieldError
  placeholder?: string
  required?: boolean
  helpText?: string
  loading?: boolean
  searchable?: boolean
  noSort?: boolean
  activeLabel?: boolean
  addNew?: () => void
  vertical?: boolean
  none?: boolean
}

interface IPageState {
  open?: boolean
  searchValue?: string
  items?: IFormSelectItem[]
}

const ListBoxControl = ({
  items,
  value,
  label,
  placeholder,
  required,
  helpText,
  onChange,
  error,
  addNew,
  loading = false,
  searchable = false,
  noSort = false,
  activeLabel = true,
  vertical = false,
  none = false,
}: IListBoxControl): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    open: false,
    searchValue: '',
    items: [],
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    setState({
      items: [
        ...items.filter(x => x.id === 'none'),
        ...(noSort
          ? items.filter(x => x.id !== 'none')
          : _sortBy(
              items.filter(x => x.id !== 'none'),
              ['name'],
            )),
      ],
    })
  }, [items])

  const selected = (item: IFormSelectItem) =>
    Array.isArray(value) ? !!value.find(el => el.id === item.id) : value.id === item.id

  const addNewLink = (
    <Listbox.Option
      key="new"
      className={({active}) =>
        classNames(
          active ? 'text-white bg-primary-medium' : 'text-muted-dark',
          pageState.items.length > 0 ? 'border-t border-muted-light' : '',
          'cursor-pointer select-none relative py-2 pl-8 pr-4',
        )
      }
      value={{id: 'new', name: 'Add new'}}
    >
      {({active}) => (
        <>
          <span className="font-medium block truncate">Add new</span>

          <span
            className={classNames(
              active ? 'text-white' : 'text-primary',
              'absolute inset-y-0 left-0 flex items-center pl-1.5',
            )}
          >
            <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
          </span>
        </>
      )}
    </Listbox.Option>
  )

  const noneLink = (
    <Listbox.Option
      key="none"
      className={({active}) =>
        classNames(
          active ? 'text-white bg-primary-medium' : 'text-muted-dark',
          pageState.items.length > 0 ? 'border-t border-muted-light' : '',
          'cursor-pointer select-none relative py-2 pl-8 pr-4',
        )
      }
      value={{id: 'none', name: 'None'}}
    >
      {() => <span className="font-medium block truncate italic">None</span>}
    </Listbox.Option>
  )

  return (
    <>
      <Listbox
        value={value}
        onChange={(item: IFormSelectItem) => {
          if (item.id === 'new' && addNew) {
            addNew()
            return
          }

          if (item.id === 'none' && none) {
            onChange(null)
            return
          }

          setState({searchValue: ''})
          onChange(item)
        }}
      >
        {({open}) => (
          <div className={classNames(vertical ? '' : 'sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:pt-5 w-full')}>
            <div>
              {label && (
                <Listbox.Label
                  className={classNames(
                    error ? 'text-danger-medium' : 'text-muted-medium',
                    vertical ? 'mb-1' : 'sm:mt-px sm:pt-2',
                    activeLabel ? '' : 'opacity-60',
                    'cursor-pointer block font-bold',
                  )}
                >
                  {label}
                  {required && <span className="ml-1 text-danger">*</span>}
                </Listbox.Label>
              )}

              {error && !vertical && <p className="mt-2 text-danger-dark">{error.message}</p>}
            </div>

            <div className={classNames(vertical ? '' : 'sm:col-span-2 sm:mt-0 sm:relative')}>
              {searchable ? (
                <Listbox.Button as={Fragment}>
                  <FormInput
                    onBlur={() => setState({open: false})}
                    onFocus={() => setState({open: true})}
                    staticValue={pageState.searchValue}
                    onChange={(_, value) =>
                      setState({
                        searchValue: value.toString(),
                        items: _sortBy(
                          items.filter(x => x.name.toLowerCase().includes(value.toString().trim().toLowerCase())),
                          ['name'],
                        ),
                      })
                    }
                    dropdown
                    name="search"
                    placeholder={placeholder}
                    onDropdownClick={() => setState({open: !pageState.open})}
                  />
                </Listbox.Button>
              ) : (
                <Listbox.Button
                  className={classNames(
                    error
                      ? 'bg-danger-lightest border-danger text-danger-dark placeholder-danger-medium focus:ring-danger focus:border-danger'
                      : 'focus:ring-primary-medium focus:border-primary-medium border-muted-light',
                    'relative w-full sm:max-w-xs sm:text-sm bg-white border rounded shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-2 focus:ring-offset-2',
                  )}
                >
                  <span className="block truncate">
                    {loading ? (
                      <SmallLoader />
                    ) : Array.isArray(value) || !value ? (
                      placeholder || 'Select items'
                    ) : (
                      items.find(x => x.id == value.id)?.name || placeholder || 'Select item'
                    )}
                  </span>

                  {!loading && (
                    <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                      <ChevronUpDownIcon className="h-5 w-5 text-muted" aria-hidden="true" />
                    </span>
                  )}
                </Listbox.Button>
              )}

              <Transition
                show={open || pageState.open || false}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  static
                  className="absolute z-10 border border-muted-light mt-1 w-full sm:max-w-xs sm:text-sm bg-white shadow-lg max-h-60 rounded py-1 text-base ring-2 ring-primary-medium ring-opacity-5 overflow-auto focus:outline-none"
                >
                  {pageState.items.length > 0 ? (
                    <>
                      {pageState.items.map(item => {
                        const selectedItem = selected(item)

                        return (
                          <Listbox.Option
                            key={item.id}
                            className={({active}) =>
                              classNames(
                                active ? 'text-white bg-primary-medium' : 'text-muted-dark',
                                'cursor-pointer select-none relative py-2 pl-8 pr-4',
                              )
                            }
                            value={item}
                          >
                            {({active}) => (
                              <>
                                <span
                                  className={classNames(selectedItem ? 'font-bold' : 'font-normal', 'block truncate')}
                                >
                                  {item.name}
                                </span>

                                {selectedItem ? (
                                  <span
                                    className={classNames(
                                      active ? 'text-white' : 'text-primary',
                                      'absolute inset-y-0 left-0 flex items-center pl-1.5',
                                    )}
                                  >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                  </span>
                                ) : null}
                              </>
                            )}
                          </Listbox.Option>
                        )
                      })}

                      {addNew && addNewLink}

                      {none && noneLink}
                    </>
                  ) : addNew ? (
                    addNewLink
                  ) : none ? (
                    noneLink
                  ) : (
                    <div className="cursor-default select-none relative py-2 pl-8 pr-4">
                      <span className="font-normal block truncate">
                        <em>No options</em>
                      </span>
                    </div>
                  )}
                </Listbox.Options>
              </Transition>

              {helpText && <p className="mt-2 text-muted">{helpText}</p>}
            </div>
          </div>
        )}
      </Listbox>

      {error && vertical && <p className="mt-2 text-danger-dark">{error.message}</p>}
    </>
  )
}

interface IFormSelect {
  items: IFormSelectItem[]
  name: string
  error?: FieldError
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control?: Control<any, Object>
  staticSelected?: IFormSelectItem | IFormSelectItem[]
  // eslint-disable-next-line no-unused-vars
  onSelected?: (item: IFormSelectItem) => void
  label?: React.ReactNode
  placeholder?: string
  required?: boolean
  helpText?: string
  loading?: boolean
  searchable?: boolean
  noSort?: boolean
  activeLabel?: boolean
  addNew?: () => void
  vertical?: boolean
  none?: boolean
  readOnly?: boolean
}

const FormSelect = ({
  items,
  control,
  name,
  staticSelected,
  onSelected,
  helpText,
  error,
  addNew,
  label = undefined,
  placeholder = undefined,
  required = undefined,
  loading = false,
  searchable = false,
  noSort = false,
  activeLabel = true,
  vertical = false,
  none = false,
  readOnly = false,
}: IFormSelect): React.ReactElement => {
  if (readOnly) {
    return control ? (
      <Controller
        control={control}
        name={name}
        render={({field: {value}}) => (
          <ReadOnlyField
            name={name}
            label={label}
            value={Array.isArray(value) ? value.join(', ') : value}
            vertical={vertical}
          />
        )}
      />
    ) : (
      <ReadOnlyField
        name={name}
        label={label}
        value={Array.isArray(staticSelected) ? staticSelected.join(', ') : staticSelected.name}
        vertical={vertical}
      />
    )
  }

  const selectProps = {
    items,
    label,
    placeholder,
    required,
    helpText,
    loading,
    searchable,
    noSort,
    error,
    activeLabel,
    addNew,
    vertical,
    none,
  }

  return control ? (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange, value}}) => (
        <ListBoxControl
          value={{id: value as string} as IFormSelectItem}
          onChange={(item?: IFormSelectItem) => {
            onChange(item?.id || null)

            if (onSelected) {
              onSelected(item)
            }
          }}
          {...selectProps}
        />
      )}
    />
  ) : (
    <ListBoxControl value={staticSelected} onChange={onSelected} {...selectProps} />
  )
}

export default FormSelect
