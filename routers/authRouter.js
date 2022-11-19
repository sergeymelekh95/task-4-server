const Router = require('express');
const router = new Router();
const controller = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/signup', controller.signUp);
router.post('/signin', authMiddleware, controller.signIn);

module.exports = router;
