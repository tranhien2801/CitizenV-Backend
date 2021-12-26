const {dateFormat} = require('../../util/formatDate');
const Unit = require('../models/Unit');

var openDeclaration = async function(unit, timeEnd, timeStart) {
    await Unit.updateMany({unit: unit.code}, 
        {$set: {timeEnd: timeEnd, timeStart: timeStart, progress: "Đang khai báo", active: "Có"}});

    var units = await Unit.find({idParent: unit.code});
    for (var i = 0; i < units.length; i++) {
        openDeclaration(units[i], timeEnd, timeStart);
    }
}

var closeDeclaration = async function(unit, active, timeStart, timeEnd) {
    await Unit.updateOne({code: unit.code}, 
        {$set: {active: active, timeEnd: timeEnd, timeStart: timeStart}});
    var units = await Unit.find({idParent: unit.code});
    for (var i = 0; i < units.length; i++) {
        closeDeclaration(units[i], active, timeStart, timeEnd);
    }
}

class DeclareController {


    // [GET] /declare/activate?code=
    activate(req, res) {
        if (req.query.code == '') req.query.code = null;
        Unit.count({idParent: req.query.code, active: "Có"})
            .then(countYes => {
                Unit.count({idParent: req.query.code})
                    .then(count => {
                        res.json({countYes, count});
                    })              
            })
            .catch((error) => res.status(400).json(error));
    }

    
    // [GET] /declare/progress?code=
    async progress(req, res) {
        
            if (req.query.code == '') req.query.code = null;
            const unit = await Unit.findOne({ code: req.query.code});
            const date = dateFormat(unit.timeEnd);
            const dateStart = dateFormat(unit.timeStart);
            Unit.find({idParent: req.query.code})
                .then(units => {
                    var dateEnds = [];
                    var declared = 0;
                    var declaring = 0;
                    var unleaded = 0;
                    for (var i = 0; i < units.length; i++) {
                        const temp = dateFormat(units[i].timeEnd);
                        dateEnds.push(temp);
                        switch (units[i].progress) {
                            case "Đã khai báo":
                                declared++;
                                break;
                            case "Đang khai báo":
                                declaring++;
                                break;
                            case "Chưa khai báo":
                                unleaded++;
                                break;
                        }
                    }
                    res.json({unit, date, dateStart, unleaded, declaring, declared,  units, dateEnds});
                })
                .catch(() => res.json({unit, date, dateStart, unleaded: 0, declaring: 0, declared: 0,  units: null, dateEnds: null}));
    }

    // [PUT] /declare/close/:code
    async closeDeclaration(req, res) {
        try {
            var codeParent;
            if (req.params.code.length == 2) codeParent = "A01";
            else    codeParent = req.params.code.slice(0, req.params.code.length - 2);
             
            console.log(codeParent);
            var unitParent = await Unit.findOne({code: codeParent});
            if (unitParent.active == "Không") 
                return res.status(400).json({message: "Đơn vị cấp trên của đơn vị này đã bị khóa quyền khai báo"});
            var unit = await Unit.findOne({code: req.params.code});
            closeDeclaration(unit, req.body.active, req.body.timeStart, req.body.timeEnd);
            res.json({
                message: "Thay đổi quyền khai báo thành công!", 
                code: req.params.code,
            })
        } catch (error) {
            res.status(400).json({message: "Thay đổi quyền khai báo thành công"});
        }
    }

    // [PUT] /declare/open/:code
    async openDeclaration(req, res) {
        try {
            var unit = await Unit.findOne({code: req.params.code});
            openDeclaration(unit, req.body.timeEnd, req.body.timeStart)
            res.json({
                message: "Mở đợt khai báo thành công!", 
                code: req.params.code,
            })

        } catch (error) {
            res.status(400).json({message: "Mở đợt khai báo thành công"});
        }
    }


