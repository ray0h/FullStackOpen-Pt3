require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person.js')

const app = express()

app.use(express.static('build'))
app.use(express.json())

morgan.token('content', (request, response) => {
  return JSON.stringify(request.body)
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons.map(person => person.toJSON()))
  })
})

app.get('/info', (request, response) => {
  const date = new Date()
  Person.estimatedDocumentCount().then(count => {
    response.send(`Phonebook has info for ${count} people.<br><br>
        ${date}`)
  })
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person.toJSON())
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndRemove(request.params.id)
    .then( () => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPeep => {
      response.json(updatedPeep.toJSON())
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (body.name === undefined || body.number === undefined) {
    return response.status(400).json({ error: 'content missing' })
  }

  const person = new Person({
    name: body.name,
    number: body.number,
  })

  person
    .save()
    .then(savedPeep => savedPeep.toJSON())
    .then(formattedAndSavedPeep => response.json(formattedAndSavedPeep))
    .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError' && error.kind === 'ObjectId') {
    return response.status(400).send({ error: 'malformed id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => { console.log(`Server is running on port ${PORT}`) })