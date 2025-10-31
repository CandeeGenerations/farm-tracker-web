import MainPage from '@/components/MainPage'
import {signIn, useSession} from 'next-auth/react'
import {useRouter} from 'next/router'
import {useEffect} from 'react'

const SignIn = () => {
  const {status} = useSession()
  const router = useRouter()

  useEffect(() => {
    // If already authenticated, redirect to home
    if (status === 'authenticated') {
      router.push('/home')
    }
    // If unauthenticated, trigger signin
    else if (status === 'unauthenticated') {
      signIn('google')
    }
  }, [status, router])

  return <MainPage />
}

export default SignIn
