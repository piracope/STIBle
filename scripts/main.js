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
 * @property {Number} percentage the percentage of proximity between the stops
 * @property {Stop} [secret] the secret word, exists only if the player found it
 */

const BACKEND = "https://stible-test.herokuapp.com";

/**
 * All text that appears.
 * @type {Object.<String, String>}
 */
const DIALOGUE = {
    TITLE: {
        fr: "STI",
        nl: "MIV",
    },
    HELP: {
        fr: "Aide",
        nl: "Hulp",
    },
    PLACEHOLDER: {
        fr: "Arrêt de bus, métro, tram...",
        nl: "Bus, tram, metro halte...",
    },
    GUESS: {
        fr: "Deviner",
        nl: "Raden",
    },
    SHARE: {
        fr: "Partager",
        nl: "Delen",
    },
    COPIED: {
        fr: "Copié dans le presse-papiers !",
        nl: "Naar uw clipboard gekopieerd !",
    },
    OFFLINE: {
        fr: "Le serveur est hors ligne.",
        nl: "De server is offline.",
    },
    TIMEOUT: {
        fr: "Oups ! Trop tard ! Rechargement en cours...",
        nl: "Oeps ! U bent te laat ! Herlading onderweg...",
    },
    WIN: {
        fr: "Bien joué !",
        nl: "Proficiat !",
    },
    LOSE: {
        fr: "Raté ! L'arrêt était : ",
        nl: "Verloren ! De halte was : ",
    },
};

/**
 * The main game loop.
 */
