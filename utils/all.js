const { includes } = require('lodash');
const
    fetch = require('node-fetch'),
    db = require("../database/index.js"),
    fs = require('fs'),
    useragent = require('express-useragent');


async function checkIp(ips) {
    const response = await fetch(`http://ip-api.com/json/${ips}`);
    if (!response.ok) return;
    const
        ip = await response.json(),
        country = ip["country"],
        org = ip["org"],
        allCountry = [
            { country: "France", org: ["bouygues", "orange", "sfr", "free", "wanadoo", "proximus", "laposte", "nrj", "sosh", "coriolis", "cic", "poste", "mutuel", "numericable"] },
            { country: "Belgium", org: ["proximus", "scarlet", "orange", "telenet", "base", "voo", "jim", "edpnet", "brutele"] },
            { country: "Switzerland", org: ["alao", "sunrise", "yallo", "upc", "sasag", "wingo", "swisscom", "salt", "teleboy"] },
            { country: "Luxembourg", org: ["post", "proximus", "eltrona", "orange"] },
            { country: "Hungary", org: ["magyar", "vodafone", "t-mobile"] },
            { country: "Italy", org: ["vodafone", "tim", "wind", "iliad", "tiscali", "orange"] },
            { country: "Spain", org: ["orange", "digi", "vodafone", "yoigo", "jazztel", "avatel"] },
            { country: "Germany", org: ["ewe", "vodafone", "t-mobile", "o2"] },
            { country: "Poland", org: ["vectra", "tpnet", "upc", "dialog", "netia", "multimedia", "aster", "play", "tpsa", "orange", "t-mobile", "plus"] },
            { country: "United States", org: ["comcast", "at&t", "verizon", "charter", "sprint", "cox", "frontier", "google fiber", "windstream", "centurylink", "xfinity", "time warner cable", "optimum"] },
            { country: "United Kingdom", org: ["bt", "sky", "talktalk", "virgin media", "plusnet", "ee", "now broadband", "vodafone", "hyperoptic", "zen internet", "gigaclear"] },
            { country: "Canada", org: ["rogers", "bell", "telus", "shaw", "videotron", "cogeco", "eastlink", "xplornet", "teksavvy", "start.ca"] },
            { country: "Australia", org: ["telstra", "optus", "tpg", "vodafone", "iinet", "dodo", "internode", "amaysim", "exetel", "ausbbs"] },
            { country: "New Zealand", org: ["spark", "vodafone", "trustpower", "2degrees", "orcon", "slingshot", "stuff fibre", "compass communications", "now", "farmside"] },
            { country: "Japan", org: ["ntt", "kddi", "softbank", "ocn", "au", "flets", "jcom", "yahoo! bb", "biglobe", "nuro"] },
            { country: "South Korea", org: ["kt", "sk broadband", "lg uplus", "kt olleh", "cgv broadband", "t-broad", "olleh", "hanaro telecom", "kctv", "hyosung"] },
            { country: "China", org: ["china telecom", "china unicom", "china mobile", "cnc", "cernet", "huawei", "zte", "tencent", "sina", "netease"] },
            { country: "India", org: ["jio", "airtel", "bsnl", "act fibernet", "spectra", "excitel", "hathway", "tata sky broadband", "you broadband", "gigatel"] },
            { country: "Brazil", org: ["oi", "vivo", "net", "tim", "claro", "gvt", "sky", "copel telecom"] },
            { country: "Mexico", org: ["telmex", "totalplay", "izzi", "axtel", "mcm telecom"] },
            { country: "Argentina", org: ["fibertel", "telecentro", "speedy", "cablevision", "movistar", "claro"] },
            { country: "Chile", org: ["movistar", "entel", "vtr", "claro", "gtd", "telsur", "zona wi-fi", "wom", "tuves hd", "telsur"] },
            { country: "Colombia", org: ["claro", "movistar", "tigo", "une", "etb", "direcway", "satelital", "etb", "axion"] },
            { country: "Peru", org: ["telefonica", "claro", "movistar", "optical networks", "grupo datco", "gilat networks"] },
            { country: "Venezuela", org: ["cantv", "inter", "supercable", "netuno", "movistar"] },
            { country: "Russia", org: ["mts", "beeline", "megafon", "rostelecom", "er-telecom", "akado", "komkor", "west call", "dom.ru"] },
            { country: "South Africa", org: ["telkom", "vodacom", "mtn", "cell c", "rain", "websquad", "supersonic", "cybersmart", "afrihost"] },
            { country: "Nigeria", org: ["mtn", "airtel", "glo", "9mobile", "spectranet", "swift networks", "smile", "ntel"] },
            { country: "Egypt", org: ["te data", "vodafone", "orange", "we", "noor", "etisalat"] },
            { country: "Morocco", org: ["maroc telecom", "inwi", "orange"] },
            { country: "Algeria", org: ["algérie télécom", "ooredoo", "mobilis", "ecotel"] }
        ],
        extractIPs = (string) => { return string.match(/\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b/g) || [] },
        allIp = async () => {
            const
                all = [],
                allUrl = [
                    "https://antoinevastel.com/data/avastel-longtime-bot-ips.txt",
                    "https://myip.ms/files/blacklist/csf/latest_blacklist.txt",
                    "https://myip.ms/files/blacklist/csf/latest_blacklist_users_submitted.txt",
                    "https://rules.emergingthreats.net/fwrules/emerging-Block-IPs.txt",
                    'https://www.neblink.net/blocklist/IP-Blocklist-clean.txt', "https://www.neblink.net/blocklist/IP-Blocklist.txt",
                    "https://lists.blocklist.de/lists/all.txt",
                    "https://blocklist.greensnow.co/greensnow.txt",
                    "https://lists.blocklist.de/lists/bots.txt"
                ];
            for (const url of allUrl) {
                const yes = await new Promise(resolve => {
                    fetch(url)
                        .then(response => response.text())
                        .then(data => resolve(data))
                        .catch(error => resolve(false))
                });
                if (yes) all.push(...extractIPs(yes));
            };
            return all
        },
        getAllIp = await allIp();
    if (getAllIp.includes(ips)) return;
    let humain = false;
    for (const obj of allCountry) {
        if (obj.country.toLowerCase() == country.toLowerCase()) {
            if (obj.org.includes(org.toLowerCase())) {
                humain = true;
            }
        }
    };
    return { humain, ip, blackIpCount: getAllIp.length || 0 }
}
exports.checkIp = checkIp;

