const mongoose = require('mongoose');

const postModel = mongoose.Schema({
  title: {type : String, required : true},
  description: {type : String, required : true},
  image: {type : String, required : true},
  creator: {type : mongoose.Schema.Types.ObjectId, ref : "authModel", required: true}
});

module.exports = mongoose.model('Post',postModel);
