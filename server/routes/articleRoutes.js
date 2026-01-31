const express = require('express');
const router = express.Router();
const {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    autoSaveDraft,
    getArticlePDF,
    likeArticle
} = require('../controllers/articleController');
const { protect } = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');

router.route('/')
    .get(getArticles)
    .post(protect, upload.single('thumbnail'), createArticle);

router.post('/draft', protect, autoSaveDraft);

router.route('/:id')
    .get(getArticleById)
    .put(protect, upload.single('thumbnail'), updateArticle)
    .delete(protect, deleteArticle);

router.get('/:id/pdf', getArticlePDF);
router.put('/:id/like', protect, likeArticle);

module.exports = router;
