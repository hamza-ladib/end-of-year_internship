const multer=require('multer');
const ID_USER=3;
const  TYPE="CR"
const storage=multer.diskStorage({
    destination:function(req,file,cb){cb(null,'uploads')},
    filename:function(req,file,cb){cb(null,file.originalname)}
});
const upload =multer({storage}).array("files");
module.exports={upload};