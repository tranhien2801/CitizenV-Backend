const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const City = require('../models/City');
const mongoose = require('mongoose');

const filterItems = (arr, query) => {
    return arr.filter(el => el.Name.toLowerCase().indexOf(query.toLowerCase()) !== -1)
  }

class CityController {

    
    // [GET] /city
    showAll(req, res, next) {
        City.find({})
            .then((cities) => {  
                if (cities != null)
                    res.json(multipleMongooseToObject(cities))
                else res.status(404).json( {message: "Không có tỉnh nào trong hệ thống"})
            })
            .catch(next);
        
    }

    // [GET] /city?cityName=
    findCity(req, res, next) {
        City.find({ Name: {'$regex': req.query.cityName }})
            .then((cities) => { 
                if (cities != null)        
                    res.json(multipleMongooseToObject(cities))
                else res.status(404).json( {message: "Không tìm thấy tỉnh nào phù hợp"})
            })
            .catch(next);

        // City.find({})
        //     .then((cities) => {  
        //         const disFilter = filterItems(cities, req.params.Name);
        //         res.json(multipleMongooseToObject(disFilter))
        //     })
        //     .catch(next);
    }
    

    // [GET] /city/district?districtName=
    findDistrict(req, res, next) {
        City.findOne( { 'Districts.Name': {'$regex':  req.query.districtName}} )
            .then((cities) => { 
                if (cities != null)  {
                    const disFilter = filterItems(cities.Districts, req.query.districtName);
                    res.json(disFilter);
                } else {
                    res.status(404).json({message: "Không tìm thấy huyện nào phù hợp"})
                }
            })
            .catch(next);
        
    }

    // [GET] /city/ward?cityName=&districtName=&wardName=
    findWard(req, res, next) {
        City.findOne( { 'Districts.Name': {'$regex':  req.query.districtName}} )
            .then((cities) => {  
                if (cities != null)  {
                    const disFilter = filterItems(cities.Districts, req.query.districtName);
                    for (const dis of disFilter) {
                        const wardFilter = filterItems(dis.Wards, req.query.wardName);
                        if (wardFilter!= null) res.json(wardFilter);
                    }
                } else {
                    res.status(404).json({message: "Không tìm thấy xã nào phù hợp"})
                }
            })
            .catch(next);
    }

    // [UPDATE] /city/population-of-ward
    populationWard(req, res, next) {
       // const ward = City.Districts.id('1ab9e7f9e487f6b93b3f732');
    //    City.findById(mongoose.Types.ObjectId("61ab88285dda198ab9920fd9"))
    //         .then((city) => {
    //             const dis = city.Districts.find({ city.Districts.Id: "001"});
    //             res.json(dis)
    //         })
    //         .catch(next);
    }


    
}

module.exports = new CityController();
