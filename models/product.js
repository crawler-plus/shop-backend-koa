/*
* 商品Model
* */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const productSchema = new Schema({
  "productId":{type:String},
  "productName":{type:String},
  "salePrice":Number,
  "productImage":String
});

module.exports = mongoose.model('Products',productSchema);

