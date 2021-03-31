const express = require('express');

const server = express();

const cors = require('cors');
server.use(cors());

const baseUserRouter = require('./router/baseUser_router');
const userRouter = require('./router/user_router');
const cateRouter = require('./router/categories_router');
const artRouter = require('./router/articles_router')

const jwt = require('express-jwt');
// app.use(jwt().unless());
// jwt() 用于解析token，并将 token 中保存的数据 赋值给 req.user
// unless() 约定某个接口不需要身份认证
server.use(jwt({
    secret: 'heima61', // 生成token时的 钥匙，必须统一
    algorithms: ['HS256'] // 必填，加密算法，无需了解
}).unless({
    path: ['/api/login', '/api/reguser', /^\/uploads\/.*/] // 除了这两个接口，其他都需要认证
}));

server.use((err, req, res, next) => {
    if (err.name === 'UnauthorizedError') {
        // res.status(401).send('invalid token...');
        res.status(401).send({ status: 1, message: '身份认证失败！' });
    }
});


server.use('/my', baseUserRouter);
server.use('/api', userRouter);
server.use('/my/article', cateRouter);
server.use('/articles', artRouter);

server.listen(3001, () => {
    console.log('数据库已经准备就绪');

})