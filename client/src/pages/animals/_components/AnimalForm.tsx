import Alert from '@/components/Alert'
import Card from '@/components/Card'
import ConfirmDeleteModal from '@/components/ConfirmDeleteModal'
import FormInput from '@/components/FormInput'
import FormSelect from '@/components/FormSelect'
import FormToggle from '@/components/FormToggle'
import TagsInputComponent from '@/components/TagsInput'
import {DatePicker} from '@/components/shadcn/Form'
import {Form} from '@/components/shadcn/ui/form'
import {getForm, requiredString, setPageState} from '@/helpers'
import {AnimalMetadata, Breed, DbAnimal, IAnimal} from '@/types/animal'
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

  const form = useForm<IAnimal>( // @ts-ignore
    getForm<IAnimal>(
      undefined,
      yup.object().shape({
        name: requiredString('Name'),
        species: requiredString('Species'),
        breed: requiredString('Breed'),
      }),
      'onChange',
    ),
  )

  useEffect(() => {
    form.reset(animal || {})
  }, [animal])

  const deceased = form.watch('deceased')
  const sold = form.watch('sold')
  const species = form.watch('species')
  const breed = form.watch('breed')

  const submitHandler: SubmitHandler<FieldValues> = async (data: IAnimal) => onSubmit(data)

  const handleOpenNewModal = (newModalType: string) => setState({newModalType})

  const handleCloseNewModal = () => setState({newModalType: undefined})

  const handleSpeciesValidation = async (name: string) => {
    form.setValue(
      'breed',
      animal && pageState.breeds.filter((x) => x.species === name).some((x) => x.name === animal.breed)
        ? animal.breed
        : undefined,
    )
    form.setValue(
      'parentId',
      animal &&
        pageState.parents.filter((x) => x.species === name && x.breed === breed).some((x) => x.id === animal.parentId)
        ? animal.parentId
        : null,
    )
    form.trigger('breed')
    form.trigger('parentId')
  }

  const handleBreedValidation = async (name: string) => {
    form.setValue(
      'parentId',
      animal &&
        pageState.parents.filter((x) => x.species === species && x.breed === name).some((x) => x.id === animal.parentId)
        ? animal.parentId
        : null,
    )
    form.trigger('parentId')
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
      form.setValue('species', newItem)
      form.trigger('species')
      await handleSpeciesValidation(name)
    } else if (pageState.newModalType === 'breed') {
      if (!pageState.breeds.map((x) => x.name.toLowerCase().trim()).includes(newItem.toLowerCase())) {
        stateUpdate.breeds = [
          ...pageState.breeds,
          {
            name: newItem,
            species: form.getValues('species'),
          },
        ]
      } else {
        const existingBreed = pageState.breeds.find((x) => x.name.toLowerCase().trim() === newItem.toLowerCase())

        if (existingBreed) {
          newItem = existingBreed.name
        }
      }

      setState(stateUpdate)
      form.setValue('breed', newItem)
      form.trigger('breed')
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
    tags: form.watch('tags') || [],
  }

  const handleAddTag = (tag, name) => form.setValue(name, [...values[name], tag.text])

  const handleDeleteTag = (i, name) =>
    form.setValue(
      name,
      values[name].filter((_, index) => index !== i),
    )

  const handleEditTag = (item, index, name) =>
    form.setValue(name, [...values[name].filter((_, i) => i !== index), item.text])

  return (
    <>
      <Form {...form}>
        <Card
          onBack={back}
          onSubmit={form.handleSubmit(submitHandler)}
          onDelete={animal && handleShowDeleteModal}
          loading={form.formState.isSubmitting}
          submitEnabled={form.formState.isValid}
          className="mt-6"
        >
          <div className="space-y-6 sm:pb-5">
            {errorMessage && <Alert type="danger" message={errorMessage} />}

            <div className="space-y-6 divide-y divide-muted-light">
              <FormInput
                label="Name"
                name="name"
                register={form.register}
                control={form.control}
                required
                error={form.formState.errors.name}
                helpText="This is the name of the animal"
              />

              <FormSelect
                label="Species"
                name="species"
                required
                addNew={() => handleOpenNewModal('species')}
                control={form.control}
                error={form.formState.errors.species}
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
                    control={form.control}
                    error={form.formState.errors.breed}
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
                      control={form.control}
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
                register={form.register}
                control={form.control}
                helpText="This is the temperament of the animal"
              />

              <DatePicker
                label="Birthdate"
                helpText="This is the date the animal was born"
                control={form.control}
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

              <FormToggle label="Deceased?" onLabel="Yes" offLabel="No" name="deceased" control={form.control} />

              {deceased && (
                <DatePicker
                  label="Deceased Date"
                  helpText="This is the date the animal died"
                  control={form.control}
                  name="deceasedDate"
                />
              )}

              <FormToggle label="Sold?" onLabel="Yes" offLabel="No" name="sold" control={form.control} />

              {sold && (
                <DatePicker
                  label="Sale Date"
                  helpText="This is the date the animal was sold"
                  control={form.control}
                  name="saleDate"
                />
              )}
            </div>
          </div>
        </Card>
      </Form>

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
