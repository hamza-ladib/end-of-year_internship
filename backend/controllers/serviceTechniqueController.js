const User = require('../models/user')
const { Utilisateur, Personnephy,Entreprise,Organisme,Role,Upload,Message,Demande, Commentaire} = require('../models/client')
//const {Animal,Dog,Cat,Bird} = require('../models/dogAnimal')
//const {Telechargement} = require('../models/uploads')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const uuid = require('uuid')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
require('dotenv').config();
const fs = require('fs');
let express=require('express')
let {authenticateGoogle,uploadToGoogleDrive,updateGoogleDriveFile} =require("../google");
const {upload}=require('../multer');
const { where, json } = require('sequelize')
express().use(express.urlencoded({ extended: true }));
express().use(express.json());
const { Op } = require('sequelize'); 
/* sendMail=(to,subject,body) */
const {sendMail} =require('../helpers/mailer');
//////////////////////////////// accepter //////////////////////////////////////////////////////
module.exports.accepterDemande=async(req,res)=>{
    let userEmail= await  findMailFromDemande(req.params.id).then(res=>res);
    sendMail(userEmail,'acceptation de demande',' votre demande '+ req.params.id+' a etait acccepter par success');
     chageStateTo(req,res,'accepter'); 
}
//////////////////////////////// incmpltet //////////////////////////////////////////////////////
module.exports.incompleteDemande=async(req,res)=>{
    
    const message = req.body.message;
    let userEmail= await  findMailFromDemande(req.params.id).then(res=>res);

 sendMail(userEmail,'acceptation de demande',' votre demande '+ req.params.id+' est  incmplete cause de  '+message); 
     chageStateTo(req,res,'incomplete');
}
//////////////////////////////// archiver //////////////////////////////////////////////////////
module.exports.archiverDemande=async(req,res)=>{
    chageStateTo(req,res,'classer');
}

module.exports.AddAuthorisation = async(req,res)=> {
    try{
        const user = await Utilisateur.findOne({where : { id: req.body.id}})
        const demande = await Demande.findOne({where: { id : req.body.demandeID}})
        for (var i = 0; i < req.files.length; i++) {
            let file = req.files[i];
            const {path} =file
                const auth = authenticateGoogle();
                  console.log("uploading ...  " + file.originalname);
                  const response = await uploadToGoogleDrive(file, auth);
                  const attachement = await Upload.create({ name: file.originalname, fichier: response.webViewLink, idFichier: response.id, typeFichier: 'autorisation' });
                  await user.addUpload(attachement)
                  await demande.addUpload(attachement)
                  console.log("done uploading");
                  fs.unlinkSync(path);
                }
      
              const answer = {
                message: ' Votre dossier de recolement a été envoyé avec succès.',
                state: true
            }
            res.json(answer)
    }
    catch(err){
        console.log(err)
    }
}

            






/**  change to any State****/ 
let chageStateTo= async(req,res,status)=>{

    try {
    const demandId = req.params.id
    await Demande.update({ etat: status }, {
        where: {
          id: demandId
        }
      });
    const answer = {
        message: ' Votre demand e a été ' +status+ ' avec succès. ',
        state: true
    }

    return res.json(answer)
    }
    catch(err) {
        console.log(err)
    }
}

/***  find  user Mail from demande id***/
findMailFromDemande=async(id)=>{
    const demande = await Demande.findOne({where : {id :id}})
    const idUser = demande.userId;
  let userFinded = await Utilisateur.findOne({where: { id: idUser}})
  let ID =userFinded.email;
  return ID;

}

