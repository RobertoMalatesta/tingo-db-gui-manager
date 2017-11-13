var mongoose = require('mongoose')

var Schema = mongoose.Schema

var SchemaSchema = new Schema({
  "collectionName": String,
  "schemaType": String
}) 

var SchemaModel = mongoose.model('Schema', SchemaSchema, 'Schema')

exports.getAllSchema = function(callback) {
    return SchemaModel.find({}, callback);
}

exports.addSchema = function (collectionName, schemaType, callback) { 
    return SchemaModel.create({
        collectionName: collectionName, 
        schemaType: JSON.stringify(schemaType)
    }, 
    callback
    );
};

exports.getSchema = function (collectionName, callback) { 
    return SchemaModel.find({collectionName}, callback);
};

exports.deleteSchema = function (collectionName, callback) {
    console.log(collectionName)
    return SchemaModel.findOneAndRemove({collectionName}, callback);
};
