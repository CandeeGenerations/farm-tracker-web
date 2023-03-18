import {classNames, setPageState} from '@/helpers'
import {Disclosure} from '@headlessui/react'
import {Bars3Icon, HomeIcon, XMarkIcon} from '@heroicons/react/24/outline'
import dayjs from 'dayjs'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {useEffect, useState} from 'react'

interface IPageState {
  activeNavigation?: string
}

interface ILayout {
  title: string
  description?: string
  children: React.ReactNode
  breadcrumbs?: IBreadcrumb[]
}

interface IBreadcrumb {
  name: string
  href?: string
  current?: boolean
}

const navigation: {id: string; name: string}[] = [
  {id: 'home', name: 'Home'},
  {id: 'animals', name: 'Animals'},
  {id: 'products', name: 'Products'},
]

const Layout = ({title, description, children, breadcrumbs}: ILayout): React.ReactElement => {
  const router = useRouter()
  const [pageState, stateFunc] = useState<IPageState>({})

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    setState({activeNavigation: router.pathname.split('/')[1]})
  }, [router.pathname])

  const year = dayjs().format('YYYY')

  return (
    <>
      <Head>
        <title>{title} - Farm Tracker</title>
      </Head>

      <div className="min-h-full">
        <Disclosure as="nav" className="bg-primary-dark">
          {({open}) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Link href="/home">
                        <Image
                          className="h-8 w-8"
                          src="/images/logo-white.png"
                          alt="Farm Tracker"
                          width={48}
                          height={48}
                        />
                      </Link>
                    </div>

                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map(item => (
                          <Link
                            key={item.id}
                            href={`/${item.id}`}
                            className={classNames(
                              pageState.activeNavigation === item.id
                                ? 'bg-muted-dark text-white'
                                : 'text-muted-light hover:bg-primary-medium hover:text-white',
                              'px-3 py-2 rounded-md text-sm font-medium',
                            )}
                            aria-current={pageState.activeNavigation === item.id ? 'page' : undefined}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="inline-flex items-center justify-center rounded-md bg-gray-800 p-2 text-gray-400 hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                      <span className="sr-only">Open main menu</span>

                      {open ? (
                        <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                      ) : (
                        <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>

              <Disclosure.Panel className="md:hidden">
                <div className="space-y-1 px-2 pt-2 pb-3 sm:px-3">
                  {navigation.map(item => (
                    <Link key={item.id} href={`/${item.id}`}>
                      <Disclosure.Button
                        className={classNames(
                          pageState.activeNavigation === item.id
                            ? 'bg-gray-900 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                          'block px-3 py-2 rounded-md text-base font-medium',
                        )}
                        aria-current={pageState.activeNavigation === item.id ? 'page' : undefined}
                      >
                        {item.name}
                      </Disclosure.Button>
                    </Link>
                  ))}
                </div>
              </Disclosure.Panel>
            </>
          )}
        </Disclosure>

        <header className={classNames(breadcrumbs ? 'border-b border-muted-light' : 'shadow', 'bg-white')}>
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-muted-dark">{title}</h1>

            {description && <p className="tracking-tight text-muted">{description}</p>}
          </div>
        </header>

        {breadcrumbs && (
          <nav className="flex shadow bg-white" aria-label="Breadcrumb">
            <ol role="list" className="mx-auto flex w-full max-w-screen-xl space-x-4 px-4 sm:px-6 lg:px-8">
              <li className="flex">
                <div className="flex items-center">
                  <Link href="/home" className="text-muted hover:text-primary-medium">
                    <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
                    <span className="sr-only">Home</span>
                  </Link>
                </div>
              </li>

              {breadcrumbs.map(breadcrumb => (
                <li key={breadcrumb.name} className="flex">
                  <div className="flex items-center">
                    <svg
                      className="h-full w-6 flex-shrink-0 text-muted-light"
                      viewBox="0 0 24 44"
                      preserveAspectRatio="none"
                      fill="currentColor"
                      xmlns="http://www.w3.org/2000/svg"
                      aria-hidden="true"
                    >
                      <path d="M.293 0l22 22-22 22h1.414l22-22-22-22H.293z" />
                    </svg>

                    {breadcrumb.current ? (
                      <span className="ml-4 text-sm font-medium text-primary-medium">{breadcrumb.name}</span>
                    ) : (
                      <Link
                        href={breadcrumb.href}
                        className="ml-4 text-sm font-medium text-muted hover:text-primary-medium underline"
                      >
                        {breadcrumb.name}
                      </Link>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </nav>
        )}

        <main>
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">{children}</div>
        </main>

        <footer>
          <div className="mx-auto max-w-7xl py-6 px-4 sm:px-6 lg:px-8">
            <div className="relative border border-secondary-300 mt-24 mb-12" />

            <div className="relative flex items-center content-between lg:pb-20 pb-10 lg:flex-row flex-col text-muted">
              <div className="flex-grow pb-3 lg:pb-0 text-center lg:text-left text-sm">
                v{process.env.NEXT_PUBLIC_APP_VERSION || '_dev'}
              </div>

              <div className="flex flex-grow-0 text-sm">
                &copy; 2022{year !== '2022' && ` - ${year}`} Candee Generations
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  )
}

export default Layout
