import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Home = () => {
    const { user } = useAuth();
    return (
        <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Welcome to the Marketplace</h1>
            <p className="text-lg mb-6">Buy and sell item in your city with 24 hours delivery</p>
            
        <div className="flex justify-center space-x-4 mb-12">
            <Link
                to="/listings"
                className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
            >
                Browse Listings
            </Link>
            {!user && (
                <Link 
                    to="/register"
                    className="bg-green-500 text-white px-6 py-3 rounded hover:bg-green-600"
                >
                    Start Selling
                </Link>
            )}
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w4x1 mx-auto">
                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-2xl font-bold mb-2">Easy to Use</h2>
                    <p>
                        Browse and search listing without creating an account. Create an account to start selling your items in just a few clicks.
                    </p>
                </div>
        
            <div className="bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-2">Safe and Secure</h2>
                <p>
                    Get your items delivered within 24 hours, for a fixed £3 delivery fee. We handle all payments securely through our platform, ensuring a safe transaction for both buyers and sellers.
                </p>
            </div>
            </div>
        </div>
    );
};

export default Home;
        

