/**
 * 购物车controller
 */
const router = require('koa-router')()
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const Cart = require('../models/carts');
const Product = require('../models/product')

router.prefix(`${config.baseApi}`)

router.post("/cart/add", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 得到商品id
    let {productId} = ctx.request.body
    let cartProductCount = await Cart.count({userId: userId, productId: productId})
    // 如果商品还没有加入购物车
    if(!cartProductCount) {
        // 添加该商品到购物车
        await Cart.create({cartId: `${config.cartBusinessId}_${Date.now()}`, productId: productId, productNum: 1, checked: 0, userId: userId})
    }else {
        // 更新购物车的商品数量+1
        await Cart.updateOne({userId: userId, productId: productId}, {$inc: {productNum: 1}})
    }
    ctx.body = {
        status: '0'
    }
})

// 列出购物车商品
router.get("/cart/cartList", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 先查购物车表
    let cartList = await Cart.find({userId: {$eq: userId}})
    // 最终拼装好的结果
    let finalCartList = []
    // 如果购物车列表有数据
    if(cartList) {
        // 查出商品列表
        let productList = await Product.find({})
        // 循环cartList
        for(let cart of cartList) {
            // 循环商品列表
            for(let product of productList) {
                // 如果购物车项目中的商品id和购物车中的商品id相同
                if(cart.productId === product.productId) {
                    let cartObj = {
                        productId: cart.productId,
                        productNum: cart.productNum,
                        checked: cart.checked
                    }
                    let {productImage, productName, salePrice} = product
                    let assignedObj = {
                        productImage,
                        productName,
                        salePrice
                    }
                    // 要被扩展的对象
                    let c = {};
                    Object.assign(c, cartObj, assignedObj)
                    finalCartList.push(c)
                    break
                }
            }
        }
    }
    ctx.body = {
        status:'0',
        result: finalCartList
    }
})

// 得到购物车商品总数量
router.get("/cart/getCartCount", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    let cartList = await Cart.find({userId: {$eq: userId}})
    let count = 0
    if(cartList) {
        for(let cart of cartList) {
            count += parseInt(cart.productNum)
        }
    }
    ctx.body ={
        status:'0',
        result: count
    }
})

// 删除商品
router.post("/cart/cartDel", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 得到商品id
    let {productId} = ctx.request.body
    // 删除购物车表中该用户对应的某个购物项
    await Cart.deleteOne({productId: {$eq: productId}, userId:{$eq: userId} })
    ctx.body = {
        status:'0'
    }
})

/*加减购物车*/
router.post("/cart/cartEdit", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 得到商品id
    let {productId, productNum, checked} = ctx.request.body
    // 更新购物车表中该用户对应的某个购物项
    await Cart.updateOne({userId: userId, productId: productId}, {$set: {productNum: productNum, checked: checked}})
    ctx.body = {
        status:'0'
    }
})


/*全选*/
router.post("/cart/editCheckAll", async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户id
    let userId = result.signData.userId
    // 得到商品checkAll
    let {checkAll} = ctx.request.body
    // 删除购物车表中该用户对应的某个购物项
    await Cart.updateMany({userId: userId}, {$set: {checked: checkAll ? 1 : 0}})
    ctx.body = {
        status:'0'
    }
})

module.exports = router
