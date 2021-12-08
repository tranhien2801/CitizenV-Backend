const express = require('express');
const router = express.Router();
const auth = require('../app/middleware/Auth');
const unitController = require('../app/controllers/UnitController');


router.post('/store', unitController.store);
router.post('/login', unitController.login);
router.get('/:code', unitController.show);
router.get('/population/:code', unitController.population);
router.put('/:id', unitController.update);
router.delete('/:id', unitController.destroy);
router.patch('/:id/restore', unitController.restore);
router.post('/logout', unitController.logout);




module.exports = router;
