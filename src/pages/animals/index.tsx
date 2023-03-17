import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'
import FormSelect, {IFormSelectItem} from '@/components/FormSelect'
import ImportModal from '@/components/ImportModal'
import Search from '@/components/Search'
import Table from '@/components/Table'
import {setPageState} from '@/helpers'
import {DEBOUNCE} from '@/helpers/constants'
import {IAnimal, morphAnimalDb} from '@/pages/api/_morphs/animal.morph'
import Layout from '@/pages/_layout'
import {Breed} from '@/types'
import {PrismaClient} from '@prisma/client'
import axios from 'axios'
import dayjs from 'dayjs'
import _debounce from 'lodash/debounce'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useState} from 'react'

interface IAnimalsPage {
  animals: IAnimal[]
  dbSpecies: string[]
  dbBreeds: Breed[]
}

interface IFilters {
  species: IFormSelectItem
  breed: IFormSelectItem
  deceased: IFormSelectItem
  sold: IFormSelectItem
}

interface IPageState {
  animals?: IAnimal[]
  originalAnimals?: IAnimal[]
  filters?: IFilters
  resetSearch?: number
  importerOpen?: boolean
}

const filterOptions = [
  {id: 'all', name: 'All'},
  {id: 'yes', name: 'Yes'},
  {id: 'no', name: 'No'},
]

const defaultFilters = {
  species: filterOptions[0],
  breed: filterOptions[0],
  deceased: filterOptions[0],
  sold: filterOptions[0],
}

