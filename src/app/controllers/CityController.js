
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
                    var districtName = [];
                    for (var i = 0; i < city2.Districts.length; i++ ) {
                        districtName.push(city2.Districts[i].Name);
                    }
                   res.render('units/addUnit',{code: req.params.code, listName: districtName, length: city2.Districts.length});
                //    res.json({code: req.params.code, listName: districtName});
                    break;
                case 4:
                    const unit4 = await Unit.findOne({code: req.params.code});
                    const city4 = await City.findOne({'Districts.Name': unit4.nameUnit});
                    const disFilter = filterItems(city4.Districts, unit4.nameUnit);
                    var wardName = [];
                    for (var i = 0; i < disFilter[disFilter.length - 1].Wards.length; i++ ) {
                        wardName.push(disFilter[disFilter.length - 1].Wards[i].Name);
                    }
                    res.json({code: req.params.code, listName: wardName});
                    break;
                case 6:
                    res.status(400).json({message: "Hệ thống hiện chưa có dữ liệu các thôn của xã"});
                    break;
                case 3:
                    if (req.params.code === 'A01') {
                        const cities = await City.find();
                        var cityName = [];
                        for (var i = 0; i < cities.length; i++) {
                            cityName.push(cities[i].Name);
                        }
                        res.json({code: req.params.code, listName: cityName});
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