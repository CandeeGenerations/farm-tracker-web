import Image from 'next/image'
import React from 'react'

import SmallLoader from './SmallLoader'

const MainPage = (): React.ReactElement => {
  return (
    <div className="bg-brand min-h-screen flex items-center justify-center w-full">
      <div className="text-center">
        <Image
          alt="Farm Tracker - Track your farm!"
          src="/images/default.svg"
          className="mx-auto"
          style={{maxWidth: '100%', height: 'auto'}}
          width={500}
          height={500}
        />

        <SmallLoader className="text-white" />
      </div>
    </div>
  )
}

export default MainPage
