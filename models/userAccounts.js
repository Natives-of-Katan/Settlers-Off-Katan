const { default: mongoose } = require("mongoose"); 

//the schema for a user object to be saved in the database
const userAccount = new mongoose.Schema({
        username: {
            type: String,
            required: true
        },
        password: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        settlerWins: {
            type: Number,
            required: false
        },
        settlerLosses: {
            type: Number,
            required: false
        },
        nativeWins: {
            type: Number,
            required: false
        },
        nativeLosses: {
            type: Number,
            required: false
        },
        sessionID: {
            type: String,
            required: false
        }

 });

 //these schemas are saved in the 'techdemos' collection in the database
 const nameModel = mongoose.model('UserAccount', userAccount);
 module.exports = nameModel;