const jwt = require('jsonwebtoken');
const NotAuthenticated = require('../error/NotAuthenticated');

// eslint-disable-next-line consistent-return
module.exports = (req, res, next) => {
  const authorization = req.cookies.jwt;

  if (!authorization) {
    next(new NotAuthenticated('Необходима авторизация'));
    return;
  }

  const token = authorization.replace();
  let payload;

  try {
    payload = jwt.verify(token, 'some-secret-key');
  } catch (err) {
    next(new NotAuthenticated('Необходима авторизация'));
  }

  req.user = payload;

  next();
};
