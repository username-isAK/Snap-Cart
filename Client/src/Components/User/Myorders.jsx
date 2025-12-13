import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyOrders } from "../../redux/slices/orderSlice";

const Myorders = () => {
  const dispatch = useDispatch();
  const { myOrders, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchMyOrders());
  }, [dispatch]);

  if (loading) return <p className="text-center mt-4">Loading orders...</p>;
  if (error) return <p className="text-danger text-center">{error}</p>;
  console.log(myOrders);
  return (
    <div className="container mt-4">
      <h4 className="mb-3">My Orders</h4>
      {myOrders.length === 0 ? (
        <p>No orders found.</p>
      ) : (
        myOrders.map((order) => (
        
          <div key={order._id} className="card mb-3 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <div>
                <strong>Order ID:</strong>{" "}
                <span className="text-muted">{order._id}</span>
              </div>
              <span
                className={`badge ${
                  order.status === "Delivered"
                    ? "bg-success"
                    : order.status === "Cancelled"
                    ? "bg-danger"
                    : "bg-warning text-dark"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="card-body">
              <div className="mb-3 d-flex flex-row gap-3">
                <strong>Products:</strong>
                {order.products.map((item, idx) => (
                  <div key={idx} className="small border-bottom py-2">
                    <div><strong>{item.product?.name || "Unknown Product"}</strong></div>
                    <div>Qty: {item.quantity}</div>
                    <div>Price: ₹{item.price}</div>
                    {item.selectedSize && (
                      <div>Size: {item.selectedSize.size}</div>
                    )}
                    {item.selectedColor && (
                      <div>Color: {item.selectedColor.color}</div>
                    )}
                  </div>
                ))}
              </div>

              <div className="mb-3">
                <strong>Delivery Address:</strong>
                <div className="small">
                  <div>{order.address.fullName}</div>
                  <div>{order.address.phone}</div>
                  <div>
                    {order.address.houseno}, {order.address.street}
                  </div>
                  <div>
                    {order.address.city}, {order.address.state} -{" "}
                    {order.address.postalCode}
                  </div>
                  <div>{order.address.country}</div>
                </div>
              </div>

              <div className="d-flex justify-content-between">
                <div>
                  <strong>Payment:</strong> {order.paymentMethod}
                </div>
                <div>
                  <strong>Total:</strong> ₹{order.totalPrice}
                </div>
              </div>
            </div>

            <div className="card-footer text-muted small">
              Ordered on: {new Date(order.createdAt).toLocaleString()}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default Myorders;
