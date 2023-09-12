const Sequelize = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port:  process.env.DB_PORT,
  dialect: 'postgres',
  define: {
    dialectOptions: {
      useParameterizedQuerySyntax: true,
      parameterizedQuery: { dollar: true },
    },
  },
});

sequelize.authenticate().then(()=>{
    console.log('connection successful')
}).catch((err)=>{
    console.log('not successful')
})

module.exports = sequelize;


