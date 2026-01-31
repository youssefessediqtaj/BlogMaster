import { Link } from 'react-router-dom';
import { Calendar, User, Eye, Heart } from 'lucide-react';
import moment from 'moment';

const ArticleCard = ({ article }) => {
    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
            {article.thumbnail && (
                <img
                    src={`http://localhost:5001/uploads/${article.thumbnail.startsWith('uploads/') ? article.thumbnail.substring(8) : article.thumbnail}`}
                    alt={article.title}
                    className="w-full h-48 object-cover"
                />
            )}
            <div className="p-6">
                <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span className="flex items-center mr-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        {moment(article.createdAt).format('MMM Do YY')}
                    </span>
                    <span className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {article.author?.username}
                    </span>
                </div>
                <Link to={`/article/${article._id}`}>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-indigo-600 transition-colors">
                        {article.title}
                    </h3>
                </Link>
                <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.content.substring(0, 150)}...
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-4">
                    <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-1" />
                            {article.views}
                        </span>
                        <span className="flex items-center">
                            <Heart className="w-4 h-4 mr-1" />
                            {article.likes.length}
                        </span>
                    </div>
                    <div className="flex flex-wrap gap-1">
                        {article.tags.slice(0, 2).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                #{tag}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleCard;
