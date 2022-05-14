const TYPES = require("../typedef.js");

const fs = require("fs");

/**
 * All existing lines.
 * @type {TYPES.Line[]}
*/
const ALL_LINES = JSON.parse(fs.readFileSync("assets/datasets/lines.json", "utf-8"));

const line = {
    /**
     * Returns all the Lines that go through a given array of equivalent Stops.
     *
     * @param {TYPES.Stop[]} stops the equivalent Stops to get the lines from
     * @returns {TYPES.Line[]} the lines that go through the Stops
     */
    getLines(stops) {
        const ret = [];
        let indiceStop = 0;
        while (indiceStop < stops.length) {
            const stop = stops[indiceStop];

            let indiceLine = 0;
            while (indiceLine < ALL_LINES.length) {
                const l = ALL_LINES[indiceLine];

                let dejaAjoute = false;
                let indicePoint = 0;
                while (!dejaAjoute && indicePoint < l.points.length) {
                    const point = l.points[indicePoint];
                    if (String(stop.stop_id) === point.id) {
                        ret.push(l);
                        dejaAjoute = true;
                    }
                    indicePoint++;
                }
                indiceLine++;
            }
            indiceStop++;
        }

        /* Prevents duplicate lines (thanks stackoverflow*/
        return [...new Map(ret.map((item) => [item.lineId, item])).values()];
    },

    /**
     * Returns the IDs of a given array of Lines.
     * @param {TYPES.Line[]} lines the Lines to get the id of.
     */
    linesToId(lines) {
        const ret = [];
        for (const l of lines) {
            ret.push(l.lineId);
        }

        return ret;
    },
};

module.exports = line;
