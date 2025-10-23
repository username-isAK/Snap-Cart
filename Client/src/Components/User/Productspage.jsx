import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts } from "../../redux/slices/productSlice";
import { Link, useNavigate } from "react-router-dom";
import { addToCart } from "../../redux/slices/cartSlice";

export default function ProductsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: products, loading, error } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const getImageSrc = (img) => {
    if (!img) return "https://via.placeholder.com/200";
    const normalized = img.replace(/\\/g, "/");
    if (normalized.startsWith("http")) return normalized;
    const path = normalized.startsWith("uploads/")
      ? normalized
      : `uploads/${normalized}`;
    return `http://localhost:5000/${path}`;
  };

  const handleAddToCart = (product) => {
    if (!product?._id) return console.error("Product ID missing", product);

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        selectedSize: null,
        selectedColor: null,
      })
    );

    const cartBtn = document.getElementById("goToCartBtn");
    if (cartBtn) {
      cartBtn.style.display = "block";
      setTimeout(() => (cartBtn.style.display = "none"), 3000);
    }
  };

  const handleBuyNow = (product) => {
    if (!product?._id) return console.error("Product ID missing", product);

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
        selectedSize: null,
        selectedColor: null,
      })
    );
    navigate("/client/checkout");
  };

  if (loading)
    return (
      <p className="text-center mt-5">
        <img src="spinner.gif" alt="Loading..." />
      </p>
    );
  if (error)
    return (
      <p className="text-center text-danger mt-5">Error: {error}</p>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4 text-center fw-bold">Our Products</h2>

      <div className="row justify-content-center g-4">
        {products.map((p) => (
          <div className="col-12 col-sm-6 col-md-4 col-lg-3" key={p._id}>
            <div className="card shadow-sm h-100 border-0">
              <Link
                to={`/product/${p._id}`}
                className="text-decoration-none text-dark"
              >
                <img
                  src={getImageSrc(p.images?.[0])}
                  className="card-img-top p-3"
                  alt={p.name}
                  style={{ height: "200px", objectFit: "contain" }}
                />
              </Link>

              <div className="card-body text-center">
                <Link
                  to={`/product/${p._id}`}
                  className="text-decoration-none text-dark"
                >
                  <h5 className="card-title">{p.name}</h5>
                </Link>

                <p className="fw-semibold fs-5 text-primary mb-3">
                  ₹{p.price}
                </p>

                <div className="d-flex gap-2">
                  <button
                    className="btn btn-outline-secondary w-50"
                    onClick={() => handleAddToCart(p)}
                  >
                    Add to Cart
                  </button>
                  <button
                    className="btn btn-success w-50"
                    onClick={() => handleBuyNow(p)}
                  >
                    Buy Now
                  </button>
                </div>
              </div>

              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <strong>Stock:</strong> {p.stock ?? "Out of stock"}
                </li>
                <li className="list-group-item">
                  {p.description.length > 70 ? (
                    <small>{p.description.slice(0, 70)}...</small>
                  ) : (
                    <small>{p.description}</small>
                  )}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
