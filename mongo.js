const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log("enter password and/or object as arguments")
    process.exit()
}

const password = process.argv[2]

const url = `mongodb+srv://macchi0h:${password}@cluster0-iwduy.mongodb.net/phonebook?retryWrites=true`
//&w=majority

mongoose.connect(url, { useNewUrlParser : true, useUnifiedTopology: true })

const personSchema = new mongoose.Schema ({
    name: String,
    number: String,
})

const Person = mongoose.model("Person", personSchema)

if (process.argv.length === 3) {
    Person.find({}).then(results => {
        console.log("Phonebook:")
        results.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })
}
if (process.argv.length === 5) {
    const name = process.argv[3]
    const number = process.argv[4]
    const person = new Person ({
        name : name,
        number : number,
    })

    person.save().then(() => {
        console.log("new person saved to db")
        mongoose.connection.close()
    })
}