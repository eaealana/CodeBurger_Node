import * as Yup from 'yup'

import jwt from 'jsonwebtoken'
import authConfig from '../../config/auth'

import User from '../models/User'

class SessionController {
  async store(request, response) {
    //! validating data
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      password: Yup.string().required(),
    })

    //! error mensage
    function userEmailOrPasswordIncorrect() {
      return response
        .status(400)
        .json({ error: 'Make sure your email and password is correct' })
    }

    //! validating data
    if (!(await schema.isValid(request.body))) userEmailOrPasswordIncorrect()

    const { email, password } = request.body

    //! check email
    const user = await User.findOne({
      where: { email },
    })

    if (!user) userEmailOrPasswordIncorrect()

    //! check password
    if (!(await user.checkPassword(password))) userEmailOrPasswordIncorrect()

    // return
    return response.json({
      id: user.id,
      email,
      name: user.name,
      admin: user.admin,
      //! JWT = token
      toker: jwt.sign({ id: user.id, name: user.name }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    })
  }
}

export default new SessionController()
