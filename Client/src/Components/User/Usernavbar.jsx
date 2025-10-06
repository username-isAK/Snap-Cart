import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/slices/userSlice";

const Usernavbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <nav className="navbar bg-body-tertiary">
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
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                <i className="bi bi-box-arrow-left"></i> Logout
            </button>
        </div>
        </nav>
    </div>
  )
}

export default Usernavbar;
