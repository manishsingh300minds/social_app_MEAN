const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const authModel = mongoose.Schema({
    email: {type : String, required : true, unique: true},
    password: {type : String, required : true},
});

authModel.plugin(uniqueValidator);

module.exports = mongoose.model('Auth',authModel);
