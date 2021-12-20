const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');

const unitController = require('../app/controllers/UnitController');


router.get('/:code', Auth.auth, Auth.authA123B1, unitController.show);
router.get('/population/:code', Auth.auth, Auth.authA123B1, unitController.population);
router.put('/:code', Auth.auth, Auth.authA123B1, unitController.update);
router.delete('/:code', Auth.auth, Auth.authA123B1, unitController.destroy);
router.patch('/:code/restore', Auth.auth, Auth.authA123B1, unitController.restore);



module.exports = router;
