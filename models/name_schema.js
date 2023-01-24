const { default: mongoose } = require("mongoose"); 

//the schema for a user object to be saved in the database - here it just consists of a name
const nameSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true
        }
 });

 //these schemas are saved in the 'techdemos' collection in the database
 const nameModel = mongoose.model('TechDemo', nameSchema);
 module.exports = nameModel;