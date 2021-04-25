const express = require("express");

// Configuration
const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
    res.render("lineup");
});


app.listen("3000", (err) => {
    if(err) console.log("An error has occurred!");
    else console.log("Server is running...");
});