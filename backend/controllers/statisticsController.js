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
module.exports.staticsDemandes=async(req,res)=>{
    let demandes=await Demande.findAll({attributes:['id','createdAt','etat','userId']});
    res.send(demandes);

}
module.exports.StaticsUsers=async(req,res)=>{
    let utilisateur=await Utilisateur.findAll({
        attributes:['id','createdAt','email','emailVerified'],
        include: [{
            model: Role,
            attributes:['name'],
        }]
    
    });
    res.send(utilisateur);
}
module.exports.StaticsFiles=async(req,res)=>{
    let upload=await Upload.findAll({attributes:['id','createdAt','userId','isSigned','typeFichier','demandeId','messageId']});
    res.send(upload);
}
module.exports.StaticsComission=async(req,res)=>{
    let commentaire=await Commentaire.findAll({attributes:['id','createdAt','userId','sujet','demandeId']});
    res.send(commentaire);
}

 