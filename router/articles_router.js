const express = require('express');

const router = express.Router();

const conn = require('../util/sql')

router.get('/artinfo', (req, res) => {
    const { state, category } = req.query;

    let sql = []
    if (state) {
        sql.push(`state="${state}"`)
    }
    if (category) {
        sql.push(`name="${category}"`)
    }
    sql = sql.join(' and ');
    const sqlStr = `select title,state,date,categories.name from categories,articles where categories.id=articles.categoryId and ${sql}`
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "获取文章数据失败！"
            })
            return
        }
        res.json({
            "status": 0,
            "message": "获取文章数据成功！",
            "data": result
        })
    })
})

router.

module.exports = router;