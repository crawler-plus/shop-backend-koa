/**
 * 全局配置文件
 */
const config = {
    baseApi : '/api',
    jwtSecret : 'it4u',
    mongoConnString : 'mongodb://localhost:27017/dumall',
    jwtExpTimeMillis : 1000 * 60 * 60, // jwt 有效期：1小时
    // 不需要校验token的接口
    noJwtApis : [
        "/api/product/list",
        "/api/users/login"
    ],
    cartBusinessId : '01',
    addressBusinessId : '02',
    orderBusinessId : '03',
    orderDetailBusinessId : '04'
}

module.exports = config