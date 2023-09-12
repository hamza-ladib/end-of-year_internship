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
const {sendMail} =require('../helpers/mailer');
express().use(express.urlencoded({ extended: true }));
express().use(express.json());
const { Op } = require('sequelize');  

module.exports.saveToGoogleDrive=async(file)=>{
    let name=file.originalname;
    try{
      const {path} =file;
          const auth = authenticateGoogle();
            console.log("uploading ...  " + file.originalname);
            const response = await uploadToGoogleDrive(file, auth);
            console.log("done uploading");
            
            fs.unlinkSync(path);
            return{ name:name , fichier: response.webViewLink, idFichier: response.id};
          }
   catch (err) {
          console.log(err);
        }
  }
  /*** fin **********************************************************************************/
  /*** debut **********************************************************************************/
  module.exports.deleteFromGoogleDrive=async(idFile)=>{
    const auth = authenticateGoogle();
    console.log("deleting ...  " + idFile);
    let res=deleteFileInDrive(idFile,auth);
    return res;
  }
  /*** fin **********************************************************************************/


//****************************************************************************************************************** */
                                    //  API FOR SERVICE TECHNIQUES 

// ---------------- function to get all the décisions of representants to a demand ----------------
module.exports.getAllDecision = async(req,res)=> {
    try {
        const demande = await Demande.findOne({
            where :  { 
                id : req.params.id,
                etat: 'enregistrer'
            },
            include: Commentaire
        })
       return res.json(demande)

    } catch (err) {
        console.log(err)
    }
}



// ----------------- function to get all demands for service technique ---------------------------- 
module.exports.getAllDemandeForTechniqueS =async(req,res)=> {
    try {
         let  demande = await Demande.findAll();
         demande=demande.filter(x=>x.etat!="envoyer" && x.etat!='archiver')
         console.log(demande);
    return res.json(demande)   
    }catch(err) {
        console.log(err)
        }
} 


// ----------------- function to get all demandes that have state "enregistrer" --------------------
module.exports.getAllEnregistredDemande =async(req,res)=> {
    try {
         const demande = await Demande.findAll({where : { etat : 'enregistrer'}})
    return res.json(demande)   
    }catch(err) {
        console.log(err)
        }

} 
// ----------------- function to update the state of demande to "accepter" --------------------
module.exports.acceptDemande = async(req,res)=> {
    try {
    const demandId = req.params.id
    await Demande.update({ etat: 'accepter' }, {
        where: {
          id: demandId
        }
      });
    const answer = {
        message: ' Votre demande a été accepter avec succès.',
        state: true
    }
    return res.json(answer)
    }
    catch(err) {
        console.log(err)
    }
}
// ----------------- function to update the state of demande to "en attente" --------------------
module.exports.stopDemande = async(req,res)=> {
    try {
    const demandId = req.params.id
    await Demande.update({ etat: 'en attente' }, {
        where: {
          id: demandId
        }
      });
    const answer = {
        message: 'En raison d\'un manque d\'informations, la demande suivante a été consignée dans les archives.',
        state: true
    }
    return res.json(answer)
    }
    catch(err) {
        console.log(err)
    }
}








//******************************************************************************************************************* */








//****************************************************************************************************************** */
                                    //  API FOR BUREAU ORDRE 

// --------------- function that will change the state of the demande to "enregistrer" !!! for bureau d ordre !!! 
module.exports.enregistrerDemande = async(req,res)=> {
    try {
       await Demande.update({ etat: 'enregistrer' }, {
            where: {
              id: req.params.id
            }
          })
        const demande = await Demande.findOne({where : {id : req.params.id}})
          const idUser = demande.userId
        let userFinded = await Utilisateur.findOne({where: { id: idUser}})

        const answer = {
            message: `La demande a été enregistrée avec succès, et un e-mail a été envoyé`,
            state: true
        }
                 /////////////////// FOR GENERATING AN EMAIL ///////////////////////
         
                 let config = {
                    service: 'gmail',
                    auth: {
                        user: process.env.EMAIL,
                        pass: process.env.PASSWORD
                    }
                }
                let transporter = nodemailer.createTransport(config)
                let message = {
                    from: process.env.EMAIL,
                    to: userFinded.email,
                    subject: "- Votre demande a été bien enregistrer -",
                    html: `
                    <div style="padding: 20px" >
                    <h2>Bonjour,</h2>
                    <p style="padding-left: 13px">Votre demande ${demande.ref_numero} a été enregistrée avec succès. Elle sera maintenant traitée, et nous vous informerons de toute mise à jour éventuelle.</p>    
                </div>
                `
                }
                transporter.sendMail(message)
        res.json(answer)
    } catch (err) {
        console.log(err)
    }
}


// --------------- function that will get the numbers of the demand that have the state "envoyer" !!! for the bureau d'ordre ----------------------
module.exports.getNumberSavedDemandes = async(req,res)=> {
    try {
        const numberDemande = await Demande.count({where : { etat : 'envoyer'}})
        res.json(numberDemande)
    } catch (err) {
        console.log(err)
    }
}

// ----------------- function to get all users that have been created by "bureau d'ordre" --------------------
module.exports.getAllUsers = async(req,res)=> {
    try {
       const users = await Utilisateur.findAll({where : {selfCreated: false}})
    return res.json(users)     
    }catch(err) {
        console.log(err)
    }

}

