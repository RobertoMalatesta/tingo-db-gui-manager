var router = require('express').Router()
var {
    addSchema,
    getSchema,
    deleteSchema
} = require('../modelsgui/Schemas')
var fs = require('fs')
var path = require('path')
var Models = require('../models')

router.get('/admin', (req, res) => {
    res.send({
        message: 'Welcome to the database. Start by making a new Collection on the left side.'
    })
})

router.get('/admin/:collection', (req, res) => {
    Models[req.params.collection].showAllEntries((err, allEntries) => {
        if (err) console.log(err)
        else {
            console.log('This gets executed')
            console.log(allEntries)
            res.json({
                entries: allEntries
            })
        }
    })
})

router.post('/admin/add', (req, res) => {
    Models[req.body.collection].addEntry(req.body.entry, (err, entry) => {
        console.log('/admin/'+req.body.collection)
        if (err) console.log(err)
        else res.redirect('/admin/' + req.body.collection)
    })
})

router.put('/update', (req, res) => {
    Models[req.body.collection].updateEntries(req.body.query, req.body.update, (err, entry) => {
        if (err) console.log(err)
        else res.redirect('/admin/' + req.body.collection)
    })
})

router.post('/delete', (req, res) => {
    Models[req.body.collection].deleteEntry(req.body.query, (err, entry) => {
        if (err) console.log(err)
        else res.redirect('/admin/' + req.body.collection)
    })
})

router.post('/newcollection', (req, res) => {
    let {
        collectionName,
        schemaType
    } = req.body
    console.log(schemaType)
    console.log(path.join(__dirname, "../models/" + collectionName + ".js"))
    fs.writeFileSync(path.join(__dirname, "../models/" + collectionName + ".js"), `
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var ${collectionName}Schema = new Schema(${JSON.stringify(schemaType)});
    var ${collectionName} = mongoose.model('${collectionName}Model', ${collectionName}Schema, '${collectionName}');
    exports.addEntry = function(newEntry, callback) {return ${collectionName}.create(newEntry, callback)};
    exports.showAllEntries = function(callback) {return ${collectionName}.find(callback);};  
    exports.updateEntries = function(query, update, callback){return ${collectionName}.findOneAndUpdate(query, update, callback);};  
    exports.getEntry = function(query, callback){return ${collectionName}.findOne(query, callback);};
    exports.deleteEntry = function(query, callback){return ${collectionName}.findOneAndRemove(query, callback);};  
    `)

    let allCollections = fs.readdirSync(path.join(__dirname, '../models'))
    allCollections = allCollections.map(col => col.slice(0, col.length - 3)).filter(col => col !== 'index')
    fs.writeFileSync(path.join(__dirname, '../models/index.js'), `
    ${allCollections.map(col=>("var "+col+ " = " + "require('./"+col + "');")).join("\n")}
    module.exports = {${allCollections.map(col=>col+": "+col).join(',')}}
    `)
    addSchema(collectionName, schemaType, (err, result) => {
        if (err) console.log(err)
        else res.send(result)
    })
})

router.get('/allcollections', (req, res) =>
    res.send(fs.readdirSync(path.join(__dirname, '../models')).map(col => col.slice(0, col.length - 3)).filter(col => col !== 'index'))
)

router.post('/deletecollection', (req, res) => {
    fs.unlink(path.join(__dirname, "../models/" + req.body.collectionName + ".js"), (err) => {
        if (err) console.log(err)
        else {
            deleteSchema(req.body.collectionName, function (err, result) {
                if (err) console.log(err);
                console.log(result)
            })

            if (fs.readdirSync(path.join(__dirname, '../db')).find((e) => e === req.body.collectionName)) {
                fs.unlink(path.join(__dirname, "../db/" + req.body.collectionName))
            }
            let allCollections = fs.readdirSync(path.join(__dirname, '../models'))
            allCollections = allCollections.map(col => col.slice(0, col.length - 3)).filter(col => col !== 'index')
            fs.writeFileSync(path.join(__dirname, '../models/index.js'), `
              ${allCollections.map(col=>("var "+col+ " = " + "require('./"+col + "');")).join("\n")}
              module.exports = {${allCollections.map(col=>col+": "+col).join(',')}}
            `)
            res.json(allCollections)
        }
    })
})

module.exports = router