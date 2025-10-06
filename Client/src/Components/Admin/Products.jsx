import { fetchProducts, deleteProduct, updateProduct } from "../../redux/slices/productSlice";
import { fetchCategories } from "../../redux/slices/categorySlice";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import Confirm from "./Confirm";

const Products = () => {
  const { token } = useSelector((state) => state.user);
  const { list: products = [] } = useSelector((state) => state.products);
  const { list: categories = [] } = useSelector((state) => state.categories);
  const dispatch = useDispatch();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [showBulkConfirm, setShowBulkConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    images: [],
    category: "",
  });

  const refOpen = useRef(null);
  const refClose = useRef(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);


  const handleEdit = (prod) => {
    setCurrentProduct(prod);
    setFormData({
      name: prod.name,
      description: prod.description,
      price: prod.price,
      stock: prod.stock,
      category: prod.category?._id || "",
      images: prod.images || [],
    });
    refOpen.current.click();
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = () => {
    const fd = new FormData();
    fd.append("name", formData.name);
    fd.append("description", formData.description);
    fd.append("price", formData.price);
    fd.append("stock", formData.stock);
    fd.append("category", formData.category);

    const oldImages = formData.images.filter(img => typeof img === "string");
    fd.append("oldImages", JSON.stringify(oldImages));

    formData.images.forEach(img => {
      if (img instanceof File) fd.append("images", img);
    });

    dispatch(updateProduct({ id: currentProduct._id, productData: fd, token }));
    refClose.current.click();
  };
  
  const getImageSrc = (img) => {
    if (img instanceof File) return URL.createObjectURL(img);
    if (typeof img === "string") return `http://localhost:5000/${img.replace(/\\/g, "/")}`;
    if (typeof img === "object" && img.url) return `http://localhost:5000/${img.url.replace(/\\/g, "/")}`;
    return "";
  };

  const filteredProducts = products.filter((prod) => {
    const matchesSearch = prod.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory ? prod.category?._id === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });


  return (
    <div>
      <h4 className="mt-4 mb-4 rounded-4 p-2" style={{backgroundColor:"rgba(255,255,255,0.7)",display:"inline-block"}}>All Products</h4>
      <div className="d-flex mb-3 gap-2"><i class="bi bi-search py-2"></i>
        <input
          type="text"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-control rounded-3 shadow-sm"
          style={{ width: "clamp(100px, 20vw, 250px)",fontSize: "clamp(0.8rem, 2vw, 1rem)" }}/>
        <i class="bi bi-funnel py-2 ms-2"></i>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="form-control rounded-3 shadow-sm"
          style={{width: "clamp(110px, 10vw, 170px)",fontSize: "clamp(0.8rem, 2vw, 1rem)" }}>
          <option value="">All Categories</option>
          {categories.slice().sort((a, b) => a.name.localeCompare(b.name))
            .map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
        </select>
        {selectedProducts.length > 0 && (
          <button
            className="btn btn-danger ms-2 shadow-sm"
            onClick={() => {setShowBulkConfirm(true)}}
            style={{fontSize: "clamp(0.8rem, 2vw, 1rem)"}}>
            <i className="bi bi-trash me-1"></i> Delete Selected
          </button>
        )}
      </div>

      <ul className="list-group">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((prod) => (
            <div className="d-flex flex-row">
              <input
                type="checkbox"
                checked={selectedProducts.includes(prod._id)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSelectedProducts(prev => [...prev, prod._id]);
                  } else {
                    setSelectedProducts(prev => prev.filter(id => id !== prod._id));
                  }
                }}
                className="form-check-input me-2 shadow-sm"
              />
            <li
              className="list-group-item d-flex justify-content-between align-items-center fw-bold rounded-3 mb-2 shadow-sm"
              style={{backgroundColor: "rgb(255, 251, 249)",width:"95%"}}
              key={prod._id}>
              <div>
                {prod.name}{" "}
                <div
                  className={
                    prod.stock < 3
                      ? "fw-normal mt-2 text-danger"
                      : "fw-normal mt-2 text-secondary"
                  }>
                  Currently in stock: {prod.stock}
                </div>
              </div>
              <div>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => handleEdit(prod)}>
                  <i className="bi bi-pencil-square"></i>
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => {
                    setDeleteId(prod._id);
                    setShowConfirm(true);
                  }}>
                  <i className="bi bi-trash"></i>
                </button>
              </div>
            </li></div>
          ))
        ) : (
          <p>No products found</p>
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
                  <option value="" disabled>Select Category</option>
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
                  <label className="form-label">Images</label>
                  <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => {
                    const files = Array.from(e.target.files);
                    setFormData(prev => ({
                      ...prev,
                      images: [...prev.images, ...files]
                    }));
                  }}
                  className="form-control"
                /></div>

                <div className="d-flex flex-wrap gap-2 mt-2">
                  {formData.images.map((img, idx) => (
                    <div key={idx} style={{ position: "relative" }}>
                      <img src={getImageSrc(img)} alt="preview" width={70} height={70} />
                      <button
                        type="button"
                        className="btn btn-sm btn-danger"
                        style={{ position: "absolute", top: 0, right: 0, padding: "2px 5px" }}
                        onClick={() => {
                          setFormData(prev => ({
                            ...prev,
                            images: prev.images.filter((_, i) => i !== idx)
                          }));
                        }}> × </button>
                    </div>
                  ))}
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
                <i className="bi bi-save2 me-1"></i>Save
              </button>
            </div>
          </div>
        </div>
      </div>
      {showConfirm && <Confirm show={showConfirm}
                                onClose={() => setShowConfirm(false)}
                                onConfirm={() => {
                                dispatch(deleteProduct({ id: deleteId, token }));
                                setShowConfirm(false);}}
                                message="Are you sure you want to delete this product?"/>}
      {showBulkConfirm && (<Confirm
            show={showBulkConfirm}
            onClose={() => setShowBulkConfirm(false)}
            onConfirm={() => {
              selectedProducts.forEach(id => {
                dispatch(deleteProduct({ id, token }));
              });
              setSelectedProducts([]);
              setShowBulkConfirm(false);
            }}
            message={`Are you sure you want to delete ${selectedProducts.length} products?`}
          />
        )}
  </div>);     
};

export default Products;