// ----------------- function to get all demandes of an user that have state "terminer" --------------------
module.exports.getAllFinishedDemande =async(req,res)=> {
    try {
        const demande = await Demande.findAll({
            where: {
                userId: req.body.userId,
                etat: 'terminer'
            },
            include: [{
                model: Upload,
             /*   where: {
                    typeFichier: {
                        [Op.not]: 'main levée'
                    }
                },*/
            }]
          });
          return res.json(demande.filter(x=>{
            for(let up of x.uploads){
               if(up.typeFichier== 'main levée')
               return
            }
            return x;
         }
          
         ));
        }  catch(err) {
            console.log(err)
        }
} 




// ----------------- function to get all demandes of an user that have state "authoriser" --------------------
module.exports.getAllAuthorisedDemande =async(req,res)=> {
    try {
        const demande = await Demande.findAll({
            where: {
                userId: req.body.userId,
                etat: 'autoriser'
            },
        include: [{
                model: Upload,
/*                 required: true,
                where: {
                    typeFichier: {
                        [Op.not]: 'dossier recolement'
                    }
                }, */
            }] 
          });

          return res.json(demande.filter(x=>{
             for(let up of x.uploads){
                if(up.typeFichier== 'dossier recolement')
                return
             }
             return x;
          }
           
          ));
        }  catch(err) {
            console.log(err)
        }
} 



// ----------------- function to get all demandes that have state "envoyer" --------------------
module.exports.getAllDemande =async(req,res)=> {
    try {
         const demande = await Demande.findAll({where : { etat : 'envoyer'}})
    return res.json(demande)   
    }catch(err) {
        console.log(err)
    }

} 

// ----------------- function to get single user by it's id -------------------------
module.exports.getUser = async(req,res)=> {
    try {
          const user = await Utilisateur.findOne({where : {id : req.params.id}})
    return res.json(user)  
    }
    catch(err) {
        console.log(err)
    }
}





//************************************************* END ************************************************************ */










//****************************************************************************************************************** */
                                    //  API FOR PATRIMOINE 

// function to get all the demandes of state "accepter"
module.exports.getAcceptedDemand = async(req,res)=> {
    try {
        const demandes = await Demande.findAll({where : { etat : 'accepter'}})
        res.json(demandes)
    } catch (err) {
        console.log(err)
    }
}








//****************************************************************************************************************** */






//****************************************************************************************************************** */
                                    //  API FOR PRESIDENT 







//****************************************************************************************************************** */










//****************************************************************************************************************** */
                                    //  API FOR REPRESENTANT 


//---> Function to get the number of the demandes that need coordination 
module.exports.countNoneAuthorised = async(req,res)=> {
    try {
    
        const numberDemande = await Upload.count({where :
             {typeFichier: 'authorisations',
             isSigned: 'false'
            }})
            res.json(numberDemande)
    
    } catch(err) {
        console.log(err)
    }
    
    }


//---> Function to get the number of the demandes that need coordination 
module.exports.countNoneConvocated = async(req,res)=> {
    try {
    
        const numberDemande = await Upload.count({where :
             {typeFichier: 'convocations',
             isSigned: 'false'
            }})
            res.json(numberDemande)
    
    } catch(err) {
        console.log(err)
    }
    
    }

//---> Function to get the number of the demandes that need coordination 
module.exports.countNoneMainLevee = async(req,res)=> {
    try {
    
        const numberDemande = await Upload.count({where :
             {typeFichier: 'main levée',
             isSigned: 'false'
            }})
            res.json(numberDemande)
    
    } catch(err) {
        console.log(err)
    }
    
    }





// --------------- function to get all the autorisation that still not signed ----------------------------------------
module.exports.getAuthorisationsFile = async(req,res)=> {
    try {
        const upload = await Upload.findAll({where: {
            typeFichier: 'authorisations',
            isSigned: 'false'
        }})

        res.json(upload)

    } catch (err) {
        console.log(err)
    }
}


// --------------- function to get all the convocations that still not signed ----------------------------------------
module.exports.getConvocationsFile = async(req,res)=> {
    try {
        let  upload = await Upload.findAll({ where : {
            typeFichier: {
                [Op.like]: 'commission%',
              },
        }}).then(data=>data)
        upload=upload.filter(x=>x.isSigned!='true');
        console.log("-------------------------------------------------------------")     
        console.log(upload)
        console.log("-------------------------------------------------------------")   
        res.send(upload);

    } catch (err) {
        console.log(err)
    }
}

// --------------- function to get all the Main levée that still not signed ----------------------------------------
module.exports.getMainLevéeFile = async(req,res)=> {
    try {
        let upload = await Upload.findAll({ where : {
            typeFichier : 'main levée',
        }}).then(res=>res);
        upload=upload.filter(x=>x.isSigned!='true');
        res.send(upload);

    } catch (err) {
        console.log(err)
    }
}



/*** update feedBack*** */
module.exports.updateDescision = async(req,res)=> {
    try {
    /* const demande = await Demande.findOne({where :{ id : req.params.id}})
    const user = await Utilisateur.findOne({where :{id : req.body.idUser}}) */
    const remarque = await Commentaire.update({ sujet:req.body.sujet, message:req.body.message}, {
            where: {
              userId:req.body.idUser,
              demandeId:req.params.id,
            }
        }

    )
    /* await demande.addCommentaire(remarque)
    await user.addCommentaire(remarque) */

    const answer = {
        message: 'Votre commentaire a été bien sauvegarder.',
        state: true
    }
    return res.json(answer)
    }
    catch(err) {
        console.log(err)
    }
}


