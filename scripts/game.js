"use strict";

/**
 * @typedef {Object} Stop
 * A Stop is a STIB/MIVB stop place and is represented by its name,
 * the lines that pass on this stop and its coordinates.
 * @property {String} stop_name the stop's name
 * @property {String} stop_id the stop's id
 * @property {String[]} lines the lines that pass on this stop
 * @property {Number[]} coordinates the stop's coordinates as [longitude, latitude]
 */

/**
 * @typedef {Object} Line
 * A Line is a STIB/MIVB line. It is represented by its destination's name,
 * its direction (suburb/city), its lineId (its number) and the points, or stops,
 * that the Line passes through.
 * @property {String[]} destination the destination's name in [FR, NL]
 * @property {String} direction "City" or "Suburb"
 * @property {String} lineId the Line's number/id
 * @property {{id: String, order: Number}} points all the Stops the Line goes
 *      through, as [Stop's ID, its order in the Line]
 */

/**
 * Dear God, wtf is asynchronous programming. Why am i making Promises ???
 * Who even thought that was a good idea wtf ?
 */
async function main() {
    /**
     * All existing stops.
     */
    const stopsJSON = await $.getJSON("../assets/stops.json");

    /**
     * All existing lines.
     */
    const linesJSON = await $.getJSON("../assets/lines.json");

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
                indiceLine += 2;
            }
            indiceStop++;
        }
        return ret;
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

        return ret;
    }

    /**
     * Returns a random Spot.
     * @returns {Stop} a random spot
     */
    function getRandomStop() {
        const stop = stopsJSON[Math.floor(Math.random() * stopsJSON.length)];
        const stopName = stop.stop_name;
        const stopId = stop.stop_id;
        const coordinates = [stop.stop_lon, stop.stop_lat];
        const stopLines = getLines(getEquivalents(stop));

        return {
            stop_name: stopName, stop_id: stopId, lines: linesToId(stopLines), coordinates: coordinates,
        };
    }
    console.log(getRandomStop());
}

$(() => {
    main();
});
