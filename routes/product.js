/**
 * 商品controller
 */
const router = require('koa-router')()
const config = require('../config/config')
const Product = require('../models/product');

router.prefix(`${config.baseApi}`)

router.get('/product/list', async ctx => {
    let{page, pageSize, priceChecked, sort} = ctx.query
    let skip = (parseInt(page) - 1) * parseInt(pageSize)
    let params = {};
    /*价格区间*/
    let priceGt = '';
    let priceLte = '';
    if(priceChecked !== 'all'){
        switch(priceChecked){
            case '0': priceGt = 0;priceLte = 100;break;
            case '1': priceGt = 100;priceLte = 500;break;
            case '2': priceGt = 500;priceLte = 1000;break;
            case '3': priceGt = 1000;priceLte = 5000;break;
        }
        params = {
            salePrice:{
                $gt:priceGt,
                $lte:priceLte
            }
        }
    }
  /*排序*/
    let results = await Product.find(params).skip(skip).limit(parseInt(pageSize)).sort({'salePrice':sort})
    ctx.body = {
        status: '0',
        result:{
            count: results.length,
            list: results
        }
    }
})


module.exports = router
