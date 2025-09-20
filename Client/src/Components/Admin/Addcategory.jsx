import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addCategory } from "../../redux/slices/categorySlice";

export default function AddCategoryForm({ token }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({ name: "", description: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addCategory({ categoryData: formData, token }));
    setFormData({ name: "", description: "" });
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h2 className="h5 mb-3">Add Category</h2>

      <input
        type="text"
        name="name"
        placeholder="Category Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="form-control mb-2"/>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        className="form-control mb-2"/>

      <button type="submit" disabled={loading} className="btn btn-success w-100">
        {loading ? "Adding..." : "Add Category"}
      </button>

      {error && <p className="text-danger mt-2">{error}</p>}
    </form>
  );
}
