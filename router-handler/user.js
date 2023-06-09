const db = require('../db/index') // 项目db对象（mysql）
const bcrypt = require('bcryptjs') // 加密模块
const jwt = require('jsonwebtoken') // jwt生成 token
const config = require('../config') // 全局常量
const { check, validationResult } = require('express-validator');
exports.register = (req, res) => {
    // 账号密码字段校验
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.cc('用户名或密码填写有误!')
    }
    const userInfo = req.body
    const sql = 'select * from ev_users where username=?'
    db.query(sql, userInfo.username, (err, results) => {
        if (err) {
            return res.cc('执行sql失败！')
        }
        if (results.length > 0) {
            return res.cc('用户名被占用，请更换其他用户名！')
        }
        // 下一步操作
        userInfo.password = bcrypt.hashSync(userInfo.password, 10)
        const registerSql = 'insert into ev_users set ?'
        db.query(registerSql, {
            username: userInfo.username,
            password: userInfo.password,
        }, 
        (err, results) => {
            if (err) {
                return res.cc(err) 
            }
            if (results.affectedRows !== 1) {
                return res.cc('注册用户失败！请重试~') 
            }
            res.cc('注册用户成功！', 0) 
        })
        
    })
}

exports.login = (req, res) => {
    const userInfo = req.body
    // 账号密码字段校验
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.cc('用户名或密码错误!')
    }
    // 查询用户名
    const userQuery = 'select * from ev_users where username=?'
    db.query(userQuery, userInfo.username, (err, results) => {
        if (err) {
            return res.cc('执行sql失败！')
        }
        if (results.length !== 1) {
            return res.cc('登录失败！')
        }
        // 密码校验
        const compareResult = bcrypt.compareSync(userInfo.password, results[0].password)
        if (!compareResult) {
            return res.cc('登录失败！')
        }
        // 生成token
        const user = { ...results[0], password: '', user_pic: '' }
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        })
        res.send({
            status: 0,
            message: '登录成功！',
            token: `Bearer ${tokenStr}`
        })
    })
}