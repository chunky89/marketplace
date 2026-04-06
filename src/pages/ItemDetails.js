import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ItemDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [purchasing, setPurchasing] = useState(false);

    useEffect(() => {
        const listings = JSON.parse(localStorage.getItem("listings")) || [];
        const foundItem = listings.find((listing) => listing.id === Number(id));
        setItem(foundItem);
        setLoading(false);
    }, [id]);

    const handlePurchase = () => {
        if (!user) {
            navigate("/login");
            return;
        }

        setPurchasing(true);

        // Simulate purchase process
        setTimeout(() => {
        // Mark item as sold
        const listings = JSON.parse(localStorage.getItem("listings")) || [];
        const updatedListings = listings.map((listing) =>
            listing.id === id ? { ...listing, sold: true } : listing
        );
        localStorage.setItem("listings", JSON.stringify(updatedListings));

                // Create order
                const orders = JSON.parse(localStorage.getItem("orders")) || [];
                const newOrder = {
                    id: Date.now().toString(),
                    itemId: item.id,
                    itemTitle: item.title,
                    buyerId: user.id,
                    buyerName: user.name,
                    buyerPhone: user.phone,
                    buyerAddress: user.address,
                    sellerId: item.sellerId,
                    sellerName: item.sellerName,
                    price: item.price,
                    deliveryFee: 3.00,
                    total: item.price + 3.00,
                    status: "pending",
                    paymentStatus: "completed",
                    createAt: new Date().toISOString(),
                    deliveryDeadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
                };
                orders.push(newOrder);
                localStorage.setItem("orders", JSON.stringify(orders));
        
                setPurchasing(false);
                navigate("/listings", { state: { message: "Purchase successful! Item will be delivered within 24 hours." } });
                }, 2000);
            };

        
            if (loading) {
                return <div className="text-center mt-8">Loading item details...</div>;
            }

            if (!item) {
                return <div className="text-center mt-8">Item not found.</div>;
            }
        
            return (
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow overflow-hidden">
                        {item.photo && (
                            <img
                            src={item.photo}
                            alt={item.title}
                            className="w-full h-64 object-cover"
                            />
                        )}
                    
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
                    <p className="text-gray-700 mb-4">{item.description}</p>
                    </div>

                    <div className="border-t border-b py-4 mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-600">Price:</span>
                            <span className="text-gray-900 font-bold">${item.price}</span>
                        </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Delivery Fee:</span>
                        <span className="text-lg">$3.00</span>
                    </div>
                    <div className="flex justify-between items-center font-bold">
                        <span className="text-gray-900 text-xl">Total:</span>
                        <span className="text-gray-900 text-xl">${item.price + 3.00}</span>
                    </div>
                </div>

                <div className="p-6">
                    <h3 className="text-xl font-bold mb-4">Seller Information</h3>
                    <p className="text-gray-700">Name: {item.sellerName}</p>
                    <p className="text-gray-700">City: {item.sellerCity || item.city}</p>
                </div>

                {item.sold ? (
                    <div className="text-center p-4 bg-gray-100 rounded">
                        <h3 className="text-xl font-bold mb-4">Status</h3>
                        <p className="text-gray-700">This item has been sold.</p>
                    </div>
                ) : (
                    <div className="p-6">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={handlePurchase}
                            disabled={purchasing}
                        >
                            {purchasing ? "Processing..." : "Purchase"}
                        </button>
                    </div>
                )}

                {!user && (
                    <p className="text-center text-gray-600 mt-4">
                        Please <span className="text-blue-500">login</span> to purchase this item.
                    </p>
                )}
                </div>
            </div>
        );
    };
    
    export default ItemDetails;
            
