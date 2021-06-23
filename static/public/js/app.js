const SwipeListener = require('swipe-listener');
const card = document.querySelector('.card');
// eslint-disable-next-line no-undef
const listener = SwipeListener(card); // npm: swipe-listener. (2020a, oktober 13). Npm. https://www.npmjs.com/package/swipe-listener
const body = document.querySelector('body');
const dislike = document.querySelector('#dislike');
const like = document.querySelector('#like');
const formulier = document.querySelector('form');
const submit = document.querySelector('.verzend');

/**
 * Hide de submit wanneer javascript aan staat, want dan wordt het formulier automatisch verzonden wanneer de gebruiker op like of dislike klikt.
 */
submit.classList.add('hidden');

/**
 * Functie met swipen, deze functie maakt gebruiker van de swipe-lister library. Deze is te vinden op ttps://www.npmjs.com/package/swipe-listener
 */
card.addEventListener('swipe', function (event) {
    /**
     * Functiegebonden variabelen, deze variabelen bevatten een 'event.detail. De library stuurt bepaalde data naar de event.detail
     * Wanneer we een eventlistener met swipe meegeven.
     */
    const directions = event.detail.directions; // directions bevat de richting waar naartoe geswiped wordt dit kan top, right, bottom of left zijn.
    const posX = event.detail.x; // de detail.x staat voor de x-beweging, dit is een array van de startpositie van de swipe en de eindpositie van de swipe
    const startingPosX = posX[0]; // de bovenstaande positionX array met de nul index (eerste item)
    const endingPosX = posX[1]; // de bovenstaande positonX array met de één index (tweede- en in dit geval laatste item)

    /**
     * Stukje over het verplaatsen van de card wanneer de swipe uitgevoerd wordt.
     */
    const pixelsMoved = endingPosX - startingPosX; // dit berekent het verschil tussen de eindpositie en de startpositie van de swipe

    card.style.transform = `translateX(${pixelsMoved}px)`; // transformatie op de x-as van de positie van de card wanneer je swiped, het neemt de pixelsMoved variable als interger mee

    /**
     * Hier kijken we of de swipe richting naar links of rechts is gegaan, mocht dat zo zijn, dan zetten we de juiste checkbox aan en verzenden we het formulier.
     */
    if (directions.left) {
        dislike.checked = true; // toggle de checkbox
        formulier.submit(); // verzend het formulier
        console.log('Swiped left, disliked!' + pixelsMoved);
    }

    if (directions.right) {
        like.checked = true;
        formulier.submit();
        console.log('Swiped right, liked!' + pixelsMoved);
    }
});

/**
 * Wanneer de swipe niet genoeg pixels is verplaatst, dan zetten we de transform op 0px zodat hij op de juiste plek komt te staan.
 */
card.addEventListener('swipecancel', function () {
    card.style.transform = `translateX(0)`;
});

/**
 * Verzend automatisch het formulier wanneer de gebuiker op like of dislike klikt.
 */
like.addEventListener('click', function () {
    formulier.submit();
});

dislike.addEventListener('click', function () {
    formulier.submit();
});

/**
 * Verwijder de classlist van preload zodat er geen gekke transitions op het begin zijn.
 */
window.onload = () => {
    body.classList.remove('preload');
};
