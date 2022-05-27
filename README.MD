# STIBle / MIVBle

[STIBle / MIVBle](https://stible.elitios.net) is a WorLdle clone, except that
you don't guess a country, but a stop in the STIB's
(Brussels' public transport company) network.

## Requirements

+ [npm](https://nodejs.org)

## Installation

Clone the repository.

```bash
git clone https://www.github.com/piracope/STIBle.git
```

Install the necessary dependencies.

```bash
npm install
```

## Usage

If you don't have a PORT defined in your environment, it will run on port 3000.

If you're running it locally, first run the server with this command : 

```bash
npm start
```
You should see some weird stuff appear, then "Listening on port 3000" (or whatever
port you're listening to). Btw that weird stuff is the secret stop generated which
is useful for ~~cheating~~ debugging.
Then, open your browser to [http://localhost:3000](http://localhost:3000). And then, do some heavy gaming 😎.

### Environment variables

In the root of the project, create a .env file.
The only keys that will be taken into account (and their default values) are :

```
PORT=3000           // the port the server will be listening on
MAXIMUM_GUESSES=6   // the maximum number of guesses the player can make
MINUTE_MODE=        // if this variable is set to whatever, Minute Mode will be turned on
```

If any of those aren't set, they will take the default values aforementioned.

### Minute Mode (debug)

Minute Mode generates a new secret Stop every 5 minutes. That's it. It's useful
for debugging tho.

## Features

+ Generates a new secret stop to guess every midnight (Europe/Brussels' midnight)

+ You can switch from French to Dutch and everything gets translated accordingly

+ uhhh like play it i guess, i mean it's yet another wordle clone so like play it
and find out

+ There's a funny 404 page

## Contributing

**TL;DR** I made this while not knowing anything about networking so please
notify me of any security flaw. For actual features, let me know what you want
but let me do it myself

I discovered how to make HTTP requests, how to make an API, how to make a
(somewhat) MVC webapp in like, two sleepless nights. I have not yet seen this at 
school, and as such, have valued the "if it works it works" mindset rather
than valuing security. I still did my best tho, but this thing surely has
enough security flaws to pay for the living expenses of a cybersecurity expert
for at least two days (the codebase is pretty small (1100+ LOC)).

I don't have to deal with storing user info or anything like that, so there's
nothing much to compromise... I think. Anyways, if you notice a security risk,
please, please tell me/PR me something about it.

As for new features, I accept suggestions, but this project is a huge learning
opportunity for me, so I'd prefer of you just say "oh I want this" instead of
giving me a PR with eerything already done.


## Trivia

> Why did you do this ?

This is the story of three people :
[@REXAG0NE](https://www.twitter.com/rexag0ne) (REXA)
[@Hatsenaa](https://www.twitter.com/hatsenaa) (Hatsena)
and me.

So one day, the STIB Twitter account tweets a rebus, where you had to guess the
name of the stop. Hatsena replied with something in the lines of "lmao imagine
a STIB wordle", to which REXA replied "that'd be cool, but we'd need a dev". And
after posting an adequately timed "hi", I slaved my nights away to make this !

Honestly it was pretty fun, I learned a lot of things doing this so worth it.

> Why the 95 line as logo ?

Because it's the best one.

> No it's not ! What about the 71 ?

I know who you are, where you are, and I am approaching rapidly. Start running.

## Authors and acknowledgments

+ Development : piracope

+ Hosting : [@REXAG0NE](https://www.twitter.com/rexag0ne) and Elitios

+ Original idea : [@Hatsenaa](https://www.twitter.com/hatsenaa)

+ Original idea's main inspiration : [WORLDLE](https://worldle.teuteuf.fr) by
[@teuteuf](https://www.twitter.com/teuteuf)

+ Original idea's main inspiration's main inspiration :
[Wordle](https://www.nytimes.com/games/wordle/index.html) by Josh Wardle0

+ The "front-end sends a request to the API and never knows what the word is"
design came to me while combing through 
[cémantix](https://cemantix.herokuapp.com/)'s source code.

+ The data (stops, lines, ...) required to make the datasets that the game
runs on came from the [STIB's API](https://opendata.stib-mivb.be/store/data).

## License

Copyright (c) 2022 piracope, REXAGONE, Hatsena and contributors

Licensed under the [AGPLv3 license](COPYING).