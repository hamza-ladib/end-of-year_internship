const express = require('express');
const router = express.Router();
const {getAllrepresententes,inviteCommission}=require('../controllers/inviteCommissionController');
const {upload}=require("../multer");



router.get('/all',getAllrepresententes);
router.post('/invite',upload,inviteCommission);
module.exports = router;