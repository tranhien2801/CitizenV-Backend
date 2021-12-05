const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Citizen = require('../models/Citizen')


class CitizenController {
    // [GET] /citizens
    show(req, res, next) {
        Citizen.find({})
            .then((citizens) => {
                if (citizens != null)
                    res.json(multipleMongooseToObject(citizens))
                else res.status(404).json( {message: "Hiện tại, hệ thống chưa có công dân nào"})
            })
            .catch(next);
    };

    // [GET] /citizens/details?CCCD=&firstName=&lastName=
    find(req, res, next) {
        Citizen.find({ $or: [{CCCD: req.query.CCCD}, {firstName: req.query.firstName}, {lastName: req.query.lastName}]})
            .then((citizens) => {
                if (citizens != null)
                    res.json(multipleMongooseToObject(citizens))
                else res.status(404).json( {message: "Không tìm thấy công dân phù hợp"})                
            })
            .catch(next);
    }

    // [GET] /citizens/:CCCD
    showByCCCD(req, res, next) {
        Citizen.findOne({ CCCD: req.params.CCCD})
            .then((citizen) => {
                if (citizens != null)
                    res.json(mongooseToObject(citizen))
                else res.status(404).json( {message: "Không tìm thấy công dân phù hợp"})                
            })
            .catch(next);
    }

    // [POST] /citizens/store/:addressID
    store(req, res, next) {      
        const citizen = new Citizen(req.body);
        citizen.addressID = req.params.addressID;
        citizen.save()
            .then(() => {
                res.json(mongooseToObject(citizen))
            })
            .catch(next => res.status(400).json({message: "CCCD đã có trong hệ thống"}));
    }

    // [PUT] /citizens?CCCD=
    update(req, res, next) {
        Citizen.updateOne({ CCCD: req.body.CCCD}, req.body)
            .then(() => res.json(req.body))
            .catch(next);
    }

    // [DELETE] /citizens/:CCCD
    destroy(req, res, next) {
        Citizen.delete({ CCCD: req.params.CCCD })
            .then(() => res.json({ message: "Delete Citizen Successfull"}))
            .catch(next);
    }

    // [DELETE] /citizens/:CCCD/force
    forceDestroy(req, res, next) {
        Citizen.deleteOne({ CCCD: req.params.CCCD })
            .then(() => res.json({ message: "Delete Force Citizen Successfull"}))
            .catch(next);
    }

    // [PATCH] /citizens/:CCCD/restore
    restore(req, res, next) {
        Citizen.restore({ CCCD: req.params.CCCD })
            .then(() => res.json({ message: "Restore Citizen Successfull"}))
            .catch(next);
    }


};

module.exports = new CitizenController();
