const Comment = require('../models/Comment');
const Article = require('../models/Article');

// @desc    Get comments for an article
// @route   GET /api/comments/:articleId
// @access  Public
const getComments = async (req, res) => {
    try {
        const comments = await Comment.find({ article: req.params.articleId })
            .populate('user', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json(comments);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add a comment
// @route   POST /api/comments/:articleId
// @access  Private
const addComment = async (req, res) => {
    try {
        const { message } = req.body;
        const articleId = req.params.articleId;

        const article = await Article.findById(articleId);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const comment = await Comment.create({
            message,
            article: articleId,
            user: req.user.id,
        });

        const populatedComment = await Comment.findById(comment._id).populate('user', 'username');

        res.status(201).json(populatedComment);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getComments,
    addComment,
};
