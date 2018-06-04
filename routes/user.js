/**
 * 用户controller
 */
const router = require('koa-router')()
const config = require('../config/config')
const jwt = require('jsonwebtoken')
const User = require('../models/users');

router.prefix(`${config.baseApi}`)

router.post('/users/login', async ctx => {
    const {userName, userPwd} = ctx.request.body
    let param = {
        username : userName,
        password : userPwd
    }
    let result = await User.findOne(param)
    // 如果查不出数据
    if(!result) {
        ctx.body = {
            status: '1'
        }
        return
    }
    let signData = {
        userId : result.userId,
        username : result.username
    }
    // 生成jwt并且返回前端
    let jwtToken = jwt.sign({
        signData,
        exp: Date.now() + config.jwtExpTimeMillis // 设置有效期
    }, config.jwtSecret)
    ctx.body = {
        status: '0',
        result:{
            token : jwtToken,
            userName: signData.username
        }
    }
})

router.get('/users/checkLogin', async ctx => {
    // 获取头信息中的Authorization
    const {authorization} = ctx.header;
    //  解密jwt
    let result = jwt.verify(authorization, config.jwtSecret)
    // 得到当前的用户名称
    let username = result.signData.username
    ctx.body = {
        status:'0',
        result: username
    }
})

module.exports = router
