import {SessionProvider} from 'next-auth/react'
import type {AppProps} from 'next/app'
import React from 'react'
import UserProvider from '../providers/user.provider'

import '../styles/globals.css'

const sep = ' -------------------------------------'

console.log(`
   _____    _____                
  / ____|  / ____|               
 | |      | |  __  ___ _ __  
 | |      | | |_ |/ _ \\ '_ \\ 
 | |____  | |__| |  __/ | | |
  \\_____|  \\_____|\\___|_| |_|
  
${sep}
 Farm Tracker | v${process.env.NEXT_PUBLIC_APP_VERSION || '_dev'}
${sep}`)

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
