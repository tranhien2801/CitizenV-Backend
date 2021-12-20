const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const searchController = require('../app/controllers/SearchController');


router.get('/citizens', searchController.find);
router.get('/:CCCD', Auth.auth, searchController.showByCCCD);


module.exports = router;
