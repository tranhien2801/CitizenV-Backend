
const Unit = require('../models/Unit');

class DeclareController {


    // [GET] /declare?code=
    activate(req, res) {
        if (req.query.code == '') req.query.code = null;
        Unit.count({idParent: req.query.code, active: "Yes"})
            .then(countYes => {
                Unit.count({idParent: req.query.code})
                    .then(count => {
                        res.json({countYes, count});
                    })              
            })
            .catch((error) => res.status(400).json(error));
    }

    /* Cái này làm ở trang home nhá Lụa, dữ liệu trả về dạng json
     unit, date là của đơn vị đang đăng nhập
     unleaded, declaring, declared là số lượng đơn vị con đang trong trạng thái nào đó
     units, dateEnds là của các đơn vị con */
    // [GET] /declare/progress?code=
    async progress(req, res) {
        try {
            if (req.query.code == '') req.query.code = null;
            const unit = await Unit.findOne({ code: req.query.code});
            const dayEnd = unit.timeEnd.getDate();
            if (dayEnd < 10) dayEnd = '0' + dayEnd;
            const monthEnd = unit.timeEnd.getMonth() + 1;
            if ( monthEnd < 10) monthEnd = '0' + monthEnd;
            const yearEnd = unit.timeEnd.getFullYear();
            const date = dayEnd + '/' + monthEnd + '/' + yearEnd;
            
            const declared = await Unit.count({idParent: req.query.code, progress: "Đã khai báo"});
            const declaring = await Unit.count({idParent: req.query.code, progress: "Đang khai báo"});
            const unleaded = await Unit.count({idParent: req.query.code, progress: "Chưa khai báo"});
            
            const units = await Unit.find({idParent: req.query.code});
            var dateEnds = [];
            for (var i = 0; i < units.length; i++) {
                const day = units[i].timeEnd.getDate();
                if (day < 10) day = '0' + day;
                const month = units[i].timeEnd.getMonth() + 1;
                if ( month < 10) month = '0' + month;
                const year = units[i].timeEnd.getFullYear();
                const temp = day + '/' + month + '/' + year;
                dateEnds.push(temp);
            }
            res.json({unit, date, unleaded, declaring, declared,  units, dateEnds});
        } catch (error) {
            res.status(400).json({message: "Đơn vị không tồn tại trong hệ thống"});
        }

    }

    // [PUT] /declare/:code
    async complete(req, res) {
        try {
            switch(req.params.code.length) {
                case 8:
                    const unit8 = await Unit.findOne({code: req.params.code});
                    await Unit.updateOne({code: req.params.code}, {$set: {progress: "Đã khai báo"}});               
                    const count8 = await Unit.count({idParent: unit8.idParent, progress: "Đang khai báo"});
                    if (count8 == 0) {
                        const unitParent6 = await Unit.findOne({code: unit8.idParent});
                        await Unit.updateOne({code: unit8.idParent}, {$set: {progress: "Đã khai báo"}});
                        const count6 = await Unit.count({idParent: unitParent6.idParent, progress: "Đang khai báo"});
                        if (count6 == 0) {
                            const unitParent4 = await Unit.findOne({code: unitParent6.idParent});
                            await Unit.updateOne({code: unitParent6.idParent}, {$set: {progress: "Đã khai báo"}});
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
                    const countDeclaring = await Unit.count({idParent: unit.idParent, progress: "Đang khai báo"});
                    if (countDeclaring == 0) {
                        const unitParent1 = await Unit.findOne({code: unit.idParent});
                        await Unit.updateOne({code: unit.idParent}, {$set: {progress: "Đã khai báo"}});
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
