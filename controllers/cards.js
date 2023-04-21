const Card = require('../models/cards');
const NotFound = require('../error/NotFound');

module.exports.getCards = (req, res) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.delCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.status === 404) {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
      if (err.name === 'ValidationError') {
        res.status(400).send({ errorMessage });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
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
      const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
      if (err.status === 404) {
        res.status(err.status).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ errorMessage });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
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
      const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
      if (err.status === 404) {
        res.status(err.status).send({ message: err.message });
      }
      if (err.name === 'ValidationError') {
        res.status(400).send({ errorMessage });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