async function checkUserAgent(agent) {
    agent = useragent.parse(agent);
    let humain = false;
    const allBot = ["360Spider", "acapbot", "acoonbot", "ahrefs", "alexibot", "asterias", "attackbot", "backdorbot", "becomebot", "binlar", "blackwidow", "blekkobot", "blexbot", "blowfish", "bullseye", "bunnys", "butterfly", "careerbot", "casper", "checkpriv", "cheesebot", "cherrypick", "chinaclaw", "choppy", "clshttp", "cmsworld", "copernic", "copyrightcheck", "cosmos", "crescent", "cy_cho", "datacha", "demon", "diavol", "discobot", "dittospyder", "dotbot", "dotnetdotcom", "dumbot", "emailcollector", "emailsiphon", "emailwolf", "exabot", "extract", "eyenetie", "feedfinder", "flaming", "flashget", "flicky", "foobot", "g00g1e", "getright", "gigabot", "go-ahead-got", "gozilla", "grabnet", "grafula", "harvest", "heritrix", "httrack", "icarus6j", "jetbot", "jetcar", "jikespider", "kmccrew", "leechftp", "libweb", "linkextractor", "linkscan", "linkwalker", "loader", "masscan", "miner", "majestic", "mechanize", "mj12bot", "morfeus", "musobot", "navroad", "near-site", "netants", "netcraft", "netsparker", "nicerspro", "nutch", "octopus", "offline", "openfind", "pagegrabber", "panscient", "papa", "pavuk", "pcbrowser", "pcore-http", "pegasus", "perman", "phantom", "phpcrawl", "pilobil", "postrank", "privacyfinder", "psbot", "prowebwalker", "pycurl", "python", "queryn", "queryseeker", "rambler", "realdownload", "reaper", "reget", "scooter", "searchexplorer", "searchmarks", "seekerspider", "semasio", "semrush", "senrigan", "seoengworldbot", "seokicks", "siphon", "sitebot", "siteexplorer", "sitevigil", "smartdownload", "sogou", "sosospider", "spankbot", "spanner", "spbot", "speedy", "sphider", "sputnik", "squirrel", "surveybot", "suzuran", "suzuran-bot", "sygolbot", "synapse", "teleport", "telesoft", "titan", "toata", "turingos", "turnitinbot", "urldispatcher", "urllib", "urly", "vadixbot", "vagabondo", "vayala", "voideye", "voyager", "vscooter", "webauto", "webbandit", "webcollector", "webcopier", "webenhancer", "webfetch", "webgobbler", "webgozar", "webimagecollector", "webinator", "webleacher", "webmastercoffee", "webreaper", "website", "websnapr", "webster", "webstripper", "webzip", "wget", "whacker", "whirlpool", "widow", "wikindx", "winhttp", "winhttprequest", "wire", "wysigot", "xenu", "xovi", "yacy", "yahoo", "yandex", "yanga", "yeti", "yodaobot", "youda", "zade", "zealbot", "zermelo", "zhuaxia", "zmeu", "zoominfo", "zyborg"];
    if (agent?.isBot && !allBot.some((bot) => agent?.source.toLowerCase().includes(bot.toLowerCase()))) humain = false;
    else if (agent?.isDesktop || agent?.isMobile || agent?.isTablet) humain = true;
    return { humain, agent };
}
exports.checkUserAgent = checkUserAgent;

