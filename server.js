const Koa = require('koa'),
    ServeStatic = require('koa-static'),
    config = require('./webpack.config'),
    webpack = require('webpack'),
    { devMiddleware, hotMiddleware } = require('koa-webpack-middleware'),
    {output, server, buildDir} = require("./webpack.variable"),
    app = new Koa();

/**加载路由Start 注：无路由默认起始页面inde.html*/
var Router = require('koa-router');
var rt=new Router();
var path = require('path');
var views = require('koa-views');
var swig = require('swig');
app.use(views(path.join(__dirname, './views'),{  extension: 'html',map: { html: 'swig' }}));
var index = require('./routes/index');
rt.use('/', index.routes());
app.use(rt.routes());
/**加载路由End*/

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
