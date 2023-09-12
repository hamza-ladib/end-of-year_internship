const express = require('express');
const router = express.Router();
const {getAllDemande,getDescisions,notAuthorized,addAhutorisation}=require('../controllers/decisiontoDemande');
const {upload}=require("../multer");



router.get('/demande/:id',getAllDemande);
router.get('/descisions/:id',getDescisions);
router.post('/notAuthorized/',notAuthorized);
router.post('/addAhutorisation/',upload,addAhutorisation);
module.exports = router;