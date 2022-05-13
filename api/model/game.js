const TYPES = require("../typedef.js");

const [Stops, Lines, Routes, Geo] = [
    require("./stops.js"),
    require("./lines.js"),
    require("./routes.js"),
    require("./geo.js"),
];

const fs = require("fs");
const settings = JSON.parse(fs.readFileSync("./settings.json", "utf-8"));
/**
 * @type {TYPES.Stop | undefined}
 */
let secret = undefined;

/**
 * @type {TYPES.Line[] | undefined}
 */
let secretLines = undefined;

const game = {
    /**
     * Maximum number of guesses the player can make.
     */
    MAXIMUM_GUESS: settings.maximumGuesses,
    start() {
        secret = Stops.getRandomStop();
        secretLines = Lines.getLines(Stops.getEquivalents(secret));
    },

    /**
     * Processes the player's guess.
     * This function checks if the player's guess is the correct one,
     * sets the game over, ...
     * @param {String} guess the guessed stop
     * @returns {TYPES.Result | undefined} the Result of the guess, undefined if
     * the game hasn't started yet.
     */
    processGuess(guess) {
        if (!secret || !guess) {
            return undefined;
        }
        const guessedStop = Stops.getStop(guess);
        if (!guessedStop) {
            return undefined;
        }
        if (guessedStop?.stop_name === secret.stop_name) {
            return {
                stop_name: guessedStop.stop_name,
                distance: 0,
                percentage: 1,
                direction: "✅",
            };
        }

        const vector = Geo.getVector(guessedStop, secret);
        const distance = Geo.getDistance(vector);

        return {
            stop_name: guessedStop.stop_name,
            distance: distance,
            percentage: (Geo.MAXIMUM_DISTANCE - distance) / Geo.MAXIMUM_DISTANCE,
            direction: Geo.getDirection(vector),
        };
    },

    /**
     * Returns the Routes that pass through the secret Stop.
     * @returns {(TYPES.Route | undefined)[]} the Routes that pass through the secret Stop
     */
    getSecretRoutes() {
        if (secretLines) {
            const ret = Routes.getRoutesOfLines(secretLines);
            if (ret) {
                return ret;
            }
        }
        return [];
    },

    /**
     * Returns the secret stop.
     */
    getSecret() {
        return secret;
    },
    getAllStopNames() {
        return Stops.getAllStopNames();
    },
    getMaximumDistance() {
        const ret = [];
        for (const stop1 of Stops.ALL_STOPS) {
            for (const stop2 of Stops.ALL_STOPS) {
                const distance = Geo.getDistance(Geo.getVector(stop1, stop2));
                ret.push(distance);
            }
        }
        ret.sort((a, b) => a - b);
        console.log(ret[ret.length - 1]);
    },
};
module.exports = game;
