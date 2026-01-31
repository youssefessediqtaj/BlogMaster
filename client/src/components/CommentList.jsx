import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getComments, addComment, reset } from '../redux/commentSlice';
import { User, Send } from 'lucide-react';
import moment from 'moment';
import { toast } from 'react-hot-toast';

const CommentList = ({ articleId }) => {
    const dispatch = useDispatch();
    const [message, setMessage] = useState('');

    const { user } = useSelector((state) => state.auth);
    const { comments, isLoading, isError, message: errorMsg } = useSelector(
        (state) => state.comments
    );

    useEffect(() => {
        if (isError) {
            toast.error(errorMsg);
        }
    }, [isError, errorMsg]);

    useEffect(() => {
        dispatch(getComments(articleId));

        return () => {
            dispatch(reset());
        };
    }, [articleId, dispatch]);

    const onSubmit = (e) => {
        e.preventDefault();
        if (!user) {
            toast.error('Please login to comment');
            return;
        }
        dispatch(addComment({ articleId, message }));
        setMessage('');
    };

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-4">Comments ({comments.length})</h3>

            {user && (
                <form onSubmit={onSubmit} className="mb-8">
                    <div className="flex gap-4">
                        <div className="flex-grow">
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write a comment..."
                                required
                                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
                                rows="3"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="self-end bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition-colors"
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </form>
            )}

            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-4 bg-gray-50 p-4 rounded-lg">
                        <div className="flex-shrink-0">
                            <div className="h-10 w-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <User className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <div className="flex-grow">
                            <div className="flex items-center justify-between mb-1">
                                <h4 className="text-sm font-bold text-gray-900">{comment.user?.username}</h4>
                                <span className="text-xs text-gray-500">
                                    {moment(comment.createdAt).fromNow()}
                                </span>
                            </div>
                            <p className="text-gray-700">{comment.message}</p>
                        </div>
                    </div>
                ))}
                {comments.length === 0 && (
                    <p className="text-gray-500 text-center">No comments yet. Be the first to comment!</p>
                )}
            </div>
        </div>
    );
};

export default CommentList;
