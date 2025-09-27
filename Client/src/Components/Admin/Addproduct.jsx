import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";

export default function AddProductForm({ token }) {
  const dispatch = useDispatch();
  const { loading: productLoading, error: productError } = useSelector(
    (state) => state.products
  );
  const { list: categories = [], loading: catLoading, error: catError } =
    useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    images: [],
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", formData.name);
  data.append("description", formData.description);
  data.append("price", formData.price);
  data.append("category", formData.category);
  data.append("stock", formData.stock);

  formData.images.forEach((file) => {
    data.append("images", file);
  });

  dispatch(addProduct({ productData: data, token }));

  setFormData({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: 0,
    images: [],
  });
};

  if (catLoading) return <p className="text-center">Loading categories...</p>;

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <h2 className="h5 mb-3">Add Product</h2>

      <input
        type="text"
        name="name"
        placeholder="Product Name"
        value={formData.name}
        onChange={handleChange}
        required
        className="form-control mb-2"/>

      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
        required
        className="form-control mb-2"/>

      <input
        type="number"
        name="price"
        placeholder="Price"
        value={formData.price}
        onChange={handleChange}
        required
        min="0"
        className="form-control mb-2"/>

      <select
        name="category"
        value={formData.category}
        onChange={handleChange}
        required
        className="form-select mb-2">
        <option value="">Select Category</option>
        {Array.isArray(categories) && categories.length > 0 ? (
          categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))
        ) : (
          <option disabled>No categories available</option>
        )}
      </select>

      <input
        type="number"
        name="stock"
        placeholder="Stock Quantity"
        value={formData.stock}
        onChange={handleChange}
        min="0"
        className="form-control mb-2"/>

      <input
        type="file"
        name="images"
        multiple
        accept="image/*"
        onChange={(e) => {
          const files = Array.from(e.target.files);
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, ...files],
          }));
        }}
        className="form-control mb-2"/>
      <div className="d-flex flex-wrap gap-2">
      {formData.images.map((file, idx) => (
          <div key={idx} style={{ position: "relative", display: "inline-block", marginRight: "10px" }}>
            <img
              src={URL.createObjectURL(file)}
              alt="preview"
              width={70}
              height={70}/>
            <button
              type="button"
              className="btn btn-sm btn-danger"
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                padding: "2px 5px",
              }}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  images: prev.images.filter((_, i) => i !== idx),
                }))
              }> × </button>
          </div>
        ))}</div>

      <button
        type="submit"
        disabled={productLoading}
        className="btn btn-primary w-100 rounded-4">
        {productLoading ? "Adding..." : "Add Product"}
      </button>

      {productError && <p className="text-danger mt-2">{productError}</p>}
      {catError && <p className="text-danger mt-2">{catError}</p>}
    </form>
  );
}
