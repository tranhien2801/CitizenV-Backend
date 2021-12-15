const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');


class LoginController {

    /*---------------------------------------------------------------------------------------------------------------------
        Các API GET của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    
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
    async login(req, res, next) {
        try {
            const { code, password } = req.body;
            const unit = await Unit.findByCredentials(code.trim(), password.trim());
            const token = await unit.generateAuthToken();
            res.render('home',{ 
                code: unit.code, 
                token 
            })
        } catch (next) {
            res.status(401).redirect('back');
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
            await unit.save();
            const token = await unit.generateAuthToken();
            res.status(201).json({unit, token});
        } catch (next) {
            res.status(400).json({message: "Đơn vị này không có trong hệ thống"});
        }
    }

    // [POST] /logout
    async logout(req, res, next) {
        // try {
        //     req.unit.tokens = req.unit.tokens.filter((token) => {
        //         return token.token != req.token;
        //     })
        //     await req.unit.save();
        //     res.send({ message: "Logout successful!"});
        // } catch (error) {
        //     res.status(500).send(error);
        // }
    }
}

module.exports = new LoginController();
