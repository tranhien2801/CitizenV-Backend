const express = require('express');
const router = express.Router();

const unitController = require('../app/controllers/UnitController');


router.post('/store', unitController.store);
router.get('/:code', unitController.show);
router.get('/population/:code', unitController.population);
router.put('/:id', unitController.update);
router.delete('/:id', unitController.destroy);




module.exports = router;
