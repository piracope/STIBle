/* GAME CONSTANTS */
const schedule = require("node-schedule");
const game = require("./model/game.js");
const help = require("./model/help.js");

/* SERVER CONSTANTS */
const fs = require("fs");
const http = require("http");
const path = require("path");
const PORT = process.env.PORT || 3000;
const headers = {
    "Strict-Transport-Security": "max-age=63072000",
};

let lvlNumber = 1;
try {
    lvlNumber = Number(fs.readFileSync("./lvlnumber.txt", "utf-8"));
} catch {
    fs.writeFileSync("./lvlnumber.txt", String(lvlNumber));
}
/*START GAME*/
game.start();
console.log(game.getSecret());
console.log(`Niveau : ${lvlNumber}`);

/*RESTART GAME AT MIDNIGHT*/
const scheduleRule = process.env.MINUTE_MODE ? "* * * * *" : "0 0 0 0 0";
// TODO : change minute and hour to 0 on production
schedule.scheduleJob(scheduleRule, () => {
    game.start();
    console.log(game.getSecret());
    fs.writeFileSync("./lvlnumber.txt", String(++lvlNumber));
    console.log(`Niveau : ${lvlNumber}`);
});

/* OPEN SERVER */
const server = http.createServer((req, res) => {
    /* process.env.DYNO tests if it runs on heroku */
    if (process.env.DYNO && req.headers["x-forwarded-proto"] !== "https") {
        res.writeHead(302, {
            "Location": `https://${req.headers.host}${req.url}`,
        });
        res.end();
        return;
    }
    /* sends the secret's routes, the max number of guesses and all stops names
    for client-side input verification + datalist building*/
    if (req.url === "/start" && req.method === "POST") {
        res.setHeader("Content-Type", "application/json");
        let lang = "";
        req.on("data", (chunk) => {
            lang += chunk;
        });
        req.on("end", () => {
            if (lang !== "fr" && lang !== "nl") {
                res.writeHead(400, headers);
                res.end();
                return;
            }
            const allStops = game.getAllTranslatedStopNames(lang);
            allStops.sort();
            const ret = {
                routes: game.getSecretRoutes(),
                stops: allStops,
                max: game.MAXIMUM_GUESS,
                lvlNumber: lvlNumber,
                helpModal: help[lang],
            };
            res.writeHead(200, headers);
            res.end(JSON.stringify(ret));
        });
    } else if (req.url === "/guess" && req.method === "POST") {
        /*PROCESS USER GUESS */

        res.setHeader("Content-Type", "appplication/json");

        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            try {
                const guess = JSON.parse(data);
                /* server-side input verification */
                console.log(guess);
                if (!game.getAllTranslatedStopNames(guess.lang).includes(guess.input)) {
                    res.writeHead(400, headers);
                    res.end();
                    return;
                }
                if (guess.lvlNumber !== lvlNumber) {
                    res.writeHead(205, headers); /*Data expired or something i don't remember */
                    res.end();
                    return;
                }
                const stopName = game.translatedToReal(guess.input, guess.lang);
                if (!stopName) {
                    /* should never arrive here, but meh better be safe */
                    res.writeHead(501, headers);
                    res.end();
                    return;
                }
                const toSend = game.processGuess(stopName);
                if (!toSend) {
                    /* should never arrive here, but meh better be safe */
                    res.writeHead(501, headers);
                    res.end();
                    return;
                } else if (toSend?.direction === "✅"
                        || guess.currNb + 1 >= game.MAXIMUM_GUESS) {
                    toSend.secret = game.getSecret();
                }
                const nameToSend = game.realToTranslated(toSend.stop_name, guess.lang);
                if (nameToSend) {
                    toSend.stop_name = nameToSend;
                }
                res.writeHead(200, headers);
                res.write(JSON.stringify(toSend));
                res.end();
                return;
            } catch {
                res.writeHead(400, headers);
                res.end();
            }
        });
    } else if (req.url === "/tl" && req.method === "POST") {
        /** TRANSLATES A STOP FROM OLDLANG TO NEWLANG */
        res.setHeader("Content-Type", "text/plain");
        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            try {
                const stop = JSON.parse(data);
                const toSend = game.translate(stop.stop_name, stop.oldLang, stop.newLang);
                if (toSend) {
                    res.writeHead(200, headers);
                    res.end(toSend);
                    return;
                }
                res.writeHead(204, headers);
                res.end();
            } catch {
                res.writeHead(400, headers);
                res.end();
            }
        });
    } else if (req.url) {
        /* STATIC FILE SERVING */
        const uri = decodeURI(new URL(req.url, `https://${req.headers.host}/`).pathname);
        let filename = path.normalize(path.join(__dirname, "public", uri));
        if (filename.charAt(filename.length - 1) === path.sep) {
            filename = path.join(filename, "index.html");
        }
        serveFile(res, filename);
    }
});
server.listen(PORT);

console.log(`Listening on port ${PORT}`);

/**
 * Serves a file.
 * @param {http.ServerResponse} res the response
 * @param {String} filename the file's name
 * @param {Number} [status] the status code to send
 */
function serveFile(res, filename, status) {
    /**
     * MIME looking table.
     * @type {Object.<String, String>}
     */
    const MIME = {
        "html": "text/html",
        "js": "text/javascript",
        "css": "text/css",
        "otf": "application/x-font-opentype",
    };
    try {
        const stream = fs.createReadStream(filename);
        stream.pipe(res);
        stream.on("open", () => {
            const extension = filename.split(".");
            let mimeToSend = MIME[extension[extension.length - 1]];
            if (!mimeToSend) {
                mimeToSend = "text/plain";
            }
            res.setHeader("Content-Type", mimeToSend);
            res.writeHead(status || 200, headers);
        });
        stream.on("error", () => {
            serveFile(res, path.join(__dirname, "public", "quoi.html"), 404);
        });
    } catch {
        res.statusCode = 500;
        throw Error("500");
    }
}
