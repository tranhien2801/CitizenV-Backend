const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const countController = require('../app/controllers/CountController');

router.get('/', Auth.auth, Auth.authA123B1, countController.statistic);
router.post('/:code/population', Auth.auth, Auth.authA123B1, countController.filterPopulation);
router.post('/:code/ageTower', Auth.auth, Auth.authA123B1, countController.filterAge);
router.post('/:code/gender', Auth.auth, Auth.authA123B1, countController.filterGender);
router.post('/:code/career', Auth.auth, Auth.authA123B1, countController.filterCareer);
router.post('/:code/birthRate', Auth.auth, Auth.authA123B1, countController.filterBirthRate);




module.exports = router;
