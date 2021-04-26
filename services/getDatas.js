const puppeteer = require("puppeteer");
const fs = require("fs");

(async () => {
    const browser = await puppeteer.launch({headless: false});
    const page = await browser.newPage();
    await page.goto('https://www.ogol.com.br/equipa.php?id=2239');
    
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
                    return {
                        number: player.childNodes[0].innerHTML,
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
    
    console.log(teamStaff);

    fs.writeFile("./database/teamTest.json", JSON.stringify(teamStaff, null, 2), (err) => {
        if(err) throw new Error("An Error has ocurred");
    });

    await browser.close();
})();