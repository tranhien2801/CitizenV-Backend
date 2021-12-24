const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen');
const dateFormat = require('../../util/formatDate');
const {filterPerResidence} = require('../../util/filter');
const {filterName} = require('../../util/filter');
const {filterDoB} = require('../../util/filter');


class SearchController {

    // [GET] /search/unit/:code?CCCD=&name=&dob=&sex=&perResidence=
    async find(req, res, next) {    
        try {
            const deletedCount = await Citizen.countDocumentsDeleted({addressID: { $regex: '^' + req.params.code}});
            if (req.query.CCCD.trim() != "") {
                var citizens = await Citizen.find({
                    CCCD: req.query.CCCD.trim(),
                    addressID : { $regex: '^' + req.params.code }
                });
                
                res.render('citizens/listPerson', {
                    citizens: multipleMongooseToObject(citizens),
                    deletedCount
                })  
                
            } else {
                var citizens;
                if (req.query.sex.trim() != "") {
                    citizens = await Citizen.find({
                        sex: req.query.sex.trim(),
                        addressID : { $regex: '^' + req.params.code }
                    });
                } else {
                    citizens = await Citizen.find({addressID : { $regex: '^' + req.params.code }});
                }
                if (req.query.name.trim() != "")  citizens = filterName(citizens, req.query.name);
                console.log(req.query.dob);
                console.log(new Date("2001-06-23"));
                if (req.query.dob.trim() != "")   citizens = filterDoB(citizens, req.query.dob);
                if (req.query.perResidence.trim() != "") citizens = filterName(citizens, req.query.perResidence);

                res.render('citizens/listPerson', {
                    citizens: multipleMongooseToObject(citizens),
                    deletedCount
                })  
            }
        } catch (error) {
            res.status(400).json({message: "Không tìm thấy công dân phù hợp"});
        }
    }

    // find(req, res) {
    //     Citizen.find({CCCD: req.query.CCCD.trim()})
    //         .then(citizen => {
    //             if (citizen != '')
    //             return res.json(multipleMongooseToObject(citizen));
    //             Citizen.find({})
    //                 .then(citizens => {
    //                     const filterCitizen = filterItems(citizens, req.query.perResidence, req.query.name);
    //                     res.json(multipleMongooseToObject(filterCitizen));
    //                 })
    //         })
    //         .catch(() => {
                
    //         })
    // }

     // [GET] /search/:CCCD
     showByCCCD(req, res, next) {
        Citizen.findOne({ CCCD: req.params.CCCD})
            .then((citizen) =>   {             
               // citizen.date = dateFormat(citizen.dob);   
                res.json(citizen);     
            })
            .catch(next=> res.status(404).json( {message: "Không tìm thấy công dân phù hợp"}));
    }



}

module.exports = new SearchController();
