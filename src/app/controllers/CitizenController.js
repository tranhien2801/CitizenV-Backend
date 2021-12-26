const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Citizen = require('../models/Citizen')
const Unit = require('../models/Unit');
const {yearFormat} = require('../../util/formatDate');
const {dateFormat} = require('../../util/formatDate');
const JWT_KEY = "UETcitizenV";
const jwt = require('jsonwebtoken');

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

    // [GET] /citizens
    async showByUnit(req, res, next) {
        var token = req.session.token; 
        const data = jwt.verify(token, JWT_KEY);
        var citizenQuery;
        var unit = await Unit.findOne({code: data.code});
        if (data.code == "A01") data.code = "";
            citizenQuery = Citizen.find({addressID: { $regex: '^' + data.code}}, 
                {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, 
                curResidence: 1, ethnic: 1, religion: 1, eduLevel: 1, job: 1});
        if (req.query.hasOwnProperty('_sort')) {
            citizenQuery = citizenQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([citizenQuery, Citizen.countDocumentsDeleted({addressID: { $regex: '^' + data.code}})])
            .then(([citizens, deletedCount]) => {
                for ( var i = 0; i < citizens.length; i++) {              
                    citizens[i].date = dateFormat(citizens[i].dob);
                }   
                res.render('citizens/listPerson', {
                    citizens: multipleMongooseToObject(citizens),
                    deletedCount,
                    name: unit.nameUnit
                })         
            })
            .catch(next);
    }


    // [GET] /citizens/trash/
    trashCitizens(req, res, next) {
        var token = req.session.token; 
        const data = jwt.verify(token, JWT_KEY);
        if (data.code == "A01") data.code = "";
        Citizen.findDeleted({addressID: { $regex: '^' + data.code}}, 
            {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, curResidence: 1,
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
    async findByUnit(req, res, next) {
        var unit = await Unit.findOne({code: req.params.code});
        if (req.params.code == "A01") req.params.code = "";
        if (req.params.code.length == 8) req.params.code = req.params.code.slide(0, 6);
        var citizenQuery = Citizen.find({addressID: { $regex: '^' + req.params.code}});
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
                    citizens: multipleMongooseToObject(citizens),
                    deletedCount,
                    name: unit.nameUnit
                })       
            })
            .catch(next);
    }

    // [GET] /citizens/:_id/edit
    editPerson(req, res, next) {
        Citizen.findOne({ _id: req.params._id}, 
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

    // Khai báo người dân
    // [POST] /citizens/store/:addressID
    async store(req, res) { 
        const unit = await Unit.findOne({ code: req.params.addressID});
        if (unit == null) {
            return res.status(400).json({message: "Đơn vị không tồn tại trong hệ thống"});
        }
        if (unit.active == "Không") return res.status(400).json({message: "Đơn vị đã bị đóng quyền khai báo"});
        if (unit.timeEnd < Date.now())  return res.status(400).json({message: "Đã hết thời hạn khai báo"});
        if (unit.timeStart > Date.now())    return res.status(400).json({message: "Chưa đến thời gian khai báo"});
        if (req.params.addressID.length == 8) req.params.addressID = req.params.addressID.slice(0,6);
        var checkExist = null;
        if (req.body.CCCD != "") checkExist = await Citizen.findOne({CCCD: req.body.CCCD});
        if (checkExist != null)  return res.status(400).json({message: "CCCD này đã có trong hệ thống, mời kiểm tra lại"});
        const citizen = new Citizen(req.body);
        citizen.addressID = req.params.addressID;
        citizen.save()
            .then(() => {
               res.json({message: "Thêm người dân thành công"});
            })
            .catch(() => res.status(400).json({message: "Ngày sinh không phù hợp"}));
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API PUT của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [PUT] /citizens/:_id
    update(req, res, next) {
        Citizen.updateOne({ _id: req.params._id}, req.body)
            .then(() => res.redirect('/citizens/'))
            .catch(next);
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API DELETE của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [DELETE] /citizens/:_id
    destroy(req, res, next) {
        Citizen.delete({ _id: req.params._id })
            .then(() => 
           // res.json({ message: "Delete Citizen Successfull"})
            res.redirect('back')
            )
            .catch(next);
    }

    // [DELETE] /citizens/:_id/force
    forceDestroy(req, res, next) {
        Citizen.deleteOne({ _id: req.params._id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    /*---------------------------------------------------------------------------------------------------------------------
        Các API PATCH của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [PATCH] /citizens/:_id/restore
    restore(req, res, next) {
        Citizen.restore({ _id: req.params._id })
            .then(() => res.redirect('back'))
            .catch(next);
    }


};

module.exports = new CitizenController();
