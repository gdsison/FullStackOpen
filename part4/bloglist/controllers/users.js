const usersRouter = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')


usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < 3) {
    response.status(400).json({ error: 'Password should be atleast 3 characters long' })
  }

  const salt = 10

  const passwordHash = await bcrypt.hash(password, salt)

  const newUser = new User({
    username: username,
    name: name,
    passwordHash: passwordHash
  })

  const savedUser = await newUser.save()

  response.status(201).json(savedUser)
})

module.exports = usersRouter