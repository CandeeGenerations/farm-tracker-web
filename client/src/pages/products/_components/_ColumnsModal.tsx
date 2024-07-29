import Button from '@/components/Button'
import FormLabel from '@/components/FormLabel'
import {Modal, ModalBody, ModalFooter} from '@/components/Modal'
import {IColumnHeader} from '@/components/Table'
import Toggle from '@/components/Toggle'
import {setPageState} from '@/helpers'
import * as storage from '@/helpers/localStorage'
import {Dialog} from '@headlessui/react'
import {sentenceCase} from 'change-case-all'
import React, {useEffect, useState} from 'react'

interface IColumn extends IColumnHeader {
  enabled: boolean
}

interface IPageState {
  columns: IColumn[]
}

interface IColumnsModal {
  storageKey: string
  open: boolean
  onClose: () => void
  columns: IColumn[]
}

const ColumnsModal = ({storageKey, columns, open, onClose}: IColumnsModal): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    columns: [],
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    if (open) {
      const storedColumnsString = storage.get(storageKey)
      const storedColumns: string[] = storedColumnsString ? storedColumnsString.split(',') : []

      setState({
        columns: storedColumns.length > 0 ? columns.map(x => ({...x, enabled: storedColumns.includes(x.id)})) : columns,
      })
    }
  }, [open])

  const handleToggle = (id: string, value: boolean) =>
    setState({columns: pageState.columns.map(x => (x.id === id ? {...x, enabled: value} : x))})

  const handleSubmit = () => {
    storage.set(
      storageKey,
      pageState.columns
        .filter(x => x.enabled)
        .map(x => x.id)
        .join(','),
    )
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody notFlex className="sm:my-8 px-4 pt-5 pb-4 mx-4">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark mb-5">
            Show/Hide Columns
          </Dialog.Title>

          <div className="sm:space-y-2 space-y-4">
            {pageState.columns.map(x => (
              <div className="flex flex-col sm:flex-row">
                <FormLabel noTopPadding name={x.id} className="flex-1 sm:mb-0 mb-3">
                  {sentenceCase(x.name)}:
                </FormLabel>

                <Toggle
                  enabled={x.enabled}
                  setEnabled={value => handleToggle(x.id, value)}
                  onLabel="Show"
                  offLabel="Hide"
                />
              </div>
            ))}
          </div>
        </div>
      </ModalBody>

      <ModalFooter onClose={onClose}>
        <Button onClick={handleSubmit} type="primary">
          Save
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ColumnsModal
