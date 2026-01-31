const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const generatePDF = (article, res) => {
    const doc = new PDFDocument();

    // Pipe PDF to response
    doc.pipe(res);

    // Title
    doc.fontSize(25).text(article.title, { align: 'center' });
    doc.moveDown();

    // Author & Date
    doc.fontSize(12).text(`By: ${article.author.username}`, { align: 'center' });
    doc.text(`Date: ${new Date(article.createdAt).toLocaleDateString()}`, { align: 'center' });
    doc.moveDown();

    // Thumbnail (if exists)
    if (article.thumbnail) {
        const imagePath = path.join(__dirname, '..', article.thumbnail);
        if (fs.existsSync(imagePath)) {
            doc.image(imagePath, {
                fit: [250, 250],
                align: 'center',
                valign: 'center'
            });
            doc.moveDown();
        }
    }

    // Content
    doc.fontSize(14).text(article.content, {
        align: 'justify'
    });

    doc.end();
};

module.exports = generatePDF;
