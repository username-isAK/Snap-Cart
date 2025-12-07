import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCart,
  updateCartItem as updateCartItemThunk,
  removeCartItem as removeCartItemThunk,
  addToCart as addToCartThunk
} from "../../redux/slices/cartSlice";
import { createOrder as createOrderThunk } from "../../redux/slices/orderSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export default function Checkoutpage({ buyNowProduct }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const cart = useSelector((state) => state.cart.items || []);
  const { list: addresses } = useSelector((state) => state.addresses);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0] || null;

  const [localCart, setLocalCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState("COD");

  useEffect(() => {
    if (!token) return;

    const initCart = async () => {
      if (buyNowProduct) {
        try {
          await dispatch(
            addToCartThunk({
              productId: buyNowProduct._id,
              quantity: 1,
              selectedSize: buyNowProduct.selectedSize || null,
              selectedColor: buyNowProduct.selectedColor || null,
            })
          ).unwrap();
        } catch {
          toast.error("Failed to add product to cart");
        }
      }
      dispatch(fetchCart());
    };
    initCart();
  }, [dispatch, token, buyNowProduct]);

  useEffect(() => {
    if (cart.length) setLocalCart(cart);
  }, [cart]);

  const changeQty = async (productId, newQty) => {
    if (newQty < 1) return;
    const totalQty = cart.reduce((sum, item) => sum + item.quantity, 0);

    if (totalQty >= 20) {
      toast.error("Cart limit reached! You can add a maximum of 20 total items.");
      return;
    }
    try {
      await dispatch(updateCartItemThunk({ productId, quantity: newQty, token })).unwrap();
      setLocalCart((prev) =>
        prev.map((it) =>
          (it.product._id || it.product) === productId
            ? { ...it, quantity: newQty }
            : it
        )
      );
    } catch {
      toast.error(`Only ${newQty-1} items in stock`);
    }
  };

  const removeItem = async (item) => {
    const productId = item.product._id || item.product;
    try {
      await dispatch(removeCartItemThunk({ productId, token })).unwrap();
      setLocalCart((prev) => prev.filter((it) => (it.product._id || it.product) !== productId));
    } catch {
      toast.error("Failed to remove item");
    }
  };

  const totalPrice = localCart.reduce((sum, it) => {
    const price = it.selectedSize?.price ?? it.product?.price ?? 0;
    return sum + price * it.quantity;
  }, 0);

  const getImageSrc = (img) => {
    if (!img || typeof img !== "string") return "https://via.placeholder.com/200";
    const normalized = img.replace(/\\/g, "/");
    if (normalized.startsWith("http")) return normalized;
    const path = normalized.startsWith("uploads/") ? normalized : `uploads/${normalized}`;
    return `http://localhost:5000/${path}`;
  };

  const placeOrder = async () => {
    if (!defaultAddress) return toast.error("No address selected. Please set a default address.");
    if (!localCart.length) return toast.error("Cart is empty");

    const products = localCart.map((it) => {
      const productId = it.product?._id || it.product;
      return {
        product: productId,
        quantity: it.quantity,
        selectedSize: it.selectedSize || null,
        selectedColor: it.selectedColor || null,
        price: it.price || it.product.price,
      };
    });

    const orderData = {
      products,
      totalPrice,
      address: defaultAddress,
      paymentMethod,
    };

    try {
      await dispatch(createOrderThunk(orderData)).unwrap();
      toast.success("Order placed successfully!");
      navigate("/orders");
    } catch {
      toast.error("Failed to place order");
    }
  };

  if (!token) {
    return <div className="p-5 text-center">Please login to checkout.</div>;
  }

  return (
    <div className="container py-5">
      <h3 className="mb-4">Checkout</h3>
      <div className="row">
        <div className="col-md-8">
          {localCart.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            localCart.map((it) => {
              const prod = typeof it.product === "string"
                ? { _id: it.product, name: "Unknown Product", price: 0, images: [] }
                : it.product;
              const price = it.selectedSize?.price ?? prod.price ?? 0;
              const img = it.selectedColor?.images?.[0] ?? prod.images?.[0] ?? "";

              return (
                <div className="card mb-3 p-3" key={prod._id}>
                  <div className="d-flex align-items-center">
                    <img
                      src={getImageSrc(img)}
                      alt={prod.name}
                      style={{ width: 80, height: 80, objectFit: "contain" }}
                    />
                    <div className="ms-3 flex-grow-1">
                      <h6>{prod.name}</h6>
                      <p className="text-success fw-bold">₹{price}</p>
                      <div className="d-flex align-items-center gap-2">
                        <div className="btn-group" role="group" aria-label="Basic example">
                        <button
                          className="btn btn-outline-secondary btn-sm text-black"
                          onClick={() => changeQty(prod._id, it.quantity - 1)}
                        >
                          -
                        </button>
                        <button className="btn btn-outline-secondary disabled text-black fw-bold">{it.quantity}</button>
                        <button
                          className="btn btn-outline-secondary btn-sm text-black"
                          onClick={() => changeQty(prod._id, it.quantity + 1)}
                        >
                          +
                        </button>
                        </div>
                        <button
                          className="btn btn-danger text-light ms-auto"
                          onClick={() => removeItem(it)}
                        >
                          Remove
                        </button>
                      </div>
                      {it.selectedSize && <p className="mb-0 mt-2"><strong>Size</strong>: {it.selectedSize.size}</p>}
                      {it.selectedColor && <p className="mb-0 mt-2"><strong>Color</strong>: {it.selectedColor.color}</p>}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        <div className="col-md-4">
          <div className="card p-3">
            <h5>Shipping Address</h5>
            {defaultAddress ? (
              <p>
                {defaultAddress.houseno}, {defaultAddress.street}, {defaultAddress.city}, {defaultAddress.state}, {defaultAddress.postalCode}, {defaultAddress.country}
              </p>
            ) : (
              <p>No address selected</p>
            )}

            <h5 className="mt-3">Payment Method</h5>
            <select
              className="form-select"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="COD">Cash on Delivery</option>
              <option value="Online">Online Payment</option>
            </select>

            <hr />
            <h5>Total: ₹{totalPrice}</h5>
            <button className="btn btn-success w-100 mt-3" onClick={placeOrder}>
              Place Order
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
