const router = require('express').Router();
const {
  getCards,
  delCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.get('/:cardId', delCard);
router.post('/', createCard);
router.put('/:cardId', likeCard);
router.delete('/:cardId', dislikeCard);

module.exports = router;
