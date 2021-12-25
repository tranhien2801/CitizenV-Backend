
const Unit = require('../models/Unit');
const Citizen = require('../models/Citizen')
const bcrypt = require('bcryptjs');
const {yearFormat} = require('../../util/formatDate');


class UnitController {

    /*---------------------------------------------------------------------------------------------------------------------
        Các API GET của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    // [GET] /units/:code
    show(req, res, next) {
        Unit.findOne({code: req.params.code})
            .then((unit) => {
                res.json({unit});            
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}))
    }

    // [GET] /units/population/:code
    population(req, res, next) {
        Unit.findOne({code: req.params.code})
            .then((unit) => {
                Citizen.count({addressID: { $regex: '^' + unit.code}})
                    .then((totalPopulation) => {
                        res.json(totalPopulation);
                    })
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}))
    }

    // [GET] /units/perResidence/:code
    async perResidence(req, res) {
        try {
            var codeWard = req.params.code.slice(0,6);
            var codeDistrict = req.params.code.slice(0,4);
            var codeCity = req.params.code.slice(0,2);
            var ward = await Unit.findOne({code: codeWard});
            var district = await Unit.findOne({code: codeDistrict});
            var city = await Unit.findOne({code: codeCity});
            var perResidence = ward.nameUnit + ", " + district.nameUnit + ", " + city.nameUnit;
            res.json({perResidence});
        } catch (error) {
            res.status(400).json({message: "Mã đơn vị không tồn tại trong hệ thống"});
        }
    }

    
 
    /*---------------------------------------------------------------------------------------------------------------------
        Các API PUT của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    
    // [PUT] /units/:code
    async update(req, res, next) {
        if (req.body.password != null) req.body.password = await bcrypt.hash(req.body.password, 8);
        Unit.updateOne({code: req.params.code}, req.body)
            .then(() => {
                res.json(req.body);
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}));
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API DELETE của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/

    // [DELETE] /units/:code
    async destroy(req, res) {
        try {
            const unit = await Unit.findOne({ code: req.params.code });
            switch (unit.code.length) {
                case 6:
                    await Unit.delete({code: req.params.code});                       
                    await Citizen.delete({ addressID: unit.code});
                    res.json({
                        status: 200,
                        message: "Xóa đơn vị và công dân của đơn vị thành công",
                        codeUnit: req.params.code,
                    });
                    break;
                case 4:
                    const units = await Unit.find({idParent: req.params.code});
                    await Unit.delete({$or: [{code: req.params.code}, {idParent: req.params.code}]}); 
                    for (var u in units) {              
                        await Citizen.delete({addressID: u.code});
                    }
                    res.json({
                        status: 200,
                        message: "Xóa đơn vị và công dân của đơn vị thành công",
                        codeUnit: req.params.code,
                    });
                    break;
                case 2:
                    const units1 = await Unit.find({idParent: req.params.code});
                    await Unit.delete({$or: [{code: req.params.code}, {idParent: req.params.code}]}); 
                    for (var i = 0; i < units1.length; i++) {                    
                        const unitChilds = await Unit.find({idParent: units1[i].code});
                        await Unit.delete({idParent: units1[i].code});
                        for ( var j = 0; j < unitChilds.length; j++) {            
                            await Citizen.delete({addressID: unitChilds[j].code});
                        }
                    }
                    res.json({
                        status: 200,
                        message: "Xóa đơn vị và công dân của đơn vị thành công",
                        codeUnit: req.params.code,
                    });
                    break;
            }
        } catch (error) {
            res.status(400).json({message: "Đơn vị không có trong hệ thống"});
        }
    }

    
    /*---------------------------------------------------------------------------------------------------------------------
        Các API PATCH của đơn vị
    ----------------------------------------------------------------------------------------------------------------------*/
    // [PATCH] /units/:code/restore
    async restore(req, res, next) {
        try {
            await Unit.restore({ code: req.params.code });
            const unit = await Unit.findOne({ code: req.params.code });
            switch (unit.code.length) {
                case 6:                      
                    await Citizen.restore({ addressID: unit.code});
                    res.json({
                        status: 200,
                        message: "Khôi phục đơn vị và công dân của đơn vị thành công",
                        codeUnit: req.params.code,
                    });
                    break;
                case 4:                  
                    await Unit.restore({$or: [{code: req.params.code}, {idParent: req.params.code}]}); 
                    const units = await Unit.find({idParent: req.params.code});
                    for (var u in units) {              
                        await Citizen.restore({addressID: u.code});
                    }
                    res.json({
                        status: 200,
                        message: "Khôi phục đơn vị và công dân của đơn vị thành công",
                        codeUnit: req.params.code,
                    });
                    break;
                case 2:                   
                    await Unit.restore({$or: [{code: req.params.code}, {idParent: req.params.code}]}); 
                    const units1 = await Unit.find({idParent: req.params.code});
                    for (var i = 0; i < units1.length; i++) {                         
                        await Unit.restore({idParent: units1[i].code});
                        const unitChilds = await Unit.find({idParent: units1[i].code});
                        for ( var j = 0; j < unitChilds.length; j++) {            
                            await Citizen.restore({addressID: unitChilds[j].code});
                        }
                    }
                    res.json({
                        status: 200,
                        message: "Khôi phục đơn vị và công dân của đơn vị thành công",
                        codeUnit: req.params.code,
                    });
                    break;
            }
        } catch (error) {
            res.status(400).json({message: "Đơn vị không có trong hệ thống"});
        }
    }

}

module.exports = new UnitController();

