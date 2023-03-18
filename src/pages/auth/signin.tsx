import Button from '@/components/Button'
import type {GetServerSidePropsContext} from 'next'
import {getServerSession} from 'next-auth/next'
import {signIn} from 'next-auth/react'
import Image from 'next/image'
import {useEffect} from 'react'
import {authOptions} from '../api/auth/[...nextauth]'

const SignIn = () => {
  useEffect(() => {
    signIn('google')
  }, [])

  return (
    <div className="bg-brand h-screen">
      <div className="text-center">
        <Image
          alt="Farm Tracker - Track your farm!"
          src="/images/default.svg"
          className="mx-auto h-full"
          style={{maxWidth: 500}}
          width={500}
          height={500}
        />

        <Button loading>Loading...</Button>
      </div>
    </div>
  )
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return {redirect: {destination: '/home'}}
  }

  return {props: {}}
}

export default SignIn
