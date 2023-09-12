const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

// Define Animal model
const Animal = sequelize.define('Animal', {
    name: Sequelize.STRING,
    age: Sequelize.INTEGER,
    // add other fields as necessary
  },{
    timestamps: false,
    freezeTableName: true
  });
  
  // Define Dog model
  const Dog = sequelize.define('Dog', {
    breed: Sequelize.STRING,
    // add other fields as necessary
  },{
    timestamps: false,
    freezeTableName: true
  });

  const Cat = sequelize.define('cat', {
    type: Sequelize.STRING,
    // add other fields as necessary
  },{
    timestamps: false,
    freezeTableName: true
  });

  const Bird = sequelize.define('bird', {
    family: Sequelize.STRING,
    // add other fields as necessary
  },{
    timestamps: false,
    freezeTableName: true
  });

  const Role = sequelize.define('role', {
    name: Sequelize.STRING,
    // add other fields as necessary
  },{
    timestamps: false,
    freezeTableName: true
  });

  
  // Set up inheritance relationship
  Animal.hasOne(Dog)
  Dog.belongsTo(Animal);
  Animal.hasOne(Cat)
  Cat.belongsTo(Animal);
  Animal.hasOne(Bird)
  Bird.belongsTo(Animal);
  Animal.belongsToMany(Role, { through: 'AnimalRoles', timestamps: false,
  freezeTableName: true });
  Role.belongsToMany(Animal, { through: 'AnimalRoles', timestamps: false,
  freezeTableName: true });

  //sequelize.sync({sync: true})

  module.exports = {
    Animal,
    Dog,
    Cat,
    Bird,
    Role
  };


