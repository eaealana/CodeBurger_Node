import * as Yup from 'yup'

import Category from '../models/Category'
import User from '../models/User'

class CategoryController {
  async store(request, response) {
    const schema = Yup.object().shape({
      //! validating data
      name: Yup.string().required(),
    })

    //! error mensage
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(404).json({ error: err.errors })
    }

    //! show just admin
    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { name } = request.body

    const { filename: path } = request.file

    //! validating category exist
    const categoryExist = await Category.findOne({
      where: { name },
    })

    if (categoryExist) {
      return response.status(400).json({ error: 'Catergory alread exist' })
    }

    // show just id and name
    const { id } = await Category.create({ name, path })

    return response.json({ id, name })
  }

  //! chose category
  async index(request, response) {
    const category = await Category.findAll()

    return response.json(category)
  }
}

export default new CategoryController()
