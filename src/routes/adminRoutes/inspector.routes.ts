import { Router } from 'express'
import { UserRoles } from '~/constants/enums'
import {
  acceptAlbumController,
  acceptBlogController,
  acceptPostReportController,
  acceptRecipeController,
  deletePostReportController,
  getAlbumDetailForInspectorController,
  getAllPostReportController,
  getBlogDetailForInspectorController,
  getListAlbumForInspectorController,
  getListBlogForInspectorController,
  getListRecipeForInspectorController,
  getPostReportDetailController,
  getRecipeDetailForInspectorController,
  getRecipeInAlbumForInspectorController,
  rejectAlbumController,
  rejectBlogController,
  rejectRecipeController
} from '~/controllers/adminControllers/inspector.controller'
import { accessTokenValidator } from '~/middlewares/authUser.middleware'
import { checkRole } from '~/middlewares/roles.middleware'
import { wrapRequestHandler } from '~/utils/handler'

const inspectorRouter = Router()

inspectorRouter.get(
  '/post-reports',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getAllPostReportController)
)

inspectorRouter.get(
  '/post-reports/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getPostReportDetailController)
)

inspectorRouter.put(
  '/post-accept/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(acceptPostReportController)
)

inspectorRouter.put(
  '/post-reject/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(deletePostReportController)
)

inspectorRouter.get(
  '/blogs',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getListBlogForInspectorController)
)

inspectorRouter.get(
  '/blogs/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getBlogDetailForInspectorController)
)

inspectorRouter.put(
  '/accept-blog/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(acceptBlogController)
)

inspectorRouter.put(
  '/reject-blog/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(rejectBlogController)
)

inspectorRouter.get(
  '/recipes',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getListRecipeForInspectorController)
)

inspectorRouter.get(
  '/recipes/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getRecipeDetailForInspectorController)
)

inspectorRouter.put(
  '/accept-recipe/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(acceptRecipeController)
)

inspectorRouter.put(
  '/reject-recipe/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(rejectRecipeController)
)

inspectorRouter.get(
  '/albums',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getListAlbumForInspectorController)
)

inspectorRouter.get(
  '/albums/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getAlbumDetailForInspectorController)
)

inspectorRouter.get(
  '/album-recipes',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(getRecipeInAlbumForInspectorController)
)

inspectorRouter.put(
  '/accept-album/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(acceptAlbumController)
)

inspectorRouter.put(
  '/reject-album/:id',
  accessTokenValidator,
  wrapRequestHandler(checkRole([UserRoles.admin, UserRoles.inspector])),
  wrapRequestHandler(rejectAlbumController)
)

export default inspectorRouter
