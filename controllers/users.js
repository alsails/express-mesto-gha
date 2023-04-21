const User = require('../models/users');
const NotFound = require('../error/NotFound');

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен некорректный _id' });
      } else if (err.status === 404) {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message: errorMessage });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен некорректный _id' });
      } else if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message: errorMessage });
      } else if (err.status === 404) {
        res.status(err.status).send({ message: err.message });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { avatar: req.body.avatar },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(400).send({ message: 'Введен некорректный _id' });
      } else if (err.status === 404) {
        res.status(err.status).send({ message: err.message });
      } else if (err.name === 'ValidationError') {
        const errorMessage = Object.values(err.errors).map((error) => error.message).join('; ');
        res.status(400).send({ message: errorMessage });
      } else {
        res.status(500).send({ message: 'Произошла ошибка' });
      }
    });
};
