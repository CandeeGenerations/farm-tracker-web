import {Dialog} from '@headlessui/react'
import {CheckCircleIcon} from '@heroicons/react/24/outline'
import Papa from 'papaparse'
import React, {useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import {classNames, setPageState} from '@/helpers'
import Alert from './Alert'
import Button from './Button'
import Card from './Card'
import FormUpload from './FormUpload'
import {Modal, ModalBody, ModalFooter} from './Modal'

interface IPageState {
  uploadError?: string
  resetUpload?: number
  uploading?: boolean
  doneUploading?: boolean
}

interface IImportModal {
  type: string
  headers: string[]
  metadata?: {[key: string]: string}
  open: boolean
  onClose: () => void
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-explicit-any
  onSave: (data: any[]) => void
  notReloading?: boolean
}

const ImportModal = ({
  type,
  headers,
  metadata = {},
  open,
  onClose,
  onSave,
  notReloading = false,
}: IImportModal): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    resetUpload: 0,
    uploading: false,
    doneUploading: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const {handleSubmit, reset, control, setValue} = useForm<{fileData: File}>({
    defaultValues: {
      fileData: undefined,
    },
  })

  const submitHandler: SubmitHandler<{fileData: File}> = async ({fileData}) => {
    setState({
      uploadError: undefined,
    })

    if (!fileData) {
      setState({uploadError: 'Please select a file to upload'})
      return
    }

    setState({uploading: true})

    const {data} = Papa.parse(await fileData.text(), {
      header: true,
      delimiter: ',',
      transform: (value: string) => (value === 'NULL' || value === '' ? null : value),
    })

    await onSave(data)

    reset({fileData: null})

    setState({
      uploading: false,
      resetUpload: pageState.resetUpload + 1,
      uploadError: undefined,
      doneUploading: true,
    })

    if (notReloading) {
      setTimeout(() => {
        onClose()
      }, 1000)
    }
  }

  useEffect(() => {
    if (open) {
      setState({doneUploading: false})
    }
  }, [open])

  return (
    <Modal open={open} onClose={onClose} size="large">
      {pageState.doneUploading ? (
        <ModalBody notFlex className="sm:my-8 px-4 pt-5 pb-4 mx-4 text-center">
          <CheckCircleIcon className="text-primary h-24 w-24 m-auto my-5" />

          <div className="text-3xl text-primary">Upload successful</div>

          {!notReloading && <div className="text-md text-primary-medium mt-5">Reloading data...</div>}
        </ModalBody>
      ) : (
        <>
          <ModalBody notFlex className="sm:my-8 px-4 pt-5 pb-4 mx-4">
            <div className="mt-3 text-center sm:mt-0 sm:text-left">
              <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark mb-5">
                Import {type}
              </Dialog.Title>

              <p>To begin importing, create a CSV file that has the following column headers:</p>

              <Card noPadding className="mt-4 mb-8">
                <div className="space-y-0">
                  <div className="overflow-y-auto">
                    <table className="min-w-full divide-y divide-muted-light">
                      <thead className="bg-muted-lightest">
                        <tr>
                          {headers.map((header, index) => (
                            <th
                              key={index}
                              scope="col"
                              className={classNames(
                                'px-6 py-3 text-left font-medium text-muted tracking-wider',
                                index < headers.length - 1 && 'border-r border-muted-light',
                              )}
                            >
                              <div className="flex">
                                <div className="flex-grow">{header}</div>
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>

                      <tbody className="bg-white divide-y divide-muted-light">
                        <tr>
                          {headers.map((header, index) => (
                            <td key={index} className="px-6 py-4 whitespace-nowrap text-muted">
                              {metadata[header] || '...'}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </Card>

              {pageState.uploadError && <Alert type="danger" message={pageState.uploadError} className="mt-5" />}

              <FormUpload
                reset={pageState.resetUpload}
                required
                control={control}
                setValue={setValue}
                name="fileData"
                label="Import file"
                fileTypes="CSV"
                accept={{'text/csv': ['.csv']}}
              />
            </div>
          </ModalBody>

          <ModalFooter onClose={onClose} loading={pageState.uploading}>
            <Button onClick={handleSubmit(submitHandler)} type="primary" loading={pageState.uploading}>
              Import
            </Button>
          </ModalFooter>
        </>
      )}
    </Modal>
  )
}

export default ImportModal
