var mongoose =require('mongoose');
var Schema = mongoose.Schema;


var alexaLogSchema = new Schema({
	input: String,
	output:String,
    timestmp:String
})
module.exports =  mongoose.model('alexaLog',alexaLogSchema);