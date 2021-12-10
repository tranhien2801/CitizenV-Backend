const express = require('express');
const router = express.Router();
const auth = require('../app/middleware/Auth');
const unitController = require('../app/controllers/UnitController');


router.get('/:code', unitController.show);
router.get('/population/:code', unitController.population);
router.put('/:code', unitController.update);
router.delete('/:code', unitController.destroy);
router.patch('/:code/restore', unitController.restore);



module.exports = router;
