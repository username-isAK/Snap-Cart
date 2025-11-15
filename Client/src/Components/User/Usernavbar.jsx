import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/userSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { setSearch, setCategory } from "../../redux/slices/filterSlice";
import { fetchAddresses } from "../../redux/slices/addressSlice";

const Usernavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: addresses } = useSelector((state) => state.addresses);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];

  const { search, category } = useSelector((state) => state.filters);
  const categories = useSelector((state) => state.categories.list || []);
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAddresses());
  }, [dispatch]);

  const handleSearch = () => {
    dispatch(fetchProducts({
      search: search.trim(),
      category: category || "",
      page: 1,
      limit: 12
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-light px-3 shadow-sm pt-2 pb-2"
      style={{ backgroundColor: "rgba(243, 252, 255, 0.8)" }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src="/SC_logo.png"
            alt="Logo"
            className="img-fluid me-3"
            style={{
              maxWidth: "150px",
              minWidth: "95px",
              width: "9vw",
              height: "auto",
              objectFit: "contain",
              backgroundColor: "white",
            }}
          />

          <div className="d-flex align-items-center" style={{ fontSize: "clamp(0.7rem, 1vw, 1rem)" }}>
            <i className="bi bi-geo-alt-fill text-danger fs-5 me-1"></i>
            <div className="d-flex flex-column lh-1">
              <div className="d-flex align-items-center">
                <small className="text-muted me-1">Deliver to:</small>
                <button
                  onClick={() => navigate("/addresses")}
                  className="btn btn-link p-0 small"
                >
                  <i className="bi bi-pencil-square me-1"></i>Edit
                </button>
              </div>
              <span className="fw-semibold">
                {defaultAddress
                  ? `${defaultAddress.city} - ${defaultAddress.postalCode}`
                  : "No address selected"}
              </span>
            </div>
          </div>
        </div>

        <div className="d-flex align-items-center mx-auto">
          <input
            type="text"
            className="form-control"
            placeholder="Search products..."
            value={search}
            onChange={(e) => dispatch(setSearch(e.target.value))}
            style={{ width:"clamp(10rem, 30vw, 30rem)",fontSize:"clamp(0.8rem, 1vw, 1rem)" }}
          />
          <select
            className="form-select"
            value={category}
            onChange={(e) => dispatch(setCategory(e.target.value))}
            style={{ width:"clamp(8rem, 10vw, 20rem)",fontSize:"clamp(0.8rem, 1vw, 1rem)" }}
          >
            <option value="">All Categories</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <button className="btn btn-primary" onClick={handleSearch}>
            <i className="bi bi-search"></i>
          </button>
        </div>

        <div className="d-flex align-items-center">
          <div
            className="position-relative me-4"
            style={{ cursor: "pointer" }}
            onClick={() => navigate("/client/checkout")}
            title="Go to checkout"
          >
            <i className="bi bi-cart4 fs-4 text-dark"></i>
            {cartCount > 0 && (
              <span
                className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                style={{ fontSize: "0.7rem" }}
              >
                {cartCount}
              </span>
            )}
          </div>

          <button
            onClick={handleLogout}
            className="btn btn-danger"
            style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}
          >
            <i className="bi bi-box-arrow-left"></i> Logout
          </button>
        </div>

      </div>
    </nav>
  );
};

export default Usernavbar;
