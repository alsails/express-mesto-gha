const router = require('express').Router();

const {
  validationId,
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
router.delete('/:cardId', validationId, delCard);
router.post('/', validationCreateCard, createCard);
router.put('/:cardId/likes', validationId, likeCard);
router.delete('/:cardId/likes', validationId, dislikeCard);

module.exports = router;
