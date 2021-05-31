const puppeteer = require("puppeteer");
const fs = require("fs");
const teamInfo = require("./teamInfo");
const Team = require("../database/Team");
const Player = require("../database/Player");
const connection = require("../database/connection");

//Consts
const GOALKEEPERS = 0;
const DEFENDERS = 1;
const MIDFIELDS = 2;
const ATTACKS = 3;

// Functions
const getStaffs = async (id) => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(`https://www.ogol.com.br/equipa.php?id=${id}`);

    const teamStaff = await page.evaluate( () => {
        let datasNodeList = document.querySelectorAll(".innerbox");
        let datasArray = [...datasNodeList].slice(0,4);
        
        let teamStaff = {
            goalkeepers: [],
            defenders: [],
            midfields: [],
            attacks: []
        }
        
        datasArray.map((item, index) => {
            let playerElement = [...item.childNodes].slice(1);
            let players = []
            playerElement = playerElement.map((element) => {
                element.childNodes.forEach((child) => players.push(child))
            });
            
            // datas of players
            let playersData = players.map((player) => {
                if(!player.classList.contains("inactive")){
                    let number = (player.childNodes[0].innerHTML != "-") ? parseInt(player.childNodes[0].innerHTML) : 0;
                    return {
                        number: number,
                        name: player.childNodes[2].childNodes[0].childNodes[1].childNodes[0].innerHTML
                    }
                }
            });
            
            switch(index){
                case 0:
                    teamStaff.goalkeepers = playersData;
                    break;
                case 1:
                    teamStaff.defenders = playersData;
                    break;
                case 2:
                    teamStaff.midfields = playersData;
                    break;
                case 3:
                    teamStaff.attacks = playersData;
                    break;
                default:
                    break;
            }
        });

        return teamStaff;
    });

    await browser.close();

    return teamStaff;
}

function saveInDatabase(team){
    //Register Team
    Team.findOne({ where: {id : team.id}}).then( async (teamInDB) => {
        if(teamInDB == null){
            let newTeam = {
                id: team.id,
                name: team.name,
                shortname: team.shortName,
                colors: team.colors
            }

            console.log(newTeam)
            await Team.create(newTeam)
                .then(() => {console.log(`${team.name} Register!`);});
        }
    });

    //Register Players
    updatePlayers(team.staff.goalkeepers, GOALKEEPERS, team);
    updatePlayers(team.staff.defenders, DEFENDERS, team);
    updatePlayers(team.staff.midfields, MIDFIELDS, team);
    updatePlayers(team.staff.attacks, ATTACKS, team);

    console.log("All players register of " + team.name);
}

function updatePlayers(players, position, team){
    //Add recent players
    for (let newPlayer of players) {
        if(newPlayer != null){
            Player.findOne({where:{ name: newPlayer.name, TeamId: team.id }}).then(async (player) =>{
                if(player != null){
                    //Verify if player is the current time
                    await Player.update({number: player.number, position: position}, { where:{id: player.id}}).then();    
                }else{
                    await Player.create({name: newPlayer.name ,number: newPlayer.number, position: position, TeamId: team.id}).then();
                }
            });
        }
    }

    //Remove ex players
    Player.findAll({where:{ TeamId: team.id, position: position }}).then(async (playersInDB) => {
        if(playersInDB != null){
            let newPlayersName = players.map((player) => {
                if(player != null){
                    return player.name;
                }
                
                return "";
            });

            for(let player of playersInDB){
                if(newPlayersName.indexOf(player.name) == -1){
                    await Player.destroy({ where: {id: player.id}}).then();
                }
            }
        }
    });
}

//Functio of service
module.exports = async () => {
    try{
        for (const team of teamInfo) {
            team.staff = await getStaffs(team.id);

            saveInDatabase(team);
        }

        fs.writeFile("./database/teamsData.json", JSON.stringify(teamInfo, null, 2), (err) => {
            if(err) throw new Error("An Error has ocurred in write file!");
        });
    }catch(err){
        console.log("An error has ocurred in get datas!");
        console.log(err.message);
    }
}
    