async function main() {
    const initialStorage = localStorage;
    /**
     * The initial informations.
     */
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
     * lvlNumber: the level's number
     * @returns {Promise<{routes: Route[], stops: String[], max:Number, lvlNumber: Number, helpModal: String}>}
     * the initial data
     */
    async function getInitialData() {
        if (!initialStorage.lang) {
            localStorage.setItem("lang", "fr");
            initialStorage.lang = "fr";
        }
        const ret = await fetch(`${BACKEND}/start`, {
            method: "POST",
            headers: {
                "Content-Type": "text/plain",
                "Accept": "application/json",
            },
            body: initialStorage.lang,
        })
            .then((res) => {
                if (res.ok) {
                    return res.json();
                }

                $("#lines").text(DIALOGUE.OFFLINE[initialStorage.lang]);
                return undefined;
            })
            .then((data) => data)
            .catch(() => {
                $("#lines").text(DIALOGUE.OFFLINE[initialStorage.lang]);
            });

        return ret;
    }

    /**
     * Translates a stop from one lanugage to another.
     * @param {String} stop the translated stop name
     * @param {"fr" | "nl"} oldLang the current language
     * @param {"fr" | "nl"} newLang the destination language
     */
    async function translate(stop, oldLang, newLang) {
        const ret = await fetch(`${BACKEND}/tl`, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Accept": "text/plain",
            },
            body: JSON.stringify({
                stop_name: stop,
                oldLang: oldLang,
                newLang: newLang,
            }),
        }).then((res) => {
            if (res.status === 200) {
                return res.text();
            }
            return undefined;
        })
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
            row.append($("<td class='squares'>"));
            row.append($("<td class='distance'>"));
            row.append($("<td class='direction'>"));
            table.append(row);
        }
    }
    /**
     * Handles a player guess.
     */
    async function guess() {
        const input = String($("#guess").val());
        if (INITIAL_INFO.stops.includes(input)) {
            fetch(`${BACKEND}/guess`, {
                method: "POST",
                body: JSON.stringify({
                    input: input,
                    currNb: currNb,
                    lvlNumber: INITIAL_INFO.lvlNumber,
                    lang: initialStorage.lang,
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
                    displayResult(result, currNb++);
                    const guesses = localStorage.getItem("guesses");
                    let guessesArr = [];
                    if (guesses) {
                        guessesArr = JSON.parse(guesses);
                        guessesArr.push(result);
                    }
                    localStorage.setItem("guesses", JSON.stringify(guessesArr));
                })
                /*
                .catch(() => {
                    console.log("skill issue");
                })*/;
        }
    }

    /**
     * Displays the result of a guess in the appropriate place.
     * @param {Result} result the result of a guess
     * @param {Number} row the row to display the result at
     */
    function displayResult(result, row) {
        $("#game tbody tr").eq(row)
            .find(".guess")
            .append($("<div>").text(`${result.stop_name}`));

        $("#game tbody tr").eq(row)
            .find(".distance")
            .text(`${result.distance.toFixed(1)}km`);

        $("#game tbody tr").eq(row)
            .find(".squares")
            .text(`${buildSquares(result)}`);
        $("#game tbody tr").eq(row)
            .find(".direction")
            .text(`${result.direction}`);

        if (result.secret) {
            handleGameOver(result);
        }
    }
    /**
     * Reloads the page.
     */
    function timeOut() {
        $("#message").text(DIALOGUE.TIMEOUT(initialStorage.lang));
        setTimeout(() => location.reload(), 3000);
    }

    /**
     * Disables input and displays the according message.
     * Secret is returned by guess on a game over.
     * @param {Result} result the guess result
     */
    function handleGameOver(result) {
        $("#game").off("submit");
        $("#game").on("submit", (e) => e.preventDefault());
        $("#game input").attr("disabled", "true");
        $("#submit").addClass("gameover")
            .text(DIALOGUE.SHARE[initialStorage.lang]);
        if (result.direction !== "✅" && result.secret) {
            $("#message").text(
                `${DIALOGUE.LOSE[initialStorage.lang]} ${result.secret.stop_name}.`
            );
        } else {
            $("#message").text(DIALOGUE.WIN[initialStorage.lang]);
        }
        $("button.gameover").off("click");
        $("button.gameover").on("click", () => {
            if (shareResults()) {
                $("button.gameover").text(DIALOGUE.COPIED[initialStorage.lang]);
            }
        });
    }

    /**
     * Builds the datalist for the input.
     */
    function buildDatalist() {
        INITIAL_INFO.stops.forEach((s) => {
            $("#stops").append($("<option>").attr("value", s));
        });
    }

    /**
     * Returns the squares corresponding to a Result.
     * 20% = green square
     * 10% = yellow square
     * @param {Result} result the result to get the squares from.
     * @returns {String}
     */
    function buildSquares(result) {
        const percentage = result.percentage * 100;
        const green = Math.floor(percentage / 20);
        const yellow = Math.floor(percentage % 20 / 10);
        return "🟩".repeat(green) + "🟨".repeat(yellow) + "⬛".repeat(5 - green - yellow);
    }

    /**
     * Puts the correct game description in the clipboard.
     * @returns the string put in the clipboard
     */
    function shareResults() {
        let ret = "";
        let cnt = 0;
        let lastDir = "";
        $("#game tbody tr").each((i, elem) => {
            const sq = $(elem).find(".squares");
            if (sq.text()) {
                ret += `${sq.text()} `;
                lastDir = sq.next().next()
                    .text();
                ret += lastDir;
                ret += "\n";
                cnt++;
            }
        });

        if (ret) {
            const nbOfTries = lastDir === "✅" ? cnt : "X";
            ret = `Stible #${INITIAL_INFO.lvlNumber} ${nbOfTries}/${INITIAL_INFO.max}\n\n${ret}`;
            navigator.clipboard.writeText(ret);
            return ret;
        }
        return "";
    }
    function init() {
        $(`#${initialStorage.lang}`).attr("checked", "true");
        $("#guess").attr("placeholder", DIALOGUE.PLACEHOLDER[initialStorage.lang]);
        $("#help").text(DIALOGUE.HELP[initialStorage.lang]);
        $("#game button").text(DIALOGUE.GUESS[initialStorage.lang]);
        $("header .blue").text(DIALOGUE.TITLE[initialStorage.lang]);

        if (INITIAL_INFO) {
            $("#helpModal .modal-content").append(INITIAL_INFO.helpModal);
            if (initialStorage.getItem("lvlNumber") !== String(INITIAL_INFO.lvlNumber)) {
                localStorage.setItem("guesses", JSON.stringify([]));
                localStorage.setItem("lvlNumber", String(INITIAL_INFO.lvlNumber));
            }
            displayRoutes();
            buildTable();
            buildDatalist();
            if (initialStorage.getItem("guesses")) {
                const guesses = JSON.parse(String(initialStorage.getItem("guesses")));
                for (const result of guesses) {
                    displayResult(result, currNb++);
                }
            }
        }

        $("body").show();
    }

    /**
     * Translates the history of guesses, saves it then reloads.
     * @param {String} oldLang fr or nl
     * @param {String} newLang fr or nl
     */
    async function translateHistory(oldLang, newLang) {
        const guesses = JSON.parse(String(localStorage.getItem("guesses")));
        console.log(oldLang);
        if (oldLang === newLang || !["fr", "nl"].includes(newLang)) {
            console.log("xdd");
            return;
        }
        for (const g of guesses) {
            //idk why ESLint cries here
            // @ts-ignore
            g.stop_name = await translate(g.stop_name, oldLang, newLang);
        }

        localStorage.setItem("guesses", JSON.stringify(guesses));
        location.reload();
    }

    init();
    $("#game").on("submit", (e) => {
        e.preventDefault();
        guess();
        $("#guess").val("");
    });

    $(".lang").on("click", (e) => {
        const oldLang = String(localStorage.getItem("lang"));
        localStorage.setItem("lang", e.currentTarget.id);
        translateHistory(oldLang, e.currentTarget.id);
    });
    $("#help").on("click", () => $("#helpModal").show());
    $(".close").on("click", () => $("#helpModal").hide());
}

$(main);
