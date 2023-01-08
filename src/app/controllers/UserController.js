import { v4 } from 'uuid'
import * as Yup from 'yup'

import User from '../models/User'

class UserController {
  // store = cadastrar/add
  async store(request, response) {

    //! YUP = validating data
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      admin: Yup.boolean(),
    })

    try {
      await schema.validateSync(request.body, { abortEarly: false })
    } catch (err) {
      return response.status(400).json({ error: err.errors })
    }

    // const
    const { name, email, password, admin } = request.body

    //! validating duplicate email
    const userExist = await User.findOne({
      where: { email },
    })

    if(userExist){
      return response.status(404).json({error: "User already exist"}) 
    }

    //! create users
    const user = await User.create({
      id: v4(),
      name,
      email,
      password,
      admin,
    })

    return response.status(201).json({ id: user.id, name, email, admin })
  }
}

export default new UserController()
