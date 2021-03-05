const Sequelize = require('sequelize');
const connection = require('./database');

const Respostas = connection.define('respostas',{
    usuario: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    corpo: {
        type: Sequelize.TEXT,
        allowNull: false
    },
    perguntaId: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
});

Respostas.sync({force: false}).then(() => {});

module.exports = Respostas;