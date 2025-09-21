import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../redux/slices/userSlice";

const Adminnavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light px-3">
      <div className="container-fluid">
        <img
            src="/SC_logo.png"
            alt="Logo"
            className="img-fluid me-4"
            style={{ width: "clamp(100px, 150px, 250px)", height: "clamp(60px, 80px, 100px)" }}/>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <NavLink
                to="." end
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "active-link" : ""}`
                }>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="productslist"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "active-link" : ""}`
                }>
                Products
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                to="orderslist"
                className={({ isActive }) =>
                  `nav-link px-3 ${isActive ? "active-link" : ""}`
                }>
                Orders
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                <i className="bi bi-box-arrow-left"></i> Logout
              </button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Adminnavbar;
