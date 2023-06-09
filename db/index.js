const mysql = require('mysql') // mysql 模块

const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'admin123',
    database: 'my_db_1'
})

module.exports = db