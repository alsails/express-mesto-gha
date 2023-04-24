const mongoose = require('mongoose');

const Card = require('../models/cards');
const NotFound = require('../error/NotFound');
const Forbidden = require('../error/Forbidden');
const BadRequest = require('../error/BadRequest');

const { CastError, ValidationError } = mongoose.Error;

module.exports.getCards = (req, res, next) => {
  Card.find({})
    .populate(['owner', 'likes'])
    .then((cards) => res.send({ data: cards }))
    .catch(next);
};

module.exports.delCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFound('Карточка с указанным _id не найдена');
    })
    .then((card) => {
      if (!card.owner.equals(req.user._id)) {
        next(new Forbidden('Невозможно удалить чужую карточку'));
      } else {
        card.deleteOne()
          .then(() => {
            res.send(card);
          })
          .catch(next);
      }
    })
    .catch((err) => {
      if (err.name instanceof CastError) {
        next(new BadRequest('Введен некорректный _id'));
      }
      next(err);
    });
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;

  Card.create({ name, link, owner: req.user._id })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name instanceof ValidationError) {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        next(new BadRequest(errorMessage));
        return;
      } next(err);
    });
};

module.exports.likeCard = (req, res, next) => {
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
      if (err.name instanceof CastError) {
        next(new BadRequest('Введен некорректный _id'));
      } if (err.name instanceof ValidationError) {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        next(new BadRequest(errorMessage));
      } next(err);
    });
};

module.exports.dislikeCard = (req, res, next) => {
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
      if (err.name instanceof CastError) {
        next(new BadRequest('Введен некорректный _id'));
      } if (err.name instanceof ValidationError) {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        next(new BadRequest(errorMessage));
      } next(err);
    });
};
