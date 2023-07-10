import Alert from '@/components/Alert'
import Button from '@/components/Button'
import DatePicker from '@/components/DatePicker'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import {Modal, ModalBody, ModalFooter} from '@/components/Modal'
import ReadOnlyField from '@/components/ReadOnlyField'
import {setPageState} from '@/helpers'
import {LAST_LOGGED_PRODUCT_ID} from '@/helpers/constants'
import {Breed} from '@/types/animal'
import {ILoggedProduct} from '@/types/loggedProduct'
import {IProduct} from '@/types/product'
import {Dialog} from '@headlessui/react'
import {CheckIcon} from '@heroicons/react/24/outline'
import {yupResolver} from '@hookform/resolvers/yup'
import dayjs from 'dayjs'
import React, {useEffect, useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import * as yup from 'yup'

interface ILogProductModal {
  products: IProduct[]
  dbBreeds: Breed[]
  loggedProduct?: ILoggedProduct
  errorMessage?: string
  open: boolean
  onClose: () => void
  // eslint-disable-next-line no-unused-vars
  onDelete?: (id: string) => void
  // eslint-disable-next-line no-unused-vars
  onSubmit: (loggedProduct: ILoggedProduct) => void
}

interface IPageState {
  logSuccessful?: boolean
}

const LogProductModal = ({
  products,
  dbBreeds,
  loggedProduct,
  errorMessage,
  open,
  onClose,
  onDelete,
  onSubmit,
}: ILogProductModal): React.ReactElement => {
  const [pageState, stateFunc] = useState<IPageState>({
    logSuccessful: false,
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const defaultValues = {
    productId: '',
    logDate: dayjs().format(),
    quantity: 1,
    species: '',
    breed: '',
  }

  const {handleSubmit, register, control, formState, setFocus, reset, watch, setValue} = useForm<ILoggedProduct>({
    defaultValues: loggedProduct || defaultValues,
    mode: 'onChange',
    // @ts-ignore
    resolver: yupResolver(
      yup.object().shape({
        quantity: yup
          .number()
          .typeError('Quantity must be a positive number')
          .positive('Quantity must be a positive number')
          .required(),
        logDate: yup.string().required().label('Log date'),
      }),
    ),
  })

  const productId = watch('productId')
  const species = watch('species')

  const submitHandler: SubmitHandler<ILoggedProduct> = async data => {
    await onSubmit(data)

    localStorage.setItem(LAST_LOGGED_PRODUCT_ID, data.productId.toString())
    reset({
      ...defaultValues,
      productId: data.productId,
      species: products.find(x => x.id === data.productId)?.species || '',
    })
    setState({logSuccessful: !loggedProduct?.id})
  }

  useEffect(() => {
    setValue('species', products?.find(x => x.id === productId)?.species || '')
  }, [productId])

  useEffect(() => {
    let timeout

    if (pageState.logSuccessful) {
      timeout = setTimeout(() => {
        setState({logSuccessful: false})
      }, 4000)
    }

    return () => clearTimeout(timeout)
  }, [pageState.logSuccessful])

  useEffect(() => {
    if (!open) return

    const storedProductId = loggedProduct?.productId || localStorage.getItem(LAST_LOGGED_PRODUCT_ID) || products[0]?.id

    reset({
      ...(loggedProduct || defaultValues),
      productId: storedProductId || '',
      species: products?.find(x => x.id === storedProductId)?.species || '',
    })

    const timeout = setTimeout(() => {
      setFocus('quantity')
    }, 50)

    return () => clearTimeout(timeout)
  }, [open])

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody notFlex className="sm:my-8 px-4 pt-5 pb-4 mx-4">
        <div className="mt-3 text-center sm:mt-0 sm:text-left">
          <Dialog.Title as="h3" className="text-2xl leading-6 font-light text-muted-dark">
            {loggedProduct ? 'Update logged product' : 'Log a product'}
          </Dialog.Title>

          {errorMessage && <Alert type="danger" message={errorMessage} className="mt-5" />}

          <form
            onSubmit={e => {
              e.preventDefault()
              handleSubmit(submitHandler)()
            }}
          >
            <div className="mt-5 space-y-6">
              {loggedProduct ? (
                <ReadOnlyField name="product" label="Product" value={products?.find(x => x.id === productId)?.name} />
              ) : (
                <FormSelect
                  vertical
                  label="Product"
                  name="productId"
                  control={control}
                  required
                  error={formState.errors.productId}
                  helpText="This is the product to be logged"
                  items={products?.map(({id, name}) => ({id, name}))}
                />
              )}

              <FormInput
                label="Quantity"
                name="quantity"
                register={register}
                control={control}
                required
                vertical
                post={products?.find(x => x.id === productId)?.unit}
                error={formState.errors.quantity}
                helpText="This is amount of the product to log"
              />

              <DatePicker
                label="Log date"
                error={formState.errors.logDate}
                helpText="This is the date the product was logged"
                control={control}
                name="logDate"
                vertical
              />

              <FormSelect
                label="Breed"
                name="breed"
                none
                vertical
                control={control}
                error={formState.errors.breed}
                helpText="This is the breed of the animal"
                items={species ? dbBreeds.filter(x => x.species === species)?.map(({name}) => ({id: name, name})) : []}
              />
            </div>
          </form>
        </div>
      </ModalBody>

      <ModalFooter
        onClose={onClose}
        onDelete={loggedProduct?.id && onDelete ? () => onDelete(loggedProduct.id) : undefined}
        loading={formState.isSubmitting}
        closeText="Close"
        successText={
          pageState.logSuccessful && (
            <p className="text-primary flex items-center">
              <CheckIcon className="h-5 w-5 mr-2" /> Logged successfully!
            </p>
          )
        }
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

export default LogProductModal
