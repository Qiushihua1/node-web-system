const express = require('express')
// 创建路由对象
const router = express.Router()
const userHandler = require('../router-handler/user')

const { check, validationResult } = require('express-validator');
const userFormCheck = [
    check('username').isLength({ min: 2 }),
    check('password').isLength({ min: 2 }),
]

// 注册
router.post('/register', userFormCheck, userHandler.register)

// 登录
router.post('/login', userFormCheck, userHandler.login)


module.exports = router