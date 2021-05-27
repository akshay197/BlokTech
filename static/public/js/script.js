const SwipeListener = require('swipe-listener');

const card = document.querySelector('.card');
// eslint-disable-next-line no-undef
const listener = SwipeListener(card);
const dislike = document.querySelector('#dislike');
const like = document.querySelector('#like');
const submit = document.querySelector('.verzend');
const formulier = document.querySelector('form');

card.addEventListener('swipe', function (event) {
      // eslint-disable-next-line prefer-destructuring
      const directions = event.detail.directions;
      if (directions.left) {
            dislike.checked = true;
            formulier.submit();
            console.log('Swiped left, disliked!');
      }

      if (directions.right) {
            like.checked = true;
            formulier.submit();
            console.log('Swiped right, liked!');
      }
});

submit.hidden = true;

/**
 * Functie
 */
like.addEventListener('click', function () {
      formulier.submit();
      console.log('test');
});

dislike.addEventListener('click', function () {
      formulier.submit();
      console.log('test');
});