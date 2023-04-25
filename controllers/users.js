const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/users');
const NotFound = require('../error/NotFound');
const BadRequest = require('../error/BadRequest');
const Conflict = require('../error/Conflict');

const { CastError, ValidationError } = mongoose.Error;

function findUserById(id) {
  return User.findById(id)
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    });
}

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  findUserById(req.user._id)
    .then((user) => res.send({ data: user }))
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  findUserById(req.params.userId)
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name instanceof CastError) {
        next(new BadRequest('Введен некорректный _id'));
      } else next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => {
      const userInfo = user.toObject();
      delete userInfo.password;
      res.send({
        data: userInfo,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(new Conflict('Введеный email уже зарегистрирован'));
        return;
      }
      if (err.name instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        next(new BadRequest(errorMessage));
      } else next(err);
    });
};

function updateInfo(req, res, next) {
  const userId = req.user._id;
  const { name, about } = req.body;
  const { avatar } = req.body;
  const info = 'name' in req.body && 'about' in req.body ? { name, about } : { avatar };
  return User.findByIdAndUpdate(
    userId,
    info,
    {
      new: true,
      runValidators: true,
    },
  )
    .orFail(() => {
      throw new NotFound('Пользователь с указанным _id не найден');
    })
    .then((user) => res.send(user))
    .catch((err) => {
      if (err.name instanceof ValidationError) {
        const errorMessage = Object.values(err.errors)
          .map((error) => error.message)
          .join('; ');
        next(new BadRequest(errorMessage));
      } else next(err);
    });
}

module.exports.updateUserInfo = (req, res, next) => {
  updateInfo(req, res, next);
};

module.exports.updateAvatar = (req, res, next) => {
  updateInfo(req, res, next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000 * 7),
        httpOnly: true,
      });
      const userInfo = user.toObject();
      delete userInfo.password;
      res.send({
        data: userInfo,
      });
    })
    .catch(next);
};
