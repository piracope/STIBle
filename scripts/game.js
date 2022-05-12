"use strict";

/**
 * @typedef {Object} Stop
 * A Stop is a STIB/MIVB stop place and is represented by its name,
 * the lines that pass on this stop and its coordinates.
 * @property {String} stop_name the stop's name
 * @property {String} stop_id the stop's id
 * @property {String[]} lines the lines that pass on this stop
 * @property {{lon: Number, lat: Number}} coordinates the stop's coordinates as [longitude, latitude]
 */

/**
 * @typedef {Object} Line
 * A Line is a STIB/MIVB line. It is represented by its destination's name,
 * its direction (suburb/city), its lineId (its number) and the points, or stops,
 * that the Line passes through.
 * @property {String[]} destination the destination's name in [FR, NL]
 * @property {String} direction "City" or "Suburb"
 * @property {String} lineId the Line's number/id
 * @property {{id: String, order: Number}[]} points all the Stops the Line goes
 *      through, as [Stop's ID, its order in the Line]
 */

/**
 * Maximum number of guesses the player can make.
 */
const MAXIMUM_GUESS = 6;

let currGuess = 0;
/**
 * Dear God, wtf is asynchronous programming. Why am i making Promises ???
 * Who even thought that was a good idea wtf ?
 */
