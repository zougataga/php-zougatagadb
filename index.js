const
    fs = require('fs'),
    express = require('express'),
    app = express(),
    cors = require('cors'),
    cookieParser = require('cookie-parser'),
    robots = require("express-robots-txt")
    protection = require("./utils/protection.js");

app.use(cors());
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('./public'));
app.use(express.urlencoded({ limit: '50mb', extended: true, parameterLimit: 50000 }));
app.use(robots({ UserAgent: "*", Disallow: "/", }));
protection(app);

app.listen(80, () => console.log(`[API] => ON`))