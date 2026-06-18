const express = require('express');
const router  = express.Router();
const { protect } = require('../middleware/auth');
const authorize   = require('../middleware/authorize');
const { getUsers, getUserById, updateUser, deleteUser } = require('../controllers/userController');

router.get('/',    protect, getUsers);
router.get('/:id', protect, getUserById);
router.put('/:id', protect, updateUser);
router.delete('/:id', protect, authorize('admin'), deleteUser);

module.exports = router;
