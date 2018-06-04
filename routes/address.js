/**
 * 地址controller
 */
const router = require('koa-router')()
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const Address = require('../models/address')

router.prefix(`${config.baseApi}`)

// 列出地址列表
router.get("/address/addressList", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    let addressList = await Address.find({userId: {$eq: userId}})
    ctx.body = {
        status: '0',
        result: addressList
    }
})

// 设置默认地址
router.post("/address/setDefault", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 得到addressId
    let {addressId} = ctx.request.body
    // 将用户所有地址先设为false
    await Address.updateMany({userId: userId}, {$set: {isDefault: false}})
    // 更新为默认地址
    await Address.updateOne({addressId: addressId}, {$set: {isDefault: true}})
    ctx.body = {
        status: '0'
    }
})

// 删除地址
router.post("/address/delAddress", async ctx => {
    // 得到addressId
    let {addressId} = ctx.request.body
    // 删除这个地址
    await Address.deleteOne({addressId: addressId})
    ctx.body = {
        status: '0'
    }
})

// 添加地址
router.post("/address/addAddress", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 得到addressId
    let {userName, streetName, postCode, tel} = ctx.request.body
    // 添加该商品到购物车
    await Address.create({
        addressId: `${config.addressBusinessId}_${Date.now()}`,
        userName,
        streetName,
        postCode,
        tel,
        isDefault: false,
        userId
    })
    ctx.body = {
        status: 0
    }
})

module.exports = router
