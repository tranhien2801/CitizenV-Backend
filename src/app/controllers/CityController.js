
const City = require('../models/City');
const Unit = require('../models/Unit');


const filterItems = (arr, query) => {
    return arr.filter(el => el.Name === query);
  }


class CityController {
  
    // [GET] /allocate/:code   -- Trả về tên các đơn vị cấp dưới
    async showUnit(req, res) {
        try {
           // var code = localStorage.getItem('code');
            switch(req.params.code.length) {
                case 2:
                    const unit2 = await Unit.findOne({code: req.params.code});
                    const city2 = await City.findOne({Name: unit2.nameUnit});
                    if(city2 == null ) {
                        return res.render('units/addUnit',{code: req.params.code, listName: null});
                    }
                    var districtName = [];
                    for (var i = 0; i < city2.Districts.length; i++ ) {
                        var temp = await Unit.findOne({nameUnit: city2.Districts[i].Name});
                        if (temp == null)   districtName.push(city2.Districts[i].Name);
                    }
                   res.render('units/addUnit',{code: req.params.code, listName: districtName, length: city2.Districts.length});
                
                    break;
                case 4:
                    const unit4 = await Unit.findOne({code: req.params.code});
                    const city4 = await City.findOne({'Districts.Name': unit4.nameUnit});
                    if(city4 == null ) {
                        return res.render('units/addUnit',{code: req.params.code, listName: null});
                    }
                    var disFilter = filterItems(city4.Districts, unit4.nameUnit);
                    var wardName = [];
                    for (var i = 0; i < disFilter[disFilter.length - 1].Wards.length; i++ ) {
                        var dis = disFilter[disFilter.length - 1].Wards[i].Name;
                        var temp = await Unit.findOne({nameUnit: dis});
                        if (temp == null)    wardName.push(dis);
                    }
                    res.render('units/addUnit',{code: req.params.code, listName: wardName});
                    break;
                case 6:
                    res.render('units/addUnit',{code: req.params.code, listName: null});
                    break;
                case 3:
                    if (req.params.code === 'A01') {
                        const cities = await City.find();
                        var cityName = [];
                        for (var i = 0; i < cities.length; i++) {
                            var temp = await Unit.findOne({nameUnit: cities[i].Name});
                            if (temp == null)   cityName.push(cities[i].Name);
                        }
                        res.render('units/addUnit',{code: req.params.code, listName: cityName});
                    } else res.status(400).json({message: "Tài khoản A1 này không đúng"});
                    break;
                default:
                    res.status(400).json({message: "Hệ thống hiện chưa có dữ liệu của đơn vị này"});
                    break;

            }
        } catch (error) {
            res.json(error);
        }
    }
    


}

  
module.exports = new CityController();