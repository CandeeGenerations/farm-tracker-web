import Button from '@/components/Button'
import Image from 'next/image'
import React from 'react'

const MainPage = (): React.ReactElement => {
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

export default MainPage
