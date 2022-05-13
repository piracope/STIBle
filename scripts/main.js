"use strict";

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

const BACKEND = "http://localhost:3000";

/**
 * The main game loop.
 */
async function main() {
    const INITIAL_INFO = await getInitialData();
    /**
     * The current number of guesses made.
     */
    let currNb = 0;

    /**
     * Returns the initial data necessary to return the game.
     * routes : the routes that pass on the secret stop
     * stops : all stops possible
     * max : the maximum number of guesses the player can make
     * @returns {Promise<{routes: Route[], stops: String[], max:Number, date: Number}>}
     * the initial data
     */
    async function getInitialData() {
        const ret = await fetch(`${BACKEND}/start`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
            },
        })
            .then((res) => res.json())
            .then((data) => data);

        return ret;
    }

    /**
     * Displays the secret routes.
     */
    async function displayRoutes() {
        for (const route of INITIAL_INFO.routes) {
            const line = $("<div>")
                .addClass("line")
                .text(route.route_short_name)
                .css("background-color", `#${route.route_color}`)
                .css("color", `#${route.route_text_color}`);
            $("#lines").append(line);
        }
    }

    /**
     * Builds the guess table according to the number of max guess.
     */
    function buildTable() {
        const table = $("#game tbody");
        for (let i = 0; i < INITIAL_INFO.max; i++) {
            const row = $("<tr>");
            row.append($("<td class='guess'>"));
            row.append($("<td class='distance'>"));
            row.append($("<td class='direction'>"));
            table.append(row);
        }
    }
    /**
     * Handles a player guess.
     */
    async function guess() {
        const input = String($("#guess").val()).toUpperCase();
        if (INITIAL_INFO.stops.includes(input)) {
            fetch(`${BACKEND}/guess`, {
                method: "POST",
                body: JSON.stringify({
                    input: input,
                    currNb: currNb,
                    date: INITIAL_INFO.date,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
            })
                .then((res) => {
                    if (res.ok) {
                        if (res.status === 200) {
                            return res.json();
                        } else if (res.status === 205) {
                            timeOut();
                        }
                    }
                    return undefined;
                })
                .then((result) => {
                    $("form tbody tr").eq(currNb)
                        .find(".guess")
                        .html(`<div>${result.stop_name}</div>`);
                    $("form tbody tr").eq(currNb)
                        .find(".distance")
                        .html(`<div>${result.distance.toFixed(1)}km</div>`);
                    $("form tbody tr").eq(currNb)
                        .find(".direction")
                        .html(`<div>${result.direction}</div>`);

                    if (result.secret) {
                        handleGameOver(result);
                    } else {
                        currNb++;
                    }
                })
                .catch(() => {
                    console.log("skill issue");
                });
        }
    }

    /**
     * Reloads the page.
     */
    function timeOut() {
        $("form")
            .append($("<p>")
                .text("Page en retard ! Elle va être rechargée dans 3 secondes..."));
        setTimeout(() => location.reload(), 3000);
    }

    /**
     * Disables input and displays the according message.
     * Secret is returned by guess on a game over.
     * @param {Result} result the guess result
     */
    function handleGameOver(result) {
        $("form").off("submit");
        $("button, input").attr("disabled", "true");
        if (result.direction !== "✅" && result.secret) {
            $("form")
                .append($("<p>").text(`Raté ! L'arrêt était : ${result.secret.stop_name}.`));
        } else {
            $("form")
                .append($("<p>").text("Bien joué !"));
        }
    }

    /**
     * Builds the datalist for the input.
     */
    function buildDatalist() {
        INITIAL_INFO.stops.forEach((s) => {
            $("#stops").append($("<option>").attr("value", s));
        });
    }

    displayRoutes();
    buildTable();
    buildDatalist();
    $("form").on("submit", (e) => {
        e.preventDefault();
        guess();
        $("#guess").val("");
    });
}

$(main);
