const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const User = sequelize.define('demandeur', {
  id: {
    type: Sequelize.BIGINT,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true
  },
  firstname: {
    type: Sequelize.STRING,
    allowNull: false,
    isAlpha: true
  },
  lastname: {
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
  phoneNumber: {
    type: Sequelize.STRING
  },

}, {
  timestamps: false,
  freezeTableName: true
});

//User.sync({alter : true})


module.exports = User;


