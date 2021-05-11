const dislike = document.querySelector('#dislike');
const like = document.querySelector('#like');
const submit = document.querySelector('.verzend');
const formulier = document.querySelector('form');

submit.hidden = true;

/**
 * Functie 
 */
like.addEventListener('click', function(){
    formulier.submit();
    console.log('test')
})


dislike.addEventListener('click', function(){
    formulier.submit();
    console.log('test')
})