import AddCategoryForm from "../../Components/Admin/Addcategory";
import AddProductForm from "../../Components/Admin/Addproduct";
import { useSelector} from "react-redux";

export default function AdminDashboard() {
  const { userInfo, token } = useSelector((state) => state.user);

  if (!userInfo) {
    return <p className="text-center mt-5">Loading...</p>;
  }

  if (userInfo.role !== "admin") {
    return <p className="text-danger text-center mt-5">Unauthorized</p>;
  }

  return (
    <>
    <div className="container py-4">
      <h1 className="mb-4">Admin Dashboard</h1>
      <div className="row g-4">
        <div className="col-md-6">
          <AddCategoryForm token={token} />
        </div>
        <div className="col-md-6">
          <AddProductForm token={token} />
        </div>
      </div>
    </div>
    </>
  );
}
