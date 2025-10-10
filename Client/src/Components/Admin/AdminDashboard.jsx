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
      <h1 className="mb-4 p-2 rounded-4" style={{backgroundColor:"rgba(255,255,255,0.7)",display:"inline-block"}}>Admin Dashboard</h1>
      <div className="col">
        <div className="mb-5">
          <AddCategoryForm token={token} />
        </div>
        <div>
          <AddProductForm token={token} />
        </div>
      </div>
    </div>
    </>
  );
}
