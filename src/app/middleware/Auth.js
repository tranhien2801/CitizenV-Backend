const jwt = require('jsonwebtoken');
const Unit = require('../models/Unit');
const JWT_KEY = "UETcitizenV";

class Auth {
    async auth (req, res, next) {
        if (!req.session.token) { 
           // return res.status(400).json('Chưa có token');
           return res.redirect('/login');
        }
        try {
            var token = req.session.token; 
            const data = jwt.verify(token, JWT_KEY);
            const unit = await Unit.findOne({ code: data.code });
            if (!unit) {
                throw new Error();
            }
            req.unit = unit;
            req.token = token;
            req.role = data.role;
            next();
        } catch (error) {
            res.status(401).send({ error: 'Bạn không có quyền truy cập vào trang này' });
        }

    }

    // Phân quyền của tài khoản được phép thống kê số liệu
    authA123B1 (req, res, next) {
        if (['A1','A2','A3','B1'].includes(req.role))
            next();
        else res.status(401).json("Bạn không phải là A1 hoặc A2 hoặc A3 hoặc B1");
    }

    // Phân quyền của tài khoản được phép nhập liệu
    authB1B2 (req, res, next) {
        if (['B1', 'B2'].includes(req.role))
            next();
        else res.status(401).json("Bạn không phải là B1 hoặc B2");
    }
}

module.exports = new Auth();