const router = require('express').Router();

const {
  validationId,
  validationUpdateUserInfo,
  validationUpdateAvatar,
} = require('../middlewares/validations');

const {
  getUsers,
  getUser,
  getUserById,
  updateUserInfo,
  updateAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/me', getUser);
router.get('/:userId', validationId, getUserById);
router.patch('/me', validationUpdateUserInfo, updateUserInfo);
router.patch('/me/avatar', validationUpdateAvatar, updateAvatar);

module.exports = router;
