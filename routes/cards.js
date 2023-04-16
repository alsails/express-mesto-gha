const router = require('express').Router();
const { getCards, delCard, createCard } = require('../controllers/cards');

router.get('/', getCards);
router.get('/:userId', delCard);
router.post('/', createCard);

module.exports = router;
