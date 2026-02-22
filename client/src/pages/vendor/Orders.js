import React from 'react';

const Orders = () => {
    return (
        <div className="page-container">
            <h1 className="page-title">My Orders</h1>

            <div className="card">
                <p><strong>Order ID:</strong> #12345</p>
                <p><strong>Product:</strong> Men’s T-Shirt</p>
                <p><strong>Status:</strong> Pending</p>
                <button className="btn-primary">View Details</button>
            </div>

            <div className="card">
                <p><strong>Order ID:</strong> #12346</p>
                <p><strong>Product:</strong> Women’s Handbag</p>
                <p><strong>Status:</strong> Shipped</p>
                <button className="btn-primary">View Details</button>
            </div>
        </div>
    );
};

export default Orders;
