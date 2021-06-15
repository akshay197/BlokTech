/**
 * Router
 */

const router = require('express').Router();
const LikeController = require('../controllers/LikeController');

router.get('/', LikeController.getSimilarUsers);

router.post('/', LikeController.userPreference);

router.get('/match', LikeController.getMatch);

router.get('/matches', LikeController.getAllMatches);

module.exports = router;
