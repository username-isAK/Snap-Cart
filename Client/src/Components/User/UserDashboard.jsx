import { useDispatch } from "react-redux";
import { useNavigate, NavLink } from "react-router-dom";
import { logout } from "../../redux/slices/userSlice";

const UserDashboard = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };
  return (
    <div>
      <p>This is user dashboard</p>
      <button
                onClick={handleLogout}
                className="btn btn-danger"
                style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
                <i className="bi bi-box-arrow-left"></i> Logout
              </button>
    </div>
  )
}

export default UserDashboard
