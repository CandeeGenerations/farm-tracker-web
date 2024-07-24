import Button from '@/components/Button'
import Card from '@/components/Card'
import EmptyState from '@/components/EmptyState'
import ImportModal from '@/components/ImportModal'
import SortableTable from '@/components/SortableTable'
import TableLoader from '@/components/TableLoader'
import {setPageState} from '@/helpers'
import {TABLE_FILTERS_STORAGE_KEY} from '@/helpers/constants'
import * as storage from '@/helpers/localStorage'
import {IAnimal} from '@/types/animal'
import axios, {AxiosResponse} from 'axios'
import dayjs from 'dayjs'
import _uniq from 'lodash/uniq'
import _uniqBy from 'lodash/uniqBy'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'
import Layout from '../_layout'

interface IPageState {
  loading?: boolean
  animals?: IAnimal[]
  importerOpen?: boolean
}

const AnimalsPage = (): React.ReactElement => {
  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({
    loading: true,
    animals: [],
    importerOpen: false,
  })

  const getAnimals = async () => {
    const animals: AxiosResponse<{data: IAnimal[]}> = await axios.get('/animal')

    setState({
      loading: false,
      animals: animals.data.data,
    })
  }

  useEffect(() => {
    getAnimals()
  }, [])

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

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
        owner: undefined,
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

    await axios.post('/animal/import', animals)

    router.reload()
  }

  return (
    <Layout
      title="Animals"
      description="Manage the animals on your farm"
      breadcrumbs={[{name: 'Animals', current: true}]}
    >
      {pageState.loading ? (
        <Card>
          <TableLoader />
        </Card>
      ) : pageState.animals.length === 0 ? (
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
        <div className="space-y-6 lg:col-span-4 order-1 lg:order-2">
          <div className="flex items-center flex-col sm:flex-row">
            <div className="pt-5 sm:flex-1 w-full sm:w-auto text-right">
              <Button type="secondary" className="mr-4" onClick={handleOpenImporter}>
                Import animals
              </Button>

              <Link href="/animals/add">
                <Button type="primary">Add new animal</Button>
              </Link>
            </div>
          </div>

          <SortableTable
            id="animals"
            filters={[
              {
                label: 'Species',
                type: 'select',
                column: 'species',
                values: _uniq(pageState.animals.map(x => x.species)).map(name => ({id: name, name})),
              },
              {
                label: 'Breeds',
                type: 'select',
                column: 'breed',
                values: _uniqBy(
                  pageState.animals.map(x => ({
                    name: x.breed,
                    species: x.species,
                  })),
                  'name',
                ).map(({name}) => ({id: name, name})),
              },
              {
                label: 'Deceased',
                type: 'select',
                column: 'deceased',
                values: [
                  {id: 'true', name: 'Yes'},
                  {id: 'false', name: 'No'},
                ],
              },
              {
                label: 'Sold',
                type: 'select',
                column: 'sold',
                values: [
                  {id: 'true', name: 'Yes'},
                  {id: 'false', name: 'No'},
                ],
              },
            ]}
            searchableColumns={['name', 'species', 'breed']}
            columns={[
              {name: 'Name', id: 'name'},
              {name: 'Species', id: 'species'},
              {name: 'Breed', id: 'breed'},
              {name: 'Deceased', id: 'deceased'},
              {name: 'Sold', id: 'sold'},
            ]}
            defaultFilters={
              storage.get(`${TABLE_FILTERS_STORAGE_KEY}animals`) &&
              JSON.parse(storage.get(`${TABLE_FILTERS_STORAGE_KEY}animals`))
            }
            actions={{idColumn: 'id', parent: 'animals'}}
            keyName="id"
            linkKey="name"
            data={pageState.animals}
          />

          {/* <Table
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
          /> */}
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

export default AnimalsPage
