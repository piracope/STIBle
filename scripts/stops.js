"use strict";

function getWords() {
    let ret = [Object];
    $.getJSON("../assets/arrets-stib.json", (data) => {
        ret = [];
        for (const elem of data) {
            ret.push(elem.fields);
        }
    });
}

const stops = getWords();
