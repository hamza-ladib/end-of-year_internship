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
module.exports.getAllrepresententes=async(req,res)=>{
    const all = await Utilisateur.findAll({
        where: {
        }, include: [{
            model: Role,
            where:{
                    name:"représentant"
            }
          }]
    })
    console.log(all)
   res.send(all);


}
module.exports.inviteCommission=async(req,res)=>{
////   user ,demande,
        try{
             console.log("---------------------------")
             console.log(req.body)
             console.log("---------------------------")
            /** find demand and user */
            const demande = await Demande.findOne({where: { id : req.body.idDemande}})
            console.log('user',demande.userId)
            const user = await Utilisateur.findOne({where : { id:demande.userId}})
            
        /*************************** add the attachement ****************************** */
                    console.log(req.body.tyepFile)
                      const attachement = await Upload.create({ name:req.body.name, fichier:req.body.fichier, idFichier:req.body.idFichier, typeFichier: 'commission '+req.body.tyepFile});
                      await user.addUpload(attachement)
                      await demande.addUpload(attachement)
                      /****************************************** */
        await Demande.update({ etat: 'attente '+req.body.tyepFile.substring(0,1)}, { where: {id: req.body.idDemande}});
            // Send Email to service technique
            for(let rep of req.body. commission){
        
     /* let userEmail='hamza2015ladib@gmail.com' */
     sendMail(rep.email,'invitation donnes avis  ','vous aver inviter pour donnez votre avis a propos de la demande '+demande.ref_numero+' concernant  '+demande. objet+' merci de votre attention pour donnez '+req.body.tyepFile);

            }
            sendMail(user.email,'invitation donnes avis ' ,'votre demande ref :  '+demande.ref_numero+' concernant  '+demande. objet+' et en attent l autorisation de president  , merci de votre ');


                             /////////////////// FOR GENERATING AN EMAIL ///////////////////////
             

          res.status(201).send({message:"commission successefully invited"});
    }
    catch(e){
        console.log(e);

    }
}
/************************************************ */

