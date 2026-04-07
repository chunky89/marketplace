import React, {useState, useEffect} from "react";
import {Link} from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Listings = () => {
    const [listings, setListings] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    const normalizeCity = (value) => (value || "").toString().trim().toLowerCase();

useEffect(() => {
    // Simulate fetching listings from an API
    const allListings = JSON.parse(localStorage.getItem("listings")) || [];
    // Guests can browse only unsold listings. Registered users can browse same-city listings and see sold status.
    const userCity = normalizeCity(user?.city);
    const filteredListings = allListings.filter((listing) => {
        if (!user) {
            return !listing.sold;
        }

        const listingCity = normalizeCity(listing.city);
        const isSameCity = listingCity === userCity;
        const isOwnListing = listing.sellerId === user.id;
        return isSameCity || isOwnListing;
    });

    setListings(filteredListings);
    setLoading(false);
}, [user]);

const filteredListings = listings.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.description.toLowerCase().includes(searchTerm.toLowerCase())
);

if (loading) {
    return <div className="text-center mt-8">Loading listings...</div>;
}

return (
    <div>
        <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-3xl font-bold mb-2">Browse Items</h1>
                    {user && (
                        <p className="text-gray-600">Showing items in <span className="font-semibold">{user.city}</span></p>
                    )}
                </div>
                {user && (
                    <Link 
                        to="/create-listing"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        + Create Listing
                    </Link>
                )}
            </div>
            <input
                type="text"
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
        {filteredListings.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-600 mb-4">No listings found.</p>
                {user ? (
                    <p className="text-gray-500 text-sm">Be the first to create a listing in {user.city}!</p>
                ) : (
                    <p className="text-gray-500 text-sm">Log in to browse listings in your city</p>
                )}
            </div>
        ) : (
            <div className="grid md:grid-cols-3 gap-8">
                {filteredListings.map((listing) => (
                    <div
                    key={listing.id}
                    className="bg-white rounded-lg shadow overflow-hidden hover:shadow-lg transition"
        >
            {listing.photo && (
                <img
                src={listing.photo}
                alt={listing.title}
                className="w-full h-48 object-cover"
                />
            )}
            <div className="p-4">
                <h2 className="text-xl font-bold mb-2">{listing.title}</h2>
                <p className="text-gray-600 mb-2 line-clamp-2">{listing.description}</p>
            <div className="flex justify-between items-center mb-3">
                  <span className="text-xl font-bold text-blue-600">
                                        £{listing.price}
                  </span>
                  <span className="text-sm text-gray-500">{listing.city}</span>
                </div>
                {listing.sold && (
                    <p className="text-xs font-semibold text-amber-700 mb-3">Sold</p>
                )}
                <div className="flex justify-between items-center">
                    <Link
                        to={`/item/${listing.id}`}
                        className="text-blue-500 text-sm hover:underline"
                    >
                        View Details
                    </Link>
                    {!listing.sold && (!user || listing.sellerId !== user.id) && (
                        <Link
                            to={`/item/${listing.id}`}
                            className="bg-blue-500 text-white px-4 py-1.5 rounded text-sm hover:bg-blue-600"
                        >
                            Buy Now
                        </Link>
                    )}
                    {user && listing.sellerId === user.id && (
                        <span className="text-xs text-gray-400 italic">Your listing</span>
                    )}
                    {listing.sold && user && listing.sellerId !== user.id && (
                        <span className="text-xs text-gray-400 italic">Unavailable</span>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Listings;



   