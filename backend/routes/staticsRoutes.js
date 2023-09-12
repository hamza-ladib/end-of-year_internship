const express = require('express');
const router = express.Router();
const {staticsDemandes,StaticsComission,StaticsFiles,StaticsUsers}=require('../controllers/statisticsController');
router.get('/demandes',staticsDemandes);
router.get('/users',StaticsUsers);
router.get('/commentaires',StaticsComission);
router.get('/files',StaticsFiles);

module.exports = router;