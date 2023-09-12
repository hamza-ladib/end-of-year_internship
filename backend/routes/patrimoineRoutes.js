const express = require('express');
const router = express.Router();
const {getAllDemandes,addAhutorisation,notAuthorized}=require('../controllers/patrimoineController');
const {upload}=require("../multer");




router.get('/all',getAllDemandes);
router.post('/authorized',addAhutorisation);
router.post('/notAuthorized',notAuthorized);
/* router.post('/signeeConvocation',upload,signeeConvocation);
router.post('/signeeMainLeveen',upload,signeeMainLevee); */
module.exports = router;