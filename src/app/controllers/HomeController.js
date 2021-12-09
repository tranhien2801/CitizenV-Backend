const { multipleMongooseToObject } = require('../../util/mongoose');
const { mongooseToObject } = require('../../util/mongoose');

class HomeController {

    // [GET] /
    home(req, res) {
        res.render('home');
    }


};

module.exports = new HomeController();
