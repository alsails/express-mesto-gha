const User = require('../models/users');

// const SERVER_ERROR = 500;

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(404).send({ message: 'Пользовтель не найден' }));
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(400).send({ message: 'Переданы некоректные данные' }));
};

module.exports.updateUserInfo = (req, res) => {
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    {
      name: req.body.name,
      about: req.body.about,
    },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => res.send(user))
    .catch(() => res.status(400).send({ message: 'Переданы некоректные данные' }));
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
    .then((user) => res.send(user))
    .catch(() => res.status(400).send({ message: 'Переданы некоректные данные' }));
};
