const Sequelize = require("sequelize");
const connection = require("./connection");
const Team = require("./Team");

const Player = connection.define("Player", {
    name:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    number:{
        type: Sequelize.INTEGER,
        allowNull: false
    },
    position:{
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Team.hasMany(Player);
Player.belongsTo(Team);

Player.sync({force: false}).then();

module.exports = Player;