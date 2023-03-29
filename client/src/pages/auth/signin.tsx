import MainPage from '@/components/MainPage'
import type {GetServerSidePropsContext} from 'next'
import {getServerSession} from 'next-auth/next'
import {signIn} from 'next-auth/react'
import {useEffect} from 'react'
import {authOptions} from '../api/auth/[...nextauth]'

const SignIn = () => {
  useEffect(() => {
    signIn('google')
  }, [])

  return <MainPage />
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {redirect: {destination: '/home'}}
  }

  return {props: {}}
}

export default SignIn
