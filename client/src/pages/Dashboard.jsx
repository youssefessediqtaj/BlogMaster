import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getArticles, deleteArticle, reset } from '../redux/articleSlice';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import moment from 'moment';

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { articles, isLoading, isError, message } = useSelector(
        (state) => state.articles
    );

    useEffect(() => {
        if (isError) {
            console.log(message);
        }

        if (!user) {
            navigate('/login');
        }
    }, [user, navigate, isError, message]);

    useEffect(() => {
        dispatch(getArticles());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this article?')) {
            dispatch(deleteArticle(id));
        }
    };

    const userArticles = articles.filter((article) => article.author?._id === user?._id);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
                <Link
                    to="/create-article"
                    className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                    <Plus className="w-4 h-4 mr-2" />
                    Create New Article
                </Link>
            </div>

            <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                    {userArticles.length > 0 ? (
                        userArticles.map((article) => (
                            <li key={article._id}>
                                <div className="px-4 py-4 sm:px-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div className="ml-4">
                                                <p className="text-sm font-medium text-indigo-600 truncate">{article.title}</p>
                                                <p className="flex items-center text-sm text-gray-500">
                                                    {article.isDraft ? <span className="text-yellow-500 mr-2">[Draft]</span> : null}
                                                    Created on {moment(article.createdAt).format('MMMM Do YYYY')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex space-x-2">
                                            <Link
                                                to={`/edit-article/${article._id}`}
                                                className="p-2 text-gray-400 hover:text-indigo-600"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(article._id)}
                                                className="p-2 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 sm:flex sm:justify-between">
                                        <div className="sm:flex">
                                            <p className="flex items-center text-sm text-gray-500">
                                                Views: {article.views}
                                            </p>
                                            <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0 sm:ml-6">
                                                Likes: {article.likes.length}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        ))
                    ) : (
                        <li className="px-4 py-4 sm:px-6 text-center text-gray-500">
                            You haven't created any articles yet.
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;
