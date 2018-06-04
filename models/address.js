/*
* 地址Model
* */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const addressSchema = new Schema({
  "addressId": {type:String},
  "userName" : {type:String},
  "streetName" : {type:String},
  "postCode" : {type:String},
  "tel" : {type:String},
  "isDefault" : {type:Boolean},
  "userId" : {type:String}
});

module.exports = mongoose.model('Addresses', addressSchema);

