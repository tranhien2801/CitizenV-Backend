const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen')
const mongoose = require('mongoose');


class UnitController {

    // [POST] /units/store/:idParent
    async store(req, res, next) {
        const unit = new Unit(req.body);
        const checkExist = await Unit.findOne({idParent: req.params.idParent, nameUnit: req.body.nameUnit});
        if (checkExist != null) {
            res.status(400).json({message: "Đã có đơn vị này trong hệ thống"});
            return;
        }
        const maxChild = await Unit.find({idParent: req.params.idParent}).sort({ code: -1}).limit(1);
        const countChild = parseInt(maxChild[0].code.substring(maxChild[0].code.length - 2, maxChild[0].code.length)) + 1;
     // res.json(countChild);
        const idPar = await Unit.findOne({_id: req.params.idParent});
        if (idPar != null) {
            if (countChild > 10)    unit.code = idPar.code + countChild;
            else unit.code = idPar.code + '0' + countChild;
        } else {
            if (countChild > 10)    unit.code = countChild;
            else unit.code = '0' + countChild;
        }
        unit.idParent = req.params.idParent;
        unit.save()
            .then(() => res.json(unit))
            .catch(next);
    }

    // [GET] /units/:code
    show(req, res, next) {
        Unit.findOne({code: req.params.code})
            .then((unit) => {
                switch (unit.code.length) {
                    case 6:
                        Citizen.count({addressID: unit.code})
                            .then((totalPopulation) => {
                                unit.population = totalPopulation;
                                res.json(unit); 
                            })
                        break;
                    case 4: case 2:
                        Citizen.count({addressID: { $regex: unit.code}})
                            .then((totalPopulation) => {
                                unit.population = totalPopulation;
                                res.json(unit);
                            })
                        break; 
                    default:
                        res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"})
                }
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}))
    }

    // [GET] /units/population/:code
    async population(req, res, next) {
        Unit.findOne({code: req.params.code})
            .then((unit) => {
                switch (unit.code.length) {
                    case 6:
                        Citizen.count({addressID: unit.code})
                            .then((totalPopulation) => {
                                res.json(totalPopulation);
                            })
                        break;
                    case 4: case 2:
                        Citizen.count({addressID: { $regex: unit.code}})
                            .then((totalPopulation) => {
                                res.json(totalPopulation);
                            })
                        break; 
                    default:
                        res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"})
                }
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

}

module.exports = new UnitController();

