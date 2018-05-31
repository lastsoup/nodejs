var Router = require('koa-router');
var rt=new Router();
var sql=require('../src/controllers/mssql-helper');
var sql2=require('../src/controllers/mysql-helper');

rt.get('/',async(ctx, next) => {
    /* sql.query('select * from Ananas_User where ID=3939731393',function(data){
        console.dir(data);
    });

    let dataList = await sql2.query('SELECT * FROM t_dept');
    console.log(dataList);
    */
    await ctx.render('index', { title : "csfds"});
});

module.exports = rt;