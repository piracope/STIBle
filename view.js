const TYPES = require("./typedef.js");

const [Stops, Lines, Routes, Geo] = [
    require("./model/stops.js"),
    require("./model/lines.js"),
    require("./model/routes.js"),
    require("./model/geo.js"),
];

const View = {
    /**
     * Builds the lines in the page.
     * @param {(TYPES.Route | undefined)[]} routes the lines to show
     */
    buildRoutes(routes) {
        let container = "";
        for (const route of routes) {
            const line = `<div class="line"
                style="background-color:#${route?.route_color};
                color: #${route?.route_text_color}">
                ${String(route?.route_short_name)}</div>`;
            container += line;
        }

        return container;
    },
};

module.exports = View;