    // [PUT] /declare/:code
    async complete(req, res) {
        try {
            switch(req.params.code.length) {
                case 8:
                    const unit8 = await Unit.findOne({code: req.params.code});
                    await Unit.updateOne({code: req.params.code}, {$set: {progress: "Đã khai báo"}});  
                    // Kiểm tra xem các tài khoản B2 đã khai báo xong chưa, nếu tất cả đều "Đã khai báo"
                    // thì chuyển progress của B1 thành "Đã khai báo"             
                    const count8 = await Unit.count({idParent: unit8.idParent, progress: "Đang khai báo"});
                    if (count8 == 0) {
                        const unitParent6 = await Unit.findOne({code: unit8.idParent});
                        await Unit.updateOne({code: unit8.idParent}, {$set: {progress: "Đã khai báo"}});
                        // Kiểm tra xem các tài khoản B1 đã khai báo xong chưa, nếu tất cả đều "Đã khai báo"
                        // thì chuyển progress của A3 thành "Đã khai báo"  
                        const count6 = await Unit.count({idParent: unitParent6.idParent, progress: "Đang khai báo"});
                        if (count6 == 0) {
                            const unitParent4 = await Unit.findOne({code: unitParent6.idParent});
                            await Unit.updateOne({code: unitParent6.idParent}, {$set: {progress: "Đã khai báo"}});
                            // Kiểm tra xem các tài khoản A3 đã khai báo xong chưa, nếu tất cả đều "Đã khai báo"
                            // thì chuyển progress của A2 thành "Đã khai báo"  
                            const count4 = await Unit.count({idParent: unitParent4.idParent, progress: "Đang khai báo"}); 
                            if (count4 == 0) {
                                await Unit.updateOne({code: unitParent4.idParent}, {$set: {progress: "Đã khai báo"}});
                            }
                        }
                    }
                    res.json({message: "Cập nhật trạng thái thành công", unit8});
                    break;
                case 6:
                    const unit = await Unit.findOne({code: req.params.code});
                    await Unit.updateOne({code: req.params.code}, {$set: {progress: "Đã khai báo"}});   
                    // Kiểm tra xem các tài khoản B1 đã khai báo xong chưa, nếu tất cả đều "Đã khai báo"
                    // thì chuyển progress của A3 thành "Đã khai báo"              
                    const countDeclaring = await Unit.count({idParent: unit.idParent, progress: "Đang khai báo"});
                    if (countDeclaring == 0) {
                        const unitParent1 = await Unit.findOne({code: unit.idParent});
                        await Unit.updateOne({code: unit.idParent}, {$set: {progress: "Đã khai báo"}});
                        // Kiểm tra xem các tài khoản A3 đã khai báo xong chưa, nếu tất cả đều "Đã khai báo"
                        // thì chuyển progress của A2 thành "Đã khai báo"  
                        const count = await Unit.count({idParent: unitParent1.idParent, progress: "Đang khai báo"});
                        if (count == 0) {
                            await Unit.updateOne({code: unitParent1.idParent}, {$set: {progress: "Đã khai báo"}});
                        }
                    }
                    res.json({message: "Cập nhật trạng thái thành công", unit});
                    break;
                case 4:
                    const unit4 = await Unit.findOne({code: req.params.code});
                    await Unit.updateOne({code: req.params.code}, {$set: {progress: "Đã khai báo"}});    
                    // Kiểm tra xem các tài khoản A3 đã khai báo xong chưa, nếu tất cả đều "Đã khai báo"
                    // thì chuyển progress của A2 thành "Đã khai báo"             
                    const countDeclaring4 = await Unit.count({idParent: unit4.idParent, progress: "Đang khai báo"});
                    if (countDeclaring4 == 0) {
                        await Unit.updateOne({code: unit4.idParent}, {$set: {progress: "Đã khai báo"}});
                    }
                    res.json({message: "Cập nhật trạng thái thành công", unit4});
                    break;
                case 2:
                    await Unit.updateOne({code: req.params.code}, {$set: {progress: "Đã khai báo"}});  
                    res.json({message: "Cập nhật trạng thái thành công", code: req.params.code}); 
                    break;
                default:
                    res.status(400).json({message: "Đơn vị không tồn tại trong hệ thống"});
                    break;
            }
            
        } catch (error) {
            res.status(400).json({message: error.message});
        }
    }

    

}

module.exports = new DeclareController();
