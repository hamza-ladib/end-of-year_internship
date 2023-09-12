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

/*************************************************** signature ************************************************************* */
module.exports.signeeAuthorisation=async(req,res)=>{

    try{
        /** find demand and user */
        const demande = await Demande.findOne({where: { id : req.body.old.demandeId}})
        const user = await Utilisateur.findOne({where : { id:req.body.old.userId}})
        console.log(demande.etat)
        
    /*************************** add the attachement ****************************** */
               
                   
        
                  /****************************************** */
                  
                if(demande.etat=='attente a'){

                    await Upload.update(
                        { name:req.body.name, fichier:req.body.fichier,isSigned:'true',idFichier:req.body.idFichier},
                        {
                            where:{id:req.body.old.id,}}
                        
                        
                        );



                    await Demande.update({ etat: 'autoriser'}, { where: {id:req.body.old.demandeId}});
                    sendMail(user.email,' Actualités concernant votre demande  ' ,'Votre demande avec la référence'+demande.ref_numero+' et pour objet :  '+demande. objet+'a été signée par le président. Vous pouvez recevoir votre autorisation sur notre plateforme ou via le lien <<< '+req.body.fichier +'Nous vous remercions pour votre patience. Salutations');


                }
   
     else  if(demande.etat=='attente d'){
        await Upload.update(
            { name:req.body.name, fichier:req.body.fichier,isSigned:'true',idFichier:req.body.idFichier},
            {
                where:{id:req.body.old.id,}}
            );
        await Demande.update({ etat: 'terminer'}, { where: {id:req.body.old.demandeId}});
        sendMail(user.email,' Actualités concernant votre demande  ' ,' concernanat Votre demande avec la référence'+demande.ref_numero+' et pour objet :  '+demande. objet+'Votre dossier a été vérifié avec succès et votre demande a été traitée. Vous pouvez passer à l étape suivante, qui est la main  levée. Vous pouvez consulter l autorisation de votre dossier via le lien <<< ' +req.body.fichier +' >>> Nous vous remercions de votre patience. Salutations');
     
    }
    
        // Send Email to service technique                         /////////////////// FOR GENERATING AN EMAIL ///////////////////////
         
                    }
                    catch(e){
                        console.log(e)
                    }
    res.status(201).send({'message':'successefully signed authorisation'});
    

}
module.exports.signeeConvocation=async(req,res)=>{    
        try{
            /** find demand and user */
            const demande = await Demande.findOne({where: { id : req.body.old.demandeId}})
            const user = await Utilisateur.findOne({where : { id:req.body.old.userId}})
            
        /*************************** add the attachement ****************************** */
        console.log(req.body)
        await Upload.update(
            { name:req.body.name, fichier:req.body.fichier,isSigned:'true',idFichier:req.body.idFichier},
            {
                where:{id:req.body.old.id,}}
            
            
            );
                        console.log('------------------------------------------------------')
             console.log("efef")
             console.log('------------------------------------------------------')
             console.log("--------------------------------------")
        res.status(201).send({'message':'successefully signed convocation'});

                      /****************************************** */
        //await Demande.update({ etat: 'autoriser'}, { where: {id:req.body.old.demandeId}});
            // Send Email to service technique
            //sendMail(user.email,' Actualités concernant votre demande ' ,'votre demande ref :  '+demande.ref_numero+' concernant  '+demande. objet+' et signer vous pover télecharger   directement // '+ req.body.fichier +' // cordinalement');
                             /////////////////// FOR GENERATING AN EMAIL ///////////////////////
             
                        }
                        catch(e){
                            console.log(e)
                        }
    
        
        
    
    }


module.exports.signeeMainLevee=async(req,res)=>{
        try{
            /** find demand and user */
            const demande = await Demande.findOne({where: { id : req.body.old.demandeId}})
            const user = await Utilisateur.findOne({where : { id:req.body.old.userId}})
            
        /*************************** add the attachement ****************************** */
                      await Upload.update(
                        { name:req.body.name, fichier:req.body.fichier,isSigned:'true',idFichier:req.body.idFichier},
                        {
                            where:{id:req.body.old.id,}}
                        
                        
                        );
            
                      /****************************************** */
        await Demande.update({ etat: 'terminer'}, { where: {id:req.body.old.demandeId}});
            // Send Email to service technique
            sendMail(user.email,' Actualités concernant votre demande ' ,' la main levee de votre demande ref :  '+demande.ref_numero+' concernant  '+demande. objet+' et signer vous pover télecharger   directement // '+ req.body.fichier +' // cordinalement');
                             /////////////////// FOR GENERATING AN EMAIL ///////////////////////
                        }
                        catch(e){
                            console.log(e)
                        }
        res.status(201).send({'message':'successefully signed main leve'});
        
    
    

}