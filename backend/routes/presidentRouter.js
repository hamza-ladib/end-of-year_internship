const express = require('express');
const router = express.Router();
const {signeeAuthorisation,signeeConvocation,signeeMainLevee}=require('../controllers/presidentController');
const {upload}=require("../multer");




router.post('/signeeAuthorisation',upload,signeeAuthorisation);
router.post('/signeeConvocation',upload,signeeConvocation);
router.post('/signeeMainLeveen',upload,signeeMainLevee);
module.exports = router;