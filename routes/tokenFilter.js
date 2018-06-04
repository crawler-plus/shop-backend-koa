const config = require('../config/config')
const jwt = require('jsonwebtoken')

module.exports = async (ctx, next) => {
    let oriUrl = ctx.url
    for(let eachUrl of config.noJwtApis) {
        if(oriUrl.indexOf(eachUrl) > -1) {
            await next()
            return
        }
    }
    // 定义一个变量，判断token是否合法
    let invalidToken = false
    // 获取头信息中的Authorization
    const {authorization} = ctx.header
    // 如果头信息为空
    if(authorization === 'null'){
        invalidToken = true
    }else {
        try {
            //  解密jwt
            let result = jwt.verify(authorization, config.jwtSecret)
            let {exp} = result, current = Date.now()
            // jwt过期
            if(current - exp > config.jwtExpTimeMillis) {
                invalidToken = true
            }else { // 通过jwt检测
                await next()
                return
            }
        }catch (e) {
            invalidToken = true
        }
    }
    if(invalidToken) {
        ctx.status = 401
    }
}
