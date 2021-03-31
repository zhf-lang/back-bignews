const express = require('express');
const sql = require('../util/sql');

const router = express.Router();

const conn = require('../util/sql')
router.get('/cates', (req, res) => {

    let sqlStr = `select * from categories`;
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "获取文章分类列表失败！",
            })
            return
        }
        res.json({
            "status": 0,
            "message": "获取文章分类列表成功！",
            "data": result
        })
    })
})

router.post('/addcates', (req, res) => {

    const { slug, name } = req.body;

    let sql = `insert into categories (slug,name) values("${slug}","${name}")`;
    console.log(sql);
    conn.query(sql, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "新增文章分类失败！"
            })
            return
        }
        res.json({
            "status": 0,
            "message": "新增文章分类成功！"
        })
    })
})

router.get('/deletecate', (req, res) => {

    const { id } = req.query;

    const sqlStr = `delete from categories where id=${id}`;
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "删除文章分类失败！"
            })
            return
        }
        res.json({
            "status": 0,
            "message": "删除文章分类成功！"
        })
    })
})


router.get('/getCatesById', (req, res) => {
    const { name } = req.query;
    const sqlStr = `select * from categories where name="${name}"`;
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "获取文章分类数据失败！"
            })
            return
        }
        res.json({
            "status": 0,
            "message": "获取文章分类数据成功！",
            "data": result
        })
    })
})

router.post('/updatecate', (req, res) => {
    const { id, name, slug } = req.body;
    let updatesql = [];
    if (name) {
        updatesql.push(`name="${name}"`)
    }
    if (slug) {
        updatesql.push(`slug="${slug}"`);
    }
    updatesql = updatesql.join();
    const sqlStr = `update categories set ${updatesql} where id=${id}`;
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "更新分类信息失败！"
            })
            return
        }
        res.json({
            "status": 0,
            "message": "更新分类信息成功！"
        })
    })
})
module.exports = router;