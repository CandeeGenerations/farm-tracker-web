import Alert from '@/components/Alert'
import Card from '@/components/Card'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import {setPageState} from '@/helpers'
import {IProduct} from '@/pages/api/_morphs/product.morph'
import {ProductMetadata} from '@/types'
import {yupResolver} from '@hookform/resolvers/yup'
import {useRouter} from 'next/router'
import React, {useState} from 'react'
import {SubmitHandler, useForm} from 'react-hook-form'
import * as yup from 'yup'

interface IPageState {
  species?: string[]
  showDeleteModal?: boolean
  deleteModalLoading?: boolean
}

interface IProductForm {
  product?: IProduct
  metadata: ProductMetadata
  errorMessage?: string
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: IProduct) => void
  // eslint-disable-next-line no-unused-vars
  onDelete?: (id: string) => void
}

const unitTypes = [
  {id: 'count', name: 'Count'},
  {id: 'lb', name: 'Pounds (lb)'},
  {id: 'oz', name: 'Ounces (oz)'},
]

const ProductForm = ({product, metadata, errorMessage, onSubmit, onDelete}: IProductForm): React.ReactElement => {
  const {back} = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    species: metadata?.dbSpecies || [],
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const {formState, control, register, handleSubmit} = useForm<IProduct>({
    defaultValues: product || {},
    mode: 'onChange',
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required().label('Name'),
        species: yup.string().required().label('Species'),
        unit: yup.string().required().label('Unit'),
      }),
    ),
  })

  const submitHandler: SubmitHandler<IProduct> = async data => onSubmit(data)

  const handleShowDeleteModal = () => setState({showDeleteModal: true})

  const handleCloseDeleteModal = () => setState({showDeleteModal: false})

  const handleDelete = async () => {
    setState({deleteModalLoading: true})
    await onDelete(product.id)
  }

  return (
    <>
      <Card
        onBack={back}
        onSubmit={handleSubmit(submitHandler)}
        onDelete={product && handleShowDeleteModal}
        loading={formState.isSubmitting}
        submitEnabled={formState.isValid}
        className="mt-6"
      >
        <div className="space-y-6 sm:pb-5">
          {errorMessage && <Alert type="danger" message={errorMessage} />}

          <div className="space-y-6 divide-y divide-muted-light">
            {product?.id && (
              <FormInput label="Product Key" name="productKey" readOnly register={register} control={control} />
            )}

            <FormInput
              label="Name"
              name="name"
              register={register}
              control={control}
              required
              error={formState.errors.name}
              helpText="This is the name of the product"
            />

            <FormSelect
              label="Species"
              name="species"
              required
              control={control}
              error={formState.errors.species}
              helpText="This is the species of animal that produces this product"
              items={pageState.species.map(name => ({id: name, name}))}
            />

            <FormSelect
              label="Unit"
              name="unit"
              required
              control={control}
              error={formState.errors.unit}
              helpText="This is the unit type for the product"
              items={unitTypes.map(({id, name}) => ({id, name}))}
            />
          </div>
        </div>
      </Card>

      <ConfirmDeleteModal
        type="product"
        open={pageState.showDeleteModal}
        loading={pageState.deleteModalLoading}
        onClose={handleCloseDeleteModal}
        onDelete={handleDelete}
      />
    </>
  )
}

export default ProductForm
