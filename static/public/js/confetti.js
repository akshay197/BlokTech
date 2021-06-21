const ConfettiGenerator = require("confetti-js");
const confettiSettings = {target: 'my-canvas', animate: true };
const confetti = new ConfettiGenerator(confettiSettings);
confetti.render();