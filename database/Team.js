const { Model } = require("sequelize");
const Sequelize = require("sequelize");
const connection = require("./connection");

const Team = connection.define("Team", {
    name:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    shortname:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    colors:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Team.sync({force: false}).then();

module.exports = Team;