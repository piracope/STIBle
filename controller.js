const schedule = require("node-schedule");

const game = require("./model/game.js");

/*START GAME*/
game.start();
console.log(game.getSecret());
let date = new Date().getTime();

/*RESTART GAME AT MIDNIGHT*/
schedule.scheduleJob("* * * * *", () => {
    game.start();
    console.log(game.getSecret());
    date = new Date().getTime();
});

/* OPEN SERVER */
const http = require("http");
const PORT = 3000;
const server = http.createServer((req, res) => {
    /* HEADERS FOR CORS */
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Max-Age": 2592000,
    };

    /* sends the secret's routes, the max number of guesses and all stops names
    for client-side input verification + datalist building*/
    if (req.url === "/start" && req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, headers);
        const ret = {
            routes: game.getSecretRoutes(),
            stops: game.getAllStopNames(),
            max: game.MAXIMUM_GUESS,
            date: date,
        };
        res.end(JSON.stringify(ret));
    } else if (req.url === "/guess" && req.method === "POST") {
        /*PROCESS USER GUESS */

        res.setHeader("Content-Type", "appplication/json");

        let data = "";
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            console.log(data);
            try {
                const guess = JSON.parse(data);
                /* server-side input verification */
                if (!game.getAllStopNames().includes(guess.input)) {
                    res.writeHead(400, headers);
                    res.end();
                    return;
                }
                if (guess.date !== date) {
                    res.writeHead(205, headers);
                    res.end();
                    return;
                }
                const toSend = game.processGuess(guess.input);
                console.log(toSend);
                if (!toSend) {
                    /* should never arrive here, but meh better be safe */
                    res.writeHead(501, headers);
                    res.end();
                    return;
                } else if (toSend?.direction === "✅"
                        || guess.currNb + 1 >= game.MAXIMUM_GUESS) {
                    toSend.secret = game.getSecret();
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
    } else {
        res.writeHead(404, headers);
        res.end("ERREUR 404 HAHAHAHAAA (t'as vu maman je fais mes propres erreur 404 maintenant");
    }
});
server.listen(PORT);

console.log("Listening on port 3000");
