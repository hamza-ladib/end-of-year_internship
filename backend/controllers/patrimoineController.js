
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
module.exports.getAllDemandes =async(req,res)=> {
    let i=req.params.id
    try {
         const demande = await Demande.findAll({
            where : { 
            etat :"attente a",
            longitude:{[Op.ne]:null},
            latitude:{[Op.ne]:null},
        },
        include: [{
            model: Commentaire,
          }],
        }
        
        )
    return res.json(demande)   
    }catch(err) {
        console.log(err)
    }

} 

module.exports.addAhutorisation=async(req,res)=>{
    console.log(req.body);




    /********* give a descision to demande ****** */












    /*********************************************************** */
    ////   user ,demande,
      try{
                /** find demand and user */
                const demande = await Demande.findOne({where: { id : req.body.idDemande}})
                const user = await Utilisateur.findOne({where : { id:demande.userId}})
                
            /*************************** add the attachement ****************************** */
                          const attachement = await Upload.create({ name:req.body.name, fichier:req.body.fichier, idFichier:req.body.idFichier, typeFichier: 'patrimoine',isSigned:'true'});
                          await user.addUpload(attachement)
                          await demande.addUpload(attachement)
                          /****************************************** */
           /*  await Demande.update({ etat: 'attente'+req.body.tyepFile.substring(0,1)}, { where: {id: req.body.idDemande}}); */
                // Send Email to service technique
               // sendMail(user.email,' Actualités concernant votre demande ' ,'votre demande ref :  '+demande.ref_numero+' concernant  '+'demande. objet'+' et en attent le signature de  l autorisation  par president, cordinalement ');
    
    
                                 /////////////////// FOR GENERATING AN EMAIL ///////////////////////
                 
    
              res.status(200).send({message:"authorisation successefully added"});
       
             }
        catch(e){
            console.log(e);
    
        }  
    }
    module.exports.notAuthorized=async(req,res)=>{
        console.log(req.body);
        ////   user ,demande,
                try{
                    const demande = await Demande.findOne({where: { id : req.body.idDemande}})
                    const user = await Utilisateur.findOne({where : { id:demande.userId}}) 
                    
                /*************************** add the attachement ****************************** */
                              /****************************************** */
                                     /////////////////// FOR GENERATING AN EMAIL ///////////////////////
                     
sendMail(user.email,' Actualités concernant votre demande ' ,'votre demande ref :  '+demande.ref_numero+' concernant  '+demande. objet+' n est pas autoriser par service patrimoine'+' cause :'+ req.body.comment+', cordinalement');

                  res.status(200).send({message:" refused success"});
            }
            catch(e){
                console.log(e);
        
            }
        }