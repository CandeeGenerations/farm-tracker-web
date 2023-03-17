import Head from 'next/head'
import Router from 'next/router'
import React, {useEffect} from 'react'

const StartPage = (): React.ReactElement => {
  useEffect(() => {
    const timer = setTimeout(async () => {
      await Router.push('/home')
    }, 2000)

    return () => {
      clearTimeout(timer)
    }
  }, [])

  return (
    <div className="bg-brand h-screen">
      <Head>
        <title>Farm Tracker - Track your farm!</title>
      </Head>

      <div>
        <img
          alt="Farm Tracker - Track your farm!"
          src="/images/default.svg"
          className="mx-auto h-full"
          style={{maxWidth: 1000}}
        />
      </div>
    </div>
  )
}

export default StartPage