// ----------------- function that will add the decision of the representant to a demande !!! for representant  -----------------------
module.exports.addDecision = async(req,res)=> {
    try {
    const demande = await Demande.findOne({where :{ id : req.params.id}})
    const user = await Utilisateur.findOne({where :{id : req.body.idUser}})
    const remarque = await Commentaire.create({
        sujet: req.body.sujet,
        message: req.body.message
    }) 
    await demande.addCommentaire(remarque)
    await user.addCommentaire(remarque)

    const answer = {
        message: 'Votre commentaire a été bien sauvegarder.',
        state: true
    }
    return res.json(answer)
    }
    catch(err) {
        console.log(err)
    }
}


// ----------------- function that will return for me the feedback of a representant to a demand and the info of the demand !!! for the representant !!!
module.exports.getFeedBack = async(req,res)=> {
    try {
     const commentaires = await Commentaire.findAll({
        where: {
            userId: req.params.id,
        },
        include: Demande
      });
      
      res.json(commentaires)       
    } catch(err) {
        console.log(err)
    }

}







//***************************************************************************************************************************** */







//******************************************************************************************************************************* */
                                    //  API FOR DEMANDEUR 

// ----------------- function to delete a demande of the user by it's id --------------------
module.exports.deleteSingleDemande = async (req,res)=> {
    try {   
    const idDemande = req.params.id
    const demande = await Demande.findOne({where : { id: idDemande}})
    await Demande.destroy({where: {id: idDemande}})
    await demande.removeUploads()
    const answer = {
        message: ' Votre demande a été supprimé avec succès.',
        state: true
    }
    return res.json(answer)

    }catch(err) {
        console.log(err)
    }

}

// ----------------- function to update the state of the demand of the user to "envoyer"  --------------------
module.exports.saveSingleDemande = async (req,res)=> {
    try {
    const idDemande = req.params.id
    await Demande.update({ etat: "envoyer" }, {
        where: {
          id: idDemande
        }
      });
    return res.json(true)
    }catch(err) {
        console.log(err)
    }

}



// -------------------- function to update the profile of the demandeur -----------------
// Personnephy,Entreprise,Organisme,Role
module.exports.updateUser = async (req,res)=> {
    try {
    // The find the user by the email 
    const user = await Utilisateur.findOne({ where : { email : req.body.email }})
    
    // to update the informations that are commun between them 
    await user.update({
    tel: req.body.tel,
    fixe: req.body.fixe,
    adresse: req.body.adresse   
    })

    // If the user is "personne physique"
    if( user.statut === 'personne physique') {
        const userInherit = await user.getPersonnephy()
       await userInherit.update({
            ice: req.body.ice,
            patente: req.body.patente
        })
    }

        // If the user is "representant entreprise"
      else if( user.statut === 'Représentant entreprise ou organisme') {
            const userInherit = await user.getEntreprise()
            await userInherit.update({
                nom: req.body.nom,
                prenom: req.body.prenom,
                cin: req.body.cin
            })
        }
        else if( user.statut === 'Organisme publique') {
            const userInherit = await user.getOrganisme()
            await userInherit.update({
                nom_organisme: req.body.nom_organisme,
                ice: req.body.ice,
            })
        }
        const response = {
            message: ' Vos données ont été mises à jour avec succès.',
            state: true
        }
        return res.json(response)
    }catch(err) {
        console.log(err)
    }
}

// ----------------- function that will add a demande of an user after updating her properties by his id and it will have the state of envoyer -------------
module.exports.updateAddDemandeToUser = async(req,res)=> {
    try {
           const idUser = req.params.id
    const user = await Utilisateur.findOne({where : { id: idUser}})
    const demande = await Demande.findOne({where: { id:req.body.id}})
    await Upload.destroy({ where: { demandeId: demande.id } });
    await Demande.destroy({ where: { id: demande.id } })

    const newDemande = await Demande.create({
        id: req.body.id,
        objet: req.body.objet,
        ref_section: req.body.ref_section,
        ref_numero: req.body.ref_numero,
        date_debut: req.body.date_debut,
        duree: req.body.duree,
        modalite: req.body.modalite,
        descriptif:req.body.descriptif,
        localisation: req.body.localisation,
        etat: 'envoyer'
    })
    await user.addDemande(newDemande)
    
    try {
        for (var i = 0; i < req.body.uploads.length; i++){
                        let upload=req.body.uploads[i];
                          const attachement = await Upload.create(upload);
                          await demande.addUpload(attachement);
                          await user.addUpload(attachement)
                        }
          } catch (err) {
            console.log(err);
          }

          const answer = {
            message: `La demande pour ${user.email} a été modifié et enregistré avec succès.`,
            state: true
        }
        return res.json(answer) 
    }catch(err) {
        console.log(err)
    }

}


// ----------------- function that will add a demande of an user after updating her properties by his id and it will have the state of archiver -------------
module.exports.updateArchiveDemandeToUser = async(req,res)=> {
    try {
            const user = await Utilisateur.findOne({where : { id: req.params.id}})
    const demande = await Demande.findOne({where: { id:req.body.id}})
    await Upload.destroy({ where: { demandeId: demande.id } });
    await Demande.destroy({ where: { id: demande.id } })

    const newDemande = await Demande.create({
        id: req.body.id,
        objet: req.body.objet,
        ref_section: req.body.ref_section,
        ref_numero: req.body.ref_numero,
        date_debut: req.body.date_debut,
        duree: req.body.duree,
        modalite: req.body.modalite,
        descriptif:req.body.descriptif,
        localisation: req.body.localisation,
        etat: 'archiver'
    })
    await user.addDemande(newDemande)
    
    try {
        for (var i = 0; i < req.body.uploads.length; i++){
                        let upload=req.body.uploads[i];
                          const attachement = await Upload.create(upload);
                          await demande.addUpload(attachement);
                          await user.addUpload(attachement)
                        }
          } catch (err) {
            console.log(err);
          }

          const answer = {
            message: `La demande pour ${user.email} a été modifié et enregistré avec succès.`,
            state: true
        }
        return res.json(answer)
    }catch(err) {
        console.log(err);
    }

}

