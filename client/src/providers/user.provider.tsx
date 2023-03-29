import MainPage from '@/components/MainPage'
import {IMPERSONATOR_EMAIL} from '@/helpers/constants'
import axios from 'axios'
import {signOut, useSession} from 'next-auth/react'
import React, {createContext, ReactElement, ReactNode, useContext, useEffect, useState} from 'react'

interface IUserContext {
  userInfo: IUserInfo
  logOut: () => void
  // eslint-disable-next-line no-unused-vars
  impersonate: (email: string) => void
}

export interface IUserInfo {
  initials?: string
  name?: string
  image?: string
  email?: string
  impersonating?: boolean
}

const UserContext = createContext<IUserContext>({
  userInfo: {},
  logOut: () => {},
  impersonate: () => {},
})

const UserProvider = ({children}: {children: ReactNode}): ReactElement => {
  const {data: session, status} = useSession()

  const [userInfo, setUserInfo] = useState<IUserInfo>({})

  useEffect(() => {
    const impersonatorEmail = localStorage.getItem(IMPERSONATOR_EMAIL)

    axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL

    if (impersonatorEmail) {
      impersonate(impersonatorEmail)
    } else if (session && session.user) {
      const firstName = session.user.name.split(' ').slice(0, -1).join(' ')
      const lastName = session.user.name.split(' ').slice(-1)[0]

      setUserInfo({
        initials: `${firstName[0]}${lastName[0]}`,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
        impersonating: false,
      })
      axios.defaults.headers.common['email'] = session.user.email
    }
  }, [session])

  const logOut = () => {
    localStorage.removeItem(IMPERSONATOR_EMAIL)
    signOut()
  }

  const impersonate = (email: string) => {
    setUserInfo({
      initials: 'X',
      email,
      name: 'Impersonator',
      impersonating: true,
    })
    localStorage.setItem(IMPERSONATOR_EMAIL, email)
    axios.defaults.headers.common['email'] = email
  }

  return (
    <UserContext.Provider
      value={{
        userInfo,
        logOut,
        impersonate,
      }}
    >
      {['authenticated', 'loading'].includes(status) && (!userInfo || !userInfo.email) ? <MainPage /> : children}
    </UserContext.Provider>
  )
}

export const useUser = (): IUserContext => useContext(UserContext)

export default UserProvider
