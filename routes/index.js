const Router = require('koa-router');
const rt=new Router();
const {isProduction} = require("../webpack.variable");

rt.get('/',async(ctx, next) => {
    await ctx.render('index', { title : "测试",isProduction:isProduction});
});

module.exports = rt;