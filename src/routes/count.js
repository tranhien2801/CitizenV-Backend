const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const countController = require('../app/controllers/CountController');

router.get('/', Auth.auth, Auth.authA123B1, countController.statistic);
router.post('/:code/population', countController.filterPopulation);
router.post('/:code/ageTower', countController.filterAge);
router.post('/:code/gender', countController.filterGender);
router.post('/:code/career', countController.filterCareer);
router.post('/:code/birthRate', countController.filterBirthRate);




module.exports = router;
