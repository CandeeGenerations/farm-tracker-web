import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'

import config from './common/config.js'
import animalRoutes from './domains/animal/routes.js'
import expenseRoutes from './domains/expense/routes.js'
import loggedProductRoutes, {logImporterRouter as logImporter} from './domains/logged-product/routes.js'
import pingRoutes from './domains/ping/routes.js'
import productSaleRoutes from './domains/product-sale/routes.js'
import productRoutes from './domains/product/routes.js'
import saleRoutes from './domains/sale/routes.js'

const app = express()
const {port} = config
// eslint-disable-next-line no-undef
const pjson = JSON.parse(fs.readFileSync(path.join(__dirname, '../', 'package.json'), 'utf8'))
const sep = ' -------------------------------------'

app.use(express.json({limit: '50mb'}))
app.use(cors())

console.log(`
   _____    _____
  / ____|  / ____|
 | |      | |  __  ___ _ __
 | |      | | |_ |/ _ \\ '_ \\
 | |____  | |__| |  __/ | | |
  \\_____|  \\_____|\\___|_| |_|

${sep}
 Farm Tracker Server | v${pjson.version || '_dev'}
 🚀 Server ready on PORT: ${port}
${sep}
 Routes:`)

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cleanseRouteName = (routeObject: any): string => {
  const routeName = Object.keys(routeObject)[0]

  return routeName
    .replace('Routes', '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const useRoute = (routeObject: any, parentRouteName?: string): void => {
  const routeName = cleanseRouteName(routeObject)
  const route = `/api/${parentRouteName ? `${parentRouteName}/` : ''}${routeName}`

  console.log(` - ${route}`)

  // noinspection TypeScriptValidateTypes
  app.use(route, routeObject[Object.keys(routeObject)[0]])
}

for (const routeObject of [{pingRoutes}, {animalRoutes}, {productRoutes}, {saleRoutes}]) {
  useRoute(routeObject)

  if (cleanseRouteName(routeObject) === 'product') {
    console.log(' - /api/product/:productId/logged-product')
    console.log(' - /api/product/:productId/expense')
    console.log(' - /api/product/:productId/sale')

    app.use('/api/product', loggedProductRoutes)
    app.use('/api/product', expenseRoutes)
    app.use('/api/product', productSaleRoutes)
  }
}

console.log(' - /api/logged-product')

app.use('/api/logged-product', logImporter)

console.log(sep)

app.listen(port)
