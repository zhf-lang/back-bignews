const express = require('express');

const router = express.Router();
const jwt = require('jsonwebtoken');
router.use(express.urlencoded())

const conn = require('../util/sql')
router.post('/reguser', (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);

    const sqlStr = `select * from users where username="${username}" `
    console.log(sqlStr);

    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({ message: '请求失败' });
            return
        }
        if (result.length > 0) {
            res.json({ message: '用户名已被占用' });
            return
        }

        const sql = `insert into users (username,password) values ("${username}","${password}")`;
        console.log('sql');
        conn.query(sql, (err, result) => {
            if (err) {
                res.json({ message: '注册失败', status: '1' });
                return
            }

            res.json({ message: '注册成功', status: '0' });
        })
    })


})

router.post('/login', (req, res) => {
    const { username, password } = req.body;

    const sql = `select * from users where username="${username}" and password="${password}"`;
    console.log(sql);
    conn.query(sql, (err, result) => {
        if (err) {
            res.json({ message: '登录失败', status: '1' });
            return
        }
        if (result.length > 0) {
            const tokenStr = jwt.sign({ name: username }, 'heima61', { expiresIn: 2 * 360 * 360 });
            const token = 'Bearer ' + tokenStr
            res.json({ message: '登录成功', status: '0', token });
        } else {
            res.json({ message: '用户名密码不正确' });
        }
    })

})

module.exports = router;