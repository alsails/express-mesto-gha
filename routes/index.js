const router = require('express').Router();

const NotFound = require('../error/NotFound');
const auth = require('../middlewares/auth');

router.use('/', require('./auth'));

router.use(auth);

router.use('/users', require('./users'));
router.use('/cards', require('./cards'));

router.use(() => {
  throw new NotFound('Страница не найдена');
});

module.exports = router;
