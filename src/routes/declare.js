const express = require('express');
const router = express.Router();

const declareController = require('../app/controllers/DeclareController');

router.get('/', declareController.activate);
router.get('/progress', declareController.progress);
router.put('/:code', declareController.complete);







module.exports = router;
