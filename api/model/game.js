const TYPES = require("../typedef.js");

const [Stops, Lines, Routes, Geo] = [
    require("./stops.js"),
    require("./lines.js"),
    require("./routes.js"),
    require("./geo.js"),
];

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
    MAXIMUM_GUESS: 6,
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
                direction: "✅",
            };
        }

        const vector = Geo.getVector(guessedStop, secret);

        return {
            stop_name: guessedStop.stop_name,
            distance: Geo.getDistance(vector),
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
};

module.exports = game;
