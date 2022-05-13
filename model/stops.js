const TYPES = require("../typedef.js");

const fs = require("fs");

const stop = {
    /**
     * All existing stops.
     * @type {TYPES.Stop[]}
     */
    ALL_STOPS: JSON.parse(fs.readFileSync("../assets/datasets/stops.json", "utf-8")),

    /**
     * Translations for the stops.
     * @type {{stop_name: String, fr: String, nl: String}[]}
     */
    TRANSLATIONS: JSON.parse(fs.readFileSync("../assets/datasets/translations.json", "utf-8")),
    /**
     * Returns an array of the names of all the Stops.
     * @returns {String[]} all stops names
     */
    getAllStopNames() {
        const ret = [];
        for (const s of stop.ALL_STOPS) {
            ret.push(s.stop_name);
        }

        return [...new Set(ret)];
    },

    /**
     * Returns the translation in a given language of all the stops names.
     * @param {"fr" | "nl"} lang the language of the translations to get
     * @returns {String[]} the translated stops names
     */
    getAllTranslatedStopNames(lang) {
        const ret = [];
        for (const s of stop.TRANSLATIONS) {
            ret.push(s[lang]);
        }

        return [...new Set(ret)];
    },

    /**
     * Gets all equivalents Stops.
     * Equivalent Stops are stops with the same name, despite not having the
     * same ID.
     * @param {TYPES.Stop} s the Stop to get the equivalents from
     * @returns all equivalents of a given Stop
     */
    getEquivalents(s) {
        const ret = [];
        for (const elem of stop.ALL_STOPS) {
            if (s.stop_name === elem.stop_name) {
                ret.push(elem);
            }
        }

        return ret;
    },

    /**
     * Returns a random spot from the dataset.
     * @returns {TYPES.Stop} a random spot
     */
    getRandomStop() {
        return stop.ALL_STOPS[Math.floor(Math.random() * stop.ALL_STOPS.length)];
    },

    /**
     * Returns a Stop with a given name.
     * @param {String} name the name of the Stop to get
     * @returns the Stop with the given name
     */
    getStop(name) {
        for (const elem of stop.ALL_STOPS) {
            if (elem.stop_name === name) {
                return elem;
            }
        }

        return undefined;
    },
};

module.exports = stop;
