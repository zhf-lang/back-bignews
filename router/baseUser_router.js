const express = require('express');

const router = express.Router();
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
        console.log('file', file)

        cb(null, file.originalname) //  + "." +filenameArr[filenameArr.length-1]);
    }
})

var upload = multer({ storage })

router.use(express.urlencoded())

const conn = require('../util/sql')
router.get('/userinfo', (req, res) => {

    // const { username } = req.query;
    // token里面第一个参数传了用户名之后，
    // 这里可以不用传用户名参数就能从req.user.name获取到用户名
    // 直接放到sql语句中就可以直接执行
    console.log(req.user);

    let sqlStr = `select * from users where username="${req.user.name}"`;
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "获取用户基本信息失败！"
            })
            return;
        }
        res.json({
            "status": 0,
            "message": "获取用户基本信息成功！",
            "data": result
        })
    })
})
router.post('/update_userinfo', (req, res) => {

    const { id, nickname, email, userPic } = req.body;

    let updatesql = []
    if (nickname) {
        updatesql.push(`nickname="${nickname}"`)
    }
    if (email) {
        updatesql.push(`email="${email}"`)
    }
    if (userPic) {
        updatesql.push(`userPic="${userPic}"`)
    }
    let updatesqlStr = updatesql.join();

    let sqlStr = `update users set ${updatesqlStr} where id=${id}`;
    console.log(sqlStr);
    conn.query(sqlStr, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "修改用户信息失败！"
            })
            return;
        }
        res.json({
            "status": 0,
            "message": "修改用户信息成功！"
        })
    })
})

router.post('/uploadPic', upload.single('file_data'), (req, res) => {
    console.log(req.file);

    res.json({
        "status": 0,
        "message": "http://127.0.0.1:3001/uploads/" + req.file.originalname
    })

})

router.post('/updatepwd', (req, res) => {
    const { oldPwd, newPwd, id } = req.body;

    sqlOld = `select * from users where id=${id} and password="${oldPwd}"`;
    conn.query(sqlOld, (err, result) => {
        if (err) {
            res.json({
                "status": 1,
                "message": "服务器错误"
            })
            return
        }
        if (result.length > 0) {

            sqlNew = `update users set password="${newPwd}" where id=${id}`
            console.log(sqlNew);
            conn.query(sqlNew, (err, result) => {
                if (err) {
                    res.json({
                        "status": 1,
                        "message": "服务器错误1"

                    })
                    return
                }
                res.json({
                    "status": 0,
                    "message": "更新密码成功！"
                })
            })
        } else {
            res.json({
                "status": 1,
                "message": "原密码输入错误"
            })
        }
    })
})

module.exports = router;