import { Router } from 'express'
import { searchController } from '~/controllers/userControllers/search.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const seachRouter = Router()

seachRouter.get('/', accessTokenValidator, wrapRequestHandler(searchController))

export default seachRouter
