import type {AppProps} from 'next/app'
import React from 'react'

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

const FarmTrackerApp = ({Component, pageProps}: AppProps): React.ReactElement => {
  return <Component {...pageProps} />
}

// noinspection JSUnusedGlobalSymbols
export default FarmTrackerApp
