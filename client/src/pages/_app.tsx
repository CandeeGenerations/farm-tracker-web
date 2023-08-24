import UserProvider from '@/providers/user.provider'
import {SessionProvider} from 'next-auth/react'
import type {AppProps} from 'next/app'
import React from 'react'

import '../styles/globals.css'

const FarmTrackerApp = ({Component, pageProps: {session, ...pageProps}}: AppProps): React.ReactElement => {
  return (
    <SessionProvider session={session}>
      <UserProvider>
        <Component {...pageProps} />
      </UserProvider>
    </SessionProvider>
  )
}

// noinspection JSUnusedGlobalSymbols
export default FarmTrackerApp
