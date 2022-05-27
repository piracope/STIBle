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
 * All existing routes
 * @type {TYPES.Route[]}
 */
const ALL_ROUTES = JSON.parse(fs.readFileSync("assets/datasets/routes.json", "utf-8"));

const route = {
    /**
     * Returns the routes equivalent to given lines.
     * @param {TYPES.Line[]} lines the array of lines to get the routes from
     * @returns {(TYPES.Route | undefined)[]} the routes equivalent to the given lines
     */
    getRoutesOfLines(lines) {
        const ret = [];
        for (const line of lines) {
            ret.push(ALL_ROUTES.find((r) => String(r.route_short_name) === String(line.lineId)));
        }
        return ret;
    },
};

module.exports = route;
