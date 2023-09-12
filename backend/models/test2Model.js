const Sequelize = require('sequelize');
const sequelize = require('../sequelize');


const Movie = sequelize.define('movie', {
    id_movie : {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name_movie: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
},{
    timestamps: false,
    freezeTableName: true
  });

  const Actor = sequelize.define('actor', {
    id_actor : {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      name_actor: {
        type: Sequelize.STRING,
        allowNull: false,
        isAlpha: true
      },
},{
    timestamps: false,
    freezeTableName: true
  });


  Movie.belongsToMany(Actor, { through: 'ActorMovies', timestamps: false,
  freezeTableName: true});
  Actor.belongsToMany(Movie, { through: 'ActorMovies', timestamps: false,
  freezeTableName: true});
  //sequelize.sync({ alter: true});

  module.exports = {
    Movie,
    Actor,
  };






