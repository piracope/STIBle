const game = require("./game.js");

const help = {
    fr:
`
<div>
    <p>Attention ! Si vous êtes sur Opera GX Mobile ou Firefox for Android, le
    site ne fonctionnera pas des masses.</p>
    <hr>
    <h2>Comment jouer</h2>
    <hr>
    <p>Devinez le
    <strong><span class="blue">STI</span><span class="red">B</span></strong>le
    en ${game.MAXIMUM_GUESS} essais.</p>
    <p>Nous vous donnons les lignes qui passent sur l'arrêt que vous cherchez</p>
    <p>Chaque essai doit être un arrêt quelconque sur le réseau de la STIB.</p>
    <p>Après chaque essai, vous aurez la distance et la direction entre votre
    essai et l'arrêt mystère.
    <hr>
    <h3>Exemple</h3>
    <table>
        <tr>
            <td class="guess">
                <div>Lot Station</div>
            </td>
            <td class="squares">
                🟩🟩⬛⬛⬛
            </td>
            <td class="distance">
                15.9km
            </td>
            <td class="direction">
                ↗️
            </td>
        </tr>
    </table>
    <p>Votre essai (Lot Station) est à 15,9 km de l'arrêt mystère.
    Celui-ci se trouve au Nord-Est de votre essai.</p>
    <p>Les carrés représentent la proximité entre votre essai et
    l'arrêt mystère. Un carré vert vaut 20%, un carré vaut 10%.</p>
    <p>Comme vous le voyez, c'est très approximatif. J'ai juste
    repompé le système de WORLDLE pour avoir des ptits carrés à
    partager à la fin mais sinon voilà quoi.</p>
    <hr>
    <h3><strong>Un nouveau <span class="blue">STI</span><span class="red">B</span>le
    sera disponible chaque jour !</strong></h3>
    <div style="margin: auto auto; width: fit-content"><small>À minuit, heure de Bruxelles</small></div>
    <hr>
    <p><strong><span class="blue">STI</span><span class="red">B</span></strong>le a été
    <strong>très très</strong> inspiré de WORLDLE par @teuteuf, qui
    lui-même a été inspiré de Wordle, par Josh Wardle.</p>
    <hr>
    <p>Fait par piracope sur une idée de REXAGONE et Hatsena.</p>
    <a href="https://github.com/piracope/STIBle">Code source</a>
</div>
`,
    nl:
`<div>
    <p>Pas op ! Als u op Opera GX of Firefox for Android bent, zal deze website
    niet good werken.</p>
    <hr>
    <h2>Hoe te spelen</h2>
    <hr>
    <p>Raad de
    <strong><span class="blue">MIV</span><span class="red">B</span></strong>le
    in ${game.MAXIMUM_GUESS} proeven.</p>
    <p>Wij geven u de lijnen die de halte passeren waar u naar op zoek bent.</b>
    <p>Elke test moet een willekeurige halte op het MIVB-net zijn.
    <p>Na elke test krijgt u de afstand en richting tussen uw test en de mystery
    stop</p>
    <hr>
    <h3>Voorbeeld</h3>
    <table>
        <tr>
            <td class="guess">
                <div>Lot Station</div>
            </td>
            <td class="squares">
                🟩🟩⬛⬛⬛
            </td>
            <td class="distance">
                15.9km
            </td>
            <td class="direction">
                ↗️
            </td>
        </tr>
    </table>
    <p>Uw test (Lot Station) ligt op 15.9 km van demystery stop. Het ligt ten
    noordoosten van de proef.</p>
    <p>
    Zoals je kunt zien, is het erg approximatief. Ik heb het WORLDLE systeem
    overgenomen om kleine vierkantjes te hebben om te delen aan het eind, maar
    verder is dat alles.</p>
    <hr>
    <h3>Elke dag zal er een nieuwe
    <span class="blue">MIV</span><span class="red">B</span></strong>le
    beschikbaar zijn!</h3>
    <div style="margin: auto auto; width: fit-content">
        <small>Om middernacht Brusselse tijd</small>
    </div>
    <hr>
    <p><strong><span class="blue">MIV</span><span class="red">B</span></strong>le
    was zeer, zeer geïnspireerd door WORLDLE van @teufteuf, die zelf geïnspireerd
    was door Wordle, door Josh Wardle.</p>
    <hr>
    <p>Gemaakt door piracope naar een idee van REXAGONE en Hatsena.</p>
    <p>Hulp-pagina vertaalt door REXAGONE</p>
    <a href="https://github.com/piracope/STIBle">Broncode</a>
</div>`,
};

module.exports = help;
