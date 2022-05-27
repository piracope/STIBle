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

const geo = {
    /**
     * The maximum distance between two Stops.
     * I know it's a hard-coded value but no way in hell I'll compute it
     * at each restart.
     */
    MAXIMUM_DISTANCE: 28.179948213920717,
    /**
     * Returns the distance of the longitude-axis of a vector in km.
     * @param {Number} lon the vector's longitude
     * @param {Number} lat the vector's latitude
     * @returns the vector's longitude distance in km
     */
    lonToKm(lon, lat) {
        return lon * 111.320 * Math.cos(lat);
    },

    /**
     * Returns the distance of the latitude-axis of a vector in km.
     * @param {Number} lat the vector's latitude
     * @returns the vector's latitude distance in km
     */
    latToKm(lat) {
        return lat * 110.574;
    },

    /**
     * Returns the vector of distance between two stops.
     * It returns the distance in km.
     * @param {TYPES.Stop} stop1 the beginning stop
     * @param {TYPES.Stop} stop2 the arrival stop
     * @returns {TYPES.Vector} the vector of displacement between the stops
     */
    getVector(stop1, stop2) {
        const x = stop2.stop_lon - stop1.stop_lon;
        const y = stop2.stop_lat - stop1.stop_lat;
        return {x: geo.lonToKm(x, y), y: geo.latToKm(y)};
    },

    /**
     * Returns the distance between the guess and the real stop.
     * @param {TYPES.Vector} vec the offset
     * @returns {Number} the distance in km between the guessed stop and the secret
     */
    getDistance(vec) {
        return Math.sqrt(vec.x ** 2 + vec.y ** 2);
    },

    /**
     * Returns the general compass direction of an offset.
     * @param {TYPES.Vector} vec the offset between two points
     * @returns {String} the direction the offset is going towards
     */
    getDirection(vec) {
        const angle = Math.atan2(vec.y, vec.x);

        const compass = (Math.round(angle / (2 * Math.PI / 8)) + 8) % 8;
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
            // this is literally impossible.
            return "";
        }
    },
};

module.exports = geo;
