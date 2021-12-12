const express = require('express');
const router = express.Router();
const auth = require('../app/middleware/Auth');
const loginController = require('../app/controllers/LoginController');
const allocateController = require('../app/controllers/CityController');

router.get('/test/:code', allocateController.showUnit);
router.get('/', loginController.g_login);
router.post('/login', loginController.login);
router.get('/allocate', loginController.g_allocate);
router.post('/allocate', loginController.allocate);
router.get('/logout', loginController.logout);
router.post('/logout', loginController.logout);





module.exports = router;
