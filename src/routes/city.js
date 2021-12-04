const express = require('express');
const router = express.Router();

const cityController = require('../app/controllers/CityController');

router.get('/population-of-ward', cityController.populationWard);
router.get('/', cityController.findCity);
router.get('/ward', cityController.findWard);
router.get('/district', cityController.findDistrict);
router.get('/all', cityController.showAll);



module.exports = router;