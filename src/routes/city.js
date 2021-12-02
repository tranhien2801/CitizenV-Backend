const express = require('express');
const router = express.Router();

const cityController = require('../app/controllers/CityController');

router.get('/', cityController.show);

module.exports = router;