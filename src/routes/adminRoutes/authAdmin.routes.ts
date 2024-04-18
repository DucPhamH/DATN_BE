import { Router } from 'express'
import { loginAdminController } from '~/controllers/adminControllers/authAdmin.controller'
import { loginAdminValidator } from '~/middlewares/authAdmin.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const authAdminRouter = Router()

authAdminRouter.post('/login', loginAdminValidator, wrapRequestHandler(loginAdminController))
export default authAdminRouter
