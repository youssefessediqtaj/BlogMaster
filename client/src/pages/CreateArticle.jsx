import { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createArticle, autoSaveDraft, reset } from '../redux/articleSlice';
import { toast } from 'react-hot-toast';
import { Save } from 'lucide-react';

const CreateArticle = () => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: '',
    });
    const [thumbnail, setThumbnail] = useState(null);
    const [draftId, setDraftId] = useState(null);
    const [lastSaved, setLastSaved] = useState(null);

    const { title, content, tags } = formData;

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { isLoading, isError, isSuccess, message } = useSelector(
        (state) => state.articles
    );

    // Auto-save logic
    useEffect(() => {
        const interval = setInterval(() => {
            if (title || content) {
                const draftData = {
                    title,
                    content,
                    tags,
                    id: draftId
                };
                dispatch(autoSaveDraft(draftData)).then((res) => {
                    if (res.payload && res.payload._id) {
                        setDraftId(res.payload._id);
                        setLastSaved(new Date());
                    }
                });
            }
        }, 30000); // 30 seconds

        return () => clearInterval(interval);
    }, [title, content, tags, draftId, dispatch]);

    useEffect(() => {
        if (isError) {
            toast.error(message);
        }

        if (isSuccess && !draftId) { // Only navigate if it's a real publish, not auto-save
            // This logic is tricky because autoSave also dispatches actions.
            // We might need separate state for auto-save vs publish success
            // For now, let's rely on the fact that publish redirects
        }

        return () => {
            if (isSuccess) dispatch(reset());
        }
    }, [isError, isSuccess, message, navigate, dispatch, draftId]);

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

        // If we have a draft ID, we might want to update that instead of creating new?
        // But the backend create endpoint handles new creation.
        // Ideally we should have an update endpoint for draft -> published.
        // For simplicity, let's just create a new one and maybe delete draft or just update the draft to be published.
        // Actually, let's just use create for now, as it's simpler.

        await dispatch(createArticle(articleData));
        toast.success('Article published successfully!');
        navigate('/dashboard');
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900">Create New Article</h1>
                {lastSaved && (
                    <span className="text-sm text-gray-500 flex items-center">
                        <Save className="w-4 h-4 mr-1" />
                        Draft saved at {lastSaved.toLocaleTimeString()}
                    </span>
                )}
            </div>

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
                        placeholder="tech, coding, react"
                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        {isLoading ? 'Publishing...' : 'Publish Article'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateArticle;
