import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { getArticleById, createArticle, reset } from '../redux/articleSlice'; // We need an update action actually
import axiosClient from '../utils/axiosClient'; // Direct call for update or create thunk
import { toast } from 'react-hot-toast';

const EditArticle = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [currentThumbnail, setCurrentThumbnail] = useState('');

    const { title, content, tags } = formData;

    const { article, isLoading, isError, message } = useSelector(
        (state) => state.articles
    );
    const { user } = useSelector((state) => state.auth);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (!article || article._id !== id) {
            dispatch(getArticleById(id));
        } else {
            setFormData({
                title: article.title,
                content: article.content,
                tags: article.tags.join(', '),
            });
            setCurrentThumbnail(article.thumbnail);
        }
    }, [article, id, isError, message, dispatch]);

    const onChange = (e) => {
        setFormData((prevState) => ({
            ...prevState,
            [e.target.name]: e.target.value,
        }));
    };

    const onFileChange = (e) => {
        setThumbnail(e.target.files[0]);
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        const articleData = new FormData();
        articleData.append('title', title);
        articleData.append('content', content);
        articleData.append('tags', tags);
        if (thumbnail) {
            articleData.append('thumbnail', thumbnail);
        }

        try {
            await axiosClient.put(`/articles/${id}`, articleData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                }
            });
            toast.success('Article updated successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Failed to update article');
        }
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">Edit Article</h1>

            <form onSubmit={onSubmit} className="space-y-6 bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        name="title"
                        value={title}
                        onChange={onChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Thumbnail</label>
                    {currentThumbnail && (
                        <div className="mb-2">
                            <img src={`http://localhost:5001/uploads/${currentThumbnail.startsWith('uploads/') ? currentThumbnail.substring(8) : currentThumbnail}`} alt="Current" className="h-20 w-20 object-cover rounded" />
                        </div>
                    )}
                    <input
                        type="file"
                        onChange={onFileChange}
                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Content</label>
                    <textarea
                        name="content"
                        rows={10}
                        value={content}
                        onChange={onChange}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-gray-700">Tags (comma separated)</label>
                    <input
                        type="text"
                        name="tags"
                        value={tags}
                        onChange={onChange}
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Update Article
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditArticle;
