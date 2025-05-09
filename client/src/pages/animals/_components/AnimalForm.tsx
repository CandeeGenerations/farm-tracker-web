import Alert from '@/components/Alert'
import Card from '@/components/Card'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import FormToggle from '@/components/FormToggle'
import TagsInputComponent from '@/components/TagsInput'
import {DatePicker} from '@/components/shadcn/Form'
import {setPageState} from '@/helpers'
import {AnimalMetadata, Breed, DbAnimal, IAnimal} from '@/types/animal'
import {yupResolver} from '@hookform/resolvers/yup'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import {FieldValues, SubmitHandler, useForm} from 'react-hook-form'
import * as yup from 'yup'

import AddNewModal from './AddNewModal'

interface IPageState {
  newModalType?: string
  species?: string[]
  breeds?: Breed[]
  parents?: DbAnimal[]
  showDeleteModal?: boolean
  deleteModalLoading?: boolean
}

interface IAnimalForm {
  animal?: IAnimal
  metadata: AnimalMetadata
  errorMessage?: string
  // eslint-disable-next-line no-unused-vars
  onSubmit: (data: IAnimal) => void
  // eslint-disable-next-line no-unused-vars
  onDelete?: (id: string) => void
}

const AnimalForm = ({animal, metadata, errorMessage, onSubmit, onDelete}: IAnimalForm): React.ReactElement => {
  const {back} = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    species: metadata?.dbSpecies || [],
    breeds: metadata?.dbBreeds || [],
    parents: metadata?.dbAnimals || [],
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const {formState, reset, control, register, watch, setValue, getValues, handleSubmit, trigger} = useForm<IAnimal>({
    defaultValues: animal || {},
    mode: 'onChange',
    // @ts-ignore
    resolver: yupResolver(
      yup.object().shape({
        name: yup.string().required().label('Name'),
        species: yup.string().required().label('Species'),
        breed: yup.string().required().label('Breed'),
      }),
    ),
  })

  useEffect(() => {
    reset(animal || {})
  }, [animal])

  const deceased = watch('deceased')
  const sold = watch('sold')
  const species = watch('species')
  const breed = watch('breed')

  const submitHandler: SubmitHandler<FieldValues> = async (data: IAnimal) => onSubmit(data)

  const handleOpenNewModal = (newModalType: string) => setState({newModalType})

  const handleCloseNewModal = () => setState({newModalType: undefined})

  const handleSpeciesValidation = async (name: string) => {
    setValue(
      'breed',
      animal && pageState.breeds.filter((x) => x.species === name).some((x) => x.name === animal.breed)
        ? animal.breed
        : undefined,
    )
    setValue(
      'parentId',
      animal &&
        pageState.parents.filter((x) => x.species === name && x.breed === breed).some((x) => x.id === animal.parentId)
        ? animal.parentId
        : null,
    )
    await trigger('breed')
    await trigger('parentId')
  }

  const handleBreedValidation = async (name: string) => {
    setValue(
      'parentId',
      animal &&
        pageState.parents.filter((x) => x.species === species && x.breed === name).some((x) => x.id === animal.parentId)
        ? animal.parentId
        : null,
    )
    await trigger('parentId')
  }

  const handleAddNew = async (name: string) => {
    let newItem = name.trim()
    const stateUpdate: IPageState = {
      newModalType: undefined,
    }

    if (pageState.newModalType === 'species') {
      if (!pageState.species.map((x) => x.toLowerCase().trim()).includes(newItem.toLowerCase())) {
        stateUpdate.species = [...pageState.species, newItem]
      } else {
        newItem = pageState.species.find((x) => x.toLowerCase().trim() === newItem.toLowerCase())
      }

      setState(stateUpdate)
      setValue('species', newItem)
      await trigger('species')
      await handleSpeciesValidation(name)
    } else if (pageState.newModalType === 'breed') {
      if (!pageState.breeds.map((x) => x.name.toLowerCase().trim()).includes(newItem.toLowerCase())) {
        stateUpdate.breeds = [
          ...pageState.breeds,
          {
            name: newItem,
            species: getValues('species'),
          },
        ]
      } else {
        const existingBreed = pageState.breeds.find((x) => x.name.toLowerCase().trim() === newItem.toLowerCase())

        if (existingBreed) {
          newItem = existingBreed.name
        }
      }

      setState(stateUpdate)
      setValue('breed', newItem)
      await trigger('breed')
      await handleBreedValidation(name)
    }
  }

  const handleShowDeleteModal = () => setState({showDeleteModal: true})

  const handleCloseDeleteModal = () => setState({showDeleteModal: false})

  const handleDelete = async () => {
    setState({deleteModalLoading: true})
    await onDelete(animal.id)
  }

  const values = {
    tags: watch('tags') || [],
  }

  const handleAddTag = (tag, name) => setValue(name, [...values[name], tag.text])

  const handleDeleteTag = (i, name) =>
    setValue(
      name,
      values[name].filter((_, index) => index !== i),
    )

  const handleEditTag = (item, index, name) =>
    setValue(name, [...values[name].filter((_, i) => i !== index), item.text])

  return (
    <>
      <Card
        onBack={back}
        onSubmit={handleSubmit(submitHandler)}
        onDelete={animal && handleShowDeleteModal}
        loading={formState.isSubmitting}
        submitEnabled={formState.isValid}
        className="mt-6"
      >
        <div className="space-y-6 sm:pb-5">
          {errorMessage && <Alert type="danger" message={errorMessage} />}

          <div className="space-y-6 divide-y divide-muted-light">
            <FormInput
              label="Name"
              name="name"
              register={register}
              control={control}
              required
              error={formState.errors.name}
              helpText="This is the name of the animal"
            />

            <FormSelect
              label="Species"
              name="species"
              required
              addNew={() => handleOpenNewModal('species')}
              control={control}
              error={formState.errors.species}
              helpText="This is the species of the animal"
              items={pageState.species.map((name) => ({id: name, name}))}
              onSelected={(item) => handleSpeciesValidation(item.name)}
            />

            {species && (
              <>
                <FormSelect
                  label="Breed"
                  name="breed"
                  required
                  addNew={() => handleOpenNewModal('breed')}
                  control={control}
                  error={formState.errors.breed}
                  helpText="This is the breed of the animal"
                  items={
                    species
                      ? pageState.breeds.filter((x) => x.species === species).map(({name}) => ({id: name, name}))
                      : []
                  }
                  onSelected={(item) => handleBreedValidation(item.name)}
                />

                {breed && metadata.dbAnimals.length > 0 && (
                  <FormSelect
                    label="Parent"
                    name="parentId"
                    control={control}
                    helpText="This is the parent of the animal"
                    items={
                      species && breed
                        ? pageState.parents
                            .filter((x) => x.species === species && x.breed === breed)
                            .map((x) => ({id: x.id, name: x.name}))
                        : []
                    }
                    none
                  />
                )}
              </>
            )}

            <FormInput
              label="Temperament"
              name="temperament"
              register={register}
              control={control}
              helpText="This is the temperament of the animal"
            />

            <DatePicker
              label="Birthdate"
              helpText="This is the date the animal was born"
              control={control}
              name="birthDate"
            />

            <TagsInputComponent
              label="Tags"
              placeholder="tag"
              tags={values.tags.map((field, index) => ({
                id: index.toString(),
                text: field,
              }))}
              onAdd={(tag) => handleAddTag(tag, 'tags')}
              onDelete={(i) => handleDeleteTag(i, 'tags')}
              onEdit={(item, index) => handleEditTag(item, index, 'tags')}
            />

            <FormToggle label="Deceased?" onLabel="Yes" offLabel="No" name="deceased" control={control} />

            {deceased && (
              <DatePicker
                label="Deceased Date"
                helpText="This is the date the animal died"
                control={control}
                name="deceasedDate"
              />
            )}

            <FormToggle label="Sold?" onLabel="Yes" offLabel="No" name="sold" control={control} />

            {sold && (
              <DatePicker
                label="Sale Date"
                helpText="This is the date the animal was sold"
                control={control}
                name="saleDate"
              />
            )}
          </div>
        </div>
      </Card>

      <AddNewModal
        newType={pageState.newModalType}
        open={pageState.newModalType !== undefined}
        onClose={handleCloseNewModal}
        onSubmit={handleAddNew}
      />

      <ConfirmDeleteModal
        type="animal"
        open={pageState.showDeleteModal}
        loading={pageState.deleteModalLoading}
        onClose={handleCloseDeleteModal}
        onDelete={handleDelete}
      />
    </>
  )
}

export default AnimalForm
