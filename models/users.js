/*
* 用户Model
* */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const userSchema = new Schema({
  "userId":{type:String},
  "username":{type:String},
  "password": {type:String}
});

module.exports = mongoose.model('Users', userSchema);

