const express = require('express');

const router = express.Router();
const multer = require('multer');
router.use(express.urlencoded())
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads_art');
    },
    filename: function (req, file, cb) {
        console.log('file', file)

        cb(null, file.originalname) //  + "." +filenameArr[filenameArr.length-1]);
    }
})

var upload = multer({ storage })


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
    const sqlStr = `select title,state,date,categories.name from categories,articles where categories.id=articles.categoryId and isDelete=0 and ${sql}`
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

router.get('/artdel', (req, res) => {
    const { id } = req.query;

    const sql = `update articles set isDelete=1 where id=${id}`
    conn.query(sql, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "删除文章数据失败！"
            })
            return
        }
        res.json({
            "status": 0,
            "message": "删除文章数据成功！"
        })
    })
})

router.post('/artadd', (req, res) => {
    const { title, cover, content, state, category } = req.body;

    const date = new Date;
    console.log(date);
    const sqlStr = `select id from categories where name="${category}"`;
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "删除文章数据失败！"
            })
            return
        }
        if (result.length > 0) {
            console.log(result[0].id);
            const sql = `insert into articles (title,cover,content,state,isDelete,
            author,categoryId,date) values("${title}","${cover}"
            ,"${content}","${state}",0,"${req.user.name}","${result[0].id}","${date}")
            `;
            console.log('sql语句：', sql);
            conn.query(sql, (err, result) => {
                if (err) {
                    res.json({
                        "status": 1,
                        "message": "服务器错误！"
                    })
                    return
                }
                res.json({
                    "status": 0,
                    "message": "添加成功！"
                })
            })
        } else {
            res.json({ message: '没有该分类的文章' })
        }
    })
})

router.post('/artupdate', (req, res) => {
    let { id, title, cover, content, state, category } = req.body;
    if (!cover) {
        let sql = `select cover from articles where id=${id}`;
        conn.query(sql, (err, result) => {
            if (err) {
                res.json({
                    "status": 1,
                    "message": "服务器错误！"
                })
                return
            }
            if (result.length > 0) {
                console.log('111', result[0].cover);
                cover = result[0].cover;
                console.log(cover);
            }
        })
    }


    const sqlStr = `select id from categories where name="${category}"`;
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "修改文章数据失败！"
            })
            return
        }
        if (result.length > 0) {
            console.log(result[0].id);
            let sql = `update articles set title="${title}",cover="${cover}",
            content="${content}",state="${state}",categoryId="${result[0].id}" where id=${id}
            `
            console.log('sql语句：', sql);
            conn.query(sql, (err, result) => {
                if (err) {
                    res.json({
                        "status": 1,
                        "message": "服务器错误！"
                    })
                    return
                }
                res.json({
                    "status": 0,
                    "message": "修改成功！"
                })
            })
        }
    })
})

router.post('/artupload', upload.single('file_data'), (req, res) => {
    res.json({
        "message": "http://127.0.0.1:3001/uploads_art/" + req.file.originalname,
        status: 0
    })
})
module.exports = router;