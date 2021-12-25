const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const citizenController = require('../app/controllers/CitizenController');

router.get('/:_id/edit', Auth.auth, Auth.authB1B2, citizenController.editPerson);
router.get('/addPerson', Auth.auth, Auth.authB1B2, citizenController.addPerson);
router.get('/unit/:code', Auth.auth, Auth.authA123B1, citizenController.findByUnit);
router.get('/survey-card', Auth.auth, Auth.authB1B2, citizenController.surveyCard);
router.get('/', Auth.auth, citizenController.showByUnit);
router.get('/trash', Auth.auth, citizenController.trashCitizens);
router.delete('/:_id/', Auth.auth, Auth.authB1B2, citizenController.destroy);
router.delete('/:_id/force', Auth.auth, Auth.authB1B2, citizenController.forceDestroy);
router.patch('/:_id/restore', Auth.auth, Auth.authB1B2, citizenController.restore);
router.post('/store/:addressID', Auth.auth, Auth.authB1B2, citizenController.store);
router.put('/:_id', Auth.auth, Auth.authB1B2, citizenController.update);




module.exports = router;
