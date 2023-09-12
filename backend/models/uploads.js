const Sequelize = require('sequelize');
const sequelize = require('../sequelize');


    //Define the Uploads that can the user have
    const Telechargement = sequelize.define('telechargement', {
        id: {
            type: Sequelize.BIGINT,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
        },
        path: {
            type: Sequelize.STRING,
        }
      },{
        timestamps: false,
        freezeTableName: true
      })
//sequelize.sync({sync: true})

      module.exports = {
        Telechargement,
      };
      