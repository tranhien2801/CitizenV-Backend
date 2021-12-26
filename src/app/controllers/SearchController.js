const { multipleMongooseToObject } = require('../../util/mongoose');
const Citizen = require('../models/Citizen');
const {dateFormat} = require('../../util/formatDate');



class SearchController {

    // [GET] /search/unit/:code?CCCD=&name=&dob=&sex=&perResidence=
    async find(req, res, next) {    
        try {
            if (req.params.code == "A01") req.params.code = "";
            const deletedCount = await Citizen.countDocumentsDeleted({addressID: { $regex: '^' + req.params.code}});
            if (req.query.CCCD.trim() != "") {
                var citizens = await Citizen.find({
                    CCCD: req.query.CCCD.trim(),
                    addressID : { $regex: '^' + req.params.code }
                });                
            } else {
                var citizens;
                if (req.query.dob.trim() == "") {
                    citizens = await Citizen.find({ 
                        addressID : { $regex: '^' + req.params.code },
                        sex: { $regex: '^' + req.query.sex.trim()},
                        name: { $regex: '^' + req.query.name.trim()},
                        perResidence: { $regex: '^' + req.query.perResidence.trim()},
                    });
                } else {
                    var day = req.query.dob.slice(0, 2);
                    var month = req.query.dob.slice(3, 5);
                    var year = req.query.dob.slice(6, 10);
                    var date = year + '-' + month + '-' + day;
                    citizens = await Citizen.find({ 
                        addressID : { $regex: '^' + req.params.code },
                        sex: { $regex: '^' + req.query.sex.trim()},
                        name: { $regex: '^' + req.query.name.trim()},
                        perResidence: { $regex: '^' + req.query.perResidence.trim()},
                        dob: new Date(date)
                    });
                }
            }
            for (var i = 0; i < citizens.length; i++) {
                citizens[i].date = dateFormat(citizens[i].dob);
            }
            res.render('citizens/listPerson', {
                citizens: multipleMongooseToObject(citizens),
                deletedCount
            })  
        } catch (error) {
            res.status(400).json({message: "Không tìm thấy công dân phù hợp"});
        }
    }


     // [GET] /search/:_id
     showByCCCD(req, res, next) {
        Citizen.findOne({ _id: req.params._id})
            .then((citizen) =>   {             
                res.json(citizen);     
            })
            .catch(next=> res.status(404).json( {message: "Không tìm thấy công dân phù hợp"}));
    }



}

module.exports = new SearchController();
