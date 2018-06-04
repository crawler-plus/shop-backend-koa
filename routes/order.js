/**
 * 订单controller
 */
const router = require('koa-router')()
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const Order = require('../models/order')
const OrderDetail = require('../models/orderDetail')
const Cart = require('../models/carts')

router.prefix(`${config.baseApi}`)

// 下订单
router.post("/order/payMent", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 得到addressId和订单总金额
    let {addressId, orderTotal} = ctx.request.body
    // 异常情况
    if(!addressId || orderTotal === 10) {
        ctx.body = {
            status: '1'
        }
        return
    }
    // 生成订单id
    let orderId = `${config.orderBusinessId}_${Date.now()}`
    // 保存信息到订单表
    await Order.create({
        orderId,
        orderTotal,
        addressId,
        userId,
        orderStatus: '1',
        createDate: Date.now()})
    // 查询购物车表中选定的商品
    let cartList = await Cart.find({userId: {$eq: userId}, checked: '1'})
    // 订单详情前缀索引号
    let orderDetailIndex = 0
    // 插入到orderDetail表中的数组（待拼装）
    let insertOrderDetailArr = []
    for(let cart of cartList) {
        let obj = {}
        orderDetailIndex++
        let {productId, productNum} = cart
        let productInfo = {
            productId,
            productNum
        }
        // 扩展obj的属性
        Object.assign(obj, productInfo, {orderDetailId: `${config.orderDetailBusinessId}_${Date.now()}_${orderDetailIndex}`}, {orderId: orderId})
        insertOrderDetailArr.push(obj)
    }
    // 批量插入数据到orderDetail表
    await OrderDetail.insertMany(insertOrderDetailArr);
    // 删除购物车表中已经购买的数据
    await Cart.deleteMany({userId: {$eq: userId}, checked: '1'})
    ctx.body = {
        status: '0',
        result: {
            orderId : orderId,
            orderTotal : orderTotal
        }
    }
})

// 获取订单信息
router.get("/order/orderDetail", async ctx => {
    let{orderId} = ctx.query
    // 查询orderId和orderTotal
    let order = await Order.findOne({ orderId: orderId });
    let {orderTotal} = order
    ctx.body = {
        status: '0',
        result: {
            orderId,
            orderTotal
        }
    }
})



module.exports = router
