import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-white shadow-lg">
        <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-gray-800">
                Marketplace
            </Link>
        
            <div className="flex items-center space-x-4">
                <Link to="/listings" className="text-gray-600 hover:text-gray-800">
                    Browse Listings
                </Link>

                {user ? (
                    <>
                    <Link to="/create-listing" className="text-gray-600 hover:text-gray-800">
                        Create Listing
                    </Link>
                    <Link to="/dashboard" className="text-gray-600 hover:text-gray-800">
                        Dashboard
                    </Link>
                    {user.role === "admin" && (
                        <Link to="/admin" className="text-gray-600 hover:text-gray-800">
                            Admin Dashboard
                            </Link>
                            )}
                    <span className="text-gray-600">Welcome, {user.name}</span>
                    <button
                        onClick={handleLogout}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                        Logout
                    </button>
                    </>
                ) : (
                    <>
                    <Link to="/login" className="text-gray-600 hover:text-gray-800">
                        Login
                    </Link>
                    <Link
                        to="/register"
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                    >
                        Register
                    </Link>
                    </>
                )}
            </div>
            </div>
        </div>
        </nav>
    );
};

export default Navbar;
                    