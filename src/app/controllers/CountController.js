const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen');

class CountController {

    // [GET] /statistic/code
    statistic(req, res) {
        res.render('statistic/statistic', {code: "/" + req.params.code + "/"});
    }

    // [GET] /statistic/:code/gender
    async filterGender(req, res) {
        try {

            const units = await Unit.find({idParent: req.params.code});
            var male = [];
            var female = [];
            var nameUnit = [];
            for (var i = 0; i < units.length; i++) {
                nameUnit.push(units[i].nameUnit);
                const totalMale = await Citizen.count({
                    addressID: { $regex: '^' + units[i].code},
                    sex: 'Nam',
                });
                male.push(totalMale);
                const totalFemale = await Citizen.count({
                    addressID: { $regex: '^' + units[i].code},
                    sex: 'Nữ',
                });
                female.push(totalFemale);
            }
             res.json({nameUnit, male, female});
        } catch(err) {
            res.render(err);
        }
    }

    // [GET] /statistic/:code/population
    async filterPopulation(req, res) {
        try {

            const units = await Unit.find({idParent: req.params.code});
            var population = [];
            var nameUnit = [];
            for (var i = 0; i < units.length; i++) {
                nameUnit.push(units[i].nameUnit);
                const popu = await Citizen.count({addressID: { $regex: '^' + units[i].code}});
                population.push(popu);
            }
             res.json({nameUnit, population});

        } catch(err) {
            res.render(err);
        }
    }

    // [GET] /statistic/:code/ageTower
    async filterAge(req, res) {
        try {
            const yearNow = new Date(Date.now()).getFullYear();
            var male = [];
            var female = [];
            for ( var i = 0; i <= 75; i = i+5) {
                const maleAge = await Citizen.count({
                        addressID: { $regex: '^' + req.params.code },
                        sex: 'Nam',
                        dob: {
                            $gte: new Date(yearNow - i - 4 , 1, 1),
                            $lt: new Date(yearNow - i + 1, 1, 1)
                        }
                    });
                male.push(maleAge);
            }
            const maleAge = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                sex: 'Nam',
                dob: {
                    $gte: new Date(yearNow - 130 , 1, 1),
                    $lt: new Date(yearNow - 79, 1, 1)
                }
            });
            male.push(maleAge);

            for ( var i = 0; i <= 75; i = i+5) {
                const femaleAge = await Citizen.count({
                        addressID: { $regex: '^' + req.params.code },
                        sex: 'Nữ',
                        dob: {
                            $gte: new Date(yearNow - i - 4 , 1, 1),
                            $lt: new Date(yearNow - i + 1, 1, 1)
                        }
                    });
                female.push(femaleAge);
            }    
            const femaleAge = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                sex: 'Nữ',
                dob: {
                    $gte: new Date(yearNow - 130 , 1, 1),
                    $lt: new Date(yearNow - 79, 1, 1)
                }
            });
            female.push(femaleAge);      
           res.json({male, female});  
        } catch (error) {
            res.status(400).json(error);
        }
    }

}


module.exports = new CountController();


