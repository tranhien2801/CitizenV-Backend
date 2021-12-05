const express = require('express');
const router = express.Router();

const unitController = require('../app/controllers/UnitController');


router.post('/store/:idParent', unitController.store);
router.get('/:code', unitController.show);
router.get('/population/:code', unitController.population);
router.put('/:id', unitController.update);




module.exports = router;
