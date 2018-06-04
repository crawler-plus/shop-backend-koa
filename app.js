/**
 * 全局入口文件
 */
const Koa = require('koa')
const app = new Koa()
const json = require('koa-json')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')
const cors = require('koa-cors')
const mongoose = require('mongoose')
const config = require('./config/config')
const tokenFilter = require('./routes/tokenFilter')

const product = require('./routes/product')
const user = require('./routes/user')
const cart = require('./routes/cart')
const address = require('./routes/address')
const order = require('./routes/order')

mongoose.connect(config.mongoConnString)
mongoose.connection
  .on("connected",function () {
    console.log("mongodb connected success");
}).on("error",function () {
    console.log("mongodb connected fail");
}).on("disconnected",function () {
    console.log("mongodb connected disconnected");
})

// 请求到来之前执行的一些列中间件
app.use(bodyparser())
    .use(json())
    .use(logger())
    .use(cors())
    .use(tokenFilter) // jwt过滤器
    .use(product.routes(), product.allowedMethods())
    .use(user.routes(), user.allowedMethods())
    .use(cart.routes(), cart.allowedMethods())
    .use(address.routes(), address.allowedMethods())
    .use(order.routes(), order.allowedMethods())

module.exports = app
