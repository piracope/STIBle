/*
    This file is part of STIBle, a STIB-MIVB focused wordle-like game.

    Copyright (C) 2022  piracope, REXAGONE, Hatsena and contributors

    STIBle is free software: you can redistribute it and/or modify
    it under the terms of the GNU Affero General Public License as published
    by the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    STIBle is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU Affero General Public License for more details.

    You should have received a copy of the GNU Affero General Public License
    along with STIBle.  If not, see <https://www.gnu.org/licenses/>.
*/

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
