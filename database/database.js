const Sequelize = require('sequelize');

const connection = new Sequelize('dbperguntas','root','',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;