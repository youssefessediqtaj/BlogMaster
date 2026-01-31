import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import PrivateRoute from './components/PrivateRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateArticle from './pages/CreateArticle';
import EditArticle from './pages/EditArticle';
import ViewArticle from './pages/ViewArticle';
import Search from './pages/Search';

function App() {
    return (
        <>
            <Router>
                <div className="min-h-screen bg-gray-50">
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/article/:id" element={<ViewArticle />} />
                        <Route path="/search" element={<Search />} />

                        {/* Protected Routes */}
                        <Route path="/" element={<PrivateRoute />}>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/create-article" element={<CreateArticle />} />
                            <Route path="/edit-article/:id" element={<EditArticle />} />
                        </Route>
                    </Routes>
                </div>
            </Router>
            <Toaster position="top-center" />
        </>
    );
}

export default App;
