/*
* 订单详情Model
* */

const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const orderDetailSchema = new Schema({
  "orderDetailId": {type:String},
  "orderId" : {type:String},
  "productId" : {type:String},
  "productNum" : {type:Number}
});

module.exports = mongoose.model('OrderDetails', orderDetailSchema);

