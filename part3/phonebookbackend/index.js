require('dotenv').config()
const express = require('express')
const app = express()

const morgan = require('morgan')
const cors = require('cors')

const Person = require('./models/person')

morgan.token('body', (req, res) => JSON.stringify(req.body))

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))
app.use(express.static('build'))

let persons = [
]

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

app.delete('/api/persons/:id', (request, response) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
})

app.post('/api/persons', (request, response) => {
  const body = request.body

  if(!body.name){
    return response.status(400).json({
      error: 'name is missing'
    })
  }
  
  if (!body.number) {
    return response.status(400).json({
      error: 'number is missing'
    })
  }

  /* if (persons.some(person => person.name === body.name)) {
    return response.status(400).json({
      error: 'name must be duplicated'
    })
  } */

  const person = new Person({
    name: body.name,
    number: body.number
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

app.get('/info', (request, response) => {
  response.send(`
    <div>Phonebook has ${persons.length} people info</div>
    <div>${new Date().toString()}</div>
  `)
})

const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on ${PORT}`)