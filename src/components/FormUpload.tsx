import {getFileSize, setPageState} from '@/helpers'
import {ArrowUpTrayIcon, DocumentTextIcon, XMarkIcon} from '@heroicons/react/24/outline'
import React, {useEffect, useState} from 'react'
import {Accept, useDropzone} from 'react-dropzone'
import {Control, Controller, UseFormSetValue} from 'react-hook-form'

interface IFormUpload {
  name: string
  label?: string
  fileTypes?: string
  required?: boolean
  maxSize?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: Control<any, Object>
  reset: number
  accept?: Accept
  setValue?: UseFormSetValue<any>
  alert?: React.ReactElement
}

interface IPageState {
  dragClass?: string
  acceptedFiles?: File[]
  changeFunc?: () => void
}

const FormUpload = ({
  name,
  control,
  required,
  label,
  setValue,
  fileTypes = 'Any',
  maxSize = '10MB',
  reset = 0,
  accept = {'application/json': ['.json']},
  alert,
}: IFormUpload): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    dragClass: '',
    acceptedFiles: [],
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const {getRootProps, getInputProps} = useDropzone({
    accept,
    maxFiles: 1,
    multiple: false,
    maxSize: 10485760, // 10MB
    onDragEnter: () => setState({dragClass: 'border-secondary-medium'}),
    onDragLeave: () => setState({dragClass: ''}),
    onDropAccepted: (acceptedFiles: File[]) => {
      setState({acceptedFiles})
      if (setValue) {
        setValue('fileData', acceptedFiles[0])
      }
    },
  })

  useEffect(() => {
    setState({acceptedFiles: []})
  }, [reset])

  return (
    <Controller
      control={control}
      name={name}
      render={() => (
        <div>
          {label && (
            <label className="block font-bold text-muted-medium">
              {label}
              {required && <span className="ml-1 text-danger-medium">*</span>}
            </label>
          )}

          {alert}

          {pageState.acceptedFiles.length > 0 ? (
            <div className="mt-2">
              {pageState.acceptedFiles.map((file, i) => (
                <div key={i} className="flex items-center">
                  <DocumentTextIcon className="h-5 w-5 text-muted-medium" />

                  <p className="ml-2 text-muted-dark">
                    {file.name} ({getFileSize(file.size)})
                  </p>

                  <XMarkIcon
                    className="ml-2 h-5 w-5 text-danger cursor-pointer"
                    onClick={() => {
                      const newFiles = [...pageState.acceptedFiles]

                      newFiles.splice(i, 1)
                      setState({acceptedFiles: newFiles})
                      setValue('fileData', '')
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div
              {...getRootProps({
                className: `${
                  pageState.dragClass || 'border-muted-light'
                } transition-all mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded cursor-pointer`,
              })}
            >
              <div className="space-y-1 text-center">
                <ArrowUpTrayIcon className="mx-auto mb-5 h-10 w-10 text-primary-medium" />

                <div className="flex text-sm text-muted-medium">
                  <label
                    htmlFor={name}
                    className="cursor-pointer relative cursor-pointer rounded text-primary hover:text-primary-medium focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                  >
                    <span>Upload a file</span>

                    <input {...getInputProps()} />
                  </label>

                  <p className="pl-1">or drag and drop</p>
                </div>

                <p className="text-xs override text-muted">
                  {fileTypes} file types up to {maxSize}
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    />
  )
}

export default FormUpload
