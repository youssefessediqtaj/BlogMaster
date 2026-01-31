import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getArticles, reset } from '../redux/articleSlice';
import ArticleCard from '../components/ArticleCard';
import { Search as SearchIcon } from 'lucide-react';

const Search = () => {
    const dispatch = useDispatch();
    const [searchTerm, setSearchTerm] = useState('');
    const [searchTag, setSearchTag] = useState('');

    const { articles, isLoading, isError, message } = useSelector(
        (state) => state.articles
    );

    useEffect(() => {
        // Initial load or when filters change
        const queryParams = new URLSearchParams();
        if (searchTerm) queryParams.append('search', searchTerm);
        if (searchTag) queryParams.append('tag', searchTag);

        dispatch(getArticles(queryParams.toString()));

        return () => {
            // Don't reset here if we want to keep results when navigating back? 
            // Actually reset is good to clear errors.
            // dispatch(reset());
        };
    }, [searchTerm, searchTag, dispatch]);

    const handleSearch = (e) => {
        e.preventDefault();
        // Search is triggered by useEffect dependency
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Search Articles</h1>
                <form onSubmit={handleSearch} className="flex gap-4 flex-wrap">
                    <div className="flex-grow relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title or content..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div className="w-full sm:w-64">
                        <input
                            type="text"
                            placeholder="Filter by tag..."
                            value={searchTag}
                            onChange={(e) => setSearchTag(e.target.value)}
                            className="block w-full px-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                </form>
            </div>

            {isLoading ? (
                <div className="flex justify-center">Loading...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {articles.length > 0 ? (
                        articles.map((article) => (
                            <ArticleCard key={article._id} article={article} />
                        ))
                    ) : (
                        <p className="col-span-full text-center text-gray-500">No articles found.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Search;
