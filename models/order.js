/*
* 订单Model
* */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderSchema = new Schema({
  "orderId": {type:String},
  "orderTotal" : {type:Number},
  "addressId" : {type:String},
  "userId" : {type:String},
  "orderStatus" : {type:String},
  "createDate" : {type:Number}
});

module.exports = mongoose.model('Orders', orderSchema);

