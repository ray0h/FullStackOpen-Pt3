const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const url = process.env.MONGODB_URI

mongoose.set('useCreateIndex', true)

console.log('...connecting to mongoDB')
mongoose.connect(url, { useNewUrlParser : true, useUnifiedTopology: true })
  .then( () => {
    console.log('connected to mongoDB')
  })
  .catch((err) => {
    throw(err)
  })

const personSchema = new mongoose.Schema ({
  name: {
    type: String,
    required : true,
    minlength: 3,
    unique: true
  },
  number: {
    type: String,
    required: true,
    minlength: 8
  }
})

personSchema.plugin(uniqueValidator,  { message: 'Error, expected {PATH} to be unique.' })

personSchema.set('toJSON', {
  transform: (doc, retObj) => {
    retObj.id = retObj._id.toString()
    delete retObj._id
    delete retObj.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
