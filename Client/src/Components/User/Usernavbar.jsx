import { useEffect,useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout, fetchUserProfile } from "../../redux/slices/userSlice";
import { fetchProducts } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { setSearch, setCategory } from "../../redux/slices/filterSlice";
import { fetchAddresses } from "../../redux/slices/addressSlice";

const Usernavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { list: addresses } = useSelector((state) => state.addresses);
  const defaultAddress = addresses.find((a) => a.isDefault) || addresses[0];
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { search, category } = useSelector((state) => state.filters);
  const categories = useSelector((state) => state.categories.list || []);
  const cartItems = useSelector((state) => state.cart.items || []);
  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);
  const user = useSelector((state) => state.user.userInfo);

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(fetchAddresses());
    if (!user) dispatch(fetchUserProfile());
  }, [dispatch, user]);

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
    <>
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
          <img
              src="/default-profile.jpg"
              alt="Profile"
              title="View Profile"
              onClick={() => setShowProfileModal(true)}
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                cursor: "pointer",
              }}
            />
        </div>
      </div>
    </nav>
    {showProfileModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setShowProfileModal(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content p-3">
              <div className="modal-header">
                <h5 className="modal-title">My Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProfileModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {user ? (
                  <div>
                    <p>
                      <strong>Name:</strong> {user.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>
                    <p>
                      <strong>Mobile:</strong> {defaultAddress ? defaultAddress.phone : "N/A"}
                    </p>
                    {addresses.length === 0 ? (
                      <p>No address added</p>
                    ) : (
                      addresses.map((addr) => (
                        <div
                          key={addr._id}
                          className={`border rounded p-2 mb-2 ${
                            addr.isDefault ? "border-success bg-light" : ""
                          }`}
                        >
                          <div className="d-flex justify-content-between align-items-center">
                            <strong>{addr.fullName}</strong>
                            {addr.isDefault && (
                              <span className="badge bg-success">Default</span>
                            )}
                          </div>

                          <div className="small">
                            <div>{addr.phone}</div>
                            <div>{addr.houseno}, {addr.street}</div>
                            <div>
                              {addr.city}, {addr.state} - {addr.postalCode}
                            </div>
                            <div>{addr.country}</div>
                            <div className="text-muted">{addr.tag}</div>
                          </div>
                        </div>
                      ))
                    )}
                    <button className="btn btn-link" onClick={()=>{navigate("orders"); setShowProfileModal(false)}}>View your orders</button>
                  </div>
                ) : (
                  <p>Loading...</p>
                )}
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-danger"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      </>
  );
};

export default Usernavbar;
