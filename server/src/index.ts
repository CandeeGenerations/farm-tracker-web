import cors from 'cors'
import express from 'express'
import fs from 'fs'
import path from 'path'
import config from './common/config'
import animalRoutes from './domains/animal/routes'
import expenseRoutes from './domains/expense/routes'
import loggedProductRoutes, {logImporter} from './domains/logged-product/routes'
import productRoutes from './domains/product/routes'

const app = express()
const {port} = config
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

const cleanseRouteName = (routeObject: any): string => {
  const routeName = Object.keys(routeObject)[0]

  return routeName
    .replace('Routes', '')
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .toLowerCase()
}

const useRoute = (routeObject: any, parentRouteName?: string): void => {
  const routeName = cleanseRouteName(routeObject)
  const route = `/api/${parentRouteName ? `${parentRouteName}/` : ''}${routeName}`

  console.log(` - ${route}`)

  // noinspection TypeScriptValidateTypes
  app.use(route, routeObject[Object.keys(routeObject)[0]])
}

for (const routeObject of [{animalRoutes}, {productRoutes}]) {
  useRoute(routeObject)
}

for (const routeObject of [{expenseRoutes}, {loggedProductRoutes}]) {
  useRoute(routeObject, 'product/:productId')
}

console.log(' - /api/logged-product')

app.use('/api/logged-product', logImporter)

console.log(sep)

app.listen(port)