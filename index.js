const express = require("express");
const connection = require("./database/connection");
const getDatas = require("./services/getDatas");
const Team = require("./database/Team");
const Player = require("./database/Player");

// Configuration
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

connection.authenticate()
    .then(() => {
        console.log("Connection with Database was a success!");
    })
    .catch((err) => {
        console.log(err.message);
    })

// Routes
app.get("/:id", (req, res) => {
    let id = req.params.id;
    Team.findOne({ where: { id: id}, include: [Player]}).then((team) => {
        console.log(team);
        if(team != null){
            res.render("lineup", { team });
        }
    })
});


app.listen("3000", (err) => {
    if(err) console.log("An error has occurred!");
    else {
        setInterval(() => {
            let now = new Date();
            if(now.getHours() == 0){
                console.log("Daily update of teams");
                try{
                    getDatas();
                }catch(err){
                    console.log("Ocurred an error in daily update.");
                    console.log(err.message);
                }   
            }
        }, 3600000);
    };
});