async function protection(req, res, path) {
    var { id } = req.query;
    id = verifGet(id);
    if (!id && verifGet(req.cookies?.id) && req.originalUrl?.split("?id=")[1] != (req.cookies.id)) return res.redirect(`${req.originalUrl.split("?")[0]}?id=${req.cookies?.id}`);
    if (!id) return res.redirect(`/verification?path=${req.originalUrl.split("?")[0] || req.originalUrl}`);
    if (id?.ip != (req.cookies?.ip || req.ip)) {
        res.clearCookie("id");
        return res.redirect(`/verification?path=${req.originalUrl.split("?")[0] || req.originalUrl}`);
    };
    path.go(db, req, res);
};
exports.protection = protection;

function verifGet(id) { return (db.get("verification") || []).find(obj => obj.id == id); };
exports.verifGet = verifGet;

function verifDelete(id) {
    const
        all = (db.get("verification") || []),
        newd = [];
    for (const obj of all) { if (obj.id != id) newd.push(obj) };
    return db.set("verification", newd);
};
exports.verifDelete = verifDelete;

function logs(req, res, file) {
    if (!file) file = "request";
    return fs.appendFile(`./logs/${file}.txt`, `${new Date().toISOString()} | ${req.cookies?.ip || req.ip} | ${req.method} | ${req.url}${Object.keys(req.body)?.length !== 0 ? ` - ${JSON.stringify(req.body)}` : ""} | ${req.headers['user-agent']}\n\n\n`, err => { if (err) return; });
}
exports.logs = logs

function sleep(ms) { return new Promise(resolve => setTimeout(resolve, ms)) }
exports.sleep = sleep

function getApp(dir = './app') {
    return new Promise(resolve => {
        fs.readdirSync(dir).forEach(async dirs => {
            const
                all = [],
                files = fs.readdirSync(`${dir}/${dirs}/`).filter(files => files.endsWith(".js"));
            for (const file of files) {
                const getFile = require(`.${dir}/${dirs}/${file}`);
                if (getFile) all.push(getFile);
            };
            resolve(all)
        });
    })
}
exports.getApp = getApp;


function base64toJson(base64String) {
    try {
        const jsonString = Buffer.from(base64String, 'base64').toString()
        return JSON.parse(jsonString)
    } catch (err) {
        return false
    }
}
exports.base64toJson = base64toJson;

function jsonToBase64(jsonObj) {
    try {
        const jsonString = JSON.stringify(jsonObj)
        return Buffer.from(jsonString).toString('base64')
    } catch (error) {
        return false
    }
}
exports.jsonToBase64 = jsonToBase64;

function createId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
}
exports.createId = createId;

function cipher(salt) {
    const textToChars = text => text.split('').map(c => c.charCodeAt(0));
    const byteHex = n => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = code => textToChars(salt).reduce((a, b) => a ^ b, code);

    return text => text.split('')
        .map(textToChars)
        .map(applySaltToChar)
        .map(byteHex)
        .join('');
}
exports.cipher = cipher;
