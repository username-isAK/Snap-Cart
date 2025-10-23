import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchCart } from "../../redux/slices/cartSlice";
import { toast } from "react-toastify";

export default function CartButton() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const cartItems = useSelector((state) => state.cart.items || []);

  useEffect(() => {
    if (token) dispatch(fetchCart());
  }, [dispatch, token]);

  if (!cartItems.length) return null;

  const count = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleCartClick = () => {
    if (!cartItems.length) {
      toast.info("Your cart is empty");
      return;
    }
    navigate("/client/checkout");
  };

  return (
    <button
      type="button"
      onClick={handleCartClick}
      className="btn position-fixed text-light"
      style={{
        backgroundColor: "rgba(250, 126, 10, 1)",
        zIndex: 1050,
        bottom: 20,
        right: 20,
        borderRadius: "999px",
        padding: "10px 16px",
        boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
      }}
      title="Go to checkout"
    >
      <i className="bi bi-cart4"></i> Cart ({count})
    </button>
  );
}
