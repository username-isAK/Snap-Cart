import React,{ useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllOrders, updateOrderStatus } from "../../redux/slices/orderSlice";

const Orders = () => {
  const dispatch = useDispatch();
  const { allOrders, loading, error } = useSelector((state) => state.orders);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllOrders());
  }, [dispatch]);

  const handleStatusChange = (id, e) => {
    const newStatus = e.target.value;
    dispatch(updateOrderStatus({ id, status: newStatus }));
  };

  const toggleProducts = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  if (loading) return <p className="p-4">Loading orders...</p>;
  if (error) return <p className="p-4 text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h4
        className="mt-4 mb-4 rounded-4 p-2"
        style={{
          backgroundColor: "rgba(255,255,255,0.7)",
          display: "inline-block",
        }}> All Orders </h4>

      {allOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        <table
          className="min-w-full border border-gray-300 text-sm rounded-3 shadow-sm"
          style={{ backgroundColor: "rgb(255, 251, 249)", width: "95%" }}>
          <thead className="bg-gray-100">
            <tr>
              <th className="border p-2 text-center">Order ID</th>
              <th className="border p-2 text-center">User</th>
              <th className="border p-2 text-center">Total</th>
              <th className="border p-2 text-center">Payment</th>
              <th className="border p-2 text-center">Status</th>
              <th className="border p-2 text-center">Products</th>
              <th className="border p-2 text-center">Date</th>
            </tr>
          </thead>
          <tbody>
            {allOrders.map((order) => (
              <React.Fragment key={order._id}>
                <tr className="text-center">
                  <td className="border p-2">{order._id}</td>
                  <td className="border p-2">{order.user?.name || "N/A"}</td>
                  <td className="border p-2">₹{order.totalPrice}</td>
                  <td className="border p-2">{order.paymentMethod}</td>
                  <td className="border p-2">
                    <select
                      value={order.status}
                      onChange={(e) => handleStatusChange(order._id, e)}
                      className="border rounded px-2 py-1">
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="border p-2">
                    <button
                      onClick={() => toggleProducts(order._id)}
                      className="text-blue-600 hover:underline">
                      {expandedOrderId === order._id
                        ? "Hide Products"
                        : "View Products"}
                    </button>
                  </td>

                  <td className="border p-2">
                    {new Date(order.createdAt).toLocaleString()}
                  </td>
                </tr>

                {expandedOrderId === order._id && (
                  <tr>
                    <td colSpan="7" className="p-2 bg-gray-50">
                      <div className="border rounded-md p-3 text-left">
                        {order.products.map((p, idx) => (
                          <div
                            key={idx}
                            className="flex justify-between items-center border-b py-2">
                            <div>
                              <strong>{p.product?.name}</strong> × {p.quantity}
                              <div className="text-sm text-gray-600">
                                {p.selectedSize?.size && (
                                  <span>Size: {p.selectedSize.size}</span>
                                )}
                                {p.selectedColor?.color && (
                                  <span className="ml-3">
                                    Color: {p.selectedColor.color}
                                  </span>
                                )}
                              </div>
                            </div>
                            <div className="text-sm text-gray-700">
                              ₹{p.price}
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Orders;
