import Recommender from 'content-based-recommender-ts'
import { RecipeStatus } from '~/constants/enums'
import RecipeModel from '~/models/schemas/recipe.schema'

const recommender = new Recommender()

export const trainRecipesRecommender = async () => {
  const recipes = await RecipeModel.find({
    status: RecipeStatus.accepted
  })

  const documents = recipes.map((recipe) => ({
    id: recipe._id.toString(),
    content: recipe.title
  }))
  console.log('Training recipes recommender...')
  recommender.train(documents)
  console.log('Training recipes recommender done!')
}

export const getRecommendations = (itemId: string) => {
  return recommender.getSimilarDocuments(itemId, 0, 5)
}