const AnimalsPage = ({animals, dbSpecies, dbBreeds}: IAnimalsPage): React.ReactElement => {
  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    animals: animals,
    importerOpen: false,
    originalAnimals: [...animals],
    resetSearch: 0,
    filters: {...defaultFilters},
  })

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  const handleFilter = (filterObject: IFilters, returnable = false) => {
    let filteredAnimals = [...pageState.originalAnimals]
    const filters = []

    if (filterObject.species.id !== 'all') {
      filters.push({key: 'species', value: filterObject.species.id})

      if (filterObject.breed.id !== 'all') {
        filters.push({key: 'breed', value: filterObject.breed.id})
      }
    }

    if (filterObject.deceased.id !== 'all') {
      filters.push({key: 'deceased', value: filterObject.deceased.id === 'yes'})
    }

    if (filterObject.sold.id !== 'all') {
      filters.push({key: 'sold', value: filterObject.sold.id === 'yes'})
    }

    for (const filter of filters) {
      filteredAnimals = filteredAnimals.filter(x => x[filter.key] === filter.value)
    }

    if (returnable) {
      return filteredAnimals
    } else {
      setState({filters: filterObject, animals: filteredAnimals, resetSearch: pageState.resetSearch + 1})
    }
  }

  const handleReset = () =>
    setState({
      filters: {...defaultFilters},
      animals: [...pageState.originalAnimals],
      resetSearch: pageState.resetSearch + 1,
    })

  const handleSearch = (value, reset) => {
    if (!value && !reset) {
      return
    }

    let newData = handleFilter(pageState.filters, true)

    if (value) {
      newData = newData.filter(x => x.name?.toLowerCase().includes(value.trim().toLowerCase()))
    }

    setState({animals: newData})
  }

  const handleOpenImporter = () => setState({importerOpen: true})

  const handleCloseImporter = () => setState({importerOpen: false})

  const handleImport = async (
    data: {
      name: string
      species: string
      breed: string
      birthDate?: string
      deceasedDate?: string
      saleDate?: string
    }[],
  ) => {
    const animals: IAnimal[] = []

    for (const animal of data) {
      animals.push({
        id: undefined,
        parentId: undefined,
        name: animal.name,
        species: animal.species,
        breed: animal.breed,
        birthDate: animal.birthDate ? dayjs(animal.birthDate).format() : undefined,
        deceased: !!animal.deceasedDate,
        deceasedDate: animal.deceasedDate ? dayjs(animal.deceasedDate).format() : undefined,
        sold: !!animal.saleDate,
        saleDate: animal.saleDate ? dayjs(animal.saleDate).format() : undefined,
      })
    }

    await axios.post(`/api/animal/import`, animals)

    router.reload()
  }

  const debounceSearch = _debounce(handleSearch, DEBOUNCE)

  return (
    <Layout
      title="Animals"
      description="Manage the animals on your farm"
      breadcrumbs={[{name: 'Animals', current: true}]}
    >
      {pageState.animals.length === 0 ? (
        <EmptyState
          entity="animals"
          actions={
            <>
              <p className="mt-1 text-sm text-muted">Add a new animal here</p>

              <div className="mt-6">
                <Button type="secondary" className="mr-4" onClick={handleOpenImporter}>
                  Import animals
                </Button>

                <Link href="/animals/add">
                  <Button type="primary">Add new animal</Button>
                </Link>
              </div>
            </>
          }
        />
      ) : (
        <div className="mx-auto mt-8 grid grid-cols-1 gap-6 lg:grid-flow-col-dense lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-1">
            <h1 className="text-2xl pt-5 pb-2.5">Filters</h1>

            <Card>
              <FormSelect
                vertical
                label="Species"
                name="species"
                items={[filterOptions[0], ...dbSpecies.map(name => ({id: name, name}))]}
                staticSelected={pageState.filters.species}
                onSelected={item => handleFilter({...pageState.filters, species: item, breed: filterOptions[0]})}
              />

              {pageState.filters.species.id !== 'all' && (
                <FormSelect
                  vertical
                  label="Breeds"
                  name="breed"
                  items={[
                    filterOptions[0],
                    ...dbBreeds
                      .filter(x => x.species === pageState.filters.species.id)
                      .map(({name}) => ({id: name, name})),
                  ]}
                  staticSelected={pageState.filters.breed}
                  onSelected={item => handleFilter({...pageState.filters, breed: item})}
                />
              )}

              <FormSelect
                vertical
                label="Deceased"
                name="deceased"
                items={filterOptions}
                staticSelected={pageState.filters.deceased}
                onSelected={item => handleFilter({...pageState.filters, deceased: item})}
              />

              <FormSelect
                vertical
                label="Sold"
                name="sold"
                items={filterOptions}
                staticSelected={pageState.filters.sold}
                onSelected={item => handleFilter({...pageState.filters, sold: item})}
              />

              <Button type="secondary" block onClick={handleReset}>
                Reset
              </Button>
            </Card>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <div className="flex items-center">
              <Search onSearch={(value, reset) => debounceSearch(value, reset)} resetSearch={pageState.resetSearch} />

              <div className="pt-5 flex-1 text-right">
                <Button type="secondary" className="mr-4" onClick={handleOpenImporter}>
                  Import animals
                </Button>

                <Link href="/animals/add">
                  <Button type="primary">Add new animal</Button>
                </Link>
              </div>
            </div>

            <Table
              actions={{idColumn: 'id', parent: 'animals'}}
              columns={[
                {name: 'Name', id: 'name'},
                {name: 'Species', id: 'species'},
                {name: 'Breed', id: 'breed'},
                {name: 'Deceased', id: 'deceased'},
                {name: 'Sold', id: 'sold'},
              ]}
              keyName="id"
              linkKey="name"
              data={pageState.animals}
            />
          </div>
        </div>
      )}

      <ImportModal
        type="animals"
        headers={['name', 'species', 'breed', 'birthDate', 'deceasedDate', 'saleDate']}
        open={pageState.importerOpen}
        onClose={handleCloseImporter}
        onSave={handleImport}
      />
    </Layout>
  )
}

// noinspection JSUnusedGlobalSymbols
export const getStaticProps = async (): Promise<{props: IAnimalsPage}> => {
  const prisma = new PrismaClient()
  const animals = await prisma.animal.findMany()

  return {
    props: {
      animals: animals.map(morphAnimalDb),
      dbSpecies: _uniq(animals.map(x => x.species)),
      dbBreeds: _uniqBy(
        animals.map(x => ({
          name: x.breed,
          species: x.species,
        })),
        'name',
      ),
    },
  }
}

// noinspection JSUnusedGlobalSymbols
export default AnimalsPage
