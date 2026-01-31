import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles, reset } from '../redux/articleSlice';
import ArticleCard from '../components/ArticleCard';

const Home = () => {
    const dispatch = useDispatch();
    const { articles, isLoading, isError, message } = useSelector(
        (state) => state.articles
    );

    useEffect(() => {
        if (isError) {
            console.log(message);
        }
    }, [isError, message]);

    useEffect(() => {
        dispatch(getArticles());

        return () => {
            dispatch(reset());
        };
    }, [dispatch]);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen">Loading...</div>;
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
                    Welcome to BlogMaster PRO
                </h1>
                <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
                    Discover stories, thinking, and expertise from writers on any topic.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {articles.length > 0 ? (
                    articles.map((article) => (
                        <ArticleCard key={article._id} article={article} />
                    ))
                ) : (
                    <p className="col-span-full text-center text-gray-500">No articles found.</p>
                )}
            </div>
        </div>
    );
};

export default Home;
