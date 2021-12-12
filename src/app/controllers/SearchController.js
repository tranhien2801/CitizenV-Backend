const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen');


class SearchController {

    // [GET] /search/citizens?CCCD=&firstName=&lastName=
    async find(req, res, next) {    
        try {
            const citizen = await Citizen.findOne({CCCD: req.query.CCCD});
            if (citizen != null) {
                res.json(mongooseToObject(citizen));
            } else {
                const citizens = await Citizen.find({ $and: [{firstName: req.query.firstName}, {lastName: req.query.lastName}]});
                res.json(multipleMongooseToObject(citizens));
            }
        } catch (error) {
            res.status(404).json( error, {message: "Không tìm thấy công dân phù hợp"});
        }
    }




}

module.exports = new SearchController();
