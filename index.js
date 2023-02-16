const
    Discord = require('discord.js'),
    client = new Discord.Client(),
    fetch = require("cross-fetch"),
    UserAgent = require("user-agents"),
    servId = "11553061139";

client.on("ready", () => {
    console.log("BOT ON");

    changeActivity();
    setInterval(changeActivity, 5000);
})
async function changeActivity() {
    const player = await getPlayerCount();
    client.user.setActivity(`${player} joueur en ligne`)
}
function getPlayerCount() {
    return new Promise((resolve, reject) => {
        try {
            fetch(`https://games.roblox.com/v1/games/${servId}/servers/Public`, {
                headers: {
                    'user-agent': new UserAgent().toString(),
                    'accept': 'application/json, text/plain, */*'
                }
            })
                .then((res) => res.json()
                    .then(data => {
                        data = data?.data;
                        let a = 0;
                        data.forEach(e => {
                            if (e?.playing) a = a + e?.playing
                        });
                        resolve(a)
                    })
                    .catch(err => resolve(0)
                    ))
                .catch((err) => resolve(0));
        } catch (error) {
            resolve(0)
        }
    })
}

client.login('TOKEN ICI')
