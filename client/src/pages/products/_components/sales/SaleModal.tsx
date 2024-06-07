import Alert from '@/components/Alert'
import Button from '@/components/Button'
import DatePicker from '@/components/DatePicker'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import {Modal, ModalBody, ModalFooter} from '@/components/Modal'
import ReadOnlyField from '@/components/ReadOnlyField'
import {IProduct} from '@/types/product'
import {ISale} from '@/types/sale'
import {Dialog} from '@headlessui/react'
import {yupResolver} from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import React, {useEffect} from 'react'
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form'
import * as yup from 'yup'

interface ISaleModal {
  sale?: ISale
  products?: IProduct[]
  errorMessage?: string
  open: boolean
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onDelete: (id: string) => void
  // eslint-disable-next-line no-unused-vars
  onSubmit: (sale: ISale) => void
  isProductSales: boolean
}

const defaultValues = {
  amount: 0,
  saleDate: dayjs().format(),
}

const SaleModal = ({
  sale,
  products,
  errorMessage,
  open,
  onClose,
  onDelete,
  onSubmit,
  isProductSales,
}: ISaleModal): React.ReactElement => {
  const {handleSubmit, register, control, formState, setFocus, reset} = useForm<ISale>({
    defaultValues: sale || defaultValues,
    mode: 'onChange',
    // @ts-ignore
    resolver: yupResolver(
      yup.object().shape({
        amount: yup.number().typeError('Cost must be a dollar amount'),
        quantity: yup
          .number()
          .typeError('Quantity must be a positive number')
          .positive('Quantity must be a positive number')
          .required(),
        saleDate: yup.string().required().label('Sale date'),
      }),
    ),
  })

  const submitHandler: SubmitHandler<FieldValues> = async (data: ISale) => onSubmit(data)

  useEffect(() => {
    if (!open) return

    reset(sale || defaultValues)

    const timeout = setTimeout(() => {
      setFocus('saleDate')
    }, 50)

    return () => clearTimeout(timeout)
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody notFlex className="sm:my-8 px-4 pt-5 pb-4 mx-4">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark">
            {sale ? 'Update sale' : 'Add a new sale'}
          </Dialog.Title>

          {errorMessage && <Alert type="danger" message={errorMessage} className="mt-5" />}

          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit(submitHandler)()
            }}
          >
            <div className="mt-5 space-y-6">
              {isProductSales ? (
                <ReadOnlyField
                  name="product"
                  label="Product"
                  value={products?.find(x => x.id === sale?.productId)?.name}
                />
              ) : (
                <FormSelect
                  vertical
                  label="Product"
                  name="productId"
                  control={control}
                  required
                  error={formState.errors.productId}
                  helpText="This is the product that was sold"
                  items={products?.map(({id, name}) => ({id, name}))}
                />
              )}

              <DatePicker
                label="Sale date"
                error={formState.errors.saleDate}
                helpText="This is the date of the sale"
                control={control}
                name="saleDate"
                vertical
              />

              <FormInput
                label="Quantity"
                name="quantity"
                register={register}
                control={control}
                required
                vertical
                error={formState.errors.quantity}
                helpText="This is number of products sold"
              />

              <FormInput
                label="Sale Amount"
                pre="$"
                name="amount"
                register={register}
                control={control}
                required
                vertical
                error={formState.errors.amount}
                helpText="This is the total amount received for the sale"
              />
            </div>
          </form>
        </div>
      </ModalBody>

      <ModalFooter
        onClose={onClose}
        onDelete={sale ? () => onDelete(sale.id) : undefined}
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

export default SaleModal
