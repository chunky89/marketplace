import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
    const { user } = useAuth();
    const isAdmin = user?.role === "admin";

    const [orders, setOrders] = useState([]);
    const [listings, setListings] = useState([]);
    const [users, setUsers] = useState([]);
    const [activeTab, setActiveTab] = useState("orders");

    useEffect(() => {
        const loadData = () => {
            const allOrders = JSON.parse(localStorage.getItem("orders")) || [];
            const allListings = JSON.parse(localStorage.getItem("listings")) || [];

            if (isAdmin) {
                setOrders(allOrders);
                setListings(allListings);
                const allUsers = JSON.parse(localStorage.getItem("users")) || [];
                setUsers(allUsers.filter(u => u.role !== "admin"));
            } else {
                setOrders(allOrders.filter(o => o.buyerId === user?.id || o.sellerId === user?.id));
                setListings(allListings.filter(l => l.sellerId === user?.id));
            }
        };

        loadData();
    }, [isAdmin, user?.id]);

    const handleMarkAsShipped = (orderId) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: "shipped" } : order
        );

        setOrders(updatedOrders);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
    };

    const handleCancelOrder = (orderId, itemId) => {
        const updatedOrders = orders.map(order =>
            order.id === orderId ? { ...order, status: "cancelled" } : order
        );
        const updatedListings = listings.map(listing =>
            listing.id === itemId ? { ...listing, sold: false } : listing
        );

        setOrders(updatedOrders);
        setListings(updatedListings);
        localStorage.setItem("orders", JSON.stringify(updatedOrders));
        localStorage.setItem("listings", JSON.stringify(updatedListings));
    };

    const handleDeleteListing = (listingId) => {
        const updatedListings = listings.filter(listing => listing.id !== listingId);
        setListings(updatedListings);
        localStorage.setItem("listings", JSON.stringify(updatedListings));
    };

    const stats = {
        totalOrders: orders.length, 
        pendingOrders: orders.filter(order => order.status === "pending").length,
        totalRevenue: orders
            .filter(order => order.status !== "cancelled")
            .reduce((total, order) => total + order.total, 0),
        activeListings: listings.filter(listing => !listing.sold).length,
    };

    return (    
        <div>
            <h1 className="text-3xl font-bold mb-6">{isAdmin ? "Admin Dashboard" : "My Dashboard"}</h1>
            {/* Stats Section */}
            <div className="grid md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white p-4 rounded-lg shadow">
              <h3 className="text-lg font-semibold">Total Orders</h3>
              <p className="text-2xl">{stats.totalOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Pending Orders</h3>
                <p className="text-2xl">{stats.pendingOrders}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Total Revenue</h3>
                <p className="text-2xl">£{stats.totalRevenue.toFixed(2)}</p>
            </div>
            <div className="bg-white p-4 rounded-lg shadow">
                <h3 className="text-lg font-semibold">Active Listings</h3>
                <p className="text-2xl">{stats.activeListings}</p>
            </div>
            </div>
            {/* Orders Tab */}
            <div className="mb-8">
                <div className="flex space-x-4 mb-4">
                    <button
                    onClick={() => setActiveTab("orders")}
                    className={`px-4 py-2 rounded ${activeTab === "orders" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                    Orders
                    </button>
                    <button
                    onClick={() => setActiveTab("listings")}
                    className={`px-4 py-2 rounded ${activeTab === "listings" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                    >
                        Listings
                    </button>
                    {isAdmin && (
                        <button
                        onClick={() => setActiveTab("users")}
                        className={`px-4 py-2 rounded ${activeTab === "users" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"}`}
                        >
                            Users
                        </button>
                    )}
                </div>
                <div>

                                {activeTab === "orders" && (
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <table className="min-w-full table-auto">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Order ID</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Item</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Buyer</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Seller</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Total</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Payment</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Delivery</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>
                                                </tr>   
                                            </thead>
                                            <tbody className="bg-white divide-y divide-gray-200">
                                                {orders.map(order => (
                                                    <tr key={order.id}>
                                                        <td className="px-4 py-2 whitespace-nowrap">{order.id}</td>
                                                        <td className="px-4 py-2 whitespace-nowrap">{order.itemTitle}</td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p>{order.buyerName}</p>
                                                                {isAdmin && (
                                                                    <>
                                                                        <p className="text-sm text-gray-500">{order.buyerEmail || "No email saved"}</p>
                                                                        <p className="text-sm text-gray-500">{order.buyerPhone || "No phone saved"}</p>
                                                                        <p className="text-sm text-gray-500">{order.buyerAddress || "No address saved"}</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p>{order.sellerName}</p>
                                                                {isAdmin && (
                                                                    <>
                                                                        <p className="text-sm text-gray-500">{order.sellerEmail || "No email saved"}</p>
                                                                        <p className="text-sm text-gray-500">{order.sellerPhone || "No phone saved"}</p>
                                                                        <p className="text-sm text-gray-500">{order.sellerAddress || "No address saved"}</p>
                                                                    </>
                                                                )}
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">£{order.total}</td>
                                                        <td className="px-6 py-4">
                                                            <span className="px-2 rounded bg-green-100 text-green-800 text-xs font-semibold">
                                                                {order.paymentStatus}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div>
                                                                <p className="text-sm">Due: {new Date(order.deliveryDeadline).toLocaleDateString()}</p>
                                                                <p className="text-sm text-gray-500">Buyer city: {order.buyerCity || "N/A"}</p>
                                                                <p className="text-sm text-gray-500">Seller city: {order.sellerCity || "N/A"}</p>
                                                            </div>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <span className={`px-2 inline-flex text-xs 
                                                            leading-5 font-semibold rounded-full ${
                                                                order.status === "pending"
                                                                    ? "bg-yellow-100 text-yellow-800"
                                                                    : order.status === "cancelled"
                                                                        ? "bg-red-100 text-red-800"
                                                                        : "bg-green-100 text-green-800"
                                                            }`}>
                                                                {order.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4">
                                                            <div className="space-y-2">
                                                                {(isAdmin || order.sellerId === user?.id) && order.status === "pending" && (
                                                                    <button
                                                                        onClick={() => handleMarkAsShipped(order.id)}
                                                                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                                                    >
                                                                        Mark as Shipped
                                                                    </button>
                                                                )}
                                                                {(isAdmin || order.buyerId === user?.id || order.sellerId === user?.id) && order.status === "pending" && (
                                                                    <button
                                                                        onClick={() => handleCancelOrder(order.id, order.itemId)}
                                                                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                                    >
                                                                        Cancel Order
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}

                                {/* Listings Tab */ }
                                {activeTab === "listings" && (
                                    <div className="bg-white rounded-lg shadow p-4">
                                        <table className="min-w-full table-auto">
                                            <thead className="bg-gray-50">
                                                <tr>
                                               <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Listing ID</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Title</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Price</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">City</th>        
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Status</th>
                                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Actions</th>     
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {listings.map(listing => (
                                    <tr key={listing.id}>
                                        <td className="px-6 py-4">{listing.id}</td>
                                        <td className="px-6 py-4">{listing.title}</td>
                                        <td className="px-6 py-4">£{listing.price}</td>
                                        <td className="px-6 py-4">{listing.city}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                listing.sold ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                                            }`}>
                                                {listing.sold ? "Sold" : "Active"}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isAdmin && (
                                                <button
                                                    onClick={() => handleDeleteListing(listing.id)}
                                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                >
                                                    Delete
                                                </button>
                                            )}
                                        </td>   
                                    </tr>
                                ))}
                            </tbody>    
                        </table>
                    </div>
                )}

                            {/* Users Tab */}
                            {isAdmin && activeTab === "users" && (
                                <div className="bg-white rounded-lg shadow p-4">
                                    <table className="min-w-full table-auto">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">User ID</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Name</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Email</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Phone</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">City</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Address</th>
                                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Joined</th>
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {users.map(user => (
                                                <tr key={user.id}>
                                                    <td className="px-6 py-4">{user.id}</td>
                                                    <td className="px-6 py-4">{user.name}</td>
                                                    <td className="px-6 py-4">{user.email}</td>
                                                    <td className="px-6 py-4">{user.phone}</td>
                                                    <td className="px-6 py-4">{user.city}</td>
                                                    <td className="px-6 py-4">{user.address}</td>
                                                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            );
        };
                
        export default Dashboard;
