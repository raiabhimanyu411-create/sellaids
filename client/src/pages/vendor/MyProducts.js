import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../../App.css";

const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const vendor = JSON.parse(localStorage.getItem("vendorInfo"));
    const vendorId = vendor?.id || vendor?._id;

    useEffect(() => {
        if (!vendorId) {
            navigate("/");
            return;
        }
        fetchProducts();
    }, [vendorId]);

    const fetchProducts = async () => {
        try {
            const res = await axios.get(
                `http://localhost:5000api/products?vendorId=${vendorId}`
            );
            console.log("Products API Response:", res.data);
            setProducts(res.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;

        try {
            await axios.delete(`http://localhost:5000api/products/${id}`);
            fetchProducts(); // refresh list after delete
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    return (
        <div className="myproducts-container">
            <div className="myproducts-header">
                <h2 className="myproducts-title">My Products</h2>
                <a href="/vendor/add-product" className="add-product-btn">
                    ➕ Add Product
                </a>
            </div>

            {loading ? (
                <p>Loading...</p>
            ) : products.length === 0 ? (
                <p>No products found.</p>
            ) : (
                <div className="products-grid">
                    {products.map((product) => (
                        <div key={product.id || product._id} className="product-card">
                            <img
                                src={
                                    product.front_photo
                                        ? `http://localhost:5000uploads/${product.front_photo}`
                                        : "/placeholder.jpg"
                                }
                                alt={product.name}
                                className="product-img"
                                onError={(e) => (e.target.src = "/placeholder.jpg")}
                            />

                            <h3 className="product-name">{product.name}</h3>
                            <p className="product-desc">{product.description}</p>
                            <p className="product-price">₹{product.price || 0}</p>
                            <p className="product-status">
                                <strong>Status:</strong>{" "}
                                <span>{product.status || "Pending"}</span>
                            </p>

                            <div className="product-actions">
                                <button
                                    className="edit-btn"
                                    onClick={() => navigate(`/vendor/edit-product/${product.id}`)}
                                >
                                    ✏️ Edit
                                </button>
                                <button
                                    className="delete-btn"
                                    onClick={() => handleDelete(product.id)}
                                >
                                    🗑️ Delete
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyProducts;
