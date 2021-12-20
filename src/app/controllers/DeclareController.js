
const Unit = require('../models/Unit');

const dateFormat = (date) => {
    if (date == null)   return "00/00/0000";
    var day = date.getDate();
    if (day < 10) day = '0' + day;
    var month = date.getMonth() + 1;
    if ( month < 10) month = '0' + month;
    var year = date.getFullYear();
    const dateFormat = day + '/' + month + '/' + year;
    return dateFormat;
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
                    res.json({unit, date, unleaded, declaring, declared,  units, dateEnds});
                })
                .catch(() => res.json({unit, date, unleaded: 0, declaring: 0, declared: 0,  units: null, dateEnds: null}));
    }

    // [PUT] /declare/close/:code
    async closeDeclaration(req, res) {
        try {
            switch(req.params.code.length) {
                case 8: // B2
                    await Unit.updateOne({code: req.params.code}, 
                        {$set: {progress: "Đã khai báo", active: "Không", timeEnd: Date.now()}});
                    break;
                case 6: // B1
                    await Unit.updateMany({$or: [{code: req.params.code}, {idParent: req.params.code}]}, 
                        {$set: {progress: "Đã khai báo", active: "Không", timeEnd: Date.now()}});
                    break;
                case 4: // A3
                    const unit6 = await Unit.findOne({idParent: req.params.code});
                    // update A3, B1
                    await Unit.updateMany({$or: [{code: req.params.code}, {idParent: req.params.code}]}, 
                        {$set: {progress: "Đã khai báo", active: "Không", timeEnd: Date.now()}});
                    // update B2
                    await Unit.updateMany({idParent: unit6.code}, 
                        {$set: {progress: "Đã khai báo", active: "Không", timeEnd: Date.now()}});
                    break;
                case 2: // A2
                    const unitA3 = await Unit.findOne({idParent: req.params.code});
                    const unitB1 = await Unit.findOne({idParent: unitA3.code});
                    // update A2, A3
                    await Unit.updateMany({$or: [{code: req.params.code}, {idParent: req.params.code}]}, 
                        {$set: {progress: "Đã khai báo", active: "Không", timeEnd: Date.now()}});
                    // update B1, B2
                    await Unit.updateMany({$or: [{code: unitB1.code}, {idParent: unitB1.code}]}, 
                        {$set: {progress: "Đã khai báo", active: "Không", timeEnd: Date.now()}});
                    break;
            }
            res.json({
                status: "Success", 
                code: req.params.code,
            })
        } catch (error) {
            res.status(400).json({message: error.message});
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
