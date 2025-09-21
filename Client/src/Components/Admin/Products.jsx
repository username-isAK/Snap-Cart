import { fetchProducts, deleteProduct, updateProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";

const Products = () => {
  const { token } = useSelector((state) => state.user);
  const { list: products = [] } = useSelector((state) => state.products);
  const { list: categories = [] } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: "",
    category: "",
  });

  const refOpen = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleDelete = (id) => {
    dispatch(deleteProduct({ id, token }));
  };

  const handleEdit = (prod) => {
    setCurrentProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      image: prod.image,
      category: prod.category?._id || "",
    });
    refOpen.current.click();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    dispatch(updateProduct({ id: currentProduct._id, productData: formData, token }));
    refClose.current.click();
  };

  return (
    <div>
      <h5 className="mt-5 mb-4">All Products</h5>
      <ul className="list-group">
        {Array.isArray(products) && products.length > 0 ? (
          products.map((prod) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={prod._id}>
              {prod.name}
              <div>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => handleEdit(prod)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(prod._id)}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li>
          ))
        ) : (
          <p>No products available</p>
        )}
      </ul>

      <button
        type="button"
        ref={refOpen}
        className="btn btn-primary d-none"
        data-bs-toggle="modal"
        data-bs-target="#updateModal">
        Launch Modal
      </button>

      <div
        className="modal fade"
        id="updateModal"
        tabIndex="-1"
        aria-labelledby="updateModalLabel"
        aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="updateModalLabel">
                Update Product
              </h5>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
                ref={refClose}></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="form-control"/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    className="form-control"></textarea>
                </div>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="form-control">
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
                <div className="mb-3">
                  <label className="form-label">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={formData.price}
                    onChange={handleChange}
                    className="form-control"/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Stock</label>
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    className="form-control"/>
                </div>
                <div className="mb-3">
                  <label className="form-label">Image URL</label>
                  <input
                    type="text"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    className="form-control"/>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal">
                Close
              </button>
              <button type="button" className="btn btn-success" onClick={handleUpdate}>
                <i class="bi bi-save2 me-1"></i>Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Products;
