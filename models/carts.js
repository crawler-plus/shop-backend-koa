/*
* 购物车Model
* */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const cartSchema = new Schema({
  "cartId": {type:String},
  "productId" : {type:String},
  "productNum" : Number,
  "checked" : {type:String},
  "userId" : {type:String}
});

module.exports = mongoose.model('Cart', cartSchema);

