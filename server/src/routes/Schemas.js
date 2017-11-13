var router = require('express').Router()
var {addSchema, getSchema, deleteSchema, getAllSchema} = require('../modelsgui/Schemas')

router.get('/', (req,res)=>{
    getAllSchema((err,schemas)=>{
        res.json(schemas)
    })
})

router.get('/:schemaname', (req, res) => {
    getSchema(req.params.schemaname, (err, schemaname) => {
        res.json(schemaname)
    })
})


router.post('/add', (req,res) => {
    addSchema(req.body.collectionName, req.body.schemaType, (err, result) => {
        if(err) console.log(err)
        else res.json(result)
    })
})

router.post('/delete', (req, res)=> {
    deleteSchema(req.body.collectionName, (err, result) => {
        if(err) console.log(err)
        else res.json(result)
    })
})

module.exports = router