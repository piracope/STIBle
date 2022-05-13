const schedule = require("node-schedule");

const game = require("./model/game.js");
const view = require("./view.js");
const stops = require("./model/stops");
game.start();
console.log(game.getSecret());

schedule.scheduleJob("0 0 * * *", () => {
    game.start();
    console.log(game.getSecret());
}); // run everyday at midnight

const http = require("http");
const PORT = 3000;
const server = http.createServer((req, res) => {
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept",
        "Access-Control-Max-Age": 2592000,
    };
    if (req.url === "/routes" && req.method === "GET") {
        const routes = game.getSecretRoutes();
        res.setHeader("Content-Type", "text/html");
        res.writeHead(200, headers);
        res.end(view.buildRoutes(routes));
    } else if (req.url === "/max" && req.method === "GET") {
        res.setHeader("Content-Type", "text/plain");
        res.writeHead(200, headers);
        res.end(String(game.MAXIMUM_GUESS));
    } else if (req.url === "/stops" && req.method === "GET") {
        res.setHeader("Content-Type", "application/json");
        res.writeHead(200, headers);
        res.end(JSON.stringify(stops.getAllStopNames()));
    } else if (req.url === "/guess" && req.method === "POST") {
        res.setHeader("Content-Type", "appplication/json");

        let data = "";
        let guess = null;
        req.on("data", (chunk) => {
            data += chunk;
        });
        req.on("end", () => {
            console.log("End of input");
            console.log(data);
            try {
                guess = JSON.parse(data);
                const toSend = game.processGuess(guess.input);
                console.log(toSend);
                if (!toSend) {
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
        res.writeHead(400, headers);
        res.end();
    }
});
server.listen(PORT);

console.log("Listening on port 3000");
