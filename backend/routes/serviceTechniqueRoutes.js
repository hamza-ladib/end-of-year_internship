const express = require('express');
const router = express.Router();
const {accepterDemande,incompleteDemande,archiverDemande}=require('../controllers/serviceTechniqueController');
const {upload}=require("../multer");

router.post('/accepter/:id',accepterDemande);
router.post('/incomplete/:id',incompleteDemande);
router.post('/archiver/:id',archiverDemande);
router.post('/archiver/:id',archiverDemande);
module.exports = router;