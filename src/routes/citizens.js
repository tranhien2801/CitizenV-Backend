const express = require('express');
const router = express.Router();

const citizenController = require('../app/controllers/CitizenController');

router.get('/details/', citizenController.find);
router.get('/', citizenController.show);
router.get('/:CCCD', citizenController.showByCCCD);
router.delete('/:CCCD/', citizenController.destroy);
router.delete('/:CCCD/force', citizenController.forceDestroy);
router.patch('/:CCCD/restore', citizenController.restore);
router.post('/store/:addressID', citizenController.store);
router.put('/', citizenController.update)

module.exports = router;
