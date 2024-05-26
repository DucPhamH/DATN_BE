import { Request, Response } from 'express'
import { INSPECTOR_MESSAGE } from '~/constants/messages'
import inspectorService from '~/services/adminServices/inspector.services'

export const getAllPostReportController = async (req: Request, res: Response) => {
  const { page, limit, search } = req.query
  const result = await inspectorService.getAllPostReportService({
    page: Number(page),
    limit: Number(limit),
    search: search as string
  })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_ALL_POST_REPORT_SUCCESS
  })
}

export const getPostReportDetailController = async (req: Request, res: Response) => {
  const { id } = req.params
  console.log('id', id)
  const result = await inspectorService.getPostReportDetailService({ post_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_POST_REPORT_DETAIL_SUCCESS
  })
}

export const acceptPostReportController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.acceptPostReportService({ post_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.ACCEPT_POST_REPORT_SUCCESS
  })
}

export const deletePostReportController = async (req: Request, res: Response) => {
  const { id } = req.params
  const { user_id } = req.body
  const result = await inspectorService.deletePostReportService({ post_id: id, user_id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.DELETE_POST_REPORT_SUCCESS
  })
}

export const getListBlogForInspectorController = async (req: Request, res: Response) => {
  const { page, limit, search, sort, category_blog_id } = req.query
  const result = await inspectorService.getListBlogForInspectorService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    sort: sort as string,
    category_blog_id: category_blog_id as string
  })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_LIST_BLOG_FOR_INSPECTOR_SUCCESS
  })
}

export const acceptBlogController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.acceptBlogService({ blog_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.ACCEPT_BLOG_SUCCESS
  })
}

export const rejectBlogController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.rejectBlogService({ blog_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.REJECT_BLOG_SUCCESS
  })
}

export const getBlogDetailForInspectorController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.getBlogDetailForInspectorService({ blog_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_BLOG_DETAIL_FOR_INSPECTOR_SUCCESS
  })
}

export const getListRecipeForInspectorController = async (req: Request, res: Response) => {
  const { page, limit, search, sort, category_recipe_id, difficult_level, processing_food, region, interval_time } =
    req.query
  const result = await inspectorService.getListRecipesForInspectorService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    sort: sort as string,
    category_recipe_id: category_recipe_id as string,
    difficult_level: Number(difficult_level),
    processing_food: processing_food as string,
    region: Number(region),
    interval_time: Number(interval_time)
  })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_LIST_RECIPE_FOR_INSPECTOR_SUCCESS
  })
}

export const getRecipeDetailForInspectorController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.getRecipeDetailForInspectorService({ recipe_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_RECIPE_DETAIL_FOR_INSPECTOR_SUCCESS
  })
}

export const acceptRecipeController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.acceptRecipeService({ recipe_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.ACCEPT_RECIPE_SUCCESS
  })
}

export const rejectRecipeController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.rejectRecipeService({ recipe_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.REJECT_RECIPE_SUCCESS
  })
}

export const getListAlbumForInspectorController = async (req: Request, res: Response) => {
  const { page, limit, search, category_album, sort } = req.query
  const result = await inspectorService.getListAlbumForInspectorService({
    page: Number(page),
    limit: Number(limit),
    search: search as string,
    sort: sort as string,
    category_album: category_album as string
  })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_LIST_ALBUM_FOR_INSPECTOR_SUCCESS
  })
}

export const getAlbumDetailForInspectorController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.getAlbumDetailForInspectorService({ album_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_ALBUM_DETAIL_FOR_INSPECTOR_SUCCESS
  })
}

export const getRecipeInAlbumForInspectorController = async (req: Request, res: Response) => {
  const { album_id, page, limit } = req.query
  const result = await inspectorService.getRecipesInAlbumForInspectorService({
    album_id: album_id as string,
    page: Number(page),
    limit: Number(limit)
  })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.GET_RECIPE_IN_ALBUM_FOR_INSPECTOR_SUCCESS
  })
}

export const acceptAlbumController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.acceptAlbumService({ album_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.ACCEPT_ALBUM_SUCCESS
  })
}

export const rejectAlbumController = async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await inspectorService.rejectAlbumService({ album_id: id })
  return res.json({
    result,
    message: INSPECTOR_MESSAGE.REJECT_ALBUM_SUCCESS
  })
}
