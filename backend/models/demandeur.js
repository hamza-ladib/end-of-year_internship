const Sequelize = require('sequelize');
const sequelize = require('../sequelize');


// Define the User model
const Utilisateur = sequelize.define('utilisateur', {
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
    }
  
  }, {
    timestamps: false,
    freezeTableName: true
  });


// Define the person physique model, which inherits from User
const Personne = sequelize.define('personPhysique', {
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
    timestamps: false,
    freezeTableName: true
  })


  // Define the representant of the company  model, which inherits from User
const Entreprisee = sequelize.define('repEntreprise', {
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
    timestamps: false,
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
    timestamps: false,
    freezeTableName: true
  })


Utilisateur.hasOne(Personne);
Personne.belongsTo(Utilisateur);

Utilisateur.hasOne(Entreprisee);
Entreprisee.belongsTo(Utilisateur);

Utilisateur.hasOne(Organisme);
Organisme.belongsTo(Utilisateur);



//sequelize.sync({sync: true})

module.exports = {
  Utilisateur,
  Personne,
  Entreprisee,
  Organisme
};

