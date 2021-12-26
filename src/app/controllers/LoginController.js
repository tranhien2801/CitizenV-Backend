const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const JWT_KEY = "UETcitizenV";
const bcrypt = require('bcryptjs');

class LoginController {

    /*---------------------------------------------------------------------------------------------------------------------
        Các API GET của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    
    // [GET] /register    : hiển thị đăng kí
    g_register(req, res) {
        res.render('units/register', {layout: 'loginLayout'});
    }

    // [GET] /login
    g_login(req, res) {
        res.render('units/login', {layout: 'loginLayout'});
    }

    // [GET] /allocate
    g_allocate(req, res) {
        res.render('units/addUnit');
    }

    // [GET] /
    home(req, res) {
        res.render('home')
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API POST của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/


    // [POST] /
    login(req, res) {
        try {
            const { code, password } = req.body;
            Unit.findByCredentials(code.trim(), password.trim())
                .then(unit => {
                    if ( unit == "Mã đơn vị không tồn tại trong hệ thống" || unit == "Mật khẩu không đúng") {
                        return res.status(401).json({status: unit});
                    }
                    unit.generateAuthToken()
                        .then(token => {
                            req.session.token = token;
                            res.json({status:"Success", code: unit.code, token});
                        })
                })
        } catch (error) {
            res.status(401).json({status: "Mã đơn vị hoặc mật khẩu không đúng"})
        }
    }


    // [POST] /allocate?idParent= 
    async allocate(req, res, next) {
        try {
            if (req.body.password != req.body.confirmPass) 
                return res.status(400).json({status: "Mật khẩu xác nhận không trùng khớp"});
            if (new Date(req.body.timeEnd) < Date.now()) 
                return res.status(400).json({status: "Thời gian hết hạn khai báo không hợp lệ"});
            if (req.body.password) await req.body.password.trim();
            const unit = new Unit(req.body);
            if (req.query.idParent == "") req.query.idParent = null;
            const checkExist = await Unit.findOne({idParent: req.query.idParent, nameUnit: req.body.nameUnit});
            if (checkExist != null) {
                res.status(400).json({status: "Đã có đơn vị này trong hệ thống"});
                return;
            }
            const maxSibling = await Unit.find({idParent: req.query.idParent}).sort({ code: -1}).limit(1);
            var countSibling = 1;
            if (maxSibling.length != 0) {
                countSibling = parseInt(maxSibling[0].code.substring(maxSibling[0].code.length - 2, maxSibling[0].code.length)) + 1;
            }
            var idPar = "";
            if (req.query.idParent != 'A01')  idPar = await Unit.findOne({code: req.query.idParent});
            if (idPar != "") {
                if (countSibling >= 10)    unit.code = idPar.code + countSibling;
                else unit.code = idPar.code + '0' + countSibling;
            } else {
                if (countSibling >= 10)    unit.code = countSibling;
                else unit.code = '0' + countSibling;
            }
            unit.idParent = req.query.idParent;
            unit.save()
                .then(() => res.json({
                    unit,
                    status: "Thêm đơn vị con thành công!",
                }))
                .catch(() => res.status(400).json({status: "Mật khẩu phải có độ dài ngắn nhất là 8"}))
        } catch (next) {
            res.status(400).json({status: "Đơn vị này không có trong hệ thống"});
        }
    }

    // [POST] /logout
    logout(req, res, next) {
        try {
            req.session.destroy(function(err) {
                res.redirect('/login');
            })
        } catch (error) {
            res.status(500).send(error);
        }
    }
}

module.exports = new LoginController();
