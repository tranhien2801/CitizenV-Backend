
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen');

const filterCode = function(arr, query) {
    return arr.filter(el => { query.indexOf(el) === 0})
}

class CountController {

    // [GET] /statistic
    statistic(req, res) {
        res.render('statistic/statistic');
    }

    // [GET] /statistic/:code/birthRate
    async filterBirthRate(req, res) {
        try {
            const unitParent = await Unit.findOne({code: req.params.code});
            const yearNow = new Date(Date.now()).getFullYear();
            var years = [];
            var numbers = [];
            // Khi người dùng không chọn đơn vị con nào thì sẽ thống kê tất cả các đơn vị con
            if (req.body.codes.length === 0) {
                for (var i = 0; i < 30; i=i+5) {
                    const number = await Citizen.count({
                        addressID: { $regex: '^' + req.params.code },
                        dob: {
                            $gte: new Date(yearNow - i - 4, 1, 1),
                            $lt: new Date(yearNow - i + 1, 1, 1)
                        }
                    });
                    numbers.push(number);
                    var x1 = yearNow - i - 4;
                    var x2 = yearNow - i;
                    years.push(x1 + '-' + x2);
                }
                res.json({name: " Tất cả đơn vị con của " + unitParent.nameUnit, years, numbers});
            } else {
                var name = "";
                var units = await Unit.find({code: {$in: req.body.codes}});
                for (var i = 0; i < units.length; i++) {
                        name += ' ' + units[i].nameUnit;
                }
                for (var i = 0; i < 30; i=i+5) {
                    var total = 0;
                    for (var k = 0; k < req.body.codes.length; k++) {
                        var number = await Citizen.count({
                            addressID: { $regex: '^' + req.body.codes[k] },
                            dob: {
                                $gte: new Date(yearNow - i - 4, 1, 1),
                                $lt: new Date(yearNow - i + 1, 1, 1)
                            }
                        });
                        total += number;
                    }
                    numbers.push(total);
                    var x1 = yearNow - i - 4;
                    var x2 = yearNow - i;
                    years.push(x1 + '-' + x2);
                }
                res.json({name, years, numbers});
            }
            
        } catch (error) {
            res.status(400).json({message: error});
        }
    }

    // [GET] /statistic/:code/career
    async filterCareer(req, res) {
        try {
            var career = [];
            var number = [];
            if (req.body.codes.length == 0) {
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
            }  else {
                var name = "";
                var numberWorker = 0;
                var numberFarmer = 0;
                var numberOfficer = 0;
                var numberEngineer = 0;
                var numberStudent = 0;
                var numberFree = 0;
                for (var i = 0; i < req.body.codes.length; i++) {
                    var unit = await Unit.findOne({code: req.body.codes[i]});
                    name += " " + unit.nameUnit;
                    const numberCareer2 = await Citizen.count({
                        addressID: { $regex: '^' + req.body.codes[i] },
                        job: 'Công nhân',
                    });
                    numberWorker += numberCareer2;

                    const numberCareer3 = await Citizen.count({
                        addressID: { $regex: '^' + req.body.codes[i] },
                        job: 'Nông dân',
                    });
                    numberFarmer += numberCareer3;

                    const numberCareer4 = await Citizen.count({
                        addressID: { $regex: '^' + req.body.codes[i] },
                        job: 'Công chức',
                    });
                    numberOfficer += numberCareer4;

                    const numberCareer5 = await Citizen.count({
                        addressID: { $regex: '^' + req.body.codes[i] },
                        job: 'Kỹ sư',
                    });
                    numberEngineer += numberCareer5;

                    const numberCareer6 = await Citizen.count({
                        addressID: { $regex: '^' + req.body.codes[i] },
                        job: 'Học sinh/ Sinh viên',
                    });
                    numberStudent += numberCareer6;

                    const numberCareer1 = await Citizen.count({
                        addressID: { $regex: '^' + req.body.codes[i] },
                        job: 'Tự do',               
                    });
                    numberFree += numberCareer1;
                }
                number.push(numberWorker);
                career.push('Công nhân');
                number.push(numberFarmer);
                career.push('Nông dân');
                number.push(numberOfficer);
                career.push('Công chức');
                number.push(numberEngineer);
                career.push('Kỹ sư');
                number.push(numberStudent);
                career.push('Học sinh/ Sinh viên');
                number.push(numberFree);
                career.push('Tự do');
                res.json({name, career, number});
            }
            
                
        } catch(err) {
            res.render(err);
        }
    }

    // [POST] /statistic/:code/gender
    async filterGender(req, res) {
        try {
            const unitParent = await Unit.findOne({code: req.params.code});
            var units;
            var male = [];
            var female = [];
            var nameUnit = [];
            // Khi người dùng không chọn đơn vị con nào thì sẽ thống kê tất cả các đơn vị con
            if (req.body.codes.length === 0) {
                units = await Unit.find({idParent: req.params.code});
            } else {
                units = await Unit.find({code: {$in: req.body.codes}})
            }
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
            res.json(err);
        }
    }

    // [POST] /statistic/:code/population
    async filterPopulation(req, res) {
        try {
            const unitParent = await Unit.findOne({code: req.params.code});
            var units;
            var population = [];
            var nameUnit = [];
            // Khi người dùng không chọn đơn vị con nào thì sẽ thống kê tất cả các đơn vị con
            if (req.body.codes.length == 0) {
                units = await Unit.find({idParent: req.params.code});
            } else {
                units = await Unit.find({code: {$in: req.body.codes}});
            }
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
            if (req.body.codes.length === 0) {
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
            } else {
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
            }
        } catch (error) {
            res.status(400).json(error);
        }
    }

}


module.exports = new CountController();


