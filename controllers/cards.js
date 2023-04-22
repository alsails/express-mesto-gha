const Card = require('../models/cards');
const NotFound = require('../error/NotFound');

const NOT_FOUND = 404;
const BAD_REQUEST = 400;
const INTERNET_SERVER_ERROR = 500;

module.exports.getCards = (req, res) => {
  Card.find({})
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(INTERNET_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
};

module.exports.delCard = (req, res) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    // eslint-disable-next-line consistent-return
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        res.status(401).send({ message: 'Невозможно удалить чужую карточку' });
      } else {
        Card.deleteOne(card)
          .then(() => {
            res.send(card);
          })
          .catch(() => res.status(INTERNET_SERVER_ERROR).send({ message: 'Произошла ошибка' }));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Введен некорректный _id' });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(INTERNET_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(BAD_REQUEST).send({ message: errorMessage });
      } else {
        res.status(INTERNET_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Введен некорректный _id' });
      } else if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(BAD_REQUEST).send({ message: errorMessage });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(INTERNET_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true },
  )
    .populate(['owner', 'likes'])
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(BAD_REQUEST).send({ message: 'Введен некорректный _id' });
      } else if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(BAD_REQUEST).send({ message: errorMessage });
      } else if (err.status === NOT_FOUND) {
        res.status(NOT_FOUND).send({ message: err.message });
      } else {
        res.status(INTERNET_SERVER_ERROR).send({ message: 'Произошла ошибка' });
      }
    });
};
