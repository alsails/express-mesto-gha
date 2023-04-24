const router = require('express').Router();

const {
  validationCardId,
  validationCreateCard,
} = require('../middlewares/validations');

const {
  getCards,
  delCard,
  createCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');

router.get('/', getCards);
router.delete('/:cardId', validationCardId, delCard);
router.post('/', validationCreateCard, createCard);
router.put('/:cardId/likes', validationCardId, likeCard);
router.delete('/:cardId/likes', validationCardId, dislikeCard);

module.exports = router;
