const Koa = require('koa'),
    ServeStatic = require('koa-static'),
    config = require('./webpack.config'),
    webpack = require('webpack'),
    { devMiddleware, hotMiddleware } = require('koa-webpack-middleware'),
    {output, server, buildDir,isProduction} = require("./webpack.variable"),
    path = require('path'),
    app = new Koa();

/**加载路由Start 注：无路由默认起始页面inde.html*/
var Router = require('koa-router');
var rt=new Router();
var views = require('koa-views');
var swig = require('swig');
app.use(views(path.join(__dirname, './views'),{  extension: 'html',map: { html: 'swig' }}));
var index = require('./routes/index');
rt.use('/', index.routes());
app.use(rt.routes()).use(rt.allowedMethods());
/**加载路由End*/
/*错误页处理Start*/
if(isProduction){
app.use(ServeStatic(buildDir));
app.use(async (ctx) => {
    switch (ctx.status) {
      case 404:
         ctx.body="404";
        break;
      case 500:
        //await ctx.render('500');
        ctx.body="500";
        break;
    }
  })
}
/*错误页处理End*/
/**热加载Start 注：实现热加载自动刷新，修改代码及时呈现到浏览器上*/
const compiler = webpack(config);
config.entry.unshift("webpack-hot-middleware/client?reload=true");

app.use(devMiddleware(compiler, {
    noInfo: true,
    publicPath: output.publicPath,
}));

app.use(hotMiddleware(compiler, {
}));

app.use(ServeStatic(buildDir));
/**热加载End*/


app.listen(server.post, () => {
    console.log(`服务器启动成功：${server.host + ":" + server.post}`)
});
