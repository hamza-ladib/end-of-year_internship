const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Utilisateur = sequelize.define('user', {
    id: {
      type: Sequelize.BIGINT,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      isEmail: true,
      unique: true
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false
    },
    tokenEmail: {
      type : Sequelize.STRING,
    },
    emailVerified: {
      type: Sequelize.BOOLEAN,
    },
    codeVerif: {
      type: Sequelize.STRING
    },
    refreshTokenID: {
      type: Sequelize.STRING
    },
    tel: {
      type: Sequelize.STRING
    },
    fixe: {
        type: Sequelize.STRING
      },
    adresse: {
        type: Sequelize.STRING
      },
    statut: {
      type: Sequelize.STRING,
      allowNull: false
    },
    selfCreated: {
      type: Sequelize.BOOLEAN,
      allowNull: false
    }
  
  }, {
    timestamps: true,
    freezeTableName: true
  });


// Define the person physique model, which inherits from User
const Personnephy = sequelize.define('personnephy', {
    raison_social: {
        type : Sequelize.STRING,
        allowNull: false
    },
    ice: {
        type : Sequelize.STRING,
        allowNull: false
    },
    patente: {
        type : Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: true,
    freezeTableName: true
  })


  // Define the representant of the company  model, which inherits from User
const Entreprise = sequelize.define('entreprise', {
    nom: {
        type : Sequelize.STRING,
        allowNull: false
    },
    prenom: {
        type : Sequelize.STRING,
        allowNull: false
    },
    cin: {
        type : Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: true,
    freezeTableName: true
  })



  // Define the public organisme model, which inherits from User
  const Organisme = sequelize.define('organisme', {
    nom_organisme: {
        type : Sequelize.STRING,
        allowNull: false
    },
    ice: {
        type : Sequelize.STRING,
        allowNull: false
    }
},{
    timestamps: true,
    freezeTableName: true
  })

  //Define the Role that can the user have 
  const Role = sequelize.define('role', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
  },{
    timestamps: true,
    freezeTableName: true
  });

  //Define the Permission that can the user have
  const Permission = sequelize.define('permission', {
    id: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: Sequelize.STRING,
        allowNull: false,
    }
  },{
    timestamps: true,
    freezeTableName: true
  })

    //Define the Uploads that the user can have
    const Upload = sequelize.define('upload', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        fichier: {
            type: Sequelize.STRING,
        },
        idFichier: {
          type: Sequelize.STRING
        },
        typeFichier: {
          type: Sequelize.STRING
        },
        isSigned: {
          type: Sequelize.STRING
        }
      },{
        timestamps: true,
        freezeTableName: true
      })


      //Define the message that the user can send to the "service technique de la commune"
      const Message = sequelize.define('message', {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        sujet: {
          type: Sequelize.STRING,
        },
        courrier: {
          type: Sequelize.TEXT
        }
      },{
        timestamps: true,
        freezeTableName: true
      })

      //Define the demande that a user can create 
      const Demande = sequelize.define('demande', {
        id: {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        objet: {
          type: Sequelize.STRING,
        },
        ref_section: {
          type: Sequelize.STRING,
        },
        ref_numero: {
          type: Sequelize.STRING,
        },
        date_debut: {
          type: Sequelize.DATE,
          defaultValue: null
        },
        duree: {
          type: Sequelize.STRING,
        },
        modalite: {
          type: Sequelize.STRING,
        },
        descriptif: {
          type: Sequelize.TEXT,
        },
        localisation: {
          type: Sequelize.TEXT,
        },
        etat: {
          type: Sequelize.STRING,
        },
        longitude: {
          type: Sequelize.STRING,
        },
        latitude: {
          type: Sequelize.STRING,
        }
      },{
        timestamps: true,
        freezeTableName: true
      })



// Define the feedBack of the representant in a demand 
const Commentaire = sequelize.define('commentaire',{
        id : {
          type: Sequelize.BIGINT,
          allowNull: false,
          primaryKey: true,
          autoIncrement: true
        },
        sujet : {
          type: Sequelize.STRING,
        },
        message : {
          type: Sequelize.TEXT
        }
},{
        timestamps: true,
        freezeTableName: true
      })



// Defining the associations 

      Utilisateur.hasOne(Personnephy,{timestamps:true})
      Personnephy.belongsTo(Utilisateur,{timestamps:true});
      Utilisateur.hasOne(Entreprise,{timestamps:true})
      Entreprise.belongsTo(Utilisateur,{timestamps:true});
      Utilisateur.hasOne(Organisme,{timestamps:true})
      Organisme.belongsTo(Utilisateur,{timestamps:true});
      Utilisateur.belongsToMany(Role, { through: 'UtilisateurRoles', timestamps: true,
      freezeTableName: true });
      Role.belongsToMany(Utilisateur, { through: 'UtilisateurRoles', timestamps: true,
      freezeTableName: true });
      Utilisateur.belongsToMany(Permission, { through: 'UtilisateurPermissions', timestamps: true,
      freezeTableName: true });
      Permission.belongsToMany(Utilisateur, { through: 'UtilisateurPermissions', timestamps: true,
      freezeTableName: true });
      Utilisateur.hasMany(Upload,{timestamps:true});
      Upload.belongsTo(Utilisateur,{timestamps:true});

      // to define the One-To-Many association between the user and the message
      Utilisateur.hasMany(Message);
      Message.belongsTo(Utilisateur);
      // to define the One-To-Many association between the message and the Upload
      Message.hasMany(Upload);
      Upload.belongsTo(Message);

      // to define the One-To-Many association between the user and the demand
      Utilisateur.hasMany(Demande);
      Demande.belongsTo(Utilisateur);

      // to define the One-To-Many association between the demand and the Upload
      Demande.hasMany(Upload);
      Upload.belongsTo(Demande);

      // to define the One-To-Many association between the user and the Commentaire
      Utilisateur.hasMany(Commentaire)
      Commentaire.belongsTo(Utilisateur);

      // to define the One-To-Many association between the demand and the Commentaire
      Demande.hasMany(Commentaire)
      Commentaire.belongsTo(Demande);
      

/*  sequelize.sync({sync: true}) */
/* Upload.sync({force: true})
Demande.sync({force:true})
Utilisateur.sync({force:true})
Commentaire.sync({force:true})  
 */
/* Utilisateur.sync({force:true})
Personnephy.sync({force:true})
Entreprise.sync({force:true})
Organisme.sync({force:true})
Role.sync({force:true})
Permission.sync({force:true})
Upload.sync({force:true})
Message.sync({force:true})
Demande.sync({force:true})
Commentaire.sync({force:true}) */


module.exports = {
  Utilisateur,
  Personnephy, 
  Entreprise,
  Organisme,
  Role,
  Upload,
  Message,
  Demande,
  Commentaire
};
