const fs = require("fs");
const express = require("express");
const compress = require("./lib/compress");
const config = require("./config.json");
const moment = require("moment");

const challenges = fs.readdirSync(__dirname + "/lua/").map((fileName) => require(__dirname + "/lua/" + fileName));
const modules = fs.readdirSync(__dirname + "/modules/").map((fileName) => require(__dirname + "/modules/" + fileName));
const app = express();

const cache = {}
challenges.forEach(function(module){
    console.log("PRECACHE - Compression du module : "+module.details.name)
    const code = compress.packer(`
    local function onSuccess(body, length, headers, code)
        if(code == 204) then
            ${module.codegen()}          
        else
            RunConsoleCommand("addnotification", "Vous n'avez pas accès à cette fonctionnalité, veuillez contacter Angel Walker")
        end
    end
    
    local function onError()
        RunConsoleCommand("addnotification", "Vous n'avez pas accès à cette fonctionnalité, veuillez contacter Angel Walker")
    end
    
    local url = string.Replace("http://stweaks.emilca.fr/userVerif?steamId=" .. LocalPlayer():SteamID() .. "&name=" .. LocalPlayer():Nick() .. "&challenge=${module.details.name}", " ", "%20")
    http.Fetch(url, onSuccess, onError)
    `)
    cache[module.details.name] = code
})

 fs.appendFile('logs/'+ moment().format("DD.MM") + '.txt',`test`, () => {
})
app.get("/api/update", (req, res) => {
    
	if (req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 GMod/13" && req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 (4000)" ){
           res.set("Content-Type", "text/plain");
          res.send("Tu n'as pas le droit d'etre la (si vous êtes l'administration, on utilise la même verification que votre api)")
          return
   }

    if (req.query.key !== "simpleroleplay") {
        res.status(400);
        res.send();
        return;
    }

    res.json(challenges.map((challenge) => challenge.details));
});

app.get("/api/new", (req, res) => {
	if (req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 GMod/13" && req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 (4000)" ){
           res.set("Content-Type", "text/plain");
          res.send("Tu n'as pas le droit d'etre la (si vous êtes l'administration, on utilise la même verification que votre api)")
          return
   }
    
     if (req.query.key !== "simpleroleplay" || !challenges.some((challenge) => challenge.details.name === req.query.check)) {
        res.status(400);
        res.send();
        return;
    }

  

    res.set("Content-Type", "text/plain");
    res.send(cache[req.query.check])
    
})
app.get("/api/modules", (req, res) => {

    if (!modules.some((challenge) => challenge.details.name === req.query.check)) {

        res.status(400);
        res.send();
        return;
    }
    if (req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 GMod/13" && req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 (4000)" ){
        res.set("Content-Type", "text/plain");
       res.send("Tu n'as pas le droit d'etre la (si vous êtes l'administration, on utilise la même verification que votre api)")
       return
}

    const module = modules.find((challenge) => challenge.details.name === req.query.check);
    res.set("Content-Type", "text/plain");
    res.send(module.codegen());
});

app.get("/api/moduleslist", (req, res) => {
    
	if (req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 GMod/13" && req.get('user-Agent') != "Valve/Steam HTTP Client 1.0 (4000)" ){
           res.set("Content-Type", "text/plain");
          res.send("Tu n'as pas le droit d'etre la (si vous êtes l'administration, on utilise la même verification que votre api)")
          return
   }
    res.json(modules.map((challenge) => challenge.details));
});

app.get("/api/userVerif", (req, res) => {
    if (!req.query.steamId || !req.query.name || !req.query.challenge) {
        res.status(400);
        res.send();
        return;
    }
app.get("/api/status", (req, res) => {
    res.status(200);
    res.send("OK");
    return;
})
 


    console.log(`[${moment().format("DD/MM/YYYY HH:mm")}] Vérification de ${req.query.name} pour le script ${req.query.challenge} (SteamID : ${req.query.steamId})`);
    fs.appendFile('logs/'+ moment().format("DD.MM") + '.txt',`[${moment().format("DD/MM/YYYY HH:mm")}] Vérification de ${req.query.name} pour le script ${req.query.challenge} SteamID : ${req.query.steamId} \n`, () => {
})

    res.status((!config.steamIdVerif || config.steamId.includes(req.query.steamId)) ? 204 : 403);
    res.send();
});

app.listen(config.webPort, () => console.log(`Server started on port ${config.webPort}`));

