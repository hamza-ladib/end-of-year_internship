const Sequelize = require('sequelize');
const sequelize = require('../sequelize');

const Useree = sequelize.define('User', {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: Sequelize.STRING,
    email: Sequelize.STRING,
    password: Sequelize.STRING,
  });
  
  // Define the Employee model, which inherits from User
  const Employee = sequelize.define('Employee', {
    salary: Sequelize.INTEGER,
    ice: Sequelize.STRING,
  });
  
  Employee.prototype = Object.create(Useree.prototype);
  Employee.prototype.constructor = Employee;
  
  // Define the association between User and Employee
  Employee.belongsTo(Useree);

  //sequelize.sync({sync: true})

  module.exports = {
    Employee,
    Useree,
  };