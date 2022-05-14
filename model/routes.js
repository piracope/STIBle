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
