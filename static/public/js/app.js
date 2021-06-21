const SwipeListener = require('swipe-listener');
const card = document.querySelector('.card');
// eslint-disable-next-line no-undef
const listener = SwipeListener(card);

const body = document.querySelector('body');
const underlay = document.querySelector('.underlay');

const submit = document.querySelector('.verzend');

submit.classList.add('hidden');

const dislike = document.querySelector('#dislike');
const like = document.querySelector('#like');
const formulier = document.querySelector('form');

/**
 * Functie
 */

card.addEventListener('swipe', function (event) {
    // eslint-disable-next-line prefer-destructuring
    const directions = event.detail.directions;
    let startingPosX = event.detail.x[0];
    let endingPosX = event.detail.x[1];

    let pixelsMoved = endingPosX - startingPosX;

    card.style.transform = `translateX(${pixelsMoved}px)`;

    if (directions.left) {
        dislike.checked = true;
        formulier.submit();
        console.log('Swiped left, disliked!' + pixelsMoved);
    }

    if (directions.right) {
        like.checked = true;
        formulier.submit();
        console.log('Swiped right, liked!' + pixelsMoved);
    }
});

card.addEventListener('swipecancel', function (event) {
    card.style.transform = `translateX(0)`;
});

like.addEventListener('click', function () {
    formulier.submit();
    console.log('test');
});

dislike.addEventListener('click', function () {
    formulier.submit();
    console.log('test');
});

window.onload = () => {
    body.classList.remove('preload');
};
