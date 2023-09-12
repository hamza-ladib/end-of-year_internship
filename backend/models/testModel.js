const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Employe = sequelize.define('employes', {
    id_employe : {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      first_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      last_name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
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
},{
    timestamps: false,
    freezeTableName: true
  });


  const Entreprise = sequelize.define('entreprises', {
    id_entreprise : {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
      email_entreprise: {
        type: Sequelize.STRING,
        allowNull: false,
        isEmail: true,
        unique: true
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: false
      },
},{
    timestamps: false,
    freezeTableName: true
  });


  Entreprise.hasMany(Employe, {
    foreignKey: 'company_id'
  })
  Employe.belongsTo(Entreprise,  {
    foreignKey: 'company_id'
  })




  module.exports = {
    Employe,
    Entreprise,
  };