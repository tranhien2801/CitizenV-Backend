const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const citizenController = require('../app/controllers/CitizenController');

router.get('/:CCCD/edit', Auth.auth, Auth.authB1B2, citizenController.editPerson);
router.get('/addPerson', Auth.auth, Auth.authB1B2, citizenController.addPerson);
router.get('/unit/:code', Auth.auth, Auth.authA123B1, citizenController.findByUnit);
router.get('/survey-card', Auth.auth, citizenController.surveyCard);
router.get('/', Auth.auth, Auth.authA123B1, citizenController.show);
router.get('/:code', Auth.auth, Auth.authA123B1, citizenController.showByUnit);
router.get('/trash/:code', Auth.auth, citizenController.trashCitizens);
router.delete('/:CCCD/', Auth.auth, Auth.authB1B2, citizenController.destroy);
router.delete('/:CCCD/force', Auth.auth, Auth.authB1B2, citizenController.forceDestroy);
router.patch('/:CCCD/restore', Auth.auth, Auth.authB1B2, citizenController.restore);
router.post('/store/:addressID', Auth.auth, Auth.authB1B2, citizenController.store);
router.put('/:CCCD', Auth.auth, citizenController.update);




module.exports = router;
