const express = require('express');
const router = express.Router();
const Auth = require('../app/middleware/Auth');
const loginController = require('../app/controllers/LoginController');
const allocateController = require('../app/controllers/CityController');



router.get('/login', loginController.g_login);
router.post('/', loginController.login);
router.get('/logout', loginController.logout);
router.post('/logout', loginController.logout);
router.get('/register', loginController.g_register);
router.get('/', Auth.auth, loginController.home);
router.get('/allocate',  Auth.auth, loginController.g_allocate);
router.post('/allocate', Auth.auth, loginController.allocate);
router.get('/allocate/:code',  Auth.auth, allocateController.showUnit);






module.exports = router;
