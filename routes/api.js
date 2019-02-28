var Router = require('koa-router');
var rt=new Router();
var mssql=require('../src/controllers/mssql-helper');
var mysql=require('../src/controllers/mysql-helper');


rt.post('/savejson',async(ctx, next) => {
  let postParam = ctx.request.body;
  console.log(postParam)
  ctx.body = "保存成功";
});

rt.get('/mssql',async(ctx, next) => {
     //MSSQL
     let dataList = await mssql.querySql('select * from [User]',"",function(err, result){});
     ctx.body = dataList;
});

rt.get('/mysql',async(ctx, next) => {
   //MYSQL
   let dataList = await mysql.query('SELECT * FROM t_dept where id="6f614220210811e8944f7faa904251e7"');
   ctx.body = dataList;
});

module.exports = rt;