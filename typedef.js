/**
 * @typedef {Object} Stop
 * A Stop is a STIB/MIVB stop place and is represented by its name,
 * the lines that pass on this stop and its coordinates.
 * @property {String} stop_name the stop's name
 * @property {String} stop_id the stop's id
 * @property {Line[]} lines the lines that pass on this stop
 * @property {Number} stop_lon the stop's longitude
 * @property {Number} stop_lat the stop's latitude
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
 * @typedef {Object} Route
 * A Route is like a Line, but it goes both ways. Also gives more information
 * on the actual transport.
 * Route can be of three types : 0 -> Tram, 1 -> Metro, 3 -> Bus
 * @property {String} route_short_name the Line number
 * @property {Number} route_type the type of Route
 * @property {String} route_color the background color of the route
 * @property {String} route_text_color the color of the route's text
 */

/**
 * @typedef {Object} Vector
 * A 2D Vector is a set of two values : the first describing how
 * far the vector goes on the x-axis, the second on the y-axis.
 * @property {Number} x the x-axis displacement.
 * @property {Number} y the y-axis displacement.
 */

/**
 * @typedef {Object} Result
 * A Result is what will be shown to the player after making a guess.
 * @property {String} stop_name the guessed stop's name
 * @property {Number} distance the distance between the guessed stop and the secret one
 * @property {String | undefined} direction the direction the secret stop is related to the guessed stop.
 * If undefined, it means they're equivalent.
 * @property {Stop} [secret] the secret word, exists only if the player found it
 */
exports.TYPES = {};
