const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');
const Citizen = require('../models/Citizen')
const Unit = require('../models/Unit');

// const age = (date1, date2) => {
//     //return { $subtract: [ "$$NOW", "$date" ] };
//     return new Year("2016-01-01");
// }
class CitizenController {

    /*---------------------------------------------------------------------------------------------------------------------
        Các API GET của công dân
    ----------------------------------------------------------------------------------------------------------------------*/

    // [GET] /citizens/addPerson
    addPerson(req, res, next) {
        res.render('citizens/addPerson');
    }

    

    // [GET] /citizens 
    show(req, res, next) {
        let citizenQuery = Citizen.find({}, {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, 
            curResidence: 1, ethnic: 1, religion: 1, eduLevel: 1, job: 1});

        if (req.query.hasOwnProperty('_sort')) {
            citizenQuery = citizenQuery.sort({
                [req.query.column]: req.query.type,
            });
        }

        Promise.all([citizenQuery, Citizen.countDocumentsDeleted()])
            .then(([citizens, deletedCount]) => {
                for ( var i = 0; i < citizens.length; i++) {
                    var day = citizens[i].dob.getDate();
                    if (day < 10) day = '0' + day;
                    var month = citizens[i].dob.getMonth() + 1;
                    if ( month < 10) month = '0' + month;
                    var year = citizens[i].dob.getFullYear();
                    var date = day + '/' + month + '/' + year;              
                    citizens[i].date = date;
                }   
                res.render('citizens/listPerson', {
                    citizen: multipleMongooseToObject(citizens),
                    deletedCount
                })           
            })
            .catch(next);
    }


    // async show(req, res, next) {
    //     const deletedCount = await Citizen.countDocumentsDeleted();
    //     Citizen.find({}, {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, curResidence: 1,
    //         ethnic: 1, religion: 1, eduLevel: 1, job: 1})
    //         .then((citizens) => {
    //             if (citizens != null) {                    
    //                 for ( var i = 0; i < citizens.length; i++) {
    //                     var day = citizens[i].dob.getDate();
    //                     if (day < 10) day = '0' + day;
    //                     var month = citizens[i].dob.getMonth() + 1;
    //                     if ( month < 10) month = '0' + month;
    //                     var year = citizens[i].dob.getFullYear();
    //                     var date = day + '/' + month + '/' + year;              
    //                     citizens[i].date = date;
    //                 }                  
    //                 res.render('citizens/listPerson', {
    //                     citizen: multipleMongooseToObject(citizens),
    //                     deletedCount
    //                 });                                
    //             } else res.status(404).json( {message: "Hiện tại, hệ thống chưa có công dân nào"})
    //         })
    //         .catch(next);
    // };

    // [GET] /citizens/trash
    trashCitizens(req, res, next) {
        Citizen.findDeleted({}, {CCCD: 1, name: 1, dob: 1, sex: 1, phone: 1, perResidence: 1, curResidence: 1,
            ethnic: 1, religion: 1, eduLevel: 1, job: 1, deletedAt: 1})
            .then((citizens) => {
            if (citizens != null) {               
                for ( var i = 0; i < citizens.length; i++) {
                    var day = citizens[i].dob.getDate();
                    if (day < 10) day = '0' + day;
                    var month = citizens[i].dob.getMonth() + 1;
                    if ( month < 10) month = '0' + month;
                    var year = citizens[i].dob.getFullYear();
                    var date = day + '/' + month + '/' + year;              
                    citizens[i].date = date;

                    var dayDeleted = citizens[i].deletedAt.getDate();
                    if (dayDeleted < 10) dayDeleted = '0' + dayDeleted;
                    var monthDeleted = citizens[i].deletedAt.getMonth() + 1;
                    if ( monthDeleted < 10) monthDeleted = '0' + monthDeleted;
                    var yearDeleted = citizens[i].deletedAt.getFullYear();
                    var dateDeleted = dayDeleted + '/' + monthDeleted + '/' + yearDeleted;              
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
                var day = citizen.dob.getDate();
                if (day < 10) day = '0' + day;
                var month = citizen.dob.getMonth() + 1;
                if ( month < 10) month = '0' + month;
                var year = citizen.dob.getFullYear();
                var date = year + '-' + month + '-' + day;
                // res.json({
                //     citizen, 
                //     date,
                // });
                           
                res.render('citizens/editPerson', {
                    citizen: mongooseToObject(citizen), 
                    date,
                });   
            })
            .catch(next=> res.status(404).json( {message: "Không tìm thấy công dân phù hợp"}));
    }

    // [GET] /citizens/:CCCD
    showByCCCD(req, res, next) {
        Citizen.findOne({ CCCD: req.params.CCCD})
            .then((citizen) =>   {            
                var day = citizen.dob.getDate();
                if (day < 10) day = '0' + day;
                var month = citizen.dob.getMonth() + 1;
                if ( month < 10) month = '0' + month;
                var year = citizen.dob.getFullYear();
                var date = day + '/' + month + '/' + year;              
                citizen.date = date;
                res.json(citizen);     
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
            res.status(400).json({message: "Đơn vị không tồn tại trong hệ thống"});
            return;
        }
        console.log(req.body);
        const citizen = new Citizen(req.body);
        citizen.addressID = req.params.addressID;
        citizen.save()
            .then(() => {
                res.json(mongooseToObject(citizen))
                //res.render('addPerson');
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
