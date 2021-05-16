const express = require("express");
const connection = require("./database/connection");
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
app.get("/", (req, res) => {
    res.render("lineup");
});


app.listen("3000", (err) => {
    if(err) console.log("An error has occurred!");
    else {
        console.log("Server is running...");

        setInterval(() => {
            let today = new Date();
            if(today.getDay() == 0){
                console.log("Hoje será atualizado o Banco de dados");
            }
        }, 5000);
    };
});