// ----------------- function that will add a demande of an user by his id and it will have the state of archiver --------------------
module.exports.archiveDemandeToUser = async (req,res)=> {
    try {
    const user = await Utilisateur.findOne({where : { id: req.params.id}})
    const demande = await Demande.create({
        objet: req.body.objet,
        ref_section: req.body.ref_section,
        ref_numero: req.body.ref_numero,
        date_debut: req.body.date_debut,
        duree: req.body.duree,
        modalite: req.body.modalite,
        descriptif:req.body.descriptif,
        localisation: req.body.localisation,
        etat: 'archiver'
    })
    await user.addDemande(demande)
    console.log(req.files)
    try {
        for (var i = 0; i < req.files.length; i++) {
            console.log(i)
        let file = req.files[i];
        const {path} =file
            const auth = authenticateGoogle();
              console.log("uploading ...  " + file.originalname);
              const response = await uploadToGoogleDrive(file, auth);
              const attachement = await Upload.create({ name: file.originalname, fichier: response.webViewLink, idFichier: response.id, typeFichier: 'demandes files' });
              await demande.addUpload(attachement);
              await user.addUpload(attachement)
              console.log("done uploading");
              fs.unlinkSync(path);
            }
          } catch (err) {
            console.log(err);
          }


          const answer = {
            message: `La demande pour ${user.email} a été archivé avec succès.`,
            state: true
        }
        return res.json(answer)
    }catch(err) {
        console.log(err)
    }

}



// ----------------- function that will add a demande of an user by his id and it will have the state of envoyer -------------
module.exports.addDemandeToUser = async(req,res)=> {
    try {
    const user = await Utilisateur.findOne({where : { id: req.params.id}})
    const demande = await Demande.create({
        objet: req.body.objet,
        ref_section: req.body.ref_section,
        ref_numero: req.body.ref_numero,
        date_debut: req.body.date_debut,
        duree: req.body.duree,
        modalite: req.body.modalite,
        descriptif:req.body.descriptif,
        localisation: req.body.localisation,
        etat: 'envoyer'
    })
    await user.addDemande(demande)
    
    try {
        for (var i = 0; i < req.files.length; i++) {
        let file = req.files[i];
        const {path} =file
            const auth = authenticateGoogle();
              console.log("uploading ...  " + file.originalname);
              const response = await uploadToGoogleDrive(file, auth);
              const attachement = await Upload.create({ name: file.originalname, fichier: response.webViewLink, idFichier: response.id, typeFichier: 'demandes files' });
              await demande.addUpload(attachement);
              await user.addUpload(attachement)
              console.log("done uploading");
              fs.unlinkSync(path);
            }
          } catch (err) {
            console.log(err);
          }

          const answer = {
            message: `La demande pour ${user.email} a été enregistré avec succès.`,
            state: true
        }
        return res.json(answer)
    }catch(err) {
        console.log(err)
    }

}

// ----------------- function to get a single demande of the user --------------------
module.exports.getSingleDemande = async (req,res)=> {
    try {
    const idDemande = req.params.id
    const demande = await Demande.findOne({where :{ id: idDemande}})
    const uploads = await demande.getUploads()
    return res.json({ demande: demande, uploads: uploads })
    }catch(err) {
        console.log(err)
    }

}


// ----------------- function to get the infos of the demandes of the user --------------------
module.exports.getDemandeInfos = async (req,res)=> {
    try {
    const demande = await Demande.findAll({
        where: {
            userId: req.body.userId
        },
        include: Upload
      });

    return res.json(demande)
    }  catch(err) {
        console.log(err)
    }

}



//**************************************************     END        ************************************************************* */










//****************************************************************************************************************** */
                                    //  API FOR  UTILISATEUR 



