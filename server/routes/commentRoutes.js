const express = require('express');
const router = express.Router();
const { getComments, addComment } = require('../controllers/commentController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/:articleId')
    .get(getComments)
    .post(protect, addComment);

module.exports = router;
