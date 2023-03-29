import MainPage from '@/components/MainPage'
import {signIn} from 'next-auth/react'
import React, {useEffect} from 'react'

const StartPage = (): React.ReactElement => {
  useEffect(() => {
    signIn()
  }, [])

  return <MainPage />
}

export default StartPage
