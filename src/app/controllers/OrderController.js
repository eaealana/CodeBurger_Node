import * as Yup from 'yup'

import Product from '../models/Product'
import Category from '../models/Category'
import User from '../models/User'
import Order from '../schemas/Order'

class OrderController {
  async store(request, response) {
    //! YUP = validating data
    const schema = Yup.object().shape({
      products: Yup.array()
        .required()
        .of(
          Yup.object().shape({
            id: Yup.number().required(),
            quantity: Yup.number().required(),
          })
        ),
    })

    //! error mensage
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    //! take id
    const productId = request.body.products.map((product) => product.id)

    //! atualidating products
    const uptadeProducts = await Product.findAll({
      where: {
        id: productId,
      },
      include: [
        {
          model: Category,
          as: 'category',
          attributes: ['name'],
        },
      ],
    })

    //! show just the import
    const editedProduct = uptadeProducts.map((product) => {
      //! validanting id
      const productIndex = request.body.products.findIndex(
        (requestProduct) => requestProduct.id == product.id
      )

      // pegando todas as informações do produto
      const newProduct = {
        id: product.id,
        name: product.name,
        price: product.price,
        category: product.category.name,
        url: product.url,
        quantity: request.body.products[productIndex].quantity,
      }

      return newProduct
    })

    // make the order
    const order = {
      user: {
        id: request.userId,
        name: request.userName,
      },

      products: editedProduct,

      status: 'Pedido realizado',
    }

    const orderResponse = await Order.create(order)

    return response.status(201).json(orderResponse)
  }

  //! show all orders
  async index(request, response) {
    const orders = await Order.find()

    return response.json(orders)
  }

  //! update status
  async update(request, response) {
    const schema = Yup.object().shape({
      status: Yup.string().required(),
    })

    // error message
    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    //! show just admin
    const { admin: isAdmin } = await User.findByPk(request.userId)

    if (!isAdmin) {
      return response.status(401).json()
    }

    const { id } = request.params
    const { status } = request.body

    try {
      await Order.updateOne({ _id: id }, { status })
    } catch (error) {
      return response.status(400).json({ error: error.message })
    }

    return response.json({ message: 'Status ok' })
  }
}

export default new OrderController()
