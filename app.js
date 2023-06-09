const express = require('express')
const app = express()

// cors 跨域处理中间件
const cors = require('cors')
app.use(cors())

// 解析表单数据中间件
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

// 错误处理中间件
app.use((req, res, next) => {
    res.cc = (err, status = 1) => {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next()
})

// jwt token解析中间件
const { expressjwt: jwt } = require('express-jwt')
const config = require('./config')
app.use(jwt({
    secret: config.jwtSecretKey,
    algorithms: ['HS256']
}).unless({
    path: [/^\/api\//]  // unless 正则匹配不用token认证的接口
}))

// 导入用户路由模块
const userRouter = require('./router/user')
app.use('/api', userRouter)


// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 身份验证失败的错误
    if (err.name === 'UnauthorizedError') {
        return res.cc('身份认证失败！')
    }
    // 未知错误
    res.cc(err)
})

// 服务端口监听
app.listen(3007,() => {
    console.log('express server is running at http://127.0.0.1:3007');
})