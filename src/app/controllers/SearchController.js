const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen');


class SearchController {

    // [GET] /search/citizens?CCCD=&name=
    async find(req, res, next) {    
        try {
            const citizen = await Citizen.findOne({CCCD: req.query.CCCD.trim()});
            if (citizen != null) {
                // res.render('citizens/listPerson', {
                //     citizen: mongooseToObject(citizen),
                // });
                res.json(req.query.CCCD)
                res.json(mongooseToObject(citizen));
            } else {
                const citizens = await Citizen.find({name: req.query.name.trim()});
                res.json(multipleMongooseToObject(citizens));
                // res.render('citizens/listPerson', {
                //     citizen: multipleMongooseToObject(citizens),
                // });
            }
        } catch (error) {
            res.status(404).json( error, {message: "Không tìm thấy công dân phù hợp"});
        }
    }




}

module.exports = new SearchController();
