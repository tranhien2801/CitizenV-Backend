const express = require('express');
const router = express.Router();
const auth = require('../app/middleware/Auth');
const loginController = require('../app/controllers/LoginController');
const allocateController = require('../app/controllers/CityController');


router.get('/allocate/:code', allocateController.showUnit);
router.get('/login', loginController.g_login);
router.get('/', loginController.home);
router.post('/', loginController.login);
router.get('/allocate', loginController.g_allocate);
router.post('/allocate', loginController.allocate);
router.get('/logout', loginController.logout);
router.post('/logout', loginController.logout);
router.get('/register', loginController.g_register);





module.exports = router;
