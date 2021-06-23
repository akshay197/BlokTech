// npm: confetti-js. (2020, 11 maart). Npm. https://www.npmjs.com/package/confetti-js
const ConfettiGenerator = require("confetti-js");
const confettiSettings = {target: 'my-canvas', animate: true }; // traget is de gemaakt canvass en ik wil de optie animatie op true zetten
const confetti = new ConfettiGenerator(confettiSettings); // creeer nieuwe confetti met onze opties als parameter
confetti.render(); // render de confetti