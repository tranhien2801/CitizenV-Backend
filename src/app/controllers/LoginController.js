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

    // [POST] /signup
    async signup(req, res) {
        try {
            if (req.body.code == 'A01') {
                const unit = Unit.findOne({code: req.body.code});
                if (unit != null) {
                    await unit.save();
                    res.redirect('units/login', {layout: 'loginLayout'});
                } 
            } 
            res.redirect('units/register', {layout: 'loginLayout'});
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    // [POST] /
    login(req, res) {
        try {
            const { code, password } = req.body;
            Unit.findByCredentials(code.trim(), password.trim())
                .then(unit => {
                    if ( unit == null) {
                        res.status(401).json({status: "Mã đơn vị hoặc mật khẩu không đúng"});
                        return;
                    }
                    unit.generateAuthToken()
                        .then(token => {
                            req.session.token = token;
                            res.json({status:"Success", code: unit.code, token});
                            // res.render('home',{ 
                            //     status:"Success",
                            //     code: unit.code, 
                            //     token 
                            // })
                        })
                })
        } catch (error) {
            res.status(401).json({status: "Mã đơn vị hoặc mật khẩu không đúng"})
        }
    }


    // [POST] /allocate?idParent= 
    async allocate(req, res, next) {
        try {
            if (req.body.password) await req.body.password.trim();
            const unit = new Unit(req.body);
            if (req.query.idParent == "") req.query.idParent = null;
            const checkExist = await Unit.findOne({idParent: req.query.idParent, nameUnit: req.body.nameUnit});
            if (checkExist != null) {
                res.status(400).json({message: "Đã có đơn vị này trong hệ thống"});
                return;
            }
            const maxSibling = await Unit.find({idParent: req.query.idParent}).sort({ code: -1}).limit(1);
            var countSibling = 1;
            if (maxSibling.length != 0) {
                countSibling = parseInt(maxSibling[0].code.substring(maxSibling[0].code.length - 2, maxSibling[0].code.length)) + 1;
            }
            const idPar = await Unit.findOne({code: req.query.idParent});
            if (idPar != null) {
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
                    status: "Success",
                }))
                .catch(() => res.status(400).json({status: "Mật khẩu không đúng định dạng"}))
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
