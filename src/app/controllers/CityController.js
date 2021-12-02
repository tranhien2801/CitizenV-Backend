const { multipleMongooseToObject } = require('../../util/mongoose');
const City = require('../models/City');

class CityController {
    // [GET] /city
    show(req, res, next) {
        City.find({Name: 'Thành phố Hà Nội'})
            .then((city) => {              
                res.json(multipleMongooseToObject(city))
            }
            )
            .catch(next);
    }
}

module.exports = new CityController();
