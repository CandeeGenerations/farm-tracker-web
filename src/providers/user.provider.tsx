import {IMPERSONATOR_EMAIL} from '@/helpers/constants'
import {signOut, useSession} from 'next-auth/react'
import React, {createContext, ReactElement, ReactNode, useContext, useEffect, useState} from 'react'

interface IUserContext {
  userInfo: IUserInfo
  logOut: () => void
  // eslint-disable-next-line no-unused-vars
  impersonate: (email: string) => void
  // eslint-disable-next-line no-unused-vars
  attachUserEmail: (url: string) => string
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
  attachUserEmail: () => '',
})

const UserProvider = ({children}: {children: ReactNode}): ReactElement => {
  const {data: session} = useSession()

  const [userInfo, setUserInfo] = useState<IUserInfo>({})

  useEffect(() => {
    const impersonatorEmail = localStorage.getItem(IMPERSONATOR_EMAIL)

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
  }

  const attachUserEmail = (url: string): string => `${url}${userInfo.impersonating ? `?email=${userInfo.email}` : ''}`

  return (
    <UserContext.Provider
      value={{
        userInfo,
        logOut,
        impersonate,
        attachUserEmail,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export const useUser = (): IUserContext => useContext(UserContext)

export default UserProvider
