import Alert from '@/components/Alert'
import Button from '@/components/Button'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import {Modal, ModalBody, ModalFooter} from '@/components/Modal'
import ReadOnlyField from '@/components/ReadOnlyField'
import {DatePicker} from '@/components/shadcn/Form'
import {Form} from '@/components/shadcn/ui/form'
import {getForm, requiredString} from '@/helpers'
import {IProduct} from '@/types/product'
import {ISale} from '@/types/sale'
import {Dialog} from '@headlessui/react'
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
  const form = useForm<ISale>(
    // @ts-ignore
    getForm<ISale>(
      undefined,
      yup.object().shape({
        amount: yup.number().typeError('Cost must be a dollar amount'),
        quantity: yup
          .number()
          .typeError('Quantity must be a positive number')
          .positive('Quantity must be a positive number')
          .required(),
        saleDate: requiredString('Sale date'),
      }),
      'onChange',
    ),
  )

  const submitHandler: SubmitHandler<FieldValues> = async (data: ISale) => onSubmit(data)

  useEffect(() => {
    if (!open) return

    form.reset(sale || defaultValues)

    const timeout = setTimeout(() => {
      form.setFocus('saleDate')
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

          <Form
            {...form}
            // onSubmit={(e) => {
            //   e.preventDefault()
            //   handleSubmit(submitHandler)()
            // }}
          >
            <div className="mt-5 space-y-6">
              {isProductSales ? (
                <ReadOnlyField
                  name="product"
                  label="Product"
                  value={products?.find((x) => x.id === sale?.productId)?.name}
                />
              ) : (
                <FormSelect
                  vertical
                  label="Product"
                  name="productId"
                  control={form.control}
                  required
                  error={form.formState.errors.productId}
                  helpText="This is the product that was sold"
                  items={products?.map(({id, name}) => ({id, name}))}
                />
              )}

              <DatePicker
                label="Sale date"
                helpText="This is the date of the sale"
                control={form.control}
                name="saleDate"
              />

              <FormInput
                label="Customer Name"
                name="customerName"
                register={form.register}
                control={form.control}
                vertical
                helpText="This is the name of the customer"
              />

              <FormInput
                label="Quantity"
                name="quantity"
                register={form.register}
                control={form.control}
                required
                vertical
                error={form.formState.errors.quantity}
                helpText="This is number of products sold"
              />

              <FormInput
                label="Sale Amount"
                pre="$"
                name="amount"
                register={form.register}
                control={form.control}
                required
                vertical
                error={form.formState.errors.amount}
                helpText="This is the total amount received for the sale"
              />

              <FormInput
                label="Notes"
                name="notes"
                register={form.register}
                control={form.control}
                vertical
                type="textarea"
                helpText="Any additional notes about the sale"
              />
            </div>
          </Form>
        </div>
      </ModalBody>

      <ModalFooter
        onClose={onClose}
        onDelete={sale ? () => onDelete(sale.id) : undefined}
        loading={form.formState.isSubmitting}
      >
        <Button
          disabled={!form.formState.isValid}
          onClick={form.handleSubmit(submitHandler)}
          type="primary"
          loading={form.formState.isSubmitting}
        >
          Save
        </Button>
      </ModalFooter>
    </Modal>
  )
}

export default SaleModal
