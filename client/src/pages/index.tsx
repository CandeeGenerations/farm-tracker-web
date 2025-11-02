import MainPage from '@/components/MainPage'
import {useUser} from '@/providers/user.provider'
import {signIn} from 'next-auth/react'
import {useRouter} from 'next/router'
import React, {useEffect} from 'react'

const StartPage = (): React.ReactElement => {
  const router = useRouter()
  const {isSignedIn} = useUser()

  useEffect(() => {
    if (isSignedIn) {
      router.push('/home')
    } else {
      signIn()
    }
  }, [isSignedIn])

  return <MainPage />
}

export default StartPage
