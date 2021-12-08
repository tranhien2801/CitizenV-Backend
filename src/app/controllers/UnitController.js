const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen')
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');


class UnitController {

    /*---------------------------------------------------------------------------------------------------------------------
        Các API GET của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    // [GET] /units/:code
    show(req, res, next) {
        Unit.findOne({code: req.params.code})
            .then((unit) => {
                Citizen.count({addressID: { $regex: '^' + unit.code}})
                    .then((totalPopulation) => {
                        unit.population = totalPopulation;
                        res.json(unit);
                    })                     
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}))
    }

    // [GET] /units/population/:code
    async population(req, res, next) {
        Unit.findOne({code: req.params.code})
            .then((unit) => {
                Citizen.count({addressID: { $regex: '^' + unit.code}})
                    .then((totalPopulation) => {
                        res.json(totalPopulation);
                    })
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}))
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API POST của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/

    // [POST] /units/store?idParent= 
    async store(req, res, next) {
        try {
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
            const idPar = await Unit.findOne({_id: req.query.idParent});
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

    // [POST] /units/login
    async login(req, res, next) {
        try {
            const { code, password } = req.body;
            const unit = await Unit.findByCredentials(code, password)
            if (!unit) {
                return res.status(401).send({error: 'Login failed! Check authentication credentials'})
            }
            const token = await unit.generateAuthToken()
            res.send({ unit, token })
        } catch (next) {
            res.status(400).send(next)
        }
    }

    // [POST] /units/logout
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
 
    /*---------------------------------------------------------------------------------------------------------------------
        Các API PUT của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    
    // [PUT] /units/:id
    async update(req, res, next) {
        req.body.password = await bcrypt.hash(req.body.password, 8);
        Unit.updateOne({_id: req.params.id}, req.body)
            .then(() => {
                res.json(req.body);
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}));
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API DELETE của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/

    // Xóa đơn vị con và công dân của đơn vị con khi đơn vị cha bị xóa
    async destroyChild(idParent) {
        try {
            const units = await Unit.find({idParent: idParent});
            await Unit.delete({idParent: idParent});
            for (var unit in units) {
                await Citizen.delete({ addressId: unit._id});
                destroyChild(unit._id);
            }
            res.json({
                status: 200,
                message: "Xóa đơn vị con và công dân của đơn vị con thành công",
                idParent: idParent, 
            });
            
        } catch (errorr) {
            res.status(400).json({message: "Lỗi khi xóa công dân của đơn vị con"});
        }
    }


    // [DELETE] /units/:id
    async destroy(req, res, next) {
        // await destroyChild(req.params.id);
        // Unit.delete({ _id: req.params.id })
        //     .then(() => {
        //         Citizen.delete({addressID: req.params.id})
        //             .then(() => {
        //                 res.json({
        //                     status: 200,
        //                     message: "Xóa đơn vị, công dân thành công",
        //                     idUnit: req.params.id,
        //                 });
        //             })
        //     })
        //     .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}));
    }

    
    /*---------------------------------------------------------------------------------------------------------------------
        Các API PATCH của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    // [PATCH] /units/:id/restore
    restore(req, res, next) {
        Unit.restore({$or: [{ _id: req.params.id }, {idParent: req.params.id}]})
            .then(() => {
                Citizen.restore({addressID: req.params.id})
                    .then(() => res.json({ 
                        status: 200,
                        message: "Khôi phục đơn vị, công dân thành công",
                        idUnit: req.params.id,
                    }))
            })
            .catch(next);
    }

}

module.exports = new UnitController();

