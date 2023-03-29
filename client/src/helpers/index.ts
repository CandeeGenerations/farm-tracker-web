import {AxiosError} from 'axios'
import dayjs from 'dayjs'
import {DEFAULT_DATE_FORMAT, DEFAULT_DATE_TIME_FORMAT} from './constants'

export const classNames = (...classes) => classes.filter(Boolean).join(' ')

export const generateString = (
  length = 6,
  includeUpperCharacters = false,
  includeSpecialCharacters = false,
): string => {
  let result = ''
  let characters = 'abcdefghijklmnopqrstuvwxyz'

  if (includeUpperCharacters) {
    characters = `${characters}ABCDEFGHIJKLMNOPQRSTUVWXYZ`
  }

  if (includeSpecialCharacters) {
    characters = `${characters}0123456789!@#$%^&*()_+-=[];",./{}|:<>?`
  }

  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length))
  }

  return result
}

// eslint-disable-next-line no-unused-vars
export function setPageState<T>(setState: (updates: T) => void, current: T, updates: T): T {
  const newState = {...current, ...updates}

  setState(newState)

  return newState
}

export const applySort = (sort: {column: string; asc: boolean}, dataset: any) =>
  dataset.slice().sort((a, b) =>
    ((sort.asc ? a : b)[sort.column] || '').toString().localeCompare((sort.asc ? b : a)[sort.column] || '', undefined, {
      numeric: true,
    }),
  )

export const formatInputDate = (date?: string): string => (date ? dayjs(date).format('YYYY-MM-DD') : undefined)

export const formatDate = (date?: string): string => (date ? dayjs(date).format(DEFAULT_DATE_FORMAT) : undefined)

export const formatDateTime = (dateTime?: string): string =>
  dateTime ? dayjs(dateTime).format(DEFAULT_DATE_TIME_FORMAT) : undefined

export const getErrorMessage = e => ((e as AxiosError).response.data as {error: string}).error

export const addCommas = (num: number, fixed: number = 2): string =>
  num
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
