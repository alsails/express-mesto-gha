const router = require('express').Router();

const {
  validationLogin,
  validationCreateUser,
} = require('../middlewares/validations');

const {
  login,
  createUser,
} = require('../controllers/users');

router.post('/signin', validationLogin, login);
router.post('/signup', validationCreateUser, createUser);

module.exports = router;
