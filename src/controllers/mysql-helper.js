/**数据库封装2018-4-12-Cqy*/
var mysql=require('mysql');
var sql={};
//连接参数配置
var pool  = mysql.createPool({
    host     : '61.155.4.150',   // 数据库地址
    user     : 'root',    // 数据库用户
    password : 'ycyl2018',   // 数据库密码
    port:3306,
    database : 'ycyl'  // 选中数据库
});

sql.query = function( sql, values ) {
    return new Promise(( resolve, reject ) => {
        pool.getConnection(function(err, connection) {
            if (err) {
                reject( err )
            } else {
                connection.query(sql, values, ( err, rows) => {

                    if ( err ) {
                        reject( err )
                    } else {
                        resolve( rows )
                    }
                    connection.release()
                })
            }
        })
    })
}

module.exports=sql;