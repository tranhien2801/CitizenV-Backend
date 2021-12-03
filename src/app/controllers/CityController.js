const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const City = require('../models/City');



class CityController {

    
    // [GET] /city
    showAll(req, res, next) {
        City.find({})
            .then((cities) => {  
                res.json(multipleMongooseToObject(cities))
            })
            .catch(next);
        
    }

    // [GET] /city/:Name
    findCity(req, res, next) {
        City.find({ Name: {'$regex': req.params.Name }})
            .then((cities) => {              
                res.json(multipleMongooseToObject(cities))
                //res.json(name);
            })
            .catch(next);
    }

    // [GET] /city?districtName=
    findDistrict(req, res, next) {
        City.findOne( { 'Districts.Name':  req.query.districtName} )
            .then((cities) => {  
                const dis = cities.Districts.filter( function (dis) {
                    return dis.Name === req.query.districtName;
                }).pop();
                res.json(dis);
            })
            .catch(next);
        
    }

    // [GET] /city?wardName=
    findWard(req, res, next) {
        City.findOne( { 'Districts.Wards.Name':  req.query.wardName} )
            .then((cities) => {  
                const ward = cities.Districts.Wards.filter( function (ward) {
                    return ward.Name === req.query.districtName;
                }).pop();
                res.json(ward);
            })
            .catch(next);
    }

    
}

module.exports = new CityController();
