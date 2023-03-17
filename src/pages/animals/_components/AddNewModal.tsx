import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import {Modal, ModalBody, ModalFooter} from '@/components/Modal'
import {Dialog} from '@headlessui/react'
import {yupResolver} from '@hookform/resolvers/yup'
import React, {useEffect} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import * as yup from 'yup'

interface IAddNewModal {
  newType: string
  open: boolean
  onClose: () => void
  onSubmit: (name: string) => void
}

const AddNewModal = ({newType, open, onClose, onSubmit}: IAddNewModal): React.ReactElement => {
  const {handleSubmit, register, control, formState, setValue, setFocus} = useForm<{name: string}>({
    defaultValues: {
      name: '',
    },
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required().label('Name'),
      }),
    ),
  })

  const submitHandler: SubmitHandler<{name: string}> = async data => onSubmit(data.name)

  useEffect(() => {
    if (!open) return

    setValue('name', '')

    const timeout = setTimeout(() => {
      setFocus('name')
    }, 50)

    return () => clearTimeout(timeout)
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody notFlex className="sm:my-8 px-4 pt-5 pb-4 mx-4">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark">
            Add a new {newType}
          </Dialog.Title>

          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit(submitHandler)()
            }}
          >
            <div className="mt-5">
              <FormInput
                label="Name"
                name="name"
                register={register}
                control={control}
                required
                vertical
                error={formState.errors.name}
                helpText={`This is the name of the ${newType}`}
              />
            </div>
          </form>
        </div>
      </ModalBody>

      <ModalFooter onClose={onClose}>
        <Button disabled={!formState.isValid} onClick={handleSubmit(submitHandler)} type="primary">
          Save
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default AddNewModal
