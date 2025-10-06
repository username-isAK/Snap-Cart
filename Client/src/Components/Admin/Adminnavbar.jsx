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
    <nav className="navbar navbar-expand-lg navbar-light px-3 shadow-sm pt-2 pb-2" style={{backgroundColor: "rgba(243, 252, 255, 0.8)"}}>
      <div className="container-fluid">
        <img
            src="/SC_logo.png"
            alt="Logo"
            className="img-fluid me-4"
            style={{
              maxWidth: "150px",
              minWidth: "95px",
              width: "9vw",
              height: "auto",
              objectFit: "contain",
              backgroundColor: "white"
            }}/>
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
            <li className="nav-item my-2">
              <NavLink
                to="." end
                className={({ isActive }) =>
                  `nav-link px-3 fw-bold ${isActive ? "active-link" : ""}`
                }>
                Home
              </NavLink>
            </li>
            <li className="nav-item my-2">
              <NavLink
                to="productslist"
                className={({ isActive }) =>
                  `nav-link px-3 fw-bold ${isActive ? "active-link" : ""}`
                }>
                Products
              </NavLink>
            </li>
            <li className="nav-item my-2">
              <NavLink
                to="orderslist"
                className={({ isActive }) =>
                  `nav-link px-3 fw-bold ${isActive ? "active-link" : ""}`
                }>
                Orders
              </NavLink>
            </li>
          </ul>

          <ul className="navbar-nav">
            <li className="nav-item">
              <button
                onClick={handleLogout}
                className="btn btn-danger rounded-4 shadow-sm"
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
