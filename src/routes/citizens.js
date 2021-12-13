const express = require('express');
const router = express.Router();

const citizenController = require('../app/controllers/CitizenController');

router.get('/:CCCD/edit', citizenController.editPerson);
router.get('/addPerson', citizenController.addPerson);
router.get('/unit/:code', citizenController.findByUnit);
router.get('/', citizenController.show);
router.get('/trash', citizenController.trashCitizens);
router.get('/:CCCD', citizenController.showByCCCD);
router.delete('/:CCCD/', citizenController.destroy);
router.delete('/:CCCD/force', citizenController.forceDestroy);
router.patch('/:CCCD/restore', citizenController.restore);
router.post('/store/:addressID', citizenController.store);
router.put('/:CCCD', citizenController.update);


module.exports = router;
