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

"use strict";

const INTERVAL = 2000;

$(() => {
    const max = $("#blague").children().length;
    let i = 0;
    const s = setInterval(() => {
        $("#blague").children()
            .eq(i++)
            .fadeIn(INTERVAL);

        if (i >= max) {
            clearInterval(s);
        }
    }, INTERVAL);
});
