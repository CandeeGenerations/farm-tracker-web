import {classNames, setPageState} from '@/helpers'
import {LOADER_TIMEOUT} from '@/helpers/constants'
import {sentenceCase} from 'change-case'
import React, {useEffect, useState} from 'react'
import Alert from './Alert'
import Button from './Button'

interface ICard {
  title?: React.ReactNode
  subtitle?: string
  error?: string
  onSubmit?: () => void
  onBack?: () => void
  onDelete?: () => void
  loading?: boolean
  children?: React.ReactNode
  submitEnabled?: boolean
  noPadding?: boolean
  bottomMargin?: boolean
  submitText?: string
  fullHeight?: boolean
  className?: string
  cardClassName?: string
  noSpace?: boolean
  loadingKey?: boolean
  loader?: React.ReactNode
}

interface IPageState {
  loading?: boolean
}

const Card = ({
  title,
  subtitle,
  error,
  children,
  onSubmit,
  onDelete,
  onBack,
  className,
  cardClassName,
  loadingKey,
  loader,
  loading = false,
  submitEnabled = true,
  noPadding = false,
  bottomMargin = false,
  submitText = 'Save',
  fullHeight = false,
  noSpace = false,
}: ICard): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    loading: false,
  })

  useEffect(() => {
    if (loadingKey !== undefined) {
      setState({loading: true})

      const timeout = setTimeout(() => {
        setState({loading: false})
      }, LOADER_TIMEOUT)

      return () => {
        clearTimeout(timeout)
      }
    }
  }, [loadingKey])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  return pageState.loading ? (
    <>{loader}</>
  ) : (
    <div className={classNames(bottomMargin ? 'mb-3' : '', fullHeight ? 'h-full' : '', className)}>
      <div
        className={classNames(
          'bg-white border border-muted-light shadow',
          noSpace ? '' : 'space-y-6',
          onSubmit ? 'rounded-t' : 'rounded',
          noPadding ? '' : 'py-6 px-4 sm:p-6',
          fullHeight ? 'h-full' : '',
          cardClassName,
        )}
      >
        {error && <Alert message={error} />}

        {(title || subtitle) && (
          <div className="border-b border-muted-light pb-5">
            {title && <h3 className="text-lg leading-6 font-medium text-muted-dark">{title}</h3>}

            {subtitle && <p className="mt-1 text-muted">{sentenceCase(subtitle)}</p>}
          </div>
        )}

        {children}
      </div>

      {(onSubmit || onBack) && (
        <div className="px-4 py-3 border border-t-0 border-muted-light shadow rounded-b bg-muted-lightest sm:px-6 flex">
          <div className="flex-1">
            {onDelete && (
              <Button type="danger" outline onClick={onDelete} disabled={loading}>
                Delete
              </Button>
            )}
          </div>

          <div>
            {onBack && (
              <Button type="default" onClick={onBack} disabled={loading} className="mr-4">
                Back
              </Button>
            )}

            {onSubmit && (
              <Button disabled={!submitEnabled} loading={loading} type="primary" onClick={onSubmit}>
                {submitText}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Card
