
    var mongoose = require('mongoose');
    var Schema = mongoose.Schema;
    var GamesSchema = new Schema({"name":{"type":"String"},"id":{"type":"Number","index":true,"default":null}});
    var Games = mongoose.model('GamesModel', GamesSchema, 'Games');
    exports.addEntry = function(newEntry, callback) {return Games.create(newEntry, callback)};
    exports.showAllEntries = function(callback) {return Games.find(callback);};  
    exports.updateEntries = function(query, update, callback){return Games.findOneAndUpdate(query, update, callback);};  
    exports.getEntry = function(query, callback){return Games.findOne(query, callback);};
    exports.deleteEntry = function(query, callback){return Games.findOneAndRemove(query, callback);};  
    