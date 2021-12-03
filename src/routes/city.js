const express = require('express');
const router = express.Router();

const cityController = require('../app/controllers/CityController');

router.get('/:Name', cityController.findCity);
// router.get('/', cityController.findWard);
router.get('/', cityController.findDistrict);
router.get('/', cityController.showAll);


module.exports = router;