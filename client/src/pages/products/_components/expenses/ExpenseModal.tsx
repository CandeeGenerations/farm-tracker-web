import Alert from '@/components/Alert'
import Button from '@/components/Button'
import DatePicker from '@/components/DatePicker'
import FormInput from '@/components/FormInput'
import {Modal, ModalBody, ModalFooter} from '@/components/Modal'
import {IExpense} from '@/types/expense'
import {Dialog} from '@headlessui/react'
import {yupResolver} from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import React, {useEffect} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import * as yup from 'yup'

interface IExpenseModal {
  expense?: IExpense
  errorMessage?: string
  open: boolean
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void
  // eslint-disable-next-line no-unused-vars
  onSubmit: (expense: IExpense) => void
}

const defaultValues = {
  item: '',
  purchaseDate: dayjs().format(),
  quantity: 1,
}

const ExpenseModal = ({
  expense,
  errorMessage,
  open,
  onClose,
  onDelete,
  onSubmit,
}: IExpenseModal): React.ReactElement => {
  const {handleSubmit, register, control, formState, setFocus, reset} = useForm<IExpense>({
    defaultValues: expense || defaultValues,
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        item: yup.string().required().label('Item'),
        amount: yup
          .number()
          .typeError('Cost must be a dollar amount')
          .positive('Cost must be a dollar amount')
          .required(),
        quantity: yup
          .number()
          .typeError('Quantity must be a positive number')
          .positive('Quantity must be a positive number')
          .required(),
        purchaseDate: yup.string().required().label('Purchase date'),
      }),
    ),
  })

  const submitHandler: SubmitHandler<IExpense> = async data => onSubmit(data)

  useEffect(() => {
    if (!open) return

    reset(expense || defaultValues)

    const timeout = setTimeout(() => {
      setFocus('item')
    }, 50)

    return () => clearTimeout(timeout)
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody notFlex className="sm:my-8 px-4 pt-5 pb-4 mx-4">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark">
            {expense ? 'Update expense' : 'Add a new expense'}
          </Dialog.Title>

          {errorMessage && <Alert type="danger" message={errorMessage} className="mt-5" />}

          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit(submitHandler)()
            }}
          >
            <div className="mt-5 space-y-6">
              <FormInput
                label="Item"
                name="item"
                register={register}
                control={control}
                required
                vertical
                error={formState.errors.item}
                helpText="This is the item that was purchased"
              />

              <FormInput
                label="Cost per item"
                pre="$"
                name="amount"
                register={register}
                control={control}
                required
                vertical
                error={formState.errors.amount}
                helpText="This is the amount paid for the item"
              />

              <FormInput
                label="Quantity"
                name="quantity"
                register={register}
                control={control}
                required
                vertical
                error={formState.errors.quantity}
                helpText="This is number of items purchased"
              />

              <DatePicker
                label="Purchase date"
                error={formState.errors.purchaseDate}
                helpText="This is the date the item was purchased"
                control={control}
                name="purchaseDate"
                vertical
              />
            </div>
          </form>
        </div>
      </ModalBody>

      <ModalFooter
        onClose={onClose}
        onDelete={expense ? () => onDelete(expense.id) : undefined}
        loading={formState.isSubmitting}
      >
        <Button
          disabled={!formState.isValid}
          onClick={handleSubmit(submitHandler)}
          type="primary"
          loading={formState.isSubmitting}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default ExpenseModal
