const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen')
const mongoose = require('mongoose');


class UnitController {

    // [POST] /units/store?idParent= 
    async store(req, res, next) {
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
            if (countSibling > 10)    unit.code = idPar.code + countSibling;
            else unit.code = idPar.code + '0' + countSibling;
        } else {
            if (countSibling > 10)    unit.code = countSibling;
            else unit.code = '0' + countSibling;
        }
        unit.idParent = req.query.idParent;
        unit.save()
            .then(() => res.json(unit))
            .catch(next);
    }

    
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

    // [PUT] /units/:id
    update(req, res, next) {
        Unit.updateOne({_id: req.params.id}, req.body)
            .then((unit) => {
                res.json(unit);
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}));
    }

    // [DELETE] /units/:id
    destroy(req, res, next) {
        Unit.deleteOne({ _id: req.params.id })
            .then((unit) => res.json(unit))
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}));
    }

}

module.exports = new UnitController();

