var Router = require('koa-router');
var rt=new Router();
var mssql=require('../src/controllers/mssql-helper');
var mysql=require('../src/controllers/mysql-helper');

rt.get('/',async(ctx, next) => {
    //MSSQL
    mssql.querySql('select * from [User]',"",function(err, result){
        console.dir(result);
    });
    //MYSQL
    let dataList = await mysql.query('SELECT * FROM t_dept where id="6f614220210811e8944f7faa904251e7"');
    console.log(dataList);
    await ctx.render('index', { title : "csfds3"});
});

module.exports = rt;