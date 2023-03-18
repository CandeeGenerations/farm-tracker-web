import {classNames, setPageState} from '@/helpers'
import {Disclosure, Menu, Transition} from '@headlessui/react'
import {Bars3Icon, HomeIcon, XMarkIcon} from '@heroicons/react/24/outline'
import Avvvatars from 'avvvatars-react'
import dayjs from 'dayjs'
import {signOut, useSession} from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import {useRouter} from 'next/router'
import React, {Fragment, useEffect, useState} from 'react'

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
  const {data: session} = useSession()
  const [pageState, stateFunc] = useState<IPageState>({})
  const [userInfo, setUserInfo] = useState<{initials?: string; name?: string; image?: string; email?: string}>({})

  const setState = (state: IPageState) => setPageState<IPageState>(stateFunc, pageState, state)

  useEffect(() => {
    if (session && session.user) {
      const firstName = session.user.name.split(' ').slice(0, -1).join(' ')
      const lastName = session.user.name.split(' ').slice(-1)[0]

      setUserInfo({
        initials: `${firstName[0]}${lastName[0]}`,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      })
    }
  }, [session])

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

                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <Menu as="div" className="relative ml-3">
                        <div>
                          {userInfo.name && userInfo.initials && (
                            <Menu.Button className="flex max-w-xs items-center rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-medium focus:ring-offset-2 focus:ring-offset-primary-medium">
                              <span className="sr-only">Open user menu</span>

                              <div className="flex items-center px-3 py-1">
                                <div className="flex-shrink-0">
                                  {userInfo.image ? (
                                    <img
                                      alt={userInfo.name}
                                      className="rounded-full border border-primary-medium"
                                      src={userInfo.image}
                                      width={35}
                                      height={35}
                                    />
                                  ) : (
                                    <Avvvatars value={userInfo.name} displayValue={userInfo.initials} />
                                  )}
                                </div>

                                <div className="ml-3 text-left">
                                  <div className="text-base font-medium leading-none text-white">{userInfo.name}</div>
                                  <div className="text-sm font-medium leading-none text-muted-light">
                                    {userInfo.email}
                                  </div>
                                </div>
                              </div>
                            </Menu.Button>
                          )}
                        </div>

                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                            <Menu.Item>
                              <div
                                className="cursor-pointer text-danger block px-4 py-2 text-sm"
                                onClick={() => signOut()}
                              >
                                Sign out
                              </div>
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
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

              <Disclosure.Panel className="border-b border-muted-medium md:hidden">
                <div className="space-y-1 px-2 py-3 sm:px-3">
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

                <div className="border-t border-muted-medium pt-4 pb-3">
                  <div className="flex items-center px-5">
                    <div className="flex-shrink-0">
                      <Avvvatars value={'BC'} displayValue={'Becky Candee'} />
                    </div>

                    <div className="ml-3">
                      <div className="text-base font-medium leading-none text-white">{'Becky Candee'}</div>
                      <div className="text-sm font-medium leading-none text-muted-light">{'candeemama@gmail.com'}</div>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1 px-2">
                    <Disclosure.Button
                      className="block rounded-md px-3 py-2 text-base font-medium text-muted-light"
                      onClick={() => signOut()}
                    >
                      Sign out
                    </Disclosure.Button>
                  </div>
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
