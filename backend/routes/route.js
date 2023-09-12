const express = require('express');
const router = express.Router();
const { getUserByTokenEmail, getUserByEmail,checkCode,resetPswd,signUpUser,refreshToken,
    getUserAuth,addNewUserTest,updateUser,addMessage,getDemandeInfos,
    getSingleDemande, deleteSingleDemande,saveSingleDemande,updateSingleDemande,updateArchiveDemande,getAllDemande,acceptDemande,refuseDemande,
    getAllUsers,addDemandeToUser,archiveDemandeToUser,getUser,getFeedBack,addDecision,saveToGoogleDrive,deleteFromGoogleDrive,updateAddDemandeToUser,
    updateArchiveDemandeToUser,getNumberSavedDemandes,enregistrerDemande,addPresident,getAcceptedDemand,getAllEnregistredDemande,stopDemande,
    getNonCoordinatedDemande,addCoordination,countNoneCoordination,getAllAuthorisedDemande,addDossierRecolement,getAllFinishedDemande,addDemandMainLavee,
    getAllDecision,getAuthorisationsFile,getConvocationsFile,getMainLevéeFile,countNoneAuthorised,countNoneConvocated,countNoneMainLevee,
    getAllDemandeForTechniqueS,updateDescision,informAll} = require('../controllers/userController')
const {upload}=require("../multer"); 


////// to test the adding 
router.post('/addPresident',addPresident)


/* save **/
router.post('/s',upload,async(req,res)=>{
  let result= await saveToGoogleDrive(req.files[0]);
  console.log("result",result);
  console.log('----------------------------------------')
    res.json(result);})
    
    /**** delete ***/
  router.post('/d',async(req,res)=>{
    let idFichier=req.body.idFichier;
    let result= await deleteFromGoogleDrive(idFichier);
    res.json(result);
  })


  // to get all demands for service technique 
router.get('/getAllDemandeTech',getAllDemandeForTechniqueS)

// to get all the authorizations that still not signed
router.get('/countNoneAuthorised',countNoneAuthorised)


// to get all the authorizations that still not signed
router.get('/countNoneConvocated',countNoneConvocated)

// to get all the authorizations that still not signed
router.get('/countNoneMainLevee',countNoneMainLevee)



// to get all the authorizations that still not signed
router.get('/getUnsignedAut',getAuthorisationsFile)

// to get all the convocations that still not signed
router.get('/getUnsignedconv',getConvocationsFile)

// to get all the main levée that still not signed
router.get('/getUnsignedMain',getMainLevéeFile)

// to get all the demandes of an user that have state "terminer"
router.post('/getFinishedDemande',getAllFinishedDemande)

// to get all the demandes of an user that have state "authoriser"
router.post('/getAllAuthorisedDemande',getAllAuthorisedDemande)

// to get the number of the demandes that are not coordinated
router.get('/countNoneCoordination',countNoneCoordination)

// to get all the demandes of state "enregistrer"  
router.get('/getEnregistredDemande',getAllEnregistredDemande)

// to get all the demandes that still don't have coordination  
router.get('/getNonCoordinatedDemande',getNonCoordinatedDemande)


// to get all the demandes of state "accepter"
router.get('/getAcceptedDemand',getAcceptedDemand)


// to get the number of all sended demandes
router.get('/getNumber',getNumberSavedDemandes)

// to get all users
router.get('/getAllUsers',getAllUsers)



// to refuse a demand
router.get('/refuseDemande',refuseDemande)

// to get all demands
router.get('/getAllDemande',getAllDemande)


// to update definitely a demande
//router.post('/updateSaveDemande',upload,updateSingleDemande)




//to get the infos of the demandes of an user
router.post('/getDemande',getDemandeInfos)

//to add demand to main levée
router.post('/addDemandMain',upload,addDemandMainLavee)

//to add dossier recolement
router.post('/addDossier',upload,addDossierRecolement)


//to add a new message of the user
router.post('/addMessage',upload,addMessage)

// to add a new user Test
router.post('/registerTest',upload,addNewUserTest)



// to update an User
router.post('/update',updateUser)

// to sign up a new user
router.post('/sign',signUpUser)

// to get the user by the tokenEmail 
router.post('/userEmail',getUserByEmail)

// to get the user by the codeVerif 
router.post('/checkCode',checkCode)

// to refresh the access token
router.get('/refresh',refreshToken)

// to refresh the access token
router.get('/userAuth',getUserAuth)


// to get the user by the tokenEmail 
router.get('/verifyEmail/:token',getUserByTokenEmail)

// to reset the password of the user
router.post('/resetPswd/:id',resetPswd)

// to get single demande of the user
router.get('/getSingleDemande/:id',getSingleDemande)

// to delete single demande of the user
router.get('/deleteSingleDemande/:id',deleteSingleDemande)

// to Change the state of the demand to "enregistrer"
router.get('/saveSingleDemande/:id',saveSingleDemande)

// to update  a demande "envoyer"
//router.post('/updateSaveDemande/:id',upload,updateSingleDemande)
router.post('/updateSaveDemande/:id',updateAddDemandeToUser)


// to update and archive a demande "archiver"
//router.post('/updateArchiveDemande/:id',upload,updateArchiveDemande)
router.post('/updateArchiveDemande/:id',updateArchiveDemandeToUser)




// to add demande to user with the state "enregistrer"
router.post('/addDemande/:id',upload,addDemandeToUser)

// to add demande to user with the state "archiver"
router.post('/archiveDemande/:id',upload,archiveDemandeToUser)

// to get specific user by it's id
router.get('/getUser/:id',getUser)

// to get the feedBacks of the representants
router.get('/getFeedBack/:id',getFeedBack)

// to add the feedBack of an user
router.post('/addFeedBack/:id',addDecision)
router.post('/updateFeedBack/:id',updateDescision)

// to change the state of a demand to "enregistrer"
router.get('/enregistreDemande/:id',enregistrerDemande)

// to accept a demand
router.post('/acceptDemande/:id',acceptDemande)

// to change the state of a demande to "en attente"
router.post('/stopDemande/:id',stopDemande)

// to add coordination to a demande
router.post('/addCoordination/:id',addCoordination)

//to get all the decision about a demand
router.get('/getAllDecision/:id',getAllDecision)
// mailing 
router.post('/sendMail',informAll)

module.exports = router;