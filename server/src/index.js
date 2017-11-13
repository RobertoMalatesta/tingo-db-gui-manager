var express = require('express')
var tungus =  require('tungus')
var mongoose = require('mongoose')
var bodyParser = require('body-parser')
var morgan = require('morgan')
var cors = require('cors')
var schemaroutes = require('./routes/Schemas')
var collectionroutes = require('./routes/Collections')
// Express app and the middleware
const app = express()
app.use(cors())
app.use(bodyParser.json())
app.use(morgan('combined'))

// Database connect
mongoose.connect('tingodb://'+__dirname+'/db', function (err) {
    if (err) throw err;
});

// Schema Schema
app.use('/schemas', schemaroutes);
app.use('/', collectionroutes)

app.listen(8000, () => console.log('The app has started at port: '+8000) )