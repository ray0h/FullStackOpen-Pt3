const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(express.json())
app.use(cors())

morgan.token('content', (request, response) => {
    console.log(JSON.stringify(request.body))
    return JSON.stringify(request.body)
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :content'))

let persons = [
    {
        "name": "Tom Hanks",
        "number": "310-NICE-GUY",
        "id": 1
    },
    {
        "name": "Fred Rodgers",
        "number": "412-WONT-YOU",
        "id": 2
    },
    {
        "name": "Billy Graham",
        "number": "828-333-3333",
        "id": 3
    },
    {
        "name": "Tim Tebow",
        "number": "212-555-1234",
        "id": 4
    }
]

app.get('/', (request, response) => {
    response.send("<h2>my phonebook app</h2>")
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/info', (request, response) => {
    const population = persons.length
    const date = new Date ()

    response.send(`Phonebook has info for ${population} people.<br><br>
    ${date}`)

})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.filter(person => person.id === id)

    if(person.length !== 0) {
        response.send(person)

        response.status(404).end()
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)

    persons = persons.filter(person => person.id !== id)

    response.send(persons)
})

const newId = () => {
    const id = Math.floor(Math.random()*1000000)
    return id
}

app.post('/api/persons', (request, response) => {

    const pers = request.body

    if (!pers.name || !pers.number) {
        return response.status(204).json({
            error:'content missing'
        })
    } 
    if (persons.includes(pers.name)) {
        return response.status(303).json({
            error: 'name already on the list'
        })
    }

    const person = {
        name : pers.name,
        number : pers.number,
        id : newId(),
    }

    persons = persons.concat(person)
    response.send(persons)

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {console.log(`Server is running on port ${PORT}`)} )