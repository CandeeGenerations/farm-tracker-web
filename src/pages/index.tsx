import Button from '@/components/Button'
import {signIn} from 'next-auth/react'
import Head from 'next/head'
import Image from 'next/image'
import React, {useEffect} from 'react'

const StartPage = (): React.ReactElement => {
  useEffect(() => {
    signIn()
  }, [])

  return (
    <div className="bg-brand h-screen">
      <Head>
        <title>Farm Tracker - Track your farm!</title>
      </Head>

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

export default StartPage
