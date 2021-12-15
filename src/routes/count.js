const express = require('express');
const router = express.Router();

const countController = require('../app/controllers/CountController');

router.get('/', countController.statistic);
router.get('/:code/population', countController.filterPopulation);
router.get('/:code/ageTower', countController.filterAge);
router.get('/:code/gender', countController.filterGender);
router.get('/:code/career', countController.filterCareer);




module.exports = router;
