const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen');

class CountController {

    // [GET] /statistic
    statistic(req, res) {
        res.render('statistic/statistic');
    }

    // [GET] /statistic/:code/career
    async filterCareer(req, res) {
        try {
            var career = [];
            var number = [];
            const unit = await Unit.findOne({code: req.params.code});
            const numberCareer2 = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                job: 'Công nhân',
            });
            number.push(numberCareer2);
            career.push('Công nhân');

            const numberCareer3 = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                job: 'Nông dân',
            });
            number.push(numberCareer3);
            career.push('Nông dân');

            const numberCareer4 = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                job: 'Công chức',
            });
            number.push(numberCareer4);
            career.push('Công chức');

            const numberCareer5 = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                job: 'Kỹ sư',
            });
            number.push(numberCareer5);
            career.push('Kỹ sư');

            const numberCareer6 = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                job: 'Học sinh/ Sinh viên',
            });
            number.push(numberCareer6);
            career.push('Học sinh/ Sinh viên');

            const numberCareer1 = await Citizen.count({
                addressID: { $regex: '^' + req.params.code },
                job: 'Tự do',               
            });
            number.push(numberCareer1);
            career.push('Tự do');
            
            res.json({name: unit.nameUnit, career, number});
        } catch(err) {
            res.render(err);
        }
    }

    // [GET] /statistic/:code/gender
    async filterGender(req, res) {
        try {
            const unitParent = await Unit.findOne({code: req.params.code});
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
             res.json({nameUnit, male, female, name: unitParent.nameUnit});
        } catch(err) {
            res.render(err);
        }
    }

    // [GET] /statistic/:code/population
    async filterPopulation(req, res) {
        try {
            const unitParent = await Unit.findOne({code: req.params.code});
            const units = await Unit.find({idParent: req.params.code});
            var population = [];
            var nameUnit = [];
            for (var i = 0; i < units.length; i++) {
                nameUnit.push(units[i].nameUnit);
                const popu = await Citizen.count({addressID: { $regex: '^' + units[i].code}});
                population.push(popu);
            }
             res.json({nameUnit, population, name: unitParent.nameUnit});

        } catch(err) {
            res.render(err);
        }
    }

    // [GET] /statistic/:code/ageTower
    async filterAge(req, res) {
        try {
            const unitParent = await Unit.findOne({code: req.params.code});
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
           res.json({male, female, name: unitParent.nameUnit});  
        } catch (error) {
            res.status(400).json(error);
        }
    }

}


module.exports = new CountController();


