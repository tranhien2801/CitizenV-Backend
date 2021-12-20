const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen');

const dateFormat = (date) => {
    var day = date.getDate();
    if (day < 10) day = '0' + day;
    var month = date.getMonth() + 1;
    if ( month < 10) month = '0' + month;
    var year = date.getFullYear();
    const dateFormat = day + '/' + month + '/' + year;
    return dateFormat;
}

const filterItems = (arr, perResidence, name) => {
    return arr.filter(el => {
        if (el.perResidence != null) {
        el.perResidence.toLowerCase().indexOf(perResidence.toLowerCase()) !== -1
                            && el.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
        } else {
            el.name.toLowerCase().indexOf(name.toLowerCase()) !== -1;
        }
    })
  }

class SearchController {

    // [GET] /search/citizens?CCCD=&name=&dob=&sex=&perResidence=
    // async find(req, res, next) {    
    //     try {
    //         const citizen = await Citizen.find({CCCD: req.query.CCCD.trim()});
    //         if (citizen != null) {
    //             // res.render('citizens/listPerson', {
    //             //     citizen: mongooseToObject(citizen),
    //             // });
    //             res.json(req.query.CCCD)
    //             res.json(multipleMongooseToObject(citizen));
    //         } else {
    //             const citizens = await Citizen.find({name: req.query.name.trim()});
    //             res.json(multipleMongooseToObject(citizens));
    //             // res.render('citizens/listPerson', {
    //             //     citizen: multipleMongooseToObject(citizens),
    //             // });
    //         }
    //     } catch (error) {
    //         res.status(400).json({message: "Không tìm thấy công dân phù hợp"});
    //     }
    // }

    find(req, res) {
        Citizen.find({CCCD: req.query.CCCD.trim()})
            .then(citizen => {
                if (citizen != '')
                return res.json(multipleMongooseToObject(citizen));
                Citizen.find({})
                    .then(citizens => {
                        const filterCitizen = filterItems(citizens, req.query.perResidence, req.query.name);
                        res.json(multipleMongooseToObject(filterCitizen));
                    })
            })
            .catch(() => {
                
            })
    }

     // [GET] /search/:CCCD
     showByCCCD(req, res, next) {
        Citizen.findOne({ CCCD: req.params.CCCD})
            .then((citizen) =>   {
                var date = dateFormat(citizen.dob);              
                citizen.date = date;
                res.json(citizen);     
            })
            .catch(next=> res.status(404).json( {message: "Không tìm thấy công dân phù hợp"}));
    }



}

module.exports = new SearchController();
