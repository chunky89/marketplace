import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";   

const CreateListing = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [error, setError] = React.useState("");
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        category: "",
        price: "",
        city: user?.city || "",
        photo: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files && e.target.files[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            setError("");
            setFormData((prev) => ({
                ...prev,
                photo: reader.result,
            }));
        };
        reader.readAsDataURL(file);
    };

    React.useEffect(() => {
        if (user?.city) {
            setFormData(prev => ({
                ...prev,
                city: prev.city || user.city
            }));
        }
    }, [user]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!formData.title || !formData.description || !formData.category || !formData.price || !formData.city) {
            setError("Please fill in all required fields.");
            return;
        }
        setError("");
        
        //Create new Listing
        const listing = JSON.parse(localStorage.getItem("listings")) || [];
        const newListing = {
            id: Date.now(),
            ...formData,
            price: Number(formData.price),
            sellerId: user.id,
            sellerName: user.name,
            sellerCity: user?.city || formData.city,
            sold: false,
            createdAt: new Date().toISOString(),
        };

        listing.push(newListing);
        localStorage.setItem("listings", JSON.stringify(listing));

        navigate("/listings");
        };

        return (
            <div className="max-w-md mx-auto mt-8">
                <h1 className="text-2xl font-bold mb-4">Create New Listing</h1>

            {error && (
                <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">
                    {error}
                </div>
            )}
                <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Title</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter a title"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter a description"
                            required
                            />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="electronics">Electronics</option>
                            <option value="furniture">Furniture</option>
                            <option value="clothing">Clothing</option>
                            <option value="books">Books</option>
                            <option value="other">Other</option>
                        </select>
                        </div>


                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Price</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            min="0"
                            step="0.01"
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter start price"
                            required
                        />
                    </div>

                    <div className="mb-4">  
                        <label className="block text-gray-700 mb-2">City</label>
                        <input
                            type="text"
                            id="city"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter a city"
                            required
                        />
                    </div>

                    <div className="mb-4">
                        <label className="block text-gray-700 mb-2">Upload Photo</label>
                        <input
                            type="file"
                            id="photo"
                            name="photo"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {formData.photo && (
                            <div className="mt-4">
                                <img
                                    src={formData.photo}
                                    alt="Listing preview"
                                    className="w-full h-48 object-cover rounded"
                                />
                            </div>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        Create Listing
                    </button>
                </form> 
            </div>
        );
    };

export default CreateListing;
