const express = require('express');
const router = express.Router();
const auth = require('../app/middleware/Auth');
const loginController = require('../app/controllers/LoginController');

router.get('/login', loginController.g_login);
router.post('/login', loginController.login);
router.get('/allocate', loginController.allocate);
router.post('/allocate', loginController.allocate);
router.get('/logout', loginController.logout);
router.post('/logout', loginController.logout);




module.exports = router;
