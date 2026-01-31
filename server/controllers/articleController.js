const Article = require('../models/Article');
const User = require('../models/User');
const generatePDF = require('../utils/generatePDF');
const fs = require('fs');
const path = require('path');

// @desc    Get all articles
// @route   GET /api/articles
// @access  Public
const getArticles = async (req, res) => {
    try {
        const { search, tag } = req.query;
        let query = { isDraft: false };

        if (search) {
            query.$text = { $search: search };
        }

        if (tag) {
            query.tags = tag;
        }

        const articles = await Article.find(query)
            .populate('author', 'username')
            .sort({ createdAt: -1 });

        res.status(200).json(articles);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get single article
// @route   GET /api/articles/:id
// @access  Public
const getArticleById = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Increment views
        article.views += 1;
        await article.save();

        res.status(200).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create article
// @route   POST /api/articles
// @access  Private
const createArticle = async (req, res) => {
    try {
        const { title, content, tags } = req.body;
        let thumbnail = '';

        if (req.file) {
            thumbnail = req.file.path;
        }

        const article = await Article.create({
            title,
            content,
            tags: tags ? tags.split(',').map(tag => tag.trim()) : [],
            thumbnail,
            author: req.user.id,
        });

        res.status(201).json(article);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update article
// @route   PUT /api/articles/:id
// @access  Private
const updateArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the article author
        if (article.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        const { title, content, tags } = req.body;

        article.title = title || article.title;
        article.content = content || article.content;
        if (tags) {
            article.tags = tags.split(',').map(tag => tag.trim());
        }

        if (req.file) {
            // Delete old image if exists
            if (article.thumbnail) {
                const oldPath = path.join(__dirname, '..', article.thumbnail);
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath);
                }
            }
            article.thumbnail = req.file.path;
        }

        const updatedArticle = await article.save();
        res.status(200).json(updatedArticle);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete article
// @route   DELETE /api/articles/:id
// @access  Private
const deleteArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);

        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Check for user
        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        // Make sure the logged in user matches the article author
        if (article.author.toString() !== req.user.id) {
            return res.status(401).json({ message: 'User not authorized' });
        }

        // Delete image if exists
        if (article.thumbnail) {
            const imagePath = path.join(__dirname, '..', article.thumbnail);
            if (fs.existsSync(imagePath)) {
                fs.unlinkSync(imagePath);
            }
        }

        await article.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Auto save draft
// @route   POST /api/articles/draft
// @access  Private
const autoSaveDraft = async (req, res) => {
    try {
        const { title, content, tags, id } = req.body;

        let article;
        if (id) {
            article = await Article.findById(id);
            if (article && article.author.toString() === req.user.id) {
                article.title = title;
                article.content = content;
                article.tags = tags ? tags.split(',') : [];
                article.isDraft = true;
                await article.save();
                return res.status(200).json(article);
            }
        }

        // Create new draft if no ID or not found
        article = await Article.create({
            title: title || 'Untitled Draft',
            content: content || '',
            tags: tags ? tags.split(',') : [],
            author: req.user.id,
            isDraft: true
        });

        res.status(201).json(article);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Generate PDF
// @route   GET /api/articles/:id/pdf
// @access  Public
const getArticlePDF = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id).populate('author', 'username');
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        const filename = `article-${article._id}.pdf`;
        res.setHeader('Content-disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-type', 'application/pdf');

        generatePDF(article, res);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// @desc    Like article
// @route   PUT /api/articles/:id/like
// @access  Private
const likeArticle = async (req, res) => {
    try {
        const article = await Article.findById(req.params.id);
        if (!article) {
            return res.status(404).json({ message: 'Article not found' });
        }

        // Check if article has already been liked
        if (article.likes.includes(req.user.id)) {
            // Unlike
            article.likes = article.likes.filter(id => id.toString() !== req.user.id);
        } else {
            // Like
            article.likes.push(req.user.id);
        }

        await article.save();
        res.status(200).json(article.likes);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getArticles,
    getArticleById,
    createArticle,
    updateArticle,
    deleteArticle,
    autoSaveDraft,
    getArticlePDF,
    likeArticle
};
