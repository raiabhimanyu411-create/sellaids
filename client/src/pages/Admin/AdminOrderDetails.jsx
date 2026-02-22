import React, { useEffect, useState } from "react";
import axios from "axios";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";

const AdminOrderDetails = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { orderId } = useParams();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/admin/management/order/${orderId}`,
          { withCredentials: true }
        );
        const { success, data } = res.data;
        console.log(data);
        if (success && data) {
          setOrder(data);
        } else {
          toast.error("Order not found");
        }
      } catch (error) {
        toast.error("Failed to fetch order details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin text-4xl text-blue-500" />
      </div>
    );

  if (!order)
    return (
      <div className="flex justify-center items-center h-screen text-red-500 font-semibold">
        Order not found
      </div>
    );

  const productConditionMap = {
    new: "New",
    good: "Good",
    almost_new: "Almost New",
    hardly_ever_used: "Hardly Ever Used",
    satisfactory: "Satisfactory",
  };

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      {/* Order Info */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Order Details</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Order ID:</span>{" "}
            {order?.order_id || "-"}
          </div>
          <div>
            <span className="font-semibold">Order Date:</span>{" "}
            {order?.order_date
              ? new Date(order.order_date).toLocaleString()
              : "-"}
          </div>
          <div>
            <span className="font-semibold">Order Status:</span>{" "}
            <span
              className={`font-bold ${
                order?.order_status === "pending"
                  ? "text-yellow-500"
                  : order?.order_status
                  ? "text-green-500"
                  : ""
              }`}
            >
              {order?.order_status || "-"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Payment Status:</span>{" "}
            <span
              className={`font-bold ${
                order?.payment_status === "unpaid"
                  ? "text-red-500"
                  : order?.payment_status
                  ? "text-green-500"
                  : ""
              }`}
            >
              {order?.payment_status || "-"}
            </span>
          </div>
          <div>
            <span className="font-semibold">Payment Method:</span>{" "}
            {order?.payment_method || "-"}
          </div>
          <div>
            <span className="font-semibold">Transaction ID:</span>{" "}
            {order?.transaction_id || "-"}
          </div>
          <div>
            <span className="font-semibold">Total Amount:</span> ₹{" "}
            {order?.product?.selling_price}
          </div>
          <div>
            <span className="font-semibold">Quantity:</span>{" "}
            {order?.quantity || "-"}
          </div>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Customer Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {order?.customer?.name || "-"}
          </div>
          <div>
            <span className="font-semibold">Email:</span>{" "}
            {order?.customer?.email || "-"}
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            {order?.customer?.phone || "-"}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Address:</span>{" "}
            {order?.customer?.address || "-"}
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Product Info</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
          <img
            src={`${import.meta.env.VITE_API_URL}/${order.product.image}`}
            alt={order.product.model_name}
            className="w-full h-64 object-cover rounded"
          />
          <div className="space-y-2">
            <div>
              <span className="font-semibold">Brand:</span>{" "}
              {order?.product?.brand || "-"}
            </div>
            <div>
              <span className="font-semibold">Model:</span>{" "}
              {order?.product?.model_name || "-"}
            </div>
            <div>
              <span className="font-semibold">Condition:</span>{" "}
              {productConditionMap[order?.product?.condition]}
            </div>
            <div>
              <span className="font-semibold">Size:</span>{" "}
              {order?.product?.size || "-"}
            </div>
            <div>
              <span className="font-semibold">Color:</span>{" "}
              {order?.product?.color || "-"}
            </div>
            <div>
              <span className="font-semibold">Selling Price:</span> ₹
              {order?.product?.selling_price || "-"}
            </div>
            <div>
              <span className="font-semibold">Group:</span>{" "}
              {order?.product?.group || "-"}
            </div>
            <div>
              <span className="font-semibold">Type:</span>{" "}
              {order?.product?.type || "-"}
            </div>
          </div>
        </div>
      </div>

      {/* Vendor Info */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-bold mb-4">Vendor Info</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            {order?.vendor?.name || "-"}
          </div>
          <div>
            <span className="font-semibold">Business Name:</span>{" "}
            {order?.vendor?.business_name || "-"}
          </div>
          <div>
            <span className="font-semibold">Business Type:</span>{" "}
            {order?.vendor?.business_type || "-"}
          </div>
          <div>
            <span className="font-semibold">Phone:</span>{" "}
            {order?.vendor?.phone || "-"}
          </div>
          <div className="col-span-2">
            <span className="font-semibold">Email:</span>{" "}
            {order?.vendor?.email || "-"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetails;