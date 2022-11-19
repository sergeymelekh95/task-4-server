const Router = require('express');
const router = new Router();
const controller = require('../controllers/usersController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/users', authMiddleware, controller.getUsers);
router.delete('/users/delete', authMiddleware, controller.deleteUsers);
router.put('/users/update', authMiddleware, controller.changeStatus);

module.exports = router;
