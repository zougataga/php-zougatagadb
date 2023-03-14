module.exports = async (app) => {
    const
        db = require("../database/index.js"),
        fs = require("fs"),
        hCaptcha = require('hcaptcha'),
        {
            createId,
            checkIp,
            checkUserAgent,
            protection,
            verifGet,
            verifDelete,
            getApp,
            sleep,
            logs
        } = require("./all.js"),
        allPath = await getApp(),
        pathProtection = [
            {
                path: "/verification",
                method: "GET",
                protection: false,
                go: (db, req, res) => {
                    const id = req.cookies?.id ? verifGet(req.cookies?.id) : false;
                    if (!id) res.sendFile("verification.html", { root: "./public" });
                    else res.redirect(`/?id=${id}`);
                }
            },
            {
                path: "/verification",
                method: "POST",
                protection: false,
                go: async (db, req, res) => {
                    // await sleep((Math.floor(Math.random() * ((2.5) - 1 + 1)) + 1) * 3000);
                    const
                        id = createId(),
                        {
                            ip,
                            agent
                        } = req.body;
                    if (!((agent || ip) && (!agent || ip))) return res.json({ type: 0 });
                    const check1 = await checkIp(ip);
                    if (!check1) return res.json({ type: -1 });
                    else if (check1 && !check1?.humain) return res.json({ type: 1, check1 });
                    const check2 = await checkUserAgent(agent);
                    if (!check2?.humain) return res.json({ type: 2, check1, check2 });
                    await db.push(`verification`, { id, ip, agent });
                    res.json({ type: 3, id, check1, check2 });
                }
            },
            {
                path: "/captcha",
                method: "POST",
                protection: false,
                go: async (db, req, res) => {
                    const
                        {
                            id,
                            ip,
                            agent,
                            path
                        } = req.body,
                        { success } = await hCaptcha.verify("0x079eFa4B77c4C1cf5D9a2f4aC0E1acFB0238362f", req.body['h-captcha-response']);
                    if (!id) return res.send({ type: 0 });
                    if (success) {
                        await db.push(`verification`, { id, ip, agent });
                        setTimeout(() => verifDelete(id), (60000 * 60) * 5);//5heures
                        res.redirect(`${path || "/"}?id=${id}`);
                    } else res.redirect(`/verification?path=${path || "/"}`);
                }
            },
            {
                path: "*",
                method: "get",
                protection: false,
                go: async (db, req, res) => {
                    res.sendFile("404.html", { root: "./public" })
                }
            }
        ];

    allPath.push(...pathProtection);
    for (const path of allPath) {
        const event = async (req, res) => {
            logs(req, res);
            if (req.cookies?.die) return res.send(`<html><head><title>Die...</title><style>   @import url("https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Montserrat:wght@100;200;300;400;500;600;700;800;900&display=swap");body {font-family: "Inter", sans-serif;color: white;margin: 0;padding: 0;background: #0e1012;overflow: hidden;}</style></head><body><script>document.body.style.padding = "20px";document.body.innerHTML = "<h1>404 Not Found</h1>The page that you have requested could not be found.";</script></body></html>`);
            if (path.protection) return protection(req, res, path);
            path.go(db, req, res);
        };
        if (path.method.toLowerCase() === "get") app.get(path.path, event);
        if (path.method.toLowerCase() === "post") app.post(path.path, event);
        if (path.method.toLowerCase() === "put") app.put(path.path, event);
        if (path.method.toLowerCase() === "delete") app.delete(path.path, event);
    };

}