"use strict";

const BACKEND = "http://localhost:3000";

/**
 * The main game loop.
 */
async function main() {
    /**
     * The current number of guesses made.
     */
    let currNb = 0;

    /**
     * Gets the routes of the secret spot and diplays them.
     */
    async function displayRoutes() {
        fetch(`${BACKEND}/routes`, {
            method: "GET",
            headers: {
                "Accept": "text/html",
            },
        })
            .then((res) => res.text())
            .then((data) => $("#lines").html(data));
    }

    /**
     * Returns how many guesses are allowed.
     * @returns {Promise<Number>} the maximum number of guesses possible
     */
    async function getMaxGuess() {
        const ret = await fetch(`${BACKEND}/max`, {
            method: "GET",
            headers: {
                "Accept": "text/plain",
            },
        })
            .then((res) => res.text())
            .then((data) => Number(data));
        return ret;
    }

    /**
     * Gets and returns an array of all the stops' names.
     * @returns {Promise<String[]>} all stops' names
     */
    async function getAllStopNames() {
        const ret = await fetch(`${BACKEND}/stops`, {
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
     * Handles a player guess.
     */
    async function guess() {
        const input = String($("#guess").val()).toUpperCase();
        if (ALL_STOPS.includes(input)) {
            fetch(`${BACKEND}/guess`, {
                method: "POST",
                body: JSON.stringify({
                    input: input,
                    currNb: currNb,
                }),
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept": "application/json",
                },
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
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
                        handleGameOver(result.secret);
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
     * Disables input and displays the according message.
     * Secret is returned by guess on a game over.
     * @param {{stop_name: String}} secret the secret stop
     */
    function handleGameOver(secret) {
        $("form").off("submit");
        $("button, input").attr("disabled", "true");
        if (currNb >= MAX_GUESS) {
            $("form")
                .append($("<p>").text(`Raté ! L'arrêt était : ${secret.stop_name}.`));
        } else {
            $("form")
                .append($("<p>").text("Bien joué !"));
        }
    }

    /**
     * Builds the datalist for the input.
     */
    function buildDatalist() {
        ALL_STOPS.forEach((s) => {
            $("#stops").append($("<option>").attr("value", s));
        });
    }

    const MAX_GUESS = await getMaxGuess();
    const ALL_STOPS = await getAllStopNames();
    console.log(MAX_GUESS);
    displayRoutes();
    buildDatalist();
    $("form").on("submit", (e) => {
        e.preventDefault();
        guess();
        $("#guess").val("");
    });
}

$(main);
