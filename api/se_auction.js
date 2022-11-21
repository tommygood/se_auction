const router = require('express').Router();
var bodyParser = require("body-parser");
var db = require('mariadb');
//var func = require('../module/func');
var jwt = require('jsonwebtoken');
const pool = db.createPool({
    host : 'localhost',
    user : 'wang',
    password : 'wang313',
    database : 'auction'
});
var config = require("config"); // 設定檔
var root = config.get('server.root'); // 根目錄位置

router.get('/', function(req, res) {
    res.sendFile(root + 'templates/se_login.html');  //回應靜態文件
        return;
});

router.post('/', async function(req, res) {
    let conn = await pool.getConnection();
        try {
            var suc = false;
            var title = null;
            var login_suc = false;
            let user = await conn.query('select no, title title from user');
            for (let i = 0;i < user.length;i++) {
                if (req.body.account == user[i].no) {
                    const data = {title : user[i].title, aId : user[i].no}
                    const token = jwt.sign({ data, exp: Math.floor(Date.now() / 1000) + (60 * 15) }, 'my_secret_key');
                    res.cookie('token', token,  { httpOnly: false, secure: false, maxAge: 3600000 });
                    suc = true;
                    var title = user[i].title;
                }
            }
        }
        catch(e) {
            console.log(e);
        }
    conn.release();
    return res.json({suc : suc, title, title});
    res.end();
});

router.get('/cus', function(req, res) {
    res.sendFile(root + 'templates/se_cus.html');  //回應靜態文件
        return;
});

router.get('/seller', function(req, res) {
    res.sendFile(root + 'templates/se_seller.html');  //回應靜態文件
        return;
});

router.post('/seller', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            await conn.query("insert into obj(`price`) value(?)", req.body.price);
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({suc : suc});
    res.end();
});

router.get('/getObj', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            var obj = await conn.query("select * from obj where `is_settled` = 0");
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({obj : obj});
    res.end();
});

router.get('/getObjHis', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            var obj = await conn.query("select * from obj where `is_settled` = 1");
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({obj : obj});
    res.end();
});

router.get('/getUId', async function(req, res) {
    const user = jwt.verify(req.cookies.token, 'my_secret_key');
    return res.json({user : user.data.aId});
    res.end();
});

router.post('/push', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            await conn.query("insert into subscript(`uId`, `pId`, `price`) value(?, ?, ?)", [req.body.user, req.body.pId, req.body.price]);
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({suc : suc});
    res.end();
});

router.post('/obj_price', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            var all_price = await conn.query("select * from subscript where `pId` = ? order by `price`", req.body.pId);
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    console.log(all_price);
    return res.json({all_price : all_price[all_price.length-1]});
    res.end();
});

router.post('/settle', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            await conn.query("update obj set is_settled = 1 where `no` = ?", req.body.pId);
            await conn.query("insert into seller(`uId`,`pId`, `price`) value(?, ?, ?)", [req.body.user, req.body.pId, req.body.price]);
            await conn.query("insert into buyer(`uId`,`pId`, `price`) value(?, ?, ?)", [req.body.bId, req.body.pId, req.body.price]);
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({suc : suc});
    res.end();
});

router.post('/sellerInsert', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            var seller_obj = await conn.query("select * from seller where `uId` = ?;", req.body.user);
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({seller_obj : seller_obj});
    res.end();
});

router.post('/buyerInsert', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            var seller_obj = await conn.query("select * from buyer where `uId` = ?;", req.body.user);
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({seller_obj : seller_obj});
    res.end();
});

router.post('/startAuction', async function(req, res) {
    let conn = await pool.getConnection();
        var suc = true;
        try {
            console.log(req.body.pId);
            await conn.query("update obj set `start_sell` = 1 where `no` = ?;", req.body.pId);
        }
        catch(e) {
            suc = false;
            console.log(e);
        }
    conn.release();
    return res.json({suc : suc});
    res.end();
});

module.exports = router;