async function main() {
    /**
     * All existing stops.
     */
    const stopsJSON = await $.getJSON("http://127.0.0.1:5500/assets/datasets/stops.json");

    /**
     * All existing lines.
     */
    const linesJSON = await $.getJSON("http://127.0.0.1:5500/assets/datasets/lines.json");

    /**
     * The Secret Stop to find.
     * TODO : move it out of here because it's very easy to cheat.
     */
    const secret = getRandomStop();

    let gameOver = false;
    /**
     * Returns an array of the names of all the Stops.
     * @returns {String[]} all stops names
     */
    function getStopsNames() {
        const ret = [];
        for (const stop of stopsJSON) {
            ret.push(stop.stop_name);
        }

        return [...new Set(ret)];
    }

    const allStops = getStopsNames();

    /**
     * Gets all equivalents Stops.
     * Equivalent Stops are stops with the same name, despite not having the
     * same ID.
     * @param {Stop} stop the Stop to get the equivalents from
     * @returns all equivalents of a given Stop
     */
    function getEquivalents(stop) {
        const ret = [];
        for (const elem of stopsJSON) {
            if (stop.stop_name === elem.stop_name) {
                ret.push(elem);
            }
        }

        return ret;
    }

    /**
     * Returns all the Lines that go through a given array of equivalent Stops.
     *
     * @param {Stop[]} stops the equivalent Stops to get the lines from
     * @returns {Line[]} the lines that go through the Stops
     */
    function getLines(stops) {
        const ret = [];
        let indiceStop = 0;
        while (indiceStop < stops.length) {
            const stop = stops[indiceStop];

            let indiceLine = 0;
            while (indiceLine < linesJSON.length) {
                const line = linesJSON[indiceLine];

                let dejaAjoute = false;
                let indicePoint = 0;
                while (!dejaAjoute && indicePoint < line.points.length) {
                    const point = line.points[indicePoint];
                    if (String(stop.stop_id) === point.id) {
                        ret.push(line);
                        dejaAjoute = true;
                    }
                    indicePoint++;
                }
                indiceLine++;
            }
            indiceStop++;
        }

        /* Prevents duplicate lines */
        return [...new Set(ret)];
    }

    /**
     * Returns the IDs of a given array of Lines.
     * @param {Line[]} lines the Lines to get the id of.
     */
    function linesToId(lines) {
        const ret = [];
        for (const line of lines) {
            ret.push(line.lineId);
        }

        return [...new Set(ret)];
    }

    /**
     * Returns a random Spot.
     * @returns {Stop} a random spot
     */
    function getRandomStop() {
        const stop = stopsJSON[Math.floor(Math.random() * stopsJSON.length)];
        const stopName = stop.stop_name;
        const stopId = stop.stop_id;
        const coordinates = {lon: stop.stop_lon, lat: stop.stop_lat};
        const stopLines = getLines(getEquivalents(stop));

        return {
            stop_name: stopName, stop_id: stopId, lines: linesToId(stopLines), coordinates: coordinates,
        };
    }

    /**
     * Builds the datalist for the input.
     */
    function buildDatalist() {
        allStops.forEach((s) => {
            $("#stops").append($("<option>").attr("value", s));
        });
    }

    /**
     * Returns a Stop with a given name.
     * @param {String} name the name of the Stop to get
     * @returns the Stop with the given name
     */
    function getStop(name) {
        for (const elem of stopsJSON) {
            if (elem.stop_name === name) {
                return elem;
            }
        }

        return undefined;
    }

    /**
     * Returns the offset between the player's guess and the secret stop's coordinates.
     * @param {String} guess the player's guess
     * @returns {{lon: Number, lat: Number}} the offset between the guessed stop coordinates and the real one
     */
    function getOffset(guess) {
        const guessStop = getStop(guess);
        return {lon: secret.coordinates.lon - guessStop.stop_lon, lat: secret.coordinates.lat - guessStop.stop_lat};
    }

    /**
     * Returns the general compass direction of an offset.
     * @param {{lon: Number, lat: Number}} offset the offset between two points
     * @returns {String} the direction the offset is going towards
     */
    function getDirection(offset) {
        offset.lat *= 1000;
        offset.lon *= 1000;
        const angle = Math.atan2(offset.lat, offset.lon);

        const compass = Math.round(8 * angle / (2 * Math.PI) + 8) % 8;
        /* https://gamedev.stackexchange.com/questions/49290/whats-the-best-way-of-transforming-a-2d-vector-into-the-closest-8-way-compass-d */

        switch (compass) {
        case 0:
            return "➡️";
        case 1:
            return "↗️";
        case 2:
            return "⬆️";
        case 3:
            return "↖️";
        case 4:
            return "⬅️";
        case 5:
            return "↙️";
        case 6:
            return "⬇️";
        case 7:
            return "↘️";
        default:
            return "";
        }
    }

    /**
     * Returns the distance between the guess and the real stop.
     * @param {{lon: Number, lat: Number}} offset the offset
     * @returns {Number} the distance in km between the guessed stop and the secret
     */
    function getDistance(offset) {
        const offsetLatSq = (offset.lat * 110.574) ** 2;
        const offsetLonSq = (offset.lon * 111.320 * Math.cos(offset.lat)) ** 2;
        return +Math.sqrt(offsetLonSq + offsetLatSq).toFixed(1);
    }

    /**
     * Builds the required DOM elements and adds the necessary event listeners.
     */
    function buildPage() {
        buildDatalist();
        $("#lines").text(`Lignes : ${String(secret.lines)}`);
        $("#secret").text(secret.stop_name);

        $("form").on("submit", (e) => {
            e.preventDefault();
            const val = String($("#guess").val());

            if (allStops.includes(val)) {
                processGuess(val);
                $("#guess").val("");
            }
        });
    }

    /**
     * Processes the player's guess.
     * This method checks if the player's guess is the correct one,
     * handles game over, ...
     * @param {String} guess the player's guess
     */
    function processGuess(guess) {
        const verySecret = secret.stop_name;
        currGuess++;
        let marker = "❌";
        let distance = 0;
        if (guess === verySecret) {
            marker = "✅";
            gameOver = true;
        } else {
            const offset = getOffset(guess);
            distance = getDistance(offset);
            marker = `${getDirection(offset)} ${distance} km`;
        }

        $("form").prepend($("<p>").text(`${guess} ${marker}`));

        if (currGuess === MAXIMUM_GUESS) {
            $("form")
                .prepend($("<p>").text(`Raté ! L'arrêt était : ${verySecret}.`));
            gameOver = true;
        }

        if (gameOver) {
            $("form").off("submit");
            $("form").children()
                .attr("disabled", "true");
        }
    }

    buildPage();
}

$(() => {
    main();
});
