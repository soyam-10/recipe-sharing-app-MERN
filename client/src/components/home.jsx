// import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to the Recipe Sharing App</h1>
            <p className="text-lg text-gray-600 mb-8">Discover, create, and share your favorite recipes!</p>
            
            <div className="flex space-x-4 mb-8">
                <Link to="/login" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                    Login
                </Link>
                <Link to="/register" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                    Register
                </Link>
            </div>

            {/* Example of recipe showcase or categories */}
            <section className="w-full max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-700 mb-4">Featured Recipes</h2>
                {/* Replace this with dynamic content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">Recipe Title</h3>
                        <p className="text-gray-600 mb-4">Short description of the recipe...</p>
                        <button className="bg-indigo-500 text-white px-3 py-2 rounded hover:bg-indigo-600">
                            View Recipe
                        </button>
                    </div>
                    {/* Add more recipe cards here dynamically */}
                </div>
            </section>
        </div>
    );
};

export default Home;
