const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const countController = require('../app/controllers/CountController');

router.get('/', Auth.auth, Auth.authA123B1, countController.statistic);
router.get('/:code/population', Auth.auth, Auth.authA123B1, countController.filterPopulation);
router.get('/:code/ageTower', Auth.auth, Auth.authA123B1, countController.filterAge);
router.get('/:code/gender', Auth.auth, Auth.authA123B1, countController.filterGender);
router.get('/:code/career', Auth.auth, Auth.authA123B1, countController.filterCareer);
router.get('/:code/birthRate', Auth.auth, Auth.authA123B1, countController.filterBirthRate);




module.exports = router;