// ---------------------function to register a new user test---------------------
module.exports.addNewUserTest = async (req, res) => {
    try {
     const salt = await bcrypt.genSalt(10)
     const hashedPassword = await bcrypt.hash(req.body.password, salt)
     const tokenEmail = uuid.v4()
 
     const user = await Utilisateur.create({
         email: req.body.email,
         password: hashedPassword,
         tokenEmail: tokenEmail,
         emailVerified: false,
         tel: req.body.tel,
         fixe: req.body.fixe,
         adresse: req.body.adresse,
         statut: req.body.statut,
         selfCreated: req.body.selfCreated
 })
 
     // To add a  physique person
     if(req.body.statut === 'Personne physique') {
     const person = await user.createPersonnephy({
         raison_social: req.body.raison_social,
         ice: req.body.ice,
         patente: req.body.patente
     })
 }
 // to add representant entreprise or organisme
 else if(req.body.statut ==='Représentant entreprise ou organisme'){
 
 const RepCompany = await user.createEntreprise({
     nom: req.body.nom,
     prenom: req.body.prenom,
     cin: req.body.cin
 })
 }
 
 // finally to add a public organisme
 else if(req.body.statut === 'Organisme publique') {
 const PublicOrga = await user.createOrganisme({
     nom_organisme: req.body.nom_organisme,
     ice: req.body.ice,
 })
 }
 
 // to add the role for the user
 const rol = await Role.create({
     name: 'demandeur'   
     })
     await user.addRole(rol)
 
 
 // to add the uploads of the user 
 console.log(req.body);
 console.log(req.files);
 
 try {
     for (var i = 0; i < req.files.length; i++) {
     let file = req.files[i];
     const {path} =file
         const auth = 
         authenticateGoogle();
         
           console.log("uploading ...  " + file.originalname);
           const response = await uploadToGoogleDrive(file, auth);
           const attachement = await Upload.create({ name: file.originalname, fichier: response.webViewLink, idFichier: response.id, typeFichier:'Registring Files' });
           await user.addUpload(attachement);
           console.log("done uploading");
           fs.unlinkSync(path);
         }
       } catch (err) {
         console.log(err);
       }
 /* end uploid fct  */
 
         /////////////////// FOR GENERATING AN EMAIL ///////////////////////
         
         let config = {
             service: 'gmail',
             auth: {
                 user: process.env.EMAIL,
                 pass: process.env.PASSWORD
             }
         }
         let transporter = nodemailer.createTransport(config)
         let message = {
             from: process.env.EMAIL,
             to: req.body.email,
             subject: "- Veuillez confirmer votre adresse e-mail -",
             html: `
             <div style="padding: 20px" >
             <h2>Bonjour ,</h2>
             <h4 style="margin-top:20px; padding-left: 13px">Merci de vérifier votre adresse e-mail</h4>
             <p style="padding-left: 13px">Afin de poursuivre la configuration de votre compte, merci de confirmer que cette adresse e-mail est bien la vôtre.</p>
             <div style="display:flex; justify-content:center">
                 <button style= "background-color:blue; border:none;height: 35px; width: 190px; margin-top:20px">
                         <a style="color:white; font-weight:bold; text-decoration: none" href="http://localhost:3000/verifyEmail/${user.tokenEmail}">Confirmer</a>
                 </button>
             </div>     
         </div>
         `
         }
         transporter.sendMail(message)
 
     res.json('user added success')
    }catch(err) {
         console.log(err)
     }
 
 }
 
 
 
 
 
 //   --------------- function to login a user ---------------------
 module.exports.signUpUser = async (req, res) => {
     try {
     const user = await Utilisateur.findOne({
         where: {
             email: req.body.email
         }, include: Role
     })
     if (!user) {
         return res.status(401).send({ message: 'invalid user' })
     }
     if (! await bcrypt.compare(req.body.password, user.password)) {
         return res.status(401).send({ message: 'password invalid' })
     }
     if (!user.emailVerified) {
         return res.status(401).send({ message: 'email not verified' })
     }
 
     const accessToken = jwt.sign({ userID: user.id }, process.env.ACESS_SECRET, { expiresIn: '15m' })
     const random = randomstring.generate(20)
     const refreshToken = jwt.sign({ userID: user.id, refreshTokenID: random }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
 
     await Utilisateur.update({ refreshTokenID: random }, {
         where: {
             id: user.id
         }
     });
 
 
     // to calculate the expiration date
     const now = new Date()
     const accessExpiredAt = new Date(now.getTime() + 15*60 * 1000) // 30s from now
     const refreshExpiredAt = new Date(now.getTime() + 7*24*60*60* 1000) // 7 days from now
 
     const responseObj = {
         access_token: {
             token: accessToken,
             expire_at: accessExpiredAt.toISOString()
         },
         refresh_token: {
             token: refreshToken,
             expire_at: refreshExpiredAt.toISOString()
         },
         user
     }
     return res.json(responseObj);
     }catch(err) {
         console.log(err)
     }
 
 }
 
 
 
 //   --------------- function to generate refresh token ---------------------
 module.exports.refreshToken = async (req,res)=>{
     try {
     const authHeader = req.headers.authorization;
     const token = authHeader.split(' ')[1];
     const claims = jwt.verify(token, process.env.REFRESH_SECRET)
     if(! claims) {
         return res.status(404).send({message: 'unauthenticated'})
     }
     const user = await Utilisateur.findOne({where : {id : claims.userID}})
     if(!user){
         return res.status(404).send({ message: 'user not found !!' })
     }
     if( claims.refreshTokenID !== user.refreshTokenID){
         return res.status(404).send({ message: 'Invalid Token !!' })
     }
 
     const accessToken = jwt.sign({ userID: user.id }, process.env.ACESS_SECRET, { expiresIn: '15m' })
     const random = randomstring.generate(20)
     const refreshToken = jwt.sign({ userID: user.id, refreshTokenID: random }, process.env.REFRESH_SECRET, { expiresIn: '7d' })
     await Utilisateur.update({ refreshTokenID: random }, {
         where: {
             id: user.id
         }
     });
         // to calculate the expiration date
         const now = new Date()
         const accessExpiredAt = new Date(now.getTime() + 15*60* 1000) // 30s from now
         const refreshExpiredAt = new Date(now.getTime() + 7*24*60*60* 1000) // 7 days from now
 
         const responseObj = {
             access_token: {
                 token: accessToken ,
                 expire_at: accessExpiredAt.toISOString()
             },
             refresh_token: {
                 token: refreshToken,
                 expire_at: refreshExpiredAt.toISOString()
             }
         }
         return res.json(responseObj);
     }catch(err) {
         console.log(err)
     }
 
 
 }
 
 //   --------------------- function to get the user authorised ---------------------
 module.exports.getUserAuth = async (req,res)=>{
     try {
     const authHeader = req.headers.authorization;
     const token = authHeader.split(' ')[1];
     const claims = jwt.verify(token, process.env.ACESS_SECRET)
     if(!claims){
         return res.status(401).send({message : 'user not authorised'})
     }
     const globalUser = await Utilisateur.findOne({where : { id: claims.userID }})
 
     if(globalUser.statut === "Personne physique") {
         const user = await Utilisateur.findOne({where : { id: claims.userID }, include: [Upload,Personnephy,Role]})
         return res.json(user)
     }
 
     else if (globalUser.statut === "Représentant entreprise ou organisme") {
         const user = await Utilisateur.findOne({where : { id: claims.userID }, include: [Upload,Entreprise,Role]})
         return res.json(user)
     }
     else if (globalUser.statut === "Organisme publique") {
         const user = await Utilisateur.findOne({where : { id: claims.userID }, include: [Upload,Organisme,Role]})
         return res.json(user)
     }
     else {
         const user = await Utilisateur.findOne({where : { id: claims.userID }, include: Role})
         return res.json(user)
     }
     }catch(err) {
         console.log(err)
     }
 
 }
 
 // ---------------------To verify if the tokenEmail has a user before redirect him to the page for confirmation---------------------
 module.exports.getUserByTokenEmail = async (req, res) => {
     try{
     const user = await Utilisateur.findOne({ where: { tokenEmail: req.params.token } })
     if (!user) {
         return res.status(401).send({ message: 'no user found' })
     }
     await Utilisateur.update({ emailVerified: true }, {
         where: { tokenEmail: req.params.token }
     })
     res.redirect('http://127.0.0.1:5173/verification')
     }catch(err) {
         console.log(err)
     }
 
 }
 
 
 // ---------------------search for the user with his email---------------------
 module.exports.getUserByEmail = async (req, res) => {
     try {
     const code = Math.floor(Math.random() * 900000) + 100000;
     const old_user = await Utilisateur.findOne({ where: { email: req.body.email } })
     if (!old_user) {
         return res.status(401).send({ message: 'no user corresponding to this email' })
     }
 
     const new_user = await Utilisateur.update({ codeVerif: code }, {
         where: {
             id: old_user.id
         }
     });
 
     /////////////////// FOR GENERATING AN EMAIL ///////////////////////
     let config = {
         service: 'gmail',
         auth: {
             user: process.env.EMAIL,
             pass: process.env.PASSWORD
         }
     }
     let transporter = nodemailer.createTransport(config)
     let message = {
         from: process.env.EMAIL,
         to: req.body.email,
         subject: "-Code de vérification-",
         html: `
             <div style="padding-left:12px">
                 <h2>Hello,</h2>
                 <p style="padding-top:17px">Copiez le code de vérification ci-dessous pour confirmer votre adresse mail.</p>
                 <div style="display:flex; justify-content:center">
                     <div style="padding-top:20px">
                         <p style="font-weight:600">Code de vérification:</p>
                         <p style=" letter-spacing:8px; font-weight:bold; text-align: center; font-size:24px">${code}</p>       
                     </div>
 
                 </div>
                 <div  style="padding-top:32px">
                     <p style="padding-top:6px">Vous n'êtes pas à l'origine de cette demande ? Aucun problème !</p>
                     <p style="padding-top:6px">Votre adresse a probablement été saisie par erreur, vous pouvez ignorer cet email ou le supprimer.</p>
                     <p style="text-align: center; padding-top:6px">À très vite !</p>
                 </div>  
             </div>
               `
     }
     transporter.sendMail(message)
     return res.json(old_user)
     }catch(err) {
         console.log(err)
     }
 
 }
 
 
 
 // ---------------------to check the verification code---------------------
 module.exports.checkCode = async (req, res) => {
     try {
     const code = `${req.body.code1}${req.body.code2}${req.body.code3}${req.body.code4}${req.body.code5}${req.body.code6}`
     const user = await Utilisateur.findOne({
         where: {
             codeVerif: code
         }
     })
     if (!user) {
        return res.status(401).send({ message: 'no user found' })
     }
     await Utilisateur.update({ codeVerif: null }, {
         where: {
             id: user.id
         }
     })
      res.send(user)
     }catch(err) {
         console.log(err)
     }
 
 
 }
 
 // ---------------------to reset the password---------------------
 module.exports.resetPswd = async (req, res) => {
     try {
     const salt = await bcrypt.genSalt(10)
     const hashedPassword =await bcrypt.hash(req.body.password, salt)
     await Utilisateur.update({ password: hashedPassword }, {
         where: {
             id: req.params.id
         }
     });
     res.json('password modified successfully')
     } catch(err) {
         console.log(err)
     }
 
 }
 
 // ----->  function to add demand to have the main levée in the dataBase
module.exports.addDemandMainLavee = async(req,res)=> {
    try{
        const user = await Utilisateur.findOne({where : { id: req.body.id}})
        const demande = await Demande.findOne({where: { id : req.body.demandeID}})
        for (var i = 0; i < req.files.length; i++) {
            let file = req.files[i];
            const {path} =file
                const auth = authenticateGoogle();
                  console.log("uploading ...  " + file.originalname);
                  const response = await uploadToGoogleDrive(file, auth);
                  const attachement = await Upload.create({ name: file.originalname, fichier: response.webViewLink, idFichier: response.id, typeFichier: 'main levée' });
                  await user.addUpload(attachement)
                  await demande.addUpload(attachement)
                  console.log("done uploading");
                  fs.unlinkSync(path);
                }
                
        // Send Email to service technique
                         /////////////////// FOR GENERATING AN EMAIL ///////////////////////
         
  /*        let config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        }
        let transporter = nodemailer.createTransport(config)
        let message = {
            from: process.env.EMAIL,
            to: 'president-agadir@gmail.com',
            subject: "- Nouveau demande de main levée est ajouté -",
            html: `
            <div style="padding: 20px" >
            <h4>Bonjour,</h4>
            <p style="margin-top:15px; padding-left: 12px">La demande du document Main levée pour la demande N° <span style="color:blue; font-weight:bold">${demande.ref_numero}</span> de l'utilisateur ayant l'adresse e-mail suivante <span style="color:blue; font-weight:bold">${user.email}</span> a été ajouté. N'hésitez pas à le vérifier.</p>
            <p style="margin-top:20px; padding-left: 12px">>Cordialement </p>
            </div>
        `
        }
        transporter.sendMail(message) */


              const answer = {
                message: ' Votre demande a été envoyé avec succès.',
                state: true
            }
            res.json(answer)
    }
    catch(err){
        console.log(err)
    }
}




// ----->  function to add dossier recolement in the dataBase
module.exports.addDossierRecolement = async(req,res)=> {
    try{
        const user = await Utilisateur.findOne({where : { id: req.body.id}})
        const demande = await Demande.findOne({where: { id : req.body.demandeID}})
        for (var i = 0; i < req.files.length; i++) {
            let file = req.files[i];
            const {path} =file
                const auth = authenticateGoogle();
                  console.log("uploading ...  " + file.originalname);
                  const response = await uploadToGoogleDrive(file, auth);
                  const attachement = await Upload.create({ name: file.originalname, fichier: response.webViewLink, idFichier: response.id, typeFichier: 'dossier recolement' });
                  await user.addUpload(attachement)
                  await demande.addUpload(attachement)
                  console.log("done uploading");
                  fs.unlinkSync(path);
                }
                
        // Send Email to service technique
                         /////////////////// FOR GENERATING AN EMAIL ///////////////////////
         
         let config = {
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        }
        let transporter = nodemailer.createTransport(config)
        let message = {
            from: process.env.EMAIL,
            to: 'xifek24282@carpetra.com',
            subject: "- Nouveau dossier de recollement ajouté -",
            html: `
            <div style="padding: 20px" >
            <h4>Bonjour,</h4>
            <p style="margin-top:15px; padding-left: 12px">Le dossier de recollement pour la demande N° <span style="color:blue; font-weight:bold">${demande.ref_numero}</span> de l'utilisateur ayant l'adresse e-mail suivante <span style="color:blue; font-weight:bold">${user.email}</span> a été ajouté. N'hésitez pas à le vérifier.</p>
            <p style="margin-top:20px; padding-left: 12px">>Cordialement </p>
            </div>
        `
        }
        transporter.sendMail(message)


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



// ------------------ function to save the message of the user in the DB ----------------
module.exports.addMessage = async(req,res)=> {
    try {
    const user = await Utilisateur.findOne({where : { email: req.body.email}})

    const msg = await Message.create({
        sujet: req.body.sujet,
        courrier: req.body.courrier
    })
    await user.addMessage(msg)

        for (var i = 0; i < req.files.length; i++) {
        let file = req.files[i];
        const {path} =file
            const auth = authenticateGoogle();
              console.log("uploading ...  " + file.originalname);
              const response = await uploadToGoogleDrive(file, auth);
              const attachement = await Upload.create({ name: file.originalname, fichier: response.webViewLink, idFichier: response.id, typeFichier: 'contact files' });
              await msg.addUpload(attachement);
              await user.addUpload(attachement)
              console.log("done uploading");
              fs.unlinkSync(path);
            }
          const answer = {
            message: ' Votre message a été envoyé avec succès.',
            state: true
        }
        return res.json(answer)

          } catch (err) {
            console.log(err);
          }
        

}





//************************************************* END ************************************************************** */











//********************************************************************************************************************** */
    //longitude et latitude
                                            // SERVICE X 

// ---> Function that will grap the demandes that still don't have coordination 
module.exports.getNonCoordinatedDemande = async (req,res)=> {
    try {
        const demande = await Demande.findAll({where : {
            longitude : null,
            latitude: null
        }})
        res.json(demande)
    }
    catch(err) {
        console.log(err)
    }
}
/******************* send array of emails ********************************* */
module.exports.informAll=(req,res)=>{
    try {
        console.log(req.body.receivers,"boduuuuuuuuuuu")
    for (let r of  req.body.receivers){
        console.log("sending Mail to " +r)
       sendMail(r,req.body.sujet,req.body.text);
       console.log("mail sent ");

    }
    res.json({message :"sent to receiver "})
}
catch(err) {
    console.log(err)
}
   


}

// Function that will add longitude and latitute to a demande
module.exports.addCoordination = async (req,res)=> {
    try {
        await Demande.update({ 
            longitude: req.body.longitude,
            latitude: req.body.latitude
        }, {
            where: {
              id: req.params.id
            }
          });

          const answer = {
            message: ' Vos coordonnées on été ajoutés avec succès.',
            state: true
        }
        res.json(answer)
    }
    catch(err) {
        console.log(err)
    }
}



//---> Function to get the number of the demandes that need coordination 
module.exports.countNoneCoordination = async(req,res)=> {
try {

    const numberDemande = await Demande.count({where :
         { longitude : null,
            latitude: null
        }})
        res.json(numberDemande)

} catch(err) {
    console.log(err)
}

}





//************************************************************************************************************************ */























// ----------------- function to update the state of demande to "refuser" --------------------
module.exports.refuseDemande = async(req,res)=> {
    try {
    const demandId = req.params.id
    await Demande.update({ etat: 'refuser' }, {
        where: {
          id: demandId
        }
      });
    const answer = {
        message: ' Votre demande a été refuser.',
        state: true
    }
    return res.json(answer)
    }catch(err) {
        console.log(err)
    }

}






// ----------------- function to update & save demande  --------------------
/*module.exports.updateSingleDemande = async (req, res) => {
  const idDemande = req.params.id;
  const user = await Utilisateur.findOne({ where: { email: 'xivir41447@saeoil.com' } });
  const demande = await Demande.findOne({ where: { id: idDemande } });*/

  /*await Demande.update(
    {
      objet: req.body.objet,
      ref_section: req.body.ref_section,
      ref_numero: req.body.ref_numero,
      date_debut: req.body.date_debut,
      duree: req.body.duree,
      modalite: req.body.modalite,
      descriptif: req.body.descriptif,
      localisation: req.body.localisation,
      etat: "envoyer",
    },
    {
      where: { id: idDemande },
    }
  );*/

  /*const uploads = await demande.getUploads(); // get existing uploads associated with the demande
  console.log(req.files)
  const uploadedFileNames = req.files.map((file) => file.originalname);

  try {
    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      const existingUpload = uploads.find((upload) => upload.name === file.originalname);

      if (existingUpload) {
        // if an existing upload is found, update its properties
        const auth = authenticateGoogle();
        console.log(`Updating existing upload: ${existingUpload.name}`);
        const response = await updateGoogleDriveFile(existingUpload.idFichier, file, auth);
        await existingUpload.update({ fichier: response.webViewLink }); // update the file URL
      } else {
        // if no existing upload is found, create a new upload record
        const auth = authenticateGoogle();
        console.log(`Creating new upload: ${file.originalname}`);
        const response = await uploadToGoogleDrive(file, auth);
        const attachment = await Upload.create({
          name: file.originalname,
          fichier: response.webViewLink,
          idFichier: response.id,
        });
        await demande.addUpload(attachment);
        await user.addUpload(attachment);
      }
    }

    // delete any uploads associated with the demande that are not present in the current upload list
    const uploadsToDelete = uploads.filter((upload) => !uploadedFileNames.includes(upload.name));
    for (let i = 0; i < uploadsToDelete.length; i++) {
      const upload = uploadsToDelete[i];
      console.log(`Deleting upload: ${upload.name}`);
      await upload.destroy();
    }

    const answer = {
      message: "Vos modifications ont été enregistrées avec succès.",
      state: true,
    };
    return res.json(answer);
  } catch(err) {
            console.log(err);
          }
}*/

// ----------------- function to update & archive demande  --------------------
module.exports.updateArchiveDemande = async (req, res) => {
    try {
    const idDemande = req.params.id;
    const user = await Utilisateur.findOne({ where: { email: req.body.email } });
    const demande = await Demande.findOne({ where: { id: idDemande } });
  
    await Demande.update(
      {
        objet: req.body.objet,
        ref_section: req.body.ref_section,
        ref_numero: req.body.ref_numero,
        date_debut: req.body.date_debut,
        duree: req.body.duree,
        modalite: req.body.modalite,
        descriptif: req.body.descriptif,
        localisation: req.body.localisation,
        etat: "envoyer",
      },
      {
        where: { id: idDemande },
      }
    );
  
    const uploads = await demande.getUploads(); // get existing uploads associated with the demande
    const uploadedFileNames = req.files.map((file) => file.originalname);
  

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const existingUpload = uploads.find((upload) => upload.name === file.originalname);
  
        if (existingUpload) {
          // if an existing upload is found, update its properties
          const auth = authenticateGoogle();
          console.log(`Updating existing upload: ${existingUpload.name}`);
          const response = await updateGoogleDriveFile(existingUpload.idFichier, file, auth);
          await existingUpload.update({ fichier: response.webViewLink }); // update the file URL
        } else {
          // if no existing upload is found, create a new upload record
          const auth = authenticateGoogle();
          console.log(`Creating new upload: ${file.originalname}`);
          const response = await uploadToGoogleDrive(file, auth);
          const attachment = await Upload.create({
            name: file.originalname,
            fichier: response.webViewLink,
            idFichier: response.id,
          });
          await demande.addUpload(attachment);
          await user.addUpload(attachment);
        }
      }
  
      // delete any uploads associated with the demande that are not present in the current upload list
      const uploadsToDelete = uploads.filter((upload) => !uploadedFileNames.includes(upload.name));
      for (let i = 0; i < uploadsToDelete.length; i++) {
        const upload = uploadsToDelete[i];
        console.log(`Deleting upload: ${upload.name}`);
        await upload.destroy();
      }
  
      const answer = {
        message: "Vos modifications ont été enregistrées avec succès.",
        state: true,
      };
      return res.json(answer);
    } catch(err) {
              console.log(err);
            }
  }








// -------------------- function to add the president ........
module.exports.addPresident = async(req,res)=> {
    try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(req.body.password, salt)
    const tokenEmail = uuid.v4()
    /* let role=req.body.role; */

    const user = await Utilisateur.create({
        email: req.body.email,
        password: hashedPassword,
        tokenEmail: tokenEmail,
        emailVerified: true,
        tel: req.body.tel,
        statut: req.body.statut,
        fixe: req.body.fixe,
        adresse: req.body.adresse,
        selfCreated: req.body.selfCreated
})

// to add the role for the user
const rol = await Role.create({
    name: 'représentant'   
   
    })
    await user.addRole(rol)
    res.json(hashedPassword)
    }
    catch(err) {
        console.log(err)
    }

}






//////////////////////////////////////////////////////////////////////////////















