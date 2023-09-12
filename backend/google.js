const  {google} =require("googleapis");
const fs  =require('fs');

const authenticateGoogle = () => {
      
 const auth = new google.auth.GoogleAuth({
   keyFile: `${__dirname}/googledrive.json`,
   scopes: "https://www.googleapis.com/auth/drive",
 });
 console.log("drive connected")
 return auth;
};
/** to uploid files  */
const uploadToGoogleDrive = async (file, auth) => {
 const fileMetadata = {
   name: file.originalname,
   parents: ["1JsFHUcR2gwfZ7fPP2wlFJqOqCURU3eHW"],
   Permissions:{
     role:'reader',
     type:'anyone',
     allFileDiscovery:false,
     publicc:'true'
   }
 };

 const media = {
   mimeType: file.mimetype,
   body: fs.createReadStream(file.path),
 };

 const driveService = google.drive({ version: "v3", auth });

 const response = await driveService.files.create({
   requestBody: fileMetadata,
   media: media,
   fields: "id,webViewLink",
 });
 return response.data;
 };



  let getOne = async(auth,name,dest)=>{
     try {
       const res = await google.drive({ version: "v3", auth }).files.list({
       // to exclude Google Drive folders
         q: `name= '${name}'`,
         
       });
       const files = res.data.files;
       /**** */
       if (files.length) {
         const fileId = files[0].id;

         google.drive({ version: "v3", auth }).files.get({ fileId, alt: 'media' }, { responseType: 'stream' }, (err, res) => {
           if (err) {
             console.error(err);
           } else {
              res.setHeader('Content-Type', 'application/pdf');
             res.setHeader('Content-Disposition', `attachment; filename=${name}`);
             res.data.pipe(dest);
           }
         });
        
        // const result =await google.drive({ version: "v3", auth }).files.get({ fileId,fields:'id,webContentLink' });
                 // return result.data.webContentLink;
       }



       /***** */


     } catch (err) {
       console.error(err);
     }
   }
   
   

   const updateGoogleDriveFile = async (fileId, file, auth) => {
    const fileMetadata = {
      name: file.originalname,
    };
  
    const media = {
      mimeType: file.mimetype,
      body: fs.createReadStream(file.path),
    };
  
    const driveService = google.drive({ version: "v3", auth });
  
    const response = await driveService.files.update({
      fileId: fileId,
      requestBody: fileMetadata,
      media: media,
      fields: "id,webViewLink",
    });

    return response.data;
  };
  const deleteFileInDrive=async(idFile,auth)=>{
const driveService = google.drive({ version: "v3", auth });
const response =await  driveService.files.delete({fileId: idFile,
}, (err, res) => {
if (err) {
console.log('The API returned an error: ' + err);
return;
}
});
return {message:"succes delete " };
}
 
 
 
 module.exports ={authenticateGoogle,uploadToGoogleDrive,getOne,updateGoogleDriveFile,deleteFileInDrive};