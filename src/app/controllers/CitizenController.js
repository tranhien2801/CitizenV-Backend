const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Citizen = require('../models/Citizen')
const Unit = require('../models/Unit');
const {yearFormat} = require('../../util/formatDate');
const {dateFormat} = require('../../util/formatDate');


class CitizenController {

    /*---------------------------------------------------------------------------------------------------------------------
        Các API GET của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [GET] /citizens/addPerson
    addPerson(req, res, next) {
        res.render('citizens/addPerson');
    }

    show(req, res) {
        res.render('citizens/listPerson');
    }

    // [GET] /citizens/survey-card
    surveyCard(req, res, next) {
        res.render('citizens/sheet');
    }

    // [GET] /citizens/:code 
    showByUnit(req, res, next) {
        let citizenQuery = Citizen.find({addressID: { $regex: '^' + req.params.code}}, 
            {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, 
            curResidence: 1, ethnic: 1, religion: 1, eduLevel: 1, job: 1});

        if (req.query.hasOwnProperty('_sort')) {
            citizenQuery = citizenQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([citizenQuery, Citizen.countDocumentsDeleted({addressID: { $regex: '^' + req.params.code}})])
            .then(([citizens, deletedCount]) => {
                for ( var i = 0; i < citizens.length; i++) {              
                    citizens[i].date = dateFormat(citizens[i].dob);
                }   
                res.render('citizens/listPerson', {
                    citizen: multipleMongooseToObject(citizens),
                    deletedCount
                })   
                // res.json({citizens, deletedCount})        
            })
            .catch(next);
    }


    // [GET] /citizens/trash/:code
    trashCitizens(req, res, next) {
        Citizen.findDeleted({addressID: { $regex: '^' + req.params.code}}, {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, curResidence: 1,
            ethnic: 1, religion: 1, eduLevel: 1, job: 1, deletedAt: 1})
            .then((citizens) => {
            if (citizens != null) {               
                for ( var i = 0; i < citizens.length; i++) {
                    var date = dateFormat(citizens[i].dob);              
                    citizens[i].date = date;
                    var dateDeleted = dateFormat(citizens[i].deletedAt);              
                    citizens[i].dateDeleted = dateDeleted;
                }
                res.render('citizens/trashCitizens', {
                    citizens: multipleMongooseToObject(citizens),               
                });
            } else res.status(404).json( {message: "Hiện tại, hệ thống chưa có công dân nào"})
            })
            .catch(next);
    }

    // [GET] /citizens/unit/:code
    findByUnit(req, res, next) {
        Citizen.find({addressID: { $regex: '^' + req.params.code}})
            .then((citizens) => {
                res.render('citizens/listPerson', {
                    citizen: multipleMongooseToObject(citizens),
                });
                //res.json(citizens)
            })
            .catch(next => res.status(400).json({message: "Đơn vị này không tồn tại trong hệ thống"}))
    }

    // [GET] /citizens/:CCCD/edit
    editPerson(req, res, next) {
        Citizen.findOne({ CCCD: req.params.CCCD}, 
                        {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, curResidence: 1,
                        ethnic: 1, religion: 1, eduLevel: 1, job: 1})
            .then((citizen) => {   
                var date = yearFormat(citizen.dob);
                res.render('citizens/editPerson', {
                    citizen: mongooseToObject(citizen), 
                    date
                });   
            })
            .catch(next=> res.status(404).json( {message: "Không tìm thấy công dân phù hợp"}));
    }




    /*---------------------------------------------------------------------------------------------------------------------
        Các API POST của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [POST] /citizens/store/:addressID
    async store(req, res, next) { 
        const unit = await Unit.findOne({ code: req.params.addressID});
        if (unit == null) {
            return res.status(400).json({message: "Đơn vị không tồn tại trong hệ thống"});
        }
        if (unit.active == "Không") return res.status(400).json({message: "Đơn vị đã bị đóng quyền khai báo"});
        if (unit.timeEnd < Date.now())  return res.status(400).json({message: "Đã hết thời hạn khai báo"});
        if (unit.timeStart > Date.now())    return res.status(400).json({message: "Chưa đến thời gian khai báo"});
        console.log(req.body);
        const citizen = new Citizen(req.body);
        citizen.addressID = req.params.addressID;
        citizen.save()
            .then(() => {
               res.json({message: "Thêm người dân thành công"});
            })
            .catch(next => res.status(400).json({message: "Lỗi tạo công dân do CCCD đã tồn tại hoặc ngày sinh không phù hợp"}));
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API PUT của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [PUT] /citizens/CCCD
    update(req, res, next) {
        Citizen.updateOne({ CCCD: req.params.CCCD}, req.body)
            .then(() => res.redirect('/citizens'))
            .catch(next);
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API DELETE của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [DELETE] /citizens/:CCCD
    destroy(req, res, next) {
        Citizen.delete({ CCCD: req.params.CCCD })
            .then(() => 
           // res.json({ message: "Delete Citizen Successfull"})
            res.redirect('back')
            )
            .catch(next);
    }

    // [DELETE] /citizens/:CCCD/force
    forceDestroy(req, res, next) {
        Citizen.deleteOne({ CCCD: req.params.CCCD })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API PATCH của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [PATCH] /citizens/:CCCD/restore
    restore(req, res, next) {
        Citizen.restore({ CCCD: req.params.CCCD })
            .then(() => res.redirect('back'))
            .catch(next);
    }


};

module.exports = new CitizenController();
