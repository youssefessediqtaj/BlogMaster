import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getArticleById, reset } from '../redux/articleSlice';
import { Calendar, User, Eye, Download, ArrowLeft, Heart } from 'lucide-react';
import moment from 'moment';
import CommentList from '../components/CommentList';
import axiosClient from '../utils/axiosClient';
import { toast } from 'react-hot-toast';

const ViewArticle = () => {
    const { id } = useParams();
    const dispatch = useDispatch();

    const { article, isLoading, isError, message } = useSelector(
        (state) => state.articles
    );
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
    }, [isError, message]);

    useEffect(() => {
        dispatch(getArticleById(id));

        return () => {
            dispatch(reset());
        };
    }, [id, dispatch]);

    const handleDownloadPDF = async () => {
        try {
            const response = await axiosClient.get(`/articles/${id}/pdf`, {
                responseType: 'blob',
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `article-${id}.pdf`);
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            toast.error('Failed to download PDF');
        }
    };

    const handleLike = async () => {
        if (!user) {
            toast.error('Please login to like');
            return;
        }
        try {
            await axiosClient.put(`/articles/${id}/like`);
            dispatch(getArticleById(id)); // Refresh to show new like count
        } catch (error) {
            toast.error('Failed to like article');
        }
    }

    if (isLoading || !article) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-700 mb-6">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Articles
            </Link>

            <article className="bg-white shadow rounded-lg overflow-hidden">
                {article.thumbnail && (
                    <img
                        src={`http://localhost:5001/uploads/${article.thumbnail.startsWith('uploads/') ? article.thumbnail.substring(8) : article.thumbnail}`}
                        alt={article.title}
                        className="w-full h-64 object-cover"
                    />
                )}

                <div className="p-8">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-4xl font-bold text-gray-900">{article.title}</h1>
                        <button
                            onClick={handleDownloadPDF}
                            className="flex items-center text-gray-600 hover:text-indigo-600 border border-gray-300 px-3 py-1 rounded-md transition-colors"
                        >
                            <Download className="w-4 h-4 mr-2" />
                            PDF
                        </button>
                    </div>

                    <div className="flex items-center text-sm text-gray-500 mb-8 space-x-6 border-b pb-6">
                        <span className="flex items-center">
                            <User className="w-4 h-4 mr-2" />
                            {article.author?.username}
                        </span>
                        <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {moment(article.createdAt).format('MMMM Do YYYY')}
                        </span>
                        <span className="flex items-center">
                            <Eye className="w-4 h-4 mr-2" />
                            {article.views} Views
                        </span>
                        <button onClick={handleLike} className={`flex items-center hover:text-red-500 transition-colors ${article.likes.includes(user?._id) ? 'text-red-500' : ''}`}>
                            <Heart className={`w-4 h-4 mr-2 ${article.likes.includes(user?._id) ? 'fill-current' : ''}`} />
                            {article.likes.length} Likes
                        </button>
                    </div>

                    <div className="prose max-w-none text-gray-800 mb-8 whitespace-pre-wrap">
                        {article.content}
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8">
                        {article.tags.map((tag, index) => (
                            <span key={index} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium">
                                #{tag}
                            </span>
                        ))}
                    </div>

                    <hr className="border-gray-200 mb-8" />

                    <CommentList articleId={id} />
                </div>
            </article>
        </div>
    );
};

export default ViewArticle;
