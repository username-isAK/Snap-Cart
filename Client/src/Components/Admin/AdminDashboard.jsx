import AddCategoryForm from "../../Components/Admin/Addcategory";
import AddProductForm from "../../Components/Admin/Addproduct";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../../redux/slices/userSlice";
import { useNavigate } from "react-router-dom";

export default function AdminDashboard() {
  const { userInfo, token } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!userInfo) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (userInfo.role !== "admin") {
    return <p className="text-danger text-center mt-5">Unauthorized</p>;
  }

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login", { replace: true });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3">Admin Dashboard</h1>
        <button onClick={handleLogout} className="btn btn-danger" style={{ fontSize: "clamp(0.8rem, 2vw, 1rem)"}}>
          <i class="bi bi-box-arrow-left"></i>
          Logout
        </button>
      </div>

      <div className="row g-4">
        <div className="col-md-6">
          <AddCategoryForm token={token} />
        </div>
        <div className="col-md-6">
          <AddProductForm token={token} />
        </div>
      </div>
    </div>
  );
}
