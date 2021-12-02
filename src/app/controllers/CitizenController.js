const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Citizen = require('../models/Citizen')


class CitizenController {
    // [GET] /citizens
    show(req, res, next) {
        Citizen.find({})
            .then((citizens) => {
                res.json(multipleMongooseToObject(citizens))
            })
            .catch(next);
    };

    // [GET] /citizens/details?CCCD=&firstName=&lastName=
    find(req, res, next) {
        Citizen.find({ $or: [{CCCD: req.query.CCCD}, {firstName: req.query.firstName}, {lastName: req.query.lastName}]})
            .then((citizens) => {
                res.json(multipleMongooseToObject(citizens))
            })
            .catch(next);
    }

    // [GET] /citizens?CCCD=
    showByCCCD(req, res, next) {
        Citizen.findOne({ CCCD: req.params.CCCD})
            .then((citizen) => {
                res.json(mongooseToObject(citizen))
            })
            .catch(next);
    }

    // [POST] /citizens/store
    store(req, res, next) {
        const citizen = new Citizen(req.body);
        citizen.save()
            .then(() => res.json(mongooseToObject(citizen)))
            .catch(next);
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
