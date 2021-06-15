const body = document.querySelector('body');
const submit = document.querySelector('.verzend');

submit.classList.add('hidden');

const dislike = document.querySelector('#dislike');
const like = document.querySelector('#like');
const formulier = document.querySelector('form');

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

window.onload = () => {
    body.classList.remove('preload');
};
