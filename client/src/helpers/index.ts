import {AxiosError} from 'axios'
import dayjs from 'dayjs'
import {DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT} from './constants'

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

// eslint-disable-next-line no-unused-vars
export function setPageState<T>(setState: (updates: T) => void, current: T, updates: T): T {
  const newState = {...current, ...updates}

  setState(newState)

  return newState
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const applySort = (sort: {column: string; asc: boolean}, dataset: any) => {
  return dataset.slice().sort((a, b) => {
    const valA = a[sort.column]
    const valB = b[sort.column]

    if (typeof valA === 'number' && typeof valB === 'number') {
      return sort.asc ? valA - valB : valB - valA
    }

    return ((sort.asc ? valA : valB) || '').toString().localeCompare((sort.asc ? valB : valA) || '', undefined, {
      numeric: true,
    })
  })
}

export const validEmail = (email: string): boolean =>
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email.toLowerCase().trim(),
  )

export const formatInputDate = (date?: string): string => (date ? dayjs(date).format('YYYY-MM-DD') : undefined)

export const formatDate = (date?: string): string => (date ? dayjs(date).format(DEFAULT_DATE_FORMAT) : undefined)

export const formatDateTime = (dateTime?: string): string =>
  dateTime ? dayjs(dateTime).format(DEFAULT_DATE_TIME_FORMAT) : undefined

export const getErrorMessage = e => ((e as AxiosError).response.data as {error: string}).error

export const addCommas = (num: number, fixed = 2): string =>
  (isNaN(num) ? 0 : num)
    .toFixed(fixed)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',')

export const getFileSize = (size: number): string => {
  if (size < 1000) {
    return `${size} bytes`
  }

  let computedSize = size / 1024

  if (computedSize < 1000) {
    return `${Math.ceil(computedSize)} kbs`
  }

  computedSize = computedSize / 1024

  if (computedSize < 1000) {
    return `${Math.ceil(computedSize)} mbs`
  }

  computedSize = computedSize / 1024

  if (computedSize < 1000) {
    return `${Math.ceil(computedSize)} gbs`
  }

  computedSize = computedSize / 1024

  if (computedSize < 1000) {
    return `${Math.ceil(computedSize)} tbs`
  }
}
